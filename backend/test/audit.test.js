const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const AuditLog = require("../models/AuditLog");
const { writeAuditLog } = require("../services/auditLogService");
const requireRole = require("../middleware/roleMiddleware");
const { listAuditLogs } = require("../controllers/adminController");

const records = [];
let originalCreate;

before(() => {
  originalCreate = AuditLog.create;
  AuditLog.create = async (record) => {
    records.push(record);
    return record;
  };
});

after(() => {
  AuditLog.create = originalCreate;
});

test("only ADMIN passes the audit-log role guard", async () => {
  records.length = 0;
  for (const role of ["PATIENT", "DOCTOR"]) {
    let statusCode;
    let responseBody;
    let nextCalled = false;
    const middleware = requireRole("ADMIN");
    middleware(
      { user: { userId: "user-1", role }, method: "GET", baseUrl: "/api/admin", path: "/audit-logs", get: () => "test-agent" },
      {
        status(code) {
          statusCode = code;
          return this;
        },
        json(body) {
          responseBody = body;
          return this;
        },
      },
      () => { nextCalled = true; }
    );
    assert.equal(statusCode, 403);
    assert.equal(responseBody.message, "Forbidden");
    assert.equal(nextCalled, false);
  }

  let nextCalled = false;
  requireRole("ADMIN")(
    { user: { userId: "admin-1", role: "ADMIN" } },
    {},
    () => { nextCalled = true; }
  );
  assert.equal(nextCalled, true);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(records.filter((record) => record.action === "security.unauthorized").length, 2);
});

test("audit event creation stores safe event and request context", async () => {
  records.length = 0;
  await writeAuditLog({
    req: {
      user: { userId: "admin-1", role: "ADMIN" },
      ip: "127.0.0.1",
      method: "POST",
      baseUrl: "/api/appointments",
      path: "/",
      get: () => "test-agent",
    },
    action: "appointment.created",
    resourceType: "APPOINTMENT",
    resourceId: "appointment-1",
  });

  assert.equal(records.length, 1);
  assert.equal(records[0].actorRole, "ADMIN");
  assert.equal(records[0].action, "appointment.created");
  assert.equal(records[0].resourceType, "APPOINTMENT");
  assert.equal(records[0].context.path, "/api/appointments/");
  assert.equal(records[0].context.userAgent, "test-agent");
  assert.equal(Object.hasOwn(records[0], "password"), false);
  assert.equal(Object.hasOwn(records[0], "token"), false);
});

test("audit-log schema discards unapproved sensitive fields", () => {
  const log = new AuditLog({
    action: "auth.login.success",
    resourceType: "AUTH",
    password: "must-not-be-stored",
    token: "must-not-be-stored",
  });
  const stored = log.toObject();
  assert.equal(stored.password, undefined);
  assert.equal(stored.token, undefined);
  assert.ok(stored.timestamp instanceof Date);
});

test("ADMIN can query filtered audit logs with pagination", async () => {
  const originalAggregate = AuditLog.aggregate;
  let queryPipeline;
  AuditLog.aggregate = async (pipeline) => {
    queryPipeline = pipeline;
    return [{ data: [{ _id: "log-1", action: "appointment.created" }], total: [{ count: 3 }] }];
  };

  try {
    let allowed = false;
    const req = {
      user: { userId: "admin-1", role: "ADMIN" },
      query: {
        page: "2",
        limit: "1",
        action: "appointment.created",
        role: "ADMIN",
        userId: "64b000000000000000000001",
        startDate: "2026-01-01",
        endDate: "2026-01-31",
        search: "admin@example.com",
      },
    };
    requireRole("ADMIN")(req, {}, () => { allowed = true; });
    assert.equal(allowed, true);

    let response;
    await listAuditLogs(req, { json: (body) => { response = body; } });
    assert.equal(queryPipeline[0].$match.action, "appointment.created");
    assert.equal(queryPipeline[0].$match.actorRole, "ADMIN");
    assert.ok(queryPipeline.some((stage) => stage.$lookup));
    assert.equal(response.pagination.page, 2);
    assert.equal(response.pagination.pages, 3);
    assert.equal(response.pagination.hasNextPage, true);
    assert.equal(response.data[0].action, "appointment.created");
  } finally {
    AuditLog.aggregate = originalAggregate;
  }
});

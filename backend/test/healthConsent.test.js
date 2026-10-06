const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const AuditLog = require("../models/AuditLog");
const HealthConsent = require("../models/HealthConsent");
const { HEALTH_CONSENT_VERSION } = require("../config/healthConsent");
const {
  getHealthConsent,
  setHealthConsent,
} = require("../controllers/healthConsentController");
const requireCurrentHealthConsent = require("../middleware/requireCurrentHealthConsent");
const requireRole = require("../middleware/roleMiddleware");

let originalFindOne;
let originalFindOneAndUpdate;
let originalExists;
let originalAuditCreate;

before(() => {
  originalFindOne = HealthConsent.findOne;
  originalFindOneAndUpdate = HealthConsent.findOneAndUpdate;
  originalExists = HealthConsent.exists;
  originalAuditCreate = AuditLog.create;
  AuditLog.create = async (record) => record;
});

after(() => {
  HealthConsent.findOne = originalFindOne;
  HealthConsent.findOneAndUpdate = originalFindOneAndUpdate;
  HealthConsent.exists = originalExists;
  AuditLog.create = originalAuditCreate;
});

test("health consent is stored with user, status, timestamp, and version", async () => {
  const updatedConsent = {
    userId: "patient-1",
    consentStatus: true,
    consentTimestamp: new Date("2026-10-04T00:00:00Z"),
    consentVersion: HEALTH_CONSENT_VERSION,
  };
  let query;
  let update;
  let options;
  HealthConsent.findOneAndUpdate = async (...args) => {
    [query, update, options] = args;
    return updatedConsent;
  };

  let response;
  await setHealthConsent(
    { user: { userId: "patient-1" }, body: { consentStatus: true } },
    { json: (body) => { response = body; } }
  );

  assert.deepEqual(query, { userId: "patient-1" });
  assert.equal(update.$set.consentStatus, true);
  assert.equal(update.$set.consentVersion, HEALTH_CONSENT_VERSION);
  assert.ok(update.$set.consentTimestamp instanceof Date);
  assert.equal(options.upsert, true);
  assert.equal(response.data.consentStatus, true);
  assert.equal(response.data.consentVersion, HEALTH_CONSENT_VERSION);
});

test("invalid health consent status is rejected", async () => {
  let statusCode;
  let response;
  const result = await setHealthConsent(
    { user: { userId: "patient-1" }, body: { consentStatus: "yes" } },
    {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) { response = body; },
    }
  );

  assert.equal(statusCode, 400);
  assert.equal(response.message, "consentStatus must be a boolean");
  assert.equal(result, undefined);
});

test("current consent lookup reports false for an outdated version", async () => {
  HealthConsent.findOne = () => ({
    lean: async () => ({
      consentStatus: true,
      consentTimestamp: new Date(),
      consentVersion: "outdated-version",
    }),
  });
  let response;
  await getHealthConsent(
    { user: { userId: "patient-1" } },
    { json: (body) => { response = body; } }
  );

  assert.equal(response.data.consentStatus, false);
  assert.equal(response.data.currentVersion, HEALTH_CONSENT_VERSION);
});

test("health-data workflows require current consent", async () => {
  let nextCalled = false;
  HealthConsent.exists = async () => null;
  let statusCode;
  let response;
  await requireCurrentHealthConsent(
    { user: { userId: "patient-1" } },
    {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) { response = body; },
    },
    () => { nextCalled = true; }
  );

  assert.equal(statusCode, 403);
  assert.match(response.message, /consent is required/i);
  assert.equal(nextCalled, false);

  HealthConsent.exists = async (query) => {
    assert.deepEqual(query, {
      userId: "patient-1",
      consentStatus: true,
      consentVersion: HEALTH_CONSENT_VERSION,
    });
    return { _id: "consent-1" };
  };
  await requireCurrentHealthConsent(
    { user: { userId: "patient-1" } },
    {},
    () => { nextCalled = true; }
  );
  assert.equal(nextCalled, true);
});

test("only patient accounts can pass the health-consent route role guard", () => {
  let patientPassed = false;
  requireRole("PATIENT")(
    { user: { userId: "patient-1", role: "PATIENT" } },
    {},
    () => { patientPassed = true; }
  );
  assert.equal(patientPassed, true);

  let statusCode;
  requireRole("PATIENT")(
    { user: { userId: "64b000000000000000000002", role: "DOCTOR" }, method: "GET", baseUrl: "/api/consent", path: "/health" },
    { status(code) { statusCode = code; return this; }, json() {} },
    () => assert.fail("DOCTOR must not pass the patient role guard")
  );
  assert.equal(statusCode, 403);
});

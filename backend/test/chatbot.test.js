const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const mongoose = require("mongoose");
const ChatConversation = require("../models/ChatConversation");
const ChatRateLimit = require("../models/ChatRateLimit");
const { replyToMessage, checkServiceHealth } = require("../controllers/chatbotController");
const chatbotRateLimit = require("../middleware/chatbotRateLimit");

const originalFetch = global.fetch;
const originalFindOne = ChatConversation.findOne;
const originalCreate = ChatConversation.create;
const originalRateLimitUpdate = ChatRateLimit.findOneAndUpdate;
const originalUrl = process.env.MEDICAL_CHATBOT_URL;
const originalToken = process.env.MEDICAL_CHATBOT_TOKEN;
let fetchStub;

before(() => {
  process.env.MEDICAL_CHATBOT_URL = "http://127.0.0.1:8080";
  process.env.MEDICAL_CHATBOT_TOKEN = "test-service-token";
  global.fetch = (...args) => fetchStub(...args);
});

after(() => {
  global.fetch = originalFetch;
  ChatConversation.findOne = originalFindOne;
  ChatConversation.create = originalCreate;
  ChatRateLimit.findOneAndUpdate = originalRateLimitUpdate;
  if (originalUrl === undefined) delete process.env.MEDICAL_CHATBOT_URL;
  else process.env.MEDICAL_CHATBOT_URL = originalUrl;
  if (originalToken === undefined) delete process.env.MEDICAL_CHATBOT_TOKEN;
  else process.env.MEDICAL_CHATBOT_TOKEN = originalToken;
});

const runController = async (controller, body = {}) => {
  let statusCode = 200;
  let responseBody;
  await controller(
    { body, user: { userId: "64b000000000000000000001" } },
    {
      status(code) { statusCode = code; return this; },
      json(value) { responseBody = value; return this; },
    }
  );
  return { statusCode, responseBody };
};

test("chat proxy forwards questions server-side and returns only an app-owned conversation ID", async () => {
  const flaskConversationId = "10c8fe5d-09c7-4a1b-9bb2-0adee88406b9";
  const appConversationId = new mongoose.Types.ObjectId();
  let savedConversation;
  ChatConversation.create = async (record) => {
    savedConversation = record;
    return { _id: appConversationId };
  };
  fetchStub = async (url, options) => {
    assert.equal(url, "http://127.0.0.1:8080/api/chat");
    assert.equal(options.headers.Authorization, "Bearer test-service-token");
    assert.deepEqual(JSON.parse(options.body), { question: "What is acne?" });
    return new Response(JSON.stringify({
      answer: "General information.",
      conversation_id: flaskConversationId,
      sources: [{ source: "data/Medical_book.pdf" }],
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const { statusCode, responseBody } = await runController(replyToMessage, { question: "  What is acne?  " });
  assert.equal(statusCode, 200);
  assert.deepEqual(responseBody.data, {
    answer: "General information.",
    conversationId: appConversationId.toString(),
    sources: [{ source: "data/Medical_book.pdf" }],
  });
  assert.equal(savedConversation.userId, "64b000000000000000000001");
  assert.equal(savedConversation.flaskConversationId, flaskConversationId);
  assert.ok(savedConversation.expiresAt instanceof Date);
});

test("chat proxy checks conversation ownership and forwards the stored Flask ID", async () => {
  const appConversationId = new mongoose.Types.ObjectId();
  const flaskConversationId = "10c8fe5d-09c7-4a1b-9bb2-0adee88406b9";
  let lookup;
  let saved = false;
  ChatConversation.findOne = async (query) => {
    lookup = query;
    return {
      _id: appConversationId,
      flaskConversationId,
      save: async () => { saved = true; },
    };
  };
  fetchStub = async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), {
      question: "Follow up",
      conversation_id: flaskConversationId,
    });
    return new Response(JSON.stringify({
      answer: "Follow-up answer.",
      conversation_id: flaskConversationId,
      sources: [],
    }), { status: 200 });
  };

  const { statusCode } = await runController(replyToMessage, {
    question: "Follow up",
    conversationId: appConversationId.toString(),
  });
  assert.equal(statusCode, 200);
  assert.deepEqual(lookup, {
    _id: appConversationId.toString(),
    userId: "64b000000000000000000001",
    expiresAt: { $gt: lookup.expiresAt.$gt },
  });
  assert.ok(saved);
});

test("chat proxy validates questions and rejects another user's conversation", async () => {
  const empty = await runController(replyToMessage, { question: "  " });
  assert.equal(empty.statusCode, 400);

  const tooLong = await runController(replyToMessage, { question: "a".repeat(4001) });
  assert.equal(tooLong.statusCode, 400);

  const conversationId = new mongoose.Types.ObjectId().toString();
  ChatConversation.findOne = async () => null;
  let upstreamCalled = false;
  fetchStub = async () => { upstreamCalled = true; };
  const unavailable = await runController(replyToMessage, { question: "Hello", conversationId });
  assert.equal(unavailable.statusCode, 404);
  assert.equal(upstreamCalled, false);
});

test("chat proxy maps upstream rate limits and malformed responses safely", async () => {
  fetchStub = async () => new Response("busy", { status: 429 });
  assert.equal((await runController(replyToMessage, { question: "Hello" })).statusCode, 429);

  fetchStub = async () => new Response("not json", { status: 200 });
  const malformed = await runController(replyToMessage, { question: "Hello" });
  assert.equal(malformed.statusCode, 502);
  assert.match(malformed.responseBody.message, /invalid response/i);
});

test("chatbot health check exposes only service availability", async () => {
  fetchStub = async (url) => {
    assert.equal(url, "http://127.0.0.1:8080/health");
    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  };
  const { statusCode, responseBody } = await runController(checkServiceHealth);
  assert.equal(statusCode, 200);
  assert.deepEqual(responseBody, { status: "ok" });
});

test("chatbot health check reports unavailable when service credentials are not configured", async () => {
  const configuredToken = process.env.MEDICAL_CHATBOT_TOKEN;
  delete process.env.MEDICAL_CHATBOT_TOKEN;
  let upstreamCalled = false;
  fetchStub = async () => { upstreamCalled = true; };

  try {
    const { statusCode, responseBody } = await runController(checkServiceHealth);
    assert.equal(statusCode, 503);
    assert.deepEqual(responseBody, { status: "unavailable" });
    assert.equal(upstreamCalled, false);
  } finally {
    process.env.MEDICAL_CHATBOT_TOKEN = configuredToken;
  }
});

test("chatbot rate limit is enforced per authenticated user across workers", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  let nextCount = 0;
  let lastStatus;
  let storedCount = 0;
  let storedQuery;
  ChatRateLimit.findOneAndUpdate = async (query, update) => {
    storedQuery = query;
    storedCount += update.$inc.count;
    return { count: storedCount };
  };
  const req = { user: { userId } };
  const res = {
    status(code) { lastStatus = code; return this; },
    json() {},
  };
  for (let index = 0; index < 20; index += 1) {
    await chatbotRateLimit(req, res, () => { nextCount += 1; });
  }
  await chatbotRateLimit(req, res, () => { nextCount += 1; });
  assert.equal(nextCount, 20);
  assert.equal(lastStatus, 429);
  assert.equal(storedCount, 21);
  assert.equal(storedQuery.userId, userId);
});

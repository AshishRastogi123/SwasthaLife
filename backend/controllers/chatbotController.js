const ChatConversation = require("../models/ChatConversation");

const MAX_QUESTION_LENGTH = 4000;
const DEFAULT_CONVERSATION_TTL_SECONDS = 1800;
const CHAT_TIMEOUT_MS = 30000;
const HEALTH_TIMEOUT_MS = 3000;

const serviceConfiguration = () => {
  const baseUrl = process.env.MEDICAL_CHATBOT_URL;
  const token = process.env.MEDICAL_CHATBOT_TOKEN;
  const missing = [];
  if (!baseUrl) missing.push("MEDICAL_CHATBOT_URL");
  if (!token) missing.push("MEDICAL_CHATBOT_TOKEN");
  if (missing.length) {
    console.error("Medical chatbot is not configured:", { missing });
    return null;
  }

  try {
    const url = new URL(baseUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      console.error("Medical chatbot URL must use HTTP or HTTPS.");
      return null;
    }
    return { baseUrl: url.toString().replace(/\/$/, ""), token };
  } catch {
    console.error("Medical chatbot URL is invalid.");
    return null;
  }
};

const isConversationId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const isFlaskConversationId = (value) =>
  typeof value === "string" &&
  /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(value);

const getConversationId = (conversation) => conversation?._id.toString();

const replyToMessage = async (req, res) => {
  const { question, conversationId } = req.body || {};
  if (typeof question !== "string" || !question.trim() || question.length > MAX_QUESTION_LENGTH) {
    return res.status(400).json({
      message: "Enter a question of up to 4,000 characters.",
    });
  }
  if (conversationId !== undefined && conversationId !== null && !isConversationId(conversationId)) {
    return res.status(400).json({ message: "Start a new chat and try again." });
  }

  const configuration = serviceConfiguration();
  if (!configuration) {
    return res.status(503).json({ message: "The health assistant is temporarily unavailable." });
  }

  let conversation;
  if (conversationId) {
    conversation = await ChatConversation.findOne({
      _id: conversationId,
      userId: req.user.userId,
      expiresAt: { $gt: new Date() },
    });
    if (!conversation) {
      return res.status(404).json({
        message: "This chat has expired or is unavailable. Start a new chat to continue.",
      });
    }
  }

  try {
    const response = await fetch(`${configuration.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configuration.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question.trim(),
        ...(conversation ? { conversation_id: conversation.flaskConversationId } : {}),
      }),
      signal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ message: "The health assistant is busy. Please wait and try again." });
      }
      if (response.status === 401 || response.status === 503) {
        console.error("Medical chatbot service is unavailable:", { status: response.status });
        return res.status(503).json({ message: "The health assistant is temporarily unavailable." });
      }
      console.error("Medical chatbot request failed:", { status: response.status });
      return res.status(502).json({ message: "The health assistant could not respond. Please try again later." });
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error("Medical chatbot returned invalid JSON:", { name: error.name });
      return res.status(502).json({
        message: "The health assistant returned an invalid response. Please try again.",
      });
    }
    if (
      typeof result?.answer !== "string" ||
      !result.answer.trim() ||
      !isFlaskConversationId(result.conversation_id) ||
      !Array.isArray(result.sources)
    ) {
      console.error("Medical chatbot returned an invalid response.");
      return res.status(502).json({ message: "The health assistant returned an invalid response. Please try again." });
    }

    const sources = result.sources
      .filter((source) => source && typeof source.source === "string" && source.source.trim())
      .map((source) => ({ source: source.source }));

    const expiresAt = new Date(
      Date.now() + (Number(process.env.CONVERSATION_TTL_SECONDS) || DEFAULT_CONVERSATION_TTL_SECONDS) * 1000
    );
    if (conversation) {
      conversation.flaskConversationId = result.conversation_id;
      conversation.expiresAt = expiresAt;
      await conversation.save();
    } else {
      conversation = await ChatConversation.create({
        userId: req.user.userId,
        flaskConversationId: result.conversation_id,
        expiresAt,
      });
    }

    return res.status(200).json({
      data: {
        answer: result.answer,
        conversationId: getConversationId(conversation),
        sources,
      },
    });
  } catch (error) {
    console.error("Medical chatbot request failed:", {
      name: error.name,
      timedOut: error.name === "TimeoutError" || error.name === "AbortError",
    });
    return res.status(503).json({ message: "The health assistant is temporarily unavailable. Please try again." });
  }
};

const checkServiceHealth = async (_req, res) => {
  const configuration = serviceConfiguration();
  if (!configuration) {
    return res.status(503).json({ status: "unavailable" });
  }
  try {
    const response = await fetch(`${configuration.baseUrl}/health`, {
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
    if (!response.ok) return res.status(503).json({ status: "unavailable" });
    return res.status(200).json({ status: "ok" });
  } catch {
    return res.status(503).json({ status: "unavailable" });
  }
};

module.exports = { replyToMessage, checkServiceHealth };

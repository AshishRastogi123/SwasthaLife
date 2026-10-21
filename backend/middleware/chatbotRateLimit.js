const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;
const ChatRateLimit = require("../models/ChatRateLimit");

const chatbotRateLimit = async (req, res, next) => {
  const now = Date.now();
  const windowStartedAt = new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS);
  const query = { userId: req.user.userId, windowStartedAt };
  const update = {
    $inc: { count: 1 },
    $setOnInsert: { expiresAt: new Date(windowStartedAt.getTime() + WINDOW_MS * 2) },
  };
  const options = { new: true, upsert: true, setDefaultsOnInsert: true };
  let record;

  try {
    record = await ChatRateLimit.findOneAndUpdate(query, update, options);
  } catch (error) {
    if (error.code !== 11000) return next(error);
    try {
      record = await ChatRateLimit.findOneAndUpdate(
        query,
        { $inc: { count: 1 } },
        { new: true }
      );
    } catch (retryError) {
      return next(retryError);
    }
  }

  if (!record) return next(new Error("Chatbot rate-limit record could not be updated"));
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({ message: "You have sent too many messages. Please wait a minute and try again." });
  }

  return next();
};

module.exports = chatbotRateLimit;

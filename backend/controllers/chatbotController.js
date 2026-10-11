const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `You are SwasthaLife's empathetic AI health information assistant. You are not a doctor and must not diagnose or replace a qualified healthcare professional.

Be thorough but concise. Do not request names, contact details, addresses, or other identifying information. Give general health information with appropriate uncertainty, and clearly identify symptoms that need immediate medical attention.

Reply in the language used by the patient. Keep medical terms in English when replying in Hindi. End by reminding the user that you are an AI and they should consult a healthcare professional.`;

exports.replyToMessage = async (req, res) => {
  const { message } = req.body || {};
  if (typeof message !== "string" || !message.trim() || message.length > 4000) {
    return res.status(400).json({ message: "Enter a message of up to 4,000 characters." });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ message: "The health assistant is temporarily unavailable." });
  }

  try {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024 },
    });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${message.trim()}`);
    const reply = result.response.text();
    if (!reply) {
      return res.status(502).json({ message: "The health assistant could not provide a response. Please try again." });
    }
    return res.status(200).json({ data: { reply } });
  } catch (error) {
    console.error("Chatbot provider request failed:", { name: error.name });
    return res.status(502).json({ message: "The health assistant could not respond. Please try again later." });
  }
};

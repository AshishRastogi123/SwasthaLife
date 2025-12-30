import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ChatBot.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = import.meta.env.VITE_API_KEY_S;
// Initialize the API with configuration (NOTE: for production keep key on server)
const genAI = new GoogleGenerativeAI(API_KEY);
// Configure the model
const modelConfig = {
  model: "gemini-2.5-flash-lite",
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
};

function Chatbot() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("swastha_chat");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const bodyRef = useRef(null);

  // Quick prompts for user convenience
  const quickPrompts = [
    "I have fever and cough, what should I do?",
    "What does a high blood sugar reading suggest?",
    "Short on breath — what could this mean?",
    "How to reduce headache quickly at home?",
  ];

  useEffect(() => {
    // scroll to bottom when messages change
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
    // persist to localStorage
    localStorage.setItem("swastha_chat", JSON.stringify(messages));
  }, [messages]);

  const addMessage = (sender, text) => {
    const ts = new Date().toISOString();
    const newMsg = { sender, text, ts };
    setMessages((m) => [...m, newMsg]);
    return newMsg;
  };

  const sendMessage = async (fromQuick = null) => {
    const textToSend = fromQuick !== null ? fromQuick : input.trim();
    if (!textToSend) return;

    // Add user message
    addMessage("user", textToSend);
    setIsLoading(true);

    try {
      // Initialize model with configuration
      const model = genAI.getGenerativeModel(modelConfig);

      if (!model) {
        throw new Error("Failed to initialize the AI model");
      }

      // prepare a concise healthcare prompt
      const prompt = `
You are a concise AI health assistant.
Answer only what is asked. Be short, clear, and professional.
If user asks for prediction, give only one prediction line + short advice.
If user asks for guidance, give only 2-3 bullet points.

User: ${textToSend}
`;

      const chat = await model.startChat({
        history: [], // start fresh for each message to simplify
        generationConfig: modelConfig.generationConfig,
      });

      const result = await chat.sendMessage(prompt);

      if (!result || !result.response) {
        throw new Error("No response received from the AI model");
      }

      const reply = await result.response.text();

      if (!reply) {
        throw new Error("Empty response received from the AI model");
      }

      addMessage("bot", reply);
    } catch (error) {
      console.error("Chatbot error details:", {
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        errorType: error.constructor?.name,
      });

      let errorMessage =
        "I apologize, but I'm having trouble connecting right now. Please try again later.";

      if (error.message && error.message.toLowerCase().includes("api key")) {
        errorMessage =
          "There seems to be an issue with the API configuration. Please contact support.";
      } else if (
        error.message &&
        error.message.toLowerCase().includes("quota")
      ) {
        errorMessage =
          "We've reached our usage limit. Please try again in a few minutes.";
      }

      addMessage("bot", errorMessage);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("swastha_chat");
  };

  const downloadTranscript = () => {
    const lines = messages.map(
      (m) =>
        `[${new Date(m.ts).toLocaleString()}] ${m.sender.toUpperCase()}: ${
          m.text
        }`
    );
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swastha_chat_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLastBotReply = async () => {
    const lastBot = [...messages].reverse().find((m) => m.sender === "bot");
    if (!lastBot) return alert("No bot reply to copy.");
    try {
      await navigator.clipboard.writeText(lastBot.text);
      alert("Last bot reply copied to clipboard.");
    } catch {
      alert("Unable to copy. Your browser may not allow clipboard operations.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const footerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.3 } },
  };

  return (
    <>
      <Navbar />
      {/* spacer to avoid navbar overlap — adjust if your navbar is different height */}
      <div style={{ height: "76px" }} />

      <motion.div
        className="sw-chat-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        aria-live="polite"
      >
        <motion.div
          className="sw-chat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          role="region"
          aria-label="SwasthaLife chat"
        >
          <motion.div
            className="sw-chat-header"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              className="sw-back-btn"
              onClick={() => navigate("/")}
              aria-label="Go to homepage"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </motion.button>

            <motion.div className="sw-avatar" aria-hidden>
              SL
            </motion.div>

            <div style={{ flex: 1 }}>
              <motion.div
                className="sw-chat-title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                SwasthaLife AI
              </motion.div>
              <motion.div
                className="sw-chat-subtitle"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Health guidance & symptom-based predictions — informational only
              </motion.div>
            </div>

            {/* control buttons */}
            <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={clearChat}
                aria-label="Clear chat"
              >
                Clear
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={downloadTranscript}
                aria-label="Download transcript"
              >
                Download
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={copyLastBotReply}
                aria-label="Copy last reply"
              >
                Copy reply
              </button>
            </div>
          </motion.div>

          <motion.div
            className="sw-quick-prompts px-3"
            style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 8 }}
          >
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                className="btn btn-sm btn-outline-primary"
                onClick={() => sendMessage(q)}
                aria-label={`Quick prompt: ${q}`}
                title={q}
              >
                {q.length > 40 ? q.slice(0, 36) + "…" : q}
              </button>
            ))}
          </motion.div>

          <motion.div
            className="sw-chat-body"
            ref={bodyRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {messages.length === 0 && !isLoading && (
              <motion.div
                className="sw-msg bot"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                Hi — <strong>SwasthaLife AI</strong>. Describe your symptoms;
                I'll suggest possible conditions and next steps. Not a
                substitute for a doctor.
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`sw-msg ${message.sender}`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
              >
                <div style={{ whiteSpace: "pre-wrap" }}>{message.text}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
                  {new Date(message.ts).toLocaleString()}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                className="sw-msg bot"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="sw-typing-indicator">
                  Typing<span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="sw-chat-footer"
            variants={footerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.textarea
              className="sw-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              rows={1}
              aria-label="Type your message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            />
            <motion.button
              className="sw-send-btn"
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              Send
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      <Footer />
    </>
  );
}

export default Chatbot;
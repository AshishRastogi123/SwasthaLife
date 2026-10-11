import { motion as Motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import MedicalDisclaimer from "../MedicalDisclaimer";
import { apiRequest } from "../../api";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const bodyRef = useRef(null);
  const sendingRef = useRef(false);
  const requestController = useRef(null);

  // Quick prompts for user convenience
  const quickPrompts = [
    "I've been having chest pain for the past hour. What should I do?",
    "My blood pressure is 180/110. Is this an emergency?",
    "I have a persistent cough and fever over 101°F for 3 days.",
    "Severe headache with nausea and sensitivity to light.",
  ];

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => () => requestController.current?.abort(), []);

  const addMessage = (sender, text) => {
    const ts = new Date().toISOString();
    const newMsg = { sender, text, ts };
    setMessages((m) => [...m, newMsg]);
    return newMsg;
  };

  const sendMessage = async (fromQuick = null) => {
    const textToSend = (fromQuick !== null ? fromQuick : input).trim();
    if (!textToSend || sendingRef.current) return;

    sendingRef.current = true;
    const controller = new AbortController();
    requestController.current = controller;
    addMessage("user", textToSend);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/api/chatbot", {
        method: "POST",
        body: JSON.stringify({ message: textToSend }),
        signal: controller.signal,
      });
      addMessage("bot", response.data.reply);
    } catch (error) {
      if (error.name !== "AbortError") addMessage("bot", error.message);
    } finally {
      sendingRef.current = false;
      if (!controller.signal.aborted) setIsLoading(false);
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
      <div className="sw-chat-navbar-spacer" />

      <Motion.div
        className="sw-chat-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        aria-live="polite"
      >
        <Motion.div
          className="sw-chat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          role="region"
          aria-label="SwasthaLife chat"
        >
          <Motion.div
            className="sw-chat-header"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <Motion.button
              className="sw-back-btn"
              onClick={() => navigate("/")}
              aria-label="Go to homepage"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </Motion.button>

            <Motion.div className="sw-avatar" aria-hidden>
              AI
            </Motion.div>

            <div className="sw-chat-heading">
              <Motion.div
                className="sw-chat-title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                SwasthaLife AI health assistant
              </Motion.div>
              <Motion.div
                className="sw-chat-subtitle"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                General health information, not medical advice
              </Motion.div>
            </div>

            {/* control buttons */}
            <div className="sw-chat-controls">
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
          </Motion.div>

          <Motion.div
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
          </Motion.div>

          <Motion.div
            className="sw-chat-body"
            ref={bodyRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {messages.length === 0 && !isLoading && (
              <Motion.div
                className="sw-msg bot"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                Hello, I'm SwasthaLife's AI health information assistant. You can share a health question, but please avoid identifying details. I can offer general information and possible explanations, not a diagnosis. Consult a qualified healthcare professional for advice.
              </Motion.div>
            )}

            {messages.map((message, index) => (
              <Motion.div
                key={index}
                className={`sw-msg ${message.sender}`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
              >
                <div className="sw-markdown-response">
                  {message.sender === "bot" ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    <div style={{ whiteSpace: "pre-wrap" }}>{message.text}</div>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
                  {new Date(message.ts).toLocaleString()}
                </div>
              </Motion.div>
            ))}

            {isLoading && (
              <Motion.div
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
              </Motion.div>
            )}
          </Motion.div>

          <div className="px-3 pt-2">
            <MedicalDisclaimer className="mb-2" />
            <p className="small text-muted">Chat messages are sent to SwasthaLife and Google Gemini for a reply, and are not saved after you leave this page. Avoid sharing identifying details. See our <Link to="/privacy">Privacy Policy</Link>.</p>
          </div>

          <Motion.div
            className="sw-chat-footer"
            variants={footerVariants}
            initial="hidden"
            animate="visible"
          >
            <Motion.textarea
              className="sw-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms and medical concerns..."
              maxLength={4000}
              rows={1}
              aria-label="Type your message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            />
            <Motion.button
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
            </Motion.button>
          </Motion.div>
        </Motion.div>
      </Motion.div>

      <Footer />
    </>
  );
}

export default Chatbot;
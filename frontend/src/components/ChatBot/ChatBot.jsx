import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import MedicalDisclaimer from "../MedicalDisclaimer";
import { apiRequest } from "../../api";

const suggestedQuestions = [
  "What are common causes of headaches?",
  "What is diabetes?",
  "Explain the symptoms of anemia.",
  "How can I maintain a healthy lifestyle?",
];

const formatSourceName = (source) => {
  const name = source.split(/[\\/]/).filter(Boolean).pop();
  return name || source;
};

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const navigate = useNavigate();
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const sendingRef = useRef(false);
  const requestController = useRef(null);
  const shouldFollowLatest = useRef(true);

  useEffect(() => {
    const body = bodyRef.current;
    if (body && shouldFollowLatest.current) body.scrollTop = body.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => () => requestController.current?.abort(), []);

  const sendMessage = async (submittedText = input, retryMessageId = null) => {
    const question = submittedText.trim();
    if (!question || question.length > 4000 || sendingRef.current) return;

    sendingRef.current = true;
    shouldFollowLatest.current = true;
    const controller = new AbortController();
    requestController.current = controller;
    setError("");
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setIsLoading(true);

    if (retryMessageId) {
      setMessages((current) => current.filter((message) => message.id !== retryMessageId));
    } else {
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), sender: "user", text: question, timestamp: new Date() },
      ]);
    }

    try {
      const result = await apiRequest("/api/chatbot/chat", {
        method: "POST",
        body: JSON.stringify({ question, ...(conversationId ? { conversationId } : {}) }),
        signal: controller.signal,
      });
      if (typeof result?.data?.answer !== "string" || !Array.isArray(result.data.sources)) {
        throw new Error("The health assistant returned an invalid response. Please try again.");
      }
      setConversationId(result.data.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          text: result.data.answer,
          sources: result.data.sources,
          timestamp: new Date(),
        },
      ]);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        const message = requestError.message || "The assistant could not respond. Please try again.";
        setError(message);
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            sender: "error",
            text: message,
            retryText: question,
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      sendingRef.current = false;
      if (!controller.signal.aborted) setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 160)}px`;
  };

  const clearChat = () => {
    if (isLoading) return;
    if (messages.length && !window.confirm("Start a new chat? Your current conversation will no longer be available here.")) {
      return;
    }
    setMessages([]);
    setConversationId(null);
    setError("");
    setInput("");
    shouldFollowLatest.current = true;
    inputRef.current?.focus();
  };

  const downloadTranscript = () => {
    const lines = messages
      .filter((message) => message.sender !== "error")
      .map((message) => `[${new Date(message.timestamp).toLocaleString()}] ${message.sender.toUpperCase()}: ${message.text}`);
    if (!lines.length) return;
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `swastha_chat_${Date.now()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyAnswer = async (message) => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopiedMessageId(message.id);
    } catch {
      setError("Unable to copy the answer. Your browser may not allow clipboard access.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="sl-chat-page">
        <div className="sl-chat-shell">
          <header className="sl-chat-topbar">
            <button className="sl-icon-button" type="button" onClick={() => navigate("/")} aria-label="Go to homepage">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6M9 12h11" /></svg>
            </button>
            <div className="sl-topbar-brand">
              <div className="sl-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><path d="M16 27s-10-5.8-10-13a5.6 5.6 0 0 1 10-3.4A5.6 5.6 0 0 1 26 14c0 7.2-10 13-10 13Z" /><path d="M16 12v9m-4.5-4.5h9" /></svg>
              </div>
              <div>
                <strong>SwasthaLife</strong>
                <span>AI health assistant</span>
              </div>
            </div>
            <div className="sl-topbar-actions">
              <span className="sl-secure-label"><span aria-hidden="true">●</span> Session active</span>
              <button className="sl-new-chat-button" type="button" onClick={clearChat} disabled={isLoading}>
                <span aria-hidden="true">＋</span> New chat
              </button>
            </div>
          </header>

          <section className="sl-chat-intro" aria-label="Medical information notice">
            <span className="sl-ai-badge"><span aria-hidden="true">✦</span> AI-GENERATED MEDICAL INFORMATION</span>
            <p>For general information only. Not a diagnosis or a substitute for professional medical advice.</p>
          </section>

          <section className={`sl-chat-panel ${messages.length ? "sl-chat-panel-active" : ""}`} aria-label="Health assistant conversation">
            <div
              className="sl-chat-messages"
              ref={bodyRef}
              onScroll={(event) => {
                const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
                shouldFollowLatest.current = scrollHeight - scrollTop - clientHeight < 120;
              }}
              aria-live="polite"
              aria-relevant="additions text"
            >
              {messages.length === 0 ? (
                <div className="sl-welcome">
                  <div className="sl-welcome-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48"><path d="M24 41S7 31.2 7 19a9.5 9.5 0 0 1 17-5.8A9.5 9.5 0 0 1 41 19c0 12.2-17 22-17 22Z" /><path d="M24 17v14m-7-7h14" /></svg>
                  </div>
                  <p className="sl-eyebrow">HERE FOR YOUR HEALTH QUESTIONS</p>
                  <h1>Your AI health assistant</h1>
                  <p className="sl-welcome-copy">Ask a health question and explore clear general information grounded in relevant medical documents. Your assistant is here to help you understand—not diagnose.</p>
                  <div className="sl-suggestions-heading">A few things you can ask</div>
                  <div className="sl-suggestion-grid">
                    {suggestedQuestions.map((question) => (
                      <button key={question} type="button" className="sl-suggestion-card" onClick={() => sendMessage(question)} disabled={isLoading}>
                        <span>{question}</span><span className="sl-suggestion-arrow" aria-hidden="true">↗</span>
                      </button>
                    ))}
                  </div>
                  <button className="sl-start-link" type="button" onClick={() => inputRef.current?.focus()}>
                    Or type your own question below <span aria-hidden="true">↓</span>
                  </button>
                </div>
              ) : (
                <div className="sl-message-list">
                  {messages.map((message) => (
                    <article className={`sl-message sl-message-${message.sender}`} key={message.id}>
                      <div className="sl-message-avatar" aria-hidden="true">
                        {message.sender === "user" ? "You" : "✦"}
                      </div>
                      <div className="sl-message-content">
                        <div className="sl-message-meta">
                          <strong>{message.sender === "user" ? "You" : message.sender === "error" ? "Assistant" : "SwasthaLife AI"}</strong>
                          <time dateTime={new Date(message.timestamp).toISOString()}>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                        </div>
                        <div className="sl-message-bubble">
                          {message.sender === "user" ? (
                            <p>{message.text}</p>
                          ) : (
                            <div className="sl-markdown">
                              <ReactMarkdown components={{
                                a: ({ href, children, ...props }) => (
                                  <a href={href} target="_blank" rel="noreferrer noopener" {...props}>{children}</a>
                                ),
                              }}>{message.text}</ReactMarkdown>
                            </div>
                          )}
                          {message.sender === "error" && (
                            <button
                              className="sl-retry-button"
                              type="button"
                              onClick={() => sendMessage(message.retryText, message.id)}
                              disabled={isLoading}
                            >
                              Try again
                            </button>
                          )}
                        </div>
                        {message.sender === "assistant" && message.sources?.length > 0 && (
                          <details className="sl-sources">
                            <summary>Sources <span>{message.sources.length}</span></summary>
                            <ul>
                              {message.sources.map((source, index) => (
                                <li key={`${source.source}-${index}`}>{formatSourceName(source.source)}</li>
                              ))}
                            </ul>
                          </details>
                        )}
                        {message.sender === "assistant" && (
                          <div className="sl-answer-actions">
                            <button type="button" onClick={() => copyAnswer(message)} aria-label="Copy this answer">
                              <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="10" height="11" rx="2" /><path d="M13 7V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg>
                              {copiedMessageId === message.id ? "Copied" : "Copy answer"}
                            </button>
                            {copiedMessageId === message.id && <span role="status">Answer copied to clipboard.</span>}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                  {isLoading && (
                    <div className="sl-pending" role="status" aria-live="polite">
                      <span className="sl-message-avatar" aria-hidden="true">✦</span>
                      <span className="sl-pending-dots"><i /><i /><i /></span>
                      <span>Finding helpful information…</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sl-chat-composer">
              {error && <p className="sl-chat-error" role="alert">{error}</p>}
              <div className="sl-composer-wrap">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a health question…"
                  maxLength={4000}
                  rows={1}
                  aria-label="Your health question"
                  disabled={isLoading}
                />
                <button
                  className="sl-send-button"
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim() || input.length > 4000}
                  aria-label={isLoading ? "Waiting for an answer" : "Send question"}
                >
                  {isLoading ? (
                    <span className="sl-send-spinner" aria-hidden="true" />
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Z" /><path d="M7 12h14" /></svg>
                  )}
                </button>
              </div>
              <div className="sl-composer-hint">
                <span>{input.length}/4000</span>
                <span>Enter to send · Shift + Enter for a new line</span>
              </div>
              {messages.length > 0 && (
                <div className="sl-conversation-actions">
                  <button type="button" onClick={downloadTranscript}>Download transcript</button>
                </div>
              )}
            </div>
          </section>

          <footer className="sl-chat-disclaimer">
            <MedicalDisclaimer className="sl-medical-disclaimer" />
            <p>Your messages are processed by the medical chatbot service to generate replies. SwasthaLife stores no chat text; the service may retain conversation turns for its configured time limit to support follow-up questions. Avoid sharing identifying details. Read our <Link to="/privacy">Privacy Policy</Link>.</p>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Chatbot;

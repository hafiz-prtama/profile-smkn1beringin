import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, ArrowLeft } from "lucide-react";
import { chatbotFaq } from "@/data/mockData";

// ─── Cocokkan input user ke FAQ ───────────────────────────────────────────────
function findAnswer(input) {
  const lower = input.toLowerCase();
  const match = chatbotFaq.find((faq) =>
    faq.keywords.some((kw) => lower.includes(kw))
  );
  return match
    ? match.answer
    : "Maaf, saya belum bisa menjawab pertanyaan tersebut. Silakan hubungi sekolah secara langsung untuk informasi lebih lanjut.";
}

// Ambil 5 pertanyaan pertama sebagai chip cepat
const QUICK_QUESTIONS = chatbotFaq.slice(0, 5).map((f) => f.question);

// Format jam HH:MM
function nowTime() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// ─── Komponen ChatBox ─────────────────────────────────────────────────────────
export default function ChatBox() {
  const [open,     setOpen]     = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [text,     setText]     = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Animasi buka / tutup
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Kirim pesan (teks bebas atau chip)
  function sendMessage(e, override) {
    e?.preventDefault();
    const value = (override ?? text).trim();
    if (!value) return;

    const time = nowTime();
    setMessages((prev) => [
      ...prev,
      { from: "user", text: value, time },
      { from: "bot",  text: findAnswer(value), time },
    ]);
    setText("");
  }

  const showWelcome = messages.length === 0;

  return (
    <>
      {/* ── Jendela chat ── */}
      {visible && (
        <section
          className={`chat-window ${open ? "chat-window--open" : "chat-window--close"}`}
          aria-label="Chat asisten sekolah"
          aria-hidden={!open}
        >
          {/* ── Header ── */}
          <div className="chat-header">
            <div className="chat-header-left">
              <button
                className="chat-back-btn"
                onClick={() => setOpen(false)}
                aria-label="Tutup chat"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="chat-header-title">Asisten Sekolah</span>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Area pesan ── */}
          <div className="chat-messages">

            {/* Pesan sambutan bot — selalu tampil di atas */}
            <div className="chat-row chat-row--bot">
              <div className="chat-avatar">
                <Bot size={16} />
              </div>
              <div className="chat-bubble-wrap">
                <span className="chat-sender-name">Asisten Sekolah</span>
                <div className="chat-bubble bot">
                  👋 SMK Negeri 1 Beringin disini..<br />
                  Hai! Ada yang bisa kami bantu?
                </div>
                <span className="chat-time">{nowTime()}</span>
              </div>
            </div>

            {/* Chip pertanyaan cepat — tampil saat belum ada percakapan */}
            {showWelcome && (
              <div className="chat-quick-list">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    className="chat-quick-pill"
                    onClick={() => sendMessage(null, q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Percakapan */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-row chat-row--${msg.from}`}
              >
                {msg.from === "bot" && (
                  <div className="chat-avatar"><Bot size={16} /></div>
                )}
                <div className="chat-bubble-wrap">
                  {msg.from === "bot" && (
                    <span className="chat-sender-name">Asisten Sekolah</span>
                  )}
                  <div className={`chat-bubble ${msg.from}`}>
                    {msg.text.split("\n").map((line, j, arr) => (
                      <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                    ))}
                  </div>
                  <span className="chat-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Chip pertanyaan lain setelah ada percakapan */}
            {!showWelcome && (
              <div className="chat-quick-list chat-quick-list--compact">
                <p className="chat-quick-label">Pertanyaan lain:</p>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    className="chat-quick-pill"
                    onClick={() => sendMessage(null, q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input pesan ── */}
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik di sini dan tekan enter..."
              autoComplete="off"
            />
            <button type="submit" aria-label="Kirim">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      {/* ── Tombol buka/tutup ── */}
      <button
        className={`chat-button ${open ? "chat-button--active" : ""}`}
        onClick={() => setOpen((p) => !p)}
        aria-label={open ? "Tutup chat" : "Buka chat"}
        aria-expanded={open}
      >
        <span className="chat-button-icon">
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </span>
        {!open && <span>Chat</span>}
      </button>
    </>
  );
}
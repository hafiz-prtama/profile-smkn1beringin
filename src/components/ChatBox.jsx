import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, ArrowLeft, RefreshCw, Clock } from "lucide-react";
import Link from "next/link";
import { chatbotFaq } from "@/data/mockData";

function findAnswer(input) {
  const lower = input.toLowerCase();
  const match = chatbotFaq.find((faq) =>
    faq.keywords.some((kw) => lower.includes(kw))
  );
  return match ? match.answer : null;
}

const QUICK_QUESTIONS = chatbotFaq.slice(0, 5).map((f) => f.question);

function formatTime(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null); // PENDING, ACTIVE
  const messagesEndRef = useRef(null);

  // Inisialisasi User ID
  useEffect(() => {
    let id = localStorage.getItem("chatUserId");
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chatUserId", id);
    }
    setUserId(id);
  }, []);

  // Polling data session
  useEffect(() => {
    if (!userId) return;
    
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();
        
        if (data.session) {
          setSessionStatus(data.session.status);
          setMessages(data.session.messages);
        } else {
          // Jika session tidak ditemukan (karena dihapus admin/timeout/rejected)
          if (sessionStatus !== null) {
            setSessionStatus(null);
            setMessages([]); // Reset chat
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSession(); // Initial fetch
    const interval = setInterval(fetchSession, 3000); // Poll setiap 3 detik
    return () => clearInterval(interval);
  }, [userId, sessionStatus]);

  // Auto-scroll
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Animasi
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function sendMessage(e, override) {
    e?.preventDefault();
    const value = (override ?? text).trim();
    if (!value || !userId) return;

    setText("");
    
    // Intervensi untuk opsi Layanan Konseling BK
    if (value === "Konsultasi Bimbingan Konseling") {
      const userMsg = { sender: "USER", text: value, createdAt: new Date().toISOString() };
      const botMsg = { 
        sender: "BOT", 
        text: "Pilih untuk masuk ke Ruang Konseling Bimbingan Konseling secara anonim:", 
        isBkOptions: true,
        createdAt: new Date().toISOString() 
      };
      setMessages(prev => [...prev, userMsg, botMsg]);
      return;
    }

    // 1. Tambahkan pesan user ke UI sementara
    const userMsg = { sender: "USER", text: value, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

    const answer = findAnswer(value);
    
    // 2. Kirim pesan user ke API
    await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text: value, sender: "USER" })
    });

    // 3. Jika ada jawaban bot (FAQ), kirim juga ke API
    if (answer) {
      const botMsg = { sender: "BOT", text: answer, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
      
      await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: answer, sender: "BOT" })
      });
    } else {
      // Jika tidak ada jawaban FAQ, artinya custom chat
      const fallbackMsg = { 
        sender: "BOT", 
        text: "Pesan Anda diteruskan ke Admin. Mohon tunggu balasannya (maksimal 24 jam).", 
        createdAt: new Date().toISOString() 
      };
      setMessages(prev => [...prev, fallbackMsg]);
      
      await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: fallbackMsg.text, sender: "BOT" })
      });
      setSessionStatus("PENDING");
    }
  }

  async function startNewSession() {
    // Reset ID agar seolah membuat session baru, database akan timeout dengan sendirinya atau
    // kita bisa menghapus secara eksplisit jika diperlukan.
    const newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("chatUserId", newId);
    setUserId(newId);
    setMessages([]);
    setSessionStatus(null);
  }

  const showWelcome = messages.length === 0;

  return (
    <>
      {visible && (
        <section
          className={`chat-window ${open ? "chat-window--open" : "chat-window--close"}`}
          aria-label="Chat asisten sekolah"
          aria-hidden={!open}
        >
          <div className="chat-header">
            <div className="chat-header-left">
              <button className="chat-back-btn" onClick={() => setOpen(false)} aria-label="Tutup chat">
                <ArrowLeft size={18} />
              </button>
              <div className="chat-header-titles">
                <span className="chat-header-title">Asisten Sekolah</span>
                {sessionStatus === 'PENDING' && <span className="chat-header-subtitle">Menunggu Admin...</span>}
                {sessionStatus === 'ACTIVE' && <span className="chat-header-subtitle active">Terhubung dengan Admin</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!showWelcome && (
                <button className="chat-close-btn" onClick={startNewSession} title="Pertanyaan Baru">
                  <RefreshCw size={16} />
                </button>
              )}
              <button className="chat-close-btn" onClick={() => setOpen(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            <div className="chat-row chat-row--bot">
              <div className="chat-avatar"><Bot size={16} /></div>
              <div className="chat-bubble-wrap">
                <span className="chat-sender-name">Asisten Sekolah</span>
                <div className="chat-bubble bot">
                  👋 SMK Negeri 1 Beringin disini..<br />
                  Hai! Ada yang bisa kami bantu?
                </div>
              </div>
            </div>

            {showWelcome && (
              <div className="chat-quick-list">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} className="chat-quick-pill" onClick={() => sendMessage(null, q)}>{q}</button>
                ))}
                <button className="chat-quick-pill" style={{ background: '#3b82f6', color: 'white', borderColor: '#2563eb' }} onClick={() => sendMessage(null, "Konsultasi Bimbingan Konseling")}>
                  Konsultasi Bimbingan Konseling
                </button>
              </div>
            )}

            {messages.map((msg, i) => {
              const isUser = msg.sender === "USER";
              const isBot = msg.sender === "BOT";
              const isAdmin = msg.sender === "ADMIN";
              const rowClass = isUser ? "chat-row--user" : "chat-row--bot";
              const bubbleClass = isUser ? "user" : (isAdmin ? "admin" : "bot");
              const senderName = isUser ? "Anda" : (isAdmin ? "Admin Sekolah" : "Asisten Sekolah");

              return (
                <div key={i} className={`chat-row ${rowClass}`}>
                  {!isUser && <div className="chat-avatar"><Bot size={16} /></div>}
                  <div className="chat-bubble-wrap">
                    {!isUser && <span className="chat-sender-name">{senderName}</span>}
                    <div className={`chat-bubble ${bubbleClass}`}>
                      {msg.text.split("\n").map((line, j, arr) => (
                        <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                      ))}
                      {msg.isBkOptions && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <Link href="/konseling?type=siswa" style={{ display: 'inline-block', padding: '6px 10px', background: '#2563eb', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                            Sebagai Siswa
                          </Link>
                          <Link href="/konseling?type=orang_tua" style={{ display: 'inline-block', padding: '6px 10px', background: '#10b981', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                            Sebagai Orang Tua
                          </Link>
                        </div>
                      )}
                    </div>
                    <span className="chat-time">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}

            {!showWelcome && (
              <div className="chat-quick-list chat-quick-list--compact">
                <p className="chat-quick-label">Pertanyaan lain:</p>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} className="chat-quick-pill" onClick={() => sendMessage(null, q)}>{q}</button>
                ))}
                <button className="chat-quick-pill" style={{ background: '#3b82f6', color: 'white', borderColor: '#2563eb' }} onClick={() => sendMessage(null, "Konsultasi Bimbingan Konseling")}>
                  Konsultasi Bimbingan Konseling
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

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
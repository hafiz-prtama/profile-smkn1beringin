"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function formatTime(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function TicketChatPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId;
  
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem("bkAnonUserId");
    if (!id) {
      router.push("/konseling");
    } else {
      setUserId(id);
    }
  }, [router]);

  useEffect(() => {
    if (!ticketId || !userId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/bk/chat?ticketId=${ticketId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Polling setiap 3 detik
    return () => clearInterval(interval);
  }, [ticketId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !userId) return;

    const currentText = text;
    setText("");

    // Optimistic UI
    const tempMsg = { sender: "USER", text: currentText, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await fetch('/api/bk/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, userId, text: currentText })
      });
      // Will be synced on next poll
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAction(actionType) {
    if (!userId) return;
    try {
      await fetch('/api/bk/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, userId, text: "", isAction: true, actionType })
      });
      // Force refresh (optional, as poll will pick it up)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ background: '#efeae2', minHeight: 'calc(100vh - 78px)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', background: '#efeae2', height: 'calc(100vh - 78px)', boxShadow: '0 0 10px rgba(0,0,0,0.1)', position: 'relative' }}>
        {/* Pattern Background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none', backgroundImage: 'url("https://w7.pngwing.com/pngs/949/69/png-transparent-whatsapp-application-software-message-icon-whatsapp-background-texture-angle-text-thumbnail.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }} />
        
        {/* Header ala WA */}
        <div style={{ background: '#008069', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
          <Link href="/konseling" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ArrowLeft size={24} />
          </Link>
          <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/logo-smk.png" alt="Logo BK" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Guru BK SMKN 1</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Tersedia untuk membantu</span>
          </div>
        </div>

        {/* Chat Area (Pattern WA) */}
        <div style={{ 
          flex: 1, 
          padding: '1.5rem', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', // Pola WA umum (transparan)
          backgroundSize: '400px'
        }}>
          
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <span style={{ background: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#555', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
              Ruang Konseling dienkripsi secara end-to-end (Simulasi). Identitas Anda disembunyikan kecuali Anda menyetujui.
            </span>
          </div>

          {messages.map((msg, i) => {
            const isMe = msg.sender === "USER";
            const isSystem = msg.sender === "SYSTEM";

            if (isSystem) {
              return (
                <div key={i} style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <span style={{ background: '#ffebb3', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#555', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', display: 'inline-block', maxWidth: '85%' }}>
                    ⚠️ {msg.text}
                  </span>
                </div>
              );
            }

            if (msg.isAction && msg.text === "REQUEST_UNMASK") {
              return (
                <div key={i} style={{ alignSelf: 'flex-start', background: 'white', padding: '12px', borderRadius: '0 8px 8px 8px', maxWidth: '75%', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ color: '#008069', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Guru BK</div>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>Guru BK meminta untuk membuka identitas (Unmask) agar bisa dilakukan sesi tatap muka secara offline.</p>
                  <button onClick={() => handleAction('AGREE_UNMASK')} style={{ marginTop: '10px', background: '#008069', color: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Setujui & Buka Identitas
                  </button>
                  <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#888', marginTop: '6px' }}>{formatTime(msg.createdAt)}</div>
                </div>
              );
            }

            return (
              <div key={i} style={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start', 
                background: isMe ? '#d9fdd3' : 'white', 
                padding: '8px 12px', 
                borderRadius: isMe ? '8px 0 8px 8px' : '0 8px 8px 8px', 
                maxWidth: '75%', 
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                {!isMe && <div style={{ color: '#008069', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Guru BK</div>}
                
                <div style={{ fontSize: '0.95rem', color: '#111', wordWrap: 'break-word', paddingBottom: '12px' }}>
                  {msg.text.split("\n").map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </div>
                
                <div style={{ position: 'absolute', bottom: '4px', right: '8px', fontSize: '0.7rem', color: '#888' }}>
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Bottom) */}
        <div style={{ background: '#f0f2f5', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', width: '100%', gap: '10px' }}>
            <input 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Ketik pesan..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: 'none', outline: 'none', fontSize: '1rem' }}
            />
            <button type="submit" disabled={!text.trim()} style={{ 
              background: text.trim() ? '#00a884' : '#cbd5e1', 
              color: 'white', 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: 'none',
              cursor: text.trim() ? 'pointer' : 'default',
              transition: 'background 0.2s'
            }}>
              <Send size={20} style={{ marginLeft: '4px' }} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

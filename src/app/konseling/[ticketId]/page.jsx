"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, ShieldAlert, Bot, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TicketChatPage() {
  const params = useParams();
  const ticketId = params.ticketId;
  
  const [messages, setMessages] = useState([]);
  const [ticketStatus, setTicketStatus] = useState("PENDING");
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    try {
      // Fetch ticket status first to know if we are ACTIVE or PENDING
      const tRes = await fetch(`/api/bk/tickets`);
      const tData = await tRes.json();
      if (tData.success) {
        const currentTicket = tData.tickets.find(t => t.id === ticketId);
        if (currentTicket) setTicketStatus(currentTicket.status);
      }

      const res = await fetch(`/api/bk/chat?ticketId=${ticketId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const value = text;
    setText("");

    try {
      await fetch('/api/bk/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, text: value })
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAction(actionType) {
    try {
      await fetch('/api/bk/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, text: "", actionType, isAction: true })
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div style={{ background: '#f1f5f9', minHeight: '90vh', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: '75vh' }}>
          
          {/* Header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/konseling" style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', background: '#f8fafc' }}>
              <ArrowLeft size={18} />
            </Link>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>Ruang Konseling BK</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                <span style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', 
                  background: ticketStatus === 'ACTIVE' ? '#22c55e' : '#f59e0b' 
                }} />
                <span style={{ color: '#64748b' }}>
                  {ticketStatus === 'ACTIVE' ? 'Terhubung dengan Guru BK' : 'Menunggu balasan Guru BK'}
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fafafa' }}>
            {messages.length === 0 && (
              <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8' }}>
                Belum ada percakapan. Mulailah dengan menceritakan masalahmu.
              </div>
            )}
            
            {messages.map(msg => {
              if (msg.sender === 'SYSTEM') {
                return (
                  <div key={msg.id} style={{ alignSelf: 'center', background: '#fef3c7', color: '#92400e', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500' }}>
                    {msg.text}
                  </div>
                );
              }

              if (msg.isAction && msg.sender === 'ADMIN_BK') {
                return (
                  <div key={msg.id} style={{ alignSelf: 'center', background: '#fee2e2', border: '1px solid #fca5a5', padding: '1.5rem', borderRadius: '12px', maxWidth: '80%', textAlign: 'center' }}>
                    <ShieldAlert size={32} color="#dc2626" style={{ margin: '0 auto 0.5rem auto' }} />
                    <h3 style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ajakan Sesi Offline</h3>
                    <p style={{ color: '#7f1d1d', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                      Guru BK mengajak kamu bertemu langsung. Jika setuju, identitasmu (Nama & NISN) akan diungkapkan kepada Guru BK.
                    </p>
                    <button 
                      onClick={() => handleAction('AGREE_UNMASK')}
                      style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 'bold' }}
                    >
                      Setuju & Buka Identitas
                    </button>
                  </div>
                );
              }

              const isUser = msg.sender === 'USER';
              return (
                <div key={msg.id} style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', gap: '0.75rem', flexDirection: isUser ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isUser ? '#2563eb' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>
                      {isUser ? 'Kamu' : 'Guru BK'}
                    </span>
                    <div style={{ 
                      padding: '0.875rem 1rem', 
                      borderRadius: '12px',
                      background: isUser ? '#2563eb' : 'white',
                      color: isUser ? 'white' : '#1e293b',
                      border: isUser ? 'none' : '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      lineHeight: '1.5',
                      borderTopRightRadius: isUser ? '0' : '12px',
                      borderTopLeftRadius: !isUser ? '0' : '12px'
                    }}>
                      {msg.text.split("\n").map((line, j, arr) => (
                        <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: 'white', borderRadius: '0 0 16px 16px' }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Ketik balasan..."
                style={{ flex: 1, padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc' }}
              />
              <button
                type="submit"
                disabled={!text.trim()}
                style={{ background: '#2563eb', color: 'white', padding: '0 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !text.trim() ? 0.5 : 1 }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

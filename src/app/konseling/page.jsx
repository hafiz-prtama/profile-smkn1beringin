"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Send, RefreshCw, X, MessageCircle } from "lucide-react";

const CATEGORIES = [
  "Akademik & Belajar",
  "Karir & Pendidikan",
  "Perundungan (Bullying)",
  "Kesehatan Mental",
  "Keluarga",
  "Sosial & Pertemanan",
  "Lain-lain"
];

export default function KonselingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Login State
  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tickets State
  const [tickets, setTickets] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [complaint, setComplaint] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    // Basic check if token exists (we can fetch tickets to verify)
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      const res = await fetch('/api/bk/tickets');
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
        setUser(true); // User is logged in
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        fetchTickets();
      } else {
        setLoginError(data.message || "Login gagal");
      }
    } catch (err) {
      setLoginError("Terjadi kesalahan sistem");
    }
  }

  async function handleSubmitTicket(e) {
    e.preventDefault();
    setSubmitError("");
    if (selectedCategories.length === 0 || selectedCategories.length > 3) {
      setSubmitError("Pilih 1 - 3 kategori permasalahan");
      return;
    }
    if (!complaint.trim()) {
      setSubmitError("Tuliskan keluhan awal kamu");
      return;
    }

    try {
      const res = await fetch('/api/bk/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: selectedCategories, complaint })
      });
      const data = await res.json();
      if (data.success) {
        setComplaint("");
        setSelectedCategories([]);
        fetchTickets();
      } else {
        setSubmitError(data.error || "Gagal membuat tiket");
      }
    } catch (err) {
      setSubmitError("Terjadi kesalahan sistem");
    }
  }

  function toggleCategory(cat) {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      if (selectedCategories.length >= 3) return;
      setSelectedCategories(prev => [...prev, cat]);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="main-content" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ background: '#eff6ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Shield size={32} color="#2563eb" />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Login Konseling BK</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Area privasi khusus siswa.</p>
            </div>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>NISN</label>
                <input 
                  type="text" 
                  value={nisn} 
                  onChange={e => setNisn(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  placeholder="Masukkan NISN"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Password / Tanggal Lahir</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  placeholder="********"
                />
              </div>
              {loginError && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{loginError}</div>}
              
              <button type="submit" style={{ marginTop: '1rem', background: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} /> Masuk Area Privasi
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const activeTicketsCount = tickets.filter(t => t.status === 'PENDING' || t.status === 'ACTIVE').length;
  const canCreateNew = activeTicketsCount < 2;

  return (
    <>
      <div className="main-content" style={{ minHeight: '80vh', background: '#f1f5f9', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Kiri: Daftar Tiket */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Sesi Konseling Kamu</h1>
            
            {tickets.length === 0 ? (
              <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
                <MessageCircle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <p>Belum ada riwayat konseling.</p>
              </div>
            ) : (
              tickets.map(ticket => {
                const isClosed = ticket.status === 'CLOSED';
                return (
                  <div key={ticket.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          {(() => {
                            let cats = [];
                            try { cats = JSON.parse(ticket.categories); } catch(e){}
                            return Array.isArray(cats) ? cats.map(c => (
                              <span key={c} style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '999px', fontWeight: '500' }}>
                                {c}
                              </span>
                            )) : null;
                          })()}
                        </div>
                        <p style={{ color: '#334155', fontSize: '0.875rem' }}>Diajukan: {new Date(ticket.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        background: ticket.status === 'ACTIVE' ? '#dcfce7' : (ticket.status === 'PENDING' ? '#fef3c7' : '#f1f5f9'),
                        color: ticket.status === 'ACTIVE' ? '#166534' : (ticket.status === 'PENDING' ? '#92400e' : '#475569')
                      }}>
                        {ticket.status}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.95rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                      {ticket.complaint}
                    </div>
                    
                    {!isClosed && (
                      <div style={{ alignSelf: 'flex-end' }}>
                        <Link href={`/konseling/${ticket.id}`} style={{ display: 'inline-block', background: ticket.status === 'ACTIVE' ? '#2563eb' : '#94a3b8', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>
                          {ticket.status === 'ACTIVE' ? 'Masuk Ruang Obrolan' : 'Lihat Status'}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Kanan: Form Pengajuan */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Ajukan Sesi Baru</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Identitas kamu aman dan dirahasiakan.</p>
            
            {!canCreateNew ? (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                Kamu sudah memiliki 2 sesi aktif. Harap selesaikan terlebih dahulu sebelum mengajukan sesi baru.
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    Kategori (Pilih 1 - 3)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {CATEGORIES.map(cat => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          disabled={!isSelected && selectedCategories.length >= 3}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: `1px solid ${isSelected ? '#3b82f6' : '#cbd5e1'}`,
                            background: isSelected ? '#eff6ff' : 'white',
                            color: isSelected ? '#1d4ed8' : '#475569',
                            cursor: (!isSelected && selectedCategories.length >= 3) ? 'not-allowed' : 'pointer',
                            opacity: (!isSelected && selectedCategories.length >= 3) ? 0.5 : 1
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                    Ceritakan keluhanmu
                  </label>
                  <textarea 
                    rows={4}
                    value={complaint}
                    onChange={e => setComplaint(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                    placeholder="Saya merasa kesulitan dalam..."
                  />
                </div>

                {submitError && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{submitError}</div>}

                <button type="submit" style={{ background: '#10b981', color: 'white', padding: '0.875rem', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={18} /> Kirim Pengajuan
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Send, RefreshCw, MessageCircle } from "lucide-react";

const CATEGORIES = [
  "Akademik & Belajar",
  "Karir & Pendidikan",
  "Perundungan (Bullying)",
  "Kesehatan Mental",
  "Keluarga",
  "Sosial & Pertemanan",
  "Lain-lain"
];

function KonselingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "siswa"; // Default "siswa"
  
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Tickets State
  const [tickets, setTickets] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [complaint, setComplaint] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("bkAnonUserId");
    if (!id) {
      id = "bk_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("bkAnonUserId", id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, [userId]);

  async function fetchTickets() {
    try {
      setLoading(true);
      const res = await fetch(`/api/bk/tickets?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ 
          userId, 
          userType: typeParam,
          categories: selectedCategories, 
          complaint 
        })
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
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw className="animate-spin" />
      </div>
    );
  }

  const activeTicketsCount = tickets.filter(t => t.status === 'PENDING' || t.status === 'ACTIVE').length;
  const canCreateNew = activeTicketsCount < 2;
  const userTypeLabel = typeParam === 'orang_tua' ? 'Orang Tua' : 'Siswa';

  return (
    <div className="main-content" style={{ minHeight: '80vh', background: '#f1f5f9', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Kiri: Daftar Tiket */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#2563eb', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
              <Shield size={24} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              Ruang Konseling ({userTypeLabel})
            </h1>
          </div>
          
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
                      <Link href={`/konseling/${ticket.id}?userId=${userId}`} style={{ display: 'inline-block', background: ticket.status === 'ACTIVE' ? '#2563eb' : '#94a3b8', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>
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
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Identitas Anda aman dan dirahasiakan.</p>
          
          {!canCreateNew ? (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
              Anda sudah memiliki 2 sesi aktif. Harap selesaikan terlebih dahulu sebelum mengajukan sesi baru.
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
                  Ceritakan keluhan
                </label>
                <textarea 
                  rows={4}
                  value={complaint}
                  onChange={e => setComplaint(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                  placeholder={typeParam === 'orang_tua' ? "Saya ingin mengkonsultasikan mengenai anak saya..." : "Saya merasa kesulitan dalam..."}
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
  );
}

export default function KonselingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw className="animate-spin" />
      </div>
    }>
      <KonselingContent />
    </Suspense>
  );
}

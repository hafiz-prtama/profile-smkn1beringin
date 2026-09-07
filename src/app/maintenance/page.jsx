"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Clock,
  Radio,
  Sparkles,
  KeyRound,
  ArrowRight,
  RefreshCw,
  School,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function MaintenancePage() {
  const [secretInput, setSecretInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [validating, setValidating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: "02", minutes: "45", seconds: "18" });
  const [maintenanceInfo, setMaintenanceInfo] = useState({
    message: "Kami sedang melakukan peningkatan infrastruktur server & penyempurnaan sistem informasi digital.",
  });

  // Fetch pesan maintenance jika tersedia
  useEffect(() => {
    fetch("/api/maintenance/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMaintenanceInfo({ message: data.message });
        }
      })
      .catch(() => {});
  }, []);

  // Animasi timer visual futuristik
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeRemaining({
        hours: String(Math.abs(23 - now.getHours())).padStart(2, "0"),
        minutes: String(Math.abs(59 - now.getMinutes())).padStart(2, "0"),
        seconds: String(Math.abs(59 - now.getSeconds())).padStart(2, "0")
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBypassSubmit = async (e) => {
    e.preventDefault();
    if (!secretInput.trim()) return;

    setValidating(true);
    setErrorMsg("");

    try {
      // Direct redirect ke URL bypass secret
      window.location.href = `/${encodeURIComponent(secretInput.trim())}`;
    } catch (err) {
      setErrorMsg("Koneksi gagal saat mencoba bypass");
      setValidating(false);
    }
  };

  return (
    <div className="maint-wrapper">
      {/* Dynamic Ambient Background Glows */}
      <div className="maint-glow-orb maint-glow-1"></div>
      <div className="maint-glow-orb maint-glow-2"></div>
      <div className="maint-grid-overlay"></div>

      <div className="maint-card">
        {/* Header Badge */}
        <div className="maint-status-pill">
          <span className="maint-pulse-dot"></span>
          <Radio size={14} className="maint-pulse-icon" />
          <span>SYSTEM MAINTENANCE IN PROGRESS</span>
        </div>

        {/* Brand Identity */}
        <div className="maint-brand">
          <div className="maint-logo-wrap">
            <School size={28} className="text-accent" />
          </div>
          <div className="maint-brand-text">
            <h2>SMK NEGERI 1 BERINGIN</h2>
            <p>Digital Academic & Vocational Platform</p>
          </div>
        </div>

        {/* Main Title & Description */}
        <div className="maint-content">
          <div className="maint-icon-badge">
            <Wrench size={38} className="maint-wrench-icon" />
            <Sparkles size={20} className="maint-sparkle-icon" />
          </div>
          
          <h1 className="maint-title">
            Sedang Dalam <span className="maint-gradient-text">Peningkatan Sistem</span>
          </h1>

          <p className="maint-desc">
            {maintenanceInfo.message || "Mohon maaf atas ketidaknyamanannya. Portal utama kami sedang dalam pembaruan rutin untuk menghadirkan performa yang lebih cepat, aman, dan fitur yang lebih kaya."}
          </p>
        </div>

        {/* Futuristic Status Indicator Cards */}
        <div className="maint-status-grid">
          <div className="maint-stat-item">
            <div className="maint-stat-icon">
              <Clock size={18} />
            </div>
            <div className="maint-stat-meta">
              <span className="maint-stat-label">Estimasi Selesai</span>
              <div className="maint-countdown">
                <span>{timeRemaining.hours}</span>:
                <span>{timeRemaining.minutes}</span>:
                <span>{timeRemaining.seconds}</span>
              </div>
            </div>
          </div>

          <div className="maint-stat-item">
            <div className="maint-stat-icon">
              <ShieldCheck size={18} />
            </div>
            <div className="maint-stat-meta">
              <span className="maint-stat-label">Integritas Data</span>
              <span className="maint-stat-value text-emerald">100% Aman & Terlindungi</span>
            </div>
          </div>
        </div>

        {/* Admin Secret Bypass Form (Laravel like --secret) */}
        <div className="maint-bypass-section">
          <div className="maint-bypass-header">
            <KeyRound size={16} />
            <span>Akses Otoritas Staf / Bypass Secret Code</span>
          </div>

          <form onSubmit={handleBypassSubmit} className="maint-bypass-form">
            <div className="maint-input-wrapper">
              <input
                type="text"
                placeholder="Masukkan Secret Code..."
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                disabled={validating}
                className="maint-input"
              />
              <button
                type="submit"
                disabled={validating || !secretInput.trim()}
                className="maint-submit-btn"
              >
                {validating ? (
                  <RefreshCw size={16} className="maint-spin" />
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
            {errorMsg && (
              <div className="maint-error-hint">
                <AlertTriangle size={13} />
                <span>{errorMsg}</span>
              </div>
            )}
            <span className="maint-hint">
              Ketik kode rahasia yang ditentukan saat <code>npm run down -- --secret=kode</code>
            </span>
          </form>
        </div>

        {/* Footer info */}
        <div className="maint-footer">
          <span>&copy; {new Date().getFullYear()} SMKN 1 Beringin. Pusat Sistem Informasi & Jaringan.</span>
        </div>
      </div>
    </div>
  );
}

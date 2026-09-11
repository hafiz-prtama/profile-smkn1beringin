"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SchoolIntroShowcase({ school = {} }) {
  // Animasi 2 tahap:
  // tahap 1: 'idle' -> 'rising' (foto muncul dari bawah ke atas dalam kondisi tajam)
  // tahap 2: 'blurred' (setelah 3.5 detik foto menjadi buram di dalam border dan teks muncul)
  const [animationState, setAnimationState] = useState("idle"); // 'idle' | 'rising' | 'blurred'
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const startAnimationSequence = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // Mulai dengan memunculkan foto dari bawah ke atas (tajam)
    setAnimationState("rising");

    // Selang 3.5 detik, foto berubah menjadi buram di dalam border dan teks tampil
    timerRef.current = setTimeout(() => {
      setAnimationState("blurred");
    }, 1500);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Ketika pengunjung scroll sampai ke bagian profil
            startAnimationSequence();
          } else {
            // Reset saat pengguna scroll jauh keluar dari viewport
            if (timerRef.current) clearTimeout(timerRef.current);
            setAnimationState("idle");
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isRising = animationState === "rising" || animationState === "blurred";
  const isBlurred = animationState === "blurred";

  return (
    <div
      ref={containerRef}
      className={`intro-showcase-wrapper ${isRising ? "is-rising" : ""} ${isBlurred ? "is-blurred" : ""}`}
    >
      <div className={`intro-showcase-card ${isBlurred ? "card-bordered-active" : ""}`}>
        
        {/* Layer Gambar Gedung Transparan */}
        <div className="intro-showcase-img-track">
          <img
            src="/gedungsmk.jpeg?v=2026_clean"
            alt="Gedung SMK Negeri 1 Beringin"
            className={`intro-showcase-img ${isRising ? "img-enter-up" : ""} ${isBlurred ? "img-blur-active" : ""}`}
          />
        </div>

        {/* Layer Overlay Kaca / Frosted Glass saat buram */}
        <div className={`intro-showcase-overlay ${isBlurred ? "overlay-visible" : ""}`} />

        {/* Konten Teks yang diambil dari Dashboard */}
        <div className={`intro-showcase-content ${isBlurred ? "content-visible" : ""}`}>
          <div className="intro-showcase-content-inner">
            <span className="intro-badge">TENTANG SEKOLAH</span>

            <h2 className="intro-showcase-title">
              {school.tagline || school.name || "Tempat Bertumbuh, Belajar, dan Berkarya"}
            </h2>

            <p className="intro-showcase-desc">
              {school.description || "SMK Negeri 1 Beringin hadir sebagai sekolah kejuruan yang berfokus pada pengembangan kompetensi, karakter, dan inovasi."}
            </p>

            <div className="intro-showcase-actions">
              <Link href="/profil" className="button primary intro-cta-btn">
                Selengkapnya <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

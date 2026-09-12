"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Fallback foto kegiatan jika data dari database kurang dari 5
const FALLBACK_PHOTOS = [
  { id: "fb-1", image: "/gedungsekolah.JPEG", alt: "Gedung Sekolah SMK Negeri 1 Beringin" },
  { id: "fb-2", image: "/news-placeholder.svg", alt: "Kegiatan Praktik Siswa" },
  { id: "fb-3", image: "/facility-placeholder.svg", alt: "Laboratorium & Fasilitas" },
  { id: "fb-4", image: "/placeholder-person.svg", alt: "Prestasi & Prestisius Siswa" },
  { id: "fb-5", image: "/gedungsekolah.JPEG", alt: "Lingkungan Belajar Hijau & Ramah" },
];

// Konfigurasi posisi sebar (meja) untuk masing-masing dari 5 foto
const SCATTER_CONFIG = [
  {
    rotate: -9,
    xPercent: -175,
    yPx: 16,
    zIndex: 1,
    delay: 0,
  },
  {
    rotate: 4,
    xPercent: -88,
    yPx: -16,
    zIndex: 2,
    delay: 80,
  },
  {
    rotate: -2,
    xPercent: 0,
    yPx: -26,
    zIndex: 5,
    delay: 160,
  },
  {
    rotate: 8,
    xPercent: 88,
    yPx: -8,
    zIndex: 3,
    delay: 240,
  },
  {
    rotate: -6,
    xPercent: 175,
    yPx: 18,
    zIndex: 2,
    delay: 320,
  },
];

export default function ScatteredPhotoDeck({ photos = [] }) {
  const [isSpread, setIsSpread] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeLightbox, setActiveLightbox] = useState(null);
  const hasTriggeredRef = useRef(false);

  // Ambil tepat 5 foto
  const validPhotos = Array.isArray(photos) ? photos.filter((p) => p && p.image) : [];
  const displayPhotos = Array.from({ length: 5 }, (_, i) => {
    return validPhotos[i] || FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length];
  });

  useEffect(() => {
    const triggerSpread = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      // Beri sedikit jeda setelah preloader tirai terbuka agar transisi terlihat dinamis
      setTimeout(() => {
        setIsSpread(true);
      }, 250);
    };

    // 1. Dengarkan event selesai preloader
    window.addEventListener("intro-complete", triggerSpread);

    // 2. Jika preloader tidak aktif (misal reload di tengah halaman atau non-intro)
    if (typeof document !== "undefined") {
      if (!document.body.classList.contains("intro-active")) {
        triggerSpread();
      }
    }

    // 3. Fallback pengaman maksimal 3 detik
    const fallbackTimer = setTimeout(triggerSpread, 3200);

    return () => {
      window.removeEventListener("intro-complete", triggerSpread);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <>
      <div className="scattered-deck-stage">
        {/* Latar visual grid khusus di balik tumpukan foto */}
        <div className="scattered-deck-grid-bg" aria-hidden="true" />

        <div className="scattered-deck-container">
          {displayPhotos.map((item, idx) => {
            const cfg = SCATTER_CONFIG[idx] || SCATTER_CONFIG[0];
            const isHovered = hoveredIdx === idx;

            // Transformasi dinamis:
            // Saat belum spread: terkumpul di 1 titik tengah meja
            // Saat sudah spread: berpencar ke posisi masing-masing
            // Saat kursor mengarah (hover): membesar (scale), terangkat, lurus ke depan dengan bayangan kuat
            let transformStyle = "";
            let zIndexStyle = cfg.zIndex;

            if (!isSpread) {
              // Tumpukan di 1 tempat (sedikit rotasi acak tumpukan kartu)
              const stackJitter = (idx - 2) * 1.5;
              transformStyle = `translate(-50%, -50%) translate(0px, 0px) rotate(${stackJitter}deg) scale(0.88)`;
              zIndexStyle = idx + 1;
            } else if (isHovered) {
              // Membesar saat di-hover kursor
              transformStyle = `translate(-50%, -50%) translate(calc(${cfg.xPercent}% * var(--scatter-scale, 1)), ${cfg.yPx - 28}px) rotate(0deg) scale(1.24)`;
              zIndexStyle = 50;
            } else {
              // Posisi menyebar di meja
              transformStyle = `translate(-50%, -50%) translate(calc(${cfg.xPercent}% * var(--scatter-scale, 1)), ${cfg.yPx}px) rotate(${cfg.rotate}deg) scale(1)`;
              zIndexStyle = cfg.zIndex;
            }

            return (
              <div
                key={item.id || idx}
                className={`photo-paper-card ${isSpread ? "is-spread" : "is-stacked"} ${
                  isHovered ? "is-hovered" : ""
                }`}
                style={{
                  transform: transformStyle,
                  zIndex: zIndexStyle,
                  transitionDelay: !isSpread || isHovered ? "0ms" : `${cfg.delay}ms`,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setActiveLightbox(item.image)}
                title="Klik untuk melihat foto lebih jelas"
              >
                <div className="photo-paper-inner">
                  <Image
                    src={item.image}
                    alt={item.alt || `Dokumentasi Kegiatan ${idx + 1}`}
                    fill
                    sizes="240px"
                    className="photo-paper-img"
                    priority={idx < 2}
                    unoptimized={typeof item.image === "string" && (item.image.startsWith("data:") || item.image.endsWith(".svg"))}
                  />
                  {/* Efek kilau kertas foto */}
                  <div className="photo-paper-gloss" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Pop-up saat foto diklik */}
      {activeLightbox && (
        <div className="photo-deck-lightbox" onClick={() => setActiveLightbox(null)}>
          <button className="photo-deck-lightbox-close" onClick={() => setActiveLightbox(null)}>
            ✕
          </button>
          <div className="photo-deck-lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <img src={activeLightbox} alt="Dokumentasi Kegiatan" />
          </div>
        </div>
      )}
    </>
  );
}

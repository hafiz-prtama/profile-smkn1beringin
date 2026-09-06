"use client";

import React, { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { useData } from "@/context/DataContext";

// ─── Kategori warna ───────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Akademik": { bg: "#eaf2ff", text: "#1557a6", dot: "#2563eb" },
  "Kompetisi": { bg: "#fff7e6", text: "#92400e", dot: "#f59e0b" },
  "Non-Akademik": { bg: "#f0fdf4", text: "#14532d", dot: "#22c55e" },
};
function getCategoryStyle(cat) {
  return CATEGORY_COLORS[cat] ?? { bg: "#f3f0ff", text: "#4c1d95", dot: "#8b5cf6" };
}

export default function Achievements() {
  const { achievements } = useData();
  const sortedAchievements = [...achievements].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  const [lightbox, setLightbox] = useState(null); // simpan src gambar yang dibuka

  return (
    <>
      <PageHero title="Prestasi" subtitle="Dokumentasi pencapaian sekolah dan peserta didik." />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="PENCAPAIAN"
            title="Prestasi sekolah"
            description="Konten dapat dikelola dari dashboard admin."
          />

          {sortedAchievements.length === 0 ? (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "40px 0" }}>
              Belum ada prestasi yang ditambahkan.
            </p>
          ) : (
            <div className="achievement-cards-grid">
              {sortedAchievements.map((item) => {
                const catStyle = getCategoryStyle(item.category);
                return (
                  <article className="achievement-card-new" key={item.id}>
                    {/* ── Area Gambar ── */}
                    <div
                      className="achievement-card-img"
                      onClick={() => item.image && setLightbox(item.image)}
                      style={{ cursor: item.image ? "zoom-in" : "default" }}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        <div className="achievement-card-img-placeholder">
                          <span className="trophy-emoji">🏆</span>
                          <span>Belum ada foto</span>
                        </div>
                      )}
                    </div>

                    {/* ── Konten ── */}
                    <div className="achievement-card-body">
                      <div className="achievement-card-meta">
                        <span
                          className="achievement-badge"
                          style={{ background: catStyle.bg, color: catStyle.text }}
                        >
                          <span className="badge-dot" style={{ background: catStyle.dot }} />
                          {item.category}
                        </span>
                        <span className="achievement-year">{item.year}</span>
                      </div>
                      <h3 className="achievement-card-title">{item.title}</h3>
                      {item.description && (
                        <p className="achievement-card-desc">{item.description}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox gambar ── */}
      {lightbox && (
        <div className="achievement-lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="Bukti Prestasi" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

function PageHero({ title, subtitle }) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="eyebrow light">PRESTASI</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
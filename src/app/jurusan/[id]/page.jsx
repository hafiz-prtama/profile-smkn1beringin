"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, BookOpen } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function MajorDetail() {
  const { id } = useParams();
  const { majors } = useData();
  const major = majors.find((item) => item.id === id);
  if (!major) return <NotFound />;

  const hasImage = major.image && !major.image.includes("placeholder") && !major.image.includes(".svg");

  return (
    <section className="section detail-page">
      <div className="container">
        <Link href="/jurusan" className="back-link"><ArrowLeft size={16} /> Semua jurusan</Link>

        {/* Foto jurusan jika ada */}
        {hasImage && (
          <div className="major-detail-image">
            <img src={major.image} alt={major.name} />
          </div>
        )}

        <div className="detail-layout">
          <div>
            <span className="eyebrow">{major.short}</span>
            <h1>{major.name}</h1>
            <p className="lead">{major.description}</p>
            <div className="detail-card">
              <h2>Kompetensi yang dipelajari</h2>
              {(major.skills ?? []).map((skill) => <div className="check-row" key={skill}><CheckCircle2 size={18} />{skill}</div>)}
              {(!major.skills || major.skills.length === 0) && (
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Belum ada kompetensi yang ditambahkan.</p>
              )}
            </div>
          </div>
          <aside className="side-card">
            <BriefcaseBusiness size={28} />
            <h3>Prospek kerja</h3>
            {(major.career ?? []).map((item) => <span key={item}>{item}</span>)}
            {(!major.career || major.career.length === 0) && (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Belum ada data prospek kerja.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
function NotFound() { return <div className="section"><div className="container"><h1>Jurusan tidak ditemukan.</h1></div></div>; }
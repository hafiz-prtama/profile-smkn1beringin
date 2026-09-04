"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function FacilityDetail() {
  const { id } = useParams();
  const { facilities } = useData();
  const item = facilities.find((x) => String(x.id) === id);
  if (!item) return (
    <div className="section">
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1>Fasilitas tidak ditemukan.</h1>
        <Link href="/fasilitas" className="back-link" style={{ marginTop: 16, display: "inline-flex" }}>
          <ArrowLeft size={16} /> Semua fasilitas
        </Link>
      </div>
    </div>
  );

  const hasImage = item.image && !item.image.includes("placeholder");

  return (
    <section className="section detail-page">
      <div className="container content-narrow">
        <Link href="/fasilitas" className="back-link"><ArrowLeft size={16} /> Semua fasilitas</Link>
        <span className="eyebrow">FASILITAS SEKOLAH</span>
        <h1>{item.name}</h1>

        {hasImage ? (
          <img className="detail-image" src={item.image} alt={item.name} />
        ) : (
          <div className="detail-image-placeholder">
            <Building2 size={48} />
            <span>Belum ada foto untuk fasilitas ini</span>
            <small>Upload foto dari Dashboard → Fasilitas</small>
          </div>
        )}

        <div className="prose-card"><p>{item.description}</p></div>
      </div>
    </section>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Newspaper, Play } from "lucide-react";
import { getVideoType, getSocialThumbnail, getVideoLabel } from "@/utils/socialVideo";
import { useData } from "@/context/DataContext";

export default function NewsDetail() {
  const { id } = useParams();
  const { news } = useData();
  const item = news.find((x) => String(x.id) === id);
  if (!item) return (
    <div className="section">
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1>Berita tidak ditemukan.</h1>
        <Link href="/berita" className="back-link" style={{ marginTop: 16, display: "inline-flex" }}>
          <ArrowLeft size={16} /> Kembali ke berita
        </Link>
      </div>
    </div>
  );

  const hasImage = item.image && !item.image.includes("placeholder");

  return (
    <section className="section detail-page">
      <div className="container content-narrow">
        <Link href="/berita" className="back-link"><ArrowLeft size={16} /> Kembali ke berita</Link>
        <h1>{item.title}</h1>
        <div className="detail-meta"><CalendarDays size={16} /> {item.date}{item.uploader && <><span>•</span> Oleh: <strong>{item.uploader}</strong></>}</div>

        {hasImage ? (
          <img className="detail-image" src={item.image} alt={item.title} />
        ) : (
          <div className="detail-image-placeholder">
            <Newspaper size={48} />
            <span>Belum ada foto untuk berita ini</span>
          </div>
        )}

        {item.videoLink && (
          <a className="news-detail-video-link" href={item.videoLink} target="_blank" rel="noreferrer">
            {getSocialThumbnail(item.videoLink) ? (
              <img src={getSocialThumbnail(item.videoLink)} alt={`Thumbnail video ${item.title}`} />
            ) : (
              <div className="news-detail-video-placeholder"><Play size={34} /></div>
            )}
            <div>
              <strong>Tonton video di {getVideoLabel(item.videoLink)}</strong>
              <span>Buka video dari link yang dibagikan.</span>
            </div>
          </a>
        )}

        <div className="prose-card"><p>{item.content}</p></div>
      </div>
    </section>
  );
}
"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import NewsCard from "@/components/NewsCard";
import { useData } from "@/context/DataContext";

export default function News() {
  const { news } = useData();
  const sortedNews = [...news].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  return (
    <>
      <PageHero title="Berita & Informasi" subtitle="Kabar terbaru dari lingkungan sekolah." />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="BERITA" title="Berita terbaru" description="Data contoh ini nantinya dapat diambil dari Laravel API." />
          <div className="cards-grid news-grid">{sortedNews.map((item) => <NewsCard key={item.id} item={item} />)}</div>
        </div>
      </section>
    </>
  );
}
function PageHero({ title, subtitle }) { return <section className="page-hero"><div className="container"><span className="eyebrow light">BERITA SEKOLAH</span><h1>{title}</h1><p>{subtitle}</p></div></section>; }
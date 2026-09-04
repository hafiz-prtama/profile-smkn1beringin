"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import FacilityCard from "@/components/FacilityCard";
import { useData } from "@/context/DataContext";

export default function Facilities() {
  const { facilities } = useData();
  return (
    <>
      <PageHero title="Fasilitas Sekolah" subtitle="Sarana yang mendukung pembelajaran dan aktivitas siswa." />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="FASILITAS" title="Lingkungan belajar" description="Gambar dan keterangan dapat diganti melalui dashboard admin." />
          <div className="cards-grid facilities-grid">{facilities.map((item) => <FacilityCard key={item.id} item={item} />)}</div>
        </div>
      </section>
    </>
  );
}
function PageHero({ title, subtitle }) { return <section className="page-hero"><div className="container"><span className="eyebrow light">FASILITAS</span><h1>{title}</h1><p>{subtitle}</p></div></section>; }
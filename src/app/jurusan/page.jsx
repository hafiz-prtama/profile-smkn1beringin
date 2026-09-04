"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import MajorCard from "@/components/MajorCard";
import { useData } from "@/context/DataContext";

export default function Majors() {
  const { majors } = useData();
  return (
    <>
      <PageHero title="Program Keahlian" subtitle="Kenali kompetensi dan bidang yang dapat kamu pelajari." />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="JURUSAN" title="Program keahlian SMK Negeri 1 Beringin" description="Kenali tujuh program keahlian yang tersedia dan temukan bidang yang sesuai dengan minat serta rencana masa depanmu." />
          <div className="cards-grid majors-grid">{majors.map((major) => <MajorCard key={major.id} major={major} />)}</div>
        </div>
      </section>
    </>
  );
}
function PageHero({ title, subtitle }) { return <section className="page-hero"><div className="container"><span className="eyebrow light">PROGRAM KEAHLIAN</span><h1>{title}</h1><p>{subtitle}</p></div></section>; }
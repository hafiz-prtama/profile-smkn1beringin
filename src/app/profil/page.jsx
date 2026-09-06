"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import SectionHeading from "@/components/SectionHeading";
import PersonCard from "@/components/PersonCard";

export default function Profile() {
  const { school } = useData();
  return (
    <>
      <PageHero title="Profil Sekolah" subtitle="Mengenal lebih dekat SMK Negeri 1 Beringin." />
      <section className="section">
        <div className="container content-narrow">
          <SectionHeading eyebrow="TENTANG KAMI" title="SMK Negeri 1 Beringin" description={school.description} />
          <div className="prose-card">
            <h3>Sejarah Sekolah</h3>
            <p>Bagian sejarah sekolah dapat kamu isi dengan sejarah resmi, tahun berdiri, perkembangan sekolah, dan pencapaian penting dari masa ke masa.</p>
            <h3>Visi</h3>
            <p>Menjadi SMK Model Impelementasi Pembelajaran
              Mendalam dan KKA (Koding Kecerdasan Artifichial),
              sebagai Pusat Pendidikan Vokasi Tekno-Kreatif Yang
              Beriman, Berkarakter, Berprestasi , dan Berwawasan
              Lingkungan</p>
            <h3>Misi</h3>
            <p>- Kurikulum Mengintegrasikan Kurikulum Sekolah 5
              dengan Mitra industri
            </p>
            <p>- Melaksanakan Serifikasi kompetensi yg diakui oleh
              asosiasi industri</p>
            <p>- Meningkatkan Kompetensi Guru dan Tenaga
              Kependidikan melalui Upskilling dan Reskilling
            </p>
            <p>- Mengembangkan Karakter Kompetensi Bakat
              Kepemimpinan dan Jiwa Kewirausahaan Murid
              Berdasarkan 8 Dimensi Profil Lulusan , agar
              menjadi lulusan yang Kreatif Mandiri Adaptif dan
              mampu menciptakan peluang kerja
            </p>
            <p>- Mewujudkan lingkungan belajar yang bersih hijau,
              aman, nyaman, sehat, dan ramah lingkungan untuk
              mendukung pembelajaran yang berpusat pada
              murid serta membentuk karakter lingkungan
            </p>
            <p>- Mengoptimalkan Pemanfaatan Teknologi AI, IoT, dan
              Platform Digital dalam Kegiatan Pembelajaran dan
              Pengelolaan Sekolah Guna Mendukung
              Transformasi Digital
            </p>
            <p></p>
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <SectionHeading eyebrow="PIMPINAN" title="Kepala Sekolah & Wakil" center />
          <div className="leaders-grid">
            <PersonCard person={school.principal} principal />
            <PersonCard person={school.vicePrincipal} />
          </div>
        </div>
      </section>
    </>
  );
}

function PageHero({ title, subtitle }) {
  return <section className="page-hero"><div className="container"><span className="eyebrow light">PROFIL SEKOLAH</span><h1>{title}</h1><p>{subtitle}</p></div></section>;
}
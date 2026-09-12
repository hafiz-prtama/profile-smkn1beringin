"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Users, GraduationCap, Trophy, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import SectionHeading from "@/components/SectionHeading";
import PersonCard from "@/components/PersonCard";
import MajorCard from "@/components/MajorCard";
import NewsCard from "@/components/NewsCard";
import FacilityCard from "@/components/FacilityCard";
import ScrollReveal from "@/components/ScrollReveal";
import SchoolIntroShowcase from "@/components/SchoolIntroShowcase";
import ScatteredPhotoDeck from "@/components/ScatteredPhotoDeck";

// ─── Data Statistik Hero ─────────────────────────────────────────────────────
// Nilai statistik dikelola dari Dashboard > Data Siswa & Guru.
const HERO_STATS_TEMPLATE = [
  { icon: <Users size={18} />, key: "studentCount", suffix: "+", label: "Siswa" },
  { icon: <GraduationCap size={18} />, key: "teacherCount", suffix: "+", label: "Guru" },
  { icon: <Trophy size={18} />, key: "achievementCount", suffix: "+", label: "Prestasi" },
  { icon: <Building2 size={18} />, key: "majorCount", suffix: "", label: "Jurusan" },
];

import StatItem from "@/components/StatItem";
import ActivityCarousel from "@/components/ActivityCarousel";

// ─── Halaman Beranda ─────────────────────────────────────────────────────────
export default function Home() {
  const { school, majors, achievements, news, facilities, activityPhotos } = useData();

  // Semua angka mengikuti data yang dapat diedit melalui Dashboard.
  // Fallback dipakai untuk project lama yang belum memiliki field statistik baru.
  const heroStats = HERO_STATS_TEMPLATE.map((stat) => {
    const fallback = stat.key === "majorCount" ? majors.length : stat.key === "achievementCount" ? achievements.length : 0;
    const value = Number(school[stat.key] ?? fallback);
    return { ...stat, value: `${value}${stat.suffix}` };
  });

  const sortedAchievements = [...achievements].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  const sortedNews = [...news].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

  return (
    <>
      {/* ================================================================
          HERO — Banner utama halaman (Gaya Editorial Terpusat dengan Grid & Foto Kertas)
          ================================================================ */}
      <section id="beranda" className="relative min-h-[90vh] flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#f8fbff] to-white">
        {/* Pola latar belakang grid halus */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] opacity-30 mix-blend-multiply pointer-events-none" aria-hidden="true" />
        
        {/* Radial gradient untuk memudarkan grid di pinggir */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f8fbff_70%)] pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-[1160px] px-5 mx-auto flex flex-col items-center">
          {/* Header & Teks Terpusat */}
          <div className="text-center max-w-3xl mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100 text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-sm">
              A JOURNEY THROUGH VISUAL STORIES · SMKN 1 BERINGIN
            </span>

            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] font-extrabold tracking-tight text-slate-900 mb-6 font-['Plus_Jakarta_Sans',sans-serif]">
              <span className="block text-slate-800 font-bold mb-2">Selamat Datang di</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500 pb-2">
                SMK Negeri 1 Beringin
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              {school.tagline || "Membangun Generasi Unggul untuk Masa Depan."}
            </p>
          </div>

          {/* 5 Foto Kertas Menyebar (Animasi tumpuk lalu sebar ke meja, membesar saat di-hover) */}
          <div className="w-full max-w-[900px] h-[350px] md:h-[450px] mb-16 relative">
            <ScatteredPhotoDeck photos={activityPhotos} />
          </div>

          {/* Tombol Aksi di Bawah Foto Sesuai Referensi Gambar */}
          <div className="flex flex-wrap justify-center gap-4 mb-24">
            <button
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm tracking-wide overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/20"
              onClick={() => {
                const el = document.getElementById("profil");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                Kenali Sekolah 
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          {/* Statistik Sekolah */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {heroStats.map(({ icon, value, label }) => (
              <StatItem key={label} icon={icon} value={value} label={label} />
            ))}
          </div>
        </div>
      </section>


      {/* ================================================================
          TENTANG SEKOLAH — Foto Gedung Beranimasi & deskripsi singkat
          ================================================================ */}
      <section id="profil" className="w-full m-0 p-0">
        <SchoolIntroShowcase school={school} />
      </section>


      {/* ================================================================
          PIMPINAN SEKOLAH — Kepala Sekolah
          ================================================================ */}
      <section id="pimpinan" className="py-24 bg-white relative">
        <div className="w-full max-w-[1160px] mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <ScrollReveal animation="left" delay={80} className="w-full md:w-auto">
              <div className="relative w-full max-w-[380px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl shrink-0 border-4 border-white">
                <Image
                  src={school.principal.photo}
                  alt={school.principal.name}
                  width={380}
                  height={460}
                  className="w-full h-auto object-cover"
                  unoptimized={typeof school.principal.photo === "string" && (school.principal.photo.startsWith("data:") || school.principal.photo.endsWith(".svg"))}
                />
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={180} className="flex-1">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                  Sambutan
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">
                  Kepala Sekolah
                </h2>
                <div className="text-lg text-slate-600 space-y-5 mb-10 leading-relaxed">
                  {school.principal.greeting ? (
                    school.principal.greeting.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))
                  ) : (
                    <p>Sambutan belum tersedia.</p>
                  )}
                </div>
                <div className="text-xl text-slate-900 font-bold border-t border-slate-200 pt-6 mt-6 inline-block">
                  {school.principal.name}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* ================================================================
          PROGRAM KEAHLIAN — Daftar jurusan
          ================================================================ */}
      <section id="jurusan" className="py-24 bg-slate-50/50 relative">
        <div className="w-full max-w-[1160px] mx-auto px-5">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="PROGRAM KEAHLIAN"
              title="Pilih bidang yang sesuai dengan masa depanmu."
              description="Program keahlian dirancang untuk membekali siswa dengan kompetensi yang relevan."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {majors.slice(0, 3).map((major, index) => (
              <ScrollReveal key={major.id} animation="jump" delay={index * 130}>
                <MajorCard major={major} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 text-center flex justify-center">
            <Link href="/jurusan" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-blue-600 text-blue-600 rounded-full font-bold text-sm tracking-wide hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
              Lihat Semua Jurusan <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================================
          PRESTASI — Pencapaian terbaru sekolah & siswa
          ================================================================ */}
      <section id="prestasi" className="py-24 bg-white relative">
        <div className="w-full max-w-[1160px] mx-auto px-5">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="PRESTASI"
              title="Pencapaian yang membanggakan."
              description="Bagian ini siap diisi dengan prestasi terbaru sekolah dan siswa."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {sortedAchievements.slice(0, 6).map((item, index) => (
              <ScrollReveal key={item.id} animation="up" delay={index * 100} className="h-full">
                <article className="h-full flex flex-col bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                  {item.image && !item.image.includes("placeholder") ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 bg-slate-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                        unoptimized={typeof item.image === "string" && (item.image.startsWith("data:") || item.image.endsWith(".svg"))}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-slate-50 rounded-xl flex items-center justify-center text-5xl mb-6">
                      🏆
                    </div>
                  )}
                  <span className="inline-block text-[11px] font-black text-amber-600 tracking-[0.15em] uppercase mb-3">
                    {item.category} · {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mt-auto">
                    {item.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 text-center flex justify-center">
            <Link href="/prestasi" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-amber-500 text-amber-600 rounded-full font-bold text-sm tracking-wide hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
              Lihat Semua Prestasi <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================================
          BERITA TERBARU — Informasi & kegiatan sekolah
          ================================================================ */}
      <section id="berita" className="py-24 bg-slate-50/50 relative">
        <div className="w-full max-w-[1160px] mx-auto px-5">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="BERITA TERBARU"
              title="Informasi dan kegiatan sekolah."
              description="Temukan berita, kegiatan, dan pengumuman terbaru."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {sortedNews.slice(0, 6).map((item, index) => (
              <ScrollReveal key={item.id} animation="news" delay={index * 120} className="h-full">
                <NewsCard item={item} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 text-center flex justify-center">
            <Link href="/berita" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-blue-600 text-blue-600 rounded-full font-bold text-sm tracking-wide hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
              Lihat Semua Berita <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================================
          FASILITAS — Ruang & sarana pembelajaran
          ================================================================ */}
      <section id="fasilitas" className="py-24 bg-white relative">
        <div className="w-full max-w-[1160px] mx-auto px-5">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="FASILITAS"
              title="Ruang yang mendukung proses belajar."
              description="Kenali fasilitas yang tersedia untuk menunjang aktivitas pembelajaran."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {facilities.slice(0, 6).map((item, index) => (
              <ScrollReveal key={item.id} animation="facility" delay={index * 110} className="h-full">
                <FacilityCard item={item} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 text-center flex justify-center">
            <Link href="/fasilitas" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-emerald-500 text-emerald-600 rounded-full font-bold text-sm tracking-wide hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
              Lihat Semua Fasilitas <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Users, GraduationCap, Trophy, Building2 } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import SectionHeading   from "@/components/SectionHeading";
import PersonCard       from "@/components/PersonCard";
import MajorCard        from "@/components/MajorCard";
import NewsCard         from "@/components/NewsCard";
import FacilityCard     from "@/components/FacilityCard";
import ScrollReveal     from "@/components/ScrollReveal";

// ─── Data Statistik Hero ─────────────────────────────────────────────────────
// Nilai statistik dikelola dari Dashboard > Data Siswa & Guru.
const HERO_STATS_TEMPLATE = [
  { icon: <Users size={18} />,         key: "studentCount",    suffix: "+", label: "Siswa"    },
  { icon: <GraduationCap size={18} />, key: "teacherCount",    suffix: "+", label: "Guru"     },
  { icon: <Trophy size={18} />,        key: "achievementCount", suffix: "+", label: "Prestasi" },
  { icon: <Building2 size={18} />,     key: "majorCount",      suffix: "",  label: "Jurusan"  },
];

// ─── Teks yang akan diputar di hero ────────────────────────────────────────
const TYPEWRITER_PHRASES = [
  "Selamat Datang Di SMK Negeri 1 Beringin",
  "Membangun Generasi Unggul untuk Masa Depan.",
];

// ─── Hook typewriter ─────────────────────────────────────────────────────────
function useTypewriter(phrases, { typeSpeed = 70, deleteSpeed = 40, pauseAfterType = 1800, pauseAfterDelete = 500 } = {}) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const current = phrases[phraseIndex];

    const tick = () => {
      if (!isDeleting) {
        // Mengetik
        if (displayed.length < current.length) {
          setDisplayed(current.slice(0, displayed.length + 1));
          timeoutRef.current = setTimeout(tick, typeSpeed);
        } else {
          // Selesai mengetik — jeda lalu mulai hapus
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseAfterType);
        }
      } else {
        // Menghapus
        if (displayed.length > 0) {
          setDisplayed(current.slice(0, displayed.length - 1));
          timeoutRef.current = setTimeout(tick, deleteSpeed);
        } else {
          // Selesai hapus — pindah ke frasa berikutnya
          setIsDeleting(false);
          setPhraseIndex((i) => (i + 1) % phrases.length);
          timeoutRef.current = setTimeout(tick, pauseAfterDelete);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timeoutRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, isDeleting, phraseIndex]);

  return displayed;
}

// ─── Halaman Beranda ─────────────────────────────────────────────────────────
export default function Home() {
  const { school, majors, achievements, news, facilities } = useData();
  const typedText = useTypewriter(TYPEWRITER_PHRASES);

  // Semua angka mengikuti data yang dapat diedit melalui Dashboard.
  // Fallback dipakai untuk project lama yang belum memiliki field statistik baru.
  const heroStats = HERO_STATS_TEMPLATE.map((stat) => {
    const fallback = stat.key === "majorCount" ? majors.length : stat.key === "achievementCount" ? achievements.length : 0;
    const value = Number(school[stat.key] ?? fallback);
    return { ...stat, value: `${value.toLocaleString("id-ID")}${stat.suffix}` };
  });

  return (
    <>

      {/* ================================================================
          HERO — Banner utama halaman
          ================================================================ */}
      <section id="beranda" className="hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="container hero-grid">

          {/* Teks & CTA kiri */}
          <div className="hero-copy">
            <span className="eyebrow light">WEBSITE RESMI SEKOLAH</span>

            <h1 className="hero-typewriter">
              {typedText}
              <span className="typewriter-cursor" aria-hidden="true"></span>
            </h1>

            <p>{school.tagline}</p>

            {/* Tombol aksi */}
            <div className="hero-actions">
              <button
                className="button primary"
                onClick={() => {
                  const el = document.getElementById("profil");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Kenali Sekolah <ArrowRight size={17} />
              </button>
            </div>

            {/* Statistik sekolah */}
            <div className="hero-stats">
              {heroStats.map(({ icon, value, label }) => (
                <div className="stat-item" key={label}>
                  {icon}
                  <div>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual / logo kanan */}
          <div className="hero-visual">
            <div className="hero-card">
              <div className="logo-orbit">
                <img src="/logo-smk.png" alt="Logo SMK Negeri 1 Beringin" />
              </div>
              <span>SMK NEGERI 1 BERINGIN</span>
              <small>DELI SERDANG · SUMATERA UTARA</small>
            </div>
          </div>

        </div>
      </section>


      {/* ================================================================
          TENTANG SEKOLAH — Foto & deskripsi singkat
          ================================================================ */}
      <section id="profil" className="section intro-section">
        <div className="container two-column">

          {/* Foto sekolah — tampil dari dashboard jika sudah diupload */}
          <ScrollReveal animation="up" className="intro-image-reveal">
            <div className="intro-image">
              {school.coverPhoto ? (
                <img
                  src={school.coverPhoto}
                  alt="Foto Sekolah"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius)" }}
                />
              ) : (
                <div className="image-placeholder">
                  <Building2 size={48} />
                  <span>Foto sekolah</span>
                  <small>Upload foto dari Dashboard → Profil Sekolah</small>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Teks tentang sekolah */}
          <ScrollReveal animation="up" delay={120}>
            <div>
              <SectionHeading
                eyebrow="TENTANG SEKOLAH"
                title="Tempat bertumbuh, belajar, dan berkarya."
                description={school.description}
              />
              <Link href="/profil" className="button outline">
                Selengkapnya <ArrowRight size={17} />
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* ================================================================
          PIMPINAN SEKOLAH — Kepala & Wakil Kepala Sekolah
          ================================================================ */}
      <section id="pimpinan" className="section leaders-section">
        <div className="container">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="PIMPINAN SEKOLAH"
              title="Kepala Sekolah & Wakil Kepala Sekolah"
              description="Kenali pimpinan yang menjadi bagian dari perjalanan dan perkembangan sekolah."
              center
            />
          </ScrollReveal>
          <div className="leaders-grid">
            <ScrollReveal animation="left" delay={80}>
              <PersonCard person={school.principal} principal />
            </ScrollReveal>
            <ScrollReveal animation="right" delay={180}>
              <PersonCard person={school.vicePrincipal} />
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* ================================================================
          PROGRAM KEAHLIAN — Daftar jurusan
          ================================================================ */}
      <section id="jurusan" className="section soft-section">
        <div className="container">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="PROGRAM KEAHLIAN"
              title="Pilih bidang yang sesuai dengan masa depanmu."
              description="Program keahlian dirancang untuk membekali siswa dengan kompetensi yang relevan."
            />
          </ScrollReveal>

          <div className="cards-grid majors-grid">
            {majors.map((major, index) => (
              <ScrollReveal key={major.id} animation="jump" delay={index * 130}>
                <MajorCard major={major} />
              </ScrollReveal>
            ))}
          </div>

          <div className="center-action">
            <Link href="/jurusan" className="button outline">
              Lihat Semua Jurusan <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================================
          PRESTASI — Pencapaian terbaru sekolah & siswa
          ================================================================ */}
      <section id="prestasi" className="section">
        <div className="container">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="PRESTASI"
              title="Pencapaian yang membanggakan."
              description="Bagian ini siap diisi dengan prestasi terbaru sekolah dan siswa."
            />
          </ScrollReveal>

          <div className="achievement-strip">
            {achievements.map((item, index) => (
              <ScrollReveal key={item.id} animation="up" delay={index * 100}>
                <article className="achievement-card">
                  {item.image && !item.image.includes("placeholder") ? (
                    <div className="achievement-card-thumb">
                      <img src={item.image} alt={item.title} />
                    </div>
                  ) : (
                    <div className="trophy">🏆</div>
                  )}
                  <span>{item.category} · {item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <div className="center-action">
            <Link href="/prestasi" className="button outline">
              Lihat Semua Prestasi <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================================
          BERITA TERBARU — Informasi & kegiatan sekolah
          ================================================================ */}
      <section id="berita" className="section soft-section">
        <div className="container">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="BERITA TERBARU"
              title="Informasi dan kegiatan sekolah."
              description="Temukan berita, kegiatan, dan pengumuman terbaru."
            />
          </ScrollReveal>

          <div className="cards-grid news-grid">
            {news.map((item, index) => (
              <ScrollReveal key={item.id} animation="news" delay={index * 120}>
                <NewsCard item={item} />
              </ScrollReveal>
            ))}
          </div>

          <div className="center-action">
            <Link href="/berita" className="button outline">
              Lihat Semua Berita <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================================
          FASILITAS — Ruang & sarana pembelajaran
          ================================================================ */}
      <section id="fasilitas" className="section">
        <div className="container">
          <ScrollReveal animation="up">
            <SectionHeading
              eyebrow="FASILITAS"
              title="Ruang yang mendukung proses belajar."
              description="Kenali fasilitas yang tersedia untuk menunjang aktivitas pembelajaran."
            />
          </ScrollReveal>

          <div className="cards-grid facilities-grid">
            {facilities.map((item, index) => (
              <ScrollReveal key={item.id} animation="facility" delay={index * 110}>
                <FacilityCard item={item} />
              </ScrollReveal>
            ))}
          </div>

          <div className="center-action">
            <Link href="/fasilitas" className="button outline">
              Lihat Semua Fasilitas <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
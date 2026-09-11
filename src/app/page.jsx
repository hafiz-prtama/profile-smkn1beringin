"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Users, GraduationCap, Trophy, Building2 } from "lucide-react";
import Link from "next/link";
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

// ─── Teks yang akan diputar di hero ────────────────────────────────────────
const TYPEWRITER_PHRASES = [
  "Selamat Datang di SMK Negeri 1 Beringin",
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

// ─── Hook Number Counter (Animasi Angka) ───────────────────────────────────
function useNumberCounter(endValue, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let observer;
    const target = parseInt(endValue.toString().replace(/\D/g, "")) || 0;

    if (target === 0) {
      setCount(endValue);
      return;
    }

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const startAnimation = () => {
              let startTimestamp = null;
              const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // easeOutQuart
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                setCount(Math.floor(easeProgress * target));
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                }
              };
              window.requestAnimationFrame(step);
            };

            const checkAndStart = () => {
              // Tunggu sampai preloader selesai (kelas intro-active hilang)
              if (document.body.classList.contains("intro-active")) {
                setTimeout(checkAndStart, 200);
              } else {
                // Beri sedikit jeda tambahan setelah animasi naik agar lebih pas
                setTimeout(startAnimation, 300);
              }
            };

            checkAndStart();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }
    }
    return () => observer?.disconnect();
  }, [endValue, duration]);

  const suffix = endValue.toString().replace(/[0-9.]/g, "");
  return {
    count: typeof count === "number" ? count.toLocaleString("id-ID") : count,
    suffix,
    ref,
  };
}

// ─── Hook Mouse Parallax (Efek Mengambang) ─────────────────────────────────
function useMouseParallax(multiplier = 1) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = ((window.innerWidth / 2) - e.clientX) / 50 * multiplier;
      const y = ((window.innerHeight / 2) - e.clientY) / 50 * multiplier;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [multiplier]);

  return offset;
}

// ─── Komponen Stat Item (Angka Animasi) ────────────────────────────────────
function StatItem({ icon, value, label }) {
  const { count, suffix, ref } = useNumberCounter(value);
  return (
    <div className="stat-item" ref={ref}>
      {icon}
      <div>
        <strong>
          {count}
          {suffix}
        </strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

// ─── Hook Scroll Parallax (Latar Bergerak) ───────────────────────────────────
function useScrollParallax(speed = 0.5) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * speed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offsetY;
}

// ─── Komponen Carousel Kegiatan ────────────────────────────────────────────
function ActivityCarousel({ photos = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos]);

  return (
    <div className="activity-carousel-wrapper">
      {photos && photos.length > 0 && (
        <div className="activity-carousel-inner">
          {photos.map((photo, i) => {
            let posClass = "pos-hidden";
            const diff = (i - activeIndex + photos.length) % photos.length;

            if (diff === 0) posClass = "pos-active";
            else if (diff === 1) posClass = "pos-next-1";
            else if (diff === 2) posClass = "pos-next-2";
            else if (diff === 3) posClass = "pos-next-3";
            else if (diff === photos.length - 1) posClass = "pos-prev-1";
            else if (diff === photos.length - 2) posClass = "pos-prev-2";
            else if (diff === photos.length - 3) posClass = "pos-prev-3";

            return (
              <div key={photo.id || i} className={`carousel-item ${posClass}`}>
                <img src={photo.image} alt="Kegiatan" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Halaman Beranda ─────────────────────────────────────────────────────────
export default function Home() {
  const { school, majors, achievements, news, facilities, activityPhotos } = useData();
  const typedText = useTypewriter(TYPEWRITER_PHRASES);

  // Semua angka mengikuti data yang dapat diedit melalui Dashboard.
  // Fallback dipakai untuk project lama yang belum memiliki field statistik baru.
  const heroStats = HERO_STATS_TEMPLATE.map((stat) => {
    const fallback = stat.key === "majorCount" ? majors.length : stat.key === "achievementCount" ? achievements.length : 0;
    const value = Number(school[stat.key] ?? fallback);
    return { ...stat, value: `${value}${stat.suffix}` };
  });

  const parallaxOffset = useMouseParallax(0.5);
  const scrollParallax = useScrollParallax(0.3);

  const sortedAchievements = [...achievements].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  const sortedNews = [...news].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

  return (
    <>
      {/* ================================================================
          HERO — Banner utama halaman (Gaya Editorial Terpusat dengan Grid & Foto Kertas)
          ================================================================ */}
      <section id="beranda" className="hero-editorial">
        {/* Pola latar belakang grid halus */}
        <div className="hero-grid-canvas" aria-hidden="true" />

        <div className="container hero-editorial-container">
          {/* Header & Teks Terpusat */}
          <div className="hero-editorial-header">
            <span className="hero-editorial-eyebrow">A JOURNEY THROUGH VISUAL STORIES · SMKN 1 BERINGIN</span>

            <h1 className="hero-editorial-title">
              <span className="hero-title-prefix">Selamat Datang di</span>
              <span className="hero-title-accent">SMK Negeri 1 Beringin</span>
            </h1>

            <p className="hero-editorial-desc">
              {school.tagline || "Membangun Generasi Unggul untuk Masa Depan."}
            </p>
          </div>

          {/* 5 Foto Kertas Menyebar (Animasi tumpuk lalu sebar ke meja, membesar saat di-hover) */}
          <div className="hero-editorial-deck-wrap">
            <ScatteredPhotoDeck photos={activityPhotos} />
          </div>

          {/* Tombol Aksi di Bawah Foto Sesuai Referensi Gambar */}
          <div className="hero-editorial-actions">
            <button
              className="hero-pill-button"
              onClick={() => {
                const el = document.getElementById("profil");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Kenali Sekolah <ArrowRight size={17} />
            </button>
          </div>

          {/* Statistik Sekolah */}
          <div className="hero-editorial-stats">
            {heroStats.map(({ icon, value, label }) => (
              <StatItem key={label} icon={icon} value={value} label={label} />
            ))}
          </div>
        </div>
      </section>


      {/* ================================================================
          TENTANG SEKOLAH — Foto Gedung Beranimasi & deskripsi singkat
          ================================================================ */}
      <section id="profil" className="section intro-section">
        <div className="container">
          <SchoolIntroShowcase school={school} />
        </div>
      </section>


      {/* ================================================================
          PIMPINAN SEKOLAH — Kepala Sekolah
          ================================================================ */}
      <section id="pimpinan" className="section principal-section">
        <div className="container">
          <div className="principal-layout">
            <ScrollReveal animation="left" delay={80} className="principal-photo-reveal">
              <div className="principal-photo-wrapper">
                <img src={school.principal.photo} alt={school.principal.name} className="principal-img" />
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={180} className="principal-content-reveal">
              <div className="principal-text-content">
                <span className="principal-eyebrow">Sambutan</span>
                <h2 className="principal-title">Kepala Sekolah</h2>
                <div className="principal-paragraphs">
                  {school.principal.greeting ? (
                    school.principal.greeting.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))
                  ) : (
                    <p>Sambutan belum tersedia.</p>
                  )}
                </div>
                <div className="principal-name-signature">
                  <strong>{school.principal.name}</strong>
                </div>
              </div>
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
            {majors.slice(0, 3).map((major, index) => (
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
            {sortedAchievements.slice(0, 6).map((item, index) => (
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
            {sortedNews.slice(0, 6).map((item, index) => (
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
            {facilities.slice(0, 6).map((item, index) => (
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
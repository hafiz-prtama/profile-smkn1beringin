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

// ─── Halaman Beranda ─────────────────────────────────────────────────────────
export default function Home() {
  const { school, majors, achievements, news, facilities } = useData();
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

  return (
    <>
      {/* ================================================================
          HERO — Banner utama halaman
          ================================================================ */}
      <section id="beranda" className="hero" style={{ position: "relative", overflow: "hidden" }}>

        {/* Gambar gedung sekolah — background khusus section hero ini saja */}
        <img
          src="/gedungsekolah.JPEG?v=2"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center bottom",
            opacity: 0.22,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        {/* Overlay biru gelap di atas gambar agar menyatu dengan tema */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(8, 25, 70, 0.55) 0%, rgba(10, 40, 100, 0.45) 60%, rgba(6, 18, 55, 0.65) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div
          className="hero-glow hero-glow-one"
          style={{ transform: `translateY(${scrollParallax * 0.8}px)`, zIndex: 2 }}
        />
        <div
          className="hero-glow hero-glow-two"
          style={{ transform: `translateY(${scrollParallax * 1.2}px)`, zIndex: 2 }}
        />

        <div className="container hero-grid" style={{ position: "relative", zIndex: 3 }}>

          {/* Teks & CTA kiri */}
          <div className="hero-copy">
            <div className="hero-orchestrate hero-delay-1">
              <span className="eyebrow light">WEBSITE RESMI SEKOLAH</span>

              <h1 className="hero-typewriter">
                {typedText}
                <span className="typewriter-cursor" aria-hidden="true"></span>
              </h1>
            </div>

            <p className="hero-orchestrate hero-delay-2">
              {school.tagline}
            </p>

            {/* Tombol aksi */}
            <div className="hero-actions hero-orchestrate hero-delay-3">
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
            <div className="hero-stats hero-orchestrate hero-delay-4">
              {heroStats.map(({ icon, value, label }) => (
                <StatItem key={label} icon={icon} value={value} label={label} />
              ))}
            </div>
          </div>

          {/* Visual / logo kanan */}
          <div className="hero-visual hero-orchestrate hero-delay-5">
            <div 
              className="hero-card hero-parallax-card" 
              style={{ transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)` }}
            >
              <div className="logo-orbit">
                <img src="/logosmk.webp" alt="Logo SMK Negeri 1 Beringin" />
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
                  className="hero-parallax-card"
                  style={{ 
                    width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius)",
                    transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)`
                  }}
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
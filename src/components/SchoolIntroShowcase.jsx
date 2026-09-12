"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Lenis from "lenis";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

export default function SchoolIntroShowcase({ school = {} }) {
  const introTextRef = useRef(null);
  const textElementsRef = useRef([]);

  useEffect(() => {
    // 1. Inisialisasi Lenis Smooth Scroll
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Inisialisasi GSAP Animasi Teks (Muncul setelah Zoom Parallax)
    let isMounted = true;
    let gsapCtx;

    const initGsap = async () => {
      try {
        const gsapMod = await import("gsap");
        const stMod = await import("gsap/ScrollTrigger");
        const gsap = gsapMod.default;
        const { ScrollTrigger } = stMod;
        gsap.registerPlugin(ScrollTrigger);

        if (!isMounted) return;

        gsapCtx = gsap.context(() => {
          if (textElementsRef.current.length > 0) {
            gsap.fromTo(
              textElementsRef.current,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: introTextRef.current,
                  start: "top 80%",
                  end: "bottom 80%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        });
      } catch (err) {
        console.error("GSAP Init Failed:", err);
      }
    };

    initGsap();

    return () => {
      isMounted = false;
      lenis.destroy();
      if (gsapCtx) gsapCtx.revert();
    };
  }, []);

  // Foto Tengah (index 0) yang akan membesar menjadi 1 layar, memakai foto sekolah
  const images = [
    { src: "/gedungsmk.jpeg", alt: "Gedung SMK Beringin Utama" },
    { src: "/pohon-sekolah.jpg", alt: "Lingkungan Sekolah" },
    { src: "/gedungsekolah.JPEG", alt: "Gedung Sekolah Eksterior" },
    { src: "/logosmk.webp", alt: "Logo Sekolah" },
    { src: "/gedungsmk.jpeg", alt: "Gedung Utama (Sudut Lain)" },
    { src: "/pohon-sekolah.jpg", alt: "Pemandangan Sekolah" },
    { src: "/gedungsekolah.JPEG", alt: "Fasilitas Sekolah" },
  ];

  return (
    <div className="bg-[#f0f6ff] w-full relative z-0">
      {/* 1. Zoom Parallax Section */}
      <ZoomParallax images={images} />

      {/* 2. Text Reveal Section dengan GSAP */}
      <div 
        ref={introTextRef} 
        className="min-h-screen flex items-center justify-center py-20 px-4 md:px-8 bg-white relative z-10"
      >
        <div className="max-w-4xl w-full text-center flex flex-col items-center">
          <span 
            ref={(el) => (textElementsRef.current[0] = el)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-bold tracking-widest uppercase mb-6"
          >
            TENTANG SEKOLAH
          </span>
          
          <h2 
            ref={(el) => (textElementsRef.current[1] = el)}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#0b2f63] mb-8 leading-tight tracking-tight"
          >
            Membentuk Generasi Kompeten, Berkarakter, dan Siap Menghadapi Masa Depan.
          </h2>
          
          <p 
            ref={(el) => (textElementsRef.current[2] = el)}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {school.description || "SMK Negeri 1 Beringin hadir sebagai sekolah kejuruan yang berfokus pada pengembangan kompetensi, karakter, kreativitas, dan kesiapan peserta didik menghadapi dunia kerja maupun pendidikan lanjutan."}
          </p>
          
          <div ref={(el) => (textElementsRef.current[3] = el)}>
            <Link 
              href="/profil" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1557a6] text-white rounded-xl font-bold hover:bg-[#0b2f63] transition-colors shadow-lg shadow-blue-500/30"
            >
              Selengkapnya <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

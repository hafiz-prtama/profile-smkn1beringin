import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import RealTimeClock from "@/components/RealTimeClock";

// ─── Daftar Link Navigasi ────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: "/", label: "Beranda", sectionId: "beranda" },
  { to: "/profil", label: "Profil", sectionId: "profil" },
  { to: "/jurusan", label: "Jurusan", sectionId: "jurusan" },
  { to: "/prestasi", label: "Prestasi", sectionId: "prestasi" },
  { to: "/berita", label: "Berita", sectionId: "berita" },
  { to: "/fasilitas", label: "Fasilitas", sectionId: "fasilitas" },
];

/**
 * Jarak scroll (px) sebelum navbar berubah ke mode floating.
 */
const SCROLL_THRESHOLD = 80;
const SCROLL_HYSTERESIS = 20;

// ─── Komponen Navbar ─────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });
  const [isMoving, setIsMoving] = useState(false);

  const navRef = useRef(null);
  const rafRef = useRef(null);
  const observerRef = useRef(null);
  const moveTimerRef = useRef(null);
  const prevIndexRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // ── Deteksi scroll floating ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setFloating((prev) => {
          if (!prev && y > SCROLL_THRESHOLD) return true;
          if (prev && y < SCROLL_THRESHOLD - SCROLL_HYSTERESIS) return false;
          return prev;
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── IntersectionObserver: deteksi section aktif saat di halaman Home ──────
  useEffect(() => {
    if (!isHome) {
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    const sections = NAV_LINKS
      .map(({ sectionId }) => document.getElementById(sectionId))
      .filter(Boolean);

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-80px 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isHome]);

  const closeMenu = () => setMenuOpen(false);

  // ── Tentukan apakah link aktif ───────────────────────────────────────────
  const isLinkActive = (link) => {
    if (isHome) {
      return activeSection === link.sectionId;
    }
    if (link.to === "/") return pathname === "/";
    return pathname?.startsWith(link.to);
  };

  const activeIndex = NAV_LINKS.findIndex((link) => isLinkActive(link));
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  // ── Hitung posisi indikator pipih persis sesuai teks aktif ──────────────────
  const updateIndicator = useCallback(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector(".nav-link.active");
    if (!activeEl) return;

    const navRect = navRef.current.getBoundingClientRect();
    const textEl = activeEl.querySelector(".nav-link-text") || activeEl;
    const textRect = textEl.getBoundingClientRect();

    if (window.innerWidth > 900) {
      const left = textRect.left - navRect.left;
      const width = textRect.width;
      setIndicatorStyle({
        left: Math.round(left),
        width: Math.round(width),
        top: 0,
        height: 0,
        opacity: 1,
      });
    } else {
      const top = textRect.top - navRect.top;
      const height = textRect.height;
      setIndicatorStyle({
        left: 14,
        width: 3.5,
        top: Math.round(top),
        height: Math.round(height),
        opacity: 1,
      });
    }
  }, []);

  // ── Efek animasi: saat berpindah mengecil & bergeser, sampai melebar ──────
  useEffect(() => {
    if (prevIndexRef.current !== null && prevIndexRef.current !== safeActiveIndex) {
      setIsMoving(true);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
      moveTimerRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 280);
    }
    prevIndexRef.current = safeActiveIndex;

    updateIndicator();
  }, [safeActiveIndex, updateIndicator]);

  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    };
  }, [updateIndicator]);

  // ── Klik link navigasi ───────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (e, link) => {
      closeMenu();
      setActiveSection(link.sectionId);

      if (isHome) {
        e.preventDefault();
        const target = document.getElementById(link.sectionId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (link.sectionId === "beranda") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [isHome]
  );

  return (
    <header className={`navbar${floating ? " navbar--floating" : ""}`}>
      <div className="container nav-inner">

        {/* ── Brand / Logo (Kiri) ── */}
        <Link href="/" className="brand" onClick={closeMenu}>
          <Image src="/logosmk.webp" alt="Logo SMK Negeri 1 Beringin" width={40} height={40} priority />
          <div>
            <strong>SMKN 1 BERINGIN</strong>
            <span>DELI SERDANG</span>
          </div>
        </Link>

        {/* ── Sisi Kanan: Jam di samping kiri Beranda + Pemilihan Halaman di sudut kanan ── */}
        <div className="nav-right-section">
          {/* Jam Realtime (di samping kiri Beranda) */}
          <div className="nav-clock-wrapper">
            <RealTimeClock />
          </div>

          {/* Pemilihan Halaman (Sudut Kanan) */}
          <nav
            ref={navRef}
            className={`nav-links${menuOpen ? " show" : ""}`}
            aria-label="Navigasi utama"
          >
            {NAV_LINKS.map((link, index) => {
              const isCompleted = index <= safeActiveIndex;
              const isActive = index === activeIndex;
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`nav-link ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  <span className="nav-link-text">{link.label}</span>
                </Link>
              );
            })}

            {/* Indikator Pipih Berjalan (Tanpa Ekor, melebar sesuai teks) */}
            <div
              className={`nav-indicator${isMoving ? " moving" : ""}`}
              style={{
                "--ind-left": `${indicatorStyle.left}px`,
                "--ind-width": `${indicatorStyle.width}px`,
                "--ind-top": `${indicatorStyle.top}px`,
                "--ind-height": `${indicatorStyle.height}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
          </nav>
        </div>

        {/* ── Tombol Hamburger (Mobile) ── */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

      </div>
    </header>
  );
}
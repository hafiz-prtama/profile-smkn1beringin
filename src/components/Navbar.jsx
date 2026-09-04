import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

// ─── Daftar Link Navigasi ────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: "/",          label: "Beranda",   sectionId: "beranda"   },
  { to: "/profil",    label: "Profil",    sectionId: "profil"    },
  { to: "/jurusan",   label: "Jurusan",   sectionId: "jurusan"   },
  { to: "/prestasi",  label: "Prestasi",  sectionId: "prestasi"  },
  { to: "/berita",    label: "Berita",    sectionId: "berita"    },
  { to: "/fasilitas", label: "Fasilitas", sectionId: "fasilitas" },
];

/**
 * Jarak scroll (px) sebelum navbar berubah ke mode floating.
 */
const SCROLL_THRESHOLD = 80;
const SCROLL_HYSTERESIS = 20;

// ─── Komponen Navbar ─────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [floating,       setFloating]       = useState(false);
  const [activeSection,  setActiveSection]  = useState("beranda");

  const rafRef      = useRef(null);
  const observerRef = useRef(null);
  const pathname    = usePathname();
  const router      = useRouter();
  const isHome      = pathname === "/";

  // ── Deteksi scroll floating ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setFloating((prev) => {
          if (!prev && y > SCROLL_THRESHOLD)                    return true;
          if ( prev && y < SCROLL_THRESHOLD - SCROLL_HYSTERESIS) return false;
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
      // Bukan halaman home → tidak perlu scroll-spy
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    // Kumpulkan semua section yang punya id
    const sections = NAV_LINKS
      .map(({ sectionId }) => document.getElementById(sectionId))
      .filter(Boolean);

    if (sections.length === 0) return;

    // Gunakan rootMargin agar section dianggap "aktif" saat masuk 40% layar
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
        // Atas: potong 80px (tinggi navbar), bawah: hanya 40% atas viewport yang dihitung
        rootMargin: "-80px 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isHome]);

  // ── Klik link navigasi ───────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (e, link) => {
      closeMenu();

      if (isHome) {
        // Sudah di halaman home → scroll ke section yang sesuai
        e.preventDefault();
        const target = document.getElementById(link.sectionId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (link.sectionId === "beranda") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        // Halaman lain → navigasi ke home, lalu setelah render scroll ke section
        if (link.to === "/") {
          // Cukup navigate ke "/"  — ScrollToTop akan handle
          return; // biarkan NavLink bekerja normal
        }
        // Jika klik link yang rutenya beda (misal /jurusan dari profil) biarkan NavLink normal
      }
    },
    [isHome]
  );

  const closeMenu = () => setMenuOpen(false);

  // ── Tentukan apakah link aktif (untuk highlight navbar) ──────────────────
  const isLinkActive = (link) => {
    if (isHome) {
      // Di halaman home: gunakan section yang terlihat
      return activeSection === link.sectionId;
    }
    // Di halaman lain: gunakan path matching
    if (link.to === "/") return pathname === "/";
    return pathname.startsWith(link.to);
  };

  return (
    <header className={`navbar${floating ? " navbar--floating" : ""}`}>
      <div className="container nav-inner">

        {/* ── Brand / Logo ── */}
        <Link href="/" className="brand" onClick={closeMenu}>
          <img src="/logo-smk.png" alt="Logo SMK Negeri 1 Beringin" />
          <div>
            <strong>SMKN 1 BERINGIN</strong>
            <span>DELI SERDANG</span>
          </div>
        </Link>

        {/* ── Tombol Hamburger (Mobile) ── */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        {/* ── Link Navigasi ── */}
        <nav
          className={`nav-links${menuOpen ? " show" : ""}`}
          aria-label="Navigasi utama"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`nav-link${isLinkActive(link) ? " active" : ""}`}
              onClick={(e) => handleNavClick(e, link)}
            >
              {link.label}
            </Link>
          ))}

        </nav>

      </div>
    </header>
  );
}
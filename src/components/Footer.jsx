import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer" id="kontak">
      <div className="container footer-grid">
        <div className="footer-about">
          <div className="footer-brand">
            <img src="/logo-smk.png" alt="Logo sekolah" />
            <div>
              <strong>SMK NEGERI 1 BERINGIN</strong>
              <span>Deli Serdang, Sumatera Utara</span>
            </div>
          </div>
          <p>Website profil sekolah sebagai pusat informasi, dokumentasi, dan komunikasi sekolah.</p>
        </div>

        <div>
          <h4>Navigasi</h4>
          <div className="footer-links">
            <Link href="/">Beranda</Link>
            <Link href="/profil">Profil</Link>
            <Link href="/jurusan">Jurusan</Link>
            <Link href="/prestasi">Prestasi</Link>
            <Link href="/berita">Berita</Link>
            <Link href="/fasilitas">Fasilitas</Link>
          </div>
        </div>

        <div>
          <h4>Kontak</h4>
          <div className="contact-list">
            <p><MapPin size={17} /> <span>Alamat sekolah diisi di sini</span></p>
            <p><Phone size={17} /> <span>Nomor telepon diisi di sini</span></p>
            <p><Mail size={17} /> <span>Email sekolah diisi di sini</span></p>
          </div>
        </div>

        <div>
          <h4>Media Sosial</h4>
          <div className="socials" style={{ marginBottom: "15px" }}>
            <a href="https://www.instagram.com/smk_negeri1_beringin?igsi=MXF4YWV2ZzIwNWlxMg==" aria-label="Instagram"><Instagram size={19} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={19} /></a>
            <a href="https://www.youtube.com/@smknegeri1beringin943" aria-label="YouTube"><Youtube size={19} /></a>
          </div>
          
          {/* Google Maps Embed */}
          <div style={{ borderRadius: "12px", overflow: "hidden", marginTop: "10px" }}>
            <iframe
              title="Lokasi SMK Negeri 1 Beringin"
              src="https://maps.google.com/maps?q=SMK%20Negeri%201%20Beringin,%20Deli%20Serdang&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="160"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span>© 2026 SMK Negeri 1 Beringin. Semua hak dilindungi.</span>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("replay-intro"));
            }}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#9be5c3",
              fontSize: "12px",
              padding: "4px 12px",
              borderRadius: "999px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(24, 166, 107, 0.2)";
              e.currentTarget.style.borderColor = "#18a66b";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            <span>✨ Putar Ulang Intro</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
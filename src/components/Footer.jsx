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
          <div className="socials">
            <a href="https://www.instagram.com/smk_negeri1_beringin?igsi=MXF4YWV2ZzIwNWlxMg==" aria-label="Instagram"><Instagram size={19} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={19} /></a>
            <a href="https://www.youtube.com/@smknegeri1beringin943" aria-label="YouTube"><Youtube size={19} /></a>
          </div>
          <a href="#" className="map-link">Lihat lokasi di Google Maps <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © 2026 SMK Negeri 1 Beringin. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
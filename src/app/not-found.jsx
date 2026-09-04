import React from "react";
import Link from "next/link";
export default function NotFound() {
  return <section className="section"><div className="container empty-page"><h1>404</h1><p>Halaman yang kamu cari tidak ditemukan.</p><Link href="/" className="button primary">Kembali ke Beranda</Link></div></section>;
}
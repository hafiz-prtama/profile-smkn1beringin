# SMK Negeri 1 Beringin — React

Website profil sekolah berbasis React + Vite + React Router.

## Menjalankan project

1. Buka terminal di folder project (folder yang berisi `package.json`).
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.
4. Buka alamat Vite yang tampil, biasanya `http://localhost:5173/`.

> Jika `npm install` gagal dengan `ECONNRESET`, itu masalah koneksi npm/internet. Coba ulangi atau gunakan jaringan yang stabil.

## Alur website

- `/` — Beranda: hero, profil singkat, kepala sekolah & wakil, program keahlian, prestasi, berita, fasilitas, chat box, footer/kontak.
- `/profil` — Profil sekolah, sejarah, visi, misi, kepala sekolah & wakil.
- `/jurusan` — 7 program keahlian: PPLG, TJKT, Tata Busana, Kuliner, Kecantikan dan Spa, ULP, Perhotelan.
- `/jurusan/:id` — Detail program keahlian, kompetensi dan prospek kerja.
- `/prestasi` — Daftar prestasi.
- `/berita` — Daftar berita.
- `/berita/:id` — Detail berita.
- `/fasilitas` — Daftar fasilitas.
- `/fasilitas/:id` — Detail fasilitas.
- Chat box — UI chat sudah tersedia, FAQ sengaja kosong agar dapat diisi kemudian.
- Footer — kontak sekolah dan navigasi.

## Struktur utama

- `src/pages/` — halaman.
- `src/components/` — komponen yang dipakai ulang.
- `src/data/mockData.js` — data sementara yang mudah diubah.
- `src/styles.css` — tampilan dan responsive design.
- `public/logo-smk.png` — logo sekolah.

## Catatan

Project ini tidak menyertakan `node_modules`. Jalankan `npm install` setelah mengekstrak ZIP.

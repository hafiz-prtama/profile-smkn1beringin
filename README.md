<div align="center">

<!-- ANIMASI HEADER DAN LAMPU-LAMPU BERKILAU -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,11,24,30&height=220&section=header&text=SMKN%201%20BERINGIN&fontSize=42&fontColor=ffffff&animation=twinkle&fontAlignY=38&desc=Sistem%20Portal%20Digital%20%26%20Dashboard%20Modern&descAlignY=60&descSize=18" width="100%" alt="Header Banner" />

<!-- BADGE LAMPU / STATUS BERKEDIP -->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3000&pause=1000&color=00F5D4&center=true&vCenter=true&width=550&lines=%E2%9C%A8+Selamat+Datang+di+Portal+Digital+Sekolah;%F0%9F%9A%80+Cepat%2C+Modern%2C+dan+Mudah+Digunakan;%F0%9F%9B%A1%EF%B8%8F+Layanan+Konseling+Siswa+Aman+%26+Anonim;%F0%9F%92%A1+Dikelola+Terpusat+Lewat+Dashboard" alt="Typing Animation" />
</p>

<!-- BADGES TEKNOLOGI -->
<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
</p>

<p align="center">
  💡 <b>Website profil resmi SMK Negeri 1 Beringin</b> yang memadukan informasi sekolah, jurusan, berita, karya siswa, serta layanan pengaduan konseling BK yang ramah dan aman.
</p>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" alt="Garis Animasi Lampu Neon" />

</div>

---

## 🌟 Apa Saja yang Ada di Website Ini?

Website ini dibuat seringkas dan semudah mungkin untuk dikunjungi oleh siswa, guru, orang tua, maupun masyarakat umum:

* 🏫 **Profil & Info Sekolah** — Menampilkan sejarah, visi & misi, struktur pimpinan, serta fasilitas penunjang belajar.
* 🎓 **7 Program Keahlian (Jurusan)** — Informasi lengkap kejuruan (PPLG, TJKT, Kuliner, Tata Busana, Kecantikan, Perhotelan, ULP) lengkap dengan peluang kerja lulusan.
* 📰 **Berita & Pengumuman Terkini** — Agenda kegiatan sekolah, artikel edukatif, dan info penting yang selalu *up-to-date*.
* 🏆 **Galeri Prestasi** — Dokumentasi pencapaian membanggakan siswa di berbagai perlombaan.
* 💬 **Tanya Jawab Langsung (Chat)** — Sarana tanya jawab cepat bagi pengunjung seputar sekolah.
* 🛡️ **Bimbingan Konseling (BK) Online** — Tempat bercerita atau melapor bagi siswa secara aman tanpa takut identitasnya tersebar (privasi terjaga).

---

## 💻 Teknologi yang Digunakan

Sistem dibangun menggunakan teknologi modern yang ringan, cepat, dan handal:

| Bagian | Teknologi | Fungsi Sederhana |
| :--- | :--- | :--- |
| **Tampilan (Frontend)** | **Next.js 15 & React 19** | Membuat halaman web tampil cepat, estetik, dan lancar dibuka di HP maupun laptop. |
| **Mesin Server (Backend)** | **Node.js** | Menjalankan program logika di balik layar dan melayani permintaan data. |
| **Gudang Data (Database)** | **MySQL** | Menyimpan seluruh data sekolah, artikel berita, jurusan, dan pesan secara rapi. |
| **Penghubung Data** | **Prisma ORM** | Membantu aplikasi berbicara dengan MySQL secara aman dan cepat. |

---

## 🗂️ Halaman-Halaman Utama

```text
🌐 Halaman Publik:
 ├── /            👉 Halaman Utama (Sambutan, Ringkasan Jurusan, Berita Populer)
 ├── /profil      👉 Visi, Misi, dan Struktur Guru / Pimpinan
 ├── /jurusan     👉 Daftar Lengkap 7 Jurusan & Prospek Karir
 ├── /berita      👉 Artikel & Informasi Terbaru Sekolah
 ├── /prestasi    👉 Daftar Prestasi Siswa & Guru
 ├── /fasilitas   👉 Laboratorium, Bengkel Praktik, & Sarana Sekolah
 └── /konseling   👉 Layanan Konsultasi & Curhat Siswa ke Guru BK (Aman & Rahasia)

🔐 Panel Kelola (Admin):
 └── /dshbd23     👉 Dashboard khusus pengelola sekolah untuk menambah/mengedit data
```

---

## ⚙️ Cara Menjalankan Aplikasi di Komputer / Server

Ikuti langkah praktis berikut untuk menjalankan web:

### 1. Masuk ke Folder Proyek
```bash
cd profilesmk11
```

### 2. Pasang Kebutuhan Aplikasi
```bash
npm install
```

### 3. Siapkan Database
Pastikan MySQL sudah aktif, lalu sinkronkan tabel database:
```bash
npx prisma db push
node scripts/seed.js
```
*(Perintah ini akan otomatis membuat tabel dan mengisi data awal sekolah).*

### 4. Jalankan Website! 🚀
```bash
npm run dev
```
Buka browser dan kunjungi: **`http://localhost:3000`**

---

<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" alt="Garis Animasi Lampu Neon" />

### ✨ SMK NEGERI 1 BERINGIN ✨  
*Mencetak Generasi Unggul, Terampil, dan Berakhlak Mulia.*

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,11,24,30&height=120&section=footer" width="100%" alt="Footer Banner" />

</div>
<div align="center">

# ⚡ SMKN 1 BERINGIN — DIGITAL ECOSYSTEM & PORTAL

**Modern, Interactive, High-Performance Web Platform & Administrative Suite**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.21.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Lucide](https://img.shields.io/badge/Icons-Lucide--React-F36?style=for-the-badge&logo=feather&logoColor=white)](https://lucide.dev/)
[![Security](https://img.shields.io/badge/Auth-RBAC_PIN_Secure-00C853?style=for-the-badge&logo=shield&logoColor=white)](#)

<p align="center">
  Platform profil sekolah modern terintegrasi yang menghadirkan pengalaman visual imersif (Cyber/Futuristic Glassmorphism), sistem interaksi publik real-time, pengaduan konseling BK anonim aman, serta modul dashboard multifungsi berbasis Role-Based Access Control (RBAC).
</p>

[🌐 Eksplorasi Fitur](#-fitur-unggulan) • [🛠️ Tech Stack](#️-software--teknologi-yang-digunakan) • [🗺️ Alur Sistem](#-arsitektur--alur-sistem) • [📊 Alur Dashboard](#-arsitektur--alur-kerja-dashboard) • [🚀 Panduan Instalasi](#-panduan-instalasi--menjalankan)

---

</div>

## 🌟 Ringkasan Eksekutif

Aplikasi ini dirancang sebagai **hub digital komprehensif** untuk SMK Negeri 1 Beringin. Menggabungkan performa tinggi Next.js App Router dengan arsitektur database relasional modern via Prisma ORM.

Platform ini tidak hanya berfungsi sebagai media promosi & branding sekolah kelas industri, tetapi juga sebagai **sistem operasional interaktif** antara manajemen sekolah, ketua jurusan, siswa, dan orang tua/wali murid.

---

## 🛠️ Software & Teknologi yang Digunakan

Proyek ini dibangun di atas pondasi teknologi mutakhir:

### 1. **Core Framework & Runtime**
* **Node.js** — Lingkungan eksekusi JavaScript performa tinggi di sisi server.
* **Next.js 15 (App Router)** — Framework React full-stack dengan Hybrid Rendering (SSR/SSG/Client Components), dynamic server routing, dan API Route handlers.
* **React 19** — Library UI deklaratif modern untuk manipulasi state dan lifecycle komponen secara reaktif.

### 2. **Database & Data Layer**
* **MySQL** — Relational Database Management System (RDBMS) tangguh untuk persistensi data sekolah, jurusan, berita, prestasi, chat publik, dan tiket konseling.
* **Prisma ORM (v5.21.0)** — Type-safe Database Toolkit untuk skema modeling, automated migration, dan client querying bebas runtime SQL error.

### 3. **Styling & Visual Design System**
* **Modern Vanilla CSS & Custom Design System** — Zero unnecessary CSS overhead, 100% responsif dengan token variabel global, efek *Glassmorphism*, gradien dinamis modern, dan animasi mikro responsif.
* **React Parallax Tilt** — Interaksi 3D Card tilt interaktif yang memikat pada elemen kartu jurusan dan galeri prestasi.
* **Lucide React** — Set icon vektor modern, tajam, dan konsisten di seluruh interface.

### 4. **Keamanan & Autentikasi**
* **Jose (JWT/JWE)** — Token kriptografi standar industri untuk sesi dan keamanan otentikasi.
* **Role-Based Pin Authentication** — Proteksi portal dashboard dengan PIN unik per wewenang (Super Admin & Spesifik Jurusan).
* **Anonymous Tokenization Client-Side** — Mekanisme token anonim di sisi browser untuk privasi tiket konseling BK.

---

## 🗺️ Arsitektur & Alur Sistem

Sistem terbagi ke dalam 2 zona utama: **Zona Publik (Front Office)** dan **Zona Administrasi (Back Office / Dashboard)**.

```mermaid
flowchart TB
    subgraph Klien["Pengunjung / Pengguna"]
        P[Umum / Calon Siswa]
        S[Siswa / Orang Tua]
        A[Admin / Kaprog Jurusan]
    end

    subgraph FrontOffice["Portal Publik (Front Office)"]
        Landing["Beranda (Hero, Sambutan, Profil Singkat)"]
        Profil["Detail Profil, Visi-Misi & Manajemen"]
        Jurusan["Eksplorasi 7 Program Keahlian"]
        Berita["Pusat Berita & Informasi Sekolah"]
        Prestasi["Showcase Prestasi & Fasilitas"]
        ChatPublik["Live Chat Widget & Tanya Jawab"]
        KonselingBK["Portal Konseling Anonim BK"]
    end

    subgraph BackOffice["Admin Workspace (dshbd23)"]
        Gatekeeper["PIN-Gate Authentication"]
        Overview["Monitoring & Statistik Sekolah"]
        CRUDM["Manajemen Konten (Berita, Jurusan, Prestasi, dsb)"]
        ChatManager["Live Response Pesan Siswa"]
        BKManager["Triage & Respons Tiket BK"]
    end

    subgraph DataEngine["Database & API Layer"]
        API["Next.js API Engine (/api/*)"]
        Prisma["Prisma ORM Client"]
        MySQL[(MySQL Database)]
    end

    P --> Landing & Profil & Jurusan & Berita & Prestasi
    S --> ChatPublik & KonselingBK
    A --> Gatekeeper --> BackOffice

    FrontOffice <--> API
    BackOffice <--> API
    API <--> Prisma <--> MySQL
```

---

## 🧭 Alur Navigasi Publik

* **`/` (Beranda)**:
  * Hero Section dengan tipografi berwibawa & efek visual digital.
  * Ringkasan statistik (jumlah siswa, guru, jurusan, prestasi).
  * Sambutan Kepala Sekolah & Profil Wakil Kepala Sekolah.
  * Spotlight 7 Program Keahlian dengan link langsung.
  * Feed berita terhangat, showcase fasilitas unggulan, dan slider prestasi.
* **`/profil`**: Sejarah sekolah, komitmen mutu, visi & misi, serta bagan struktur pimpinan.
* **`/jurusan` & `/jurusan/[id]`**: Informasi lengkap 7 program keahlian (PPLG, TJKT, Tata Busana, Kuliner, Kecantikan & Spa, ULP, Perhotelan) mencakup kurikulum, prospek karir, dan sarana lab.
* **`/berita` & `/berita/[id]`**: Manajemen artikel berita berkategori dengan dukungan cover resolusi tinggi.
* **`/prestasi`**: Galeri pencapaian siswa/sekolah tingkat regional hingga nasional.
* **`/fasilitas`**: Inventaris laboratorium, workshop, perpustakaan, dan fasilitas praktik.
* **`/konseling`**: Layanan pendampingan siswa dan orang tua dengan pelaporan aman terkategori (Akademik, Karir, Anti-Bullying, Mental Health) tanpa mengharuskan siswa membocorkan identitas.

---

## 📊 Arsitektur & Alur Kerja Dashboard

Dashboard administrator beralamat di URL rahasia `/dshbd23` dan dirancang khusus untuk kenyamanan operasional staf sekolah.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Pengelola / Kaprog
    participant UI as Dashboard View (/dshbd23)
    participant Auth as Auth API (/api/auth)
    participant Data as Data API (/api/*)
    participant DB as MySQL via Prisma

    Admin->>UI: Mengakses /dshbd23
    UI->>Admin: Tampilkan Layar Kunci PIN Digital
    Admin->>UI: Masukkan PIN Akses
    UI->>Auth: Validasi PIN (POST /api/auth)
    Auth->>DB: Query tabel 'Pin'
    DB-->>Auth: Data PIN & Role Ditemukan
    Auth-->>UI: Return Token/Session + Role { type, name }
    
    alt Jika Role = Super Admin
        UI->>Data: Fetch All Metrics & Konten
        UI-->>Admin: Akses Penuh (Overview, Guru/Siswa, Jurusan, Berita, Fasilitas, BK, Chat)
    else Jika Role = Ketua Jurusan (Major)
        UI->>Data: Fetch Data Terkait Jurusannya
        UI-->>Admin: Akses Terbatas (Posting Berita & Pembaruan Jurusan Mandiri)
    end

    Admin->>UI: Modifikasi Data / Balas Pesan / Respon BK
    UI->>Data: Request Mutasi (POST/PUT/DELETE)
    Data->>DB: Eksekusi Update Prisma
    DB-->>Data: Selesai
    Data-->>UI: Response Sukses & Re-render Real-time
```

### Modul-Modul di Dashboard:

1. **🔐 Gatekeeper Otentikasi Berbasis PIN**:
   * Akses tidak menggunakan username rumit, melainkan PIN digital terenkripsi.
   * Terdapat pemisahan wewenang antara **Super Admin** (akses global) dan **Akun Jurusan** (akses kurasi informasi jurusannya sendiri).
2. **📈 Overview & Statistik Interaktif**:
   * Ringkasan angka siswa, guru, total artikel berita, prestasi terdaftar, dan fasilitas sekolah.
   * Status pesan live chat yang aktif serta jumlah tiket konseling BK yang butuh respon cepat.
3. **🏫 Modul Manajemen Profil Sekolah & Sivitas**:
   * Update data profil sekolah, kuota siswa, staf pendidik, foto pimpinan & wakil kepala sekolah langsung dari dashboard.
4. **📚 Modul Jurusan & Kurikulum**:
   * Pembaruan deskripsi, kompetensi keahlian unggulan, prospek dunia kerja, serta galeri kegiatan kejuruan.
5. **📰 Modul Publikasi Berita & Event**:
   * Rich text editor untuk rilis berita sekolah, pemilihan kategori dinamis, dan unggah cover berita.
6. **🏆 Modul Showcase Prestasi & 🏢 Fasilitas**:
   * Tambah, sunting, dan arsipkan pencapaian perlombaan serta infrastruktur sarana praktik siswa.
7. **💬 Pusat Pesan Siswa (Live Chat Inbox)**:
   * Menampung sesi pertanyaan interaktif dari siswa secara langsung untuk dijawab oleh operator.
8. **🛡️ Portal Bimbingan Konseling (BK Secure Triage)**:
   * Menerima tiket aduan/konsultasi siswa dengan sistem pseudo-ID anonim.
   * Guru BK dapat membaca rincian keluhan, mengirim pesan solusi/pendampingan, serta menandai status tindak lanjut secara aman dan terenkripsi.

---

## 📁 Struktur Direktori Proyek

```
profilesmk11/
├── prisma/
│   └── schema.prisma         # Skema database MySQL (Relasi, Model & Tipe Data)
├── public/                   # Asset statis publik (Logo, Favicon, Cover Image)
├── scripts/
│   └── seed.js               # Database seeding awal (Data default, Akun PIN Admin)
├── src/
│   ├── app/                  # Next.js App Router Pages & API Routes
│   │   ├── api/              # Backend REST endpoints (auth, news, bk, chat, dsb)
│   │   ├── dshbd23/          # Control Panel / Administrative Dashboard
│   │   ├── konseling/        # Sistem Bimbingan Konseling Anonim
│   │   ├── profil/           # Halaman Visi Misi & Profil
│   │   ├── jurusan/          # Halaman Program Keahlian
│   │   ├── berita/           # Halaman Publikasi Informasi
│   │   ├── prestasi/         # Halaman Pencapaian
│   │   ├── fasilitas/        # Halaman Prasarana Sekolah
│   │   ├── layout.jsx        # Root Layout & Metadata
│   │   └── page.jsx          # Landing Page Utama
│   ├── components/           # Reusable UI (Navbar, Footer, Preloader, Cards)
│   ├── context/              # React Context Providers (Global State Management)
│   ├── data/                 # Mock Data Fallback & Blueprint Sekolah
│   ├── lib/                  # Prisma Database Client Singleton
│   └── styles.css            # Master Design System, Theme Tokens & Animations
├── package.json              # Manifest dependensi dan script npm
└── README.md                 # Dokumentasi utama proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
* **Node.js**: `v18.x` atau `v20.x` (LTS direkomendasikan)
* **MySQL Database**: `v8.0+` atau MariaDB setara
* **NPM** atau **Yarn / PNPM**

### 2. Kloning Repository & Instalasi Dependensi
```bash
# Clone repository
git clone https://github.com/username/profilesmk11.git
cd profilesmk11

# Install dependencies
npm install
```

### 3. Konfigurasi Environment Variable
Buat atau sesuaikan file `.env` di root direktori proyek:
```env
# Koneksi Database MySQL
DATABASE_URL="mysql://username:password@localhost:3306/profilesmk"
```

### 4. Sinkronisasi Database (Prisma)
Jalankan migrasi skema dan generate Prisma Client:
```bash
# Generate Prisma Client
npx prisma generate

# Terapkan skema ke MySQL
npx prisma db push

# Inisialisasi Data Awal & Akun PIN Dashboard
node scripts/seed.js
```

### 5. Menjalankan Server Development
```bash
npm run dev
```
Buka peramban di: **`http://localhost:3000`**

### 6. Build untuk Lingkungan Produksi
```bash
# Build paket produksi
npm run build

# Jalankan server produksi
npm run start
```

---

## 🔑 Informasi Akses Awal (Default Seeding)

> **Catatan Keamanan**: Ubah PIN default ini setelah proses deployment pertama pada menu pengaturan dashboard atau database.

| Role Wewenang | ID Akses / Nama | Default PIN | Hak Akses |
| :--- | :--- | :---: | :--- |
| **Super Administrator** | Admin Sekolah | `2323` | Akses Penuh Seluruh Modul & Konfigurasi |
| **Ketua Jurusan PPLG** | PPLG | `1010` | Modul Berita & Halaman PPLG |
| **Ketua Jurusan TJKT** | TJKT | `2020` | Modul Berita & Halaman TJKT |
| **Ketua Jurusan Busana**| Tata Busana | `3030` | Modul Berita & Halaman Tata Busana |
| **Ketua Jurusan Kuliner** | Kuliner | `4040` | Modul Berita & Halaman Kuliner |
| **Ketua Jurusan Spa/Kecantikan** | Kecantikan & Spa | `5050` | Modul Berita & Halaman Kecantikan |
| **Ketua Jurusan ULP** | ULP | `6060` | Modul Berita & Halaman Wisata (ULP) |
| **Ketua Jurusan Perhotelan** | Perhotelan | `7070` | Modul Berita & Halaman Perhotelan |

---

<div align="center">

Dibuat dengan dedikasi untuk memajukan transformasi digital dunia vokasi Indonesia.  
**SMK Negeri 1 Beringin — Unggul, Kompeten, Berkarakter Digital.**

</div>

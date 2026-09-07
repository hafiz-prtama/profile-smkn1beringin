<div align="center">

# SMKN 1 BERINGIN

### Digital School Profile & Management Platform

<p>
  Platform digital modern untuk memperkenalkan profil sekolah,
  program keahlian, berita, prestasi, fasilitas, serta menyediakan
  berbagai layanan interaktif untuk siswa dan pengelola sekolah.
</p>

<br>

![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=flat-square\&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=flat-square\&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?style=flat-square\&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square\&logo=mysql)
![Lucide](https://img.shields.io/badge/Lucide-React-F36?style=flat-square\&logo=lucide)

<br><br>

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&section=header&color=0:0d1117,50:161b22,100:0d1117&animation=fadeIn" width="100%"/>

</div>

---

## ✦ Tentang Proyek

**SMKN 1 Beringin Digital Platform** merupakan website profil dan sistem informasi sekolah yang dirancang untuk memberikan pengalaman digital yang modern, cepat, dan responsif.

Website ini menggabungkan **informasi publik sekolah** dengan **dashboard pengelolaan konten**, sehingga informasi dapat diperbarui dengan lebih mudah.

### Tujuan utama

* Menampilkan informasi sekolah secara modern.
* Memperkenalkan program keahlian kepada calon siswa.
* Menyediakan pusat berita dan informasi sekolah.
* Menampilkan prestasi serta fasilitas sekolah.
* Menyediakan layanan interaksi dan konsultasi.
* Mempermudah pengelolaan konten melalui dashboard.

---

## ✨ Fitur Utama

### 🌐 Website Publik

**Beranda**

* Hero section
* Informasi singkat sekolah
* Statistik sekolah
* Sambutan kepala sekolah
* Program keahlian
* Berita terbaru
* Prestasi
* Fasilitas

**Profil Sekolah**

* Sejarah sekolah
* Visi & misi
* Struktur pimpinan
* Informasi sekolah

**Program Keahlian**

Informasi mengenai 7 program keahlian:

* PPLG
* TJKT
* Tata Busana
* Kuliner
* Kecantikan & Spa
* ULP
* Perhotelan

**Berita**

* Daftar berita
* Detail artikel
* Kategori berita
* Cover berita

**Prestasi**

* Dokumentasi pencapaian siswa
* Prestasi sekolah
* Galeri kegiatan

**Fasilitas**

* Laboratorium
* Workshop
* Perpustakaan
* Fasilitas praktik

**Konseling**

* Pengajuan konsultasi
* Sistem tiket
* Identitas pengguna dibuat anonim
* Komunikasi dengan pihak BK

---

## 🖥️ Dashboard

Dashboard digunakan untuk membantu pengelola sekolah mengatur berbagai informasi yang tampil pada website.

### Dashboard menyediakan

| Modul          | Fungsi                                  |
| -------------- | --------------------------------------- |
| Overview       | Melihat statistik dan ringkasan website |
| Profil Sekolah | Mengatur informasi sekolah              |
| Jurusan        | Mengatur informasi program keahlian     |
| Berita         | Membuat dan mengelola berita            |
| Prestasi       | Mengelola data prestasi                 |
| Fasilitas      | Mengelola informasi fasilitas           |
| Chat           | Mengelola pesan dari pengguna           |
| Konseling      | Mengelola tiket konsultasi              |

Dengan dashboard ini, perubahan informasi tidak perlu dilakukan langsung pada kode website.

---

## 💡 Tampilan & Pengalaman Pengguna

Website menggunakan pendekatan desain modern dengan fokus pada:

* Clean & minimal interface
* Glassmorphism yang ringan
* Animasi transisi yang halus
* Efek cahaya yang subtle
* Responsive design
* Interactive cards
* Modern typography
* Micro-interactions

> Desain dibuat untuk terlihat modern tanpa mengorbankan kenyamanan membaca dan navigasi.

---

## 🧩 Teknologi

### Frontend & Framework

* **Next.js 15** — Full-stack React framework
* **React 19** — Library antarmuka
* **Vanilla CSS** — Sistem styling dan desain
* **Lucide React** — Icon library
* **React Parallax Tilt** — Interaksi kartu 3D

### Backend & Database

* **Next.js API Routes**
* **Prisma ORM**
* **MySQL**

### Authentication

* **Jose** untuk token/session
* Sistem role-based access
* Pengelolaan akses berdasarkan hak pengguna

---

## 🗺️ Cara Kerja Sistem

```mermaid
flowchart LR

    User["Pengunjung"]
    Admin["Pengelola"]

    Web["Website Publik"]
    Dashboard["Dashboard"]

    API["Next.js API"]
    Prisma["Prisma ORM"]
    DB[("MySQL")]

    User --> Web
    Admin --> Dashboard

    Web --> API
    Dashboard --> API

    API --> Prisma
    Prisma --> DB
```

Secara sederhana:

**Pengguna → Website → API → Database**

Sedangkan pengelola menggunakan dashboard untuk mengatur data yang kemudian ditampilkan pada website.

---

## 📁 Struktur Proyek

```text
profilesmk11/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── assets/
│
├── scripts/
│   └── seed.js
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dshbd23/
│   │   ├── konseling/
│   │   ├── profil/
│   │   ├── jurusan/
│   │   ├── berita/
│   │   ├── prestasi/
│   │   ├── fasilitas/
│   │   ├── layout.jsx
│   │   └── page.jsx
│   │
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   └── styles.css
│
├── package.json
└── README.md
```

---

## 🚀 Instalasi

### 1. Persyaratan

Pastikan sudah tersedia:

* Node.js `18.x` atau `20.x`
* MySQL `8.0+`
* NPM / Yarn / PNPM

### 2. Clone Repository

```bash
git clone https://github.com/username/profilesmk11.git
cd profilesmk11
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Konfigurasi Database

Buat file `.env`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/profilesmk"
```

Sesuaikan:

* `username`
* `password`
* nama database

### 5. Setup Prisma

```bash
npx prisma generate
npx prisma db push
```

Jika project menggunakan data awal:

```bash
node scripts/seed.js
```

### 6. Jalankan Website

```bash
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```

---

## 📦 Production

Untuk membuat build production:

```bash
npm run build
```

Kemudian jalankan:

```bash
npm run start
```

---

## 📌 Halaman Utama

| Halaman         | Deskripsi               |
| --------------- | ----------------------- |
| `/`             | Beranda                 |
| `/profil`       | Profil sekolah          |
| `/jurusan`      | Daftar program keahlian |
| `/jurusan/[id]` | Detail program keahlian |
| `/berita`       | Berita sekolah          |
| `/berita/[id]`  | Detail berita           |
| `/prestasi`     | Prestasi                |
| `/fasilitas`    | Fasilitas               |
| `/konseling`    | Layanan konseling       |

---

## 🔐 Sistem Akses

Dashboard menggunakan sistem **Role-Based Access Control (RBAC)**.

Setiap pengguna dashboard mendapatkan akses sesuai dengan perannya.

Contohnya:

```text
Super Admin
    │
    ├── Profil Sekolah
    ├── Jurusan
    ├── Berita
    ├── Prestasi
    ├── Fasilitas
    ├── Chat
    └── Konseling

Pengelola Jurusan
    │
    └── Konten Jurusannya
```

Hal ini membuat pengelolaan data lebih terstruktur dan membatasi akses sesuai kebutuhan.

---

## 🎯 Fokus Pengembangan

Project ini dikembangkan dengan beberapa fokus:

**Performance**
Website dibuat agar tetap ringan dan responsif.

**Accessibility**
Informasi dibuat mudah ditemukan dan dibaca.

**Maintainability**
Struktur project dibuat modular agar lebih mudah dikembangkan.

**Security**
Akses dashboard dan data pengguna dilindungi menggunakan mekanisme autentikasi dan kontrol akses.

**User Experience**
Animasi dan interaksi digunakan secukupnya agar website terasa hidup tanpa mengganggu pengguna.

---

<div align="center">

### Built for SMKN 1 Beringin

*Modern technology for better education.*

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&height=100&section=footer&color=0:0d1117,50:161b22,100:0d1117&animation=fadeIn" width="100%"/>

</div>

export const school = {
  name: "SMK NEGERI 1 BERINGIN",
  studentCount: 1310,
  teacherCount: 100,
  achievementCount: 692,
  majorCount: 7,
  location: "Deli Serdang, Sumatera Utara",
  tagline: "Membentuk Generasi Kompeten, Berkarakter, dan Siap Menghadapi Masa Depan.",
  description:
    "SMK Negeri 1 Beringin hadir sebagai sekolah kejuruan yang berfokus pada pengembangan kompetensi, karakter, kreativitas, dan kesiapan peserta didik menghadapi dunia kerja maupun pendidikan lanjutan.",
  principal: {
    name: "Nama Kepala Sekolah",
    role: "Kepala Sekolah",
    photo: "/placeholder-person.svg",
    greeting:
      "Selamat datang di website resmi SMK Negeri 1 Beringin. Website ini menjadi media informasi sekolah sekaligus jembatan komunikasi antara sekolah, siswa, orang tua, alumni, dan masyarakat."
  },
  vicePrincipal: {
    name: "Nama Wakil Kepala Sekolah",
    role: "Wakil Kepala Sekolah",
    photo: "/placeholder-person.svg"
  }
};

export const majors = [
  {
    id: "pplg",
    short: "PPLG",
    name: "Pengembangan Perangkat Lunak dan Gim",
    description: "Mempelajari pemrograman, pengembangan aplikasi, website, basis data, dan gim untuk menghasilkan produk digital.",
    skills: ["Pemrograman", "Web Development", "Mobile Development", "Database", "Game Development"],
    career: ["Web Developer", "Software Developer", "Mobile Developer", "Game Developer", "Database Administrator"]
  },
  {
    id: "tjkt",
    short: "TJKT",
    name: "Teknik Jaringan Komputer dan Telekomunikasi",
    description: "Mempelajari jaringan komputer, server, perangkat jaringan, keamanan jaringan, dan teknologi telekomunikasi.",
    skills: ["Networking", "Server", "Cyber Security", "Hardware", "Telekomunikasi"],
    career: ["Network Technician", "System Administrator", "IT Support", "Network Engineer", "Telecommunication Technician"]
  },
  {
    id: "tata-busana",
    short: "TATA BUSANA",
    name: "Tata Busana",
    description: "Mempelajari desain busana, pembuatan pola, teknik menjahit, pengembangan produk fashion, dan tata busana.",
    skills: ["Desain Busana", "Pembuatan Pola", "Teknik Menjahit", "Fashion Product", "Kewirausahaan"],
    career: ["Fashion Designer", "Pattern Maker", "Tailor", "Fashion Entrepreneur", "Fashion Production Staff"]
  },
  {
    id: "kuliner",
    short: "KULINER",
    name: "Kuliner",
    description: "Mempelajari pengolahan makanan dan minuman, teknik memasak, penyajian, keamanan pangan, dan usaha kuliner.",
    skills: ["Pengolahan Makanan", "Pengolahan Minuman", "Pastry", "Food Safety", "Usaha Kuliner"],
    career: ["Chef", "Cook", "Pastry Cook", "Food Entrepreneur", "Kitchen Staff"]
  },
  {
    id: "kecantikan-spa",
    short: "KECANTIKAN & SPA",
    name: "Kecantikan dan Spa",
    description: "Mempelajari perawatan kulit dan rambut, tata rias, perawatan tubuh, spa, serta pelayanan kecantikan.",
    skills: ["Tata Rias", "Perawatan Kulit", "Perawatan Rambut", "Perawatan Tubuh", "Spa"],
    career: ["Beauty Therapist", "Makeup Artist", "Hair Stylist", "Spa Therapist", "Beauty Entrepreneur"]
  },
  {
    id: "ulp",
    short: "ULP",
    name: "Usaha Layanan Pariwisata",
    description: "Mempelajari pelayanan pariwisata, perjalanan wisata, pelayanan pelanggan, penyusunan perjalanan, dan pengelolaan kegiatan wisata.",
    skills: ["Tour Planning", "Tour Guiding", "Customer Service", "Ticketing", "Hospitality"],
    career: ["Tour Guide", "Travel Consultant", "Tour Operator Staff", "Ticketing Staff", "Tourism Service Staff"]
  },
  {
    id: "perhotelan",
    short: "PERHOTELAN",
    name: "Perhotelan",
    description: "Mempelajari pelayanan hotel, front office, tata graha, pelayanan tamu, dan pengelolaan akomodasi.",
    skills: ["Front Office", "Housekeeping", "Guest Service", "Hotel Operation", "Hospitality"],
    career: ["Front Office Staff", "Housekeeping Staff", "Guest Service Agent", "Hotel Supervisor", "Hospitality Staff"]
  }
];

export const achievements = [
  { id: 1, title: "Prestasi Sekolah", category: "Akademik", year: "2026", description: "Tambahkan deskripsi prestasi sekolah di sini.", image: "" },
  { id: 2, title: "Juara Kompetisi Siswa", category: "Kompetisi", year: "2026", description: "Tambahkan deskripsi prestasi siswa di sini.", image: "" },
  { id: 3, title: "Prestasi Ekstrakurikuler", category: "Non-Akademik", year: "2025", description: "Tambahkan deskripsi prestasi ekstrakurikuler di sini.", image: "" }
];

export const news = [
  { id: 1, title: "Kegiatan Sekolah", date: "01 Agustus 2026", category: "Kegiatan", excerpt: "Tambahkan ringkasan berita sekolah di sini.", content: "Isi lengkap berita dapat dikelola dari backend Laravel nanti.", image: "/news-placeholder.svg" },
  { id: 2, title: "Informasi Terbaru Sekolah", date: "15 Juli 2026", category: "Pengumuman", excerpt: "Tambahkan informasi terbaru sekolah di sini.", content: "Isi lengkap pengumuman dapat dikelola dari backend Laravel nanti.", image: "/news-placeholder.svg" },
  { id: 3, title: "Kegiatan Siswa", date: "30 Juni 2026", category: "Siswa", excerpt: "Tambahkan berita kegiatan siswa di sini.", content: "Isi lengkap berita kegiatan siswa dapat dikelola dari backend Laravel nanti.", image: "/news-placeholder.svg" }
];

export const facilities = [
  { id: 1, name: "Laboratorium Komputer", description: "Ruang praktik untuk kegiatan pembelajaran teknologi dan pemrograman.", image: "/facility-placeholder.svg" },
  { id: 2, name: "Ruang Kelas", description: "Ruang pembelajaran yang nyaman untuk kegiatan akademik siswa.", image: "/facility-placeholder.svg" },
  { id: 3, name: "Perpustakaan", description: "Sarana literasi dan sumber belajar bagi warga sekolah.", image: "/facility-placeholder.svg" },
  { id: 4, name: "Lapangan Sekolah", description: "Area kegiatan olahraga dan aktivitas siswa.", image: "/facility-placeholder.svg" }
];

// ─── FAQ Chatbot ─────────────────────────────────────────────────────────────
// Keyword: kata kunci yang dicocokkan dari input pengguna (case-insensitive)
export const chatbotFaq = [
  {
    id: 1,
    question: "Di mana lokasi SMK Negeri 1 Beringin?",
    keywords: ["lokasi", "alamat", "dimana", "letak", "di mana"],
    answer:
      "SMK Negeri 1 Beringin berlokasi di Kabupaten Deli Serdang, Sumatera Utara. Silakan hubungi sekolah untuk informasi alamat lengkap.",
  },
  {
    id: 2,
    question: "Apa saja jurusan yang tersedia?",
    keywords: ["jurusan", "program", "keahlian", "prodi"],
    answer:
      "SMK Negeri 1 Beringin memiliki 7 program keahlian:\n• PPLG – Pengembangan Perangkat Lunak & Gim\n• TJKT – Teknik Jaringan Komputer & Telekomunikasi\n• Tata Busana\n• Kuliner\n• Kecantikan & Spa\n• ULP - 8 Usaha Layanan Pariwisata \n• Perhotelan",
  },
  {
    id: 3,
    question: "Bagaimana cara mendaftar ke sekolah ini?",
    keywords: ["daftar", "pendaftaran", "ppdb", "masuk", "registrasi"],
    answer:
      "Pendaftaran siswa baru dilakukan melalui jalur PPDB (Penerimaan Peserta Didik Baru) yang dibuka setiap tahun. Untuk informasi lebih lanjut, silakan hubungi sekolah atau pantau pengumuman resmi di website ini.",
  },
  {
    id: 4,
    question: "Berapa jumlah siswa di sekolah ini?",
    keywords: ["jumlah siswa", "berapa siswa", "total siswa"],
    answer:
      "Saat ini SMK Negeri 1 Beringin memiliki lebih dari 1.310 siswa aktif yang terbagi dalam berbagai program keahlian.",
  },
  {
    id: 5,
    question: "Apa fasilitas yang tersedia di sekolah?",
    keywords: ["fasilitas", "sarana", "prasarana", "lab", "laboratorium"],
    answer:
      "Fasilitas yang tersedia antara lain:\n• Laboratorium Komputer\n• Ruang Kelas yang nyaman\n• Perpustakaan\n• Lapangan Sekolah\ndan fasilitas pendukung lainnya.",
  },
  {
    id: 6,
    question: "Apakah ada ekstrakurikuler di sekolah ini?",
    keywords: ["ekstrakurikuler", "ekskul", "kegiatan", "organisasi", "osis"],
    answer:
      "Ya, SMK Negeri 1 Beringin memiliki berbagai kegiatan ekstrakurikuler untuk mengembangkan bakat dan minat siswa. Untuk daftar lengkap, silakan hubungi pihak sekolah.",
  },
  {
    id: 7,
    question: "Bagaimana cara menghubungi sekolah?",
    keywords: ["kontak", "hubungi", "telepon", "email", "whatsapp", "narahubung"],
    answer:
      "Anda dapat menghubungi SMK Negeri 1 Beringin melalui halaman Profil → Kontak di website ini, atau datang langsung ke sekolah di Kabupaten Deli Serdang, Sumatera Utara.",
  },
  {
    id: 8,
    question: "Siapa kepala sekolah SMK Negeri 1 Beringin?",
    keywords: ["kepala sekolah", "kepsek", "pimpinan", "kepala"],
    answer:
      "Informasi mengenai kepala sekolah dan pimpinan sekolah dapat dilihat pada halaman Profil di website ini.",
  },
  {
    id: 9,
    question: "Apakah ada beasiswa di sekolah ini?",
    keywords: ["beasiswa", "bantuan", "bos", "pip", "biaya"],
    answer:
      "SMK Negeri 1 Beringin adalah sekolah negeri yang mendapat dukungan dana BOS. Terdapat juga program beasiswa seperti PIP (Program Indonesia Pintar) bagi siswa yang memenuhi syarat. Hubungi sekolah untuk informasi lebih lanjut.",
  },
  {
    id: 10,
    question: "Apa prestasi yang pernah diraih?",
    keywords: ["prestasi", "penghargaan", "juara", "lomba", "kompetisi"],
    answer:
      "SMK Negeri 1 Beringin telah meraih berbagai prestasi di bidang akademik, kompetisi kejuruan, dan ekstrakurikuler. Kunjungi halaman Prestasi untuk melihat pencapaian lengkap sekolah.",
  },
];
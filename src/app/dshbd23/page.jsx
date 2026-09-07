"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, Newspaper, Trophy,
  Building2, BookOpen, Settings, Eye,
  LogOut, Plus, Trash2, Save, Lock,
  ChevronRight, GraduationCap, Check, X, UserRound, UserCog, BarChart3, ShieldCheck, Pencil, Minus,
  Upload, ImagePlus, Camera, MessageCircle, Send, School
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";

const NAV_ITEMS = [
  { id: "overview", icon: <LayoutDashboard size={17} />, label: "Overview" },
  { id: "data-sekolah", icon: <BarChart3 size={17} />, label: "Data Siswa & Guru" },
  { id: "profil", icon: <Users size={17} />, label: "Profil Sekolah" },
  { id: "jurusan", icon: <BookOpen size={17} />, label: "Jurusan" },
  { id: "prestasi", icon: <Trophy size={17} />, label: "Prestasi" },
  { id: "berita", icon: <Newspaper size={17} />, label: "Berita" },
  { id: "fasilitas", icon: <Building2 size={17} />, label: "Fasilitas" },
  { id: "chat", icon: <MessageCircle size={17} />, label: "Pesan Siswa" },
  { id: "bk", icon: <ShieldCheck size={17} />, label: "Konseling BK" },
  { id: "pengaturan", icon: <Settings size={17} />, label: "Pengaturan" },
];

// ─── Tombol Tambah mengambang ────────────────────────────────────────────────
function QuickAddButton({ role, open, onToggle, onAdd }) {
  const isMajor = role?.type === "major";

  return (
    <div className="quick-add-wrap">
      {open && (
        <div className="quick-add-menu">
          <div className="quick-add-menu-title">Tambah Informasi</div>

          <button onClick={() => onAdd("berita")}>
            <Newspaper size={16} />
            <span>Berita</span>
          </button>

          {!isMajor && (
            <>
              <button onClick={() => onAdd("prestasi")}>
                <Trophy size={16} />
                <span>Prestasi</span>
              </button>
              <button onClick={() => onAdd("fasilitas")}>
                <Building2 size={16} />
                <span>Fasilitas</span>
              </button>
              <button onClick={() => onAdd("jurusan")}>
                <BookOpen size={16} />
                <span>Jurusan</span>
              </button>
            </>
          )}
        </div>
      )}

      <button
        className={`quick-add-button ${open ? "quick-add-button--active" : ""}`}
        onClick={onToggle}
        aria-label={open ? "Tutup menu tambah" : "Tambah informasi"}
        aria-expanded={open}
      >
        <span className="quick-add-icon">{open ? <X size={21} /> : <Plus size={21} />}</span>
        <span>Tambah</span>
      </button>
    </div>
  );
}

// ─── Toast notifikasi kecil ───────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, []);
  return (
    <div className="admin-toast">
      <Check size={14} /> {msg}
    </div>
  );
}

// ─── PIN Login Screen ─────────────────────────────────────────────────────────
function PinLogin({ onSuccess }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleDigit(val) {
    setError(false);
    const filled = digits.filter(Boolean);
    if (filled.length >= 4) return;
    const next = [...digits];
    next[filled.length] = val;
    setDigits(next);

    if (filled.length === 3) {
      const entered = [...next].join("");

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: entered })
        });

        const data = await res.json();
        if (data.success) {
          onSuccess(data.role);
        } else {
          setShake(true);
          setError(true);
          setTimeout(() => { setDigits(["", "", "", ""]); setShake(false); }, 600);
        }
      } catch (err) {
        setShake(true);
        setError(true);
        setTimeout(() => { setDigits(["", "", "", ""]); setShake(false); }, 600);
      }
    }
  }

  function handleDel() {
    const filled = digits.filter(Boolean).length;
    if (filled === 0) return;
    const next = [...digits];
    next[filled - 1] = "";
    setDigits(next);
    setError(false);
  }

  const PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div className="pin-screen">
      <div className="pin-card">
        <div className="pin-logo">
          <img src="/logo-smk.png" alt="Logo SMK" />
        </div>
        <h2 className="pin-title">Admin Dashboard</h2>
        <p className="pin-subtitle">Masukkan PIN 4 digit untuk melanjutkan</p>

        {/* Dot indicators */}
        <div className={`pin-dots ${shake ? "pin-dots--shake" : ""}`}>
          {digits.map((d, i) => (
            <div key={i} className={`pin-dot ${d ? "pin-dot--filled" : ""} ${error ? "pin-dot--error" : ""}`} />
          ))}
        </div>
        {error && <p className="pin-error">PIN salah. Coba lagi.</p>}

        {/* Numpad */}
        <div className="pin-pad">
          {PAD.map((k, i) => (
            k === "" ? <div key={i} /> :
              k === "⌫" ? (
                <button key={i} className="pin-key pin-key--del" onClick={handleDel}><X size={18} /></button>
              ) : (
                <button key={i} className="pin-key" onClick={() => handleDigit(k)}>{k}</button>
              )
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function TabOverview({ setTab }) {
  const { school, majors, achievements, news, facilities } = useData();
  const cards = [
    { label: "Total Siswa", value: school.studentCount ?? 0, color: "#2563eb", id: "data-sekolah", icon: <GraduationCap size={19} /> },
    { label: "Total Guru", value: school.teacherCount ?? 0, color: "#059669", id: "data-sekolah", icon: <UserCog size={19} /> },
    { label: "Jurusan", value: majors.length, color: "#7c3aed", id: "jurusan", icon: <BookOpen size={19} /> },
    { label: "Prestasi", value: achievements.length, color: "#ea580c", id: "prestasi", icon: <Trophy size={19} /> },
    { label: "Berita", value: news.length, color: "#0369a1", id: "berita", icon: <Newspaper size={19} /> },
    { label: "Fasilitas", value: facilities.length, color: "#059669", id: "fasilitas", icon: <Building2 size={19} /> },
  ];
  return (
    <div>
      <div className="admin-welcome">
        <div>
          <p className="tab-desc">Selamat datang di dashboard admin</p>
          <h2>{school.name}</h2>
          <p>Kelola data sekolah dan seluruh konten website dari satu tempat.</p>
        </div>
        <div className="admin-status"><ShieldCheck size={18} /><span>Mode Admin Aktif</span></div>
      </div>
      <div className="overview-grid overview-grid--six">
        {cards.map((c) => (
          <button key={`${c.id}-${c.label}`} className="overview-card" style={{ borderTop: `3px solid ${c.color}` }} onClick={() => setTab(c.id)}>
            <span className="overview-icon" style={{ color: c.color, background: `${c.color}14` }}>{c.icon}</span>
            <span className="overview-num" style={{ color: c.color }}>{c.value.toLocaleString("id-ID")}</span>
            <span className="overview-label">{c.label}</span>
            <ChevronRight size={14} className="overview-arrow" />
          </button>
        ))}
      </div>
      <div className="admin-quick-grid">
        <button onClick={() => setTab("data-sekolah")}><GraduationCap size={18} /><span><strong>Data Siswa & Guru</strong><small>Ubah jumlah data tenaga pendidik dan siswa.</small></span><ChevronRight size={15} /></button>
        <button onClick={() => setTab("prestasi")}><Trophy size={18} /><span><strong>Kelola Prestasi</strong><small>Tambah, edit, atau hapus prestasi sekolah.</small></span><ChevronRight size={15} /></button>
        <button onClick={() => setTab("berita")}><Newspaper size={18} /><span><strong>Kelola Berita</strong><small>Perbarui berita dan pengumuman sekolah.</small></span><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

// ─── Tab: Data Siswa & Guru ───────────────────────────────────────────────────
function TabDataSekolah({ toast }) {
  const { school, majors, achievements, updateSchool } = useData();
  const [students, setStudents] = useState(school.studentCount ?? 1310);
  const [teachers, setTeachers] = useState(school.teacherCount ?? 100);
  const [prestasi, setPrestasi] = useState(school.achievementCount ?? 692);
  const [jurusan, setJurusan] = useState(school.majorCount ?? majors.length);

  useEffect(() => {
    setStudents(school.studentCount ?? 1310);
    setTeachers(school.teacherCount ?? 100);
    setPrestasi(school.achievementCount ?? 692);
    setJurusan(school.majorCount ?? majors.length);
  }, [school.studentCount, school.teacherCount, school.achievementCount, school.majorCount, majors.length]);

  function normalize(value) {
    return Math.max(0, Number(value) || 0);
  }

  function saveCounts() {
    const nextStudents = normalize(students);
    const nextTeachers = normalize(teachers);
    const nextPrestasi = normalize(prestasi);
    const nextJurusan = normalize(jurusan);

    updateSchool({
      ...school,
      studentCount: nextStudents,
      teacherCount: nextTeachers,
      achievementCount: nextPrestasi,
      majorCount: nextJurusan,
    });

    setStudents(nextStudents);
    setTeachers(nextTeachers);
    setPrestasi(nextPrestasi);
    setJurusan(nextJurusan);
    toast("Statistik beranda berhasil diperbarui!");
  }

  const editors = [
    { title: "DATA SISWA", description: "Jumlah siswa aktif", value: students, setValue: setStudents, icon: <GraduationCap size={22} />, tone: "student", suffix: "+" },
    { title: "DATA GURU", description: "Jumlah guru / tenaga pendidik", value: teachers, setValue: setTeachers, icon: <UserCog size={22} />, tone: "teacher", suffix: "+" },
    { title: "DATA PRESTASI", description: "Jumlah prestasi yang ditampilkan", value: prestasi, setValue: setPrestasi, icon: <Trophy size={22} />, tone: "achievement", suffix: "+" },
    { title: "DATA JURUSAN", description: "Jumlah program keahlian", value: jurusan, setValue: setJurusan, icon: <BookOpen size={22} />, tone: "major", suffix: "" },
  ];

  return (
    <div className="data-management">
      <div className="data-intro">
        <div className="data-intro-icon"><BarChart3 size={22} /></div>
        <div><h2>Data Statistik Beranda</h2><p>Ubah angka yang tampil pada statistik di bagian hero website.</p></div>
      </div>

      <div className="stats-editor-grid">
        {editors.map((item) => (
          <div className="stat-editor-card" key={item.title}>
            <div className="stat-editor-top">
              <div className={`stat-editor-icon stat-editor-icon--${item.tone}`}>{item.icon}</div>
              <span>{item.title}</span>
            </div>
            <strong>{normalize(item.value).toLocaleString("id-ID")}{item.suffix}</strong>
            <label>{item.description}</label>
            <div className="number-control">
              <button type="button" onClick={() => item.setValue(Math.max(0, normalize(item.value) - 1))}><Minus size={16} /></button>
              <input type="number" min="0" value={item.value} onChange={e => item.setValue(e.target.value)} />
              <button type="button" onClick={() => item.setValue(normalize(item.value) + 1)}><Plus size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="data-save-row">
        <div><strong>Perubahan belum tersimpan?</strong><span>Klik simpan setelah semua angka sudah benar.</span></div>
        <button className="btn-save" onClick={saveCounts}><Save size={15} /> Simpan Statistik Beranda</button>
      </div>
    </div>
  );
}

// ─── Reusable: Photo Uploader ─────────────────────────────────────────────────
function PhotoUploader({ id, value, onChange, onRemove, label, toast, maxMB = 2 }) {
  function handleFile(file) {
    if (!file) return;
    if (file.size > maxMB * 1024 * 1024) { toast(`Ukuran foto maksimal ${maxMB} MB!`); return; }
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  }
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="photo-uploader">
        {value && !value.includes("placeholder") ? (
          <div className="photo-preview">
            <img src={value} alt="Preview" />
            <div className="photo-preview-overlay">
              <label htmlFor={id} className="photo-change-btn">
                <Camera size={13} /> Ganti Foto
              </label>
              <button type="button" className="photo-remove-btn" onClick={onRemove}>
                <X size={13} /> Hapus
              </button>
            </div>
          </div>
        ) : (
          <label htmlFor={id} className="photo-dropzone">
            <span className="photo-dropzone-icon"><ImagePlus size={28} /></span>
            <span className="photo-dropzone-text">Klik untuk upload foto</span>
            <span className="photo-dropzone-hint">PNG, JPG, WEBP · Maks. {maxMB} MB</span>
          </label>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
          onClick={(e) => { e.target.value = ""; }}
        />
      </div>
    </div>
  );
}

// ─── Tab: Profil Sekolah ──────────────────────────────────────────────────────
function TabProfil({ toast }) {
  const { school, updateSchool } = useData();
  const [form, setForm] = useState({ ...school });

  function handleChange(e) { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); }
  function handleNested(section, key, val) {
    setForm((p) => ({ ...p, [section]: { ...p[section], [key]: val } }));
  }

  function handleSave() { updateSchool(form); toast("Profil sekolah tersimpan!"); }

  return (
    <div className="tab-form">

      {/* ── Foto Gedung / Cover Sekolah ── */}
      <h3 className="form-section-title">📸 Foto Sekolah (Tampil di Beranda)</h3>
      <PhotoUploader
        id="cover-school-upload"
        label="Foto Gedung / Cover Sekolah"
        value={form.coverPhoto || ""}
        onChange={(val) => setForm((p) => ({ ...p, coverPhoto: val }))}
        onRemove={() => setForm((p) => ({ ...p, coverPhoto: "" }))}
        toast={toast}
      />

      <hr className="form-divider" />
      <h3 className="form-section-title">Informasi Sekolah</h3>
      <div className="form-group">
        <label>Nama Sekolah</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Lokasi</label>
        <input name="location" value={form.location} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Tagline</label>
        <input name="tagline" value={form.tagline} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Deskripsi</label>
        <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
      </div>

      <hr className="form-divider" />
      <h3 className="form-section-title">📸 Kepala Sekolah</h3>
      <PhotoUploader
        id="principal-photo-upload"
        label="Foto Kepala Sekolah"
        value={form.principal?.photo || ""}
        onChange={(val) => handleNested("principal", "photo", val)}
        onRemove={() => handleNested("principal", "photo", "/placeholder-person.svg")}
        toast={toast}
      />
      <div className="form-group">
        <label>Nama Kepala Sekolah</label>
        <input value={form.principal?.name || ""} onChange={(e) => handleNested("principal", "name", e.target.value)} />
      </div>
      <div className="form-group">
        <label>Sambutan Kepala Sekolah</label>
        <textarea rows={3} value={form.principal?.greeting || ""} onChange={(e) => handleNested("principal", "greeting", e.target.value)} />
      </div>

      <hr className="form-divider" />
      <h3 className="form-section-title">📸 Wakil Kepala Sekolah</h3>
      <PhotoUploader
        id="vice-principal-photo-upload"
        label="Foto Wakil Kepala Sekolah"
        value={form.vicePrincipal?.photo || ""}
        onChange={(val) => handleNested("vicePrincipal", "photo", val)}
        onRemove={() => handleNested("vicePrincipal", "photo", "/placeholder-person.svg")}
        toast={toast}
      />
      <div className="form-group">
        <label>Nama Wakil Kepala Sekolah</label>
        <input value={form.vicePrincipal?.name || ""} onChange={(e) => handleNested("vicePrincipal", "name", e.target.value)} />
      </div>

      <button className="btn-save" onClick={handleSave}><Save size={15} /> Simpan Semua Perubahan</button>
    </div>
  );
}

// ─── CRUD list generik ────────────────────────────────────────────────────────
function CrudList({ items, onSave, onDelete, fields, createEmpty, toast }) {
  const [list, setList] = useState(items);
  const [editing, setEditing] = useState(null); // index yang sedang diedit
  const [confirm, setConfirm] = useState(null); // index yang mau dihapus

  function handleField(idx, key, val) {
    setList((prev) => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  }

  function handleAdd() {
    const empty = createEmpty(Date.now());
    setList((prev) => [...prev, empty]);
    setEditing(0);
  }

  function handleDelete(idx) {
    const next = list.filter((_, i) => i !== idx);
    setList(next);
    onSave(next);
    setConfirm(null);
    toast("Item dihapus.");
  }

  function handleSave() {
    onSave(list);
    setEditing(null);
    toast("Perubahan tersimpan!");
  }

  return (
    <div className="crud-list">
      {list.map((item, idx) => (
        <div key={item.id ?? idx} className={`crud-item ${editing === idx ? "crud-item--open" : ""}`}>
          {/* ── Header baris ── */}
          <div className="crud-item-header" onClick={() => setEditing(editing === idx ? null : idx)}>
            <span className="crud-item-title">
              {item.name || item.title || item.short || `Item ${idx + 1}`}
            </span>
            <div className="crud-item-actions">
              <button className="crud-btn-del" onClick={(e) => { e.stopPropagation(); setConfirm(idx); }}>
                <Trash2 size={14} />
              </button>
              <ChevronRight size={15} className={`crud-chevron ${editing === idx ? "crud-chevron--open" : ""}`} />
            </div>
          </div>

          {/* ── Form edit (expandable) ── */}
          {editing === idx && (
            <div className="crud-item-body">
              {fields.map(({ key, label, type = "text", rows }) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  {type === "textarea" ? (
                    <textarea rows={rows ?? 3} value={item[key] ?? ""} onChange={(e) => handleField(idx, key, e.target.value)} />
                  ) : (
                    <input type={type} value={item[key] ?? ""} onChange={(e) => handleField(idx, key, e.target.value)} />
                  )}
                </div>
              ))}
              <button className="btn-save" onClick={handleSave}><Save size={14} /> Simpan</button>
            </div>
          )}
        </div>
      ))}

      <button className="btn-add" onClick={handleAdd}><Plus size={15} /> Tambah Baru</button>

      {/* Modal konfirmasi hapus */}
      {confirm !== null && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus item ini?</h3>
            <p>Tindakan ini tidak bisa dibatalkan.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-danger" onClick={() => handleDelete(confirm)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Jurusan ─────────────────────────────────────────────────────────────
function TabJurusan({ toast, autoAddKey = 0 }) {
  const { majors, updateMajors } = useData();
  const [list, setList] = useState(majors);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  React.useEffect(() => { setList(majors); }, [majors]);

  React.useEffect(() => {
    if (autoAddKey > 0) handleAdd();
  }, [autoAddKey]);

  function handleField(idx, key, val) {
    setList((prev) => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  }

  function handleImageUpload(idx, file) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast("Ukuran foto maksimal 3 MB!"); return; }
    const reader = new FileReader();
    reader.onload = (e) => handleField(idx, "image", e.target.result);
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    const empty = { id: String(Date.now()), short: "", name: "", description: "", skills: [], career: [], image: "" };
    setList((prev) => { setEditing(prev.length); return [...prev, empty]; });
  }

  function handleSave() { updateMajors(list); setEditing(null); toast("Jurusan berhasil disimpan!"); }

  function handleDelete(idx) {
    const next = list.filter((_, i) => i !== idx);
    setList(next); updateMajors(next); setConfirm(null); toast("Jurusan dihapus.");
  }

  return (
    <div className="crud-list">
      {list.map((item, idx) => (
        <div key={item.id ?? idx} className={`crud-item ${editing === idx ? "crud-item--open" : ""}`}>
          <div className="crud-item-header" onClick={() => setEditing(editing === idx ? null : idx)}>
            <span className="crud-item-title">
              {item.short && <span className="crud-item-badge">{item.short}</span>}
              {item.name || `Jurusan ${idx + 1}`}
            </span>
            <div className="crud-item-actions">
              <button className="crud-btn-del" onClick={(e) => { e.stopPropagation(); setConfirm(idx); }}><Trash2 size={14} /></button>
              <ChevronRight size={15} className={`crud-chevron ${editing === idx ? "crud-chevron--open" : ""}`} />
            </div>
          </div>

          {editing === idx && (
            <div className="crud-item-body">

              {/* ── Foto Jurusan ── */}
              <div className="form-group">
                <label>Foto Jurusan</label>
                <div className="photo-uploader">
                  {item.image && !item.image.includes("placeholder") ? (
                    <div className="photo-preview photo-preview--wide">
                      <img src={item.image} alt="Preview jurusan" />
                      <div className="photo-preview-overlay">
                        <label className="photo-change-btn" htmlFor={`jurusan-img-${idx}`}>
                          <Camera size={13} /> Ganti Foto
                        </label>
                        <button type="button" className="photo-remove-btn" onClick={() => handleField(idx, "image", "")}>
                          <X size={13} /> Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="photo-dropzone photo-dropzone--wide" htmlFor={`jurusan-img-${idx}`}>
                      <span className="photo-dropzone-icon"><ImagePlus size={28} /></span>
                      <span className="photo-dropzone-text">Klik untuk upload foto jurusan</span>
                      <span className="photo-dropzone-hint">PNG, JPG, WEBP · Maks. 3 MB</span>
                    </label>
                  )}
                  <input id={`jurusan-img-${idx}`} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(idx, e.target.files?.[0])}
                    onClick={(e) => { e.target.value = ""; }} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Kode / Singkatan</label>
                  <input type="text" value={item.short ?? ""} onChange={(e) => handleField(idx, "short", e.target.value)} placeholder="Misal: PPLG" />
                </div>
                <div className="form-group">
                  <label>Nama Lengkap Jurusan</label>
                  <input type="text" value={item.name ?? ""} onChange={(e) => handleField(idx, "name", e.target.value)} placeholder="Nama program keahlian" />
                </div>
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea rows={3} value={item.description ?? ""} onChange={(e) => handleField(idx, "description", e.target.value)} placeholder="Deskripsi singkat jurusan ini..." />
              </div>
              <button className="btn-save" onClick={handleSave}><Save size={14} /> Simpan Jurusan</button>
            </div>
          )}
        </div>
      ))}

      <button className="btn-add" onClick={handleAdd}><Plus size={15} /> Tambah Jurusan Baru</button>

      {confirm !== null && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus jurusan ini?</h3>
            <p>Tindakan ini tidak bisa dibatalkan.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-danger" onClick={() => handleDelete(confirm)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Prestasi ────────────────────────────────────────────────────────────
function TabPrestasi({ toast, autoAddKey = 0 }) {
  const { achievements, updateAchievements } = useData();
  const [list, setList] = useState(achievements);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  // Sinkronisasi jika data dari context berubah (misal: reset)
  React.useEffect(() => { setList(achievements); }, [achievements]);

  React.useEffect(() => {
    if (autoAddKey > 0) handleAdd();
  }, [autoAddKey]);

  function handleField(idx, key, val) {
    setList((prev) => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  }

  // Konversi gambar ke base64 agar bisa disimpan di localStorage
  function handleImageUpload(idx, file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast("Ukuran gambar maksimal 2 MB!"); return; }
    const reader = new FileReader();
    reader.onload = (e) => handleField(idx, "image", e.target.result);
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    const empty = { id: Date.now(), title: "", category: "", year: new Date().getFullYear().toString(), description: "", image: "", createdAt: Date.now() };
    const next = [empty, ...list];
    setList(next);
    setEditing(list.length);
  }

  function handleSave() {
    updateAchievements(list);
    setEditing(null);
    toast("Prestasi berhasil disimpan!");
  }

  function handleDelete(idx) {
    const next = list.filter((_, i) => i !== idx);
    setList(next);
    updateAchievements(next);
    setConfirm(null);
    toast("Prestasi dihapus.");
  }

  return (
    <div className="crud-list">
      {list.map((item, idx) => (
        <div key={item.id ?? idx} className={`crud-item ${editing === idx ? "crud-item--open" : ""}`}>
          {/* ── Header baris ── */}
          <div className="crud-item-header" onClick={() => setEditing(editing === idx ? null : idx)}>
            <span className="crud-item-title">
              {item.title || `Prestasi ${idx + 1}`}
              {item.category && <span className="crud-item-badge">{item.category}</span>}
              {item.uploader && <span className="crud-item-badge">Oleh: {item.uploader}</span>}
            </span>
            <div className="crud-item-actions">
              <button className="crud-btn-del" onClick={(e) => { e.stopPropagation(); setConfirm(idx); }}>
                <Trash2 size={14} />
              </button>
              <ChevronRight size={15} className={`crud-chevron ${editing === idx ? "crud-chevron--open" : ""}`} />
            </div>
          </div>

          {/* ── Form edit (expandable) ── */}
          {editing === idx && (
            <div className="crud-item-body">
              <div className="form-group">
                <label>Judul Prestasi</label>
                <input type="text" value={item.title ?? ""} onChange={(e) => handleField(idx, "title", e.target.value)} placeholder="Misal: Juara 1 LKS Nasional" />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Kategori</label>
                  <input type="text" value={item.category ?? ""} onChange={(e) => handleField(idx, "category", e.target.value)} placeholder="Akademik / Kompetisi / dll" />
                </div>
                <div className="form-group">
                  <label>Tahun</label>
                  <input type="text" value={item.year ?? ""} onChange={(e) => handleField(idx, "year", e.target.value)} placeholder="2026" />
                </div>
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea rows={3} value={item.description ?? ""} onChange={(e) => handleField(idx, "description", e.target.value)} placeholder="Deskripsi singkat tentang prestasi ini..." />
              </div>

              {/* ── Upload Gambar ── */}
              <div className="form-group">
                <label>Foto Bukti Prestasi</label>
                <div className="achievement-img-uploader">
                  {item.image ? (
                    <div className="achievement-img-preview">
                      <img src={item.image} alt="Preview" />
                      <div className="achievement-img-overlay">
                        <label className="achievement-img-change-btn" htmlFor={`img-upload-${idx}`}>
                          <Pencil size={13} /> Ganti Foto
                        </label>
                        <button
                          type="button"
                          className="achievement-img-remove-btn"
                          onClick={() => handleField(idx, "image", "")}
                        >
                          <X size={13} /> Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="achievement-img-dropzone" htmlFor={`img-upload-${idx}`}>
                      <span className="dropzone-icon">🖼️</span>
                      <span className="dropzone-text">Klik untuk upload foto</span>
                      <span className="dropzone-hint">PNG, JPG, WEBP · Maks. 2 MB</span>
                    </label>
                  )}
                  <input
                    id={`img-upload-${idx}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(idx, e.target.files?.[0])}
                  />
                </div>
              </div>

              <button className="btn-save" onClick={handleSave}><Save size={14} /> Simpan Prestasi</button>
            </div>
          )}
        </div>
      ))}

      <button className="btn-add" onClick={handleAdd}><Plus size={15} /> Tambah Prestasi Baru</button>

      {/* Modal konfirmasi hapus */}
      {confirm !== null && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus prestasi ini?</h3>
            <p>Tindakan ini tidak bisa dibatalkan.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-danger" onClick={() => handleDelete(confirm)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Tab: Berita ──────────────────────────────────────────────────────────────
function TabBerita({ toast, role, autoAddKey = 0 }) {
  const { news, updateNews } = useData();
  const isMajor = role?.type === "major";
  const isAdmin = !isMajor;

  // Jurusan hanya melihat berita miliknya sendiri di dashboard.
  // Admin tetap melihat seluruh berita.
  const visibleNews = isMajor
    ? news.filter((item) => item.uploaderType === "major" && item.uploader === role.name)
    : news;

  const [list, setList] = useState(visibleNews);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  React.useEffect(() => {
    setList(isMajor
      ? news.filter((item) => item.uploaderType === "major" && item.uploader === role.name)
      : news
    );
    setEditing(null);
    setConfirm(null);
  }, [news, isMajor, role?.name]);

  React.useEffect(() => {
    if (autoAddKey > 0) handleAdd();
  }, [autoAddKey]);

  function canManageNews(item) {
    if (isAdmin) return true;
    return item?.uploaderType === "major" && item?.uploader === role.name;
  }

  function handleField(idx, key, val) {
    const item = list[idx];
    if (!canManageNews(item)) {
      toast("Anda hanya dapat mengelola berita milik jurusan sendiri.");
      return;
    }
    setList((prev) => prev.map((newsItem, i) => i === idx ? { ...newsItem, [key]: val } : newsItem));
  }

  function handleImageUpload(idx, file) {
    if (!file) return;
    if (!canManageNews(list[idx])) {
      toast("Anda hanya dapat mengelola berita milik jurusan sendiri.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { toast("Ukuran foto maksimal 2 MB!"); return; }
    const reader = new FileReader();
    reader.onload = (e) => handleField(idx, "image", e.target.result);
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    const empty = {
      id: Date.now(),
      title: "",
      date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
      category: "",
      excerpt: "",
      content: "",
      image: "",
      videoLink: "",
      uploader: isMajor ? role.name : "Sekolah",
      uploaderType: isMajor ? "major" : "school",
      createdAt: Date.now(),
    };

    // Berita baru selalu berada paling atas.
    setList((prev) => {
      setEditing(0);
      return [empty, ...prev];
    });
  }

  function handleSave() {
    if (isAdmin) {
      // Admin memiliki akses penuh terhadap seluruh berita.
      updateNews(list);
    } else {
      // Jurusan hanya boleh mengubah berita miliknya sendiri.
      // Berita jurusan lain tetap utuh dan tidak ikut tertimpa.
      const ownNews = list.filter((item) => canManageNews(item));
      const ownIds = new Set(ownNews.map((item) => item.id));
      const next = news.map((item) => {
        if (!ownIds.has(item.id)) return item;
        return ownNews.find((edited) => edited.id === item.id) ?? item;
      });

      // Berita baru dari jurusan belum ada di data global, jadi tambahkan.
      const globalIds = new Set(news.map((item) => item.id));
      const newlyAdded = ownNews
        .filter((item) => !globalIds.has(item.id))
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      // Data baru diletakkan paling atas, sedangkan berita lama tetap mengikuti urutan waktunya.
      updateNews([...newlyAdded, ...next]);
    }

    setEditing(null);
    toast("Berita berhasil disimpan!");
  }

  function handleDelete(idx) {
    const target = list[idx];
    if (!canManageNews(target)) {
      setConfirm(null);
      toast("Anda tidak memiliki akses untuk menghapus berita ini.");
      return;
    }

    const nextGlobal = news.filter((item) => item.id !== target.id);
    const nextVisible = list.filter((_, i) => i !== idx);

    setList(nextVisible);
    updateNews(nextGlobal);
    setConfirm(null);
    setEditing(null);
    toast("Berita dihapus.");
  }

  function toggleEditing(idx) {
    const item = list[idx];
    if (!canManageNews(item)) {
      toast("Berita ini bukan milik jurusan Anda.");
      return;
    }
    setEditing(editing === idx ? null : idx);
  }

  return (
    <div className="crud-list">
      {isMajor && (
        <div className="major-news-banner">
          <ShieldCheck size={18} />
          <div>
            <strong>Mode Jurusan: {role.name}</strong>
            <span>Anda hanya dapat melihat, menambah, mengedit, dan menghapus berita milik {role.name}. Berita jurusan lain tidak dapat Anda kelola.</span>
          </div>
        </div>
      )}

      {list.map((item, idx) => (
        <div key={item.id ?? idx} className={`crud-item ${editing === idx ? "crud-item--open" : ""}`}>
          <div className="crud-item-header" onClick={() => toggleEditing(idx)}>
            <span className="crud-item-title">
              {item.title || `Berita ${idx + 1}`}
              {item.category && <span className="crud-item-badge">{item.category}</span>}
              {item.uploader && <span className="crud-item-badge">Oleh: {item.uploader}</span>}
            </span>
            <div className="crud-item-actions">
              <button
                className="crud-btn-del"
                onClick={(e) => {
                  e.stopPropagation();
                  if (canManageNews(item)) setConfirm(idx);
                  else toast("Anda tidak memiliki akses untuk menghapus berita ini.");
                }}
                title={isAdmin ? "Hapus berita" : `Hapus berita ${role.name}`}
              >
                <Trash2 size={14} />
              </button>
              <ChevronRight size={15} className={`crud-chevron ${editing === idx ? "crud-chevron--open" : ""}`} />
            </div>
          </div>

          {editing === idx && (
            <div className="crud-item-body">

              {/* ── Foto Berita ── */}
              <div className="form-group">
                <label>Foto Berita</label>
                <div className="photo-uploader">
                  {item.image && !item.image.includes("placeholder") ? (
                    <div className="photo-preview photo-preview--wide">
                      <img src={item.image} alt="Preview berita" />
                      <div className="photo-preview-overlay">
                        <label className="photo-change-btn" htmlFor={`berita-img-${idx}`}>
                          <Camera size={13} /> Ganti Foto
                        </label>
                        <button type="button" className="photo-remove-btn" onClick={() => handleField(idx, "image", "")}>
                          <X size={13} /> Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="photo-dropzone photo-dropzone--wide" htmlFor={`berita-img-${idx}`}>
                      <span className="photo-dropzone-icon"><ImagePlus size={28} /></span>
                      <span className="photo-dropzone-text">Klik untuk upload foto berita</span>
                      <span className="photo-dropzone-hint">PNG, JPG, WEBP · Maks. 2 MB</span>
                    </label>
                  )}
                  <input id={`berita-img-${idx}`} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(idx, e.target.files?.[0])}
                    onClick={(e) => { e.target.value = ""; }} />
                </div>
              </div>

              <div className="form-group">
                <label>Uploader</label>
                <input type="text" value={item.uploader ?? (isMajor ? role.name : "Sekolah")} disabled={true} />
              </div>

              <div className="form-group">
                <label>Link Video <span className="form-label-optional">(Optional)</span></label>
                <input
                  type="url"
                  value={item.videoLink ?? ""}
                  onChange={(e) => handleField(idx, "videoLink", e.target.value)}
                  placeholder="https://www.instagram.com/reel/... atau https://youtu.be/..."
                />
                <small className="form-hint">Tambahkan link video dari Instagram, TikTok, YouTube, atau Facebook. Thumbnail video akan dicoba diambil otomatis; jika tidak tersedia, foto berita akan digunakan sebagai cover. Thumbnail dapat diklik untuk membuka video.</small>
              </div>

              <div className="form-group">
                <label>Judul Berita</label>
                <input type="text" value={item.title ?? ""} onChange={(e) => handleField(idx, "title", e.target.value)} placeholder="Judul berita..." />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input type="text" value={item.date ?? ""} onChange={(e) => handleField(idx, "date", e.target.value)} placeholder="01 September 2026" />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <input type="text" value={item.category ?? ""} onChange={(e) => handleField(idx, "category", e.target.value)} placeholder="Kegiatan / Pengumuman / dll" />
                </div>
              </div>
              <div className="form-group">
                <label>Ringkasan</label>
                <textarea rows={2} value={item.excerpt ?? ""} onChange={(e) => handleField(idx, "excerpt", e.target.value)} placeholder="Ringkasan singkat berita..." />
              </div>
              <div className="form-group">
                <label>Isi Lengkap</label>
                <textarea rows={5} value={item.content ?? ""} onChange={(e) => handleField(idx, "content", e.target.value)} placeholder="Isi lengkap berita..." />
              </div>
              <button className="btn-save" onClick={handleSave}><Save size={14} /> Simpan Berita</button>
            </div>
          )}
        </div>
      ))}

      {isMajor && list.length === 0 && (
        <div className="empty-state">
          <Newspaper size={28} />
          <p>Belum ada berita dari {role.name}.</p>
          <span>Tambahkan berita pertama jurusan Anda.</span>
        </div>
      )}

      <button className="btn-add" onClick={handleAdd}><Plus size={15} /> Tambah Berita Baru</button>

      {confirm !== null && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus berita ini?</h3>
            <p>Tindakan ini tidak bisa dibatalkan.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-danger" onClick={() => handleDelete(confirm)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Fasilitas ───────────────────────────────────────────────────────────
function TabFasilitas({ toast, autoAddKey = 0 }) {
  const { facilities, updateFacilities } = useData();
  const [list, setList] = useState(facilities);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  React.useEffect(() => { setList(facilities); }, [facilities]);

  React.useEffect(() => {
    if (autoAddKey > 0) handleAdd();
  }, [autoAddKey]);

  function handleField(idx, key, val) {
    setList((prev) => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  }

  function handleImageUpload(idx, file) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast("Ukuran foto maksimal 3 MB!"); return; }
    const reader = new FileReader();
    reader.onload = (e) => handleField(idx, "image", e.target.result);
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    const empty = { id: Date.now(), name: "", description: "", image: "" };
    setList((prev) => { setEditing(prev.length); return [...prev, empty]; });
  }

  function handleSave() { updateFacilities(list); setEditing(null); toast("Fasilitas berhasil disimpan!"); }

  function handleDelete(idx) {
    const next = list.filter((_, i) => i !== idx);
    setList(next); updateFacilities(next); setConfirm(null); toast("Fasilitas dihapus.");
  }

  return (
    <div className="crud-list">
      {list.map((item, idx) => (
        <div key={item.id ?? idx} className={`crud-item ${editing === idx ? "crud-item--open" : ""}`}>
          <div className="crud-item-header" onClick={() => setEditing(editing === idx ? null : idx)}>
            <span className="crud-item-title">
              {item.name || `Fasilitas ${idx + 1}`}
            </span>
            <div className="crud-item-actions">
              <button className="crud-btn-del" onClick={(e) => { e.stopPropagation(); setConfirm(idx); }}><Trash2 size={14} /></button>
              <ChevronRight size={15} className={`crud-chevron ${editing === idx ? "crud-chevron--open" : ""}`} />
            </div>
          </div>

          {editing === idx && (
            <div className="crud-item-body">

              {/* ── Foto Fasilitas ── */}
              <div className="form-group">
                <label>Foto Fasilitas</label>
                <div className="photo-uploader">
                  {item.image && !item.image.includes("placeholder") ? (
                    <div className="photo-preview photo-preview--wide">
                      <img src={item.image} alt="Preview fasilitas" />
                      <div className="photo-preview-overlay">
                        <label className="photo-change-btn" htmlFor={`fasilitas-img-${idx}`}>
                          <Camera size={13} /> Ganti Foto
                        </label>
                        <button type="button" className="photo-remove-btn" onClick={() => handleField(idx, "image", "")}>
                          <X size={13} /> Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="photo-dropzone photo-dropzone--wide" htmlFor={`fasilitas-img-${idx}`}>
                      <span className="photo-dropzone-icon"><ImagePlus size={28} /></span>
                      <span className="photo-dropzone-text">Klik untuk upload foto fasilitas</span>
                      <span className="photo-dropzone-hint">PNG, JPG, WEBP · Maks. 3 MB</span>
                    </label>
                  )}
                  <input id={`fasilitas-img-${idx}`} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(idx, e.target.files?.[0])}
                    onClick={(e) => { e.target.value = ""; }} />
                </div>
              </div>

              <div className="form-group">
                <label>Nama Fasilitas</label>
                <input type="text" value={item.name ?? ""} onChange={(e) => handleField(idx, "name", e.target.value)} placeholder="Misal: Laboratorium Komputer" />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea rows={3} value={item.description ?? ""} onChange={(e) => handleField(idx, "description", e.target.value)} placeholder="Deskripsi fasilitas..." />
              </div>
              <button className="btn-save" onClick={handleSave}><Save size={14} /> Simpan Fasilitas</button>
            </div>
          )}
        </div>
      ))}

      <button className="btn-add" onClick={handleAdd}><Plus size={15} /> Tambah Fasilitas Baru</button>

      {confirm !== null && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus fasilitas ini?</h3>
            <p>Tindakan ini tidak bisa dibatalkan.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-danger" onClick={() => handleDelete(confirm)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Pengaturan ──────────────────────────────────────────────────────────
function TabPengaturan({ toast, onLogout }) {
  const { pins, updatePins } = useData();
  const [list, setList] = useState(pins || []);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  React.useEffect(() => { setList(pins || []); }, [pins]);

  function handleField(idx, key, val) {
    setList((prev) => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  }

  function handleAdd() {
    const empty = { id: "", role: "major", name: "", pin: "" };
    setList((prev) => { setEditing(prev.length); return [...prev, empty]; });
  }

  async function handleSave() {
    const currentEdit = list[editing];
    if (!currentEdit.name) return toast("Nama pengguna/jurusan harus diisi!");
    if (!/^\d{4}$/.test(currentEdit.pin)) return toast("PIN harus 4 digit angka!");
    if (!currentEdit.role) return toast("Role harus dipilih!");

    const res = await updatePins(list);
    if (res?.success) {
      setEditing(null);
      toast("Daftar PIN berhasil disimpan!");
    } else {
      toast(res?.error || "Gagal menyimpan PIN.");
    }
  }

  async function handleDelete(idx) {
    const target = list[idx];
    if (target.role === 'super_admin') {
      toast("Anda tidak bisa menghapus PIN Super Admin!");
      setConfirm(null);
      return;
    }
    const next = list.filter((_, i) => i !== idx);
    const res = await updatePins(next);
    if (res?.success) {
      toast("PIN berhasil dihapus.");
    } else {
      toast("Gagal menghapus PIN.");
    }
    setConfirm(null);
  }

  const roleOptions = [
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin TU" },
    { value: "admin_bk", label: "Guru BK" },
    { value: "major", label: "Admin Jurusan" }
  ];

  return (
    <div className="crud-list">
      <div className="major-news-banner" style={{ background: "rgba(220, 38, 38, 0.1)", borderColor: "rgba(220, 38, 38, 0.2)", color: "#991b1b" }}>
        <ShieldCheck size={18} />
        <div>
          <strong>Akses Khusus Super Admin</strong>
          <span>Anda berada di area manajemen PIN. Harap jaga kerahasiaan daftar ini.</span>
        </div>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-danger-outline" onClick={onLogout}><LogOut size={14} /> Keluar dari Dashboard</button>
      </div>

      <h3 className="form-section-title" style={{ marginBottom: "16px" }}>Kelola Akses Login (PIN)</h3>

      {list.map((item, idx) => (
        <div key={item.id || `new-${idx}`} className={`crud-item ${editing === idx ? "crud-item--open" : ""}`}>
          <div className="crud-item-header" onClick={() => setEditing(editing === idx ? null : idx)}>
            <span className="crud-item-title">
              {item.name || `Pengguna Baru ${idx + 1}`}
              {item.role && <span className="crud-item-badge">{roleOptions.find(r => r.value === item.role)?.label || item.role}</span>}
              {item.pin && <span className="crud-item-badge" style={{ background: '#fef3c7', color: '#b45309' }}>PIN: {item.pin}</span>}
            </span>
            <div className="crud-item-actions">
              <button className="crud-btn-del" onClick={(e) => { e.stopPropagation(); setConfirm(idx); }}><Trash2 size={14} /></button>
              <ChevronRight size={15} className={`crud-chevron ${editing === idx ? "crud-chevron--open" : ""}`} />
            </div>
          </div>

          {editing === idx && (
            <div className="crud-item-body">
              <div className="form-group">
                <label>Nama Pengguna / Jurusan</label>
                <input type="text" value={item.name ?? ""} onChange={(e) => handleField(idx, "name", e.target.value)} placeholder="Misal: Tata Usaha, Guru BK, RPL" />
              </div>
              <div className="form-group">
                <label>Role Akses</label>
                <select value={item.role} onChange={(e) => handleField(idx, "role", e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <small className="form-hint">
                  Super Admin (Akses semua), Admin TU (Semua kecuali BK/Pengaturan), Guru BK (Hanya BK), Admin Jurusan (Hanya tambah berita jurusan).
                </small>
              </div>
              <div className="form-group">
                <label>PIN (4 Digit Angka)</label>
                <input type="text" inputMode="numeric" maxLength={4} value={item.pin ?? ""} onChange={(e) => handleField(idx, "pin", e.target.value.replace(/\D/g, ""))} placeholder="Misal: 1234" />
              </div>
              <button className="btn-save" onClick={handleSave}><Save size={14} /> Simpan Data Akses</button>
            </div>
          )}
        </div>
      ))}

      <button className="btn-add" onClick={handleAdd}><Plus size={15} /> Tambah PIN Akses Baru</button>

      {confirm !== null && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus akses ini?</h3>
            <p>Pengguna dengan PIN ini tidak akan bisa login lagi.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-danger" onClick={() => handleDelete(confirm)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Chat Siswa ────────────────────────────────────────────────────────────
function TabChat({ toast }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
        if (selectedSession) {
          const updated = data.sessions.find(s => s.id === selectedSession.id);
          if (updated) setSelectedSession(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 3000);
    return () => clearInterval(interval);
  }, [selectedSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedSession?.messages]);

  async function handleAction(action) {
    if (!selectedSession) return;
    try {
      const res = await fetch(`/api/chat/session/${selectedSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        toast(action === "ACCEPT" ? "Chat diterima" : "Sesi chat diakhiri/ditolak");
        if (action === "REJECT" || action === "END") {
          setSelectedSession(null);
        }
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !selectedSession) return;
    const value = text.trim();
    setText("");

    try {
      await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedSession.userId, text: value, sender: "ADMIN" })
      });
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 120px)" }}>
      {/* Sidebar List Chat */}
      <div style={{ width: "300px", borderRight: "1px solid #e2e8f0", paddingRight: "10px", display: "flex", flexDirection: "column" }}>
        <h3 style={{ marginBottom: "15px", fontSize: "16px", fontWeight: "600" }}>Pesan Masuk</h3>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {sessions.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "13px" }}>Belum ada pesan custom.</p>
          ) : (
            sessions.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedSession(s)}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #f1f5f9",
                  cursor: "pointer",
                  background: selectedSession?.id === s.id ? "#f8fafc" : "transparent",
                  borderLeft: selectedSession?.id === s.id ? "3px solid #3b82f6" : "3px solid transparent"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "13px" }}>ID: {s.userId.substring(0, 8)}...</strong>
                  <span style={{ fontSize: "11px", color: s.status === 'PENDING' ? '#eab308' : '#22c55e' }}>
                    {s.status}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.messages?.[s.messages.length - 1]?.text || "Tidak ada pesan"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        {selectedSession ? (
          <>
            <div style={{ padding: "15px 20px", background: "white", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block" }}>Chat dari User: {selectedSession.userId.substring(0, 10)}</strong>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Status: {selectedSession.status}</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {selectedSession.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleAction('ACCEPT')} style={{ padding: "6px 12px", background: "#22c55e", color: "white", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>Terima (ACC)</button>
                    <button onClick={() => handleAction('REJECT')} style={{ padding: "6px 12px", background: "#ef4444", color: "white", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>Tolak</button>
                  </>
                )}
                {selectedSession.status === 'ACTIVE' && (
                  <button onClick={() => handleAction('END')} style={{ padding: "6px 12px", background: "#ef4444", color: "white", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>Akhiri Chat</button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedSession.messages?.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'ADMIN' ? 'flex-end' : 'flex-start', maxWidth: "70%" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px", textAlign: msg.sender === 'ADMIN' ? 'right' : 'left' }}>
                    {msg.sender === 'USER' ? 'Pengunjung' : msg.sender === 'BOT' ? 'Sistem Bot' : 'Admin'}
                  </div>
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: msg.sender === 'ADMIN' ? '#3b82f6' : (msg.sender === 'BOT' ? '#f1f5f9' : 'white'),
                    color: msg.sender === 'ADMIN' ? 'white' : '#334155',
                    border: msg.sender === 'USER' ? '1px solid #e2e8f0' : 'none',
                    lineHeight: "1.5"
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: "15px", background: "white", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={selectedSession.status === 'PENDING'}
                placeholder={selectedSession.status === 'PENDING' ? "Terima (ACC) chat terlebih dahulu untuk membalas..." : "Ketik pesan balasan..."}
                style={{ flex: 1, padding: "10px 15px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
              />
              <button
                type="submit"
                disabled={selectedSession.status === 'PENDING' || !text.trim()}
                style={{ padding: "0 20px", background: selectedSession.status === 'PENDING' ? '#94a3b8' : '#3b82f6', color: "white", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
            Pilih sesi chat di sebelah kiri untuk melihat pesan
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard utama ──────────────────────────────────────────────────────────
import RealTimeClock from '@/components/RealTimeClock';

// ─── Tab: Konseling BK ────────────────────────────────────────────────────────

function TabBK({ toast }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTickets();
    const tInterval = setInterval(fetchTickets, 5000);
    return () => clearInterval(tInterval);
  }, []);

  useEffect(() => {
    if (selectedTicketId) {
      fetchMessages();
      const mInterval = setInterval(fetchMessages, 3000);
      return () => clearInterval(mInterval);
    }
  }, [selectedTicketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchTickets() {
    try {
      // we assume DataContext handles auth, we inject headers manually if needed
      // Actually we just rely on cookies/headers. Nextjs fetch to relative path uses cookie
      // Wait, we can pass role in header since we are mocking auth
      const role = localStorage.getItem("smk_dashboard_role");
      let roleType = "admin_bk";
      if (role) roleType = JSON.parse(role).type;

      const res = await fetch('/api/bk/tickets', {
        headers: { 'x-admin-role': roleType }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMessages() {
    if (!selectedTicketId) return;
    try {
      const res = await fetch(`/api/bk/chat?ticketId=${selectedTicketId}`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !selectedTicketId) return;

    const role = localStorage.getItem("smk_dashboard_role");
    let roleType = "admin_bk";
    if (role) roleType = JSON.parse(role).type;

    try {
      await fetch('/api/bk/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': roleType
        },
        body: JSON.stringify({ ticketId: selectedTicketId, text })
      });
      setText("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAction(actionType) {
    if (!selectedTicketId) return;
    const role = localStorage.getItem("smk_dashboard_role");
    let roleType = "admin_bk";
    if (role) roleType = JSON.parse(role).type;

    try {
      await fetch('/api/bk/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': roleType
        },
        body: JSON.stringify({ ticketId: selectedTicketId, text: "", actionType, isAction: true })
      });
      if (actionType === 'DELETE_TICKET') {
        setSelectedTicketId(null);
        setMessages([]);
        toast("Konsultasi dihapus / ditolak");
      } else {
        fetchMessages();
        if (actionType === 'ACCEPT_TICKET') toast("Konsultasi diterima");
        if (actionType === 'AGREE_UNMASK') toast("Permintaan dikirim ke siswa");
      }
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  }

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div style={{ display: 'flex', height: '70vh', background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {/* Kiri: Daftar Tiket */}
      <div style={{ width: '350px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Daftar Tiket Konseling</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {tickets.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Belum ada tiket</div>
          ) : (
            tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTicketId(t.id)}
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #f1f5f9', 
                  cursor: 'pointer',
                  background: selectedTicketId === t.id ? '#eff6ff' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t.pseudoId}
                    {t.userType === 'orang_tua' ? (
                      <span style={{ fontSize: '0.65rem', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Orang Tua</span>
                    ) : (
                      <span style={{ fontSize: '0.65rem', background: '#2563eb', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Siswa</span>
                    )}
                  </strong>
                  <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: t.status === 'PENDING' ? '#fef3c7' : (t.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9') }}>
                    {t.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.complaint}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Kanan: Ruang Obrolan */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        {selectedTicket ? (
          <>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedTicket.pseudoId}
                  {selectedTicket.userType === 'orang_tua' ? (
                    <span style={{ fontSize: '0.7rem', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Orang Tua</span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Siswa</span>
                  )}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Kategori: {
                  (() => {
                    try { return JSON.parse(selectedTicket.categories).join(', '); }
                    catch(e) { return selectedTicket.categories; }
                  })()
                }</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedTicket.status === 'PENDING' && (
                  <button onClick={() => handleAction('ACCEPT_TICKET')} style={{ background: '#22c55e', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold' }}>
                    Terima Konsultasi
                  </button>
                )}
                <button onClick={() => handleAction('DELETE_TICKET')} style={{ background: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold' }}>
                  Hapus / Deny
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontSize: '0.875rem' }}>Keluhan Awal:</strong>
                <p style={{ color: '#475569', margin: 0 }}>{selectedTicket.complaint}</p>
              </div>

              {messages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.sender === 'ADMIN_BK' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  {msg.sender === 'SYSTEM' ? (
                    <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.8rem', textAlign: 'center' }}>
                      {msg.text}
                    </div>
                  ) : msg.isAction && msg.sender === 'ADMIN_BK' ? (
                    <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.875rem', color: '#92400e' }}>
                      <em>Anda mengirimkan permintaan sesi offline / buka identitas kepada siswa.</em>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: '12px',
                      background: msg.sender === 'ADMIN_BK' ? '#2563eb' : 'white',
                      color: msg.sender === 'ADMIN_BK' ? 'white' : '#1e293b',
                      border: msg.sender === 'ADMIN_BK' ? 'none' : '1px solid #e2e8f0'
                    }}>
                      {msg.text.split("\n").map((line, j, arr) => (
                        <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: '1rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={selectedTicket.status === 'PENDING' || selectedTicket.status === 'CLOSED'}
                placeholder={selectedTicket.status === 'PENDING' ? "Terima konsultasi terlebih dahulu..." : "Ketik pesan..."}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={selectedTicket.status === 'PENDING' || selectedTicket.status === 'CLOSED' || !text.trim()}
                style={{ background: selectedTicket.status === 'PENDING' ? '#94a3b8' : '#2563eb', color: 'white', padding: '0 1.5rem', borderRadius: '6px', fontWeight: 'bold' }}
              >
                Kirim
              </button>
            </form>
          </>
        ) : (
          <div style={{ margin: 'auto', color: '#94a3b8' }}>Pilih tiket untuk melihat detail</div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { getSession, getRole, setSession, clearSession } = useData();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [toastMsg, setToastMsg] = useState(null);
  const [role, setRole] = useState({ type: "admin", name: "Admin" });
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addAction, setAddAction] = useState({ type: "", key: 0 });

  useEffect(() => {
    setLoggedIn(getSession());
    setRole(getRole() || { type: "admin", name: "Admin" });
  }, []);

  function handleLoginSuccess(nextRole) { 
    setSession(true, nextRole); 
    setRole(nextRole); 
    setLoggedIn(true); 
    
    // Set default tab based on role
    if (nextRole?.type === "admin_bk") setActiveTab("bk");
    else if (nextRole?.type === "super_user") setActiveTab("jurusan");
    else if (nextRole?.type === "major") setActiveTab("berita");
    else setActiveTab("overview");
  }

  function handleLogout() { clearSession(); setLoggedIn(false); setRole(null); setActiveTab("overview"); }

  function showToast(msg) {
    setToastMsg(msg);
  }

  function handleQuickAdd(type) {
    setShowAddMenu(false);

    // Akun jurusan hanya memiliki akses untuk menambah berita.
    if (role?.type === "major" && type !== "berita") {
      setActiveTab("berita");
      showToast("Akun jurusan hanya dapat menambah berita.");
      return;
    }

    setAddAction((prev) => ({ type, key: prev.key + 1 }));
    setActiveTab(type);
  }

  if (!loggedIn) return <PinLogin onSuccess={handleLoginSuccess} />;

  // role.type: super_admin, admin, admin_bk, super_user/major
  let allowedTabs = [];
  if (role?.type === "super_admin") {
    allowedTabs = NAV_ITEMS.map(i => i.id);
  } else if (role?.type === "admin_bk") {
    allowedTabs = ["bk"];
  } else if (role?.type === "super_user") {
    allowedTabs = ["jurusan"];
  } else if (role?.type === "major") {
    // PIN per jurusan hanya bisa mengakses menu berita untuk posting berita jurusan
    allowedTabs = ["berita"];
  } else {
    // admin biasa
    allowedTabs = ["overview", "data-sekolah", "profil", "jurusan", "prestasi", "berita", "fasilitas", "chat"];
  }

  const visibleNav = NAV_ITEMS.filter(item => allowedTabs.includes(item.id));

  const TABS = {
    overview: <TabOverview setTab={setActiveTab} />,
    "data-sekolah": <TabDataSekolah toast={showToast} />,
    profil: <TabProfil toast={showToast} />,
    jurusan: <TabJurusan toast={showToast} autoAddKey={addAction.type === "jurusan" ? addAction.key : 0} />,
    prestasi: <TabPrestasi toast={showToast} autoAddKey={addAction.type === "prestasi" ? addAction.key : 0} />,
    berita: <TabBerita toast={showToast} role={role} autoAddKey={addAction.type === "berita" ? addAction.key : 0} />,
    fasilitas: <TabFasilitas toast={showToast} autoAddKey={addAction.type === "fasilitas" ? addAction.key : 0} />,
    chat: <TabChat toast={showToast} />,
    bk: <TabBK toast={showToast} />,
    pengaturan: <TabPengaturan toast={showToast} onLogout={handleLogout} />,
  };

  const currentNavItem = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="admin-layout">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo-smk.png" alt="Logo" />
          <div style={{ flex: 1 }}>
            <strong>SMK N 1 Beringin</strong>
            <span>{role?.type === "major" ? `Panel ${role.name}` : "Admin Panel"}</span>
          </div>
        </div>
        <div style={{ padding: "0 18px 15px 18px", borderBottom: "1px solid rgba(255, 255, 255, 0.07)", marginBottom: "10px" }}>
          <RealTimeClock className="sidebar-clock" />
        </div>

        <nav className="admin-nav">
          <span className="admin-nav-label">MENU</span>
          {visibleNav.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-link ${activeTab === item.id ? "admin-nav-link--active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-link" target="_blank">
            <Eye size={15} /> Lihat Website
          </Link>
          <button className="admin-nav-link admin-nav-link--logout" onClick={handleLogout}>
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </aside>

      {/* ── Konten utama ── */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-page-title">{currentNavItem?.label || "Dashboard"}</h1>
            <p className="admin-page-sub">
              {role?.type === "admin_bk" ? "Dashboard Bimbingan Konseling" :
               role?.type === "super_user" ? `Akses Jurusan · ${role.name}` :
               role?.type === "major" ? `Akses Berita Jurusan · ${role.name}` :
               "Dashboard Admin · SMK Negeri 1 Beringin"}
            </p>
          </div>
        </header>

        <div className="admin-content">
          {TABS[activeTab]}
        </div>
      </main>

      {/* Tombol tambah informasi mengambang */}
      <QuickAddButton
        role={role}
        open={showAddMenu}
        onToggle={() => setShowAddMenu((prev) => !prev)}
        onAdd={handleQuickAdd}
      />

      {/* Toast notifikasi */}
      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  );
}
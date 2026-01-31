

# Plan: Implementasi Sistem Login Mahasiswa dengan NIM & Password

## Ringkasan Perubahan

Mengubah mekanisme login mahasiswa dari sistem validasi nama + tahun lulus menjadi login dengan NIM (username) dan password. Admin dapat menambah dan menghapus akun mahasiswa.

---

## Bagian 1: Perubahan untuk Pengguna

### Apa yang Berubah untuk Mahasiswa?
- **Sebelumnya**: Masuk dengan nama + tahun lulus, lalu pilih profil dari daftar
- **Sesudah**: Login langsung dengan NIM dan password, otomatis masuk ke dashboard

### Apa yang Berubah untuk Admin?
- Tabel mahasiswa menampilkan kolom NIM
- Tombol baru untuk "Tambah Mahasiswa" dan "Hapus Mahasiswa"
- Form untuk membuat akun mahasiswa baru dengan NIM sebagai username

---

## Bagian 2: Detail Teknis

### 2.1 Update Tipe Data (StudentProfile)

**File**: `src/types/student.types.ts`

Menambahkan field baru:
```text
+-------------------+----------+----------------------------+
| Field             | Tipe     | Keterangan                 |
+-------------------+----------+----------------------------+
| passwordHash      | string?  | Hash password (opsional)   |
| hasCredentials    | boolean  | Sudah punya akun login?    |
| lastLogin         | Date?    | Waktu login terakhir       |
+-------------------+----------+----------------------------+
```

### 2.2 Halaman Login Baru (Mengganti ValidasiPage)

**File**: `src/pages/ValidasiPage.tsx`

Perubahan UI:
- Form dengan 2 field: NIM dan Password
- Tombol "Masuk"
- Pesan error jika login gagal
- Link ke halaman lupa password (placeholder)

Flow:
1. Mahasiswa memasukkan NIM dan password
2. Sistem mencari mahasiswa berdasarkan NIM
3. Validasi password
4. Jika berhasil, langsung redirect ke dashboard
5. Jika gagal, tampilkan pesan error

### 2.3 Komponen Admin Baru

**File Baru**: `src/components/admin/StudentAccountModal.tsx`

Form untuk tambah akun mahasiswa:
- NIM (auto-generated atau manual, harus unik)
- Nama Lengkap
- Password (wajib)
- Konfirmasi Password
- Email (opsional)
- No HP (opsional)
- Status Mahasiswa (Aktif/Alumni/Cuti/Dropout)
- Tahun Masuk
- Tahun Lulus (jika alumni)

**File Baru**: `src/components/admin/DeleteStudentDialog.tsx`

Konfirmasi hapus akun mahasiswa dengan info:
- Nama dan NIM mahasiswa
- Peringatan data terkait akan ikut terhapus

### 2.4 Update Admin Dashboard

**File**: `src/pages/AdminDashboard.tsx`

Perubahan:
1. Kolom NIM sudah ada, pastikan ditampilkan
2. Tambah tombol "Tambah Mahasiswa" di header
3. Tambah tombol "Hapus" di setiap baris tabel
4. Integrasi dengan StudentAccountModal dan DeleteStudentDialog

### 2.5 Update Context dan Service

**File**: `src/contexts/AlumniContext.tsx`

Tambah fungsi:
- `loginWithCredentials(nim: string, password: string)`
- `addStudentAccount(data: StudentAccountInput)`
- `deleteStudentAccount(studentId: string)`

**File Baru**: `src/services/auth.service.ts`

Fungsi autentikasi:
- `verifyPassword(input: string, hash: string)`
- `hashPassword(password: string)` - untuk demo menggunakan simple hash
- `authenticateStudent(nim: string, password: string)`

### 2.6 Update Seed Data

**File**: `src/data/student-seed-data.ts`

Tambah password untuk demo:
- Semua mahasiswa demo mendapat password default: "password123"

---

## Bagian 3: Struktur File

```text
src/
├── components/
│   └── admin/
│       ├── StudentAccountModal.tsx    [BARU]
│       ├── DeleteStudentDialog.tsx    [BARU]
│       └── index.ts                   [BARU]
├── services/
│   └── auth.service.ts                [BARU]
├── pages/
│   ├── ValidasiPage.tsx               [UPDATE - Ganti jadi Login Form]
│   └── AdminDashboard.tsx             [UPDATE - Tambah CRUD mahasiswa]
├── contexts/
│   └── AlumniContext.tsx              [UPDATE - Tambah auth functions]
├── types/
│   └── student.types.ts               [UPDATE - Tambah password fields]
└── data/
    └── student-seed-data.ts           [UPDATE - Tambah demo passwords]
```

---

## Bagian 4: Urutan Implementasi

1. **Update tipe data** - Tambah field password di StudentProfile
2. **Buat auth service** - Fungsi hash dan validasi password
3. **Update seed data** - Tambah password demo untuk testing
4. **Refactor ValidasiPage** - Ubah jadi login form NIM + password
5. **Buat komponen admin** - Modal tambah dan dialog hapus
6. **Update AdminDashboard** - Integrasi CRUD mahasiswa
7. **Update context** - Tambah fungsi login dan manajemen akun

---

## Bagian 5: Catatan Keamanan

> **PENTING**: Implementasi ini adalah untuk **demo/development** saja.

Untuk production dengan Supabase:
- Gunakan Supabase Auth untuk autentikasi
- Password di-hash dengan bcrypt di server
- Session disimpan dengan secure cookies
- Implementasi rate limiting untuk login

Batasan demo saat ini:
- Password disimpan sebagai simple hash di client
- Session disimpan di localStorage
- Tidak ada rate limiting


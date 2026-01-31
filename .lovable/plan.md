
# Plan: Akses Penuh Admin untuk Manajemen Mahasiswa

## Ringkasan Masalah

1. **Beberapa akun tidak bisa dihapus**: Data di tabel menggunakan `masterData` yang berbeda dengan `studentAccounts`. Tombol hapus hanya muncul jika NIM cocok antara kedua sumber data.

2. **Tidak ada fitur edit untuk admin**: Dialog detail alumni saat ini hanya menampilkan informasi tanpa opsi edit.

---

## Solusi yang Akan Diimplementasikan

### Bagian 1: Perbaikan Sistem Delete

**Pendekatan**: Mengubah tabel agar menggunakan `studentAccounts` sebagai sumber data utama, bukan `masterData`.

**Perubahan**:
- Tabel admin akan menampilkan data dari `studentAccounts`
- Setiap akun di `studentAccounts` pasti bisa dihapus
- Semua data terkait (karir, prestasi) akan ikut terhapus (cascade delete)

### Bagian 2: Fitur Edit Admin yang Komprehensif

**Komponen Baru**: `AdminStudentEditModal.tsx`

Modal dengan tab untuk mengedit:
1. **Tab Profil**: Edit informasi dasar mahasiswa (nama, NIM, email, status, dll)
2. **Tab Karir**: Daftar riwayat karir dengan opsi edit/hapus per entry
3. **Tab Prestasi**: Daftar prestasi dengan opsi edit/hapus per entry

---

## Detail Teknis

### 2.1 Update Admin Dashboard Table

**File**: `src/pages/AdminDashboard.tsx`

Perubahan:
- Ubah sumber data tabel dari `masterData` menjadi `studentAccounts`
- Tambah kolom "Aksi" dengan tombol Edit dan Hapus
- Semua baris akan memiliki tombol hapus (tidak ada lagi yang kosong)

### 2.2 Komponen Admin Edit Modal

**File Baru**: `src/components/admin/AdminStudentEditModal.tsx`

Struktur:
```text
+-------------------------------------------+
|  Edit Data Mahasiswa                      |
+-------------------------------------------+
| [Profil] [Karir] [Prestasi]               |
+-------------------------------------------+
| Tab Profil:                               |
| - Nama Lengkap                            |
| - NIM                                     |
| - Email                                   |
| - No HP                                   |
| - Status (Aktif/Alumni/Cuti/Dropout)      |
| - Tahun Masuk / Tahun Lulus               |
| - Reset Password                          |
+-------------------------------------------+
| Tab Karir:                                |
| - List riwayat karir                      |
| - Tombol Edit/Hapus per entry             |
| - Tombol Tambah Karir                     |
+-------------------------------------------+
| Tab Prestasi:                             |
| - List prestasi                           |
| - Tombol Edit/Hapus per entry             |
| - Tombol Tambah Prestasi                  |
+-------------------------------------------+
```

### 2.3 Update Context

**File**: `src/contexts/AlumniContext.tsx`

Tambah fungsi baru:
- `updateStudentAccount(studentId, updates)` - Update profil mahasiswa
- `resetStudentPassword(studentId, newPassword)` - Reset password

### 2.4 Sinkronisasi Data

**File**: `src/services/student.service.ts` (Baru)

Service untuk mengelola data student lintas module:
- `getStudentCareerHistory(studentId)` - Ambil riwayat karir
- `getStudentAchievements(studentId)` - Ambil prestasi
- `deleteStudentWithCascade(studentId)` - Hapus dengan cascade

### 2.5 Update Achievement Service

**File**: `src/services/achievement.service.ts`

Tambah fungsi:
- `getAchievementsByStudentId(studentId)` - Ambil prestasi berdasarkan student ID
- `deleteAchievementsByStudentId(studentId)` - Hapus semua prestasi student

---

## Struktur File

```text
src/
├── components/
│   └── admin/
│       ├── StudentAccountModal.tsx      [EXISTING - Untuk tambah akun]
│       ├── DeleteStudentDialog.tsx      [EXISTING]
│       ├── AdminStudentEditModal.tsx    [BARU - Modal edit komprehensif]
│       └── index.ts                     [UPDATE - Export baru]
├── services/
│   ├── student.service.ts               [BARU - Student management]
│   └── achievement.service.ts           [UPDATE - Tambah fungsi]
├── contexts/
│   └── AlumniContext.tsx                [UPDATE - Tambah fungsi edit]
└── pages/
    └── AdminDashboard.tsx               [UPDATE - Ubah data source & aksi]
```

---

## Urutan Implementasi

1. **Update Achievement Service** - Tambah fungsi untuk admin
2. **Buat Student Service** - Centralized student management  
3. **Update Context** - Tambah fungsi update dan reset password
4. **Buat AdminStudentEditModal** - Modal edit dengan 3 tab
5. **Update AdminDashboard** - Ubah data source dan integrasi modal edit
6. **Update index exports** - Export komponen baru

---

## Fitur Tambahan

### Cascade Delete
Ketika akun mahasiswa dihapus:
- Semua riwayat karir terkait dihapus
- Semua prestasi terkait dihapus
- Session login (jika aktif) di-logout

### Reset Password
Admin dapat reset password mahasiswa tanpa perlu tahu password lama.

### Validasi
- NIM harus tetap unik saat edit
- Tahun lulus tidak boleh sebelum tahun masuk
- Nama minimal 3 karakter

---

## Tampilan Akhir Admin Dashboard

Tabel dengan kolom:
| Nama | NIM | Status | Email | Aksi |
|------|-----|--------|-------|------|
| Ahmad Rizki | 20190001 | Alumni | ahmad@... | [Edit] [Hapus] |
| Siti Nurhaliza | 20190002 | Alumni | siti@... | [Edit] [Hapus] |
| ... | ... | ... | ... | ... |

Semua baris akan memiliki tombol edit dan hapus yang berfungsi.

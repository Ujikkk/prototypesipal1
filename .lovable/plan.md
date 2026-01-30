
# Rencana: Fitur Pengelolaan Data Admin (CRUD)

## Ringkasan Perubahan

Menambahkan kemampuan admin untuk mengelola data mahasiswa secara lengkap:
- Mengunggah/menambah akun mahasiswa baru
- Mengedit data mahasiswa (profil, karir, prestasi)
- Menghapus akun mahasiswa

---

## Perubahan Arsitektur

Saat ini, Admin Dashboard bersifat **read-only** (hanya monitoring). Perubahan ini akan mengubahnya menjadi **full CRUD admin panel** dengan tetap mempertahankan fitur monitoring yang ada.

```text
SEBELUM:                           SESUDAH:
+-------------------+              +-------------------+
| Admin Dashboard   |              | Admin Dashboard   |
|   (Read-Only)     |              |   (Full CRUD)     |
|                   |              |                   |
| - Lihat data      |              | - Lihat data      |
| - Filter          |              | - Filter          |
| - Export CSV      |              | - Export CSV      |
|                   |     ===>     | - Tambah Mahasiswa|
|                   |              | - Edit Mahasiswa  |
|                   |              | - Hapus Mahasiswa |
|                   |              | - Edit Karir      |
|                   |              | - Edit Prestasi   |
+-------------------+              +-------------------+
```

---

## Fitur yang Akan Ditambahkan

### 1. Tombol Tambah Mahasiswa Baru
- Tombol "Tambah Mahasiswa" di header Admin Dashboard
- Modal form untuk input data mahasiswa baru:
  - Nama lengkap (wajib)
  - NIM (wajib, unik)
  - Email
  - No. HP
  - Status (Aktif/Cuti/Dropout/Alumni)
  - Tahun Masuk (wajib)
  - Tahun Lulus (wajib jika status Alumni)
- Validasi input sebelum submit

### 2. Aksi Edit pada Setiap Baris Data
- Tombol Edit di tabel data mahasiswa
- Modal edit dengan 3 tab:
  - **Tab Profil**: Edit data dasar mahasiswa
  - **Tab Karir**: Edit data karir/tracer study (khusus Alumni)
  - **Tab Prestasi**: Lihat dan kelola prestasi mahasiswa

### 3. Aksi Hapus dengan Konfirmasi
- Tombol Hapus di tabel data mahasiswa
- Dialog konfirmasi sebelum hapus
- Pesan sukses setelah penghapusan

### 4. Upload Massal (Opsional untuk Iterasi Berikutnya)
- Import data mahasiswa dari file CSV/Excel

---

## File yang Akan Dimodifikasi/Dibuat

### File Baru:
1. `src/components/admin/StudentFormModal.tsx` - Modal form tambah/edit mahasiswa
2. `src/components/admin/CareerEditForm.tsx` - Form edit data karir
3. `src/components/admin/AchievementEditList.tsx` - Daftar prestasi dengan aksi edit
4. `src/components/admin/DeleteConfirmDialog.tsx` - Dialog konfirmasi hapus
5. `src/components/admin/index.ts` - Barrel export

### File yang Dimodifikasi:
1. `src/pages/AdminDashboard.tsx` - Tambah tombol dan integrasi modal
2. `src/contexts/AlumniContext.tsx` - Tambah fungsi CRUD untuk master data
3. `src/repositories/student.repository.ts` - Tambah fungsi delete student
4. `src/services/student.service.ts` - Tambah service layer untuk delete
5. `src/components/shared/DataTable.tsx` - Tambah kolom aksi (Edit/Hapus)

---

## Detail Komponen

### StudentFormModal.tsx
```text
+----------------------------------+
|     Tambah/Edit Mahasiswa        |
+----------------------------------+
| Nama Lengkap: [______________]   |
| NIM:          [______________]   |
| Email:        [______________]   |
| No. HP:       [______________]   |
| Status:       [Dropdown      v]  |
| Tahun Masuk:  [____]             |
| Tahun Lulus:  [____] (jika alumni)|
+----------------------------------+
|         [Batal]  [Simpan]        |
+----------------------------------+
```

### CareerEditForm.tsx
```text
+----------------------------------+
|     Edit Data Karir Alumni       |
+----------------------------------+
| Status Karir: [Dropdown      v]  |
|                                  |
| [Form dinamis sesuai status]     |
| - Bekerja: Perusahaan, Jabatan   |
| - Wirausaha: Nama Usaha, Jenis   |
| - Studi: Kampus, Program Studi   |
| - Mencari: Bidang, Lokasi        |
+----------------------------------+
|         [Batal]  [Simpan]        |
+----------------------------------+
```

### Tabel Data dengan Aksi
```text
+------+--------+--------+------+--------+-----------+
| Nama | NIM    | Status | Thn  | Email  | Aksi      |
+------+--------+--------+------+--------+-----------+
| Ahmad| 202001 | Alumni | 2024 | a@mail | [E] [H]   |
| Budi | 202002 | Aktif  | 2025 | b@mail | [E] [H]   |
+------+--------+--------+------+--------+-----------+

[E] = Edit (ikon pensil)
[H] = Hapus (ikon sampah)
```

---

## Logika dan Validasi

### Validasi Form Tambah Mahasiswa:
- NIM harus unik (tidak boleh duplikat)
- Nama minimal 3 karakter
- Email format valid (jika diisi)
- Tahun Lulus wajib diisi jika status = Alumni
- Tahun Lulus tidak boleh sebelum Tahun Masuk

### Validasi Hapus:
- Konfirmasi dengan nama mahasiswa yang akan dihapus
- Cascade delete: hapus juga data karir dan prestasi terkait

### Role-based Access:
- Hanya admin yang dapat mengakses fitur CRUD
- (Untuk demo, akses langsung tersedia)

---

## Langkah Implementasi

1. **Buat komponen admin baru**
   - StudentFormModal dengan form validation
   - CareerEditForm untuk edit karir
   - DeleteConfirmDialog untuk konfirmasi hapus

2. **Update Repository dan Service**
   - Tambah fungsi deleteStudent di repository
   - Tambah fungsi deleteStudent di service

3. **Update AlumniContext**
   - Tambah fungsi untuk CRUD master data mahasiswa
   - Tambah fungsi untuk sync dengan student repository

4. **Update AdminDashboard**
   - Tambah tombol "Tambah Mahasiswa" di header
   - Tambah kolom Aksi di tabel dengan tombol Edit dan Hapus
   - Integrasi modal form dan dialog konfirmasi

5. **Update DataTable**
   - Tambah prop untuk render custom action column
   - Support untuk callback onEdit dan onDelete

---

## Catatan Teknis

### State Management:
- Menggunakan AlumniContext yang sudah ada
- Menambah state untuk modal open/close
- Menambah state untuk selected student (edit mode)

### Data Synchronization:
- Data student profiles disimpan di student repository
- Data alumni (karir) disimpan di alumni context
- Perlu sinkronisasi antara kedua data store

### Demo Data:
- Fitur ini akan bekerja dengan in-memory data
- Perubahan akan hilang saat refresh (sesuai arsitektur saat ini)
- Untuk production, perlu integrasi dengan database

---

## Keamanan (Catatan Penting)

Untuk implementasi production:
- Wajib autentikasi admin
- Role-based access control
- Server-side validation
- Audit log untuk setiap perubahan

Untuk demo ini, fitur CRUD langsung tersedia tanpa autentikasi.

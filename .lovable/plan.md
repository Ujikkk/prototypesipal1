
# Pemisahan Akses Admin dan Mahasiswa dengan Role-Based Authentication

## Ringkasan
Memisahkan halaman admin dan mahasiswa dengan sistem role-based authentication yang proper. Admin akan memiliki akun terpisah dengan akses penuh untuk mengelola data mahasiswa, sedangkan mahasiswa hanya bisa mengakses dashboard mereka sendiri.

## Perubahan Utama

### 1. Unified Login Page
Satu halaman login di `/validasi` yang akan:
- Mendeteksi role user (admin atau mahasiswa) setelah login berhasil
- Redirect otomatis ke dashboard yang sesuai:
  - Admin → `/admin`
  - Mahasiswa → `/dashboard`

### 2. Admin Account System
- Tambah field `role` ke dalam data user (`'admin' | 'student'`)
- Buat akun admin default untuk demo (username: `admin`, password: `admin123`)
- Admin accounts akan disimpan terpisah dari student accounts

### 3. Protected Routes
- **Dashboard Mahasiswa** (`/dashboard`): Hanya bisa diakses oleh mahasiswa yang sudah login
- **Dashboard Admin** (`/admin`): Hanya bisa diakses oleh admin yang sudah login
- Route lain tetap public (landing page, kepuasan pengguna)

### 4. Navbar Conditional
- **Halaman Admin**: Tidak menampilkan navbar navigasi (mencegah akses tidak sah)
- **Halaman Mahasiswa**: Menampilkan navbar standar tanpa link ke admin dashboard
- Tambah tombol Logout di kedua dashboard

## Detail Teknis

### A. Type Updates (`src/types/student.types.ts`)
```text
// Tambah role type
export type UserRole = 'admin' | 'student';

// Update StudentProfile dengan optional role
export interface StudentProfile {
  // ... existing fields ...
  role?: UserRole;  // default 'student'
}

// Admin profile type
export interface AdminProfile {
  id: string;
  username: string;
  nama: string;
  passwordHash: string;
  role: 'admin';
  createdAt: Date;
}
```

### B. Auth Service Updates (`src/services/auth.service.ts`)
- Tambah fungsi `authenticateAdmin()` untuk login admin
- Update `AuthResult` dengan field `role`
- Buat fungsi helper `isAdmin()` dan `isStudent()`

### C. Context Updates (`src/contexts/AlumniContext.tsx`)
- Tambah `adminAccounts` state
- Tambah `loggedInAdmin` state
- Tambah fungsi `loginAsAdmin()` dan `logoutAdmin()`
- Update session storage untuk support admin session

### D. New Files

**1. AdminNavbar Component** (`src/components/layout/AdminNavbar.tsx`)
- Header sederhana dengan logo dan tombol logout
- Tidak ada menu navigasi ke halaman lain

**2. ProtectedRoute Component** (`src/components/auth/ProtectedRoute.tsx`)
- HOC untuk memproteksi route berdasarkan role
- Redirect ke login jika belum authenticated

### E. Page Updates

**ValidasiPage.tsx (Login Page)**
- Tambah toggle/tabs untuk pilih login sebagai Admin atau Mahasiswa
- Atau: single form yang detect role berdasarkan username format
- Redirect sesuai role setelah login

**AdminDashboard.tsx**
- Ganti `<Navbar />` dengan `<AdminNavbar />`
- Tambah check `isAdmin` di useEffect
- Redirect ke login jika bukan admin

**UserDashboard.tsx**
- Update navbar untuk hide link ke admin
- Tambah tombol logout
- Redirect ke login jika belum login

### F. Routing Updates (`src/App.tsx`)
- Wrap protected routes dengan `ProtectedRoute`
- Setup redirect logic berdasarkan role

## Flow Diagram

```text
+----------------+
|  Landing Page  |
|   (Public)     |
+-------+--------+
        |
        v
+----------------+
|  Login Page    |
|  /validasi     |
+-------+--------+
        |
  Login Submit
        |
        v
+-------+--------+
|  Check Role    |
+-------+--------+
    |       |
 Admin   Student
    |       |
    v       v
+------+  +--------+
|/admin|  |/dashboard|
+------+  +--------+
   |          |
   |    +-----+-----+
   |    |           |
   v    v           v
(Admin    (Student Dashboard)
Dashboard)   - Prestasi
 - Manage    - Karir
   Students  - Form
```

## Default Admin Account (Demo)
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

## Files to Create
1. `src/components/layout/AdminNavbar.tsx`
2. `src/components/auth/ProtectedRoute.tsx`
3. `src/data/admin-seed-data.ts`

## Files to Modify
1. `src/types/student.types.ts` - Add UserRole and AdminProfile types
2. `src/services/auth.service.ts` - Add admin authentication
3. `src/contexts/AlumniContext.tsx` - Add admin state and functions
4. `src/pages/ValidasiPage.tsx` - Add role selection and redirect logic
5. `src/pages/AdminDashboard.tsx` - Replace Navbar with AdminNavbar
6. `src/pages/UserDashboard.tsx` - Add logout button, update navbar
7. `src/components/layout/Navbar.tsx` - Remove admin link for students
8. `src/App.tsx` - Add protected routes

## Keamanan
- Session disimpan di localStorage (demo only)
- Di production, gunakan Supabase Auth dengan HTTP-only cookies
- Role check dilakukan di client-side (demo) - production harus server-side

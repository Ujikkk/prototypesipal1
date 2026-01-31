/**
 * Student Seed Data
 * Mock data for development and testing
 * 
 * ARCHITECTURE NOTE:
 * In production with Prisma, this would be:
 * - Database migrations for schema
 * - Prisma seed script for initial data
 * 
 * All data is ABT (Administrasi Bisnis Terapan) focused
 * 
 * DEMO DATA: 4 sample students representing each status type
 * 
 * DEFAULT PASSWORD: password123 (for all demo accounts)
 */

import type {
  StudentProfile,
  TracerStudyData,
  NonAcademicAchievement,
  StudentStatus,
} from '@/types/student.types';

// Simple hash function inline to avoid circular dependency with auth.service
// DO NOT use in production - use bcrypt on server
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `demo_hash_${Math.abs(hash).toString(16)}`;
}

// Default password hash for demo accounts
const DEFAULT_PASSWORD_HASH = simpleHash('password123');

// ============ Student Profiles (ABT Students) ============
// Demo students for each status type

export const studentProfiles: StudentProfile[] = [
  // DEMO 1: Alumni - Full access (career + achievements visible)
  {
    id: 's1',
    nama: 'Ahmad Rizki Pratama',
    nim: '20190001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'alumni',
    tahunMasuk: 2019,
    tahunLulus: 2023,
    email: 'ahmad.rizki@gmail.com',
    noHp: '081234567890',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2019-08-15'),
    updatedAt: new Date('2024-03-15'),
  },
  // DEMO 2: Mahasiswa Aktif - Achievements only (no career history)
  {
    id: 's5',
    nama: 'Eko Prasetyo',
    nim: '20210001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'active',
    tahunMasuk: 2021,
    email: 'eko.prasetyo@student.polines.ac.id',
    noHp: '081234567894',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2021-08-15'),
    updatedAt: new Date('2024-09-01'),
  },
  // DEMO 3: Mahasiswa Cuti - Achievements only (no career history)
  {
    id: 's8',
    nama: 'Hana Safira',
    nim: '20220002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'on_leave',
    tahunMasuk: 2022,
    email: 'hana.safira@student.polines.ac.id',
    noHp: '081234567897',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2022-08-15'),
    updatedAt: new Date('2024-06-01'),
  },
  // DEMO 4: Mahasiswa Dropout - Read-only achievements
  {
    id: 's13',
    nama: 'Rudi Hermawan',
    nim: '20200005',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'dropout',
    tahunMasuk: 2020,
    email: 'rudi.hermawan@gmail.com',
    noHp: '081234567912',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2020-08-15'),
    updatedAt: new Date('2023-03-01'),
  },
  // Additional alumni for variety
  {
    id: 's2',
    nama: 'Siti Nurhaliza',
    nim: '20190002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'alumni',
    tahunMasuk: 2019,
    tahunLulus: 2023,
    email: 'siti.nurhaliza@gmail.com',
    noHp: '081234567891',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2019-08-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 's3',
    nama: 'Budi Santoso',
    nim: '20200001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'alumni',
    tahunMasuk: 2020,
    tahunLulus: 2024,
    email: 'budi.santoso@gmail.com',
    noHp: '081234567892',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2020-08-15'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 's4',
    nama: 'Dewi Lestari',
    nim: '20200002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'alumni',
    tahunMasuk: 2020,
    tahunLulus: 2024,
    email: 'dewi.lestari@gmail.com',
    noHp: '081234567893',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2020-08-15'),
    updatedAt: new Date('2024-07-10'),
  },
  {
    id: 's6',
    nama: 'Fitri Handayani',
    nim: '20210002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'active',
    tahunMasuk: 2021,
    email: 'fitri.handayani@student.polines.ac.id',
    noHp: '081234567895',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2021-08-15'),
    updatedAt: new Date('2024-09-01'),
  },
  {
    id: 's7',
    nama: 'Gunawan Wibowo',
    nim: '20220001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'active',
    tahunMasuk: 2022,
    email: 'gunawan.wibowo@student.polines.ac.id',
    noHp: '081234567896',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2022-08-15'),
    updatedAt: new Date('2024-09-01'),
  },
  {
    id: 's9',
    nama: 'Irfan Maulana',
    nim: '20230001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'active',
    tahunMasuk: 2023,
    email: 'irfan.maulana@student.polines.ac.id',
    noHp: '081234567898',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-09-01'),
  },
  {
    id: 's10',
    nama: 'Jasmine Putri',
    nim: '20230002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'active',
    tahunMasuk: 2023,
    email: 'jasmine.putri@student.polines.ac.id',
    noHp: '081234567899',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-09-01'),
  },
  {
    id: 's11',
    nama: 'Kevin Wijaya',
    nim: '20180001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'alumni',
    tahunMasuk: 2018,
    tahunLulus: 2022,
    email: 'kevin.wijaya@gmail.com',
    noHp: '081234567800',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2018-08-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 's12',
    nama: 'Linda Kusuma',
    nim: '20180002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'Administrasi Bisnis Terapan',
    status: 'alumni',
    tahunMasuk: 2018,
    tahunLulus: 2022,
    email: 'linda.kusuma@gmail.com',
    noHp: '081234567801',
    passwordHash: DEFAULT_PASSWORD_HASH,
    hasCredentials: true,
    createdAt: new Date('2018-08-15'),
    updatedAt: new Date('2024-02-15'),
  },
];

// ============ Tracer Study Records (Alumni Only) ============

export const tracerStudyRecords: TracerStudyData[] = [
  {
    id: 't1',
    studentId: 's1',
    careerStatus: 'working',
    tahunPengisian: 2024,
    email: 'ahmad.rizki@gmail.com',
    noHp: '081234567890',
    linkedin: 'linkedin.com/in/ahmadrizki',
    employmentData: {
      namaPerusahaan: 'PT Bank Central Asia Tbk',
      lokasiPerusahaan: 'Jakarta',
      bidangIndustri: 'Perbankan & Keuangan',
      jabatan: 'Customer Service Officer',
      tahunMulaiKerja: 2023,
      relevansiKompetensi: 'sangat_relevan',
    },
    ringkasanKarir: 'Memulai karir di bidang perbankan setelah lulus, saat ini fokus pada pelayanan nasabah dan pengelolaan rekening.',
    bersediaDihubungi: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 't2',
    studentId: 's2',
    careerStatus: 'entrepreneur',
    tahunPengisian: 2024,
    email: 'siti.nurhaliza@gmail.com',
    noHp: '081234567891',
    mediaSosial: '@siti.business',
    entrepreneurshipData: {
      namaUsaha: 'Siti Creative Agency',
      jenisUsaha: 'Marketing & Digital Marketing',
      lokasiUsaha: 'Semarang',
      tahunMulaiUsaha: 2023,
      punyaKaryawan: true,
      jumlahKaryawan: 5,
      usahaAktif: true,
      relevansiKompetensi: 'sangat_relevan',
      sosialMediaUsaha: ['@siticreative', 'fb.com/siticreative'],
    },
    ringkasanKarir: 'Mendirikan agensi kreatif fokus pada digital marketing untuk UMKM lokal.',
    bersediaDihubungi: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 't3',
    studentId: 's3',
    careerStatus: 'working',
    tahunPengisian: 2024,
    email: 'budi.santoso@gmail.com',
    noHp: '081234567892',
    linkedin: 'linkedin.com/in/budisantoso',
    employmentData: {
      namaPerusahaan: 'PT Shopee Indonesia',
      lokasiPerusahaan: 'Jakarta',
      bidangIndustri: 'Retail & E-Commerce',
      jabatan: 'Business Development Associate',
      tahunMulaiKerja: 2024,
      relevansiKompetensi: 'relevan',
    },
    ringkasanKarir: 'Bekerja di bidang e-commerce, menangani pengembangan mitra seller.',
    bersediaDihubungi: true,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 't4',
    studentId: 's4',
    careerStatus: 'further_study',
    tahunPengisian: 2024,
    email: 'dewi.lestari@gmail.com',
    noHp: '081234567893',
    furtherStudyData: {
      namaKampus: 'Universitas Diponegoro',
      programStudi: 'Manajemen',
      jenjang: 'S1',
      lokasiKampus: 'Semarang',
      tahunMulaiStudi: 2024,
      relevansiKompetensi: 'sangat_relevan',
    },
    ringkasanKarir: 'Melanjutkan studi S1 Manajemen untuk memperdalam kompetensi bisnis.',
    bersediaDihubungi: true,
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-10'),
  },
  {
    id: 't5',
    studentId: 's11',
    careerStatus: 'working',
    tahunPengisian: 2024,
    email: 'kevin.wijaya@gmail.com',
    noHp: '081234567800',
    linkedin: 'linkedin.com/in/kevinwijaya',
    employmentData: {
      namaPerusahaan: 'PT Pertamina (Persero)',
      lokasiPerusahaan: 'Jakarta',
      bidangIndustri: 'BUMN/BUMD',
      jabatan: 'Staff Administrasi',
      tahunMulaiKerja: 2022,
      relevansiKompetensi: 'relevan',
    },
    ringkasanKarir: 'Bekerja di BUMN sektor energi, menangani administrasi dan dokumentasi.',
    bersediaDihubungi: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 't6',
    studentId: 's12',
    careerStatus: 'job_seeking',
    tahunPengisian: 2024,
    email: 'linda.kusuma@gmail.com',
    noHp: '081234567801',
    jobSeekingData: {
      lokasiTujuan: 'Semarang, Yogyakarta',
      bidangDiincar: 'Human Resources',
      lamaMencari: 2,
    },
    ringkasanKarir: 'Sedang mencari peluang di bidang HR dan pengelolaan SDM.',
    bersediaDihubungi: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
];

// ============ Non-Academic Achievements ============

export const achievementRecords: NonAcademicAchievement[] = [
  // Achievements for Demo Student 1 (Alumni - Ahmad)
  {
    id: 'a1',
    studentId: 's1',
    category: 'event_participation',
    subcategory: 'competition',
    title: 'Juara 2 Business Plan Competition HIMABI',
    description: 'Kompetisi business plan tingkat regional yang diselenggarakan oleh HIMABI Undip.',
    tanggal: new Date('2022-05-15'),
    lokasi: 'Semarang',
    penyelenggara: 'HIMABI Universitas Diponegoro',
    tingkat: 'regional',
    peringkat: 'Juara 2',
    verified: true,
    createdAt: new Date('2022-05-20'),
    updatedAt: new Date('2022-05-20'),
  },
  {
    id: 'a2',
    studentId: 's1',
    category: 'applied_academic',
    subcategory: 'internship',
    title: 'Magang di PT Bank Mandiri',
    description: 'Program magang selama 3 bulan di divisi Customer Service.',
    tanggal: new Date('2022-07-01'),
    lokasi: 'Semarang',
    penyelenggara: 'PT Bank Mandiri Tbk',
    tingkat: 'nasional',
    verified: true,
    createdAt: new Date('2022-10-01'),
    updatedAt: new Date('2022-10-01'),
  },
  // Achievements for Demo Student 2 (Active - Eko)
  {
    id: 'a4',
    studentId: 's5',
    category: 'event_participation',
    subcategory: 'seminar',
    title: 'Peserta Seminar Digital Marketing Era 5.0',
    description: 'Seminar nasional tentang transformasi digital marketing.',
    tanggal: new Date('2024-03-20'),
    lokasi: 'Jakarta (Online)',
    penyelenggara: 'Kemenparekraf RI',
    tingkat: 'nasional',
    verified: true,
    createdAt: new Date('2024-03-21'),
    updatedAt: new Date('2024-03-21'),
  },
  {
    id: 'a5',
    studentId: 's5',
    category: 'self_development',
    subcategory: 'certification',
    title: 'Google Digital Marketing Certificate',
    description: 'Sertifikasi digital marketing dari Google.',
    tanggal: new Date('2024-06-10'),
    penyelenggara: 'Google',
    tingkat: 'internasional',
    sertifikatUrl: 'https://certificates.google.com/example',
    verified: true,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
  },
  // Achievements for Demo Student 3 (On Leave - Hana)
  {
    id: 'a10',
    studentId: 's8',
    category: 'event_participation',
    subcategory: 'competition',
    title: 'Finalis Lomba Presentasi Bisnis',
    description: 'Kompetisi presentasi bisnis tingkat regional.',
    tanggal: new Date('2023-11-15'),
    lokasi: 'Semarang',
    penyelenggara: 'Politeknik Negeri Semarang',
    tingkat: 'regional',
    peringkat: 'Finalis',
    verified: true,
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2023-11-20'),
  },
  // Achievements for Demo Student 4 (Dropout - Rudi)
  {
    id: 'a11',
    studentId: 's13',
    category: 'event_participation',
    subcategory: 'seminar',
    title: 'Peserta Workshop Entrepreneurship',
    description: 'Workshop kewirausahaan untuk mahasiswa.',
    tanggal: new Date('2021-09-10'),
    lokasi: 'Semarang',
    penyelenggara: 'HIPMI Jateng',
    tingkat: 'regional',
    verified: true,
    createdAt: new Date('2021-09-15'),
    updatedAt: new Date('2021-09-15'),
  },
  // Additional achievements for variety
  {
    id: 'a3',
    studentId: 's2',
    category: 'entrepreneurship',
    subcategory: 'active_business',
    title: 'Founder Siti Creative Agency',
    description: 'Mendirikan agensi digital marketing untuk UMKM.',
    tanggal: new Date('2023-01-15'),
    lokasi: 'Semarang',
    tingkat: 'lokal',
    verified: true,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
  },
  {
    id: 'a6',
    studentId: 's6',
    category: 'applied_academic',
    subcategory: 'ecommerce_project',
    title: 'Proyek E-Commerce Kelompok - Toko Online Batik',
    description: 'Membuat dan mengelola toko online batik untuk mata kuliah E-Commerce.',
    tanggal: new Date('2024-05-01'),
    lokasi: 'Polines',
    penyelenggara: 'Prodi ABT Polines',
    tingkat: 'lokal',
    verified: true,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
  },
  {
    id: 'a7',
    studentId: 's7',
    category: 'event_participation',
    subcategory: 'competition',
    title: 'Finalis Lomba Debat Bisnis',
    description: 'Kompetisi debat bisnis tingkat politeknik se-Jawa Tengah.',
    tanggal: new Date('2024-04-12'),
    lokasi: 'Semarang',
    penyelenggara: 'Forum Politeknik Jawa Tengah',
    tingkat: 'regional',
    peringkat: 'Finalis',
    verified: false,
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15'),
  },
  {
    id: 'a8',
    studentId: 's9',
    category: 'self_development',
    subcategory: 'student_exchange',
    title: 'Program Pertukaran Mahasiswa Merdeka',
    description: 'Mengikuti program pertukaran mahasiswa ke Politeknik Negeri Bali.',
    tanggal: new Date('2024-08-01'),
    lokasi: 'Bali',
    penyelenggara: 'Kemendikbud RI',
    tingkat: 'nasional',
    verified: true,
    createdAt: new Date('2024-08-05'),
    updatedAt: new Date('2024-08-05'),
  },
];

// ============ Helper Functions ============

/**
 * Get student by ID
 */
export function getStudentById(id: string): StudentProfile | undefined {
  return studentProfiles.find(s => s.id === id);
}

/**
 * Get student by NIM
 */
export function getStudentByNim(nim: string): StudentProfile | undefined {
  return studentProfiles.find(s => s.nim === nim);
}

/**
 * Get tracer study by student ID
 */
export function getTracerStudyByStudentId(studentId: string): TracerStudyData | undefined {
  return tracerStudyRecords.find(t => t.studentId === studentId);
}

/**
 * Get achievements by student ID
 */
export function getAchievementsByStudentId(studentId: string): NonAcademicAchievement[] {
  return achievementRecords.filter(a => a.studentId === studentId);
}

/**
 * Get all alumni students
 */
export function getAlumniStudents(): StudentProfile[] {
  return studentProfiles.filter(s => s.status === 'alumni');
}

/**
 * Get students with credentials
 */
export function getStudentsWithCredentials(): StudentProfile[] {
  return studentProfiles.filter(s => s.hasCredentials);
}

/**
 * Check if career history is visible for a student status
 * Only alumni can view and edit career history
 */
export function isCareerHistoryVisible(status: StudentStatus): boolean {
  return status === 'alumni';
}

/**
 * Seed Data
 * Mock data for development and testing
 * 
 * ARCHITECTURE NOTE:
 * In production with Prisma, this would be:
 * - Database migrations for schema
 * - Prisma seed script for initial data
 * 
 * DEMO DATA INCLUDES:
 * - 1 Mahasiswa Aktif
 * - 1 Mahasiswa Cuti
 * - 1 Mahasiswa Dropout
 * - Alumni with various career scenarios:
 *   - 1 Alumni Bekerja
 *   - 1 Alumni Wirausaha
 *   - 1 Alumni Studi Lanjut
 *   - 1 Alumni Mencari Kerja
 *   - 1 Alumni Bekerja di 2 PT
 *   - 1 Alumni Bekerja dan Wirausaha
 */

import type { AlumniMaster, AlumniData } from '@/types';
import type { StudentStatus } from '@/types/student.types';

// Extended AlumniMaster with status for demo purposes
export interface AlumniMasterWithStatus extends AlumniMaster {
  status?: StudentStatus;
}

// ============ Alumni Master Data ============

export const alumniMasterData: AlumniMasterWithStatus[] = [
  // ============ DEMO: Different Student Statuses ============
  
  // DEMO 1: Mahasiswa Aktif
  {
    id: 'demo-aktif',
    nama: 'Rizky Aditya Pratama',
    nim: '20220001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2026,
    status: 'active',
  },
  
  // DEMO 2: Mahasiswa Cuti
  {
    id: 'demo-cuti',
    nama: 'Sinta Maharani',
    nim: '20210002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2025,
    status: 'on_leave',
  },
  
  // DEMO 3: Mahasiswa Dropout
  {
    id: 'demo-dropout',
    nama: 'Bayu Nugroho',
    nim: '20200003',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2024,
    status: 'dropout',
  },
  
  // ============ DEMO: Alumni with Various Career Scenarios ============
  
  // DEMO 4: Alumni Bekerja (single company)
  {
    id: 'demo-alumni-bekerja',
    nama: 'Ahmad Rizki Pratama',
    nim: '20190001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2023,
    status: 'alumni',
  },
  
  // DEMO 5: Alumni Wirausaha
  {
    id: 'demo-alumni-wirausaha',
    nama: 'Dian Permata Sari',
    nim: '20190002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2023,
    status: 'alumni',
  },
  
  // DEMO 6: Alumni Studi Lanjut
  {
    id: 'demo-alumni-studi',
    nama: 'Eka Putri Rahayu',
    nim: '20190003',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2023,
    status: 'alumni',
  },
  
  // DEMO 7: Alumni Mencari Kerja
  {
    id: 'demo-alumni-mencari',
    nama: 'Fajar Setiawan',
    nim: '20190004',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2023,
    status: 'alumni',
  },
  
  // DEMO 8: Alumni Bekerja di 2 PT (Multiple active jobs)
  {
    id: 'demo-alumni-2pt',
    nama: 'Galih Permana',
    nim: '20180001',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2022,
    status: 'alumni',
  },
  
  // DEMO 9: Alumni Bekerja dan Wirausaha
  {
    id: 'demo-alumni-kerja-wirausaha',
    nama: 'Hesti Wulandari',
    nim: '20180002',
    jurusan: 'Administrasi Bisnis',
    prodi: 'D4 Administrasi Bisnis Terapan',
    tahunLulus: 2022,
    status: 'alumni',
  },

  // ============ Additional Alumni for Variety ============
  {
    id: '1',
    nama: 'Indra Kusuma',
    nim: '20170001',
    jurusan: 'Teknik Elektro',
    prodi: 'D3 Teknik Elektronika',
    tahunLulus: 2020,
    status: 'alumni',
  },
  {
    id: '2',
    nama: 'Joko Widodo Jr',
    nim: '20170002',
    jurusan: 'Teknik Sipil',
    prodi: 'D3 Teknik Konstruksi Gedung',
    tahunLulus: 2020,
    status: 'alumni',
  },
];

// ============ Alumni Filled Data (Career History) ============

export const alumniFilledData: AlumniData[] = [
  // ============ Career data for DEMO Alumni ============
  
  // DEMO 4: Alumni Bekerja - Single active job
  {
    id: 'f-demo-bekerja-1',
    alumniMasterId: 'demo-alumni-bekerja',
    status: 'bekerja',
    tahunPengisian: 2024,
    isActive: true,
    namaPerusahaan: 'PT Telkom Indonesia',
    lokasiPerusahaan: 'Jakarta',
    bidangIndustri: 'Telekomunikasi',
    jabatan: 'Business Analyst',
    tahunMulaiKerja: 2023,
    email: 'ahmad.rizki@gmail.com',
    noHp: '081234567890',
    linkedin: 'linkedin.com/in/ahmadrizki',
    bersediaDihubungi: true,
    createdAt: new Date('2024-03-15'),
  },
  
  // DEMO 5: Alumni Wirausaha - Active business
  {
    id: 'f-demo-wirausaha-1',
    alumniMasterId: 'demo-alumni-wirausaha',
    status: 'wirausaha',
    tahunPengisian: 2024,
    isActive: true,
    namaUsaha: 'Permata Digital Agency',
    jenisUsaha: 'Digital Marketing & Branding',
    lokasiUsaha: 'Semarang',
    tahunMulaiUsaha: 2023,
    punyaKaryawan: true,
    jumlahKaryawan: 8,
    usahaAktif: true,
    sosialMediaUsaha: ['@permatadigital', 'permatadigital.id'],
    email: 'dian.permata@gmail.com',
    noHp: '081234567891',
    linkedin: 'linkedin.com/in/dianpermata',
    bersediaDihubungi: true,
    createdAt: new Date('2024-02-20'),
  },
  
  // DEMO 6: Alumni Studi Lanjut - Currently studying
  {
    id: 'f-demo-studi-1',
    alumniMasterId: 'demo-alumni-studi',
    status: 'studi',
    tahunPengisian: 2024,
    isActive: true,
    namaKampus: 'Universitas Gadjah Mada',
    programStudi: 'Manajemen Bisnis',
    jenjang: 'S2',
    lokasiKampus: 'Yogyakarta',
    tahunMulaiStudi: 2024,
    email: 'eka.putri@gmail.com',
    noHp: '081234567892',
    bersediaDihubungi: true,
    createdAt: new Date('2024-08-10'),
  },
  
  // DEMO 7: Alumni Mencari Kerja - Job seeking
  {
    id: 'f-demo-mencari-1',
    alumniMasterId: 'demo-alumni-mencari',
    status: 'mencari',
    tahunPengisian: 2024,
    isActive: true,
    lokasiTujuan: 'Semarang, Jakarta, Surabaya',
    bidangDiincar: 'Human Resources / Talent Acquisition',
    lamaMencari: 2,
    email: 'fajar.setiawan@gmail.com',
    noHp: '081234567893',
    linkedin: 'linkedin.com/in/fajarsetiawan',
    bersediaDihubungi: true,
    createdAt: new Date('2024-10-05'),
  },
  
  // DEMO 8: Alumni Bekerja di 2 PT - Two active jobs
  {
    id: 'f-demo-2pt-1',
    alumniMasterId: 'demo-alumni-2pt',
    status: 'bekerja',
    tahunPengisian: 2024,
    isActive: true,
    namaPerusahaan: 'PT Bank Central Asia',
    lokasiPerusahaan: 'Jakarta',
    bidangIndustri: 'Perbankan & Keuangan',
    jabatan: 'Senior Relationship Manager',
    tahunMulaiKerja: 2022,
    email: 'galih.permana@gmail.com',
    noHp: '081234567894',
    linkedin: 'linkedin.com/in/galihpermana',
    bersediaDihubungi: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'f-demo-2pt-2',
    alumniMasterId: 'demo-alumni-2pt',
    status: 'bekerja',
    tahunPengisian: 2024,
    isActive: true,
    namaPerusahaan: 'PT Astra International',
    lokasiPerusahaan: 'Jakarta',
    bidangIndustri: 'Konglomerat / Holding',
    jabatan: 'Part-time Business Consultant',
    tahunMulaiKerja: 2023,
    email: 'galih.permana@gmail.com',
    noHp: '081234567894',
    bersediaDihubungi: true,
    createdAt: new Date('2024-06-20'),
  },
  
  // DEMO 9: Alumni Bekerja dan Wirausaha - Working + Entrepreneur
  {
    id: 'f-demo-kerja-wirausaha-1',
    alumniMasterId: 'demo-alumni-kerja-wirausaha',
    status: 'bekerja',
    tahunPengisian: 2024,
    isActive: true,
    namaPerusahaan: 'PT Shopee Indonesia',
    lokasiPerusahaan: 'Jakarta',
    bidangIndustri: 'E-Commerce',
    jabatan: 'Category Manager',
    tahunMulaiKerja: 2022,
    email: 'hesti.wulandari@gmail.com',
    noHp: '081234567895',
    linkedin: 'linkedin.com/in/hestiwulandari',
    bersediaDihubungi: true,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'f-demo-kerja-wirausaha-2',
    alumniMasterId: 'demo-alumni-kerja-wirausaha',
    status: 'wirausaha',
    tahunPengisian: 2024,
    isActive: true,
    namaUsaha: 'Hesti Craft & Gift',
    jenisUsaha: 'Handicraft & Custom Gift',
    lokasiUsaha: 'Semarang',
    tahunMulaiUsaha: 2021,
    punyaKaryawan: true,
    jumlahKaryawan: 3,
    usahaAktif: true,
    sosialMediaUsaha: ['@hesticraft', 'shopee.co.id/hesticraft'],
    email: 'hesti.wulandari@gmail.com',
    noHp: '081234567895',
    bersediaDihubungi: true,
    createdAt: new Date('2024-02-10'),
  },

  // ============ Additional career data for variety ============
  
  // Past job (not active) for Demo Alumni Bekerja
  {
    id: 'f-demo-bekerja-past',
    alumniMasterId: 'demo-alumni-bekerja',
    status: 'bekerja',
    tahunPengisian: 2023,
    isActive: false,
    namaPerusahaan: 'PT Indosat Ooredoo',
    lokasiPerusahaan: 'Semarang',
    bidangIndustri: 'Telekomunikasi',
    jabatan: 'Sales Executive',
    tahunMulaiKerja: 2023,
    email: 'ahmad.rizki@gmail.com',
    noHp: '081234567890',
    bersediaDihubungi: true,
    createdAt: new Date('2023-06-15'),
  },

  // Career data for additional alumni
  {
    id: 'f1',
    alumniMasterId: '1',
    status: 'bekerja',
    tahunPengisian: 2024,
    isActive: true,
    namaPerusahaan: 'PT PLN (Persero)',
    lokasiPerusahaan: 'Jakarta',
    bidangIndustri: 'BUMN/BUMD',
    jabatan: 'Electrical Engineer',
    tahunMulaiKerja: 2021,
    email: 'indra.kusuma@gmail.com',
    noHp: '081234567800',
    linkedin: 'linkedin.com/in/indrakusuma',
    bersediaDihubungi: true,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'f2',
    alumniMasterId: '2',
    status: 'bekerja',
    tahunPengisian: 2024,
    isActive: true,
    namaPerusahaan: 'PT Waskita Karya',
    lokasiPerusahaan: 'Semarang',
    bidangIndustri: 'Konstruksi',
    jabatan: 'Project Manager',
    tahunMulaiKerja: 2021,
    email: 'joko.widodo.jr@gmail.com',
    noHp: '081234567801',
    bersediaDihubungi: true,
    createdAt: new Date('2024-02-20'),
  },
];

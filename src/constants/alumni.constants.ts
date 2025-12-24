/**
 * Alumni Constants
 * Static configuration values and lookup data
 * 
 * INSTITUTIONAL CONSTRAINT:
 * All students belong to:
 * - Jurusan: Administrasi Bisnis
 * - Prodi: Administrasi Bisnis Terapan
 */

import type { AlumniStatus, StatusChartData } from '@/types';

// ============ Status Configuration ============

export const STATUS_LABELS: Record<AlumniStatus, string> = {
  bekerja: 'Bekerja',
  mencari: 'Mencari Kerja',
  wirausaha: 'Wirausaha',
  studi: 'Melanjutkan Studi',
};

export const STATUS_COLORS: Record<AlumniStatus, string> = {
  bekerja: 'hsl(215, 80%, 45%)',
  mencari: 'hsl(38, 92%, 50%)',
  wirausaha: 'hsl(145, 65%, 42%)',
  studi: 'hsl(0, 84%, 60%)',
};

export const STATUS_CSS_CLASSES: Record<AlumniStatus, string> = {
  bekerja: 'status-bekerja',
  mencari: 'status-mencari',
  wirausaha: 'status-wirausaha',
  studi: 'status-studi',
};

// ============ Academic Structure ============
// Restricted to single department/program for institutional compliance

export const JURUSAN_LIST = [
  'Administrasi Bisnis',
] as const;

export const PRODI_BY_JURUSAN: Record<string, readonly string[]> = {
  'Administrasi Bisnis': ['Administrasi Bisnis Terapan'],
} as const;

export const TAHUN_LULUS_LIST = [2019, 2020, 2021, 2022, 2023, 2024, 2025] as const;

// ============ Industry Options ============

export const BIDANG_INDUSTRI_LIST = [
  'Telekomunikasi',
  'Manufaktur',
  'Perbankan & Keuangan',
  'IT & Software',
  'E-Commerce',
  'BUMN',
  'FMCG',
  'Startup',
  'Jasa Konsultasi',
  'Retail',
  'Lainnya',
] as const;

// ============ Education Levels ============

export const JENJANG_OPTIONS = [
  { value: 'S1', label: 'Sarjana (S1)' },
  { value: 'S2', label: 'Magister (S2)' },
  { value: 'S3', label: 'Doktoral (S3)' },
] as const;

// ============ Form Configuration ============

export const FORM_STEPS = {
  STATUS_SELECTION: 1,
  STATUS_DETAILS: 2,
  CONTACT_INFO: 3,
  ADDITIONAL_INFO: 4,
} as const;

export const TOTAL_FORM_STEPS = 4;

// ============ Export Configuration ============

export const EXPORT_HEADERS = [
  'Nama',
  'NIM',
  'Jurusan',
  'Prodi',
  'Tahun Lulus',
  'Status',
  'Email',
  'No HP',
] as const;

// ============ Chart Configuration ============

export const getStatusChartData = (stats: {
  bekerja: number;
  wirausaha: number;
  studi: number;
  mencari: number;
}): StatusChartData[] => [
  { name: 'Bekerja', value: stats.bekerja, color: STATUS_COLORS.bekerja },
  { name: 'Wirausaha', value: stats.wirausaha, color: STATUS_COLORS.wirausaha },
  { name: 'Studi Lanjut', value: stats.studi, color: STATUS_COLORS.studi },
  { name: 'Mencari Kerja', value: stats.mencari, color: STATUS_COLORS.mencari },
];

// ============ Validation Patterns ============

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  year: /^(19|20)\d{2}$/,
} as const;
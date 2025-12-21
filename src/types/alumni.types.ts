/**
 * Alumni Types
 * Centralized type definitions for alumni-related data structures
 * Ready for Prisma schema mapping in production
 */

// ============ Core Enums ============

export type AlumniStatus = 'bekerja' | 'mencari' | 'wirausaha' | 'studi';

export type EducationLevel = 'S1' | 'S2' | 'S3';

// ============ Master Data Types ============

/**
 * Alumni Master Record
 * Represents validated alumni from the institution's database
 * Maps to: Prisma model AlumniMaster
 */
export interface AlumniMaster {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
  prodi: string;
  tahunLulus: number;
}

// ============ Alumni Status Form Data Types ============

/**
 * Base contact information shared across all status types
 */
export interface AlumniContactInfo {
  email: string;
  noHp: string;
  mediaSosial?: string;
  linkedin?: string;
}

/**
 * Employment data for "bekerja" status
 */
export interface EmploymentData {
  namaPerusahaan: string;
  lokasiPerusahaan: string;
  bidangIndustri: string;
  jabatan: string;
  tahunMulaiKerja: number;
  kontakProfesional?: string;
}

/**
 * Job seeking data for "mencari" status
 */
export interface JobSeekingData {
  lokasiTujuan: string;
  bidangDiincar: string;
  lamaMencari: number;
}

/**
 * Entrepreneurship data for "wirausaha" status
 */
export interface EntrepreneurshipData {
  namaUsaha: string;
  jenisUsaha: string;
  lokasiUsaha: string;
  tahunMulaiUsaha: number;
  punyaKaryawan: boolean;
  jumlahKaryawan?: number;
  usahaAktif: boolean;
  sosialMediaUsaha: string[];
}

/**
 * Further study data for "studi" status
 */
export interface FurtherStudyData {
  namaKampus: string;
  programStudi: string;
  jenjang: EducationLevel;
  lokasiKampus: string;
  tahunMulaiStudi: number;
}

/**
 * Additional optional information
 */
export interface AlumniAdditionalInfo {
  bersediaDihubungi?: boolean;
  saranKomentar?: string;
}

/**
 * Complete Alumni Data Record
 * Represents a filled form submission
 * Maps to: Prisma model AlumniData
 */
export interface AlumniData extends AlumniContactInfo, AlumniAdditionalInfo {
  id: string;
  alumniMasterId: string;
  status: AlumniStatus;
  tahunPengisian: number;
  createdAt: Date;

  // Status-specific data (only one should be populated based on status)
  // Employment (bekerja)
  namaPerusahaan?: string;
  lokasiPerusahaan?: string;
  bidangIndustri?: string;
  jabatan?: string;
  tahunMulaiKerja?: number;
  kontakProfesional?: string;

  // Job Seeking (mencari)
  lokasiTujuan?: string;
  bidangDiincar?: string;
  lamaMencari?: number;

  // Entrepreneurship (wirausaha)
  namaUsaha?: string;
  jenisUsaha?: string;
  lokasiUsaha?: string;
  tahunMulaiUsaha?: number;
  punyaKaryawan?: boolean;
  jumlahKaryawan?: number;
  usahaAktif?: boolean;
  sosialMediaUsaha?: string[];

  // Further Study (studi)
  namaKampus?: string;
  programStudi?: string;
  jenjang?: EducationLevel;
  lokasiKampus?: string;
  tahunMulaiStudi?: number;
}

// ============ Merged/View Types ============

/**
 * Merged view of master data with optional filled data
 * Used in admin dashboard
 */
export interface AlumniMergedView extends AlumniMaster {
  filledData?: AlumniData;
}

// ============ Form Input Types ============

/**
 * Form input for creating new alumni data
 * Omits auto-generated fields
 */
export type AlumniDataInput = Omit<AlumniData, 'id' | 'createdAt'>;

// ============ Filter Types ============

/**
 * Filter criteria for alumni data queries
 */
export interface AlumniFilterCriteria {
  searchQuery?: string;
  tahunLulus?: number | 'all';
  jurusan?: string | 'all';
  prodi?: string | 'all';
  status?: AlumniStatus | 'all';
}

// ============ Statistics Types ============

/**
 * Alumni statistics aggregation
 */
export interface AlumniStatistics {
  total: number;
  filled: number;
  bekerja: number;
  wirausaha: number;
  studi: number;
  mencari: number;
}

/**
 * Chart data point for status distribution
 */
export interface StatusChartData {
  name: string;
  value: number;
  color: string;
}

/**
 * Chart data for industry distribution
 */
export interface IndustryChartData {
  name: string;
  value: number;
}

/**
 * Chart data for year trends
 */
export interface YearTrendData {
  year: string;
  bekerja: number;
  wirausaha: number;
}

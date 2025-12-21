/**
 * Alumni Service
 * Business logic layer for alumni operations
 * 
 * ARCHITECTURE NOTE:
 * Services contain business logic and orchestrate repository calls.
 * Keep UI components thin - they should only call service methods.
 */

import type {
  AlumniMaster,
  AlumniData,
  AlumniDataInput,
  AlumniStatistics,
  AlumniFilterCriteria,
  AlumniMergedView,
  IndustryChartData,
  YearTrendData,
} from '@/types';
import * as alumniRepository from '@/repositories/alumni.repository';
import { STATUS_LABELS, STATUS_CSS_CLASSES, EXPORT_HEADERS } from '@/constants';

// ============ Validation Operations ============

/**
 * Search for alumni by name and graduation year
 * Used in the validation flow
 */
export const searchAlumni = async (
  nama: string,
  tahunLulus: number
): Promise<AlumniMaster[]> => {
  if (!nama.trim()) {
    return [];
  }
  return alumniRepository.searchMasterData(nama, tahunLulus);
};

/**
 * Validate if an alumni exists in master data
 */
export const validateAlumni = async (
  nama: string,
  tahunLulus: number
): Promise<{ isValid: boolean; matches: AlumniMaster[] }> => {
  const matches = await searchAlumni(nama, tahunLulus);
  return {
    isValid: matches.length > 0,
    matches,
  };
};

// ============ Data Retrieval Operations ============

/**
 * Get all master data
 */
export const getAllMasterData = async (): Promise<AlumniMaster[]> => {
  return alumniRepository.getAllMasterData();
};

/**
 * Get all filled alumni data
 */
export const getAllAlumniData = async (): Promise<AlumniData[]> => {
  return alumniRepository.getAllFilledData();
};

/**
 * Get alumni history by master ID
 */
export const getAlumniHistory = async (
  masterId: string
): Promise<AlumniData[]> => {
  return alumniRepository.getFilledDataByMasterId(masterId);
};

/**
 * Get merged view for admin dashboard
 */
export const getMergedAlumniView = async (): Promise<AlumniMergedView[]> => {
  return alumniRepository.getMergedAlumniData();
};

/**
 * Get filtered alumni data for admin dashboard
 */
export const getFilteredAlumniData = async (
  criteria: AlumniFilterCriteria
): Promise<AlumniMergedView[]> => {
  return alumniRepository.getFilteredMergedData(criteria);
};

// ============ Data Submission Operations ============

/**
 * Submit new alumni status data
 */
export const submitAlumniData = async (
  input: AlumniDataInput
): Promise<AlumniData> => {
  // Validate required fields
  if (!input.email || !input.noHp) {
    throw new Error('Email dan No. HP wajib diisi');
  }

  if (!input.status) {
    throw new Error('Status wajib dipilih');
  }

  return alumniRepository.createFilledData(input);
};

// ============ Statistics Operations ============

/**
 * Calculate alumni statistics
 */
export const calculateStatistics = async (): Promise<AlumniStatistics> => {
  const [masterData, filledData] = await Promise.all([
    alumniRepository.getAllMasterData(),
    alumniRepository.getAllFilledData(),
  ]);

  return {
    total: masterData.length,
    filled: filledData.length,
    bekerja: filledData.filter((d) => d.status === 'bekerja').length,
    wirausaha: filledData.filter((d) => d.status === 'wirausaha').length,
    studi: filledData.filter((d) => d.status === 'studi').length,
    mencari: filledData.filter((d) => d.status === 'mencari').length,
  };
};

/**
 * Get industry distribution data for charts
 */
export const getIndustryDistribution = async (): Promise<IndustryChartData[]> => {
  const filledData = await alumniRepository.getAllFilledData();
  const employedData = filledData.filter((d) => d.status === 'bekerja');

  const counts: Record<string, number> = {};
  employedData.forEach((d) => {
    if (d.bidangIndustri) {
      counts[d.bidangIndustri] = (counts[d.bidangIndustri] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

/**
 * Get year trend data for charts
 */
export const getYearTrendData = async (): Promise<YearTrendData[]> => {
  const [masterData, filledData] = await Promise.all([
    alumniRepository.getAllMasterData(),
    alumniRepository.getAllFilledData(),
  ]);

  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  
  return years.map((year) => {
    const yearData = filledData.filter((d) => {
      const master = masterData.find((m) => m.id === d.alumniMasterId);
      return master?.tahunLulus === year;
    });

    return {
      year: year.toString(),
      bekerja: yearData.filter((d) => d.status === 'bekerja').length,
      wirausaha: yearData.filter((d) => d.status === 'wirausaha').length,
    };
  });
};

// ============ Export Operations ============

/**
 * Generate CSV export data
 */
export const generateExportData = async (
  criteria?: AlumniFilterCriteria
): Promise<string> => {
  const data = criteria
    ? await getFilteredAlumniData(criteria)
    : await getMergedAlumniView();

  const rows = data.map((alumni) => [
    alumni.nama,
    alumni.nim,
    alumni.jurusan,
    alumni.prodi,
    alumni.tahunLulus.toString(),
    alumni.filledData ? STATUS_LABELS[alumni.filledData.status] : '-',
    alumni.filledData?.email || '-',
    alumni.filledData?.noHp || '-',
  ]);

  const csvContent = [EXPORT_HEADERS, ...rows]
    .map((row) => row.join(','))
    .join('\n');

  return csvContent;
};

/**
 * Trigger CSV download
 */
export const downloadExportCSV = async (
  criteria?: AlumniFilterCriteria,
  filename = 'data-alumni-sipal.csv'
): Promise<void> => {
  const csvContent = await generateExportData(criteria);
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};

// ============ Helper Functions ============

/**
 * Get status label from status code
 */
export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
};

/**
 * Get status CSS class from status code
 */
export const getStatusCssClass = (status: string): string => {
  return STATUS_CSS_CLASSES[status as keyof typeof STATUS_CSS_CLASSES] || '';
};

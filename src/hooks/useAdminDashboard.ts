/**
 * useAdminDashboard Hook
 * Encapsulates dashboard state and logic
 * 
 * ARCHITECTURE NOTE:
 * This hook extracts business logic from AdminDashboard,
 * keeping the component presentation-only.
 */

import { useState, useMemo, useCallback } from 'react';
import type { 
  AlumniMergedView, 
  AlumniFilterCriteria,
  AlumniStatistics,
  StatusChartData,
  IndustryChartData,
  YearTrendData 
} from '@/types';
import { useAlumni } from '@/contexts/AlumniContext';
import { getStatusChartData, STATUS_LABELS, EXPORT_HEADERS } from '@/constants';

// ============ Hook Return Type ============

interface UseAdminDashboardReturn {
  // Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterTahun: string;
  setFilterTahun: (tahun: string) => void;
  filterJurusan: string;
  setFilterJurusan: (jurusan: string) => void;
  filterProdi: string;
  setFilterProdi: (prodi: string) => void;
  
  // Data
  filteredData: AlumniMergedView[];
  totalData: number;
  
  // Statistics
  stats: AlumniStatistics;
  
  // Chart data
  statusChartData: StatusChartData[];
  industryData: IndustryChartData[];
  yearTrendData: YearTrendData[];
  
  // Selected alumni detail
  selectedAlumniId: string | null;
  setSelectedAlumniId: (id: string | null) => void;
  selectedAlumniDetail: AlumniMergedView | null;
  
  // Actions
  handleExport: () => void;
  getStatusLabel: (status: string) => string;
  getStatusClass: (status: string) => string;
}

// ============ Hook Implementation ============

export function useAdminDashboard(): UseAdminDashboardReturn {
  const { masterData, alumniData } = useAlumni();
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahun, setFilterTahun] = useState<string>('all');
  const [filterJurusan, setFilterJurusan] = useState<string>('all');
  const [filterProdi, setFilterProdi] = useState<string>('all');
  const [selectedAlumniId, setSelectedAlumniId] = useState<string | null>(null);

  // Merge master data with filled data
  const mergedData = useMemo<AlumniMergedView[]>(() => {
    return masterData.map((master) => {
      const filled = alumniData.find((d) => d.alumniMasterId === master.id);
      return { ...master, filledData: filled };
    });
  }, [masterData, alumniData]);

  // Filter data
  const filteredData = useMemo<AlumniMergedView[]>(() => {
    return mergedData.filter((alumni) => {
      const matchSearch =
        alumni.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.nim.includes(searchQuery);
      const matchTahun =
        filterTahun === 'all' || alumni.tahunLulus === parseInt(filterTahun);
      const matchJurusan =
        filterJurusan === 'all' || alumni.jurusan === filterJurusan;
      const matchProdi = filterProdi === 'all' || alumni.prodi === filterProdi;
      return matchSearch && matchTahun && matchJurusan && matchProdi;
    });
  }, [mergedData, searchQuery, filterTahun, filterJurusan, filterProdi]);

  // Statistics
  const stats = useMemo<AlumniStatistics>(() => {
    return {
      total: masterData.length,
      filled: alumniData.length,
      bekerja: alumniData.filter((d) => d.status === 'bekerja').length,
      wirausaha: alumniData.filter((d) => d.status === 'wirausaha').length,
      studi: alumniData.filter((d) => d.status === 'studi').length,
      mencari: alumniData.filter((d) => d.status === 'mencari').length,
    };
  }, [masterData, alumniData]);

  // Chart data - Status distribution
  const statusChartData = useMemo<StatusChartData[]>(() => {
    return getStatusChartData(stats);
  }, [stats]);

  // Chart data - Industry distribution
  const industryData = useMemo<IndustryChartData[]>(() => {
    const counts: Record<string, number> = {};
    alumniData
      .filter((d) => d.status === 'bekerja')
      .forEach((d) => {
        if (d.bidangIndustri) {
          counts[d.bidangIndustri] = (counts[d.bidangIndustri] || 0) + 1;
        }
      });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [alumniData]);

  // Chart data - Year trends
  const yearTrendData = useMemo<YearTrendData[]>(() => {
    const years = [2019, 2020, 2021, 2022, 2023, 2024];
    return years.map((year) => {
      const yearData = alumniData.filter((d) => {
        const master = masterData.find((m) => m.id === d.alumniMasterId);
        return master?.tahunLulus === year;
      });
      return {
        year: year.toString(),
        bekerja: yearData.filter((d) => d.status === 'bekerja').length,
        wirausaha: yearData.filter((d) => d.status === 'wirausaha').length,
      };
    });
  }, [alumniData, masterData]);

  // Selected alumni detail
  const selectedAlumniDetail = useMemo<AlumniMergedView | null>(() => {
    if (!selectedAlumniId) return null;
    return mergedData.find((m) => m.id === selectedAlumniId) ?? null;
  }, [selectedAlumniId, mergedData]);

  // Export handler
  const handleExport = useCallback(() => {
    const rows = filteredData.map((alumni) => [
      alumni.nama,
      alumni.nim,
      alumni.jurusan,
      alumni.prodi,
      alumni.tahunLulus,
      alumni.filledData ? STATUS_LABELS[alumni.filledData.status] : '-',
      alumni.filledData?.email || '-',
      alumni.filledData?.noHp || '-',
    ]);

    const csvContent = [EXPORT_HEADERS, ...rows]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-alumni-sipal.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredData]);

  // Helper functions
  const getStatusLabel = useCallback((status: string): string => {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || '-';
  }, []);

  const getStatusClass = useCallback((status: string): string => {
    const classes: Record<string, string> = {
      bekerja: 'status-bekerja',
      mencari: 'status-mencari',
      wirausaha: 'status-wirausaha',
      studi: 'status-studi',
    };
    return classes[status] || '';
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filterTahun,
    setFilterTahun,
    filterJurusan,
    setFilterJurusan,
    filterProdi,
    setFilterProdi,
    filteredData,
    totalData: masterData.length,
    stats,
    statusChartData,
    industryData,
    yearTrendData,
    selectedAlumniId,
    setSelectedAlumniId,
    selectedAlumniDetail,
    handleExport,
    getStatusLabel,
    getStatusClass,
  };
}

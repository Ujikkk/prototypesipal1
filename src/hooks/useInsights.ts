/**
 * useInsights Hook
 * Encapsulates AI insight generation logic
 * 
 * ARCHITECTURE NOTE:
 * This hook extracts insight generation from AIInsightPage,
 * making it reusable and keeping the component presentation-only.
 */

import { useState, useCallback } from 'react';
import { useAlumni } from '@/contexts/AlumniContext';

// ============ Types ============

interface InsightStats {
  totalAnalyzed: number;
  bekerjaCount: number;
  wirausahaCount: number;
  employmentRate: number;
}

interface UseInsightsReturn {
  // State
  isGenerating: boolean;
  insights: string[];
  stats: InsightStats;
  
  // Actions
  generateInsights: () => void;
}

// ============ Hook Implementation ============

export function useInsights(): UseInsightsReturn {
  const { alumniData, masterData } = useAlumni();
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  // Stats calculation
  const stats: InsightStats = {
    totalAnalyzed: alumniData.length,
    bekerjaCount: alumniData.filter((d) => d.status === 'bekerja').length,
    wirausahaCount: alumniData.filter((d) => d.status === 'wirausaha').length,
    employmentRate: alumniData.length
      ? Math.round(
          (alumniData.filter((d) => d.status === 'bekerja').length /
            alumniData.length) *
            100
        )
      : 0,
  };

  // Generate insights
  const generateInsights = useCallback(() => {
    setIsGenerating(true);

    // Simulate AI analysis with timeout
    setTimeout(() => {
      const bekerja = alumniData.filter((d) => d.status === 'bekerja');
      const wirausaha = alumniData.filter((d) => d.status === 'wirausaha');
      const studi = alumniData.filter((d) => d.status === 'studi');
      const mencari = alumniData.filter((d) => d.status === 'mencari');

      const total = alumniData.length;
      const bekerjaPercent = total
        ? Math.round((bekerja.length / total) * 100)
        : 0;
      const wirausahaPercent = total
        ? Math.round((wirausaha.length / total) * 100)
        : 0;

      // Industry analysis
      const industryCount: Record<string, number> = {};
      bekerja.forEach((d) => {
        if (d.bidangIndustri) {
          industryCount[d.bidangIndustri] =
            (industryCount[d.bidangIndustri] || 0) + 1;
        }
      });
      const topIndustry = Object.entries(industryCount).sort(
        (a, b) => b[1] - a[1]
      )[0];

      // Location analysis
      const locationCount: Record<string, number> = {};
      bekerja.forEach((d) => {
        if (d.lokasiPerusahaan) {
          locationCount[d.lokasiPerusahaan] =
            (locationCount[d.lokasiPerusahaan] || 0) + 1;
        }
      });
      const topLocation = Object.entries(locationCount).sort(
        (a, b) => b[1] - a[1]
      )[0];

      // Department analysis
      const jurusanBekerja: Record<string, number> = {};
      bekerja.forEach((d) => {
        const master = masterData.find((m) => m.id === d.alumniMasterId);
        if (master) {
          jurusanBekerja[master.jurusan] =
            (jurusanBekerja[master.jurusan] || 0) + 1;
        }
      });
      const topJurusan = Object.entries(jurusanBekerja).sort(
        (a, b) => b[1] - a[1]
      )[0];

      const generatedInsights = [
        `📊 **Tingkat Keterserapan Kerja**: ${bekerjaPercent}% alumni saat ini berstatus bekerja, menunjukkan tingkat employability yang ${
          bekerjaPercent >= 70
            ? 'sangat baik'
            : bekerjaPercent >= 50
            ? 'cukup baik'
            : 'perlu ditingkatkan'
        }.`,
        `🚀 **Tren Kewirausahaan**: ${wirausahaPercent}% alumni memilih jalur wirausaha. ${
          wirausahaPercent >= 20
            ? 'Ini menunjukkan jiwa entrepreneurship yang tinggi di kalangan alumni Polines.'
            : 'Kampus dapat mempertimbangkan program inkubasi bisnis untuk mendorong lebih banyak wirausaha.'
        }`,
        topIndustry
          ? `🏭 **Industri Dominan**: Sektor ${topIndustry[0]} menjadi pilihan terbanyak dengan ${topIndustry[1]} alumni, menunjukkan kesesuaian kurikulum dengan kebutuhan industri tersebut.`
          : '',
        topLocation
          ? `📍 **Persebaran Lokasi Kerja**: ${topLocation[0]} menjadi lokasi kerja terfavorit dengan ${topLocation[1]} alumni. Hal ini dapat menjadi acuan untuk program kerjasama industri.`
          : '',
        topJurusan
          ? `🎓 **Jurusan Unggulan**: Alumni dari jurusan ${topJurusan[0]} menunjukkan tingkat keterserapan kerja tertinggi dengan ${topJurusan[1]} alumni bekerja.`
          : '',
        studi.length > 0
          ? `📚 **Minat Studi Lanjut**: ${studi.length} alumni melanjutkan pendidikan ke jenjang yang lebih tinggi, menunjukkan komitmen untuk pengembangan akademik.`
          : '',
        mencari.length > 0
          ? `🔍 **Alumni Mencari Kerja**: Terdapat ${mencari.length} alumni yang sedang aktif mencari pekerjaan. Kampus dapat membantu dengan program job fair atau career counseling.`
          : '',
        `💡 **Rekomendasi**: Berdasarkan analisis data, disarankan untuk memperkuat kerjasama dengan industri ${
          topIndustry?.[0] || 'unggulan'
        } dan mengembangkan program magang yang lebih intensif.`,
      ].filter(Boolean);

      setInsights(generatedInsights);
      setIsGenerating(false);
    }, 2000);
  }, [alumniData, masterData]);

  return {
    isGenerating,
    insights,
    stats,
    generateInsights,
  };
}

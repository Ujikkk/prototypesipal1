/**
 * Rating System Constants
 * Configuration for graduate satisfaction evaluation
 */

import type { RatingCategory, RatingCategoryConfig, IndustrySector } from '@/types/rating.types';

// ============ Rating Categories Configuration ============

export const RATING_CATEGORIES: RatingCategoryConfig[] = [
  {
    id: 'technical_competence',
    label: 'Kompetensi Teknis',
    description: 'Kemampuan lulusan dalam menerapkan keterampilan teknis di tempat kerja',
    questions: [
      'Kemampuan menerapkan keterampilan yang relevan dengan pekerjaan',
      'Kemampuan pemecahan masalah',
      'Pemahaman terhadap prosedur kerja',
    ],
  },
  {
    id: 'work_ethics',
    label: 'Etika & Profesionalisme Kerja',
    description: 'Sikap profesional dan integritas dalam bekerja',
    questions: [
      'Disiplin dan ketepatan waktu',
      'Tanggung jawab terhadap tugas',
      'Integritas dan kejujuran',
    ],
  },
  {
    id: 'communication',
    label: 'Komunikasi & Kerjasama Tim',
    description: 'Kemampuan berkomunikasi dan berkolaborasi dengan tim',
    questions: [
      'Kejelasan dalam berkomunikasi',
      'Kemampuan berkolaborasi dalam tim',
      'Kemampuan beradaptasi dengan lingkungan kerja',
    ],
  },
  {
    id: 'initiative',
    label: 'Inisiatif & Kemampuan Belajar',
    description: 'Proaktivitas dan kemauan untuk terus berkembang',
    questions: [
      'Kemauan untuk belajar hal baru',
      'Inisiatif dalam menyelesaikan tugas',
      'Responsif terhadap masukan dan kritik',
    ],
  },
  {
    id: 'overall',
    label: 'Kepuasan Keseluruhan',
    description: 'Penilaian menyeluruh terhadap kinerja lulusan',
    questions: [
      'Kepuasan keseluruhan terhadap kinerja lulusan',
    ],
  },
];

// ============ Industry Sectors ============

export const INDUSTRY_SECTORS: Record<IndustrySector, string> = {
  banking_finance: 'Perbankan & Keuangan',
  manufacturing: 'Manufaktur',
  retail_commerce: 'Retail & Perdagangan',
  technology: 'Teknologi Informasi',
  healthcare: 'Kesehatan',
  education: 'Pendidikan',
  government: 'Pemerintahan',
  hospitality: 'Perhotelan & Pariwisata',
  logistics: 'Logistik & Transportasi',
  consulting: 'Konsultan',
  media: 'Media & Komunikasi',
  other: 'Lainnya',
};

// ============ Rating Labels ============

export const RATING_LABELS: Record<number, string> = {
  1: 'Sangat Kurang',
  2: 'Kurang',
  3: 'Cukup',
  4: 'Baik',
  5: 'Sangat Baik',
};

// ============ Form Steps ============

export const FORM_STEPS = [
  { id: 'student_selection', label: 'Pilih Lulusan', icon: 'User' },
  { id: 'rating', label: 'Penilaian', icon: 'Star' },
  { id: 'feedback', label: 'Umpan Balik', icon: 'MessageSquare' },
  { id: 'employer', label: 'Identitas Penilai', icon: 'Building2' },
  { id: 'confirmation', label: 'Konfirmasi', icon: 'CheckCircle' },
] as const;

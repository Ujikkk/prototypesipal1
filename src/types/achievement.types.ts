// Achievement Types for Non-Academic Achievements Module

export type AchievementCategory = 
  | 'kegiatan'      // Partisipasi & Prestasi Kegiatan
  | 'publikasi'     // Karya Ilmiah & Publikasi
  | 'haki'          // Kekayaan Intelektual
  | 'magang'        // Pengalaman Magang
  | 'portofolio'    // Portofolio Praktikum
  | 'wirausaha'     // Pengalaman Wirausaha
  | 'pengembangan'; // Program Pengembangan Diri

export interface BaseAchievement {
  id: string;
  masterId: string; // Reference to student profile
  category: AchievementCategory;
  createdAt: string;
  updatedAt: string;
  // File attachments
  attachments?: AchievementAttachment[];
}

export interface AchievementAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string; // Base64 or blob URL for now (will be storage URL with backend)
  uploadedAt: string;
}

// Partisipasi & Prestasi Kegiatan
export interface KegiatanAchievement extends BaseAchievement {
  category: 'kegiatan';
  jenisKegiatan: 'seminar' | 'lomba' | 'pembicara' | 'pelatihan' | 'lainnya';
  namaKegiatan: string;
  penyelenggara: string;
  tingkat: 'internal' | 'regional' | 'nasional' | 'internasional';
  prestasi?: string; // e.g., Juara 1, Finalis
  tahun: number;
  bulan?: number;
  sertifikat?: boolean;
  deskripsi?: string;
}

// Karya Ilmiah & Publikasi
export interface PublikasiAchievement extends BaseAchievement {
  category: 'publikasi';
  jenisPublikasi: 'artikel_jurnal' | 'prosiding' | 'buku' | 'book_chapter' | 'lainnya';
  judul: string;
  penulis: string; // Comma separated
  penerbit?: string;
  namaJurnal?: string;
  volume?: string;
  halaman?: string;
  doi?: string;
  tahun: number;
  url?: string;
  deskripsi?: string;
}

// Kekayaan Intelektual (HAKI)
export interface HakiAchievement extends BaseAchievement {
  category: 'haki';
  jenisHaki: 'hak_cipta' | 'paten' | 'merek' | 'desain_industri' | 'rahasia_dagang';
  judul: string;
  nomorPendaftaran?: string;
  nomorSertifikat?: string;
  status: 'terdaftar' | 'granted' | 'pending' | 'ditolak';
  tahunPengajuan: number;
  tahunTerbit?: number;
  pemegang: string;
  deskripsi?: string;
}

// Pengalaman Magang
export interface MagangAchievement extends BaseAchievement {
  category: 'magang';
  namaPerusahaan: string;
  posisi: string;
  lokasi: string;
  industri: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
  sedangBerjalan: boolean;
  deskripsiTugas?: string;
  skillDiperoleh?: string[];
}

// Portofolio Praktikum
export interface PortofolioAchievement extends BaseAchievement {
  category: 'portofolio';
  mataKuliah: 'kwu' | 'ecommerce' | 'msdm_ocai' | 'lainnya';
  judulProyek: string;
  deskripsiProyek: string;
  tahun: number;
  semester: 'ganjil' | 'genap';
  nilai?: string;
  urlProyek?: string;
  dokumentasi?: string;
}

// Pengalaman Wirausaha
export interface WirausahaAchievement extends BaseAchievement {
  category: 'wirausaha';
  namaUsaha: string;
  jenisUsaha: string;
  deskripsiUsaha: string;
  tahunMulai: number;
  masihAktif: boolean;
  tahunSelesai?: number;
  jumlahKaryawan?: number;
  omzetPerBulan?: string;
  lokasi: string;
  sosialMedia?: string[];
}

// Program Pengembangan Diri
export interface PengembanganAchievement extends BaseAchievement {
  category: 'pengembangan';
  jenisProgram: 'pertukaran_mahasiswa' | 'beasiswa' | 'volunteer' | 'organisasi' | 'lainnya';
  namaProgram: string;
  penyelenggara: string;
  lokasi?: string;
  negara?: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
  sedangBerjalan: boolean;
  deskripsi?: string;
  prestasi?: string;
}

// Union type for all achievements
export type Achievement = 
  | KegiatanAchievement
  | PublikasiAchievement
  | HakiAchievement
  | MagangAchievement
  | PortofolioAchievement
  | WirausahaAchievement
  | PengembanganAchievement;

// Category metadata for UI
export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, { label: string; icon: string; color: string }> = {
  kegiatan: { label: 'Partisipasi & Prestasi', icon: 'Trophy', color: 'text-warning' },
  publikasi: { label: 'Karya Ilmiah & Publikasi', icon: 'BookOpen', color: 'text-primary' },
  haki: { label: 'Kekayaan Intelektual', icon: 'Shield', color: 'text-success' },
  magang: { label: 'Pengalaman Magang', icon: 'Briefcase', color: 'text-info' },
  portofolio: { label: 'Portofolio Praktikum', icon: 'FolderOpen', color: 'text-secondary' },
  wirausaha: { label: 'Pengalaman Wirausaha', icon: 'Rocket', color: 'text-destructive' },
  pengembangan: { label: 'Pengembangan Diri', icon: 'GraduationCap', color: 'text-accent' },
};

// Achievement Types for Non-Academic Achievements Module

export type AchievementCategory = 
  | 'lomba'         // Lomba / Kompetisi
  | 'seminar'       // Seminar
  | 'publikasi'     // Karya Ilmiah & Publikasi
  | 'haki'          // Kekayaan Intelektual
  | 'magang'        // Pengalaman Magang
  | 'portofolio'    // Portofolio Praktikum Kelas
  | 'wirausaha'     // Pengalaman Wirausaha
  | 'pengembangan'  // Program Pengembangan Diri
  | 'organisasi';   // Organisasi & Kepemimpinan

export interface BaseAchievement {
  id: string;
  masterId: string; // Reference to student profile
  category: AchievementCategory;
  createdAt: string;
  updatedAt: string;
  // Featured achievement flag
  isUnggulan?: boolean;
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

// Lomba / Kompetisi
export interface LombaAchievement extends BaseAchievement {
  category: 'lomba';
  namaLomba: string;
  penyelenggara: string;
  tingkat: 'lokal' | 'regional' | 'nasional' | 'internasional';
  peran: 'peserta' | 'juara';
  peringkat?: string; // e.g., Juara 1, Finalis
  bidang?: string;
  tahun: number;
  deskripsi?: string;
}

// Seminar
export interface SeminarAchievement extends BaseAchievement {
  category: 'seminar';
  namaSeminar: string;
  penyelenggara: string;
  peran: 'peserta' | 'pembicara';
  mode: 'online' | 'offline';
  tahun: number;
  deskripsi?: string;
}

// Karya Ilmiah & Publikasi
export interface PublikasiAchievement extends BaseAchievement {
  category: 'publikasi';
  jenisPublikasi: 'artikel_jurnal' | 'prosiding' | 'buku' | 'book_chapter' | 'lainnya';
  judul: string;
  penulis: string; // Comma separated
  peranPenulis?: string;
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

// Portofolio Praktikum Kelas
export interface PortofolioAchievement extends BaseAchievement {
  category: 'portofolio';
  mataKuliah: string;
  judulProyek: string;
  deskripsiProyek: string;
  output?: string; // link / dokumen / video
  tahun: number;
  semester: 'ganjil' | 'genap';
  nilai?: string;
  urlProyek?: string;
}

// Pengalaman Wirausaha
export interface WirausahaAchievement extends BaseAchievement {
  category: 'wirausaha';
  namaUsaha: string;
  jenisUsaha: string;
  peran?: string;
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
  jenisProgram: 'pertukaran_mahasiswa' | 'beasiswa' | 'volunteer' | 'pelatihan' | 'lainnya';
  namaProgram: string;
  penyelenggara: string;
  peranMahasiswa?: string;
  lokasi?: string;
  negara?: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
  sedangBerjalan: boolean;
  output?: string;
  deskripsi?: string;
}

// Organisasi & Kepemimpinan
export interface OrganisasiAchievement extends BaseAchievement {
  category: 'organisasi';
  namaOrganisasi: string;
  jabatan: string;
  periodeMulai: string;
  periodeSelesai?: string;
  masihAktif: boolean;
  deskripsi?: string;
}

// Union type for all achievements
export type Achievement = 
  | LombaAchievement
  | SeminarAchievement
  | PublikasiAchievement
  | HakiAchievement
  | MagangAchievement
  | PortofolioAchievement
  | WirausahaAchievement
  | PengembanganAchievement
  | OrganisasiAchievement;

// Category metadata for UI
export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, { label: string; icon: string; color: string }> = {
  lomba: { label: 'Lomba', icon: 'Trophy', color: 'text-warning' },
  seminar: { label: 'Seminar', icon: 'Mic', color: 'text-purple-500' },
  publikasi: { label: 'Karya Ilmiah & Publikasi', icon: 'BookOpen', color: 'text-primary' },
  haki: { label: 'Kekayaan Intelektual', icon: 'Shield', color: 'text-success' },
  magang: { label: 'Pengalaman Magang', icon: 'Briefcase', color: 'text-info' },
  portofolio: { label: 'Portofolio Praktikum Kelas', icon: 'FolderOpen', color: 'text-orange-500' },
  wirausaha: { label: 'Pengalaman Wirausaha', icon: 'Rocket', color: 'text-destructive' },
  pengembangan: { label: 'Program Pengembangan Diri', icon: 'Sprout', color: 'text-emerald-500' },
  organisasi: { label: 'Organisasi & Kepemimpinan', icon: 'Users', color: 'text-sky-500' },
};

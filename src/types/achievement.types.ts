// Achievement Types for Non-Academic Achievements Module

// REVISED CATEGORIES (per spec)
// ⭐ Semua Prestasi (all) - UI only
// 🏆 Partisipasi & Prestasi (partisipasi) - covers lomba, seminar, kegiatan
// 📘 Karya Ilmiah & Publikasi (publikasi)
// 🛡️ Kekayaan Intelektual (haki)
// 🧪 Pengalaman Akademik Terapan (akademik_terapan) - covers magang, portofolio
// 🚀 Pengalaman Wirausaha (wirausaha)
// 🌍 Pengembangan Diri (pengembangan) - covers organisasi, volunteer, etc.

export type AchievementCategory = 
  | 'partisipasi'    // Partisipasi & Prestasi (lomba, seminar, kegiatan)
  | 'publikasi'      // Karya Ilmiah & Publikasi
  | 'haki'           // Kekayaan Intelektual
  | 'akademik_terapan' // Pengalaman Akademik Terapan (magang, portofolio)
  | 'wirausaha'      // Pengalaman Wirausaha
  | 'pengembangan';  // Pengembangan Diri (organisasi, volunteer, etc.)

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

// =====================================
// Partisipasi & Prestasi (lomba, seminar, kegiatan)
// =====================================
export interface PartisipasiAchievement extends BaseAchievement {
  category: 'partisipasi';
  jenisKegiatan: 'lomba' | 'seminar' | 'workshop' | 'pelatihan' | 'konferensi' | 'lainnya';
  namaKegiatan: string;
  penyelenggara: string;
  tingkat: 'lokal' | 'regional' | 'nasional' | 'internasional';
  peran: 'peserta' | 'juara' | 'pembicara' | 'panitia';
  peringkat?: string; // e.g., Juara 1, Finalis
  mode?: 'online' | 'offline' | 'hybrid';
  tahun: number;
  deskripsi?: string;
}

// =====================================
// Karya Ilmiah & Publikasi
// =====================================
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

// =====================================
// Kekayaan Intelektual (HAKI)
// =====================================
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

// =====================================
// Pengalaman Akademik Terapan (magang, portofolio praktikum)
// =====================================
export interface AkademikTerapanAchievement extends BaseAchievement {
  category: 'akademik_terapan';
  jenisAkademik: 'magang' | 'portofolio_kelas' | 'proyek_akhir' | 'penelitian';
  
  // For magang
  namaPerusahaan?: string;
  posisi?: string;
  lokasi?: string;
  industri?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  sedangBerjalan?: boolean;
  deskripsiTugas?: string;
  skillDiperoleh?: string[];
  
  // For portofolio
  mataKuliah?: string;
  mataKuliahLainnya?: string; // Custom mata kuliah if "Lainnya" selected
  judulProyek?: string;
  deskripsiProyek?: string;
  output?: string;
  tahun: number;
  semester?: 'ganjil' | 'genap';
  nilai?: string;
  urlProyek?: string;
}

// =====================================
// Pengalaman Wirausaha
// =====================================
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

// =====================================
// Pengembangan Diri (organisasi, volunteer, program)
// =====================================
export interface PengembanganAchievement extends BaseAchievement {
  category: 'pengembangan';
  jenisProgram: 'organisasi' | 'pertukaran_mahasiswa' | 'beasiswa' | 'volunteer' | 'pelatihan' | 'lainnya';
  namaProgram: string;
  penyelenggara?: string;
  peranMahasiswa?: string;
  lokasi?: string;
  negara?: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
  sedangBerjalan: boolean;
  output?: string;
  deskripsi?: string;
  
  // For organisasi type
  jenisOrganisasi?: 'kampus' | 'luar_kampus'; // Organisasi Kampus vs Luar Kampus
  namaOrganisasi?: string;
  jabatan?: string;
}

// Union type for all achievements
export type Achievement = 
  | PartisipasiAchievement
  | PublikasiAchievement
  | HakiAchievement
  | AkademikTerapanAchievement
  | WirausahaAchievement
  | PengembanganAchievement;

// Category metadata for UI
export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, { label: string; icon: string; color: string }> = {
  partisipasi: { label: 'Partisipasi & Prestasi', icon: 'Trophy', color: 'text-warning' },
  publikasi: { label: 'Karya Ilmiah & Publikasi', icon: 'BookOpen', color: 'text-primary' },
  haki: { label: 'Kekayaan Intelektual', icon: 'Shield', color: 'text-success' },
  akademik_terapan: { label: 'Pengalaman Akademik Terapan', icon: 'FlaskConical', color: 'text-info' },
  wirausaha: { label: 'Pengalaman Wirausaha', icon: 'Rocket', color: 'text-destructive' },
  pengembangan: { label: 'Pengembangan Diri', icon: 'Globe', color: 'text-emerald-500' },
};

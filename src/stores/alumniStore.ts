import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AlumniStatus = 'working' | 'searching' | 'entrepreneur' | 'studying';

export interface MasterAlumni {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
  prodi: string;
  tahunLulus: number;
}

export interface WorkingData {
  namaPerusahaan: string;
  lokasiPerusahaan: string;
  bidangIndustri: string;
  jabatan: string;
  tahunMulai: number;
  kontakProfesional?: string;
}

export interface SearchingData {
  lokasiTujuan: string;
  bidangPekerjaan: string;
  lamaMencari: number;
}

export interface EntrepreneurData {
  namaUsaha: string;
  jenisUsaha: string;
  lokasiUsaha: string;
  tahunMulai: number;
  memilikiKaryawan: boolean;
  jumlahKaryawan?: number;
  usahaAktif: boolean;
  socialMedia: string[];
}

export interface StudyingData {
  namaKampus: string;
  programStudi: string;
  jenjang: 'S1' | 'S2' | 'S3';
  lokasiKampus: string;
  tahunMulai: number;
}

export interface AlumniSubmission {
  id: string;
  alumniId: string;
  status: AlumniStatus;
  workingData?: WorkingData;
  searchingData?: SearchingData;
  entrepreneurData?: EntrepreneurData;
  studyingData?: StudyingData;
  email: string;
  noHp: string;
  mediaSosial?: string;
  linkedin?: string;
  bersediaDihubungi: boolean;
  saran?: string;
  submittedAt: string;
  tahun: number;
}

export interface AlumniState {
  masterData: MasterAlumni[];
  submissions: AlumniSubmission[];
  currentAlumni: MasterAlumni | null;
  isValidated: boolean;
  
  // Actions
  setCurrentAlumni: (alumni: MasterAlumni) => void;
  clearCurrentAlumni: () => void;
  addSubmission: (submission: Omit<AlumniSubmission, 'id' | 'submittedAt'>) => void;
  getAlumniSubmissions: (alumniId: string) => AlumniSubmission[];
  searchMasterData: (nama: string, tahunLulus: number) => MasterAlumni[];
}

// Dummy master data
const dummyMasterData: MasterAlumni[] = [
  { id: '1', nama: 'Ahmad Rizki Pratama', nim: '20190101001', jurusan: 'Teknik Elektro', prodi: 'D3 Teknik Listrik', tahunLulus: 2022 },
  { id: '2', nama: 'Siti Nurhaliza', nim: '20190102001', jurusan: 'Akuntansi', prodi: 'D3 Akuntansi', tahunLulus: 2022 },
  { id: '3', nama: 'Budi Santoso', nim: '20180101002', jurusan: 'Teknik Elektro', prodi: 'D4 Teknik Telekomunikasi', tahunLulus: 2022 },
  { id: '4', nama: 'Dewi Kusuma', nim: '20190103001', jurusan: 'Teknik Sipil', prodi: 'D3 Teknik Sipil', tahunLulus: 2022 },
  { id: '5', nama: 'Eko Prasetyo', nim: '20180102002', jurusan: 'Akuntansi', prodi: 'D4 Akuntansi Manajerial', tahunLulus: 2022 },
  { id: '6', nama: 'Fajar Hidayat', nim: '20200101001', jurusan: 'Teknik Mesin', prodi: 'D3 Teknik Mesin', tahunLulus: 2023 },
  { id: '7', nama: 'Gita Permata', nim: '20200102001', jurusan: 'Teknik Elektro', prodi: 'D3 Teknik Elektronika', tahunLulus: 2023 },
  { id: '8', nama: 'Hendra Wijaya', nim: '20190104001', jurusan: 'Teknik Sipil', prodi: 'D4 Teknik Perancangan Jalan dan Jembatan', tahunLulus: 2023 },
  { id: '9', nama: 'Indah Permatasari', nim: '20200103001', jurusan: 'Administrasi Bisnis', prodi: 'D3 Administrasi Bisnis', tahunLulus: 2023 },
  { id: '10', nama: 'Joko Widodo', nim: '20190105001', jurusan: 'Teknik Mesin', prodi: 'D4 Teknik Mesin Produksi dan Perawatan', tahunLulus: 2023 },
  { id: '11', nama: 'Kartika Sari', nim: '20210101001', jurusan: 'Teknik Elektro', prodi: 'D3 Teknik Listrik', tahunLulus: 2024 },
  { id: '12', nama: 'Lukman Hakim', nim: '20210102001', jurusan: 'Akuntansi', prodi: 'D3 Akuntansi', tahunLulus: 2024 },
  { id: '13', nama: 'Maya Angelina', nim: '20200104001', jurusan: 'Administrasi Bisnis', prodi: 'D4 Manajemen Bisnis Internasional', tahunLulus: 2024 },
  { id: '14', nama: 'Nanda Putra', nim: '20210103001', jurusan: 'Teknik Sipil', prodi: 'D3 Teknik Sipil', tahunLulus: 2024 },
  { id: '15', nama: 'Oscar Ramadhan', nim: '20210104001', jurusan: 'Teknik Mesin', prodi: 'D3 Teknik Mesin', tahunLulus: 2024 },
];

// Dummy submissions
const dummySubmissions: AlumniSubmission[] = [
  {
    id: 'sub1',
    alumniId: '1',
    status: 'working',
    workingData: {
      namaPerusahaan: 'PT PLN Persero',
      lokasiPerusahaan: 'Jakarta',
      bidangIndustri: 'Energi & Utilitas',
      jabatan: 'Junior Engineer',
      tahunMulai: 2022,
    },
    email: 'ahmad.rizki@email.com',
    noHp: '081234567890',
    linkedin: 'linkedin.com/in/ahmadrizki',
    bersediaDihubungi: true,
    submittedAt: '2024-03-15',
    tahun: 2024,
  },
  {
    id: 'sub2',
    alumniId: '2',
    status: 'working',
    workingData: {
      namaPerusahaan: 'Deloitte Indonesia',
      lokasiPerusahaan: 'Jakarta',
      bidangIndustri: 'Konsultan & Audit',
      jabatan: 'Junior Auditor',
      tahunMulai: 2022,
    },
    email: 'siti.nurhaliza@email.com',
    noHp: '081234567891',
    bersediaDihubungi: true,
    submittedAt: '2024-03-16',
    tahun: 2024,
  },
  {
    id: 'sub3',
    alumniId: '6',
    status: 'entrepreneur',
    entrepreneurData: {
      namaUsaha: 'Bengkel Fajar Motor',
      jenisUsaha: 'Jasa Perbaikan Kendaraan',
      lokasiUsaha: 'Semarang',
      tahunMulai: 2023,
      memilikiKaryawan: true,
      jumlahKaryawan: 3,
      usahaAktif: true,
      socialMedia: ['instagram.com/fajarmotor', 'facebook.com/fajarmotor'],
    },
    email: 'fajar.hidayat@email.com',
    noHp: '081234567892',
    bersediaDihubungi: true,
    submittedAt: '2024-04-10',
    tahun: 2024,
  },
  {
    id: 'sub4',
    alumniId: '7',
    status: 'studying',
    studyingData: {
      namaKampus: 'Institut Teknologi Bandung',
      programStudi: 'Teknik Elektro',
      jenjang: 'S1',
      lokasiKampus: 'Bandung',
      tahunMulai: 2023,
    },
    email: 'gita.permata@email.com',
    noHp: '081234567893',
    bersediaDihubungi: true,
    submittedAt: '2024-04-12',
    tahun: 2024,
  },
  {
    id: 'sub5',
    alumniId: '9',
    status: 'searching',
    searchingData: {
      lokasiTujuan: 'Jakarta, Semarang',
      bidangPekerjaan: 'Marketing & Sales',
      lamaMencari: 3,
    },
    email: 'indah.permata@email.com',
    noHp: '081234567894',
    bersediaDihubungi: true,
    saran: 'Mohon diperbanyak informasi lowongan kerja dari kampus',
    submittedAt: '2024-05-01',
    tahun: 2024,
  },
];

export const useAlumniStore = create<AlumniState>()(
  persist(
    (set, get) => ({
      masterData: dummyMasterData,
      submissions: dummySubmissions,
      currentAlumni: null,
      isValidated: false,

      setCurrentAlumni: (alumni) => set({ currentAlumni: alumni, isValidated: true }),
      
      clearCurrentAlumni: () => set({ currentAlumni: null, isValidated: false }),
      
      addSubmission: (submission) => {
        const newSubmission: AlumniSubmission = {
          ...submission,
          id: `sub${Date.now()}`,
          submittedAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }));
      },
      
      getAlumniSubmissions: (alumniId) => {
        return get().submissions.filter((s) => s.alumniId === alumniId);
      },
      
      searchMasterData: (nama, tahunLulus) => {
        const normalizedName = nama.toLowerCase().trim();
        return get().masterData.filter(
          (alumni) =>
            alumni.nama.toLowerCase().includes(normalizedName) &&
            alumni.tahunLulus === tahunLulus
        );
      },
    }),
    {
      name: 'sipal-alumni-storage',
    }
  )
);

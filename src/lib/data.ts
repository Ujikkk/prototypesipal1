// Master data alumni untuk validasi
export interface AlumniMaster {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
  prodi: string;
  tahunLulus: number;
}

export const alumniMasterData: AlumniMaster[] = [
  { id: "1", nama: "Ahmad Rizki Pratama", nim: "20190001", jurusan: "Teknik Elektro", prodi: "D3 Teknik Elektronika", tahunLulus: 2022 },
  { id: "2", nama: "Siti Nurhaliza", nim: "20190002", jurusan: "Teknik Elektro", prodi: "D3 Teknik Telekomunikasi", tahunLulus: 2022 },
  { id: "3", nama: "Budi Santoso", nim: "20190003", jurusan: "Teknik Sipil", prodi: "D3 Teknik Konstruksi Gedung", tahunLulus: 2022 },
  { id: "4", nama: "Dewi Lestari", nim: "20190004", jurusan: "Akuntansi", prodi: "D3 Akuntansi", tahunLulus: 2022 },
  { id: "5", nama: "Eko Prasetyo", nim: "20190005", jurusan: "Administrasi Bisnis", prodi: "D3 Administrasi Bisnis", tahunLulus: 2022 },
  { id: "6", nama: "Fitri Handayani", nim: "20180001", jurusan: "Teknik Mesin", prodi: "D3 Teknik Mesin", tahunLulus: 2021 },
  { id: "7", nama: "Gunawan Wibowo", nim: "20180002", jurusan: "Teknik Elektro", prodi: "D4 Teknik Elektronika", tahunLulus: 2022 },
  { id: "8", nama: "Hana Safira", nim: "20180003", jurusan: "Akuntansi", prodi: "D4 Akuntansi Manajerial", tahunLulus: 2022 },
  { id: "9", nama: "Irfan Maulana", nim: "20200001", jurusan: "Teknik Elektro", prodi: "D3 Teknik Komputer", tahunLulus: 2023 },
  { id: "10", nama: "Jasmine Putri", nim: "20200002", jurusan: "Administrasi Bisnis", prodi: "D4 Manajemen Bisnis", tahunLulus: 2024 },
  { id: "11", nama: "Kevin Wijaya", nim: "20170001", jurusan: "Teknik Mesin", prodi: "D4 Teknik Mesin Produksi", tahunLulus: 2021 },
  { id: "12", nama: "Linda Kusuma", nim: "20170002", jurusan: "Teknik Sipil", prodi: "D4 Teknik Perancangan Jalan", tahunLulus: 2021 },
  { id: "13", nama: "Muhammad Farhan", nim: "20210001", jurusan: "Teknik Elektro", prodi: "D3 Teknik Elektronika", tahunLulus: 2024 },
  { id: "14", nama: "Nadia Rahmawati", nim: "20210002", jurusan: "Akuntansi", prodi: "D3 Akuntansi", tahunLulus: 2024 },
  { id: "15", nama: "Oscar Tan", nim: "20160001", jurusan: "Teknik Mesin", prodi: "D3 Teknik Mesin", tahunLulus: 2019 },
  { id: "16", nama: "Putri Ayu", nim: "20160002", jurusan: "Administrasi Bisnis", prodi: "D3 Administrasi Bisnis", tahunLulus: 2019 },
  { id: "17", nama: "Qori Fadillah", nim: "20220001", jurusan: "Teknik Elektro", prodi: "D3 Teknik Telekomunikasi", tahunLulus: 2025 },
  { id: "18", nama: "Rendi Saputra", nim: "20220002", jurusan: "Teknik Sipil", prodi: "D3 Teknik Konstruksi Gedung", tahunLulus: 2025 },
];

// Data alumni yang sudah mengisi form
export interface AlumniData {
  id: string;
  alumniMasterId: string;
  status: 'bekerja' | 'mencari' | 'wirausaha' | 'studi';
  tahunPengisian: number;
  
  // Data Bekerja
  namaPerusahaan?: string;
  lokasiPerusahaan?: string;
  bidangIndustri?: string;
  jabatan?: string;
  tahunMulaiKerja?: number;
  kontakProfesional?: string;
  
  // Data Mencari Kerja
  lokasiTujuan?: string;
  bidangDiincar?: string;
  lamaMencari?: number;
  
  // Data Wirausaha
  namaUsaha?: string;
  jenisUsaha?: string;
  lokasiUsaha?: string;
  tahunMulaiUsaha?: number;
  punyaKaryawan?: boolean;
  jumlahKaryawan?: number;
  usahaAktif?: boolean;
  sosialMediaUsaha?: string[];
  
  // Data Studi
  namaKampus?: string;
  programStudi?: string;
  jenjang?: 'S1' | 'S2' | 'S3';
  lokasiKampus?: string;
  tahunMulaiStudi?: number;
  
  // Kontak
  email: string;
  noHp: string;
  mediaSosial?: string;
  linkedin?: string;
  
  // Tambahan
  bersediaDihubungi?: boolean;
  saranKomentar?: string;
  
  createdAt: Date;
}

export const alumniFilledData: AlumniData[] = [
  {
    id: "f1",
    alumniMasterId: "1",
    status: "bekerja",
    tahunPengisian: 2024,
    namaPerusahaan: "PT Telkom Indonesia",
    lokasiPerusahaan: "Jakarta",
    bidangIndustri: "Telekomunikasi",
    jabatan: "Network Engineer",
    tahunMulaiKerja: 2022,
    email: "ahmad.rizki@gmail.com",
    noHp: "081234567890",
    linkedin: "linkedin.com/in/ahmadrizki",
    bersediaDihubungi: true,
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "f2",
    alumniMasterId: "2",
    status: "wirausaha",
    tahunPengisian: 2024,
    namaUsaha: "Siti Catering",
    jenisUsaha: "Kuliner",
    lokasiUsaha: "Semarang",
    tahunMulaiUsaha: 2023,
    punyaKaryawan: true,
    jumlahKaryawan: 5,
    usahaAktif: true,
    sosialMediaUsaha: ["@siticatering", "fb.com/siticatering"],
    email: "siti.nurhaliza@gmail.com",
    noHp: "081234567891",
    bersediaDihubungi: true,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "f3",
    alumniMasterId: "4",
    status: "studi",
    tahunPengisian: 2024,
    namaKampus: "Universitas Diponegoro",
    programStudi: "Akuntansi",
    jenjang: "S1",
    lokasiKampus: "Semarang",
    tahunMulaiStudi: 2023,
    email: "dewi.lestari@gmail.com",
    noHp: "081234567892",
    bersediaDihubungi: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "f4",
    alumniMasterId: "6",
    status: "bekerja",
    tahunPengisian: 2024,
    namaPerusahaan: "PT Astra Honda Motor",
    lokasiPerusahaan: "Jakarta",
    bidangIndustri: "Manufaktur Otomotif",
    jabatan: "Production Supervisor",
    tahunMulaiKerja: 2021,
    email: "fitri.handayani@gmail.com",
    noHp: "081234567893",
    bersediaDihubungi: true,
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "f5",
    alumniMasterId: "9",
    status: "mencari",
    tahunPengisian: 2024,
    lokasiTujuan: "Semarang, Yogyakarta",
    bidangDiincar: "IT Support / System Administrator",
    lamaMencari: 3,
    email: "irfan.maulana@gmail.com",
    noHp: "081234567894",
    bersediaDihubungi: true,
    createdAt: new Date("2024-05-12"),
  },
  {
    id: "f6",
    alumniMasterId: "11",
    status: "bekerja",
    tahunPengisian: 2024,
    namaPerusahaan: "PT Komatsu Indonesia",
    lokasiPerusahaan: "Jakarta",
    bidangIndustri: "Heavy Equipment",
    jabatan: "Mechanical Engineer",
    tahunMulaiKerja: 2022,
    email: "kevin.wijaya@gmail.com",
    noHp: "081234567895",
    linkedin: "linkedin.com/in/kevinwijaya",
    bersediaDihubungi: true,
    createdAt: new Date("2024-03-22"),
  },
  {
    id: "f7",
    alumniMasterId: "3",
    status: "bekerja",
    tahunPengisian: 2024,
    namaPerusahaan: "PT Waskita Karya",
    lokasiPerusahaan: "Semarang",
    bidangIndustri: "Konstruksi",
    jabatan: "Site Engineer",
    tahunMulaiKerja: 2023,
    email: "budi.santoso@gmail.com",
    noHp: "081234567896",
    bersediaDihubungi: true,
    createdAt: new Date("2024-02-28"),
  },
  {
    id: "f8",
    alumniMasterId: "5",
    status: "wirausaha",
    tahunPengisian: 2024,
    namaUsaha: "Eko Digital Marketing",
    jenisUsaha: "Jasa Digital Marketing",
    lokasiUsaha: "Semarang",
    tahunMulaiUsaha: 2022,
    punyaKaryawan: true,
    jumlahKaryawan: 3,
    usahaAktif: true,
    sosialMediaUsaha: ["@ekodigital", "ekodigital.id"],
    email: "eko.prasetyo@gmail.com",
    noHp: "081234567897",
    linkedin: "linkedin.com/in/ekoprasetyo",
    bersediaDihubungi: true,
    createdAt: new Date("2024-04-18"),
  },
];

export const jurusanList = [
  "Teknik Elektro",
  "Teknik Mesin",
  "Teknik Sipil",
  "Akuntansi",
  "Administrasi Bisnis",
];

export const prodiList: Record<string, string[]> = {
  "Teknik Elektro": ["D3 Teknik Elektronika", "D3 Teknik Telekomunikasi", "D3 Teknik Komputer", "D4 Teknik Elektronika"],
  "Teknik Mesin": ["D3 Teknik Mesin", "D4 Teknik Mesin Produksi"],
  "Teknik Sipil": ["D3 Teknik Konstruksi Gedung", "D4 Teknik Perancangan Jalan"],
  "Akuntansi": ["D3 Akuntansi", "D4 Akuntansi Manajerial"],
  "Administrasi Bisnis": ["D3 Administrasi Bisnis", "D4 Manajemen Bisnis"],
};

export const tahunLulusList = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const bidangIndustriList = [
  "Telekomunikasi",
  "Manufaktur",
  "Manufaktur Otomotif",
  "Konstruksi",
  "Perbankan & Keuangan",
  "IT & Software",
  "E-Commerce",
  "Heavy Equipment",
  "BUMN",
  "Startup",
  "Lainnya",
];

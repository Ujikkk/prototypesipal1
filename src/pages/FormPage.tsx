import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAlumni } from '@/contexts/AlumniContext';
import { AlumniData, bidangIndustriList } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { 
  Briefcase, Search, Rocket, BookOpen, 
  ChevronRight, ChevronLeft, Check, Plus, X,
  Building2, MapPin, Mail, Phone, Linkedin, Instagram
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

type Status = 'bekerja' | 'mencari' | 'wirausaha' | 'studi';

const statusOptions = [
  { value: 'bekerja', label: 'Bekerja', icon: Briefcase, color: 'status-bekerja', bgColor: 'bg-primary/10' },
  { value: 'mencari', label: 'Mencari Kerja', icon: Search, color: 'status-mencari', bgColor: 'bg-warning/10' },
  { value: 'wirausaha', label: 'Wirausaha', icon: Rocket, color: 'status-wirausaha', bgColor: 'bg-success/10' },
  { value: 'studi', label: 'Melanjutkan Studi', icon: BookOpen, color: 'status-studi', bgColor: 'bg-destructive/10' },
];

export default function FormPage() {
  const navigate = useNavigate();
  const { selectedAlumni, addAlumniData } = useAlumni();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<Status | null>(null);
  
  // Form fields
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [lokasiPerusahaan, setLokasiPerusahaan] = useState('');
  const [bidangIndustri, setBidangIndustri] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [tahunMulaiKerja, setTahunMulaiKerja] = useState('');
  const [kontakProfesional, setKontakProfesional] = useState('');

  const [lokasiTujuan, setLokasiTujuan] = useState('');
  const [bidangDiincar, setBidangDiincar] = useState('');
  const [lamaMencari, setLamaMencari] = useState('');

  const [namaUsaha, setNamaUsaha] = useState('');
  const [jenisUsaha, setJenisUsaha] = useState('');
  const [lokasiUsaha, setLokasiUsaha] = useState('');
  const [tahunMulaiUsaha, setTahunMulaiUsaha] = useState('');
  const [punyaKaryawan, setPunyaKaryawan] = useState(false);
  const [jumlahKaryawan, setJumlahKaryawan] = useState('');
  const [usahaAktif, setUsahaAktif] = useState(true);
  const [sosialMediaUsaha, setSosialMediaUsaha] = useState<string[]>(['']);

  const [namaKampus, setNamaKampus] = useState('');
  const [programStudi, setProgramStudi] = useState('');
  const [jenjang, setJenjang] = useState<'S1' | 'S2' | 'S3' | ''>('');
  const [lokasiKampus, setLokasiKampus] = useState('');
  const [tahunMulaiStudi, setTahunMulaiStudi] = useState('');

  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [mediaSosial, setMediaSosial] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [bersediaDihubungi, setBersediaDihubungi] = useState(true);
  const [saranKomentar, setSaranKomentar] = useState('');

  useEffect(() => {
    if (!selectedAlumni) {
      navigate('/validasi');
    }
  }, [selectedAlumni, navigate]);

  if (!selectedAlumni) return null;

  const totalSteps = 4;

  const handleAddSocialMedia = () => {
    setSosialMediaUsaha([...sosialMediaUsaha, '']);
  };

  const handleRemoveSocialMedia = (index: number) => {
    setSosialMediaUsaha(sosialMediaUsaha.filter((_, i) => i !== index));
  };

  const handleSocialMediaChange = (index: number, value: string) => {
    const updated = [...sosialMediaUsaha];
    updated[index] = value;
    setSosialMediaUsaha(updated);
  };

  const handleNext = () => {
    if (currentStep === 1 && !status) {
      toast({ title: 'Pilih status Anda', variant: 'destructive' });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!email || !noHp) {
      toast({ title: 'Email dan No. HP wajib diisi', variant: 'destructive' });
      return;
    }

    const newData: AlumniData = {
      id: `f${Date.now()}`,
      alumniMasterId: selectedAlumni.id,
      status: status!,
      tahunPengisian: new Date().getFullYear(),
      email,
      noHp,
      mediaSosial: mediaSosial || undefined,
      linkedin: linkedin || undefined,
      bersediaDihubungi,
      saranKomentar: saranKomentar || undefined,
      createdAt: new Date(),
    };

    if (status === 'bekerja') {
      newData.namaPerusahaan = namaPerusahaan;
      newData.lokasiPerusahaan = lokasiPerusahaan;
      newData.bidangIndustri = bidangIndustri;
      newData.jabatan = jabatan;
      newData.tahunMulaiKerja = parseInt(tahunMulaiKerja);
      newData.kontakProfesional = kontakProfesional || undefined;
    }

    if (status === 'mencari') {
      newData.lokasiTujuan = lokasiTujuan;
      newData.bidangDiincar = bidangDiincar;
      newData.lamaMencari = parseInt(lamaMencari);
    }

    if (status === 'wirausaha') {
      newData.namaUsaha = namaUsaha;
      newData.jenisUsaha = jenisUsaha;
      newData.lokasiUsaha = lokasiUsaha;
      newData.tahunMulaiUsaha = parseInt(tahunMulaiUsaha);
      newData.punyaKaryawan = punyaKaryawan;
      newData.jumlahKaryawan = punyaKaryawan ? parseInt(jumlahKaryawan) : undefined;
      newData.usahaAktif = usahaAktif;
      newData.sosialMediaUsaha = sosialMediaUsaha.filter(s => s.trim());
    }

    if (status === 'studi') {
      newData.namaKampus = namaKampus;
      newData.programStudi = programStudi;
      newData.jenjang = jenjang as 'S1' | 'S2' | 'S3';
      newData.lokasiKampus = lokasiKampus;
      newData.tahunMulaiStudi = parseInt(tahunMulaiStudi);
    }

    addAlumniData(newData);
    toast({
      title: 'Data berhasil disimpan!',
      description: 'Terima kasih telah mengisi form status alumni.',
    });
    navigate('/dashboard');
  };

  const renderStatusSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Apa status Anda saat ini?
        </h2>
        <p className="text-muted-foreground">
          Pilih salah satu status yang paling sesuai dengan kondisi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statusOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => setStatus(option.value as Status)}
            className={cn(
              "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200",
              status === option.value
                ? `border-primary ${option.bgColor} shadow-elevated`
                : "border-border hover:border-primary/30 bg-card"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                option.bgColor
              )}>
                <option.icon className={cn("w-7 h-7", option.color.replace('status-', 'text-').replace('bekerja', 'primary').replace('mencari', 'warning').replace('wirausaha', 'success').replace('studi', 'destructive'))} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{option.label}</h3>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                status === option.value ? "border-primary bg-primary" : "border-border"
              )}>
                {status === option.value && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatusForm = () => {
    if (status === 'bekerja') {
      return (
        <div className="space-y-5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Detail Pekerjaan</h2>
            <p className="text-muted-foreground">Lengkapi informasi pekerjaan Anda saat ini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label className="mb-2 block">Nama Perusahaan *</Label>
              <Input
                placeholder="Contoh: PT Telkom Indonesia"
                value={namaPerusahaan}
                onChange={(e) => setNamaPerusahaan(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Lokasi Perusahaan *</Label>
              <Input
                placeholder="Contoh: Jakarta"
                value={lokasiPerusahaan}
                onChange={(e) => setLokasiPerusahaan(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Bidang Industri *</Label>
              <Select value={bidangIndustri} onValueChange={setBidangIndustri}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Pilih bidang industri" />
                </SelectTrigger>
                <SelectContent>
                  {bidangIndustriList.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Jabatan/Posisi *</Label>
              <Input
                placeholder="Contoh: Network Engineer"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Tahun Mulai Bekerja *</Label>
              <Input
                type="number"
                placeholder="2023"
                value={tahunMulaiKerja}
                onChange={(e) => setTahunMulaiKerja(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-2 block">Kontak Profesional (Opsional)</Label>
              <Input
                placeholder="Email atau nomor kantor"
                value={kontakProfesional}
                onChange={(e) => setKontakProfesional(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>
      );
    }

    if (status === 'mencari') {
      return (
        <div className="space-y-5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-warning/10 mb-4">
              <Search className="w-7 h-7 text-warning" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Mencari Kerja</h2>
            <p className="text-muted-foreground">Bantu kami memahami preferensi pekerjaan Anda.</p>
          </div>

          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Lokasi yang Dituju *</Label>
              <Input
                placeholder="Contoh: Semarang, Jakarta, Yogyakarta"
                value={lokasiTujuan}
                onChange={(e) => setLokasiTujuan(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Bidang Pekerjaan yang Diincar *</Label>
              <Input
                placeholder="Contoh: IT Support, Marketing, Keuangan"
                value={bidangDiincar}
                onChange={(e) => setBidangDiincar(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Sudah Berapa Bulan Mencari? *</Label>
              <Input
                type="number"
                placeholder="Contoh: 3"
                value={lamaMencari}
                onChange={(e) => setLamaMencari(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>
      );
    }

    if (status === 'wirausaha') {
      return (
        <div className="space-y-5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-success/10 mb-4">
              <Rocket className="w-7 h-7 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Detail Usaha</h2>
            <p className="text-muted-foreground">Ceritakan tentang usaha yang Anda jalankan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label className="mb-2 block">Nama Usaha *</Label>
              <Input
                placeholder="Contoh: Toko Roti Makmur"
                value={namaUsaha}
                onChange={(e) => setNamaUsaha(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Jenis Usaha *</Label>
              <Input
                placeholder="Contoh: F&B, Jasa, Retail"
                value={jenisUsaha}
                onChange={(e) => setJenisUsaha(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Lokasi Usaha *</Label>
              <Input
                placeholder="Contoh: Semarang"
                value={lokasiUsaha}
                onChange={(e) => setLokasiUsaha(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Tahun Mulai Usaha *</Label>
              <Input
                type="number"
                placeholder="2023"
                value={tahunMulaiUsaha}
                onChange={(e) => setTahunMulaiUsaha(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Status Usaha</Label>
              <div className="flex items-center gap-3 h-12">
                <Switch checked={usahaAktif} onCheckedChange={setUsahaAktif} />
                <span className="text-sm text-muted-foreground">
                  {usahaAktif ? 'Usaha Aktif' : 'Usaha Tidak Aktif'}
                </span>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Memiliki Karyawan?</Label>
              <div className="flex items-center gap-3 h-12">
                <Switch checked={punyaKaryawan} onCheckedChange={setPunyaKaryawan} />
                <span className="text-sm text-muted-foreground">
                  {punyaKaryawan ? 'Ya' : 'Tidak'}
                </span>
              </div>
            </div>
            {punyaKaryawan && (
              <div>
                <Label className="mb-2 block">Jumlah Karyawan *</Label>
                <Input
                  type="number"
                  placeholder="Contoh: 5"
                  value={jumlahKaryawan}
                  onChange={(e) => setJumlahKaryawan(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <Label className="mb-2 block">Sosial Media Usaha</Label>
              <div className="space-y-3">
                {sosialMediaUsaha.map((social, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="@username atau url"
                      value={social}
                      onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                      className="h-12 rounded-xl flex-1"
                    />
                    {sosialMediaUsaha.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveSocialMedia(index)}
                        className="h-12 w-12 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSocialMedia}
                  className="w-full h-10 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Sosial Media
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (status === 'studi') {
      return (
        <div className="space-y-5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-destructive/10 mb-4">
              <BookOpen className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Detail Studi Lanjut</h2>
            <p className="text-muted-foreground">Ceritakan tentang pendidikan lanjutan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label className="mb-2 block">Nama Kampus *</Label>
              <Input
                placeholder="Contoh: Universitas Diponegoro"
                value={namaKampus}
                onChange={(e) => setNamaKampus(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Program Studi *</Label>
              <Input
                placeholder="Contoh: Teknik Informatika"
                value={programStudi}
                onChange={(e) => setProgramStudi(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Jenjang *</Label>
              <Select value={jenjang} onValueChange={(v) => setJenjang(v as 'S1' | 'S2' | 'S3')}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Pilih jenjang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">S1 (Sarjana)</SelectItem>
                  <SelectItem value="S2">S2 (Magister)</SelectItem>
                  <SelectItem value="S3">S3 (Doktor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Lokasi Kampus *</Label>
              <Input
                placeholder="Contoh: Semarang"
                value={lokasiKampus}
                onChange={(e) => setLokasiKampus(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-2 block">Tahun Mulai Studi *</Label>
              <Input
                type="number"
                placeholder="2023"
                value={tahunMulaiStudi}
                onChange={(e) => setTahunMulaiStudi(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderContactForm = () => (
    <div className="space-y-5">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-info/10 mb-4">
          <Mail className="w-7 h-7 text-info" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Informasi Kontak</h2>
        <p className="text-muted-foreground">Lengkapi data kontak Anda agar dapat dihubungi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Label className="mb-2 block">Email Aktif *</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl pl-12"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            💡 Sebaiknya gunakan email yang mengandung unsur nama agar mudah diverifikasi.
          </p>
        </div>
        <div>
          <Label className="mb-2 block">Nomor HP/WhatsApp *</Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="08123456789"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="h-12 rounded-xl pl-12"
            />
          </div>
        </div>
        <div>
          <Label className="mb-2 block">Media Sosial (Opsional)</Label>
          <div className="relative">
            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="@username"
              value={mediaSosial}
              onChange={(e) => setMediaSosial(e.target.value)}
              className="h-12 rounded-xl pl-12"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Label className="mb-2 block">LinkedIn (Opsional)</Label>
          <div className="relative">
            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="linkedin.com/in/username"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="h-12 rounded-xl pl-12"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdditionalForm = () => (
    <div className="space-y-5">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
          <Check className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Informasi Tambahan</h2>
        <p className="text-muted-foreground">Langkah terakhir sebelum mengirim data.</p>
      </div>

      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-muted/50 flex items-center justify-between">
          <div>
            <Label className="font-medium">Bersedia dihubungi kampus?</Label>
            <p className="text-sm text-muted-foreground">Untuk kegiatan alumni dan informasi penting.</p>
          </div>
          <Switch checked={bersediaDihubungi} onCheckedChange={setBersediaDihubungi} />
        </div>

        <div>
          <Label className="mb-2 block">Saran/Komentar untuk Kampus (Opsional)</Label>
          <Textarea
            placeholder="Tuliskan saran, masukan, atau komentar Anda untuk kampus..."
            value={saranKomentar}
            onChange={(e) => setSaranKomentar(e.target.value)}
            className="min-h-[120px] rounded-xl resize-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                      currentStep >= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                ))}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Status</span>
                <span>Detail</span>
                <span>Kontak</span>
                <span>Selesai</span>
              </div>
            </div>

            {/* Form Content */}
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 animate-fade-in">
              {currentStep === 1 && renderStatusSelection()}
              {currentStep === 2 && renderStatusForm()}
              {currentStep === 3 && renderContactForm()}
              {currentStep === 4 && renderAdditionalForm()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1 h-12">
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Kembali
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="flex-1 h-12">
                  Lanjut
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} variant="success" className="flex-1 h-12">
                  <Check className="w-5 h-5 mr-2" />
                  Kirim Data
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

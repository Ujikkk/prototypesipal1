import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  Rocket, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  CheckCircle2,
  Plus,
  X,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAlumniStore, AlumniStatus } from '@/stores/alumniStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const statusOptions = [
  { value: 'working', label: 'Bekerja', icon: Briefcase, color: 'border-accent bg-accent/5 hover:bg-accent/10', activeColor: 'border-accent bg-accent/20' },
  { value: 'searching', label: 'Mencari Kerja', icon: Clock, color: 'border-warning bg-warning/5 hover:bg-warning/10', activeColor: 'border-warning bg-warning/20' },
  { value: 'entrepreneur', label: 'Wirausaha', icon: Rocket, color: 'border-success bg-success/5 hover:bg-success/10', activeColor: 'border-success bg-success/20' },
  { value: 'studying', label: 'Melanjutkan Studi', icon: GraduationCap, color: 'border-destructive bg-destructive/5 hover:bg-destructive/10', activeColor: 'border-destructive bg-destructive/20' },
];

type FormStep = 'status' | 'details' | 'contact' | 'additional' | 'confirm';

const stepLabels: Record<FormStep, string> = {
  status: 'Status Utama',
  details: 'Detail Status',
  contact: 'Kontak',
  additional: 'Tambahan',
  confirm: 'Konfirmasi',
};

export default function AlumniFormPage() {
  const navigate = useNavigate();
  const { currentAlumni, isValidated, addSubmission } = useAlumniStore();

  const [currentStep, setCurrentStep] = useState<FormStep>('status');
  const [status, setStatus] = useState<AlumniStatus | ''>('');
  
  // Working data
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [lokasiPerusahaan, setLokasiPerusahaan] = useState('');
  const [bidangIndustri, setBidangIndustri] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [tahunMulaiKerja, setTahunMulaiKerja] = useState('');
  const [kontakProfesional, setKontakProfesional] = useState('');

  // Searching data
  const [lokasiTujuan, setLokasiTujuan] = useState('');
  const [bidangPekerjaan, setBidangPekerjaan] = useState('');
  const [lamaMencari, setLamaMencari] = useState('');

  // Entrepreneur data
  const [namaUsaha, setNamaUsaha] = useState('');
  const [jenisUsaha, setJenisUsaha] = useState('');
  const [lokasiUsaha, setLokasiUsaha] = useState('');
  const [tahunMulaiUsaha, setTahunMulaiUsaha] = useState('');
  const [memilikiKaryawan, setMemilikiKaryawan] = useState<'ya' | 'tidak' | ''>('');
  const [jumlahKaryawan, setJumlahKaryawan] = useState('');
  const [usahaAktif, setUsahaAktif] = useState<'ya' | 'tidak' | ''>('');
  const [socialMedia, setSocialMedia] = useState<string[]>(['']);

  // Study data
  const [namaKampus, setNamaKampus] = useState('');
  const [programStudi, setProgramStudi] = useState('');
  const [jenjang, setJenjang] = useState<'S1' | 'S2' | 'S3' | ''>('');
  const [lokasiKampus, setLokasiKampus] = useState('');
  const [tahunMulaiStudi, setTahunMulaiStudi] = useState('');

  // Contact data
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [mediaSosial, setMediaSosial] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Additional data
  const [bersediaDihubungi, setBersediaDihubungi] = useState<'ya' | 'tidak' | ''>('');
  const [saran, setSaran] = useState('');

  useEffect(() => {
    if (!isValidated || !currentAlumni) {
      navigate('/validasi');
    }
  }, [isValidated, currentAlumni, navigate]);

  if (!currentAlumni) {
    return null;
  }

  const steps: FormStep[] = ['status', 'details', 'contact', 'additional', 'confirm'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const addSocialMedia = () => {
    setSocialMedia([...socialMedia, '']);
  };

  const removeSocialMedia = (index: number) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index));
  };

  const updateSocialMedia = (index: number, value: string) => {
    const updated = [...socialMedia];
    updated[index] = value;
    setSocialMedia(updated);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'status':
        return status !== '';
      case 'details':
        if (status === 'working') {
          return namaPerusahaan && lokasiPerusahaan && bidangIndustri && jabatan && tahunMulaiKerja;
        }
        if (status === 'searching') {
          return lokasiTujuan && bidangPekerjaan && lamaMencari;
        }
        if (status === 'entrepreneur') {
          return namaUsaha && jenisUsaha && lokasiUsaha && tahunMulaiUsaha && memilikiKaryawan && usahaAktif;
        }
        if (status === 'studying') {
          return namaKampus && programStudi && jenjang && lokasiKampus && tahunMulaiStudi;
        }
        return false;
      case 'contact':
        return email && noHp;
      case 'additional':
        return bersediaDihubungi !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast({
        title: 'Data belum lengkap',
        description: 'Mohon lengkapi semua field yang diperlukan.',
        variant: 'destructive',
      });
      return;
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleSubmit = () => {
    const baseSubmission = {
      alumniId: currentAlumni.id,
      status: status as AlumniStatus,
      email,
      noHp,
      mediaSosial: mediaSosial || undefined,
      linkedin: linkedin || undefined,
      bersediaDihubungi: bersediaDihubungi === 'ya',
      saran: saran || undefined,
      tahun: new Date().getFullYear(),
    };

    if (status === 'working') {
      addSubmission({
        ...baseSubmission,
        workingData: {
          namaPerusahaan,
          lokasiPerusahaan,
          bidangIndustri,
          jabatan,
          tahunMulai: Number(tahunMulaiKerja),
          kontakProfesional: kontakProfesional || undefined,
        },
      });
    } else if (status === 'searching') {
      addSubmission({
        ...baseSubmission,
        searchingData: {
          lokasiTujuan,
          bidangPekerjaan,
          lamaMencari: Number(lamaMencari),
        },
      });
    } else if (status === 'entrepreneur') {
      addSubmission({
        ...baseSubmission,
        entrepreneurData: {
          namaUsaha,
          jenisUsaha,
          lokasiUsaha,
          tahunMulai: Number(tahunMulaiUsaha),
          memilikiKaryawan: memilikiKaryawan === 'ya',
          jumlahKaryawan: memilikiKaryawan === 'ya' ? Number(jumlahKaryawan) : undefined,
          usahaAktif: usahaAktif === 'ya',
          socialMedia: socialMedia.filter(s => s.trim() !== ''),
        },
      });
    } else if (status === 'studying') {
      addSubmission({
        ...baseSubmission,
        studyingData: {
          namaKampus,
          programStudi,
          jenjang: jenjang as 'S1' | 'S2' | 'S3',
          lokasiKampus,
          tahunMulai: Number(tahunMulaiStudi),
        },
      });
    }

    toast({
      title: 'Data berhasil disimpan!',
      description: 'Terima kasih telah mengisi data status alumni.',
    });
    navigate('/dashboard');
  };

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Form Status Alumni
              </h1>
              <span className="text-sm text-muted-foreground">
                {currentStepIndex + 1} dari {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <span 
                  key={step}
                  className={`text-xs ${index <= currentStepIndex ? 'text-accent' : 'text-muted-foreground'}`}
                >
                  {stepLabels[step]}
                </span>
              ))}
            </div>
          </div>

          {/* Step: Status */}
          {currentStep === 'status' && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle>Pilih Status Utama Anda</CardTitle>
                <CardDescription>
                  Pilih status yang paling sesuai dengan kondisi Anda saat ini.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStatus(option.value as AlumniStatus)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        status === option.value ? option.activeColor : option.color
                      }`}
                    >
                      <option.icon className={`h-8 w-8 mb-3 ${
                        option.value === 'working' ? 'text-accent' :
                        option.value === 'searching' ? 'text-warning' :
                        option.value === 'entrepreneur' ? 'text-success' :
                        'text-destructive'
                      }`} />
                      <span className="font-semibold text-foreground block">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Details */}
          {currentStep === 'details' && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle>Detail {statusOptions.find(s => s.value === status)?.label}</CardTitle>
                <CardDescription>
                  Lengkapi informasi detail tentang status Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status === 'working' && (
                  <>
                    <div className="space-y-2">
                      <Label>Nama Perusahaan *</Label>
                      <Input
                        placeholder="Contoh: PT PLN Persero"
                        value={namaPerusahaan}
                        onChange={(e) => setNamaPerusahaan(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lokasi Perusahaan *</Label>
                      <Input
                        placeholder="Contoh: Jakarta"
                        value={lokasiPerusahaan}
                        onChange={(e) => setLokasiPerusahaan(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bidang Industri *</Label>
                      <Select value={bidangIndustri} onValueChange={setBidangIndustri}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bidang industri" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Teknologi Informasi">Teknologi Informasi</SelectItem>
                          <SelectItem value="Manufaktur">Manufaktur</SelectItem>
                          <SelectItem value="Energi & Utilitas">Energi & Utilitas</SelectItem>
                          <SelectItem value="Konstruksi">Konstruksi</SelectItem>
                          <SelectItem value="Perbankan & Keuangan">Perbankan & Keuangan</SelectItem>
                          <SelectItem value="Konsultan & Audit">Konsultan & Audit</SelectItem>
                          <SelectItem value="Retail & E-commerce">Retail & E-commerce</SelectItem>
                          <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                          <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                          <SelectItem value="Pemerintahan">Pemerintahan</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Jabatan/Posisi *</Label>
                      <Input
                        placeholder="Contoh: Junior Engineer"
                        value={jabatan}
                        onChange={(e) => setJabatan(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Mulai Bekerja *</Label>
                      <Input
                        type="number"
                        placeholder="Contoh: 2023"
                        value={tahunMulaiKerja}
                        onChange={(e) => setTahunMulaiKerja(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kontak Profesional (Opsional)</Label>
                      <Input
                        placeholder="Email kantor atau nomor kantor"
                        value={kontakProfesional}
                        onChange={(e) => setKontakProfesional(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {status === 'searching' && (
                  <>
                    <div className="space-y-2">
                      <Label>Lokasi yang Dituju *</Label>
                      <Input
                        placeholder="Contoh: Jakarta, Semarang"
                        value={lokasiTujuan}
                        onChange={(e) => setLokasiTujuan(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bidang Pekerjaan yang Diincar *</Label>
                      <Input
                        placeholder="Contoh: Software Engineer, Data Analyst"
                        value={bidangPekerjaan}
                        onChange={(e) => setBidangPekerjaan(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sudah Berapa Bulan Mencari Kerja? *</Label>
                      <Input
                        type="number"
                        placeholder="Contoh: 3"
                        value={lamaMencari}
                        onChange={(e) => setLamaMencari(e.target.value)}
                        min="0"
                      />
                    </div>
                  </>
                )}

                {status === 'entrepreneur' && (
                  <>
                    <div className="space-y-2">
                      <Label>Nama Usaha *</Label>
                      <Input
                        placeholder="Contoh: Warung Kopi Nusantara"
                        value={namaUsaha}
                        onChange={(e) => setNamaUsaha(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jenis Usaha *</Label>
                      <Input
                        placeholder="Contoh: F&B, Jasa IT, Retail"
                        value={jenisUsaha}
                        onChange={(e) => setJenisUsaha(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lokasi Usaha *</Label>
                      <Input
                        placeholder="Contoh: Semarang"
                        value={lokasiUsaha}
                        onChange={(e) => setLokasiUsaha(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Mulai Usaha *</Label>
                      <Input
                        type="number"
                        placeholder="Contoh: 2023"
                        value={tahunMulaiUsaha}
                        onChange={(e) => setTahunMulaiUsaha(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Memiliki Karyawan? *</Label>
                      <RadioGroup value={memilikiKaryawan} onValueChange={(v) => setMemilikiKaryawan(v as 'ya' | 'tidak')}>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ya" id="karyawan-ya" />
                            <Label htmlFor="karyawan-ya">Ya</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tidak" id="karyawan-tidak" />
                            <Label htmlFor="karyawan-tidak">Tidak</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    {memilikiKaryawan === 'ya' && (
                      <div className="space-y-2">
                        <Label>Jumlah Karyawan</Label>
                        <Input
                          type="number"
                          placeholder="Contoh: 5"
                          value={jumlahKaryawan}
                          onChange={(e) => setJumlahKaryawan(e.target.value)}
                          min="1"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Apakah Usaha Aktif? *</Label>
                      <RadioGroup value={usahaAktif} onValueChange={(v) => setUsahaAktif(v as 'ya' | 'tidak')}>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ya" id="aktif-ya" />
                            <Label htmlFor="aktif-ya">Ya</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tidak" id="aktif-tidak" />
                            <Label htmlFor="aktif-tidak">Tidak</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Sosial Media Usaha</Label>
                      <div className="space-y-2">
                        {socialMedia.map((sm, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Contoh: instagram.com/usaha"
                              value={sm}
                              onChange={(e) => updateSocialMedia(index, e.target.value)}
                            />
                            {socialMedia.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSocialMedia(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSocialMedia}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Sosial Media
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {status === 'studying' && (
                  <>
                    <div className="space-y-2">
                      <Label>Nama Kampus *</Label>
                      <Input
                        placeholder="Contoh: Universitas Indonesia"
                        value={namaKampus}
                        onChange={(e) => setNamaKampus(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Program Studi *</Label>
                      <Input
                        placeholder="Contoh: Teknik Elektro"
                        value={programStudi}
                        onChange={(e) => setProgramStudi(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jenjang *</Label>
                      <Select value={jenjang} onValueChange={(v) => setJenjang(v as 'S1' | 'S2' | 'S3')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenjang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S1">S1 (Sarjana)</SelectItem>
                          <SelectItem value="S2">S2 (Magister)</SelectItem>
                          <SelectItem value="S3">S3 (Doktor)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Lokasi Kampus *</Label>
                      <Input
                        placeholder="Contoh: Jakarta"
                        value={lokasiKampus}
                        onChange={(e) => setLokasiKampus(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Mulai Studi *</Label>
                      <Input
                        type="number"
                        placeholder="Contoh: 2023"
                        value={tahunMulaiStudi}
                        onChange={(e) => setTahunMulaiStudi(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step: Contact */}
          {currentStep === 'contact' && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
                <CardDescription>
                  Data kontak Anda untuk keperluan jaringan alumni.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" />
                    Email Aktif *
                  </Label>
                  <Input
                    type="email"
                    placeholder="contoh@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Email sebaiknya mengandung unsur nama agar mudah diverifikasi.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent" />
                    Nomor HP/WhatsApp *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="081234567890"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-accent" />
                    Media Sosial (Opsional)
                  </Label>
                  <Input
                    placeholder="Username Instagram/Twitter"
                    value={mediaSosial}
                    onChange={(e) => setMediaSosial(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-accent" />
                    LinkedIn (Opsional)
                  </Label>
                  <Input
                    placeholder="linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Additional */}
          {currentStep === 'additional' && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle>Informasi Tambahan</CardTitle>
                <CardDescription>
                  Beberapa pertanyaan tambahan (opsional).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Apakah Anda bersedia dihubungi kampus? *</Label>
                  <RadioGroup value={bersediaDihubungi} onValueChange={(v) => setBersediaDihubungi(v as 'ya' | 'tidak')}>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ya" id="hubungi-ya" />
                        <Label htmlFor="hubungi-ya">Ya, saya bersedia</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tidak" id="hubungi-tidak" />
                        <Label htmlFor="hubungi-tidak">Tidak</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    Saran/Komentar untuk Kampus (Opsional)
                  </Label>
                  <Textarea
                    placeholder="Tuliskan saran atau komentar Anda untuk kampus..."
                    value={saran}
                    onChange={(e) => setSaran(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Confirm */}
          {currentStep === 'confirm' && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                  Konfirmasi Data
                </CardTitle>
                <CardDescription>
                  Periksa kembali data Anda sebelum submit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                  <h4 className="font-semibold text-foreground">Status: {statusOptions.find(s => s.value === status)?.label}</h4>
                  {status === 'working' && (
                    <p className="text-sm text-muted-foreground">
                      {jabatan} di {namaPerusahaan}, {lokasiPerusahaan} ({bidangIndustri})
                    </p>
                  )}
                  {status === 'entrepreneur' && (
                    <p className="text-sm text-muted-foreground">
                      {namaUsaha} - {jenisUsaha}, {lokasiUsaha}
                    </p>
                  )}
                  {status === 'studying' && (
                    <p className="text-sm text-muted-foreground">
                      {jenjang} {programStudi} di {namaKampus}, {lokasiKampus}
                    </p>
                  )}
                  {status === 'searching' && (
                    <p className="text-sm text-muted-foreground">
                      Mencari kerja di bidang {bidangPekerjaan}, target lokasi: {lokasiTujuan}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                  <h4 className="font-semibold text-foreground">Kontak</h4>
                  <p className="text-sm text-muted-foreground">Email: {email}</p>
                  <p className="text-sm text-muted-foreground">HP: {noHp}</p>
                  {linkedin && <p className="text-sm text-muted-foreground">LinkedIn: {linkedin}</p>}
                </div>

                <p className="text-sm text-muted-foreground">
                  Dengan menekan tombol submit, Anda menyetujui bahwa data yang diisi adalah benar.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>

            {currentStep === 'confirm' ? (
              <Button variant="hero" onClick={handleSubmit}>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Submit Data
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Lanjutkan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

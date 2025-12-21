import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlumni } from '@/contexts/AlumniContext';
import { AlumniMaster, tahunLulusList } from '@/lib/data';
import { Search, User, AlertCircle, ChevronRight, GraduationCap, Building2, Calendar, Shield, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StepProgress } from '@/components/shared';

const validationSteps = [
  { id: 1, title: 'Identitas', description: 'Masukkan data' },
  { id: 2, title: 'Pilih Profil', description: 'Konfirmasi data' },
  { id: 3, title: 'Selesai', description: 'Lanjut dashboard' },
];

export default function ValidasiPage() {
  const navigate = useNavigate();
  const { searchAlumni, setSelectedAlumni } = useAlumni();
  const [nama, setNama] = useState('');
  const [tahunLulus, setTahunLulus] = useState<string>('');
  const [searchResults, setSearchResults] = useState<AlumniMaster[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSearch = () => {
    if (!nama.trim() || !tahunLulus) return;
    const results = searchAlumni(nama, parseInt(tahunLulus));
    setSearchResults(results);
    setHasSearched(true);
    setSelectedId(null);
    if (results.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleSelectAlumni = (alumni: AlumniMaster) => {
    setSelectedId(alumni.id);
  };

  const handleConfirm = () => {
    const selected = searchResults.find(a => a.id === selectedId);
    if (selected) {
      setSelectedAlumni(selected);
      setCurrentStep(3);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  };

  const handleReportAdmin = () => {
    alert('Fitur laporan ke admin akan segera tersedia. Silakan hubungi admin melalui email prodi-abt@polines.ac.id');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Validasi Identitas
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Masukkan nama dan tahun lulus Anda untuk menemukan data di sistem SIPAL.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-10">
              <StepProgress steps={validationSteps} currentStep={currentStep} />
            </div>

            {/* Step 1: Search Form */}
            {currentStep === 1 && (
              <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Data Diri</h2>
                    <p className="text-sm text-muted-foreground">Masukkan informasi untuk pencarian</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="nama" className="text-foreground font-medium mb-2 block">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="nama"
                      placeholder="Masukkan nama lengkap Anda..."
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tahun" className="text-foreground font-medium mb-2 block">
                      Tahun Lulus
                    </Label>
                    <Select value={tahunLulus} onValueChange={setTahunLulus}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Pilih tahun lulus" />
                      </SelectTrigger>
                      <SelectContent>
                        {tahunLulusList.map(tahun => (
                          <SelectItem key={tahun} value={tahun.toString()}>
                            {tahun}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={!nama.trim() || !tahunLulus}
                    className="w-full h-12"
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Cari Data Alumni
                  </Button>
                </div>

                {/* No Results Found */}
                {hasSearched && searchResults.length === 0 && (
                  <div className="mt-6 p-6 rounded-xl bg-warning/5 border border-warning/20 text-center animate-fade-up">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-6 h-6 text-warning" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Data Tidak Ditemukan</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pastikan nama dan tahun lulus yang Anda masukkan sudah benar.
                    </p>
                    <Button onClick={handleReportAdmin} variant="warning" size="sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Laporkan ke Admin
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Profile */}
            {currentStep === 2 && searchResults.length > 0 && (
              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Pilih Profil Anda
                  </h2>
                  <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
                    {searchResults.length} ditemukan
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {searchResults.map((alumni, index) => (
                    <div
                      key={alumni.id}
                      onClick={() => handleSelectAlumni(alumni)}
                      className={cn(
                        "glass-card rounded-xl p-5 cursor-pointer transition-all duration-200 border-2 animate-fade-up",
                        selectedId === alumni.id
                          ? "border-primary bg-primary/5 shadow-elevated"
                          : "border-transparent hover:border-primary/30"
                      )}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg mb-3">
                            {alumni.nama}
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                                <span className="text-xs font-bold">#</span>
                              </div>
                              <span>{alumni.nim}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                                <Building2 className="w-3.5 h-3.5" />
                              </div>
                              <span>{alumni.jurusan}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                                <GraduationCap className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{alumni.prodi}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5" />
                              </div>
                              <span>Lulus {alumni.tahunLulus}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                            selectedId === alumni.id
                              ? "border-primary bg-primary"
                              : "border-border"
                          )}
                        >
                          {selectedId === alumni.id && (
                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 h-12"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedId}
                    className="flex-1 h-12"
                  >
                    Konfirmasi & Lanjutkan
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 3 && (
              <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Validasi Berhasil!
                </h2>
                <p className="text-muted-foreground mb-4">
                  Mengarahkan ke dashboard Anda...
                </p>
                <div className="w-32 h-1 bg-muted rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-primary animate-shimmer" style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
import { Search, User, AlertCircle, ChevronRight, GraduationCap, Building2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ValidasiPage() {
  const navigate = useNavigate();
  const { searchAlumni, setSelectedAlumni } = useAlumni();
  const [nama, setNama] = useState('');
  const [tahunLulus, setTahunLulus] = useState<string>('');
  const [searchResults, setSearchResults] = useState<AlumniMaster[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSearch = () => {
    if (!nama.trim() || !tahunLulus) return;
    const results = searchAlumni(nama, parseInt(tahunLulus));
    setSearchResults(results);
    setHasSearched(true);
    setSelectedId(null);
  };

  const handleSelectAlumni = (alumni: AlumniMaster) => {
    setSelectedId(alumni.id);
  };

  const handleConfirm = () => {
    const selected = searchResults.find(a => a.id === selectedId);
    if (selected) {
      setSelectedAlumni(selected);
      navigate('/dashboard');
    }
  };

  const handleReportAdmin = () => {
    alert('Fitur laporan ke admin akan segera tersedia. Silakan hubungi admin melalui email alumni@polines.ac.id');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Validasi Identitas Alumni
              </h1>
              <p className="text-muted-foreground">
                Masukkan nama dan tahun lulus Anda untuk menemukan data di sistem.
              </p>
            </div>

            {/* Search Form */}
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
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
            </div>

            {/* Search Results */}
            {hasSearched && (
              <div className="animate-fade-up">
                {searchResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">
                        Hasil Pencarian
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {searchResults.length} data ditemukan
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      {searchResults.map((alumni) => (
                        <div
                          key={alumni.id}
                          onClick={() => handleSelectAlumni(alumni)}
                          className={cn(
                            "glass-card rounded-xl p-4 cursor-pointer transition-all duration-200 border-2",
                            selectedId === alumni.id
                              ? "border-primary bg-primary/5 shadow-elevated"
                              : "border-transparent hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-2">
                                {alumni.nama}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs">
                                    #
                                  </span>
                                  {alumni.nim}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Building2 className="w-4 h-4" />
                                  {alumni.jurusan}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <GraduationCap className="w-4 h-4" />
                                  {alumni.prodi}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  Lulus {alumni.tahunLulus}
                                </div>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                selectedId === alumni.id
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              )}
                            >
                              {selectedId === alumni.id && (
                                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleConfirm}
                      disabled={!selectedId}
                      className="w-full h-12"
                      size="lg"
                    >
                      Konfirmasi & Lanjutkan
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </>
                ) : (
                  <div className="glass-card rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Data Tidak Ditemukan
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Maaf, kami tidak dapat menemukan data alumni dengan nama dan tahun lulus tersebut.
                      Pastikan data yang Anda masukkan sudah benar.
                    </p>
                    <Button onClick={handleReportAdmin} variant="warning" className="w-full">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Laporkan ke Admin
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

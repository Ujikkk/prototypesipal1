import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, User, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAlumniStore, MasterAlumni } from '@/stores/alumniStore';
import { toast } from '@/hooks/use-toast';

export default function ValidationPage() {
  const navigate = useNavigate();
  const { searchMasterData, setCurrentAlumni } = useAlumniStore();
  
  const [nama, setNama] = useState('');
  const [tahunLulus, setTahunLulus] = useState('');
  const [searchResults, setSearchResults] = useState<MasterAlumni[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!nama.trim()) {
      toast({
        title: 'Nama diperlukan',
        description: 'Masukkan nama Anda untuk mencari data.',
        variant: 'destructive',
      });
      return;
    }

    if (!tahunLulus || isNaN(Number(tahunLulus))) {
      toast({
        title: 'Tahun lulus diperlukan',
        description: 'Masukkan tahun lulus yang valid.',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = searchMasterData(nama.trim(), Number(tahunLulus));
      setSearchResults(results);
      setHasSearched(true);
      setIsSearching(false);
    }, 800);
  };

  const handleSelectAlumni = (alumni: MasterAlumni) => {
    setCurrentAlumni(alumni);
    toast({
      title: 'Verifikasi berhasil!',
      description: `Selamat datang, ${alumni.nama}`,
    });
    navigate('/dashboard');
  };

  const handleReportAdmin = () => {
    toast({
      title: 'Laporan dikirim',
      description: 'Admin akan menghubungi Anda dalam 1-3 hari kerja.',
    });
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary shadow-medium mb-4">
              <UserCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Validasi Identitas Alumni
            </h1>
            <p className="text-muted-foreground">
              Masukkan nama dan tahun lulus untuk menemukan data Anda di sistem.
            </p>
          </div>

          {/* Search Form */}
          <Card variant="elevated" className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-lg">Cari Data Alumni</CardTitle>
              <CardDescription>
                Data Anda akan dicocokkan dengan database master kampus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Masukkan nama Anda"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Tahun Lulus
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Contoh: 2023"
                    value={tahunLulus}
                    onChange={(e) => setTahunLulus(e.target.value)}
                    className="pl-10"
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSearch} 
                className="w-full" 
                size="lg"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Cari Data Saya
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4 animate-fade-in">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Ditemukan {searchResults.length} data yang cocok</span>
                  </div>
                  
                  <div className="space-y-3">
                    {searchResults.map((alumni) => (
                      <Card 
                        key={alumni.id} 
                        variant="interactive"
                        onClick={() => handleSelectAlumni(alumni)}
                        className="cursor-pointer"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-foreground">
                                {alumni.nama}
                              </h3>
                              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                <span className="bg-secondary px-2 py-0.5 rounded-md">
                                  NIM: {alumni.nim}
                                </span>
                                <span className="bg-secondary px-2 py-0.5 rounded-md">
                                  {alumni.prodi}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {alumni.jurusan} • Lulus {alumni.tahunLulus}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card variant="flat" className="border-warning/50 bg-warning/5">
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Data Tidak Ditemukan
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nama "{nama}" dengan tahun lulus {tahunLulus} tidak ditemukan di database.
                      Pastikan ejaan dan tahun lulus sudah benar.
                    </p>
                    <Button variant="warning" onClick={handleReportAdmin}>
                      Laporkan ke Admin
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Info Card */}
          {!hasSearched && (
            <Card variant="glass" className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Mengapa perlu validasi?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Validasi identitas memastikan bahwa hanya alumni asli Polines yang dapat 
                      mengisi data. Ini menjaga akurasi dan integritas data alumni.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

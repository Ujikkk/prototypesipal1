import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAlumni } from '@/contexts/AlumniContext';
import { 
  User, GraduationCap, Building2, Calendar, FileEdit, History, 
  CheckCircle, Award, Briefcase, Rocket, BookOpen, Search,
  ChevronRight, Clock, MapPin
} from 'lucide-react';
import { useEffect } from 'react';
import { Timeline, StatusBadge } from '@/components/shared';
import { cn } from '@/lib/utils';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { selectedAlumni, getAlumniDataByMasterId } = useAlumni();

  useEffect(() => {
    if (!selectedAlumni) {
      navigate('/validasi');
    }
  }, [selectedAlumni, navigate]);

  if (!selectedAlumni) return null;

  const alumniHistory = getAlumniDataByMasterId(selectedAlumni.id);

  // Transform history data for Timeline component
  const timelineItems = alumniHistory.map((data) => {
    let title = '';
    let description = '';

    if (data.status === 'bekerja') {
      title = data.namaPerusahaan || 'Perusahaan';
      description = `${data.jabatan || 'Karyawan'} di ${data.lokasiPerusahaan || 'Indonesia'}`;
    } else if (data.status === 'wirausaha') {
      title = data.namaUsaha || 'Usaha';
      description = `${data.jenisUsaha || 'Bisnis'} di ${data.lokasiUsaha || 'Indonesia'}`;
    } else if (data.status === 'studi') {
      title = data.namaKampus || 'Kampus';
      description = `${data.jenjang || ''} ${data.programStudi || ''} di ${data.lokasiKampus || ''}`;
    } else if (data.status === 'mencari') {
      title = 'Mencari Pekerjaan';
      description = `Target: ${data.bidangDiincar || 'Berbagai bidang'} di ${data.lokasiTujuan || 'Indonesia'}`;
    }

    return {
      id: data.id,
      year: data.tahunPengisian,
      title,
      description,
      status: data.status as 'bekerja' | 'wirausaha' | 'studi' | 'mencari',
    };
  });

  const latestData = alumniHistory[alumniHistory.length - 1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Selamat datang kembali,</p>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {selectedAlumni.nama}
                  </h1>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Profil Alumni
                </h2>
                {latestData && (
                  <StatusBadge status={latestData.status} size="lg" showIcon />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 transition-colors hover:bg-muted/70">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Nama Lengkap</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.nama}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 transition-colors hover:bg-muted/70">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">NIM</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.nim}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 transition-colors hover:bg-muted/70">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Jurusan</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.jurusan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 transition-colors hover:bg-muted/70">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Program Studi</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.prodi}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 transition-colors hover:bg-muted/70 md:col-span-2">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Tahun Lulus</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.tahunLulus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileEdit className="w-6 h-6 text-primary" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Update Status Alumni</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Isi atau perbarui data status karir Anda saat ini.
                </p>
                <Button onClick={() => navigate('/form')} className="w-full">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Isi Form Status
                </Button>
              </div>

              <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-success" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Prestasi Non-Akademik</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tambahkan prestasi, publikasi, HAKI, dan pengalaman Anda.
                </p>
                <Button variant="secondary" className="w-full" onClick={() => navigate('/prestasi')}>
                  <Award className="w-4 h-4 mr-2" />
                  Kelola Prestasi
                </Button>
              </div>
            </div>

            {/* History Timeline */}
            {alumniHistory.length > 0 && (
              <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Riwayat Status
                  </h2>
                  <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
                    {alumniHistory.length} entri
                  </span>
                </div>

                <Timeline items={timelineItems} />
              </div>
            )}

            {/* Empty State */}
            {alumniHistory.length === 0 && (
              <div className="glass-card rounded-2xl p-8 text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Belum Ada Riwayat</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Anda belum pernah mengisi form status alumni. Mulai sekarang untuk membangun timeline karir Anda.
                </p>
                <Button onClick={() => navigate('/form')}>
                  <FileEdit className="w-4 h-4 mr-2" />
                  Isi Form Pertama Anda
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

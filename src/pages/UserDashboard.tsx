import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAlumni } from '@/contexts/AlumniContext';
import { 
  FileEdit, Award, Clock, Briefcase, ChevronRight, Plus,
  Trophy, BookOpen, Shield, FolderOpen, Rocket, GraduationCap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  StudentIdentityHeader,
} from '@/components/dashboard';
import { 
  getAchievementsByMasterId, 
  getAchievementStats,
} from '@/services/achievement.service';
import { Achievement, AchievementCategory, ACHIEVEMENT_CATEGORIES } from '@/types/achievement.types';
import { isCareerHistoryVisible, isAchievementsEditable } from '@/data/student-seed-data';
import type { StudentStatus, CareerStatus } from '@/types/student.types';
import { cn } from '@/lib/utils';

// Category icons mapping
const CATEGORY_ICONS: Record<AchievementCategory, React.ElementType> = {
  kegiatan: Trophy,
  publikasi: BookOpen,
  haki: Shield,
  magang: Briefcase,
  portofolio: FolderOpen,
  wirausaha: Rocket,
  pengembangan: GraduationCap,
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { selectedAlumni, getAlumniDataByMasterId } = useAlumni();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Record<AchievementCategory, number>>({
    kegiatan: 0, publikasi: 0, haki: 0, magang: 0, portofolio: 0, wirausaha: 0, pengembangan: 0
  });

  useEffect(() => {
    if (!selectedAlumni) {
      navigate('/validasi');
    } else {
      setAchievements(getAchievementsByMasterId(selectedAlumni.id));
      setStats(getAchievementStats(selectedAlumni.id));
    }
  }, [selectedAlumni, navigate]);

  if (!selectedAlumni) return null;

  // Determine student status - for demo, use the status from alumni data or default to 'alumni'
  const studentStatus: StudentStatus = (selectedAlumni as any).status || 'alumni';
  const showCareerHistory = isCareerHistoryVisible(studentStatus);
  const canEditAchievements = isAchievementsEditable(studentStatus);

  const alumniHistory = getAlumniDataByMasterId(selectedAlumni.id);
  const totalAchievements = Object.values(stats).reduce((a, b) => a + b, 0);

  // Transform career history for display
  const careerItems = alumniHistory.slice(0, 4).map((data) => {
    let title = '';
    let subtitle = '';
    let status = 'active';

    if (data.status === 'bekerja') {
      title = data.namaPerusahaan || 'Perusahaan';
      subtitle = data.jabatan || 'Karyawan';
    } else if (data.status === 'wirausaha') {
      title = data.namaUsaha || 'Usaha';
      subtitle = data.jenisUsaha || 'Bisnis';
    } else if (data.status === 'studi') {
      title = data.namaKampus || 'Kampus';
      subtitle = `${data.jenjang || ''} ${data.programStudi || ''}`.trim();
    } else if (data.status === 'mencari') {
      title = 'Mencari Pekerjaan';
      subtitle = `Target: ${data.bidangDiincar || 'Berbagai bidang'}`;
      status = 'seeking';
    }

    return { id: data.id, title, subtitle, year: data.tahunPengisian, status };
  });

  // Get career status for header
  const latestData = alumniHistory[alumniHistory.length - 1];
  const getCareerStatus = (): CareerStatus | undefined => {
    if (!latestData) return undefined;
    const statusMap: Record<string, CareerStatus> = {
      bekerja: 'working',
      wirausaha: 'entrepreneur',
      studi: 'further_study',
      mencari: 'job_seeking'
    };
    return statusMap[latestData.status];
  };

  // Get latest achievements for display
  const latestAchievements = [...achievements]
    .sort((a, b) => getAchievementYear(b) - getAchievementYear(a))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 animate-fade-up">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Dashboard {studentStatus === 'alumni' ? 'Alumni' : 'Mahasiswa'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Ringkasan akademik dan perjalanan karirmu
              </p>
            </div>

            {/* Profile Summary */}
            <div className="animate-fade-up" style={{ animationDelay: '0.05s' }}>
              <StudentIdentityHeader
                nama={selectedAlumni.nama}
                nim={selectedAlumni.nim}
                prodi={selectedAlumni.prodi}
                jurusan={selectedAlumni.jurusan}
                tahunLulus={selectedAlumni.tahunLulus}
                studentStatus={studentStatus}
                careerStatus={getCareerStatus()}
              />
            </div>

            {/* Summary Cards Section */}
            <div className="grid grid-cols-1 gap-6 mt-8">
              {/* Riwayat Prestasi Card */}
              <div 
                className="glass-card rounded-2xl overflow-hidden animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Riwayat Prestasi</h3>
                        <p className="text-sm text-muted-foreground">{totalAchievements} prestasi tercatat</p>
                      </div>
                    </div>
                    {canEditAchievements && (
                      <Button variant="outline" size="sm" onClick={() => navigate('/prestasi')}>
                        <Plus className="w-4 h-4 mr-1" />
                        Tambah
                      </Button>
                    )}
                  </div>

                  {latestAchievements.length > 0 ? (
                    <div className="space-y-3">
                      {latestAchievements.map((achievement) => {
                        const Icon = CATEGORY_ICONS[achievement.category];
                        const catConfig = ACHIEVEMENT_CATEGORIES[achievement.category];
                        return (
                          <div 
                            key={achievement.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate('/prestasi')}
                          >
                            <div className={cn(
                              'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                              'bg-warning/10'
                            )}>
                              <Icon className="w-4 h-4 text-warning" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground line-clamp-1">
                                {getAchievementTitle(achievement)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {catConfig.label} • {getAchievementYear(achievement)}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/20 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Belum ada prestasi tercatat
                      </p>
                      {canEditAchievements && (
                        <Button size="sm" onClick={() => navigate('/prestasi')}>
                          <Plus className="w-4 h-4 mr-1" />
                          Tambah Prestasi
                        </Button>
                      )}
                    </div>
                  )}

                  {latestAchievements.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between text-primary hover:text-primary"
                        onClick={() => navigate('/prestasi')}
                      >
                        Lihat Semua Prestasi
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Riwayat Karir Card - Only for Alumni */}
              {showCareerHistory && (
                <div 
                  className="glass-card rounded-2xl overflow-hidden animate-fade-up"
                  style={{ animationDelay: '0.15s' }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Riwayat Karir</h3>
                          <p className="text-sm text-muted-foreground">Perjalanan profesionalmu</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate('/form')}>
                        <Plus className="w-4 h-4 mr-1" />
                        Tambah
                      </Button>
                    </div>

                    {careerItems.length > 0 ? (
                      <div className="space-y-3">
                        {careerItems.map((item) => (
                          <div 
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate('/form')}
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.subtitle} • {item.year}
                              </p>
                            </div>
                            <div className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
                              item.status === 'active' 
                                ? 'bg-success/10 text-success' 
                                : 'bg-warning/10 text-warning'
                            )}>
                              {item.status === 'active' ? 'Aktif' : 'Mencari'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted/20 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                          <Clock className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Belum ada riwayat karir
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          Tambahkan perjalanan profesionalmu
                        </p>
                        <Button size="sm" onClick={() => navigate('/form')}>
                          <FileEdit className="w-4 h-4 mr-1" />
                          Isi Form Status
                        </Button>
                      </div>
                    )}

                    {careerItems.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between text-primary hover:text-primary"
                          onClick={() => navigate('/riwayat-karir')}
                        >
                          Lihat Semua Karir
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helper functions
function getAchievementTitle(achievement: Achievement): string {
  switch (achievement.category) {
    case 'kegiatan': return achievement.namaKegiatan;
    case 'publikasi': return achievement.judul;
    case 'haki': return achievement.judul;
    case 'magang': return `${achievement.posisi} - ${achievement.namaPerusahaan}`;
    case 'portofolio': return achievement.judulProyek;
    case 'wirausaha': return achievement.namaUsaha;
    case 'pengembangan': return achievement.namaProgram;
  }
}

function getAchievementYear(achievement: Achievement): number {
  switch (achievement.category) {
    case 'kegiatan': return achievement.tahun;
    case 'publikasi': return achievement.tahun;
    case 'haki': return achievement.tahunPengajuan;
    case 'magang': return new Date(achievement.tanggalMulai).getFullYear();
    case 'portofolio': return achievement.tahun;
    case 'wirausaha': return achievement.tahunMulai;
    case 'pengembangan': return new Date(achievement.tanggalMulai).getFullYear();
  }
}

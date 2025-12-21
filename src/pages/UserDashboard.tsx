import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAlumni } from '@/contexts/AlumniContext';
import { 
  FileEdit, Award, Clock, Briefcase
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  StudentIdentityHeader, 
  SummaryCard, 
  CareerTimeline,
  AchievementTimeline 
} from '@/components/dashboard';
import { 
  getAchievementsByMasterId, 
  getAchievementStats,
} from '@/services/achievement.service';
import { Achievement, AchievementCategory } from '@/types/achievement.types';
import { isCareerHistoryVisible, isAchievementsEditable } from '@/data/student-seed-data';
import type { StudentStatus, CareerStatus } from '@/types/student.types';

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
  const latestData = alumniHistory[alumniHistory.length - 1];
  const totalAchievements = Object.values(stats).reduce((a, b) => a + b, 0);

  // Transform career history for timeline
  const careerTimelineItems = alumniHistory.map((data) => {
    let title = '';
    let subtitle = '';
    let location = '';

    if (data.status === 'bekerja') {
      title = data.namaPerusahaan || 'Perusahaan';
      subtitle = data.jabatan || 'Karyawan';
      location = data.lokasiPerusahaan || '';
    } else if (data.status === 'wirausaha') {
      title = data.namaUsaha || 'Usaha';
      subtitle = data.jenisUsaha || 'Bisnis';
      location = data.lokasiUsaha || '';
    } else if (data.status === 'studi') {
      title = data.namaKampus || 'Kampus';
      subtitle = `${data.jenjang || ''} ${data.programStudi || ''}`.trim();
      location = data.lokasiKampus || '';
    } else if (data.status === 'mencari') {
      title = 'Mencari Pekerjaan';
      subtitle = `Target: ${data.bidangDiincar || 'Berbagai bidang'}`;
      location = data.lokasiTujuan || '';
    }

    return {
      id: data.id,
      year: data.tahunPengisian,
      status: data.status as 'bekerja' | 'wirausaha' | 'studi' | 'mencari',
      title,
      subtitle,
      location,
    };
  });

  // Get current status info for summary card
  const getCurrentStatusInfo = () => {
    if (!latestData) return { status: 'Belum diisi', company: '-', year: '-' };
    
    const statusLabels: Record<string, string> = {
      bekerja: 'Bekerja',
      wirausaha: 'Wirausaha',
      studi: 'Studi Lanjut',
      mencari: 'Mencari Kerja'
    };

    let company = '-';
    if (latestData.status === 'bekerja') company = latestData.namaPerusahaan || '-';
    else if (latestData.status === 'wirausaha') company = latestData.namaUsaha || '-';
    else if (latestData.status === 'studi') company = latestData.namaKampus || '-';

    return {
      status: statusLabels[latestData.status] || latestData.status,
      company,
      year: latestData.tahunPengisian?.toString() || '-',
    };
  };

  // Get latest achievement for summary card
  const getLatestAchievement = () => {
    if (achievements.length === 0) return null;
    
    const sorted = [...achievements].sort((a, b) => {
      const yearA = getAchievementYear(a);
      const yearB = getAchievementYear(b);
      return yearB - yearA;
    });
    
    return {
      title: getAchievementTitle(sorted[0]),
      year: getAchievementYear(sorted[0]),
    };
  };

  // Get career status for header
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

  const currentStatusInfo = getCurrentStatusInfo();
  const latestAchievement = getLatestAchievement();
  const careerStatus = getCareerStatus();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Student Identity Header */}
            <StudentIdentityHeader
              nama={selectedAlumni.nama}
              nim={selectedAlumni.nim}
              prodi={selectedAlumni.prodi}
              jurusan={selectedAlumni.jurusan}
              tahunLulus={selectedAlumni.tahunLulus}
              studentStatus={studentStatus}
              careerStatus={careerStatus}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Card A - Status Alumni (Only visible for Alumni) */}
              {showCareerHistory && (
                <SummaryCard
                  title="Status Alumni Saat Ini"
                  icon={<Briefcase className="w-6 h-6 text-primary" />}
                  iconBgClass="bg-primary/10"
                  primaryLabel="Status"
                  primaryValue={currentStatusInfo.status}
                  secondaryLabel="Institusi/Perusahaan"
                  secondaryValue={currentStatusInfo.company}
                  highlight={latestData ? {
                    label: 'Tahun pengisian terakhir',
                    value: currentStatusInfo.year
                  } : undefined}
                  ctaLabel="Perbarui Status"
                  ctaVariant="default"
                  onCtaClick={() => navigate('/form')}
                />
              )}

              {/* Card B - Prestasi (Visible for all) */}
              <SummaryCard
                title="Prestasi Non-Akademik"
                icon={<Award className="w-6 h-6 text-success" />}
                iconBgClass="bg-success/10"
                primaryLabel="Total Prestasi"
                primaryValue={totalAchievements.toString()}
                highlight={latestAchievement ? {
                  label: 'Prestasi terbaru',
                  value: `${latestAchievement.title} (${latestAchievement.year})`
                } : undefined}
                ctaLabel={canEditAchievements ? "Tambah Prestasi" : "Lihat Prestasi"}
                ctaVariant="secondary"
                onCtaClick={() => navigate('/prestasi')}
                className={!showCareerHistory ? 'md:col-span-2' : ''}
              />
            </div>

            {/* History Section */}
            <div className={`grid grid-cols-1 ${showCareerHistory ? 'lg:grid-cols-2' : ''} gap-5 mt-6 animate-fade-up`} style={{ animationDelay: '0.2s' }}>
              {/* Career Timeline - Only for Alumni */}
              {showCareerHistory && (
                <>
                  {alumniHistory.length > 0 ? (
                    <CareerTimeline 
                      items={careerTimelineItems}
                      maxItems={4}
                      onViewAll={() => navigate('/form')}
                    />
                  ) : (
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Riwayat Karir</h3>
                          <p className="text-sm text-muted-foreground">Tracer study Anda</p>
                        </div>
                      </div>
                      <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">Belum Ada Riwayat</h4>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                          Mulai isi form status alumni untuk membangun timeline karir Anda.
                        </p>
                        <Button onClick={() => navigate('/form')}>
                          <FileEdit className="w-4 h-4 mr-2" />
                          Isi Form Status
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Achievement Timeline - Visible for All */}
              <AchievementTimeline
                achievements={achievements}
                maxItems={5}
                onViewAll={() => navigate('/prestasi')}
                onAddNew={canEditAchievements ? () => navigate('/prestasi') : undefined}
                className={!showCareerHistory ? 'lg:max-w-2xl lg:mx-auto w-full' : ''}
              />
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

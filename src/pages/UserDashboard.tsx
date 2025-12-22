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
import type { StudentStatus } from '@/types/student.types';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { selectedAlumni, getAlumniDataByMasterId } = useAlumni();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Record<AchievementCategory, number>>({
    partisipasi: 0, publikasi: 0, haki: 0, akademik_terapan: 0, wirausaha: 0, pengembangan: 0
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
    } else if (data.status === 'studi') {
      title = data.namaKampus || 'Kampus';
      subtitle = data.programStudi || 'Program Studi';
      location = data.lokasiKampus || '';
    } else if (data.status === 'wirausaha') {
      title = data.namaUsaha || 'Usaha';
      subtitle = data.jenisUsaha || 'Wirausaha';
      location = data.lokasiUsaha || '';
    } else {
      title = 'Status Lainnya';
      subtitle = data.status || '';
    }

    return {
      id: data.id,
      title,
      subtitle,
      location,
      year: data.tahunPengisian || new Date().getFullYear(),
      status: data.status,
    };
  });

  // Get display year for last update
  const lastUpdateYear = latestData?.tahunPengisian || '-';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Student Identity Header */}
            <div className="mb-8 animate-fade-up">
              <StudentIdentityHeader 
                nama={selectedAlumni.nama}
                nim={selectedAlumni.nim}
                prodi={selectedAlumni.prodi}
                jurusan={selectedAlumni.jurusan}
                tahunLulus={selectedAlumni.tahunLulus}
                studentStatus={studentStatus}
              />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <SummaryCard
                title="Total Prestasi"
                icon={<Award className="w-5 h-5 text-success" />}
                iconBgClass="bg-success/10"
                primaryLabel="Jumlah"
                primaryValue={totalAchievements.toString()}
                ctaLabel="Lihat Prestasi"
                onCtaClick={() => navigate('/prestasi')}
              />
              <SummaryCard
                title="Update Terakhir"
                icon={<FileEdit className="w-5 h-5 text-primary" />}
                iconBgClass="bg-primary/10"
                primaryLabel="Tahun"
                primaryValue={lastUpdateYear.toString()}
                ctaLabel="Update Tracer"
                onCtaClick={() => navigate('/form')}
              />
              <SummaryCard
                title="Riwayat Karier"
                icon={<Clock className="w-5 h-5 text-info" />}
                iconBgClass="bg-info/10"
                primaryLabel="Total Data"
                primaryValue={`${alumniHistory.length} entri`}
                ctaLabel="Lihat Riwayat"
                onCtaClick={() => navigate('/karir')}
              />
              <SummaryCard
                title="Status Saat Ini"
                icon={<Briefcase className="w-5 h-5 text-warning" />}
                iconBgClass="bg-warning/10"
                primaryLabel="Status"
                primaryValue={latestData?.status === 'bekerja' ? 'Bekerja' : 
                       latestData?.status === 'studi' ? 'Studi' : 
                       latestData?.status === 'wirausaha' ? 'Wirausaha' : 'Lainnya'}
                ctaLabel="Update Status"
                onCtaClick={() => navigate('/form')}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Career Timeline */}
              {showCareerHistory && careerTimelineItems.length > 0 && (
                <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
                  <CareerTimeline
                    items={careerTimelineItems}
                    maxItems={4}
                    onAddNew={() => navigate('/form')}
                    onViewAll={() => navigate('/karir')}
                    className="h-full"
                  />
                </div>
              )}

              {/* Achievement Timeline */}
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <AchievementTimeline
                  achievements={achievements}
                  maxItems={5}
                  onViewAll={() => navigate('/prestasi')}
                  onAddNew={canEditAchievements ? () => navigate('/prestasi') : undefined}
                  className={!showCareerHistory || careerTimelineItems.length === 0 ? 'lg:col-span-2' : ''}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 animate-fade-up" style={{ animationDelay: '0.25s' }}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Aksi Cepat</h3>
                <div className="flex flex-wrap gap-3">
                  {canEditAchievements && (
                    <Button onClick={() => navigate('/prestasi')}>
                      <Award className="w-4 h-4 mr-2" />
                      Kelola Prestasi
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => navigate('/form')}>
                    <FileEdit className="w-4 h-4 mr-2" />
                    Update Tracer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

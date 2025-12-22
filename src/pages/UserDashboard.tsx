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
      location = data.kotaPerusahaan || '';
    } else if (data.status === 'melanjutkan_studi') {
      title = data.namaKampus || 'Kampus';
      subtitle = data.programStudi || 'Program Studi';
      location = '';
    } else if (data.status === 'berwirausaha') {
      title = data.namaUsaha || 'Usaha';
      subtitle = data.bidangUsaha || 'Wirausaha';
      location = '';
    } else {
      title = 'Status Lainnya';
      subtitle = data.status || '';
    }

    return {
      id: data.id,
      title,
      subtitle,
      location,
      date: data.tahunLulus?.toString() || '',
      status: data.status as CareerStatus,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Student Identity Header */}
            <div className="mb-8 animate-fade-up">
              <StudentIdentityHeader 
                student={selectedAlumni}
                studentStatus={studentStatus}
              />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <SummaryCard
                icon={Award}
                label="Total Prestasi"
                value={totalAchievements}
                color="success"
              />
              <SummaryCard
                icon={FileEdit}
                label="Update Terakhir"
                value={latestData?.tahunLulus || '-'}
                color="primary"
              />
              <SummaryCard
                icon={Clock}
                label="Riwayat Karier"
                value={`${alumniHistory.length} data`}
                color="info"
              />
              <SummaryCard
                icon={Briefcase}
                label="Status Saat Ini"
                value={latestData?.status === 'bekerja' ? 'Bekerja' : 
                       latestData?.status === 'melanjutkan_studi' ? 'Studi' : 
                       latestData?.status === 'berwirausaha' ? 'Wirausaha' : 'Lainnya'}
                color="warning"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Career Timeline */}
              {showCareerHistory && (
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
                  className="h-full"
                />
              </div>

              {/* If career history is hidden, show a placeholder or the achievement timeline full width */}
              {!showCareerHistory && (
                <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
                  <div className="glass-card rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Riwayat Karier</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                      Riwayat karier akan tersedia setelah Anda lulus dari program studi.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center animate-fade-up" style={{ animationDelay: '0.25s' }}>
              <Button variant="outline" onClick={() => navigate('/form')}>
                <FileEdit className="w-4 h-4 mr-2" />
                Update Data Tracer
              </Button>
              <Button variant="outline" onClick={() => navigate('/prestasi')}>
                <Award className="w-4 h-4 mr-2" />
                Kelola Prestasi
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

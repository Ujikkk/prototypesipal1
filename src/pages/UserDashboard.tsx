import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAlumni } from '@/contexts/AlumniContext';
import { Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  StudentIdentityHeader, 
  SummaryCard, 
  AchievementTimeline,
  AlumniStatusCard,
  CareerHistoryCard,
} from '@/components/dashboard';
import { 
  getAchievementsByMasterId, 
  getAchievementStats,
} from '@/services/achievement.service';
import { Achievement, AchievementCategory } from '@/types/achievement.types';
import { hasCareerAccess, canEditAchievements } from '@/lib/role-utils';
import type { StudentStatus } from '@/types/student.types';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { selectedAlumni, getAlumniDataByMasterId } = useAlumni();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Record<AchievementCategory, number>>({
    lomba: 0, seminar: 0, publikasi: 0, haki: 0, magang: 0, portofolio: 0, wirausaha: 0, pengembangan: 0, organisasi: 0
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

  // Determine student role - PRIMARY IDENTITY
  const studentStatus: StudentStatus = (selectedAlumni as any).status || 'alumni';
  const showCareerHistory = hasCareerAccess(studentStatus);
  const achievementsEditable = canEditAchievements(studentStatus);

  // Get career history data
  const alumniHistory = getAlumniDataByMasterId(selectedAlumni.id);
  const totalAchievements = Object.values(stats).reduce((a, b) => a + b, 0);

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

  const latestAchievement = getLatestAchievement();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Page Title */}
            <div className="mb-8 animate-fade-up">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Dashboard Mahasiswa / Alumni
              </h1>
              <p className="text-muted-foreground">
                Ringkasan akademik dan perjalanan karirmu
              </p>
            </div>

            {/* Student Identity Header with Role Badge */}
            <StudentIdentityHeader
              nama={selectedAlumni.nama}
              nim={selectedAlumni.nim}
              prodi={selectedAlumni.prodi}
              jurusan={selectedAlumni.jurusan}
              tahunLulus={selectedAlumni.tahunLulus}
              studentStatus={studentStatus}
              careerHistory={alumniHistory}
            />

            {/* Summary Cards - 2 Cards Grid (Fixed Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Card 1 - Status Alumni Saat Ini (Role-Aware) */}
              <AlumniStatusCard
                studentStatus={studentStatus}
                careerHistory={alumniHistory}
                onUpdateStatus={() => navigate('/form')}
              />

              {/* Card 2 - Prestasi Non-Akademik */}
              <SummaryCard
                title="Prestasi Non-Akademik"
                icon={<Award className="w-6 h-6 text-success" />}
                iconBgClass="bg-success/10"
                primaryLabel="Total Prestasi"
                primaryValue={totalAchievements.toString()}
                contextText={`Menampilkan ${Math.min(achievements.length, 5)} dari ${totalAchievements} prestasi`}
                highlight={latestAchievement ? {
                  label: 'Prestasi terbaru',
                  value: `${latestAchievement.title} (${latestAchievement.year})`
                } : undefined}
                ctaLabel={achievementsEditable ? "Tambah Prestasi" : "Lihat Prestasi"}
                ctaVariant="secondary"
                onCtaClick={() => navigate('/prestasi')}
              />
            </div>

            {/* History Section - 2 Cards Grid (Fixed Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {/* Card 3 - Riwayat Karir (Role-Aware) */}
              <CareerHistoryCard
                studentStatus={studentStatus}
                careerHistory={alumniHistory}
                onViewAll={() => navigate('/riwayat-karir')}
                onAddNew={showCareerHistory ? () => navigate('/form') : undefined}
              />

              {/* Card 4 - Riwayat Prestasi */}
              <AchievementTimeline
                achievements={[...achievements].sort((a, b) => getAchievementYear(b) - getAchievementYear(a))}
                maxItems={5}
                contextText={`Menampilkan ${Math.min(achievements.length, 5)} dari ${totalAchievements} prestasi terbaru`}
                onViewAll={() => navigate('/prestasi')}
                onAddNew={achievementsEditable ? () => navigate('/prestasi') : undefined}
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
    case 'lomba': return (achievement as any).namaLomba;
    case 'seminar': return (achievement as any).namaSeminar;
    case 'publikasi': return (achievement as any).judul;
    case 'haki': return (achievement as any).judul;
    case 'magang': return `${(achievement as any).posisi} - ${(achievement as any).namaPerusahaan}`;
    case 'portofolio': return (achievement as any).judulProyek;
    case 'wirausaha': return (achievement as any).namaUsaha;
    case 'pengembangan': return (achievement as any).namaProgram;
    case 'organisasi': return `${(achievement as any).jabatan} - ${(achievement as any).namaOrganisasi}`;
  }
}

function getAchievementYear(achievement: Achievement): number {
  switch (achievement.category) {
    case 'lomba': return (achievement as any).tahun;
    case 'seminar': return (achievement as any).tahun;
    case 'publikasi': return (achievement as any).tahun;
    case 'haki': return (achievement as any).tahunPengajuan;
    case 'magang': return new Date((achievement as any).tanggalMulai).getFullYear();
    case 'portofolio': return (achievement as any).tahun;
    case 'wirausaha': return (achievement as any).tahunMulai;
    case 'pengembangan': return new Date((achievement as any).tanggalMulai).getFullYear();
    case 'organisasi': return new Date((achievement as any).periodeMulai).getFullYear();
  }
}

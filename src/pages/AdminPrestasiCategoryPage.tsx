import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlumni } from '@/contexts/AlumniContext';
import { 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Trophy, BookOpen, 
  Shield, Briefcase, FolderOpen, Rocket, GraduationCap, Star, Paperclip,
  Calendar, Building2, User, Award, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { tahunLulusList } from '@/lib/data';
import { 
  getAllAchievements, 
  getAchievementsByCategory 
} from '@/services/achievement.service';
import { 
  Achievement, 
  AchievementCategory, 
  ACHIEVEMENT_CATEGORIES,
  KegiatanAchievement,
  PublikasiAchievement,
  HakiAchievement,
  MagangAchievement,
  WirausahaAchievement,
  PengembanganAchievement,
  PortofolioAchievement
} from '@/types/achievement.types';
import { getStudentStatusLabel, getStudentStatusColor } from '@/data/student-seed-data';
import type { StudentStatus } from '@/types/student.types';

const CATEGORY_CONFIG: Record<AchievementCategory | 'all', { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  label: string;
}> = {
  all: { icon: Star, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Semua Prestasi' },
  kegiatan: { icon: Trophy, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Partisipasi & Prestasi' },
  publikasi: { icon: BookOpen, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Karya Ilmiah & Publikasi' },
  haki: { icon: Shield, color: 'text-success', bgColor: 'bg-success/10', label: 'Kekayaan Intelektual' },
  magang: { icon: Briefcase, color: 'text-info', bgColor: 'bg-info/10', label: 'Pengalaman Akademik Terapan' },
  portofolio: { icon: FolderOpen, color: 'text-muted-foreground', bgColor: 'bg-muted', label: 'Portofolio' },
  wirausaha: { icon: Rocket, color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Pengalaman Wirausaha' },
  pengembangan: { icon: GraduationCap, color: 'text-accent-foreground', bgColor: 'bg-accent/10', label: 'Pengembangan Diri' },
};

function getAchievementDetails(achievement: Achievement) {
  switch (achievement.category) {
    case 'kegiatan': {
      const a = achievement as KegiatanAchievement;
      return { title: a.namaKegiatan, subtitle: a.penyelenggara, year: a.tahun, result: a.prestasi };
    }
    case 'publikasi': {
      const a = achievement as PublikasiAchievement;
      return { title: a.judul, subtitle: a.namaJurnal || a.penerbit || 'Publikasi', year: a.tahun };
    }
    case 'haki': {
      const a = achievement as HakiAchievement;
      return { title: a.judul, subtitle: a.pemegang, year: a.tahunPengajuan, result: a.status };
    }
    case 'magang': {
      const a = achievement as MagangAchievement;
      return { title: `${a.posisi} di ${a.namaPerusahaan}`, subtitle: `${a.industri} • ${a.lokasi}`, year: new Date(a.tanggalMulai).getFullYear() };
    }
    case 'portofolio': {
      const a = achievement as PortofolioAchievement;
      return { title: a.judulProyek, subtitle: a.mataKuliah.toUpperCase(), year: a.tahun, result: a.nilai };
    }
    case 'wirausaha': {
      const a = achievement as WirausahaAchievement;
      return { title: a.namaUsaha, subtitle: `${a.jenisUsaha} • ${a.lokasi}`, year: a.tahunMulai, result: a.masihAktif ? 'Aktif' : 'Tidak Aktif' };
    }
    case 'pengembangan': {
      const a = achievement as PengembanganAchievement;
      return { title: a.namaProgram, subtitle: a.penyelenggara, year: new Date(a.tanggalMulai).getFullYear(), result: a.prestasi };
    }
  }
}

export default function AdminPrestasiCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { masterData } = useAlumni();
  
  const [filterTahun, setFilterTahun] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const validCategory = category as AchievementCategory | 'all' | undefined;
  const categoryConfig = validCategory ? CATEGORY_CONFIG[validCategory] : CATEGORY_CONFIG.all;
  const CategoryIcon = categoryConfig?.icon || Star;

  // Get achievements based on category
  const allAchievements = useMemo(() => {
    return getAllAchievements();
  }, []);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return allAchievements.filter(achievement => {
      const details = getAchievementDetails(achievement);
      const matchTahun = filterTahun === 'all' || details.year === parseInt(filterTahun);
      
      // Get student status from master data
      const student = masterData.find(m => m.id === achievement.masterId);
      const studentStatus = ((student as any)?.status || 'alumni') as StudentStatus;
      const matchStatus = filterStatus === 'all' || studentStatus === filterStatus;
      
      return matchTahun && matchStatus;
    });
  }, [allAchievements, filterTahun, filterStatus, masterData]);

  // Group achievements by year and student
  const groupedData = useMemo(() => {
    const groups: Record<number, Record<string, { student: any; achievements: Achievement[] }>> = {};
    
    filteredAchievements.forEach(achievement => {
      const details = getAchievementDetails(achievement);
      const year = details.year;
      const student = masterData.find(m => m.id === achievement.masterId);
      
      if (!groups[year]) groups[year] = {};
      if (!groups[year][achievement.masterId]) {
        groups[year][achievement.masterId] = { student, achievements: [] };
      }
      groups[year][achievement.masterId].achievements.push(achievement);
    });

    return groups;
  }, [filteredAchievements, masterData]);

  const sortedYears = Object.keys(groupedData).map(Number).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-up">
              <Link to="/admin" className="hover:text-primary transition-colors">
                Dashboard Admin
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">
                {categoryConfig.label}
              </span>
            </nav>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.05s' }}>
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', categoryConfig.bgColor)}>
                <CategoryIcon className={cn('w-6 h-6', categoryConfig.color)} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {categoryConfig.label}
                </h1>
                <p className="text-muted-foreground">
                  {filteredAchievements.length} prestasi ditemukan
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="glass-card rounded-2xl p-4 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={filterTahun} onValueChange={setFilterTahun}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Tahun Prestasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {tahunLulusList.map(t => (
                      <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Status Mahasiswa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Mahasiswa Aktif</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="on_leave">Mahasiswa Cuti</SelectItem>
                    <SelectItem value="dropout">Mahasiswa Dropout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grouped Academic List */}
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {sortedYears.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <CategoryIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Belum ada prestasi pada kategori ini
                  </h3>
                  <p className="text-muted-foreground">
                    untuk filter yang dipilih
                  </p>
                </div>
              ) : (
                sortedYears.map(year => (
                  <div key={year} className="glass-card rounded-2xl overflow-hidden">
                    {/* Year Header */}
                    <div className="px-6 py-4 bg-muted/30 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-xl font-bold text-foreground">{year}</span>
                        <span className="text-sm text-muted-foreground">
                          ({Object.values(groupedData[year]).reduce((acc, g) => acc + g.achievements.length, 0)} prestasi)
                        </span>
                      </div>
                    </div>

                    {/* Students and Achievements */}
                    <div className="divide-y divide-border">
                      {Object.entries(groupedData[year]).map(([studentId, { student, achievements }]) => {
                        const studentStatus = ((student as any)?.status || 'alumni') as StudentStatus;
                        const statusColor = getStudentStatusColor(studentStatus);

                        return (
                          <div key={studentId} className="p-6">
                            {/* Student Info */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">
                                    {student?.nama || 'Unknown'}
                                  </span>
                                  <span className={cn(
                                    'text-xs px-2 py-0.5 rounded-full',
                                    statusColor.bg, statusColor.text
                                  )}>
                                    {getStudentStatusLabel(studentStatus)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  NIM: {student?.nim} • {student?.prodi}
                                </p>
                              </div>
                            </div>

                            {/* Achievements */}
                            <div className="space-y-3 pl-13">
                              {achievements.map(achievement => {
                                const details = getAchievementDetails(achievement);
                                const config = CATEGORY_CONFIG[achievement.category];
                                const Icon = config.icon;
                                const isExpanded = expandedId === achievement.id;
                                const hasAttachments = achievement.attachments && achievement.attachments.length > 0;

                                return (
                                  <div key={achievement.id}>
                                    <div
                                      onClick={() => setExpandedId(isExpanded ? null : achievement.id)}
                                      className={cn(
                                        'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all',
                                        'bg-muted/30 hover:bg-muted/50 border border-transparent',
                                        isExpanded && 'border-primary/30 bg-muted/50'
                                      )}
                                    >
                                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bgColor)}>
                                        <Icon className={cn('w-4 h-4', config.color)} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground line-clamp-1">
                                          {details.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {details.subtitle}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          {details.result && (
                                            <span className={cn('text-xs px-2 py-0.5 rounded-full', config.bgColor, config.color)}>
                                              {details.result}
                                            </span>
                                          )}
                                          {hasAttachments && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <Paperclip className="w-3 h-3" />
                                              Sertifikat tersedia
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                      )}
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                      <div className="mt-2 ml-11 p-4 rounded-xl bg-background border border-border animate-fade-in">
                                        {hasAttachments && (
                                          <div className="flex gap-2 overflow-x-auto pb-3 mb-3 border-b border-border">
                                            {achievement.attachments?.filter(a => a.fileType.startsWith('image/')).map(img => (
                                              <img
                                                key={img.id}
                                                src={img.fileUrl}
                                                alt={img.fileName}
                                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                              />
                                            ))}
                                          </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                          <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Penyelenggara:</span>
                                            <span className="text-foreground">{details.subtitle}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Tahun:</span>
                                            <span className="text-foreground">{details.year}</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

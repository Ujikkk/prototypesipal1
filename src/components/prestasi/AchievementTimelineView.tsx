import { 
  Trophy, BookOpen, Shield, Briefcase, FolderOpen, Rocket, GraduationCap,
  Paperclip, Plus, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Achievement, 
  AchievementCategory, 
  ACHIEVEMENT_CATEGORIES,
  KegiatanAchievement,
  PublikasiAchievement,
  HakiAchievement,
  MagangAchievement,
  PortofolioAchievement,
  WirausahaAchievement,
  PengembanganAchievement
} from '@/types/achievement.types';

interface AchievementTimelineViewProps {
  achievements: Achievement[];
  category: AchievementCategory;
  onItemClick: (achievement: Achievement) => void;
  onAddNew: () => void;
}

const CATEGORY_CONFIG: Record<AchievementCategory, { 
  icon: React.ElementType; 
  color: string; 
  nodeColor: string;
}> = {
  kegiatan: { icon: Trophy, color: 'text-warning', nodeColor: 'bg-warning' },
  publikasi: { icon: BookOpen, color: 'text-primary', nodeColor: 'bg-primary' },
  haki: { icon: Shield, color: 'text-success', nodeColor: 'bg-success' },
  magang: { icon: Briefcase, color: 'text-info', nodeColor: 'bg-info' },
  portofolio: { icon: FolderOpen, color: 'text-muted-foreground', nodeColor: 'bg-muted-foreground' },
  wirausaha: { icon: Rocket, color: 'text-destructive', nodeColor: 'bg-destructive' },
  pengembangan: { icon: GraduationCap, color: 'text-accent-foreground', nodeColor: 'bg-accent' },
};

function getAchievementDetails(achievement: Achievement): { 
  title: string; 
  subtitle: string; 
  year: number;
  level?: string;
  result?: string;
} {
  switch (achievement.category) {
    case 'kegiatan': {
      const a = achievement as KegiatanAchievement;
      return {
        title: a.namaKegiatan,
        subtitle: a.penyelenggara,
        year: a.tahun,
        level: a.tingkat === 'internasional' ? 'Internasional' : 
               a.tingkat === 'nasional' ? 'Nasional' : 
               a.tingkat === 'regional' ? 'Regional' : 'Internal',
        result: a.prestasi,
      };
    }
    case 'publikasi': {
      const a = achievement as PublikasiAchievement;
      return {
        title: a.judul,
        subtitle: a.namaJurnal || a.penerbit || 'Publikasi',
        year: a.tahun,
      };
    }
    case 'haki': {
      const a = achievement as HakiAchievement;
      return {
        title: a.judul,
        subtitle: a.pemegang,
        year: a.tahunPengajuan,
        level: a.jenisHaki.replace('_', ' '),
        result: a.status,
      };
    }
    case 'magang': {
      const a = achievement as MagangAchievement;
      return {
        title: `${a.posisi} di ${a.namaPerusahaan}`,
        subtitle: `${a.industri} • ${a.lokasi}`,
        year: new Date(a.tanggalMulai).getFullYear(),
      };
    }
    case 'portofolio': {
      const a = achievement as PortofolioAchievement;
      return {
        title: a.judulProyek,
        subtitle: a.mataKuliah.toUpperCase(),
        year: a.tahun,
        result: a.nilai ? `Nilai: ${a.nilai}` : undefined,
      };
    }
    case 'wirausaha': {
      const a = achievement as WirausahaAchievement;
      return {
        title: a.namaUsaha,
        subtitle: `${a.jenisUsaha} • ${a.lokasi}`,
        year: a.tahunMulai,
        result: a.masihAktif ? 'Masih Aktif' : 'Tidak Aktif',
      };
    }
    case 'pengembangan': {
      const a = achievement as PengembanganAchievement;
      return {
        title: a.namaProgram,
        subtitle: a.penyelenggara + (a.negara ? ` • ${a.negara}` : ''),
        year: new Date(a.tanggalMulai).getFullYear(),
        result: a.prestasi,
      };
    }
  }
}

export function AchievementTimelineView({ 
  achievements, 
  category, 
  onItemClick, 
  onAddNew 
}: AchievementTimelineViewProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  // Group achievements by year
  const groupedByYear = achievements.reduce((acc, achievement) => {
    const details = getAchievementDetails(achievement);
    const year = details.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push({ achievement, details });
    return acc;
  }, {} as Record<number, { achievement: Achievement; details: ReturnType<typeof getAchievementDetails> }[]>);

  // Sort years descending
  const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  if (achievements.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
          <Icon className={cn('w-10 h-10', config.color)} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Belum ada prestasi di kategori ini
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Yuk, tambahkan pencapaian {ACHIEVEMENT_CATEGORIES[category].label.toLowerCase()}mu
        </p>
        <Button onClick={onAddNew} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prestasi
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

      <div className="space-y-8">
        {sortedYears.map((year) => (
          <div key={year} className="relative">
            {/* Year Marker */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center z-10 relative">
                <span className="font-bold text-foreground">{year}</span>
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Achievements for this year */}
            <div className="md:pl-16 space-y-3">
              {groupedByYear[year].map(({ achievement, details }) => {
                const hasAttachments = achievement.attachments && achievement.attachments.length > 0;

                return (
                  <div
                    key={achievement.id}
                    onClick={() => onItemClick(achievement)}
                    className={cn(
                      'relative p-4 rounded-xl cursor-pointer transition-all duration-200',
                      'bg-card border border-border/50',
                      'hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/30',
                      'group'
                    )}
                  >
                    {/* Timeline Node (Desktop) */}
                    <div className={cn(
                      'hidden md:block absolute -left-[52px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full',
                      config.nodeColor
                    )} />

                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        `${config.nodeColor}/10`
                      )}>
                        <Icon className={cn('w-5 h-5', config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {details.title}
                          </h4>
                          {details.level && (
                            <span className={cn(
                              'text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0',
                              `${config.nodeColor}/10`,
                              config.color
                            )}>
                              {details.level}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {details.subtitle}
                        </p>

                        {details.result && (
                          <p className="text-sm font-medium text-foreground mt-1">
                            {details.result}
                          </p>
                        )}

                        {/* Attachments Indicator */}
                        {hasAttachments && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Sertifikat tersedia
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

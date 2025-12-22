import { 
  Trophy, BookOpen, Shield, Briefcase, FolderOpen, Rocket, Sprout, Mic2, Users2,
  ChevronRight, Paperclip, ExternalLink, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Achievement, 
  AchievementCategory,
  LombaAchievement,
  SeminarAchievement,
  PublikasiAchievement,
  HakiAchievement,
  MagangAchievement,
  PortofolioAchievement,
  WirausahaAchievement,
  PengembanganAchievement,
  OrganisasiAchievement
} from '@/types/achievement.types';

interface AchievementTimelineProps {
  achievements: Achievement[];
  maxItems?: number;
  contextText?: string;
  onViewAll?: () => void;
  onAddNew?: () => void;
  className?: string;
}

const CATEGORY_CONFIG: Record<string, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  label: string;
}> = {
  lomba: { icon: Trophy, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Lomba' },
  seminar: { icon: Mic2, color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'Seminar' },
  publikasi: { icon: BookOpen, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Publikasi' },
  haki: { icon: Shield, color: 'text-success', bgColor: 'bg-success/10', label: 'HAKI' },
  magang: { icon: Briefcase, color: 'text-info', bgColor: 'bg-info/10', label: 'Magang' },
  portofolio: { icon: FolderOpen, color: 'text-orange-500', bgColor: 'bg-orange-500/10', label: 'Portofolio' },
  wirausaha: { icon: Rocket, color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Wirausaha' },
  pengembangan: { icon: Sprout, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', label: 'Pengembangan' },
  organisasi: { icon: Users2, color: 'text-sky-500', bgColor: 'bg-sky-500/10', label: 'Organisasi' },
  // Fallback for legacy/unknown categories
  kegiatan: { icon: Trophy, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Kegiatan' },
};

const DEFAULT_CONFIG = { icon: HelpCircle, color: 'text-muted-foreground', bgColor: 'bg-muted', label: 'Lainnya' };

function getAchievementTitle(achievement: Achievement): string {
  switch (achievement.category) {
    case 'lomba': return (achievement as LombaAchievement).namaLomba;
    case 'seminar': return (achievement as SeminarAchievement).namaSeminar;
    case 'publikasi': return (achievement as PublikasiAchievement).judul;
    case 'haki': return (achievement as HakiAchievement).judul;
    case 'magang': return `${(achievement as MagangAchievement).posisi} - ${(achievement as MagangAchievement).namaPerusahaan}`;
    case 'portofolio': return (achievement as PortofolioAchievement).judulProyek;
    case 'wirausaha': return (achievement as WirausahaAchievement).namaUsaha;
    case 'pengembangan': return (achievement as PengembanganAchievement).namaProgram;
    case 'organisasi': return `${(achievement as OrganisasiAchievement).jabatan} - ${(achievement as OrganisasiAchievement).namaOrganisasi}`;
    default: return (achievement as any).namaKegiatan || (achievement as any).judul || 'Prestasi';
  }
}

function getAchievementYear(achievement: Achievement): number {
  switch (achievement.category) {
    case 'lomba': return (achievement as LombaAchievement).tahun;
    case 'seminar': return (achievement as SeminarAchievement).tahun;
    case 'publikasi': return (achievement as PublikasiAchievement).tahun;
    case 'haki': return (achievement as HakiAchievement).tahunPengajuan;
    case 'magang': return new Date((achievement as MagangAchievement).tanggalMulai).getFullYear();
    case 'portofolio': return (achievement as PortofolioAchievement).tahun;
    case 'wirausaha': return (achievement as WirausahaAchievement).tahunMulai;
    case 'pengembangan': return new Date((achievement as PengembanganAchievement).tanggalMulai).getFullYear();
    case 'organisasi': return new Date((achievement as OrganisasiAchievement).periodeMulai).getFullYear();
    default: return (achievement as any).tahun || new Date().getFullYear();
  }
}

function getAchievementSubtitle(achievement: Achievement): string | undefined {
  switch (achievement.category) {
    case 'lomba': {
      const a = achievement as LombaAchievement;
      return a.peringkat || a.penyelenggara;
    }
    case 'seminar': {
      const a = achievement as SeminarAchievement;
      return `${a.peran} • ${a.penyelenggara}`;
    }
    case 'publikasi': {
      const a = achievement as PublikasiAchievement;
      return a.namaJurnal || a.penerbit;
    }
    case 'haki': {
      const a = achievement as HakiAchievement;
      return `${a.jenisHaki.replace('_', ' ')} • ${a.status}`;
    }
    case 'magang': return (achievement as MagangAchievement).lokasi;
    case 'portofolio': return (achievement as PortofolioAchievement).mataKuliah;
    case 'wirausaha': {
      const a = achievement as WirausahaAchievement;
      return `${a.jenisUsaha} • ${a.masihAktif ? 'Aktif' : 'Tidak Aktif'}`;
    }
    case 'pengembangan': {
      const a = achievement as PengembanganAchievement;
      return a.penyelenggara;
    }
    case 'organisasi': {
      const a = achievement as OrganisasiAchievement;
      return a.masihAktif ? 'Masih Aktif' : 'Selesai';
    }
    default: return (achievement as any).penyelenggara || (achievement as any).tingkat;
  }
}

export function AchievementTimeline({ 
  achievements, 
  maxItems = 5, 
  contextText,
  onViewAll, 
  onAddNew,
  className 
}: AchievementTimelineProps) {
  // Sort by year descending
  const sortedAchievements = [...achievements].sort((a, b) => getAchievementYear(b) - getAchievementYear(a));
  const displayItems = sortedAchievements.slice(0, maxItems);
  const hasMore = achievements.length > maxItems;

  return (
    <div className={cn('glass-card rounded-2xl p-6 flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Riwayat Prestasi</h3>
            <p className="text-sm text-muted-foreground">Pencapaian non-akademik</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
          {achievements.length} prestasi
        </span>
      </div>

      {/* Timeline */}
      {displayItems.length > 0 ? (
        <div className="flex-1">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-3">
              {displayItems.map((achievement, index) => {
                const config = CATEGORY_CONFIG[achievement.category] || DEFAULT_CONFIG;
                const Icon = config.icon;
                const year = getAchievementYear(achievement);
                const title = getAchievementTitle(achievement);
                const subtitle = getAchievementSubtitle(achievement);
                const hasAttachments = achievement.attachments && achievement.attachments.length > 0;

                return (
                  <div 
                    key={achievement.id} 
                    className="relative flex gap-4"
                  >
                    {/* Year & Node */}
                    <div className="flex flex-col items-center w-10 flex-shrink-0">
                      <span className="text-xs font-semibold text-muted-foreground mb-2">{year}</span>
                      <div className={cn('w-3 h-3 rounded-full z-10 border-2 border-background', config.bgColor.replace('/10', ''))} />
                    </div>

                    {/* Content */}
                    <div 
                      className={cn(
                        'flex-1 p-3 rounded-xl transition-all duration-200 min-w-0',
                        'hover:shadow-soft hover:-translate-y-0.5 cursor-pointer',
                        'bg-muted/50 hover:bg-muted/70'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bgColor)}>
                          <Icon className={cn('w-4 h-4', config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm break-words">{title}</h4>
                          {subtitle && (
                            <p className="text-xs text-muted-foreground break-words capitalize">{subtitle}</p>
                          )}
                          {hasAttachments && (
                            <div className="flex items-center gap-1 mt-1">
                              <Paperclip className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">Sertifikat tersedia</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Context Text */}
          {contextText && (
            <p className="text-xs text-muted-foreground italic mt-4">{contextText}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            {(hasMore || onViewAll) && (
              <Button variant="ghost" className="flex-1" onClick={onViewAll}>
                Lihat semua prestasi
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {onAddNew && (
              <Button variant="outline" className="flex-1" onClick={onAddNew}>
                Tambah prestasi baru
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-muted-foreground" />
          </div>
          <h4 className="font-semibold text-foreground mb-1">Belum Ada Prestasi</h4>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
            Yuk, tambahkan pencapaian non-akademikmu
          </p>
          {onAddNew && (
            <Button onClick={onAddNew}>
              Tambah Prestasi Pertama
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

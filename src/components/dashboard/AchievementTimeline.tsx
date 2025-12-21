import { 
  Trophy, BookOpen, Shield, Briefcase, FolderOpen, Rocket, GraduationCap,
  ChevronRight, Paperclip, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Achievement, AchievementCategory } from '@/types/achievement.types';

interface AchievementTimelineProps {
  achievements: Achievement[];
  maxItems?: number;
  onViewAll?: () => void;
  onAddNew?: () => void;
  className?: string;
}

const CATEGORY_CONFIG: Record<AchievementCategory, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  label: string;
}> = {
  kegiatan: { icon: Trophy, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Kegiatan' },
  publikasi: { icon: BookOpen, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Publikasi' },
  haki: { icon: Shield, color: 'text-success', bgColor: 'bg-success/10', label: 'HAKI' },
  magang: { icon: Briefcase, color: 'text-info', bgColor: 'bg-info/10', label: 'Magang' },
  portofolio: { icon: FolderOpen, color: 'text-secondary-foreground', bgColor: 'bg-secondary', label: 'Portofolio' },
  wirausaha: { icon: Rocket, color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Wirausaha' },
  pengembangan: { icon: GraduationCap, color: 'text-accent-foreground', bgColor: 'bg-accent', label: 'Pengembangan' },
};

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

function getAchievementSubtitle(achievement: Achievement): string | undefined {
  switch (achievement.category) {
    case 'kegiatan': return achievement.prestasi || achievement.penyelenggara;
    case 'publikasi': return achievement.namaJurnal || achievement.penerbit;
    case 'haki': return `${achievement.jenisHaki.replace('_', ' ')} • ${achievement.status}`;
    case 'magang': return achievement.lokasi;
    case 'portofolio': return achievement.mataKuliah.toUpperCase();
    case 'wirausaha': return `${achievement.jenisUsaha} • ${achievement.masihAktif ? 'Aktif' : 'Tidak Aktif'}`;
    case 'pengembangan': return achievement.negara || achievement.penyelenggara;
  }
}

export function AchievementTimeline({ 
  achievements, 
  maxItems = 5, 
  onViewAll, 
  onAddNew,
  className 
}: AchievementTimelineProps) {
  // Sort by year descending
  const sortedAchievements = [...achievements].sort((a, b) => getAchievementYear(b) - getAchievementYear(a));
  const displayItems = sortedAchievements.slice(0, maxItems);
  const hasMore = achievements.length > maxItems;

  return (
    <div className={cn('glass-card rounded-2xl p-6', className)}>
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
        <>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-3">
              {displayItems.map((achievement, index) => {
                const config = CATEGORY_CONFIG[achievement.category];
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
                      <div className={cn('w-3 h-3 rounded-full z-10 border-2 border-background', config.bgColor.replace('/10', ''))} 
                        style={{ backgroundColor: `hsl(var(--${achievement.category === 'kegiatan' ? 'warning' : achievement.category === 'publikasi' ? 'primary' : achievement.category === 'haki' ? 'success' : achievement.category === 'magang' ? 'info' : achievement.category === 'wirausaha' ? 'destructive' : 'accent'}))` }}
                      />
                    </div>

                    {/* Content */}
                    <div 
                      className={cn(
                        'flex-1 p-3 rounded-xl transition-all duration-200',
                        'hover:shadow-soft hover:-translate-y-0.5 cursor-pointer',
                        'bg-muted/50 hover:bg-muted/70'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bgColor)}>
                          <Icon className={cn('w-4 h-4', config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">{title}</h4>
                          {subtitle && (
                            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                          )}
                          {hasAttachments && (
                            <div className="flex items-center gap-1 mt-1">
                              <Paperclip className="w-3 h-3 text-muted-foreground" />
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

          {/* Actions */}
          <div className="flex gap-2 mt-5">
            {hasMore && onViewAll && (
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
        </>
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

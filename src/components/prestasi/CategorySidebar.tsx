import { 
  Trophy, BookOpen, Shield, Briefcase, Rocket, Globe, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AchievementCategory } from '@/types/achievement.types';

// Extended category type to include 'all'
export type CategoryFilter = AchievementCategory | 'all';

interface CategorySidebarProps {
  activeCategory: CategoryFilter;
  stats: Record<AchievementCategory, number>;
  onCategoryChange: (category: CategoryFilter) => void;
}

// Updated category configuration with new labels
const CATEGORY_CONFIG: Record<CategoryFilter, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  label: string;
  description?: string;
}> = {
  all: {
    icon: Star,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Semua Prestasi',
    description: 'Lihat semua pencapaian',
  },
  kegiatan: { 
    icon: Trophy, 
    color: 'text-warning', 
    bgColor: 'bg-warning/10',
    label: 'Partisipasi & Prestasi',
    description: 'Lomba, seminar, kompetisi',
  },
  publikasi: { 
    icon: BookOpen, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    label: 'Karya Ilmiah & Publikasi',
    description: 'Jurnal, prosiding, buku',
  },
  haki: { 
    icon: Shield, 
    color: 'text-success', 
    bgColor: 'bg-success/10',
    label: 'Kekayaan Intelektual',
    description: 'Hak cipta, paten, merek',
  },
  magang: { 
    icon: Briefcase, 
    color: 'text-info', 
    bgColor: 'bg-info/10',
    label: 'Pengalaman Akademik Terapan',
    description: 'Magang, kerja praktik',
  },
  wirausaha: { 
    icon: Rocket, 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10',
    label: 'Pengalaman Wirausaha',
    description: 'Usaha, startup, bisnis',
  },
  pengembangan: { 
    icon: Globe, 
    color: 'text-accent-foreground', 
    bgColor: 'bg-accent',
    label: 'Pengembangan Diri',
    description: 'Exchange, volunteer, organisasi',
  },
  // Note: portofolio merged into pengembangan conceptually
  portofolio: { 
    icon: BookOpen, 
    color: 'text-muted-foreground', 
    bgColor: 'bg-muted',
    label: 'Portofolio',
    description: 'Proyek praktikum',
  },
};

// Categories in display order (without portofolio as it's merged)
const categories: CategoryFilter[] = [
  'all', 'kegiatan', 'publikasi', 'haki', 'magang', 'wirausaha', 'pengembangan'
];

export function CategorySidebar({ activeCategory, stats, onCategoryChange }: CategorySidebarProps) {
  const totalCount = Object.values(stats).reduce((a, b) => a + b, 0);

  const getCount = (key: CategoryFilter): number => {
    if (key === 'all') return totalCount;
    // Merge portofolio into pengembangan for count
    if (key === 'pengembangan') return (stats.pengembangan || 0) + (stats.portofolio || 0);
    return stats[key] || 0;
  };

  return (
    <>
      {/* Desktop Sidebar - Sticky */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-28 space-y-2">
          {/* Sidebar Header */}
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Kategori Prestasi
            </h3>
          </div>

          {/* Category Navigation */}
          <nav className="space-y-1">
            {categories.map((key) => {
              const config = CATEGORY_CONFIG[key];
              const Icon = config.icon;
              const isActive = activeCategory === key;
              const count = getCount(key);

              return (
                <button
                  key={key}
                  onClick={() => onCategoryChange(key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'hover:bg-muted/80 text-foreground'
                  )}
                >
                  {/* Icon Container */}
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0',
                    isActive 
                      ? 'bg-primary-foreground/20' 
                      : config.bgColor
                  )}>
                    <Icon className={cn(
                      'w-4.5 h-4.5 transition-colors',
                      isActive ? 'text-primary-foreground' : config.color
                    )} />
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      'text-sm font-medium block leading-tight',
                      isActive ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {config.label}
                    </span>
                  </div>

                  {/* Count Badge */}
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 min-w-[24px] text-center',
                    isActive 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Horizontal Tabs */}
      <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {categories.map((key) => {
            const config = CATEGORY_CONFIG[key];
            const Icon = config.icon;
            const isActive = activeCategory === key;
            const count = getCount(key);

            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-soft' 
                    : 'bg-card border border-border/50 hover:bg-muted text-foreground'
                )}
              >
                <Icon className={cn(
                  'w-4 h-4',
                  isActive ? 'text-primary-foreground' : config.color
                )} />
                <span className="text-sm font-medium">
                  {key === 'all' ? 'Semua' : config.label.split(' ')[0]}
                </span>
                <span className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                  isActive 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
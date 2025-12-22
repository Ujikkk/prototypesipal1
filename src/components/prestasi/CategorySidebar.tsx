import { 
  Trophy, BookOpen, Shield, Rocket, Star, FlaskConical, Globe
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

// Category configuration with proper icons (STRICT ORDER per spec)
const CATEGORY_CONFIG: Record<CategoryFilter, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  label: string;
  shortLabel: string;
}> = {
  all: {
    icon: Star,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Semua Prestasi',
    shortLabel: 'Semua',
  },
  partisipasi: { 
    icon: Trophy, 
    color: 'text-warning', 
    bgColor: 'bg-warning/10',
    label: 'Partisipasi & Prestasi',
    shortLabel: 'Partisipasi',
  },
  publikasi: { 
    icon: BookOpen, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    label: 'Karya Ilmiah & Publikasi',
    shortLabel: 'Publikasi',
  },
  haki: { 
    icon: Shield, 
    color: 'text-success', 
    bgColor: 'bg-success/10',
    label: 'Kekayaan Intelektual',
    shortLabel: 'HAKI',
  },
  akademik_terapan: { 
    icon: FlaskConical, 
    color: 'text-info', 
    bgColor: 'bg-info/10',
    label: 'Pengalaman Akademik Terapan',
    shortLabel: 'Akademik',
  },
  wirausaha: { 
    icon: Rocket, 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10',
    label: 'Pengalaman Wirausaha',
    shortLabel: 'Wirausaha',
  },
  pengembangan: { 
    icon: Globe, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-500/10',
    label: 'Pengembangan Diri',
    shortLabel: 'Pengembangan',
  },
};

// Categories in STRICT display order per spec
const categories: CategoryFilter[] = [
  'all', 
  'partisipasi', 
  'publikasi', 
  'haki', 
  'akademik_terapan', 
  'wirausaha', 
  'pengembangan'
];

export function CategorySidebar({ activeCategory, stats, onCategoryChange }: CategorySidebarProps) {
  const totalCount = Object.values(stats).reduce((a, b) => a + b, 0);

  const getCount = (key: CategoryFilter): number => {
    if (key === 'all') return totalCount;
    return stats[key] || 0;
  };

  return (
    <>
      {/* Desktop Sidebar - Sticky */}
      <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
        <div className="sticky top-28 space-y-1.5">
          {/* Sidebar Header */}
          <div className="px-3 py-2 mb-2">
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
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'hover:bg-muted/80 text-foreground'
                  )}
                >
                  {/* Icon Container */}
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0',
                    isActive 
                      ? 'bg-primary-foreground/20' 
                      : config.bgColor
                  )}>
                    <Icon className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-primary-foreground' : config.color
                    )} />
                  </div>

                  {/* Label - never truncated */}
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
      <div className="lg:hidden mb-5 -mx-4 px-4 overflow-x-auto scrollbar-hide">
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
                  'flex items-center gap-2 px-3.5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap',
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
                  {config.shortLabel}
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

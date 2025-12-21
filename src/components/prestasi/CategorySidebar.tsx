import { 
  Trophy, BookOpen, Shield, Briefcase, FolderOpen, Rocket, GraduationCap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AchievementCategory, ACHIEVEMENT_CATEGORIES } from '@/types/achievement.types';

interface CategorySidebarProps {
  activeCategory: AchievementCategory;
  stats: Record<AchievementCategory, number>;
  onCategoryChange: (category: AchievementCategory) => void;
}

const CATEGORY_CONFIG: Record<AchievementCategory, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  activeColor: string;
  activeBg: string;
}> = {
  kegiatan: { 
    icon: Trophy, 
    color: 'text-warning', 
    bgColor: 'bg-warning/10',
    activeColor: 'text-warning-foreground',
    activeBg: 'bg-warning'
  },
  publikasi: { 
    icon: BookOpen, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    activeColor: 'text-primary-foreground',
    activeBg: 'bg-primary'
  },
  haki: { 
    icon: Shield, 
    color: 'text-success', 
    bgColor: 'bg-success/10',
    activeColor: 'text-success-foreground',
    activeBg: 'bg-success'
  },
  magang: { 
    icon: Briefcase, 
    color: 'text-info', 
    bgColor: 'bg-info/10',
    activeColor: 'text-info-foreground',
    activeBg: 'bg-info'
  },
  portofolio: { 
    icon: FolderOpen, 
    color: 'text-muted-foreground', 
    bgColor: 'bg-muted',
    activeColor: 'text-foreground',
    activeBg: 'bg-muted-foreground'
  },
  wirausaha: { 
    icon: Rocket, 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10',
    activeColor: 'text-destructive-foreground',
    activeBg: 'bg-destructive'
  },
  pengembangan: { 
    icon: GraduationCap, 
    color: 'text-accent-foreground', 
    bgColor: 'bg-accent',
    activeColor: 'text-accent-foreground',
    activeBg: 'bg-accent'
  },
};

const categories: AchievementCategory[] = [
  'kegiatan', 'publikasi', 'haki', 'magang', 'portofolio', 'wirausaha', 'pengembangan'
];

export function CategorySidebar({ activeCategory, stats, onCategoryChange }: CategorySidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-28 glass-card rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-4 px-2">Kategori Prestasi</h3>
          <nav className="space-y-1">
            {categories.map((key) => {
              const config = CATEGORY_CONFIG[key];
              const Icon = config.icon;
              const isActive = activeCategory === key;
              const count = stats[key];

              return (
                <button
                  key={key}
                  onClick={() => onCategoryChange(key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'hover:bg-muted/70 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                    isActive ? 'bg-primary-foreground/20' : config.bgColor
                  )}>
                    <Icon className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-primary-foreground' : config.color
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      'text-sm font-medium block truncate',
                      isActive ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {ACHIEVEMENT_CATEGORIES[key].label}
                    </span>
                  </div>
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
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
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {categories.map((key) => {
            const config = CATEGORY_CONFIG[key];
            const Icon = config.icon;
            const isActive = activeCategory === key;
            const count = stats[key];

            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-soft' 
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                )}
              >
                <Icon className={cn(
                  'w-4 h-4',
                  isActive ? 'text-primary-foreground' : config.color
                )} />
                <span className="text-sm font-medium">
                  {ACHIEVEMENT_CATEGORIES[key].label.split(' ')[0]}
                </span>
                <span className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                  isActive 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-background text-muted-foreground'
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

import { 
  GraduationCap, Trophy, Award, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlumniMaster } from '@/types';
import type { AchievementCategory } from '@/types/achievement.types';

interface StudentProfileHeaderProps {
  student: AlumniMaster;
  stats: Record<AchievementCategory, number>;
}

export function StudentProfileHeader({ student, stats }: StudentProfileHeaderProps) {
  const totalAchievements = Object.values(stats).reduce((a, b) => a + b, 0);
  
  // Calculate top categories
  const topCategories = Object.entries(stats)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6 shadow-soft mb-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Student Photo */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden ring-4 ring-background shadow-soft">
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary/60" />
          </div>
          {/* Status Badge */}
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-soft bg-success/10 text-success">
            Alumni
          </div>
        </div>

        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {student.nama}
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{student.nim}</span>
            <span className="hidden sm:inline">•</span>
            <span>{student.prodi}</span>
            <span className="hidden sm:inline">•</span>
            <span>Lulus {student.tahunLulus}</span>
          </div>

          {/* Achievement Summary */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Total Achievements */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50">
              <Trophy className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold text-foreground">{totalAchievements}</span>
              <span className="text-xs text-muted-foreground">prestasi</span>
            </div>

            {/* Top Categories Indicator */}
            {topCategories.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                {topCategories.map(([category, count]) => (
                  <div 
                    key={category}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-background border border-border/50 text-xs"
                  >
                    <span className="text-muted-foreground capitalize">
                      {category === 'publikasi' ? 'Publikasi' : 
                       category === 'haki' ? 'HAKI' :
                       category === 'magang' ? 'Magang' :
                       category === 'wirausaha' ? 'Wirausaha' :
                       category === 'pengembangan' ? 'Pengembangan' :
                       category === 'organisasi' ? 'Organisasi' :
                       category === 'portofolio' ? 'Portofolio' :
                       category === 'seminar' ? 'Seminar' :
                       category === 'lomba' ? 'Lomba' : category}
                    </span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats - Desktop */}
        <div className="hidden lg:flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Jurusan:</span>
            <span className="font-semibold text-foreground">{student.jurusan}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

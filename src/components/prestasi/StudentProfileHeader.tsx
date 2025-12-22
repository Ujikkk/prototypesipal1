import { 
  User, Trophy, Star, GraduationCap, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlumniMaster } from '@/types';
import type { AchievementCategory } from '@/types/achievement.types';

// Student status type
export type StudentStatusType = 'aktif' | 'alumni' | 'cuti' | 'dropout';

interface StudentProfileHeaderProps {
  student: AlumniMaster;
  stats: Record<AchievementCategory, number>;
  studentStatus?: StudentStatusType;
  unggulanCount?: number;
  highestLevel?: string | null;
}

// Status configuration
const STATUS_CONFIG: Record<StudentStatusType, { label: string; color: string; bgColor: string }> = {
  aktif: { label: 'Mahasiswa Aktif', color: 'text-success', bgColor: 'bg-success/10' },
  alumni: { label: 'Alumni', color: 'text-primary', bgColor: 'bg-primary/10' },
  cuti: { label: 'Cuti', color: 'text-warning', bgColor: 'bg-warning/10' },
  dropout: { label: 'Dropout', color: 'text-muted-foreground', bgColor: 'bg-muted' },
};

const LEVEL_LABELS: Record<string, string> = {
  'internasional': 'Internasional',
  'nasional': 'Nasional',
  'regional': 'Regional',
  'lokal': 'Lokal',
};

export function StudentProfileHeader({ 
  student, 
  stats,
  studentStatus = 'alumni',
  unggulanCount = 0,
  highestLevel = null,
}: StudentProfileHeaderProps) {
  const totalAchievements = Object.values(stats).reduce((a, b) => a + b, 0);
  const statusConfig = STATUS_CONFIG[studentStatus];

  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-soft mb-6 overflow-hidden animate-fade-up">
      {/* Subtle gradient top accent */}
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Left: Photo + Basic Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden ring-2 ring-border shadow-soft">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary/60" />
              </div>
              {/* Status Badge */}
              <div className={cn(
                "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm border border-background",
                statusConfig.bgColor,
                statusConfig.color
              )}>
                {statusConfig.label}
              </div>
            </div>

            {/* Student Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                {student.nama}
              </h2>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{student.nim}</span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="truncate">{student.prodi}</span>
              </div>

              <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Angkatan {student.tahunLulus - 4} • Lulus {student.tahunLulus}</span>
              </div>
            </div>
          </div>

          {/* Right: Achievement Indicators */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50 sm:border-l sm:pl-6">
            {/* Total Achievements */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/30">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-warning" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground leading-none">{totalAchievements}</div>
                <div className="text-[11px] text-muted-foreground">Prestasi</div>
              </div>
            </div>

            {/* Featured/Unggulan Count */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/30">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary fill-primary/30" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground leading-none">{unggulanCount}</div>
                <div className="text-[11px] text-muted-foreground">Unggulan</div>
              </div>
            </div>

            {/* Highest Level */}
            {highestLevel && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/30">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-success" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground leading-tight">{LEVEL_LABELS[highestLevel] || highestLevel}</div>
                  <div className="text-[11px] text-muted-foreground">Level Tertinggi</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

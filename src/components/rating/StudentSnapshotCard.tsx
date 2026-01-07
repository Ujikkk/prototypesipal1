/**
 * Student Snapshot Card Component
 * Read-only display of selected student information
 */

import { User, GraduationCap, Calendar, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudentSnapshot } from '@/types/rating.types';

interface StudentSnapshotCardProps {
  student: StudentSnapshot;
  className?: string;
}

export function StudentSnapshotCard({ student, className }: StudentSnapshotCardProps) {
  return (
    <div className={cn('glass-card rounded-2xl p-5 bg-primary/5 border-primary/20', className)}>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <User className="w-7 h-7 text-primary-foreground" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">{student.nama}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-primary" />
              {student.nim}
            </span>
            {student.tahunLulus && (
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                Lulus {student.tahunLulus}
              </span>
            )}
            {student.careerStatus && (
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-primary" />
                {student.careerStatus}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{student.prodi}</p>
        </div>

        {/* Polines Badge */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-xs font-medium text-primary">Politeknik Negeri Semarang</span>
          <span className="text-[10px] text-muted-foreground">Program Studi ABT</span>
        </div>
      </div>
    </div>
  );
}

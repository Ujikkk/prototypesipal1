/**
 * StudentStatusBadge Component
 * Role identity badge for admin dashboard
 * 
 * DESIGN RULES:
 * - 🟦 Mahasiswa Aktif (Blue)
 * - 🟩 Alumni (Green)
 * - 🟨 Mahasiswa Cuti (Yellow/Warning)
 * - 🟥 Mahasiswa Dropout (Red)
 */

import { cn } from '@/lib/utils';
import type { StudentStatus } from '@/types/student.types';

interface StudentStatusBadgeProps {
  status: StudentStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIG: Record<StudentStatus, {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  active: {
    label: 'Mahasiswa Aktif',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  alumni: {
    label: 'Alumni',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  on_leave: {
    label: 'Mahasiswa Cuti',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  dropout: {
    label: 'Mahasiswa Dropout',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500/30',
  },
};

export function StudentStatusBadge({ 
  status, 
  size = 'md',
  className 
}: StudentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium border whitespace-nowrap',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}

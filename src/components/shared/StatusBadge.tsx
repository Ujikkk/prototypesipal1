import { cn } from '@/lib/utils';
import { Briefcase, Search, Rocket, BookOpen } from 'lucide-react';

interface StatusBadgeProps {
  status: 'bekerja' | 'mencari' | 'wirausaha' | 'studi';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  bekerja: {
    label: 'Bekerja',
    class: 'status-bekerja',
    icon: Briefcase,
  },
  mencari: {
    label: 'Mencari Kerja',
    class: 'status-mencari',
    icon: Search,
  },
  wirausaha: {
    label: 'Wirausaha',
    class: 'status-wirausaha',
    icon: Rocket,
  },
  studi: {
    label: 'Studi Lanjut',
    class: 'status-studi',
    icon: BookOpen,
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = false,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        config.class,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  icon: ReactNode;
  iconBgClass?: string;
  primaryLabel?: string;
  primaryValue?: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  highlight?: {
    label: string;
    value: string;
  };
  ctaLabel: string;
  ctaVariant?: 'default' | 'secondary' | 'outline';
  onCtaClick: () => void;
  className?: string;
}

export function SummaryCard({
  title,
  icon,
  iconBgClass = 'bg-primary/10',
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  highlight,
  ctaLabel,
  ctaVariant = 'default',
  onCtaClick,
  className,
}: SummaryCardProps) {
  return (
    <div 
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-elevated group',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBgClass)}>
          {icon}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>

      {/* Content */}
      <div className="space-y-3 mb-5">
        {primaryLabel && primaryValue && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{primaryLabel}</span>
            <span className="font-semibold text-foreground">{primaryValue}</span>
          </div>
        )}

        {secondaryLabel && secondaryValue && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{secondaryLabel}</span>
            <span className="text-sm text-foreground">{secondaryValue}</span>
          </div>
        )}

        {highlight && (
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground mb-0.5">{highlight.label}</p>
            <p className="font-medium text-foreground text-sm line-clamp-1">{highlight.value}</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <Button 
        variant={ctaVariant} 
        className="w-full" 
        onClick={onCtaClick}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}

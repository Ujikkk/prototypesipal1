/**
 * Star Rating Component
 * Interactive 1-5 star rating input
 */

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RATING_LABELS } from '@/constants/rating.constants';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
};

export function StarRating({
  value,
  onChange,
  size = 'md',
  readonly = false,
  showLabel = true,
  className,
}: StarRatingProps) {
  const handleClick = (rating: number) => {
    if (!readonly) {
      onChange(rating);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={readonly}
            className={cn(
              'transition-all duration-150',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-150',
                star <= value
                  ? 'fill-warning text-warning'
                  : 'fill-transparent text-muted-foreground/30 hover:text-warning/50'
              )}
            />
          </button>
        ))}
      </div>
      {showLabel && value > 0 && (
        <span className="text-sm font-medium text-foreground">
          {RATING_LABELS[value]}
        </span>
      )}
    </div>
  );
}

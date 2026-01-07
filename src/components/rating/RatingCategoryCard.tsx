/**
 * Rating Category Card Component
 * Displays a rating category with questions and star input
 */

import { cn } from '@/lib/utils';
import { StarRating } from './StarRating';
import type { RatingCategoryConfig } from '@/types/rating.types';

interface RatingCategoryCardProps {
  config: RatingCategoryConfig;
  value: number;
  onChange: (value: number) => void;
  index: number;
  className?: string;
}

export function RatingCategoryCard({
  config,
  value,
  onChange,
  index,
  className,
}: RatingCategoryCardProps) {
  const isValid = value > 0;

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-300 animate-fade-up',
        isValid ? 'border-success/20 bg-success/5' : 'border-border',
        className
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Kategori {index + 1}
            </span>
            {isValid && (
              <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                ✓ Dinilai
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg text-foreground">{config.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2 mb-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Aspek yang dinilai:
        </p>
        <ul className="space-y-1.5">
          {config.questions.map((question, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
              <span className="text-primary mt-0.5">•</span>
              {question}
            </li>
          ))}
        </ul>
      </div>

      {/* Rating Input */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Berikan penilaian:
          </span>
          <StarRating value={value} onChange={onChange} size="lg" />
        </div>
      </div>
    </div>
  );
}

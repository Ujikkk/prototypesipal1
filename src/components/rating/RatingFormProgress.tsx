/**
 * Rating Form Progress Component
 * Step progress indicator for multi-step form
 */

import { User, Star, MessageSquare, Building2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FORM_STEPS } from '@/constants/rating.constants';
import type { RatingFormState } from '@/types/rating.types';

const iconMap = {
  User,
  Star,
  MessageSquare,
  Building2,
  CheckCircle,
};

interface RatingFormProgressProps {
  currentStep: RatingFormState['step'];
  className?: string;
}

export function RatingFormProgress({ currentStep, className }: RatingFormProgressProps) {
  const currentIndex = FORM_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {FORM_STEPS.map((step, index) => {
        const Icon = iconMap[step.icon as keyof typeof iconMap];
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;
        const isLast = index === FORM_STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                  isCompleted && 'bg-success text-success-foreground',
                  isActive && 'bg-primary text-primary-foreground shadow-glow',
                  !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium mt-2 text-center hidden sm:block',
                  isActive && 'text-primary',
                  isCompleted && 'text-success',
                  !isActive && !isCompleted && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-colors duration-300',
                  index < currentIndex ? 'bg-success' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

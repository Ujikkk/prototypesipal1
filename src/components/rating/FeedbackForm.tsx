/**
 * Feedback Form Component
 * Open-ended feedback section for qualitative input
 */

import { ThumbsUp, TrendingUp, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { GraduateFeedback } from '@/types/rating.types';

interface FeedbackFormProps {
  value: GraduateFeedback;
  onChange: (value: GraduateFeedback) => void;
  className?: string;
}

export function FeedbackForm({ value, onChange, className }: FeedbackFormProps) {
  const handleChange = (field: keyof GraduateFeedback, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className={cn('space-y-6', className)}>
      <p className="text-sm text-muted-foreground">
        Bagian ini bersifat opsional namun sangat membantu untuk pengembangan kualitas lulusan.
      </p>

      {/* Strengths */}
      <div className="space-y-2 animate-fade-up">
        <Label htmlFor="strengths" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <ThumbsUp className="w-4 h-4 text-success" />
          </div>
          <span>Kelebihan Lulusan</span>
        </Label>
        <Textarea
          id="strengths"
          placeholder="Apa saja kelebihan lulusan yang Anda apresiasi?"
          value={value.strengths || ''}
          onChange={(e) => handleChange('strengths', e.target.value)}
          className="min-h-[100px] rounded-xl resize-none"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(value.strengths?.length || 0)}/500 karakter
        </p>
      </div>

      {/* Areas for Improvement */}
      <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <Label htmlFor="improvements" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-warning" />
          </div>
          <span>Area yang Perlu Ditingkatkan</span>
        </Label>
        <Textarea
          id="improvements"
          placeholder="Aspek apa yang perlu ditingkatkan oleh lulusan?"
          value={value.improvements || ''}
          onChange={(e) => handleChange('improvements', e.target.value)}
          className="min-h-[100px] rounded-xl resize-none"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(value.improvements?.length || 0)}/500 karakter
        </p>
      </div>

      {/* General Comments */}
      <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <Label htmlFor="generalComments" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-info" />
          </div>
          <span>Komentar Umum</span>
        </Label>
        <Textarea
          id="generalComments"
          placeholder="Komentar atau saran lainnya untuk program studi..."
          value={value.generalComments || ''}
          onChange={(e) => handleChange('generalComments', e.target.value)}
          className="min-h-[100px] rounded-xl resize-none"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(value.generalComments?.length || 0)}/1000 karakter
        </p>
      </div>
    </div>
  );
}

import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  year: number | string;
  title: string;
  description: string;
  status?: 'bekerja' | 'wirausaha' | 'studi' | 'mencari';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'bekerja': return 'border-primary bg-primary';
      case 'wirausaha': return 'border-success bg-success';
      case 'studi': return 'border-destructive bg-destructive';
      case 'mencari': return 'border-warning bg-warning';
      default: return 'border-primary bg-primary';
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'bekerja': return 'status-bekerja';
      case 'wirausaha': return 'status-wirausaha';
      case 'studi': return 'status-studi';
      case 'mencari': return 'status-mencari';
      default: return '';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'bekerja': return 'Bekerja';
      case 'wirausaha': return 'Wirausaha';
      case 'studi': return 'Studi Lanjut';
      case 'mencari': return 'Mencari Kerja';
      default: return '';
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative flex gap-4 pl-10 animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Timeline dot */}
            <div
              className={cn(
                "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-card",
                getStatusColor(item.status)
              )}
            >
              <CheckCircle className="w-4 h-4 text-primary-foreground" />
            </div>

            {/* Content card */}
            <div className="flex-1 glass-card rounded-xl p-4 transition-all duration-200 hover:shadow-elevated">
              <div className="flex items-center justify-between mb-2">
                {item.status && (
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusClass(item.status)
                    )}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  {item.year}
                </span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  onExport?: () => void;
  exportable?: boolean;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  onExport,
  exportable = false,
}: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (onExport) {
      onExport();
      return;
    }

    // Placeholder for export functionality
    // In production, implement using a chart export library
    console.log('Export chart:', title);
  };

  return (
    <div className={cn("chart-container", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {exportable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="text-muted-foreground hover:text-foreground"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div ref={chartRef} className="w-full">
        {children}
      </div>
    </div>
  );
}

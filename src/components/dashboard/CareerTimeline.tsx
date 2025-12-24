import { Briefcase, Rocket, GraduationCap, Search, ChevronRight, MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CareerTimelineItem {
  id: string;
  year: number;
  status: 'bekerja' | 'wirausaha' | 'studi' | 'mencari';
  title: string;
  subtitle?: string;
  location?: string;
  isActive?: boolean;
}

interface CareerTimelineProps {
  items: CareerTimelineItem[];
  maxItems?: number;
  contextText?: string;
  onViewAll?: () => void;
  onAddNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const STATUS_CONFIG = {
  bekerja: {
    icon: Briefcase,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    nodeColor: 'bg-primary',
    label: 'Bekerja',
  },
  wirausaha: {
    icon: Rocket,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    nodeColor: 'bg-success',
    label: 'Wirausaha',
  },
  studi: {
    icon: GraduationCap,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
    nodeColor: 'bg-info',
    label: 'Studi Lanjut',
  },
  mencari: {
    icon: Search,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    nodeColor: 'bg-warning',
    label: 'Mencari Kerja',
  },
};

export function CareerTimeline({ 
  items, 
  maxItems = 4, 
  contextText, 
  onViewAll, 
  onAddNew,
  onEdit,
  onDelete,
  className 
}: CareerTimelineProps) {
  const displayItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  if (items.length === 0) return null;

  return (
    <div className={cn('glass-card rounded-2xl p-6 flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">Riwayat Karir</h3>
            <p className="text-sm text-muted-foreground truncate">Tracer study Anda</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted flex-shrink-0">
          {items.length} entri
        </span>
      </div>

      {/* Timeline */}
      <div className="relative flex-1">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {displayItems.map((item, index) => {
            const config = STATUS_CONFIG[item.status];
            const Icon = config.icon;
            const isLast = index === displayItems.length - 1;

            return (
              <div 
                key={item.id} 
                className={cn(
                  'relative flex gap-4 pb-4 group',
                  !isLast && 'border-b border-transparent'
                )}
              >
                {/* Year & Node */}
                <div className="flex flex-col items-center w-10 flex-shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground mb-2">{item.year}</span>
                  <div className={cn('w-3 h-3 rounded-full z-10', config.nodeColor)} />
                </div>

                {/* Content Card */}
                <div 
                  className={cn(
                    'flex-1 p-4 rounded-xl border transition-all duration-200 min-w-0',
                    'hover:shadow-soft',
                    config.bgColor, config.borderColor
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', config.bgColor)}>
                      <Icon className={cn('w-4 h-4', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.bgColor, config.color)}>
                            {config.label}
                          </span>
                          {item.isActive && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/20 text-success">
                              Aktif
                            </span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        {(onEdit || onDelete) && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-background/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(item.id);
                                }}
                              >
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                            )}
                            {onDelete && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-lg hover:bg-destructive/10"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Riwayat Karir?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin menghapus entri "{item.title}"? Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => onDelete(item.id)}
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground break-words">{item.title}</h4>
                      {item.subtitle && (
                        <p className="text-sm text-muted-foreground break-words">{item.subtitle}</p>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="break-words">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Context Text */}
      {contextText && (
        <p className="text-xs text-muted-foreground italic mt-4">{contextText}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {(hasMore || onViewAll) && (
          <Button variant="ghost" className="flex-1" onClick={onViewAll}>
            Lihat semua karir
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        {onAddNew && (
          <Button variant="outline" className="flex-1" onClick={onAddNew}>
            <Plus className="w-4 h-4 mr-1" />
            Tambah Karir
          </Button>
        )}
      </div>
    </div>
  );
}
import { User, GraduationCap, Building2, Calendar, BadgeCheck } from 'lucide-react';
import { StatusBadge } from '@/components/shared';
import { cn } from '@/lib/utils';

interface StudentIdentityHeaderProps {
  nama: string;
  nim: string;
  prodi: string;
  jurusan: string;
  tahunLulus: number;
  currentStatus?: 'bekerja' | 'wirausaha' | 'studi' | 'mencari';
}

export function StudentIdentityHeader({
  nama,
  nim,
  prodi,
  jurusan,
  tahunLulus,
  currentStatus,
}: StudentIdentityHeaderProps) {
  return (
    <div className="animate-fade-up">
      {/* Greeting Section */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1 tracking-wide">
          Selamat datang kembali
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          {nama}
        </h1>
      </div>

      {/* Identity Info Bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
          <span className="font-semibold text-foreground">#</span>
          <span>{nim}</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{prodi}</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
          <Building2 className="w-3.5 h-3.5" />
          <span>{jurusan}</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>Lulus {tahunLulus}</span>
        </div>

        {currentStatus && (
          <StatusBadge status={currentStatus} size="md" showIcon />
        )}
      </div>
    </div>
  );
}

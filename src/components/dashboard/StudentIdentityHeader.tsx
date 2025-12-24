import { GraduationCap, Building2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentStatus } from '@/types/student.types';
import { RoleBadge } from './RoleBadge';
import { ROLE_CONFIG, aggregateAlumniStatus } from '@/lib/role-utils';
import type { AlumniData } from '@/types/alumni.types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StudentIdentityHeaderProps {
  nama: string;
  nim: string;
  prodi: string;
  jurusan: string;
  tahunLulus?: number;
  studentStatus: StudentStatus;
  /** Career history for computing aggregated alumni status */
  careerHistory?: AlumniData[];
}

export function StudentIdentityHeader({
  nama,
  nim,
  prodi,
  jurusan,
  tahunLulus,
  studentStatus,
  careerHistory = [],
}: StudentIdentityHeaderProps) {
  // Compute aggregated status for alumni
  const aggregatedStatus = studentStatus === 'alumni' 
    ? aggregateAlumniStatus(careerHistory) 
    : null;

  return (
    <TooltipProvider>
      <div className="animate-fade-up">
        {/* Greeting Section */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1 tracking-wide">
            Selamat datang kembali
          </p>
          
          {/* Name with Prominent Role Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {nama}
            </h1>
            
            {/* Role Badge - Always Visible, Prominent */}
            <RoleBadge role={studentStatus} size="md" />
          </div>
          
          {/* Aggregated Alumni Status (LinkedIn-style) - Only for Alumni with career data */}
          {studentStatus === 'alumni' && aggregatedStatus?.hasActiveCareer && (
            <p className="text-base text-muted-foreground mt-2 font-medium">
              {aggregatedStatus.primaryText}
            </p>
          )}
        </div>

        {/* Identity Info Bar */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors cursor-help">
                <span className="font-semibold text-foreground">NIM:</span>
                <span>{nim}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nomor Induk Mahasiswa</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors cursor-help">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{prodi}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Program Studi</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors cursor-help">
                <Building2 className="w-3.5 h-3.5" />
                <span>{jurusan}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Jurusan</p>
            </TooltipContent>
          </Tooltip>
          
          {tahunLulus && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors cursor-help">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Lulus {tahunLulus}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tahun Lulus</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

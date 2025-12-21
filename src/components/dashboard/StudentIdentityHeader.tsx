import { GraduationCap, Building2, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentStatus, CareerStatus } from '@/types/student.types';
import { getStudentStatusLabel, getStudentStatusColor } from '@/data/student-seed-data';
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
  careerStatus?: CareerStatus;
}

const CAREER_STATUS_LABELS: Record<CareerStatus, string> = {
  working: 'Bekerja',
  job_seeking: 'Mencari Kerja',
  entrepreneur: 'Wirausaha',
  further_study: 'Studi Lanjut',
};

const CAREER_STATUS_COLORS: Record<CareerStatus, { bg: string; text: string }> = {
  working: { bg: 'bg-primary/10', text: 'text-primary' },
  job_seeking: { bg: 'bg-warning/10', text: 'text-warning' },
  entrepreneur: { bg: 'bg-success/10', text: 'text-success' },
  further_study: { bg: 'bg-info/10', text: 'text-info' },
};

export function StudentIdentityHeader({
  nama,
  nim,
  prodi,
  jurusan,
  tahunLulus,
  studentStatus,
  careerStatus,
}: StudentIdentityHeaderProps) {
  const statusColor = getStudentStatusColor(studentStatus);
  const statusLabel = getStudentStatusLabel(studentStatus);

  return (
    <TooltipProvider>
      <div className="animate-fade-up">
        {/* Greeting Section */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1 tracking-wide">
            Selamat datang kembali
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {nama}
            </h1>
            
            {/* Student Status Badge */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
                  'border cursor-help transition-all duration-200 hover:shadow-soft',
                  statusColor.bg,
                  statusColor.text,
                  statusColor.border
                )}>
                  <User className="w-3.5 h-3.5" />
                  {statusLabel}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Status mahasiswa saat ini</p>
              </TooltipContent>
            </Tooltip>
          </div>
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

          {/* Career Status (only for alumni with tracer data) */}
          {studentStatus === 'alumni' && careerStatus && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity cursor-help',
                  CAREER_STATUS_COLORS[careerStatus].bg,
                  CAREER_STATUS_COLORS[careerStatus].text
                )}>
                  <span>{CAREER_STATUS_LABELS[careerStatus]}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Status Alumni Saat Ini</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

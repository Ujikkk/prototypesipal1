/**
 * Admin Dashboard - Clean Table-Based Monitoring Center
 * 
 * DESIGN PRINCIPLES:
 * - Clean > Fancy
 * - Overview > Detail
 * - Scan fast, click when needed
 * - No editing by admin
 * - Data integrity & traceability
 * 
 * READ-ONLY: Fully synchronized with student input data
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAlumni } from '@/contexts/AlumniContext';
import { tahunLulusList } from '@/lib/data';
import { StudentStatusBadge } from '@/components/admin';
import { studentProfiles, tracerStudyRecords, achievementRecords } from '@/data/student-seed-data';
import { aggregateAlumniStatus } from '@/lib/role-utils';
import type { StudentStatus, TracerStudyData } from '@/types/student.types';
import type { AlumniData } from '@/types/alumni.types';
import {
  Search, Download, Users2, Briefcase, Rocket,
  User, Mail, Phone, Building2, MapPin,
  Trophy, GraduationCap, Award, Eye, ExternalLink,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============ Types ============

interface MergedStudentData {
  id: string;
  nama: string;
  nim: string;
  status: StudentStatus;
  tahunMasuk: number;
  tahunLulus?: number;
  email?: string;
  noHp?: string;
  tracerStudy?: TracerStudyData;
  alumniCareerHistory: AlumniData[];
  careerSummary: string;
  hasTracerData: boolean;
  achievementCount: number;
}

// ============ Component ============

export default function AdminDashboard() {
  const { alumniData, masterData } = useAlumni();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTahun, setFilterTahun] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [previewStudentId, setPreviewStudentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Merge all data sources into unified view
  const mergedData = useMemo((): MergedStudentData[] => {
    return studentProfiles.map(student => {
      const tracerStudy = tracerStudyRecords.find(t => t.studentId === student.id);
      
      const matchingMaster = masterData.find(m => 
        m.nama === student.nama || m.nim === student.nim
      );
      const alumniCareerHistory = matchingMaster 
        ? alumniData.filter(d => d.alumniMasterId === matchingMaster.id)
        : [];
      
      const achievementCount = achievementRecords.filter(a => a.studentId === student.id).length;
      
      let careerSummary = 'Belum diisi';
      
      if (student.status === 'alumni') {
        if (alumniCareerHistory.length > 0) {
          const aggregated = aggregateAlumniStatus(alumniCareerHistory);
          careerSummary = aggregated.primaryText;
        } else if (tracerStudy) {
          switch (tracerStudy.careerStatus) {
            case 'working':
              careerSummary = tracerStudy.employmentData 
                ? `Bekerja · ${tracerStudy.employmentData.namaPerusahaan}`
                : 'Bekerja';
              break;
            case 'entrepreneur':
              careerSummary = tracerStudy.entrepreneurshipData
                ? `Wirausaha`
                : 'Wirausaha';
              break;
            case 'further_study':
              careerSummary = tracerStudy.furtherStudyData
                ? `Studi Lanjut di ${tracerStudy.furtherStudyData.namaKampus}`
                : 'Melanjutkan Studi';
              break;
            case 'job_seeking':
              careerSummary = 'Mencari Kerja';
              break;
          }
        }
      } else {
        careerSummary = '-';
      }
      
      return {
        id: student.id,
        nama: student.nama,
        nim: student.nim,
        status: student.status,
        tahunMasuk: student.tahunMasuk,
        tahunLulus: student.tahunLulus,
        email: student.email,
        noHp: student.noHp,
        tracerStudy,
        alumniCareerHistory,
        careerSummary,
        hasTracerData: !!tracerStudy || alumniCareerHistory.length > 0,
        achievementCount,
      };
    });
  }, [alumniData, masterData]);

  // Filter data
  const filteredData = useMemo(() => {
    return mergedData.filter(student => {
      const matchSearch = student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nim.includes(searchQuery);
      const matchStatus = filterStatus === 'all' || student.status === filterStatus;
      const matchTahun = filterTahun === 'all' || 
        student.tahunLulus === parseInt(filterTahun) ||
        student.tahunMasuk === parseInt(filterTahun);
      return matchSearch && matchStatus && matchTahun;
    });
  }, [mergedData, searchQuery, filterStatus, filterTahun]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Statistics (lightweight - no charts)
  const stats = useMemo(() => {
    const total = mergedData.length;
    const alumni = mergedData.filter(d => d.status === 'alumni').length;
    const active = mergedData.filter(d => d.status === 'active').length;
    
    const alumniWithData = mergedData.filter(d => d.status === 'alumni' && d.hasTracerData);
    const working = alumniWithData.filter(d => 
      d.tracerStudy?.careerStatus === 'working' || 
      d.alumniCareerHistory.some(h => h.status === 'bekerja')
    ).length;
    const entrepreneur = alumniWithData.filter(d => 
      d.tracerStudy?.careerStatus === 'entrepreneur' || 
      d.alumniCareerHistory.some(h => h.status === 'wirausaha')
    ).length;
    
    return { total, alumni, active, working, entrepreneur };
  }, [mergedData]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return mergedData.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId, mergedData]);

  const previewStudent = useMemo(() => {
    if (!previewStudentId) return null;
    return mergedData.find(s => s.id === previewStudentId) || null;
  }, [previewStudentId, mergedData]);

  const handleExport = () => {
    const headers = ['Nama', 'NIM', 'Status Mahasiswa', 'Tahun Masuk', 'Tahun Lulus', 'Status Alumni', 'Email', 'No HP'];
    const rows = filteredData.map(student => [
      student.nama,
      student.nim,
      getStatusLabel(student.status),
      student.tahunMasuk,
      student.tahunLulus || '-',
      student.status === 'alumni' ? student.careerSummary : '-',
      student.email || '-',
      student.noHp || '-',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-mahasiswa-alumni-sipal.csv';
    a.click();
  };

  const getStatusLabel = (status: StudentStatus) => {
    switch (status) {
      case 'alumni': return 'Alumni';
      case 'active': return 'Mahasiswa Aktif';
      case 'on_leave': return 'Mahasiswa Cuti';
      case 'dropout': return 'Mahasiswa Dropout';
      default: return '-';
    }
  };

  const getRingkasan = (student: MergedStudentData): string => {
    const parts: string[] = [];
    
    if (student.status === 'alumni' && student.tahunLulus) {
      parts.push(`Lulus ${student.tahunLulus}`);
    } else {
      parts.push(`Masuk ${student.tahunMasuk}`);
    }
    
    if (student.achievementCount > 0) {
      parts.push(`${student.achievementCount} prestasi`);
    }
    
    return parts.join(' · ');
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-6 animate-fade-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Stats */}
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Dashboard Monitoring
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pusat monitoring data mahasiswa dan alumni · <span className="text-xs">Read-Only</span>
                </p>
              </div>

              {/* Lightweight Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users2 className="w-4 h-4" />
                  <span className="font-medium text-foreground">{stats.active}</span>
                  <span>Aktif</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-medium text-foreground">{stats.alumni}</span>
                  <span>Alumni</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium text-foreground">{stats.working}</span>
                  <span>Bekerja</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Rocket className="w-4 h-4" />
                  <span className="font-medium text-foreground">{stats.entrepreneur}</span>
                  <span>Wirausaha</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Export Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIM..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-10 bg-background border-border"
              />
            </div>

            {/* Filters */}
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="active">Mhs. Aktif</SelectItem>
                <SelectItem value="on_leave">Mhs. Cuti</SelectItem>
                <SelectItem value="dropout">Dropout</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTahun} onValueChange={(v) => { setFilterTahun(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {tahunLulusList.map(t => (
                  <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Data Count & Export */}
            <div className="flex items-center gap-3 ml-auto">
              <Badge variant="secondary" className="h-10 px-4 text-sm font-normal">
                {filteredData.length} data
              </Badge>
              <Button variant="outline" size="sm" className="h-10" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Main Table */}
          <div className="border border-border rounded-xl overflow-hidden bg-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Nama Mahasiswa
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status Mahasiswa
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Status Alumni
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Ringkasan
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        Tidak ada data mahasiswa ditemukan
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((student, idx) => (
                      <tr 
                        key={student.id} 
                        className={cn(
                          "border-b border-border/50 hover:bg-muted/30 transition-colors",
                          idx === paginatedData.length - 1 && "border-b-0"
                        )}
                      >
                        {/* Nama Mahasiswa - Clickable for mini preview */}
                        <td className="py-3 px-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setPreviewStudentId(student.id)}
                                  className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                                >
                                  {/* Avatar with Initials */}
                                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-primary">
                                      {getInitials(student.nama)}
                                    </span>
                                  </div>
                                  <span className="font-medium text-foreground hover:text-primary transition-colors">
                                    {student.nama}
                                  </span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">
                                NIM: {student.nim}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>

                        {/* Status Mahasiswa */}
                        <td className="py-3 px-4">
                          <StudentStatusBadge status={student.status} size="sm" />
                        </td>

                        {/* Status Alumni */}
                        <td className="py-3 px-4 hidden md:table-cell">
                          {student.status !== 'alumni' ? (
                            <span className="text-sm text-muted-foreground">–</span>
                          ) : !student.hasTracerData ? (
                            <span className="text-sm text-muted-foreground italic">Belum diisi</span>
                          ) : (
                            <span className="text-sm text-foreground line-clamp-1">
                              {student.careerSummary}
                            </span>
                          )}
                        </td>

                        {/* Ringkasan */}
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {getRingkasan(student)}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-3 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => setSelectedStudentId(student.id)}
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            Lihat
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredData.length)} dari {filteredData.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                    .map((page, idx, arr) => (
                      <span key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={page === currentPage ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </span>
                    ))
                  }
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mini Preview Panel (Sheet - On Name Click) */}
          <Sheet open={!!previewStudentId} onOpenChange={() => setPreviewStudentId(null)}>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-left">Quick Preview</SheetTitle>
              </SheetHeader>
              
              {previewStudent && (
                <div className="mt-6 space-y-6">
                  {/* Identity */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {getInitials(previewStudent.nama)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{previewStudent.nama}</h3>
                      <p className="text-sm text-muted-foreground">NIM: {previewStudent.nim}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Status Mahasiswa</p>
                    <StudentStatusBadge status={previewStudent.status} />
                  </div>

                  {/* Alumni Status */}
                  {previewStudent.status === 'alumni' && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Status Alumni</p>
                      <p className="text-sm font-medium text-foreground">
                        {previewStudent.hasTracerData ? previewStudent.careerSummary : 'Belum mengisi'}
                      </p>
                    </div>
                  )}

                  {/* Prestasi Count */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Prestasi</p>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium text-foreground">
                        {previewStudent.achievementCount} prestasi tercatat
                      </span>
                    </div>
                  </div>

                  {/* Open Full Portfolio Button */}
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => {
                      setPreviewStudentId(null);
                      setSelectedStudentId(previewStudent.id);
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Lihat Portfolio Lengkap
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Full Portfolio Dialog (Read-Only) */}
          <Dialog open={!!selectedStudentId} onOpenChange={() => setSelectedStudentId(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span>Portfolio Mahasiswa</span>
                    <span className="text-xs text-muted-foreground ml-2">(Read-Only)</span>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              {selectedStudent && (
                <div className="space-y-6 mt-4">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">
                        {getInitials(selectedStudent.nama)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{selectedStudent.nama}</h3>
                      <p className="text-sm text-muted-foreground">NIM: {selectedStudent.nim}</p>
                      <div className="mt-2">
                        <StudentStatusBadge status={selectedStudent.status} />
                      </div>
                    </div>
                  </div>

                  {/* Academic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tahun Masuk</p>
                      <p className="font-semibold text-foreground">{selectedStudent.tahunMasuk}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {selectedStudent.status === 'alumni' ? 'Tahun Lulus' : 'Status'}
                      </p>
                      <p className="font-semibold text-foreground">
                        {selectedStudent.status === 'alumni' 
                          ? selectedStudent.tahunLulus || '-'
                          : getStatusLabel(selectedStudent.status)
                        }
                      </p>
                    </div>
                  </div>

                  {/* Alumni Status Section */}
                  {selectedStudent.status === 'alumni' && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Status Alumni Saat Ini
                      </h4>
                      
                      {selectedStudent.hasTracerData ? (
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <p className="text-foreground font-medium">{selectedStudent.careerSummary}</p>
                          
                          {selectedStudent.tracerStudy && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              {selectedStudent.tracerStudy.careerStatus === 'working' && 
                               selectedStudent.tracerStudy.employmentData && (
                                <>
                                  <div className="flex items-start gap-2">
                                    <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Perusahaan</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.employmentData.namaPerusahaan}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Jabatan</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.employmentData.jabatan}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Lokasi</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.employmentData.lokasiPerusahaan}</p>
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {selectedStudent.tracerStudy.careerStatus === 'entrepreneur' && 
                               selectedStudent.tracerStudy.entrepreneurshipData && (
                                <>
                                  <div className="flex items-start gap-2">
                                    <Rocket className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Nama Usaha</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.entrepreneurshipData.namaUsaha}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Jenis Usaha</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.entrepreneurshipData.jenisUsaha}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Lokasi</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.entrepreneurshipData.lokasiUsaha}</p>
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {selectedStudent.tracerStudy.careerStatus === 'further_study' && 
                               selectedStudent.tracerStudy.furtherStudyData && (
                                <>
                                  <div className="flex items-start gap-2">
                                    <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Kampus</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.furtherStudyData.namaKampus}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <Award className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Program Studi</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.furtherStudyData.programStudi}</p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-muted/30 text-center">
                          <p className="text-muted-foreground text-sm">Belum mengisi data tracer study</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact Info */}
                  {(selectedStudent.email || selectedStudent.noHp) && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedStudent.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="text-sm font-medium">{selectedStudent.email}</p>
                            </div>
                          </div>
                        )}
                        {selectedStudent.noHp && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">No. HP</p>
                              <p className="text-sm font-medium">{selectedStudent.noHp}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Achievements Summary */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-warning" />
                      Prestasi Non-Akademik
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.achievementCount > 0 
                        ? `${selectedStudent.achievementCount} prestasi tercatat`
                        : 'Belum ada prestasi tercatat'
                      }
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}

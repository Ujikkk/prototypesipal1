/**
 * Admin Dashboard - Read-Only Monitoring Center
 * 
 * ARCHITECTURE:
 * - Admin can ONLY view, monitor, and review data
 * - No edit functionality for student/alumni data
 * - Synchronized with student input data
 * - Role Identity derived from StudentStatus, not tracer data
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAlumni } from '@/contexts/AlumniContext';
import { tahunLulusList } from '@/lib/data';
import { StatCard, StatusBadge, ChartCard, DataTable } from '@/components/shared';
import { StudentStatusBadge } from '@/components/admin';
import { getGlobalAchievementStats, getStudentsWithAchievements } from '@/services/achievement.service';
import { ACHIEVEMENT_CATEGORIES, AchievementCategory } from '@/types/achievement.types';
import { studentProfiles, tracerStudyRecords, achievementRecords } from '@/data/student-seed-data';
import { aggregateAlumniStatus, CAREER_STATUS_LABELS } from '@/lib/role-utils';
import type { StudentStatus, TracerStudyData } from '@/types/student.types';
import type { AlumniData } from '@/types/alumni.types';
import {
  Search, Download, Filter, Users2, Briefcase, Rocket, BookOpen,
  User, Mail, Phone, Building2, MapPin, Sparkles,
  Trophy, Shield, FolderOpen, GraduationCap, Award, Mic2,
  Eye, UserCheck, UserX, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

// ============ Types ============

interface MergedStudentData {
  [key: string]: unknown; // Index signature for DataTable compatibility
  id: string;
  nama: string;
  nim: string;
  status: StudentStatus;
  tahunMasuk: number;
  tahunLulus?: number;
  email?: string;
  noHp?: string;
  // Alumni tracer data (from both sources)
  tracerStudy?: TracerStudyData;
  alumniCareerHistory: AlumniData[];
  // Aggregated status
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

  // Merge all data sources into unified view
  const mergedData = useMemo((): MergedStudentData[] => {
    return studentProfiles.map(student => {
      // Get tracer study data (from student-seed-data)
      const tracerStudy = tracerStudyRecords.find(t => t.studentId === student.id);
      
      // Get alumni career history from AlumniContext (dynamic user input)
      // Map student to master data for compatibility
      const matchingMaster = masterData.find(m => 
        m.nama === student.nama || m.nim === student.nim
      );
      const alumniCareerHistory = matchingMaster 
        ? alumniData.filter(d => d.alumniMasterId === matchingMaster.id)
        : [];
      
      // Count achievements
      const achievementCount = achievementRecords.filter(a => a.studentId === student.id).length;
      
      // Generate career summary
      let careerSummary = 'Belum diisi';
      
      if (student.status === 'alumni') {
        // Priority: dynamic alumni data > static tracer study
        if (alumniCareerHistory.length > 0) {
          const aggregated = aggregateAlumniStatus(alumniCareerHistory);
          careerSummary = aggregated.primaryText;
        } else if (tracerStudy) {
          // Use tracer study data
          switch (tracerStudy.careerStatus) {
            case 'working':
              careerSummary = tracerStudy.employmentData 
                ? `Bekerja di ${tracerStudy.employmentData.namaPerusahaan}`
                : 'Bekerja';
              break;
            case 'entrepreneur':
              careerSummary = tracerStudy.entrepreneurshipData
                ? `Wirausaha ${tracerStudy.entrepreneurshipData.namaUsaha}`
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
        // Non-alumni students
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

  // Statistics
  const stats = useMemo(() => {
    const total = mergedData.length;
    const alumni = mergedData.filter(d => d.status === 'alumni').length;
    const active = mergedData.filter(d => d.status === 'active').length;
    const onLeave = mergedData.filter(d => d.status === 'on_leave').length;
    const dropout = mergedData.filter(d => d.status === 'dropout').length;
    const withTracer = mergedData.filter(d => d.hasTracerData).length;
    return { total, alumni, active, onLeave, dropout, withTracer };
  }, [mergedData]);

  // Career statistics (alumni only)
  const careerStats = useMemo(() => {
    const alumniWithTracer = mergedData.filter(d => d.status === 'alumni' && d.hasTracerData);
    const working = alumniWithTracer.filter(d => 
      d.tracerStudy?.careerStatus === 'working' || 
      d.alumniCareerHistory.some(h => h.status === 'bekerja')
    ).length;
    const entrepreneur = alumniWithTracer.filter(d => 
      d.tracerStudy?.careerStatus === 'entrepreneur' || 
      d.alumniCareerHistory.some(h => h.status === 'wirausaha')
    ).length;
    const furtherStudy = alumniWithTracer.filter(d => 
      d.tracerStudy?.careerStatus === 'further_study' || 
      d.alumniCareerHistory.some(h => h.status === 'studi')
    ).length;
    const jobSeeking = alumniWithTracer.filter(d => 
      d.tracerStudy?.careerStatus === 'job_seeking' || 
      d.alumniCareerHistory.some(h => h.status === 'mencari')
    ).length;
    return { working, entrepreneur, furtherStudy, jobSeeking };
  }, [mergedData]);

  // Achievement statistics
  const achievementStats = useMemo(() => getGlobalAchievementStats(), []);
  const studentsWithAchievements = useMemo(() => getStudentsWithAchievements().length, []);

  // Chart data
  const statusChartData = [
    { name: 'Bekerja', value: careerStats.working, color: 'hsl(222, 60%, 35%)' },
    { name: 'Wirausaha', value: careerStats.entrepreneur, color: 'hsl(145, 65%, 39%)' },
    { name: 'Studi Lanjut', value: careerStats.furtherStudy, color: 'hsl(199, 89%, 48%)' },
    { name: 'Mencari Kerja', value: careerStats.jobSeeking, color: 'hsl(38, 92%, 50%)' },
  ];

  const roleDistributionData = [
    { name: 'Alumni', value: stats.alumni, color: 'hsl(145, 65%, 39%)' },
    { name: 'Mhs. Aktif', value: stats.active, color: 'hsl(217, 91%, 60%)' },
    { name: 'Mhs. Cuti', value: stats.onLeave, color: 'hsl(38, 92%, 50%)' },
    { name: 'Dropout', value: stats.dropout, color: 'hsl(0, 72%, 51%)' },
  ];

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return mergedData.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId, mergedData]);

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

  // Table columns - READ ONLY
  const tableColumns = [
    { 
      key: 'nama', 
      header: 'Nama Mahasiswa', 
      sortable: true,
      accessor: (row: MergedStudentData) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.nama}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status Mahasiswa',
      accessor: (row: MergedStudentData) => (
        <StudentStatusBadge status={row.status} size="sm" />
      )
    },
    { 
      key: 'careerSummary', 
      header: 'Status Alumni',
      hideOnMobile: true,
      accessor: (row: MergedStudentData) => {
        if (row.status !== 'alumni') {
          return <span className="text-xs text-muted-foreground">-</span>;
        }
        if (!row.hasTracerData) {
          return <span className="text-xs text-muted-foreground italic">Belum mengisi</span>;
        }
        return (
          <span className="text-sm text-foreground line-clamp-1">
            {row.careerSummary}
          </span>
        );
      }
    },
    { 
      key: 'ringkasan', 
      header: 'Ringkasan',
      hideOnMobile: true,
      accessor: (row: MergedStudentData) => {
        const parts: string[] = [];
        
        if (row.status === 'alumni' && row.tahunLulus) {
          parts.push(`Lulus ${row.tahunLulus}`);
        } else {
          parts.push(`Masuk ${row.tahunMasuk}`);
        }
        
        if (row.achievementCount > 0) {
          parts.push(`${row.achievementCount} prestasi`);
        }
        
        return (
          <span className="text-xs text-muted-foreground">
            {parts.join(' · ')}
          </span>
        );
      }
    },
    { 
      key: 'aksi', 
      header: 'Aksi',
      accessor: (row: MergedStudentData) => (
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 px-2 text-primary hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStudentId(row.id);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          Lihat
        </Button>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-up">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard Monitoring</h1>
              <p className="text-muted-foreground">
                Pusat monitoring data mahasiswa dan alumni ABT Polines.
                <span className="text-xs ml-2 text-muted-foreground/70">(Read-Only)</span>
              </p>
            </div>
            <Link to="/admin/ai-insight">
              <Button size="lg" className="group">
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                AI Insight
              </Button>
            </Link>
          </div>

          {/* Role Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <StatCard title="Total Mahasiswa" value={stats.total} icon={Users2} color="primary" />
            <StatCard title="Alumni" value={stats.alumni} icon={GraduationCap} color="success" />
            <StatCard title="Mhs. Aktif" value={stats.active} icon={UserCheck} color="info" />
            <StatCard title="Mhs. Cuti" value={stats.onLeave} icon={Clock} color="warning" />
            <StatCard title="Dropout" value={stats.dropout} icon={UserX} color="destructive" />
          </div>

          {/* Career Statistics (Alumni) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <StatCard title="Bekerja" value={careerStats.working} icon={Briefcase} color="primary" />
            <StatCard title="Wirausaha" value={careerStats.entrepreneur} icon={Rocket} color="success" />
            <StatCard title="Studi Lanjut" value={careerStats.furtherStudy} icon={BookOpen} color="info" />
            <StatCard title="Mencari Kerja" value={careerStats.jobSeeking} icon={Search} color="warning" />
          </div>

          {/* Achievement Stats Summary */}
          <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Prestasi Non-Akademik</h3>
                  <p className="text-sm text-muted-foreground">Rekam jejak prestasi mahasiswa & alumni</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{achievementStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Prestasi</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {(Object.entries(ACHIEVEMENT_CATEGORIES) as [AchievementCategory, typeof ACHIEVEMENT_CATEGORIES[AchievementCategory]][]).map(([key, cat]) => {
                const count = achievementStats.byCategory[key];
                const iconMap: Record<AchievementCategory, React.ElementType> = {
                  lomba: Trophy,
                  seminar: Mic2,
                  publikasi: BookOpen,
                  haki: Shield,
                  magang: Briefcase,
                  portofolio: FolderOpen,
                  wirausaha: Rocket,
                  pengembangan: GraduationCap,
                  organisasi: Users2,
                };
                const Icon = iconMap[key];
                return (
                  <div key={key} className="p-3 rounded-xl bg-muted/50 text-center">
                    <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground truncate">{cat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <ChartCard title="Distribusi Status Mahasiswa" subtitle="Berdasarkan status akademik">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Status Karir Alumni" subtitle="Distribusi status alumni yang sudah mengisi">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Filter Data</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau NIM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Status Mahasiswa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="active">Mahasiswa Aktif</SelectItem>
                  <SelectItem value="on_leave">Mahasiswa Cuti</SelectItem>
                  <SelectItem value="dropout">Dropout</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTahun} onValueChange={setFilterTahun}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {tahunLulusList.map(t => (
                    <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data Table - READ ONLY */}
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <DataTable
              data={filteredData}
              columns={tableColumns}
              searchPlaceholder="Cari nama atau NIM..."
              searchKeys={['nama', 'nim']}
              onRowClick={(row) => setSelectedStudentId(row.id as string)}
              onExport={handleExport}
              pageSize={10}
              emptyMessage="Tidak ada data mahasiswa ditemukan"
            />
          </div>

          {/* Detail Dialog - READ ONLY */}
          <Dialog open={!!selectedStudentId} onOpenChange={() => setSelectedStudentId(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span>Detail Mahasiswa</span>
                    <span className="text-xs text-muted-foreground ml-2">(Read-Only)</span>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              {selectedStudent && (
                <div className="space-y-6 mt-4">
                  {/* Role Badge - PROMINENT */}
                  <div className="flex items-center justify-center">
                    <StudentStatusBadge status={selectedStudent.status} size="md" />
                  </div>

                  {/* Profile Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nama</p>
                      <p className="font-semibold text-foreground">{selectedStudent.nama}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">NIM</p>
                      <p className="font-semibold text-foreground">{selectedStudent.nim}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tahun Masuk</p>
                      <p className="font-semibold text-foreground">{selectedStudent.tahunMasuk}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
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

                  {/* Alumni Status - Only for alumni */}
                  {selectedStudent.status === 'alumni' && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Status Alumni Saat Ini
                      </h4>
                      
                      {selectedStudent.hasTracerData ? (
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <p className="text-foreground font-medium">{selectedStudent.careerSummary}</p>
                          
                          {/* Detailed info based on tracer study */}
                          {selectedStudent.tracerStudy && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              {selectedStudent.tracerStudy.careerStatus === 'working' && 
                               selectedStudent.tracerStudy.employmentData && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Perusahaan</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.employmentData.namaPerusahaan}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Jabatan</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.employmentData.jabatan}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
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
                                  <div className="flex items-center gap-2">
                                    <Rocket className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Nama Usaha</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.entrepreneurshipData.namaUsaha}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Jenis Usaha</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.entrepreneurshipData.jenisUsaha}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
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
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Kampus</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.furtherStudyData.namaKampus}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Program Studi</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.furtherStudyData.programStudi}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Jenjang</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.furtherStudyData.jenjang}</p>
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {selectedStudent.tracerStudy.careerStatus === 'job_seeking' && 
                               selectedStudent.tracerStudy.jobSeekingData && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Lokasi Tujuan</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.jobSeekingData.lokasiTujuan}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Bidang Diincar</p>
                                      <p className="text-sm">{selectedStudent.tracerStudy.jobSeekingData.bidangDiincar}</p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-muted/50 text-center">
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
                  {selectedStudent.achievementCount > 0 && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-warning" />
                        Prestasi
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.achievementCount} prestasi tercatat
                      </p>
                    </div>
                  )}
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

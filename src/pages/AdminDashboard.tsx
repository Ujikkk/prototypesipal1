import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAlumni } from '@/contexts/AlumniContext';
import { jurusanList, prodiList, tahunLulusList } from '@/lib/data';
import { StatCard, StatusBadge, ChartCard, DataTable } from '@/components/shared';
import { getGlobalAchievementStats, getStudentsWithAchievements } from '@/services/achievement.service';
import { ACHIEVEMENT_CATEGORIES, AchievementCategory } from '@/types/achievement.types';
import {
  Search, Download, Filter, Users2, Briefcase, Rocket, BookOpen, TrendingUp,
  User, Mail, Phone, Building2, MapPin, Calendar, ExternalLink, Sparkles,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, X,
  Trophy, Shield, FolderOpen, GraduationCap, Award, Mic2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

export default function AdminDashboard() {
  const { masterData, alumniData } = useAlumni();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahun, setFilterTahun] = useState<string>('all');
  const [filterJurusan, setFilterJurusan] = useState<string>('all');
  const [filterProdi, setFilterProdi] = useState<string>('all');
  const [selectedAlumniId, setSelectedAlumniId] = useState<string | null>(null);

  // Merge master data with filled data
  const mergedData = useMemo(() => {
    return masterData.map(master => {
      const filled = alumniData.find(d => d.alumniMasterId === master.id);
      return { ...master, filledData: filled };
    });
  }, [masterData, alumniData]);

  // Filter data
  const filteredData = useMemo(() => {
    return mergedData.filter(alumni => {
      const matchSearch = alumni.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.nim.includes(searchQuery);
      const matchTahun = filterTahun === 'all' || alumni.tahunLulus === parseInt(filterTahun);
      const matchJurusan = filterJurusan === 'all' || alumni.jurusan === filterJurusan;
      const matchProdi = filterProdi === 'all' || alumni.prodi === filterProdi;
      return matchSearch && matchTahun && matchJurusan && matchProdi;
    });
  }, [mergedData, searchQuery, filterTahun, filterJurusan, filterProdi]);

  // Statistics
  const stats = useMemo(() => {
    const filled = alumniData.length;
    const bekerja = alumniData.filter(d => d.status === 'bekerja').length;
    const wirausaha = alumniData.filter(d => d.status === 'wirausaha').length;
    const studi = alumniData.filter(d => d.status === 'studi').length;
    const mencari = alumniData.filter(d => d.status === 'mencari').length;
    return { filled, bekerja, wirausaha, studi, mencari };
  }, [alumniData]);

  // Achievement statistics
  const achievementStats = useMemo(() => {
    return getGlobalAchievementStats();
  }, []);

  const studentsWithAchievements = useMemo(() => {
    return getStudentsWithAchievements().length;
  }, []);

  const achievementChartData = useMemo(() => {
    const colors = [
      'hsl(38, 92%, 50%)',   // kegiatan - warning
      'hsl(222, 60%, 35%)',  // publikasi - primary
      'hsl(145, 65%, 39%)',  // haki - success
      'hsl(199, 89%, 48%)',  // magang - info
      'hsl(262, 83%, 58%)',  // portofolio - secondary
      'hsl(0, 72%, 51%)',    // wirausaha - destructive
      'hsl(174, 72%, 40%)',  // pengembangan - accent
    ];
    return achievementStats.topCategories.map((item, index) => ({
      name: item.label,
      value: item.count,
      color: colors[index] || colors[0],
    }));
  }, [achievementStats]);

  // Chart data
  const statusChartData = [
    { name: 'Bekerja', value: stats.bekerja, color: 'hsl(222, 60%, 35%)' },
    { name: 'Wirausaha', value: stats.wirausaha, color: 'hsl(145, 65%, 39%)' },
    { name: 'Studi Lanjut', value: stats.studi, color: 'hsl(0, 72%, 51%)' },
    { name: 'Mencari Kerja', value: stats.mencari, color: 'hsl(38, 92%, 50%)' },
  ];

  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    alumniData.filter(d => d.status === 'bekerja').forEach(d => {
      if (d.bidangIndustri) {
        counts[d.bidangIndustri] = (counts[d.bidangIndustri] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [alumniData]);

  const yearTrendData = useMemo(() => {
    const years = [2019, 2020, 2021, 2022, 2023, 2024];
    return years.map(year => {
      const yearData = alumniData.filter(d => {
        const master = masterData.find(m => m.id === d.alumniMasterId);
        return master?.tahunLulus === year;
      });
      return {
        year: year.toString(),
        bekerja: yearData.filter(d => d.status === 'bekerja').length,
        wirausaha: yearData.filter(d => d.status === 'wirausaha').length,
      };
    });
  }, [alumniData, masterData]);

  const selectedAlumniDetail = useMemo(() => {
    if (!selectedAlumniId) return null;
    const master = masterData.find(m => m.id === selectedAlumniId);
    const filled = alumniData.find(d => d.alumniMasterId === selectedAlumniId);
    return master ? { ...master, filledData: filled } : null;
  }, [selectedAlumniId, masterData, alumniData]);

  const handleExport = () => {
    const headers = ['Nama', 'NIM', 'Jurusan', 'Prodi', 'Tahun Lulus', 'Status', 'Email', 'No HP'];
    const rows = filteredData.map(alumni => [
      alumni.nama,
      alumni.nim,
      alumni.jurusan,
      alumni.prodi,
      alumni.tahunLulus,
      alumni.filledData ? getStatusLabel(alumni.filledData.status) : '-',
      alumni.filledData?.email || '-',
      alumni.filledData?.noHp || '-',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-alumni-sipal.csv';
    a.click();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bekerja': return 'Bekerja';
      case 'mencari': return 'Mencari Kerja';
      case 'wirausaha': return 'Wirausaha';
      case 'studi': return 'Melanjutkan Studi';
      default: return '-';
    }
  };

  // Table columns configuration
  const tableColumns = [
    { key: 'nama', header: 'Nama', sortable: true },
    { key: 'nim', header: 'NIM', sortable: true },
    { key: 'jurusan', header: 'Jurusan', hideOnMobile: true, sortable: true },
    { key: 'prodi', header: 'Prodi', hideOnMobile: true, className: 'text-sm max-w-[150px] truncate' },
    { key: 'tahunLulus', header: 'Tahun', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      accessor: (row: typeof filteredData[0]) => row.filledData ? (
        <StatusBadge status={row.filledData.status} size="sm" />
      ) : (
        <span className="text-xs text-muted-foreground">Belum Isi</span>
      )
    },
    { 
      key: 'email', 
      header: 'Email', 
      hideOnMobile: true,
      accessor: (row: typeof filteredData[0]) => row.filledData?.email || '-',
      className: 'text-sm'
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
              <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard Admin</h1>
              <p className="text-muted-foreground">Kelola dan analisis data alumni ABT Polines.</p>
            </div>
            <Link to="/admin/ai-insight">
              <Button size="lg" className="group">
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                AI Insight
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <StatCard title="Total Pengisi" value={stats.filled} icon={Users2} color="primary" />
            <StatCard title="Bekerja" value={stats.bekerja} icon={Briefcase} color="primary" />
            <StatCard title="Wirausaha" value={stats.wirausaha} icon={Rocket} color="success" />
            <StatCard title="Studi Lanjut" value={stats.studi} icon={BookOpen} color="destructive" />
            <StatCard title="Mencari Kerja" value={stats.mencari} icon={Search} color="warning" />
          </div>

          {/* Achievement Stats Summary */}
          <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <ChartCard title="Distribusi Status" subtitle="Persentase status alumni">
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

            <ChartCard title="Bidang Industri" subtitle="Top 5 industri terbanyak">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Bar dataKey="value" fill="hsl(222, 60%, 35%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Tren Per Tahun" subtitle="Bekerja vs Wirausaha">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="bekerja" stroke="hsl(222, 60%, 35%)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="wirausaha" stroke="hsl(145, 65%, 39%)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau NIM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
              <Select value={filterTahun} onValueChange={setFilterTahun}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Tahun Lulus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {tahunLulusList.map(t => (
                    <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterJurusan} onValueChange={(v) => { setFilterJurusan(v); setFilterProdi('all'); }}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jurusan</SelectItem>
                  {jurusanList.map(j => (
                    <SelectItem key={j} value={j}>{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterProdi} onValueChange={setFilterProdi} disabled={filterJurusan === 'all'}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Prodi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prodi</SelectItem>
                  {filterJurusan !== 'all' && prodiList[filterJurusan]?.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data Table */}
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <DataTable
              data={filteredData}
              columns={tableColumns}
              searchPlaceholder="Cari nama atau NIM..."
              searchKeys={['nama', 'nim'] as (keyof typeof filteredData[0])[]}
              onRowClick={(row) => setSelectedAlumniId(row.id)}
              onExport={handleExport}
              pageSize={10}
              emptyMessage="Tidak ada data alumni ditemukan"
            />
          </div>

          {/* Detail Dialog */}
          <Dialog open={!!selectedAlumniId} onOpenChange={() => setSelectedAlumniId(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  Detail Alumni
                </DialogTitle>
              </DialogHeader>
              
              {selectedAlumniDetail && (
                <div className="space-y-6 mt-4">
                  {/* Profile Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nama</p>
                      <p className="font-semibold text-foreground">{selectedAlumniDetail.nama}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">NIM</p>
                      <p className="font-semibold text-foreground">{selectedAlumniDetail.nim}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Jurusan</p>
                      <p className="font-semibold text-foreground">{selectedAlumniDetail.jurusan}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Prodi</p>
                      <p className="font-semibold text-foreground text-sm">{selectedAlumniDetail.prodi}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tahun Lulus</p>
                      <p className="font-semibold text-foreground">{selectedAlumniDetail.tahunLulus}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                      {selectedAlumniDetail.filledData ? (
                        <StatusBadge status={selectedAlumniDetail.filledData.status} size="md" showIcon />
                      ) : (
                        <span className="text-muted-foreground">Belum mengisi</span>
                      )}
                    </div>
                  </div>

                  {/* Filled Data Details */}
                  {selectedAlumniDetail.filledData && (
                    <>
                      <div className="border-t border-border pt-4">
                        <h4 className="font-semibold text-foreground mb-4">Detail Status</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedAlumniDetail.filledData.status === 'bekerja' && (
                            <>
                              <div className="flex items-center gap-3">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Perusahaan</p>
                                  <p className="text-sm font-medium">{selectedAlumniDetail.filledData.namaPerusahaan}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Jabatan</p>
                                  <p className="text-sm font-medium">{selectedAlumniDetail.filledData.jabatan}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Lokasi</p>
                                  <p className="text-sm font-medium">{selectedAlumniDetail.filledData.lokasiPerusahaan}</p>
                                </div>
                              </div>
                            </>
                          )}
                          {selectedAlumniDetail.filledData.status === 'wirausaha' && (
                            <>
                              <div className="flex items-center gap-3">
                                <Rocket className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Nama Usaha</p>
                                  <p className="text-sm font-medium">{selectedAlumniDetail.filledData.namaUsaha}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Jenis Usaha</p>
                                  <p className="text-sm font-medium">{selectedAlumniDetail.filledData.jenisUsaha}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="text-sm font-medium">{selectedAlumniDetail.filledData.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">No. HP</p>
                              <p className="text-sm font-medium">{selectedAlumniDetail.filledData.noHp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
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

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Sparkles,
  ChevronDown,
  Building2,
  MapPin,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAlumniStore, AlumniStatus, AlumniSubmission, MasterAlumni } from '@/stores/alumniStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const statusLabels: Record<AlumniStatus, { label: string; color: string }> = {
  working: { label: 'Bekerja', color: 'bg-accent text-accent-foreground' },
  searching: { label: 'Mencari Kerja', color: 'bg-warning text-warning-foreground' },
  entrepreneur: { label: 'Wirausaha', color: 'bg-success text-success-foreground' },
  studying: { label: 'Melanjutkan Studi', color: 'bg-destructive text-destructive-foreground' },
};

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(38, 92%, 50%)', 'hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)'];

export default function AdminDashboard() {
  const { submissions, masterData } = useAlumniStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTahun, setFilterTahun] = useState<string>('all');
  const [filterJurusan, setFilterJurusan] = useState<string>('all');
  const [filterProdi, setFilterProdi] = useState<string>('all');
  const [selectedAlumni, setSelectedAlumni] = useState<{
    master: MasterAlumni;
    submissions: AlumniSubmission[];
  } | null>(null);

  // Get unique values for filters
  const tahunOptions = useMemo(() => {
    const years = [...new Set(masterData.map(a => a.tahunLulus))].sort((a, b) => b - a);
    return years;
  }, [masterData]);

  const jurusanOptions = useMemo(() => {
    return [...new Set(masterData.map(a => a.jurusan))].sort();
  }, [masterData]);

  const prodiOptions = useMemo(() => {
    if (filterJurusan === 'all') {
      return [...new Set(masterData.map(a => a.prodi))].sort();
    }
    return [...new Set(masterData.filter(a => a.jurusan === filterJurusan).map(a => a.prodi))].sort();
  }, [masterData, filterJurusan]);

  // Combined data with submissions
  const combinedData = useMemo(() => {
    return masterData.map(alumni => {
      const alumniSubmissions = submissions.filter(s => s.alumniId === alumni.id);
      const latestSubmission = alumniSubmissions[alumniSubmissions.length - 1];
      return {
        ...alumni,
        latestSubmission,
        allSubmissions: alumniSubmissions,
      };
    });
  }, [masterData, submissions]);

  // Filtered data
  const filteredData = useMemo(() => {
    return combinedData.filter(alumni => {
      const matchesSearch = 
        alumni.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.nim.includes(searchTerm);
      const matchesTahun = filterTahun === 'all' || alumni.tahunLulus === Number(filterTahun);
      const matchesJurusan = filterJurusan === 'all' || alumni.jurusan === filterJurusan;
      const matchesProdi = filterProdi === 'all' || alumni.prodi === filterProdi;
      return matchesSearch && matchesTahun && matchesJurusan && matchesProdi;
    });
  }, [combinedData, searchTerm, filterTahun, filterJurusan, filterProdi]);

  // Statistics
  const stats = useMemo(() => {
    const withSubmissions = filteredData.filter(a => a.latestSubmission);
    const statusCounts = {
      working: withSubmissions.filter(a => a.latestSubmission?.status === 'working').length,
      searching: withSubmissions.filter(a => a.latestSubmission?.status === 'searching').length,
      entrepreneur: withSubmissions.filter(a => a.latestSubmission?.status === 'entrepreneur').length,
      studying: withSubmissions.filter(a => a.latestSubmission?.status === 'studying').length,
    };
    
    return {
      total: filteredData.length,
      withData: withSubmissions.length,
      ...statusCounts,
    };
  }, [filteredData]);

  // Chart data
  const pieData = useMemo(() => [
    { name: 'Bekerja', value: stats.working },
    { name: 'Mencari Kerja', value: stats.searching },
    { name: 'Wirausaha', value: stats.entrepreneur },
    { name: 'Studi Lanjut', value: stats.studying },
  ], [stats]);

  const barData = useMemo(() => {
    const industryCount: Record<string, number> = {};
    filteredData.forEach(alumni => {
      if (alumni.latestSubmission?.status === 'working' && alumni.latestSubmission.workingData) {
        const industry = alumni.latestSubmission.workingData.bidangIndustri;
        industryCount[industry] = (industryCount[industry] || 0) + 1;
      }
    });
    return Object.entries(industryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredData]);

  const handleViewDetail = (alumni: typeof filteredData[0]) => {
    setSelectedAlumni({
      master: {
        id: alumni.id,
        nama: alumni.nama,
        nim: alumni.nim,
        jurusan: alumni.jurusan,
        prodi: alumni.prodi,
        tahunLulus: alumni.tahunLulus,
      },
      submissions: alumni.allSubmissions,
    });
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Nama', 'NIM', 'Jurusan', 'Prodi', 'Tahun Lulus', 'Status', 'Email', 'No HP'];
    const rows = filteredData.map(a => [
      a.nama,
      a.nim,
      a.jurusan,
      a.prodi,
      a.tahunLulus,
      a.latestSubmission ? statusLabels[a.latestSubmission.status].label : '-',
      a.latestSubmission?.email || '-',
      a.latestSubmission?.noHp || '-',
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-alumni-sipal.csv';
    a.click();
  };

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] py-6 md:py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Dashboard Admin
              </h1>
              <p className="text-muted-foreground">
                Kelola dan analisis data alumni Politeknik Negeri Semarang.
              </p>
            </div>
            <Button asChild variant="hero">
              <Link to="/admin/ai-insights">
                <Sparkles className="h-5 w-5" />
                AI Insights
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Alumni</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.withData}</p>
                    <p className="text-xs text-muted-foreground">Data Terisi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.working}</p>
                    <p className="text-xs text-muted-foreground">Bekerja</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.entrepreneur}</p>
                    <p className="text-xs text-muted-foreground">Wirausaha</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.studying}</p>
                    <p className="text-xs text-muted-foreground">Studi Lanjut</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.searching}</p>
                    <p className="text-xs text-muted-foreground">Mencari Kerja</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Distribusi Status Alumni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Bidang Industri Terbanyak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card variant="elevated" className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama atau NIM..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={filterTahun} onValueChange={setFilterTahun}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Tahun Lulus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      {tahunOptions.map(year => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterJurusan} onValueChange={(v) => { setFilterJurusan(v); setFilterProdi('all'); }}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Jurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jurusan</SelectItem>
                      {jurusanOptions.map(j => (
                        <SelectItem key={j} value={j}>{j}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterProdi} onValueChange={setFilterProdi}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Program Studi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Prodi</SelectItem>
                      {prodiOptions.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card variant="elevated">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Data Alumni</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {filteredData.length} alumni ditemukan
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead className="hidden md:table-cell">Jurusan</TableHead>
                      <TableHead className="hidden lg:table-cell">Prodi</TableHead>
                      <TableHead>Lulus</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Lokasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.slice(0, 50).map((alumni) => (
                      <TableRow key={alumni.id}>
                        <TableCell className="font-medium">{alumni.nama}</TableCell>
                        <TableCell className="font-mono text-sm">{alumni.nim}</TableCell>
                        <TableCell className="hidden md:table-cell">{alumni.jurusan}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{alumni.prodi}</TableCell>
                        <TableCell>{alumni.tahunLulus}</TableCell>
                        <TableCell>
                          {alumni.latestSubmission ? (
                            <Badge className={statusLabels[alumni.latestSubmission.status].color}>
                              {statusLabels[alumni.latestSubmission.status].label}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Belum Isi
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {alumni.latestSubmission?.status === 'working' && alumni.latestSubmission.workingData?.lokasiPerusahaan}
                          {alumni.latestSubmission?.status === 'entrepreneur' && alumni.latestSubmission.entrepreneurData?.lokasiUsaha}
                          {alumni.latestSubmission?.status === 'studying' && alumni.latestSubmission.studyingData?.lokasiKampus}
                          {alumni.latestSubmission?.status === 'searching' && alumni.latestSubmission.searchingData?.lokasiTujuan}
                          {!alumni.latestSubmission && '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(alumni)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Detail Modal */}
          <Dialog open={!!selectedAlumni} onOpenChange={() => setSelectedAlumni(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Detail Alumni</DialogTitle>
                <DialogDescription>
                  Informasi lengkap alumni dan riwayat status.
                </DialogDescription>
              </DialogHeader>
              
              {selectedAlumni && (
                <div className="space-y-6">
                  {/* Profile Info */}
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nama</p>
                        <p className="font-semibold">{selectedAlumni.master.nama}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">NIM</p>
                        <p className="font-mono">{selectedAlumni.master.nim}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Jurusan</p>
                        <p>{selectedAlumni.master.jurusan}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Program Studi</p>
                        <p>{selectedAlumni.master.prodi}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tahun Lulus</p>
                        <p>{selectedAlumni.master.tahunLulus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Submissions */}
                  {selectedAlumni.submissions.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Riwayat Status</h3>
                      {selectedAlumni.submissions.map((sub) => (
                        <div key={sub.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={statusLabels[sub.status].color}>
                              {statusLabels[sub.status].label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{sub.tahun}</span>
                          </div>
                          
                          {sub.status === 'working' && sub.workingData && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>{sub.workingData.namaPerusahaan}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span>{sub.workingData.jabatan}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{sub.workingData.lokasiPerusahaan}</span>
                              </div>
                              <p className="text-muted-foreground">Industri: {sub.workingData.bidangIndustri}</p>
                            </div>
                          )}

                          {sub.status === 'entrepreneur' && sub.entrepreneurData && (
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">{sub.entrepreneurData.namaUsaha}</p>
                              <p>{sub.entrepreneurData.jenisUsaha} • {sub.entrepreneurData.lokasiUsaha}</p>
                              <p className="text-muted-foreground">
                                {sub.entrepreneurData.memilikiKaryawan 
                                  ? `${sub.entrepreneurData.jumlahKaryawan} karyawan` 
                                  : 'Tanpa karyawan'
                                } • {sub.entrepreneurData.usahaAktif ? 'Aktif' : 'Tidak Aktif'}
                              </p>
                            </div>
                          )}

                          {sub.status === 'studying' && sub.studyingData && (
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">{sub.studyingData.namaKampus}</p>
                              <p>{sub.studyingData.jenjang} {sub.studyingData.programStudi}</p>
                              <p className="text-muted-foreground">{sub.studyingData.lokasiKampus}</p>
                            </div>
                          )}

                          {sub.status === 'searching' && sub.searchingData && (
                            <div className="space-y-2 text-sm">
                              <p>Bidang: {sub.searchingData.bidangPekerjaan}</p>
                              <p>Target: {sub.searchingData.lokasiTujuan}</p>
                              <p className="text-muted-foreground">
                                {sub.searchingData.lamaMencari} bulan mencari
                              </p>
                            </div>
                          )}

                          <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                            <p>Email: {sub.email}</p>
                            <p>HP: {sub.noHp}</p>
                            {sub.linkedin && <p>LinkedIn: {sub.linkedin}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Alumni belum mengisi data status.
                    </p>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}

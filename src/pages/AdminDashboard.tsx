import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlumni } from '@/contexts/AlumniContext';
import { jurusanList, prodiList, tahunLulusList } from '@/lib/data';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search, Download, Filter, Users, Briefcase, Rocket, BookOpen, TrendingUp,
  User, Mail, Phone, Building2, MapPin, Calendar, ExternalLink, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
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

  // Chart data
  const statusChartData = [
    { name: 'Bekerja', value: stats.bekerja, color: 'hsl(215, 80%, 45%)' },
    { name: 'Wirausaha', value: stats.wirausaha, color: 'hsl(145, 65%, 42%)' },
    { name: 'Studi Lanjut', value: stats.studi, color: 'hsl(0, 84%, 60%)' },
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bekerja': return 'Bekerja';
      case 'mencari': return 'Mencari Kerja';
      case 'wirausaha': return 'Wirausaha';
      case 'studi': return 'Melanjutkan Studi';
      default: return '-';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'bekerja': return 'status-bekerja';
      case 'mencari': return 'status-mencari';
      case 'wirausaha': return 'status-wirausaha';
      case 'studi': return 'status-studi';
      default: return '';
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard Admin</h1>
              <p className="text-muted-foreground">Kelola dan analisis data alumni Polines.</p>
            </div>
            <Link to="/admin/ai-insight">
              <Button variant="hero" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Insight
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.filled}</p>
                  <p className="text-xs text-muted-foreground">Total Pengisi</p>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.bekerja}</p>
                  <p className="text-xs text-muted-foreground">Bekerja</p>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.wirausaha}</p>
                  <p className="text-xs text-muted-foreground">Wirausaha</p>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.studi}</p>
                  <p className="text-xs text-muted-foreground">Studi Lanjut</p>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.mencari}</p>
                  <p className="text-xs text-muted-foreground">Mencari Kerja</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Status Distribution */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Distribusi Status</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Industry Distribution */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Bidang Industri Terbanyak</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(215, 80%, 45%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Year Trend */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Tren Per Tahun</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bekerja" stroke="hsl(215, 80%, 45%)" strokeWidth={2} />
                    <Line type="monotone" dataKey="wirausaha" stroke="hsl(145, 65%, 42%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-6 mb-6">
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

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {filteredData.length} dari {masterData.length} data
              </p>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead className="hidden md:table-cell">Jurusan</TableHead>
                    <TableHead className="hidden lg:table-cell">Prodi</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((alumni) => (
                    <TableRow key={alumni.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAlumniId(alumni.id)}>
                      <TableCell className="font-medium">{alumni.nama}</TableCell>
                      <TableCell>{alumni.nim}</TableCell>
                      <TableCell className="hidden md:table-cell">{alumni.jurusan}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{alumni.prodi}</TableCell>
                      <TableCell>{alumni.tahunLulus}</TableCell>
                      <TableCell>
                        {alumni.filledData ? (
                          <span className={cn('px-2 py-1 rounded-full text-xs font-medium border', getStatusClass(alumni.filledData.status))}>
                            {getStatusLabel(alumni.filledData.status)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Belum Isi</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{alumni.filledData?.email || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Detail Dialog */}
          <Dialog open={!!selectedAlumniId} onOpenChange={() => setSelectedAlumniId(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Detail Alumni
                </DialogTitle>
              </DialogHeader>
              {selectedAlumniDetail && (
                <div className="space-y-6">
                  {/* Profile */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Nama</p>
                      <p className="font-medium">{selectedAlumniDetail.nama}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">NIM</p>
                      <p className="font-medium">{selectedAlumniDetail.nim}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Jurusan</p>
                      <p className="font-medium">{selectedAlumniDetail.jurusan}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Prodi</p>
                      <p className="font-medium">{selectedAlumniDetail.prodi}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 col-span-2">
                      <p className="text-xs text-muted-foreground">Tahun Lulus</p>
                      <p className="font-medium">{selectedAlumniDetail.tahunLulus}</p>
                    </div>
                  </div>

                  {selectedAlumniDetail.filledData ? (
                    <>
                      {/* Status */}
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <span className={cn('px-3 py-1 rounded-full text-sm font-medium border', getStatusClass(selectedAlumniDetail.filledData.status))}>
                          {getStatusLabel(selectedAlumniDetail.filledData.status)}
                        </span>
                        
                        <div className="mt-4 space-y-2 text-sm">
                          {selectedAlumniDetail.filledData.status === 'bekerja' && (
                            <>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedAlumniDetail.filledData.namaPerusahaan}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedAlumniDetail.filledData.lokasiPerusahaan}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedAlumniDetail.filledData.jabatan} - {selectedAlumniDetail.filledData.bidangIndustri}</span>
                              </div>
                            </>
                          )}
                          {selectedAlumniDetail.filledData.status === 'wirausaha' && (
                            <>
                              <div className="flex items-center gap-2">
                                <Rocket className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedAlumniDetail.filledData.namaUsaha}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedAlumniDetail.filledData.lokasiUsaha}</span>
                              </div>
                            </>
                          )}
                          {selectedAlumniDetail.filledData.status === 'studi' && (
                            <>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedAlumniDetail.filledData.namaKampus} - {selectedAlumniDetail.filledData.jenjang}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedAlumniDetail.filledData.lokasiKampus}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Kontak</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedAlumniDetail.filledData.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedAlumniDetail.filledData.noHp}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center bg-muted/30 rounded-xl">
                      <p className="text-muted-foreground">Alumni ini belum mengisi form status.</p>
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

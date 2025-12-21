import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAlumni } from '@/contexts/AlumniContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, Plus, Briefcase, Building2, MapPin, Calendar, 
  ChevronDown, ChevronUp, Pencil, Trash2, Clock, X, Check,
  Rocket, GraduationCap, Search as SearchIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStudentStatusLabel, getStudentStatusColor } from '@/data/student-seed-data';
import type { StudentStatus } from '@/types/student.types';

export default function RiwayatKarirPage() {
  const navigate = useNavigate();
  const { selectedAlumni, getAlumniDataByMasterId, alumniData } = useAlumni();
  const { toast } = useToast();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<any | null>(null);

  if (!selectedAlumni) {
    navigate('/validasi');
    return null;
  }

  const studentStatus: StudentStatus = (selectedAlumni as any).status || 'alumni';
  const statusColor = getStudentStatusColor(studentStatus);
  const careerHistory = getAlumniDataByMasterId(selectedAlumni.id);

  const handleEdit = (career: any) => {
    setEditingCareer(career);
    setIsFormOpen(true);
  };

  const handleDelete = (careerId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus riwayat ini?')) {
      // In real app, would call delete service
      toast({ title: 'Riwayat berhasil dihapus' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'bekerja': return Briefcase;
      case 'wirausaha': return Rocket;
      case 'studi': return GraduationCap;
      case 'mencari': return SearchIcon;
      default: return Briefcase;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bekerja': return 'Bekerja';
      case 'wirausaha': return 'Wirausaha';
      case 'studi': return 'Studi Lanjut';
      case 'mencari': return 'Mencari Kerja';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bekerja': return { bg: 'bg-primary/10', text: 'text-primary', node: 'bg-primary' };
      case 'wirausaha': return { bg: 'bg-success/10', text: 'text-success', node: 'bg-success' };
      case 'studi': return { bg: 'bg-info/10', text: 'text-info', node: 'bg-info' };
      case 'mencari': return { bg: 'bg-warning/10', text: 'text-warning', node: 'bg-warning' };
      default: return { bg: 'bg-muted', text: 'text-muted-foreground', node: 'bg-muted-foreground' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8 animate-fade-up">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Riwayat Karir Alumni
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Perjalanan profesional setelah masa studi
                  </p>
                </div>
              </div>
              <Button onClick={() => { setEditingCareer(null); setIsFormOpen(true); }} className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Karir
              </Button>
            </div>

            {/* Two Column Layout */}
            <div className="flex gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Left Sidebar - Alumni Identity */}
              <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-28 glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {selectedAlumni.nama.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {selectedAlumni.nama}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        NIM: {selectedAlumni.nim}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className={cn('text-xs px-2 py-1 rounded-full', statusColor.bg, statusColor.text)}>
                        {getStudentStatusLabel(studentStatus)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Program Studi</span>
                      <span className="text-sm font-medium text-foreground text-right max-w-[140px] truncate">
                        {selectedAlumni.prodi}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tahun Lulus</span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedAlumni.tahunLulus || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Total Riwayat: {careerHistory.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content - Career Timeline */}
              <div className="flex-1 min-w-0">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Timeline Karir</h2>
                    <Button onClick={() => { setEditingCareer(null); setIsFormOpen(true); }} size="sm" className="lg:hidden">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {careerHistory.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Belum ada riwayat karir
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Tambahkan perjalanan profesionalmu
                      </p>
                      <Button onClick={() => setIsFormOpen(true)} size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Karir
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                      <div className="space-y-6">
                        {careerHistory.map((career, index) => {
                          const StatusIcon = getStatusIcon(career.status);
                          const statusConfig = getStatusColor(career.status);
                          const isExpanded = expandedId === career.id;
                          const isLatest = index === careerHistory.length - 1;

                          let title = '';
                          let subtitle = '';
                          let location = '';

                          if (career.status === 'bekerja') {
                            title = career.namaPerusahaan || 'Perusahaan';
                            subtitle = career.jabatan || 'Karyawan';
                            location = career.lokasiPerusahaan || '';
                          } else if (career.status === 'wirausaha') {
                            title = career.namaUsaha || 'Usaha';
                            subtitle = career.jenisUsaha || 'Bisnis';
                            location = career.lokasiUsaha || '';
                          } else if (career.status === 'studi') {
                            title = career.namaKampus || 'Kampus';
                            subtitle = `${career.jenjang || ''} ${career.programStudi || ''}`.trim();
                            location = career.lokasiKampus || '';
                          } else if (career.status === 'mencari') {
                            title = 'Mencari Pekerjaan';
                            subtitle = `Target: ${career.bidangDiincar || 'Berbagai bidang'}`;
                            location = career.lokasiTujuan || '';
                          }

                          return (
                            <div key={career.id} className="relative pl-16">
                              {/* Timeline Node */}
                              <div className={cn(
                                'absolute left-4 top-4 w-5 h-5 rounded-full border-2 border-background',
                                statusConfig.node
                              )} />

                              {/* Main Card */}
                              <div
                                onClick={() => setExpandedId(isExpanded ? null : career.id)}
                                className={cn(
                                  'p-4 rounded-xl cursor-pointer transition-all duration-200',
                                  'bg-card border',
                                  isExpanded 
                                    ? 'border-primary/50 shadow-soft' 
                                    : 'border-border/50 hover:shadow-elevated hover:-translate-y-0.5',
                                  'group'
                                )}
                              >
                                <div className="flex items-start gap-4">
                                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', statusConfig.bg)}>
                                    <StatusIcon className={cn('w-5 h-5', statusConfig.text)} />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <div>
                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                          {title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={cn('text-xs px-2 py-0.5 rounded-full', statusConfig.bg, statusConfig.text)}>
                                          {getStatusLabel(career.status)}
                                        </span>
                                        {isLatest && (
                                          <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                                            Terbaru
                                          </span>
                                        )}
                                        {isExpanded ? (
                                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                      {location && (
                                        <span className="flex items-center gap-1">
                                          <MapPin className="w-3.5 h-3.5" />
                                          {location}
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {career.tahunPengisian}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Expanded Detail */}
                              {isExpanded && (
                                <div className="mt-2 p-4 rounded-xl border border-border bg-muted/30 animate-fade-in">
                                  <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                    Informasi Detail
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                    {career.status === 'bekerja' && (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm"><span className="text-muted-foreground">Perusahaan:</span> {career.namaPerusahaan}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm"><span className="text-muted-foreground">Jabatan:</span> {career.jabatan}</span>
                                        </div>
                                        {career.bidangIndustri && (
                                          <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm"><span className="text-muted-foreground">Industri:</span> {career.bidangIndustri}</span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {career.status === 'wirausaha' && (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <Rocket className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm"><span className="text-muted-foreground">Nama Usaha:</span> {career.namaUsaha}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm"><span className="text-muted-foreground">Jenis:</span> {career.jenisUsaha}</span>
                                        </div>
                                      </>
                                    )}
                                    {career.status === 'studi' && (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm"><span className="text-muted-foreground">Kampus:</span> {career.namaKampus}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm"><span className="text-muted-foreground">Program:</span> {career.jenjang} {career.programStudi}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 pt-3 border-t border-border">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(career);
                                      }}
                                    >
                                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(career.id);
                                      }}
                                    >
                                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                      Hapus
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile FAB */}
            <Button
              onClick={() => { setEditingCareer(null); setIsFormOpen(true); }}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-elevated lg:hidden"
              size="icon"
            >
              <Plus className="w-6 h-6" />
            </Button>

            {/* Career Form Modal */}
            {isFormOpen && (
              <CareerFormModal
                existingData={editingCareer}
                onClose={() => { setIsFormOpen(false); setEditingCareer(null); }}
                onSuccess={() => {
                  setIsFormOpen(false);
                  setEditingCareer(null);
                  toast({ title: editingCareer ? 'Riwayat berhasil diperbarui!' : 'Riwayat berhasil ditambahkan!' });
                }}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Career Form Modal
function CareerFormModal({
  existingData,
  onClose,
  onSuccess,
}: {
  existingData?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState(existingData?.status || 'bekerja');
  const [formData, setFormData] = useState<Record<string, any>>(existingData || {});

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would call create/update service
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-auto glass-card rounded-2xl p-6 md:p-8 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {existingData ? 'Edit Riwayat Karir' : 'Tambah Riwayat Karir'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Status Saat Ini *</Label>
            <select 
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="bekerja">Bekerja</option>
              <option value="wirausaha">Wirausaha</option>
              <option value="studi">Melanjutkan Studi</option>
              <option value="mencari">Mencari Kerja</option>
            </select>
          </div>

          {status === 'bekerja' && (
            <>
              <div><Label>Nama Perusahaan *</Label><Input value={formData.namaPerusahaan || ''} onChange={(e) => updateField('namaPerusahaan', e.target.value)} required /></div>
              <div><Label>Jabatan *</Label><Input value={formData.jabatan || ''} onChange={(e) => updateField('jabatan', e.target.value)} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Lokasi *</Label><Input value={formData.lokasiPerusahaan || ''} onChange={(e) => updateField('lokasiPerusahaan', e.target.value)} required /></div>
                <div><Label>Industri</Label><Input value={formData.bidangIndustri || ''} onChange={(e) => updateField('bidangIndustri', e.target.value)} /></div>
              </div>
            </>
          )}

          {status === 'wirausaha' && (
            <>
              <div><Label>Nama Usaha *</Label><Input value={formData.namaUsaha || ''} onChange={(e) => updateField('namaUsaha', e.target.value)} required /></div>
              <div><Label>Jenis Usaha *</Label><Input value={formData.jenisUsaha || ''} onChange={(e) => updateField('jenisUsaha', e.target.value)} required /></div>
              <div><Label>Lokasi Usaha *</Label><Input value={formData.lokasiUsaha || ''} onChange={(e) => updateField('lokasiUsaha', e.target.value)} required /></div>
            </>
          )}

          {status === 'studi' && (
            <>
              <div><Label>Nama Kampus *</Label><Input value={formData.namaKampus || ''} onChange={(e) => updateField('namaKampus', e.target.value)} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Jenjang *</Label><select className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background" value={formData.jenjang || ''} onChange={(e) => updateField('jenjang', e.target.value)} required><option value="">Pilih</option><option value="S1">S1</option><option value="S2">S2</option><option value="S3">S3</option></select></div>
                <div><Label>Program Studi *</Label><Input value={formData.programStudi || ''} onChange={(e) => updateField('programStudi', e.target.value)} required /></div>
              </div>
              <div><Label>Lokasi Kampus</Label><Input value={formData.lokasiKampus || ''} onChange={(e) => updateField('lokasiKampus', e.target.value)} /></div>
            </>
          )}

          {status === 'mencari' && (
            <>
              <div><Label>Bidang yang Diincar</Label><Input value={formData.bidangDiincar || ''} onChange={(e) => updateField('bidangDiincar', e.target.value)} placeholder="HR, Marketing, dll" /></div>
              <div><Label>Lokasi Tujuan</Label><Input value={formData.lokasiTujuan || ''} onChange={(e) => updateField('lokasiTujuan', e.target.value)} placeholder="Jakarta, Semarang" /></div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button type="submit" className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              {existingData ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

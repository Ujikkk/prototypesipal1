import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAlumni } from '@/contexts/AlumniContext';
import { useToast } from '@/hooks/use-toast';
import {
  Trophy, BookOpen, Shield, Briefcase, FolderOpen, Rocket, GraduationCap,
  Plus, ChevronLeft, ChevronRight, X, Check, Calendar, Building2, MapPin,
  FileText, Link as LinkIcon, Award, User
} from 'lucide-react';
import {
  Achievement,
  AchievementCategory,
  ACHIEVEMENT_CATEGORIES,
  KegiatanAchievement,
  PublikasiAchievement,
  HakiAchievement,
  MagangAchievement,
  PortofolioAchievement,
  WirausahaAchievement,
  PengembanganAchievement,
} from '@/types/achievement.types';
import {
  createAchievement,
  getAchievementsByMasterId,
  getAchievementStats,
  deleteAchievement,
} from '@/services/achievement.service';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<AchievementCategory, React.ElementType> = {
  kegiatan: Trophy,
  publikasi: BookOpen,
  haki: Shield,
  magang: Briefcase,
  portofolio: FolderOpen,
  wirausaha: Rocket,
  pengembangan: GraduationCap,
};

export default function PrestasiPage() {
  const navigate = useNavigate();
  const { selectedAlumni } = useAlumni();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<AchievementCategory>('kegiatan');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Record<AchievementCategory, number>>({
    kegiatan: 0, publikasi: 0, haki: 0, magang: 0, portofolio: 0, wirausaha: 0, pengembangan: 0
  });

  useEffect(() => {
    if (!selectedAlumni) {
      navigate('/validasi');
      return;
    }
    refreshData();
  }, [selectedAlumni, navigate]);

  const refreshData = () => {
    if (!selectedAlumni) return;
    setAchievements(getAchievementsByMasterId(selectedAlumni.id));
    setStats(getAchievementStats(selectedAlumni.id));
  };

  const handleDelete = (id: string) => {
    if (deleteAchievement(id)) {
      toast({ title: 'Data berhasil dihapus' });
      refreshData();
    }
  };

  if (!selectedAlumni) return null;

  const filteredAchievements = achievements.filter(a => a.category === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 animate-fade-up">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Prestasi Non-Akademik
                </h1>
                <p className="text-muted-foreground mt-1">
                  Catat pencapaian, publikasi, dan pengalaman Anda
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {(Object.entries(ACHIEVEMENT_CATEGORIES) as [AchievementCategory, typeof ACHIEVEMENT_CATEGORIES[AchievementCategory]][]).map(([key, cat]) => {
                const Icon = CATEGORY_ICONS[key];
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'glass-card rounded-xl p-4 text-center transition-all duration-200 hover:shadow-elevated',
                      isActive && 'ring-2 ring-primary bg-primary/5'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center', 
                      isActive ? 'bg-primary/20' : 'bg-muted')}>
                      <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats[key]}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{cat.label}</p>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = CATEGORY_ICONS[activeTab];
                    return <Icon className="w-6 h-6 text-primary" />;
                  })()}
                  <h2 className="text-lg font-semibold text-foreground">
                    {ACHIEVEMENT_CATEGORIES[activeTab].label}
                  </h2>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>

              {/* Achievement List */}
              {filteredAchievements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    {(() => {
                      const Icon = CATEGORY_ICONS[activeTab];
                      return <Icon className="w-8 h-8 text-muted-foreground" />;
                    })()}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Belum Ada Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Mulai tambahkan {ACHIEVEMENT_CATEGORIES[activeTab].label.toLowerCase()} Anda
                  </p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Sekarang
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onDelete={() => handleDelete(achievement.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Form Modal */}
            {isFormOpen && (
              <AchievementForm
                category={activeTab}
                masterId={selectedAlumni.id}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                  setIsFormOpen(false);
                  refreshData();
                  toast({ title: 'Data berhasil disimpan!' });
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

// Achievement Card Component
function AchievementCard({ achievement, onDelete }: { achievement: Achievement; onDelete: () => void }) {
  const getTitle = (): string => {
    switch (achievement.category) {
      case 'kegiatan': return (achievement as KegiatanAchievement).namaKegiatan;
      case 'publikasi': return (achievement as PublikasiAchievement).judul;
      case 'haki': return (achievement as HakiAchievement).judul;
      case 'magang': return `${(achievement as MagangAchievement).posisi} di ${(achievement as MagangAchievement).namaPerusahaan}`;
      case 'portofolio': return (achievement as PortofolioAchievement).judulProyek;
      case 'wirausaha': return (achievement as WirausahaAchievement).namaUsaha;
      case 'pengembangan': return (achievement as PengembanganAchievement).namaProgram;
      default: return 'Achievement';
    }
  };

  const getSubtitle = (): string => {
    switch (achievement.category) {
      case 'kegiatan': {
        const a = achievement as KegiatanAchievement;
        return `${a.penyelenggara} • ${a.tahun}${a.prestasi ? ` • ${a.prestasi}` : ''}`;
      }
      case 'publikasi': {
        const a = achievement as PublikasiAchievement;
        return `${a.namaJurnal || a.penerbit || 'Publikasi'} • ${a.tahun}`;
      }
      case 'haki': {
        const a = achievement as HakiAchievement;
        return `${a.jenisHaki.replace('_', ' ')} • ${a.status} • ${a.tahunPengajuan}`;
      }
      case 'magang': {
        const a = achievement as MagangAchievement;
        return `${a.lokasi} • ${a.industri}`;
      }
      case 'portofolio': {
        const a = achievement as PortofolioAchievement;
        return `${a.mataKuliah.toUpperCase()} • ${a.tahun} ${a.semester}`;
      }
      case 'wirausaha': {
        const a = achievement as WirausahaAchievement;
        return `${a.jenisUsaha} • ${a.lokasi} • ${a.masihAktif ? 'Aktif' : 'Tidak Aktif'}`;
      }
      case 'pengembangan': {
        const a = achievement as PengembanganAchievement;
        return `${a.penyelenggara}${a.negara ? ` • ${a.negara}` : ''}`;
      }
      default: return '';
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        {(() => {
          const Icon = CATEGORY_ICONS[achievement.category];
          return <Icon className="w-6 h-6 text-primary" />;
        })()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">{getTitle()}</h4>
        <p className="text-sm text-muted-foreground truncate">{getSubtitle()}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Achievement Form Component
function AchievementForm({
  category,
  masterId,
  onClose,
  onSuccess,
}: {
  category: AchievementCategory;
  masterId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createAchievement({
      ...formData,
      masterId,
      category,
    });
    
    onSuccess();
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-auto glass-card rounded-2xl p-6 md:p-8 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Tambah {ACHIEVEMENT_CATEGORIES[category].label}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {category === 'kegiatan' && (
            <KegiatanFormFields formData={formData} updateField={updateField} />
          )}
          {category === 'publikasi' && (
            <PublikasiFormFields formData={formData} updateField={updateField} />
          )}
          {category === 'haki' && (
            <HakiFormFields formData={formData} updateField={updateField} />
          )}
          {category === 'magang' && (
            <MagangFormFields formData={formData} updateField={updateField} />
          )}
          {category === 'portofolio' && (
            <PortofolioFormFields formData={formData} updateField={updateField} />
          )}
          {category === 'wirausaha' && (
            <WirausahaFormFields formData={formData} updateField={updateField} />
          )}
          {category === 'pengembangan' && (
            <PengembanganFormFields formData={formData} updateField={updateField} />
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Form Field Components
interface FormFieldProps {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
}

function KegiatanFormFields({ formData, updateField }: FormFieldProps) {
  return (
    <>
      <div>
        <Label>Jenis Kegiatan *</Label>
        <select
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
          value={formData.jenisKegiatan || ''}
          onChange={(e) => updateField('jenisKegiatan', e.target.value)}
          required
        >
          <option value="">Pilih jenis</option>
          <option value="seminar">Seminar / Workshop</option>
          <option value="lomba">Lomba / Kompetisi</option>
          <option value="pembicara">Pembicara / Narasumber</option>
          <option value="pelatihan">Pelatihan</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>
      <div>
        <Label>Nama Kegiatan *</Label>
        <Input
          value={formData.namaKegiatan || ''}
          onChange={(e) => updateField('namaKegiatan', e.target.value)}
          placeholder="Contoh: Lomba Debat Nasional"
          required
        />
      </div>
      <div>
        <Label>Penyelenggara *</Label>
        <Input
          value={formData.penyelenggara || ''}
          onChange={(e) => updateField('penyelenggara', e.target.value)}
          placeholder="Nama institusi penyelenggara"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tingkat *</Label>
          <select
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
            value={formData.tingkat || ''}
            onChange={(e) => updateField('tingkat', e.target.value)}
            required
          >
            <option value="">Pilih tingkat</option>
            <option value="internal">Internal Kampus</option>
            <option value="regional">Regional / Provinsi</option>
            <option value="nasional">Nasional</option>
            <option value="internasional">Internasional</option>
          </select>
        </div>
        <div>
          <Label>Tahun *</Label>
          <Input
            type="number"
            value={formData.tahun || ''}
            onChange={(e) => updateField('tahun', parseInt(e.target.value))}
            placeholder="2024"
            min="2000"
            max="2030"
            required
          />
        </div>
      </div>
      <div>
        <Label>Prestasi (Opsional)</Label>
        <Input
          value={formData.prestasi || ''}
          onChange={(e) => updateField('prestasi', e.target.value)}
          placeholder="Contoh: Juara 1, Finalis, Best Speaker"
        />
      </div>
      <div>
        <Label>Deskripsi (Opsional)</Label>
        <Textarea
          value={formData.deskripsi || ''}
          onChange={(e) => updateField('deskripsi', e.target.value)}
          placeholder="Jelaskan singkat tentang kegiatan ini"
          rows={3}
        />
      </div>
    </>
  );
}

function PublikasiFormFields({ formData, updateField }: FormFieldProps) {
  return (
    <>
      <div>
        <Label>Jenis Publikasi *</Label>
        <select
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
          value={formData.jenisPublikasi || ''}
          onChange={(e) => updateField('jenisPublikasi', e.target.value)}
          required
        >
          <option value="">Pilih jenis</option>
          <option value="artikel_jurnal">Artikel Jurnal</option>
          <option value="prosiding">Prosiding Konferensi</option>
          <option value="buku">Buku</option>
          <option value="book_chapter">Book Chapter</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>
      <div>
        <Label>Judul Publikasi *</Label>
        <Input
          value={formData.judul || ''}
          onChange={(e) => updateField('judul', e.target.value)}
          placeholder="Judul lengkap publikasi"
          required
        />
      </div>
      <div>
        <Label>Penulis *</Label>
        <Input
          value={formData.penulis || ''}
          onChange={(e) => updateField('penulis', e.target.value)}
          placeholder="Nama penulis (pisahkan dengan koma)"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nama Jurnal / Penerbit</Label>
          <Input
            value={formData.namaJurnal || ''}
            onChange={(e) => updateField('namaJurnal', e.target.value)}
            placeholder="Nama jurnal atau penerbit"
          />
        </div>
        <div>
          <Label>Tahun Terbit *</Label>
          <Input
            type="number"
            value={formData.tahun || ''}
            onChange={(e) => updateField('tahun', parseInt(e.target.value))}
            placeholder="2024"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Volume / Issue</Label>
          <Input
            value={formData.volume || ''}
            onChange={(e) => updateField('volume', e.target.value)}
            placeholder="Vol. 1, No. 2"
          />
        </div>
        <div>
          <Label>DOI</Label>
          <Input
            value={formData.doi || ''}
            onChange={(e) => updateField('doi', e.target.value)}
            placeholder="10.xxxx/xxxxx"
          />
        </div>
      </div>
      <div>
        <Label>URL Publikasi</Label>
        <Input
          value={formData.url || ''}
          onChange={(e) => updateField('url', e.target.value)}
          placeholder="https://..."
        />
      </div>
    </>
  );
}

function HakiFormFields({ formData, updateField }: FormFieldProps) {
  return (
    <>
      <div>
        <Label>Jenis HAKI *</Label>
        <select
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
          value={formData.jenisHaki || ''}
          onChange={(e) => updateField('jenisHaki', e.target.value)}
          required
        >
          <option value="">Pilih jenis</option>
          <option value="hak_cipta">Hak Cipta</option>
          <option value="paten">Paten</option>
          <option value="merek">Merek</option>
          <option value="desain_industri">Desain Industri</option>
          <option value="rahasia_dagang">Rahasia Dagang</option>
        </select>
      </div>
      <div>
        <Label>Judul Karya *</Label>
        <Input
          value={formData.judul || ''}
          onChange={(e) => updateField('judul', e.target.value)}
          placeholder="Judul karya yang didaftarkan"
          required
        />
      </div>
      <div>
        <Label>Pemegang Hak *</Label>
        <Input
          value={formData.pemegang || ''}
          onChange={(e) => updateField('pemegang', e.target.value)}
          placeholder="Nama pemegang hak"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Status *</Label>
          <select
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
            value={formData.status || ''}
            onChange={(e) => updateField('status', e.target.value)}
            required
          >
            <option value="">Pilih status</option>
            <option value="pending">Pending / Proses</option>
            <option value="terdaftar">Terdaftar</option>
            <option value="granted">Granted / Diberikan</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
        <div>
          <Label>Tahun Pengajuan *</Label>
          <Input
            type="number"
            value={formData.tahunPengajuan || ''}
            onChange={(e) => updateField('tahunPengajuan', parseInt(e.target.value))}
            placeholder="2024"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nomor Pendaftaran</Label>
          <Input
            value={formData.nomorPendaftaran || ''}
            onChange={(e) => updateField('nomorPendaftaran', e.target.value)}
            placeholder="Nomor pendaftaran"
          />
        </div>
        <div>
          <Label>Nomor Sertifikat</Label>
          <Input
            value={formData.nomorSertifikat || ''}
            onChange={(e) => updateField('nomorSertifikat', e.target.value)}
            placeholder="Nomor sertifikat (jika sudah terbit)"
          />
        </div>
      </div>
      <div>
        <Label>Deskripsi</Label>
        <Textarea
          value={formData.deskripsi || ''}
          onChange={(e) => updateField('deskripsi', e.target.value)}
          placeholder="Deskripsi singkat tentang karya"
          rows={3}
        />
      </div>
    </>
  );
}

function MagangFormFields({ formData, updateField }: FormFieldProps) {
  return (
    <>
      <div>
        <Label>Nama Perusahaan *</Label>
        <Input
          value={formData.namaPerusahaan || ''}
          onChange={(e) => updateField('namaPerusahaan', e.target.value)}
          placeholder="PT Example Indonesia"
          required
        />
      </div>
      <div>
        <Label>Posisi / Jabatan *</Label>
        <Input
          value={formData.posisi || ''}
          onChange={(e) => updateField('posisi', e.target.value)}
          placeholder="Marketing Intern"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Lokasi *</Label>
          <Input
            value={formData.lokasi || ''}
            onChange={(e) => updateField('lokasi', e.target.value)}
            placeholder="Jakarta"
            required
          />
        </div>
        <div>
          <Label>Industri *</Label>
          <Input
            value={formData.industri || ''}
            onChange={(e) => updateField('industri', e.target.value)}
            placeholder="Manufaktur, Teknologi, dll"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tanggal Mulai *</Label>
          <Input
            type="date"
            value={formData.tanggalMulai || ''}
            onChange={(e) => updateField('tanggalMulai', e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Tanggal Selesai</Label>
          <Input
            type="date"
            value={formData.tanggalSelesai || ''}
            onChange={(e) => updateField('tanggalSelesai', e.target.value)}
            disabled={formData.sedangBerjalan}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sedangBerjalan"
          checked={formData.sedangBerjalan || false}
          onChange={(e) => updateField('sedangBerjalan', e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="sedangBerjalan" className="!mb-0">Masih berlangsung</Label>
      </div>
      <div>
        <Label>Deskripsi Tugas</Label>
        <Textarea
          value={formData.deskripsiTugas || ''}
          onChange={(e) => updateField('deskripsiTugas', e.target.value)}
          placeholder="Jelaskan tugas dan tanggung jawab selama magang"
          rows={3}
        />
      </div>
    </>
  );
}

function PortofolioFormFields({ formData, updateField }: FormFieldProps) {
  return (
    <>
      <div>
        <Label>Mata Kuliah *</Label>
        <select
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
          value={formData.mataKuliah || ''}
          onChange={(e) => updateField('mataKuliah', e.target.value)}
          required
        >
          <option value="">Pilih mata kuliah</option>
          <option value="kwu">KWU (Kewirausahaan)</option>
          <option value="ecommerce">E-Commerce</option>
          <option value="msdm_ocai">MSDM / OCAI</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>
      <div>
        <Label>Judul Proyek *</Label>
        <Input
          value={formData.judulProyek || ''}
          onChange={(e) => updateField('judulProyek', e.target.value)}
          placeholder="Judul proyek praktikum"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tahun *</Label>
          <Input
            type="number"
            value={formData.tahun || ''}
            onChange={(e) => updateField('tahun', parseInt(e.target.value))}
            placeholder="2024"
            required
          />
        </div>
        <div>
          <Label>Semester *</Label>
          <select
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
            value={formData.semester || ''}
            onChange={(e) => updateField('semester', e.target.value)}
            required
          >
            <option value="">Pilih semester</option>
            <option value="ganjil">Ganjil</option>
            <option value="genap">Genap</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Deskripsi Proyek *</Label>
        <Textarea
          value={formData.deskripsiProyek || ''}
          onChange={(e) => updateField('deskripsiProyek', e.target.value)}
          placeholder="Jelaskan tentang proyek ini"
          rows={3}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nilai (Opsional)</Label>
          <Input
            value={formData.nilai || ''}
            onChange={(e) => updateField('nilai', e.target.value)}
            placeholder="A, B+, 90, dll"
          />
        </div>
        <div>
          <Label>URL Proyek</Label>
          <Input
            value={formData.urlProyek || ''}
            onChange={(e) => updateField('urlProyek', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
    </>
  );
}

function WirausahaFormFields({ formData, updateField }: FormFieldProps) {
  return (
    <>
      <div>
        <Label>Nama Usaha *</Label>
        <Input
          value={formData.namaUsaha || ''}
          onChange={(e) => updateField('namaUsaha', e.target.value)}
          placeholder="Nama usaha / bisnis"
          required
        />
      </div>
      <div>
        <Label>Jenis Usaha *</Label>
        <Input
          value={formData.jenisUsaha || ''}
          onChange={(e) => updateField('jenisUsaha', e.target.value)}
          placeholder="F&B, Retail, Jasa, dll"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Lokasi *</Label>
          <Input
            value={formData.lokasi || ''}
            onChange={(e) => updateField('lokasi', e.target.value)}
            placeholder="Semarang"
            required
          />
        </div>
        <div>
          <Label>Tahun Mulai *</Label>
          <Input
            type="number"
            value={formData.tahunMulai || ''}
            onChange={(e) => updateField('tahunMulai', parseInt(e.target.value))}
            placeholder="2024"
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="masihAktif"
          checked={formData.masihAktif ?? true}
          onChange={(e) => updateField('masihAktif', e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="masihAktif" className="!mb-0">Masih aktif beroperasi</Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Jumlah Karyawan</Label>
          <Input
            type="number"
            value={formData.jumlahKaryawan || ''}
            onChange={(e) => updateField('jumlahKaryawan', parseInt(e.target.value))}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Omzet per Bulan</Label>
          <Input
            value={formData.omzetPerBulan || ''}
            onChange={(e) => updateField('omzetPerBulan', e.target.value)}
            placeholder="< 5 juta, 5-10 juta, dll"
          />
        </div>
      </div>
      <div>
        <Label>Deskripsi Usaha *</Label>
        <Textarea
          value={formData.deskripsiUsaha || ''}
          onChange={(e) => updateField('deskripsiUsaha', e.target.value)}
          placeholder="Jelaskan tentang usaha Anda"
          rows={3}
          required
        />
      </div>
    </>
  );
}

function PengembanganFormFields({ formData, updateField }: FormFieldProps) {
  return (
    <>
      <div>
        <Label>Jenis Program *</Label>
        <select
          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20"
          value={formData.jenisProgram || ''}
          onChange={(e) => updateField('jenisProgram', e.target.value)}
          required
        >
          <option value="">Pilih jenis</option>
          <option value="pertukaran_mahasiswa">Pertukaran Mahasiswa</option>
          <option value="beasiswa">Beasiswa</option>
          <option value="volunteer">Volunteer / Relawan</option>
          <option value="organisasi">Organisasi Kemahasiswaan</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>
      <div>
        <Label>Nama Program *</Label>
        <Input
          value={formData.namaProgram || ''}
          onChange={(e) => updateField('namaProgram', e.target.value)}
          placeholder="Nama program yang diikuti"
          required
        />
      </div>
      <div>
        <Label>Penyelenggara *</Label>
        <Input
          value={formData.penyelenggara || ''}
          onChange={(e) => updateField('penyelenggara', e.target.value)}
          placeholder="Nama institusi penyelenggara"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Lokasi</Label>
          <Input
            value={formData.lokasi || ''}
            onChange={(e) => updateField('lokasi', e.target.value)}
            placeholder="Kota / Wilayah"
          />
        </div>
        <div>
          <Label>Negara</Label>
          <Input
            value={formData.negara || ''}
            onChange={(e) => updateField('negara', e.target.value)}
            placeholder="Indonesia"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tanggal Mulai *</Label>
          <Input
            type="date"
            value={formData.tanggalMulai || ''}
            onChange={(e) => updateField('tanggalMulai', e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Tanggal Selesai</Label>
          <Input
            type="date"
            value={formData.tanggalSelesai || ''}
            onChange={(e) => updateField('tanggalSelesai', e.target.value)}
            disabled={formData.sedangBerjalan}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sedangBerjalanDev"
          checked={formData.sedangBerjalan || false}
          onChange={(e) => updateField('sedangBerjalan', e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="sedangBerjalanDev" className="!mb-0">Masih berlangsung</Label>
      </div>
      <div>
        <Label>Deskripsi</Label>
        <Textarea
          value={formData.deskripsi || ''}
          onChange={(e) => updateField('deskripsi', e.target.value)}
          placeholder="Jelaskan tentang program ini"
          rows={3}
        />
      </div>
      <div>
        <Label>Prestasi / Pencapaian</Label>
        <Input
          value={formData.prestasi || ''}
          onChange={(e) => updateField('prestasi', e.target.value)}
          placeholder="Jika ada pencapaian khusus"
        />
      </div>
    </>
  );
}

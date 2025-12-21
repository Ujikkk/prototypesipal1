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
import { FileUpload } from '@/components/shared';
import { CategorySidebar, AchievementTimelineView, type CategoryFilter } from '@/components/prestasi';
import {
  ChevronLeft, Plus, X, Check, Paperclip
} from 'lucide-react';
import {
  Achievement,
  AchievementCategory,
  ACHIEVEMENT_CATEGORIES,
} from '@/types/achievement.types';
import {
  createAchievement,
  getAchievementsByMasterId,
  getAchievementStats,
  deleteAchievement,
} from '@/services/achievement.service';

export default function PrestasiPage() {
  const navigate = useNavigate();
  const { selectedAlumni } = useAlumni();
  const { toast } = useToast();
  
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const handleItemClick = (achievement: Achievement) => {
    setExpandedId(prev => prev === achievement.id ? null : achievement.id);
  };

  if (!selectedAlumni) return null;

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);
  const totalAchievements = Object.values(stats).reduce((a, b) => a + b, 0);

  // Get category for form (default to kegiatan if 'all' is selected)
  const formCategory: AchievementCategory = activeCategory === 'all' ? 'kegiatan' : activeCategory;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8 animate-fade-up">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Prestasi Non-Akademik
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Portofolio pencapaian Anda • {totalAchievements} prestasi tercatat
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Prestasi
              </Button>
            </div>

            {/* Main Content with Sidebar */}
            <div className="flex gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Category Sidebar */}
              <CategorySidebar
                activeCategory={activeCategory}
                stats={stats}
                onCategoryChange={setActiveCategory}
              />

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                <div className="glass-card rounded-2xl p-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      {activeCategory === 'all' ? 'Semua Prestasi' : ACHIEVEMENT_CATEGORIES[activeCategory].label}
                    </h2>
                    <Button onClick={() => setIsFormOpen(true)} size="sm" className="sm:hidden">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Timeline View */}
                  <AchievementTimelineView
                    achievements={filteredAchievements}
                    category={activeCategory}
                    expandedId={expandedId}
                    onItemClick={handleItemClick}
                    onAddNew={() => setIsFormOpen(true)}
                  />
                </div>
              </div>
            </div>

            {/* Mobile FAB */}
            <Button
              onClick={() => setIsFormOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-elevated sm:hidden"
              size="icon"
            >
              <Plus className="w-6 h-6" />
            </Button>

            {/* Form Modal */}
            {isFormOpen && (
              <AchievementForm
                category={formCategory}
                masterId={selectedAlumni.id}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                  setIsFormOpen(false);
                  refreshData();
                  toast({ title: 'Prestasi berhasil ditambahkan!' });
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
    createAchievement({ ...formData, masterId, category });
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
          {category === 'kegiatan' && <KegiatanFields formData={formData} updateField={updateField} />}
          {category === 'publikasi' && <PublikasiFields formData={formData} updateField={updateField} />}
          {category === 'haki' && <HakiFields formData={formData} updateField={updateField} />}
          {category === 'magang' && <MagangFields formData={formData} updateField={updateField} />}
          {category === 'portofolio' && <PortofolioFields formData={formData} updateField={updateField} />}
          {category === 'wirausaha' && <WirausahaFields formData={formData} updateField={updateField} />}
          {category === 'pengembangan' && <PengembanganFields formData={formData} updateField={updateField} />}

          <div className="pt-4 border-t border-border">
            <Label className="flex items-center gap-2 mb-3">
              <Paperclip className="w-4 h-4" />
              Lampiran
            </Label>
            <FileUpload
              value={formData.attachments || []}
              onChange={(attachments) => updateField('attachments', attachments)}
              maxFiles={5}
              maxSizeInMB={5}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button type="submit" className="flex-1"><Check className="w-4 h-4 mr-2" />Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Form Field Components
interface FieldProps { formData: Record<string, any>; updateField: (k: string, v: any) => void; }

function KegiatanFields({ formData, updateField }: FieldProps) {
  return (
    <>
      <div><Label>Nama Kegiatan *</Label><Input value={formData.namaKegiatan || ''} onChange={(e) => updateField('namaKegiatan', e.target.value)} required /></div>
      <div><Label>Penyelenggara *</Label><Input value={formData.penyelenggara || ''} onChange={(e) => updateField('penyelenggara', e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Tingkat *</Label><select className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background" value={formData.tingkat || ''} onChange={(e) => updateField('tingkat', e.target.value)} required><option value="">Pilih</option><option value="internal">Internal</option><option value="regional">Regional</option><option value="nasional">Nasional</option><option value="internasional">Internasional</option></select></div>
        <div><Label>Tahun *</Label><Input type="number" value={formData.tahun || ''} onChange={(e) => updateField('tahun', parseInt(e.target.value))} required /></div>
      </div>
      <div><Label>Prestasi</Label><Input value={formData.prestasi || ''} onChange={(e) => updateField('prestasi', e.target.value)} placeholder="Juara 1, Finalis, dll" /></div>
    </>
  );
}

function PublikasiFields({ formData, updateField }: FieldProps) {
  return (
    <>
      <div><Label>Judul *</Label><Input value={formData.judul || ''} onChange={(e) => updateField('judul', e.target.value)} required /></div>
      <div><Label>Penulis *</Label><Input value={formData.penulis || ''} onChange={(e) => updateField('penulis', e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Jurnal/Penerbit</Label><Input value={formData.namaJurnal || ''} onChange={(e) => updateField('namaJurnal', e.target.value)} /></div>
        <div><Label>Tahun *</Label><Input type="number" value={formData.tahun || ''} onChange={(e) => updateField('tahun', parseInt(e.target.value))} required /></div>
      </div>
    </>
  );
}

function HakiFields({ formData, updateField }: FieldProps) {
  return (
    <>
      <div><Label>Judul *</Label><Input value={formData.judul || ''} onChange={(e) => updateField('judul', e.target.value)} required /></div>
      <div><Label>Pemegang *</Label><Input value={formData.pemegang || ''} onChange={(e) => updateField('pemegang', e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Jenis *</Label><select className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background" value={formData.jenisHaki || ''} onChange={(e) => updateField('jenisHaki', e.target.value)} required><option value="">Pilih</option><option value="hak_cipta">Hak Cipta</option><option value="paten">Paten</option><option value="merek">Merek</option></select></div>
        <div><Label>Status *</Label><select className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background" value={formData.status || ''} onChange={(e) => updateField('status', e.target.value)} required><option value="">Pilih</option><option value="pending">Pending</option><option value="terdaftar">Terdaftar</option><option value="granted">Granted</option></select></div>
      </div>
      <div><Label>Tahun Pengajuan *</Label><Input type="number" value={formData.tahunPengajuan || ''} onChange={(e) => updateField('tahunPengajuan', parseInt(e.target.value))} required /></div>
    </>
  );
}

function MagangFields({ formData, updateField }: FieldProps) {
  return (
    <>
      <div><Label>Perusahaan *</Label><Input value={formData.namaPerusahaan || ''} onChange={(e) => updateField('namaPerusahaan', e.target.value)} required /></div>
      <div><Label>Posisi *</Label><Input value={formData.posisi || ''} onChange={(e) => updateField('posisi', e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Lokasi *</Label><Input value={formData.lokasi || ''} onChange={(e) => updateField('lokasi', e.target.value)} required /></div>
        <div><Label>Industri *</Label><Input value={formData.industri || ''} onChange={(e) => updateField('industri', e.target.value)} required /></div>
      </div>
      <div><Label>Tanggal Mulai *</Label><Input type="date" value={formData.tanggalMulai || ''} onChange={(e) => updateField('tanggalMulai', e.target.value)} required /></div>
    </>
  );
}

function PortofolioFields({ formData, updateField }: FieldProps) {
  return (
    <>
      <div><Label>Judul Proyek *</Label><Input value={formData.judulProyek || ''} onChange={(e) => updateField('judulProyek', e.target.value)} required /></div>
      <div><Label>Mata Kuliah *</Label><select className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background" value={formData.mataKuliah || ''} onChange={(e) => updateField('mataKuliah', e.target.value)} required><option value="">Pilih</option><option value="kwu">KWU</option><option value="ecommerce">E-Commerce</option><option value="msdm_ocai">MSDM/OCAI</option></select></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Tahun *</Label><Input type="number" value={formData.tahun || ''} onChange={(e) => updateField('tahun', parseInt(e.target.value))} required /></div>
        <div><Label>Semester *</Label><select className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background" value={formData.semester || ''} onChange={(e) => updateField('semester', e.target.value)} required><option value="">Pilih</option><option value="ganjil">Ganjil</option><option value="genap">Genap</option></select></div>
      </div>
      <div><Label>Deskripsi *</Label><Textarea value={formData.deskripsiProyek || ''} onChange={(e) => updateField('deskripsiProyek', e.target.value)} required rows={3} /></div>
    </>
  );
}

function WirausahaFields({ formData, updateField }: FieldProps) {
  return (
    <>
      <div><Label>Nama Usaha *</Label><Input value={formData.namaUsaha || ''} onChange={(e) => updateField('namaUsaha', e.target.value)} required /></div>
      <div><Label>Jenis Usaha *</Label><Input value={formData.jenisUsaha || ''} onChange={(e) => updateField('jenisUsaha', e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Lokasi *</Label><Input value={formData.lokasi || ''} onChange={(e) => updateField('lokasi', e.target.value)} required /></div>
        <div><Label>Tahun Mulai *</Label><Input type="number" value={formData.tahunMulai || ''} onChange={(e) => updateField('tahunMulai', parseInt(e.target.value))} required /></div>
      </div>
      <div><Label>Deskripsi *</Label><Textarea value={formData.deskripsiUsaha || ''} onChange={(e) => updateField('deskripsiUsaha', e.target.value)} required rows={3} /></div>
    </>
  );
}

function PengembanganFields({ formData, updateField }: FieldProps) {
  return (
    <>
      <div><Label>Nama Program *</Label><Input value={formData.namaProgram || ''} onChange={(e) => updateField('namaProgram', e.target.value)} required /></div>
      <div><Label>Penyelenggara *</Label><Input value={formData.penyelenggara || ''} onChange={(e) => updateField('penyelenggara', e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Lokasi</Label><Input value={formData.lokasi || ''} onChange={(e) => updateField('lokasi', e.target.value)} /></div>
        <div><Label>Negara</Label><Input value={formData.negara || ''} onChange={(e) => updateField('negara', e.target.value)} /></div>
      </div>
      <div><Label>Tanggal Mulai *</Label><Input type="date" value={formData.tanggalMulai || ''} onChange={(e) => updateField('tanggalMulai', e.target.value)} required /></div>
    </>
  );
}

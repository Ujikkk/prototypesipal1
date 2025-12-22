import { useState } from 'react';
import { 
  X, Calendar, Building2, MapPin, Trophy, BookOpen, Shield, 
  Briefcase, FolderOpen, Rocket, Sprout, Paperclip, Mic, Users,
  ExternalLink, Edit, Trash2, ChevronLeft, ChevronRight, ZoomIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Achievement, 
  AchievementCategory,
  ACHIEVEMENT_CATEGORIES,
  LombaAchievement,
  SeminarAchievement,
  PublikasiAchievement,
  HakiAchievement,
  MagangAchievement,
  PortofolioAchievement,
  WirausahaAchievement,
  PengembanganAchievement,
  OrganisasiAchievement
} from '@/types/achievement.types';

interface AchievementDetailModalProps {
  achievement: Achievement;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CATEGORY_CONFIG: Record<AchievementCategory, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
}> = {
  lomba: { icon: Trophy, color: 'text-warning', bgColor: 'bg-warning/10' },
  seminar: { icon: Mic, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  publikasi: { icon: BookOpen, color: 'text-primary', bgColor: 'bg-primary/10' },
  haki: { icon: Shield, color: 'text-success', bgColor: 'bg-success/10' },
  magang: { icon: Briefcase, color: 'text-info', bgColor: 'bg-info/10' },
  portofolio: { icon: FolderOpen, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  wirausaha: { icon: Rocket, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  pengembangan: { icon: Sprout, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  organisasi: { icon: Users, color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
};

function getAchievementInfo(achievement: Achievement): {
  title: string;
  year: number | string;
  level?: string;
  fields: { label: string; value: string }[];
  description?: string;
} {
  switch (achievement.category) {
    case 'lomba': {
      const a = achievement as LombaAchievement;
      return {
        title: a.namaLomba,
        year: a.tahun,
        level: a.tingkat,
        fields: [
          { label: 'Penyelenggara', value: a.penyelenggara },
          { label: 'Tingkat', value: a.tingkat },
          { label: 'Peran', value: a.peran },
          ...(a.peringkat ? [{ label: 'Peringkat', value: a.peringkat }] : []),
          ...(a.bidang ? [{ label: 'Bidang', value: a.bidang }] : []),
        ],
        description: a.deskripsi,
      };
    }
    case 'seminar': {
      const a = achievement as SeminarAchievement;
      return {
        title: a.namaSeminar,
        year: a.tahun,
        fields: [
          { label: 'Penyelenggara', value: a.penyelenggara },
          { label: 'Peran', value: a.peran },
          { label: 'Mode', value: a.mode },
        ],
        description: a.deskripsi,
      };
    }
    case 'publikasi': {
      const a = achievement as PublikasiAchievement;
      return {
        title: a.judul,
        year: a.tahun,
        fields: [
          { label: 'Jenis', value: a.jenisPublikasi },
          { label: 'Penulis', value: a.penulis },
          ...(a.peranPenulis ? [{ label: 'Peran', value: a.peranPenulis }] : []),
          ...(a.namaJurnal ? [{ label: 'Jurnal/Penerbit', value: a.namaJurnal }] : []),
          ...(a.volume ? [{ label: 'Volume', value: a.volume }] : []),
          ...(a.doi ? [{ label: 'DOI', value: a.doi }] : []),
        ],
        description: a.deskripsi,
      };
    }
    case 'haki': {
      const a = achievement as HakiAchievement;
      return {
        title: a.judul,
        year: a.tahunPengajuan,
        fields: [
          { label: 'Jenis HAKI', value: a.jenisHaki.replace('_', ' ') },
          { label: 'Pemegang', value: a.pemegang },
          { label: 'Status', value: a.status },
          ...(a.nomorPendaftaran ? [{ label: 'No. Pendaftaran', value: a.nomorPendaftaran }] : []),
          ...(a.nomorSertifikat ? [{ label: 'No. Sertifikat', value: a.nomorSertifikat }] : []),
        ],
        description: a.deskripsi,
      };
    }
    case 'magang': {
      const a = achievement as MagangAchievement;
      return {
        title: `${a.posisi} di ${a.namaPerusahaan}`,
        year: `${new Date(a.tanggalMulai).getFullYear()}`,
        fields: [
          { label: 'Perusahaan', value: a.namaPerusahaan },
          { label: 'Posisi', value: a.posisi },
          { label: 'Lokasi', value: a.lokasi },
          { label: 'Industri', value: a.industri },
          { label: 'Periode', value: `${a.tanggalMulai} - ${a.sedangBerjalan ? 'Sekarang' : a.tanggalSelesai}` },
        ],
        description: a.deskripsiTugas,
      };
    }
    case 'portofolio': {
      const a = achievement as PortofolioAchievement;
      return {
        title: a.judulProyek,
        year: a.tahun,
        fields: [
          { label: 'Mata Kuliah', value: a.mataKuliah },
          { label: 'Semester', value: `${a.semester} ${a.tahun}` },
          ...(a.output ? [{ label: 'Output', value: a.output }] : []),
          ...(a.nilai ? [{ label: 'Nilai', value: a.nilai }] : []),
          ...(a.urlProyek ? [{ label: 'URL Proyek', value: a.urlProyek }] : []),
        ],
        description: a.deskripsiProyek,
      };
    }
    case 'wirausaha': {
      const a = achievement as WirausahaAchievement;
      return {
        title: a.namaUsaha,
        year: a.tahunMulai,
        fields: [
          { label: 'Jenis Usaha', value: a.jenisUsaha },
          ...(a.peran ? [{ label: 'Peran', value: a.peran }] : []),
          { label: 'Lokasi', value: a.lokasi },
          { label: 'Status', value: a.masihAktif ? 'Masih Aktif' : 'Tidak Aktif' },
          ...(a.jumlahKaryawan ? [{ label: 'Karyawan', value: `${a.jumlahKaryawan} orang` }] : []),
          ...(a.omzetPerBulan ? [{ label: 'Omzet/Bulan', value: a.omzetPerBulan }] : []),
        ],
        description: a.deskripsiUsaha,
      };
    }
    case 'pengembangan': {
      const a = achievement as PengembanganAchievement;
      return {
        title: a.namaProgram,
        year: new Date(a.tanggalMulai).getFullYear(),
        fields: [
          { label: 'Jenis Program', value: a.jenisProgram.replace('_', ' ') },
          { label: 'Penyelenggara', value: a.penyelenggara },
          ...(a.peranMahasiswa ? [{ label: 'Peran', value: a.peranMahasiswa }] : []),
          ...(a.lokasi ? [{ label: 'Lokasi', value: a.lokasi }] : []),
          ...(a.negara ? [{ label: 'Negara', value: a.negara }] : []),
          { label: 'Periode', value: `${a.tanggalMulai} - ${a.sedangBerjalan ? 'Sekarang' : a.tanggalSelesai}` },
          ...(a.output ? [{ label: 'Output', value: a.output }] : []),
        ],
        description: a.deskripsi,
      };
    }
    case 'organisasi': {
      const a = achievement as OrganisasiAchievement;
      return {
        title: `${a.jabatan} - ${a.namaOrganisasi}`,
        year: new Date(a.periodeMulai).getFullYear(),
        fields: [
          { label: 'Organisasi', value: a.namaOrganisasi },
          { label: 'Jabatan', value: a.jabatan },
          { label: 'Periode', value: `${a.periodeMulai} - ${a.masihAktif ? 'Sekarang' : a.periodeSelesai}` },
        ],
        description: a.deskripsi,
      };
    }
  }
}

export function AchievementDetailModal({ 
  achievement, 
  onClose, 
  onEdit, 
  onDelete 
}: AchievementDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  
  const config = CATEGORY_CONFIG[achievement.category];
  const Icon = config.icon;
  const info = getAchievementInfo(achievement);
  const attachments = achievement.attachments || [];
  const imageAttachments = attachments.filter(a => a.fileType.startsWith('image/'));

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageAttachments.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageAttachments.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal - Drawer on Mobile */}
      <div className={cn(
        'fixed z-50 bg-card border border-border shadow-elevated',
        // Desktop: centered modal
        'lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-2xl lg:max-h-[85vh] lg:rounded-2xl',
        // Mobile: bottom sheet
        'inset-x-0 bottom-0 lg:inset-auto rounded-t-2xl lg:rounded-2xl max-h-[90vh]',
        'animate-slide-in-right lg:animate-scale-in'
      )}>
        <div className="flex flex-col h-full max-h-[90vh] lg:max-h-[85vh]">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', config.bgColor)}>
                <Icon className={cn('w-6 h-6', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground line-clamp-2 mb-1">
                  {info.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    config.bgColor, config.color
                  )}>
                    {ACHIEVEMENT_CATEGORIES[achievement.category].label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {info.year}
                  </span>
                  {info.level && (
                    <span className="text-sm text-muted-foreground capitalize">
                      • {info.level}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Image Gallery */}
            {imageAttachments.length > 0 && (
              <div className="mb-6">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted mb-2">
                  <img
                    src={imageAttachments[currentImageIndex].fileUrl}
                    alt={imageAttachments[currentImageIndex].fileName}
                    className="w-full h-full object-contain cursor-zoom-in"
                    onClick={() => setIsImageZoomed(true)}
                  />
                  
                  {/* Navigation */}
                  {imageAttachments.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Zoom indicator */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-background/80 text-xs text-muted-foreground">
                    <ZoomIn className="w-3 h-3" />
                    <span>Klik untuk zoom</span>
                  </div>
                </div>

                {/* Thumbnails */}
                {imageAttachments.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {imageAttachments.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          'w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                          index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                        )}
                      >
                        <img
                          src={img.fileUrl}
                          alt={img.fileName}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Detail Information */}
            <div className="space-y-4">
              {info.fields.map((field, index) => (
                <div key={index} className="flex justify-between items-start gap-4">
                  <span className="text-sm text-muted-foreground">{field.label}</span>
                  <span className="text-sm font-medium text-foreground text-right capitalize">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            {info.description && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Deskripsi</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {info.description}
                </p>
              </div>
            )}

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Lampiran ({attachments.length})
                </h4>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <Paperclip className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {attachment.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(attachment.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-border">
            {onEdit && (
              <Button variant="outline" className="flex-1" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>

      {/* Zoomed Image Overlay */}
      {isImageZoomed && imageAttachments.length > 0 && (
        <div 
          className="fixed inset-0 z-[60] bg-background/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsImageZoomed(false)}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4"
            onClick={() => setIsImageZoomed(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          <img
            src={imageAttachments[currentImageIndex].fileUrl}
            alt={imageAttachments[currentImageIndex].fileName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}

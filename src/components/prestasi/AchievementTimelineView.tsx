import { useState, useCallback } from 'react';
import { 
  Trophy, BookOpen, Shield, Briefcase, Rocket, Sprout, Mic, Users, FolderOpen,
  Paperclip, Plus, ChevronDown, Building2, MapPin, Calendar,
  User, Award, FileText, ExternalLink, Download, X, ZoomIn,
  Edit3, Trash2, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Achievement, 
  AchievementCategory,
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
import { CategoryFilter } from './CategorySidebar';

interface AchievementTimelineViewProps {
  achievements: Achievement[];
  category: CategoryFilter;
  expandedId: string | null;
  onItemClick: (achievement: Achievement) => void;
  onAddNew: () => void;
  onEdit?: (achievement: Achievement) => void;
  onDelete?: (achievement: Achievement) => void;
}

const CATEGORY_CONFIG: Record<AchievementCategory, { 
  icon: React.ElementType; 
  color: string; 
  nodeColor: string;
  bgColor: string;
  borderColor: string;
}> = {
  lomba: { 
    icon: Trophy, 
    color: 'text-warning', 
    nodeColor: 'bg-warning', 
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30'
  },
  seminar: { 
    icon: Mic, 
    color: 'text-purple-500', 
    nodeColor: 'bg-purple-500', 
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  publikasi: { 
    icon: BookOpen, 
    color: 'text-primary', 
    nodeColor: 'bg-primary', 
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30'
  },
  haki: { 
    icon: Shield, 
    color: 'text-success', 
    nodeColor: 'bg-success', 
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30'
  },
  magang: { 
    icon: Briefcase, 
    color: 'text-info', 
    nodeColor: 'bg-info', 
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30'
  },
  portofolio: { 
    icon: FolderOpen, 
    color: 'text-orange-500', 
    nodeColor: 'bg-orange-500', 
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  },
  wirausaha: { 
    icon: Rocket, 
    color: 'text-destructive', 
    nodeColor: 'bg-destructive', 
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30'
  },
  pengembangan: { 
    icon: Sprout, 
    color: 'text-emerald-500', 
    nodeColor: 'bg-emerald-500', 
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  organisasi: { 
    icon: Users, 
    color: 'text-sky-500', 
    nodeColor: 'bg-sky-500', 
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30'
  },
};

function getAchievementDetails(achievement: Achievement): { 
  title: string; 
  subtitle: string; 
  year: number;
  level?: string;
  result?: string;
} {
  switch (achievement.category) {
    case 'lomba': {
      const a = achievement as LombaAchievement;
      return {
        title: a.namaLomba,
        subtitle: a.penyelenggara,
        year: a.tahun,
        level: a.tingkat === 'internasional' ? 'Internasional' : 
               a.tingkat === 'nasional' ? 'Nasional' : 
               a.tingkat === 'regional' ? 'Regional' : 'Lokal',
        result: a.peringkat,
      };
    }
    case 'seminar': {
      const a = achievement as SeminarAchievement;
      return {
        title: a.namaSeminar,
        subtitle: a.penyelenggara,
        year: a.tahun,
        level: a.peran === 'pembicara' ? 'Pembicara' : 'Peserta',
      };
    }
    case 'publikasi': {
      const a = achievement as PublikasiAchievement;
      return {
        title: a.judul,
        subtitle: a.namaJurnal || a.penerbit || 'Publikasi',
        year: a.tahun,
      };
    }
    case 'haki': {
      const a = achievement as HakiAchievement;
      return {
        title: a.judul,
        subtitle: a.pemegang,
        year: a.tahunPengajuan,
        level: a.jenisHaki.replace('_', ' '),
        result: a.status,
      };
    }
    case 'magang': {
      const a = achievement as MagangAchievement;
      return {
        title: `${a.posisi} di ${a.namaPerusahaan}`,
        subtitle: `${a.industri} • ${a.lokasi}`,
        year: new Date(a.tanggalMulai).getFullYear(),
      };
    }
    case 'portofolio': {
      const a = achievement as PortofolioAchievement;
      return {
        title: a.judulProyek,
        subtitle: a.mataKuliah || 'Proyek',
        year: a.tahun,
        result: a.nilai ? `Nilai: ${a.nilai}` : undefined,
      };
    }
    case 'wirausaha': {
      const a = achievement as WirausahaAchievement;
      return {
        title: a.namaUsaha,
        subtitle: `${a.jenisUsaha} • ${a.lokasi}`,
        year: a.tahunMulai,
        result: a.masihAktif ? 'Masih Aktif' : 'Tidak Aktif',
      };
    }
    case 'pengembangan': {
      const a = achievement as PengembanganAchievement;
      return {
        title: a.namaProgram,
        subtitle: a.penyelenggara + (a.negara ? ` • ${a.negara}` : ''),
        year: new Date(a.tanggalMulai).getFullYear(),
        result: a.output,
      };
    }
    case 'organisasi': {
      const a = achievement as OrganisasiAchievement;
      return {
        title: `${a.jabatan} - ${a.namaOrganisasi}`,
        subtitle: a.namaOrganisasi,
        year: new Date(a.periodeMulai).getFullYear(),
        result: a.masihAktif ? 'Masih Aktif' : 'Selesai',
      };
    }
  }
}

// Category-specific detail fields
function getCategoryDetailFields(achievement: Achievement): { label: string; value: string; icon?: React.ElementType }[] {
  switch (achievement.category) {
    case 'lomba': {
      const a = achievement as LombaAchievement;
      return [
        { label: 'Tingkat', value: a.tingkat?.charAt(0).toUpperCase() + a.tingkat?.slice(1), icon: Award },
        { label: 'Peran', value: a.peran?.charAt(0).toUpperCase() + a.peran?.slice(1), icon: User },
        { label: 'Peringkat / Hasil', value: a.peringkat || '-', icon: Trophy },
        ...(a.bidang ? [{ label: 'Bidang', value: a.bidang, icon: FileText }] : []),
      ].filter(f => f.value && f.value !== '-');
    }
    case 'seminar': {
      const a = achievement as SeminarAchievement;
      return [
        { label: 'Peran', value: a.peran?.charAt(0).toUpperCase() + a.peran?.slice(1), icon: User },
        { label: 'Mode', value: a.mode?.charAt(0).toUpperCase() + a.mode?.slice(1), icon: Award },
        { label: 'Penyelenggara', value: a.penyelenggara, icon: Building2 },
        { label: 'Tahun', value: a.tahun?.toString(), icon: Calendar },
      ].filter(f => f.value);
    }
    case 'magang': {
      const a = achievement as MagangAchievement;
      return [
        { label: 'Nama Perusahaan', value: a.namaPerusahaan, icon: Building2 },
        { label: 'Posisi', value: a.posisi, icon: User },
        { label: 'Lokasi', value: a.lokasi, icon: MapPin },
        { label: 'Industri', value: a.industri, icon: Briefcase },
        { label: 'Periode', value: `${a.tanggalMulai} - ${a.sedangBerjalan ? 'Sekarang' : a.tanggalSelesai || 'Selesai'}`, icon: Calendar },
      ].filter(f => f.value);
    }
    case 'publikasi': {
      const a = achievement as PublikasiAchievement;
      return [
        { label: 'Jenis Publikasi', value: a.jenisPublikasi?.replace('_', ' '), icon: BookOpen },
        { label: 'Penulis', value: a.penulis, icon: User },
        { label: 'Nama Jurnal / Konferensi', value: a.namaJurnal || a.penerbit || '-', icon: Building2 },
        { label: 'Tahun Terbit', value: a.tahun?.toString(), icon: Calendar },
        ...(a.url ? [{ label: 'Link Publikasi', value: a.url, icon: ExternalLink }] : []),
      ].filter(f => f.value && f.value !== '-');
    }
    case 'haki': {
      const a = achievement as HakiAchievement;
      return [
        { label: 'Jenis KI', value: a.jenisHaki?.replace('_', ' '), icon: Shield },
        { label: 'Nomor Pendaftaran', value: a.nomorPendaftaran || '-', icon: FileText },
        { label: 'Status', value: a.status === 'granted' ? 'Granted' : a.status === 'terdaftar' ? 'Terdaftar' : a.status, icon: Award },
      ].filter(f => f.value && f.value !== '-');
    }
    case 'wirausaha': {
      const a = achievement as WirausahaAchievement;
      return [
        { label: 'Nama Usaha', value: a.namaUsaha, icon: Rocket },
        { label: 'Bidang Usaha', value: a.jenisUsaha, icon: Briefcase },
        { label: 'Peran', value: a.peran || 'Founder', icon: User },
        { label: 'Status Usaha', value: a.masihAktif ? 'Aktif' : 'Tidak Aktif', icon: Award },
      ].filter(f => f.value);
    }
    case 'pengembangan': {
      const a = achievement as PengembanganAchievement;
      return [
        { label: 'Jenis Aktivitas', value: a.jenisProgram?.replace('_', ' '), icon: Sprout },
        { label: 'Penyelenggara', value: a.penyelenggara, icon: Building2 },
        ...(a.peranMahasiswa ? [{ label: 'Peran', value: a.peranMahasiswa, icon: User }] : []),
        { label: 'Output', value: a.output || 'Sertifikat', icon: Award },
      ].filter(f => f.value);
    }
    case 'portofolio': {
      const a = achievement as PortofolioAchievement;
      return [
        { label: 'Mata Kuliah', value: a.mataKuliah, icon: BookOpen },
        { label: 'Semester', value: `${a.semester?.charAt(0).toUpperCase()}${a.semester?.slice(1)} ${a.tahun}`, icon: Calendar },
        ...(a.output ? [{ label: 'Output', value: a.output, icon: FileText }] : []),
        ...(a.nilai ? [{ label: 'Nilai', value: a.nilai, icon: Award }] : []),
      ].filter(f => f.value);
    }
    case 'organisasi': {
      const a = achievement as OrganisasiAchievement;
      return [
        { label: 'Nama Organisasi', value: a.namaOrganisasi, icon: Users },
        { label: 'Jabatan / Peran', value: a.jabatan, icon: User },
        { label: 'Periode', value: `${a.periodeMulai} - ${a.masihAktif ? 'Sekarang' : a.periodeSelesai || 'Selesai'}`, icon: Calendar },
      ].filter(f => f.value);
    }
    default:
      return [];
  }
}

// Image Lightbox Component
function ImageLightbox({ 
  images, 
  currentIndex, 
  onClose, 
  onNavigate 
}: { 
  images: { fileUrl: string; fileName: string }[]; 
  currentIndex: number; 
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const currentImage = images[currentIndex];
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden bg-muted">
          <img 
            src={currentImage.fileUrl} 
            alt={currentImage.fileName}
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(idx)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  idx === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
              />
            ))}
          </div>
        )}

        {/* Download Button */}
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm" asChild>
            <a href={currentImage.fileUrl} download={currentImage.fileName}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AchievementTimelineView({ 
  achievements, 
  category, 
  expandedId,
  onItemClick, 
  onAddNew,
  onEdit,
  onDelete
}: AchievementTimelineViewProps) {
  const [lightboxState, setLightboxState] = useState<{ images: any[]; index: number } | null>(null);

  const openLightbox = useCallback((images: any[], index: number) => {
    setLightboxState({ images, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxState(null);
  }, []);

  // Group achievements by year
  const groupedByYear = achievements.reduce((acc, achievement) => {
    const details = getAchievementDetails(achievement);
    const year = details.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push({ achievement, details });
    return acc;
  }, {} as Record<number, { achievement: Achievement; details: ReturnType<typeof getAchievementDetails> }[]>);

  // Sort years descending
  const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  // Empty State
  if (achievements.length === 0) {
    const isAllCategory = category === 'all';
    return (
      <div className="text-center py-16 px-4">
        {/* Illustration */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-soft">
          <Trophy className="w-12 h-12 text-primary/60" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Belum ada prestasi {isAllCategory ? '' : 'di kategori ini'}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
          Yuk, tambahkan pencapaianmu. Dokumentasikan setiap prestasi yang kamu raih selama perjalanan akademik.
        </p>
        
        <Button onClick={onAddNew} size="lg" className="shadow-soft">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prestasi
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Timeline Line (Desktop) */}
        <div className="absolute left-[23px] top-8 bottom-4 w-0.5 bg-gradient-to-b from-border via-border to-transparent hidden md:block" />

        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year} className="relative">
              {/* Year Marker */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center z-10 relative shadow-soft">
                  <span className="font-bold text-foreground text-sm">{year}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              {/* Achievements for this year */}
              <div className="md:pl-16 space-y-3">
                {groupedByYear[year].map(({ achievement, details }) => {
                  const config = CATEGORY_CONFIG[achievement.category];
                  const Icon = config.icon;
                  const hasAttachments = achievement.attachments && achievement.attachments.length > 0;
                  const isExpanded = expandedId === achievement.id;
                  const detailFields = getCategoryDetailFields(achievement);
                  const imageAttachments = achievement.attachments?.filter(a => a.fileType.startsWith('image/')) || [];
                  const documentAttachments = achievement.attachments?.filter(a => !a.fileType.startsWith('image/')) || [];

                  return (
                    <div key={achievement.id} className="relative">
                      {/* Timeline Node (Desktop) */}
                      <div className={cn(
                        'hidden md:flex absolute -left-[52px] top-6 w-4 h-4 rounded-full items-center justify-center',
                        config.nodeColor,
                        'ring-4 ring-background'
                      )}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                      </div>

                      {/* Main Achievement Card */}
                      <div
                        onClick={() => onItemClick(achievement)}
                        className={cn(
                          'relative p-5 rounded-2xl cursor-pointer transition-all duration-300',
                          'bg-card border shadow-soft',
                          isExpanded 
                            ? cn('border-2', config.borderColor, 'shadow-elevated') 
                            : 'border-border/50 hover:shadow-elevated hover:-translate-y-0.5 hover:border-border',
                          'group'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {/* Category Icon */}
                          <div className={cn(
                            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105',
                            config.bgColor
                          )}>
                            <Icon className={cn('w-5 h-5', config.color)} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug pr-2">
                                {details.title}
                              </h4>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {details.level && (
                                  <span className={cn(
                                    'text-xs font-medium px-2.5 py-1 rounded-full capitalize',
                                    config.bgColor,
                                    config.color
                                  )}>
                                    {details.level}
                                  </span>
                                )}
                                <ChevronDown className={cn(
                                  'w-4 h-4 text-muted-foreground transition-transform duration-200',
                                  isExpanded && 'rotate-180'
                                )} />
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {details.subtitle}
                            </p>

                            {/* Result Badge */}
                            {details.result && (
                              <div className="mt-2">
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground bg-muted px-2.5 py-1 rounded-lg">
                                  <Award className="w-3.5 h-3.5 text-warning" />
                                  {details.result}
                                </span>
                              </div>
                            )}

                            {/* Document Indicator (when collapsed) */}
                            {hasAttachments && !isExpanded && (
                              <div className="flex items-center gap-1.5 mt-3">
                                <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Dokumen tersedia
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Inline Dropdown */}
                      {isExpanded && (
                        <div className="mt-3 rounded-2xl border border-border bg-card overflow-hidden animate-scale-in shadow-soft">
                          {/* Documentation Section */}
                          <div className="p-5 border-b border-border">
                            <h5 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-primary" />
                              Dokumentasi
                            </h5>

                            {imageAttachments.length > 0 ? (
                              <div className="flex gap-3 overflow-x-auto pb-2 -mb-2">
                                {imageAttachments.map((img, idx) => (
                                  <div 
                                    key={img.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openLightbox(imageAttachments, idx);
                                    }}
                                    className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-muted cursor-pointer group/img"
                                  >
                                    <img
                                      src={img.fileUrl}
                                      alt={img.fileName}
                                      className="w-full h-full object-cover transition-transform duration-200 group-hover/img:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-foreground/0 group-hover/img:bg-foreground/20 transition-colors flex items-center justify-center">
                                      <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-muted/50 text-muted-foreground">
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-sm">Dokumentasi belum diunggah</span>
                              </div>
                            )}

                            {/* Document Attachments */}
                            {documentAttachments.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {documentAttachments.map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group/doc"
                                  >
                                    <FileText className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium text-foreground flex-1 truncate">
                                      {doc.fileName}
                                    </span>
                                    <Download className="w-4 h-4 text-muted-foreground group-hover/doc:text-primary transition-colors" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Detail Information Section */}
                          <div className="p-5 bg-muted/30">
                            <h5 className="text-sm font-semibold text-foreground mb-4">
                              Informasi Detail
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {detailFields.map((field, index) => {
                                const FieldIcon = field.icon;
                                const isLink = field.label.includes('Link');
                                
                                return (
                                  <div key={index} className="flex items-start gap-3">
                                    {FieldIcon && (
                                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                                        <FieldIcon className="w-4 h-4 text-muted-foreground" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
                                      {isLink ? (
                                        <a 
                                          href={field.value}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-sm font-medium text-primary hover:underline"
                                        >
                                          Lihat Publikasi
                                        </a>
                                      ) : (
                                        <p className="text-sm font-medium text-foreground capitalize">
                                          {field.value}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Description if available */}
                            {((achievement as any).deskripsi || (achievement as any).deskripsiTugas || (achievement as any).deskripsiProyek || (achievement as any).deskripsiUsaha) && (
                              <div className="mt-5 pt-5 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-2">Deskripsi</p>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {(achievement as any).deskripsi || (achievement as any).deskripsiTugas || (achievement as any).deskripsiProyek || (achievement as any).deskripsiUsaha}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="p-4 border-t border-border bg-background/50 flex items-center justify-end gap-2">
                            {onEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(achievement);
                                }}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit Prestasi
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(achievement);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxState && (
        <ImageLightbox
          images={lightboxState.images}
          currentIndex={lightboxState.index}
          onClose={closeLightbox}
          onNavigate={(index) => setLightboxState(prev => prev ? { ...prev, index } : null)}
        />
      )}
    </>
  );
}

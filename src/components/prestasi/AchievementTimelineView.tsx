import { useState } from 'react';
import { 
  Trophy, BookOpen, Shield, Briefcase, FolderOpen, Rocket, GraduationCap,
  Paperclip, Plus, ChevronDown, ChevronUp, Building2, MapPin, Calendar,
  User, Award, FileText, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  PengembanganAchievement
} from '@/types/achievement.types';
import { CategoryFilter } from './CategorySidebar';

interface AchievementTimelineViewProps {
  achievements: Achievement[];
  category: CategoryFilter;
  expandedId: string | null;
  onItemClick: (achievement: Achievement) => void;
  onAddNew: () => void;
}

const CATEGORY_CONFIG: Record<AchievementCategory, { 
  icon: React.ElementType; 
  color: string; 
  nodeColor: string;
  bgColor: string;
}> = {
  kegiatan: { icon: Trophy, color: 'text-warning', nodeColor: 'bg-warning', bgColor: 'bg-warning/10' },
  publikasi: { icon: BookOpen, color: 'text-primary', nodeColor: 'bg-primary', bgColor: 'bg-primary/10' },
  haki: { icon: Shield, color: 'text-success', nodeColor: 'bg-success', bgColor: 'bg-success/10' },
  magang: { icon: Briefcase, color: 'text-info', nodeColor: 'bg-info', bgColor: 'bg-info/10' },
  portofolio: { icon: FolderOpen, color: 'text-muted-foreground', nodeColor: 'bg-muted-foreground', bgColor: 'bg-muted' },
  wirausaha: { icon: Rocket, color: 'text-destructive', nodeColor: 'bg-destructive', bgColor: 'bg-destructive/10' },
  pengembangan: { icon: GraduationCap, color: 'text-accent-foreground', nodeColor: 'bg-accent', bgColor: 'bg-accent/10' },
};

function getAchievementDetails(achievement: Achievement): { 
  title: string; 
  subtitle: string; 
  year: number;
  level?: string;
  result?: string;
} {
  switch (achievement.category) {
    case 'kegiatan': {
      const a = achievement as KegiatanAchievement;
      return {
        title: a.namaKegiatan,
        subtitle: a.penyelenggara,
        year: a.tahun,
        level: a.tingkat === 'internasional' ? 'Internasional' : 
               a.tingkat === 'nasional' ? 'Nasional' : 
               a.tingkat === 'regional' ? 'Regional' : 'Internal',
        result: a.prestasi,
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
        subtitle: a.mataKuliah.toUpperCase(),
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
        result: a.prestasi,
      };
    }
  }
}

// Category-specific detail fields
function getCategoryDetailFields(achievement: Achievement): { label: string; value: string; icon?: React.ElementType }[] {
  switch (achievement.category) {
    case 'magang': {
      const a = achievement as MagangAchievement;
      return [
        { label: 'Nama Perusahaan / Institusi', value: a.namaPerusahaan, icon: Building2 },
        { label: 'Posisi / Peran', value: a.posisi, icon: User },
        { label: 'Industri', value: a.industri, icon: Briefcase },
        { label: 'Lokasi', value: a.lokasi, icon: MapPin },
        { label: 'Periode', value: `${a.tanggalMulai} - ${a.sedangBerjalan ? 'Sekarang' : a.tanggalSelesai || 'Selesai'}`, icon: Calendar },
      ].filter(f => f.value);
    }
    case 'kegiatan': {
      const a = achievement as KegiatanAchievement;
      return [
        { label: 'Nama Kegiatan / Lomba', value: a.namaKegiatan, icon: Trophy },
        { label: 'Penyelenggara', value: a.penyelenggara, icon: Building2 },
        { label: 'Tingkat', value: a.tingkat?.charAt(0).toUpperCase() + a.tingkat?.slice(1), icon: Award },
        { label: 'Peringkat / Hasil', value: a.prestasi || '-', icon: Award },
        { label: 'Tahun', value: a.tahun?.toString(), icon: Calendar },
      ].filter(f => f.value);
    }
    case 'publikasi': {
      const a = achievement as PublikasiAchievement;
      return [
        { label: 'Judul Karya', value: a.judul, icon: FileText },
        { label: 'Jenis Publikasi', value: a.jenisPublikasi?.replace('_', ' '), icon: BookOpen },
        { label: 'Penyelenggara / Penerbit', value: a.namaJurnal || a.penerbit || '-', icon: Building2 },
        { label: 'Tahun Terbit', value: a.tahun?.toString(), icon: Calendar },
        { label: 'Peran', value: a.penulis, icon: User },
      ].filter(f => f.value);
    }
    case 'haki': {
      const a = achievement as HakiAchievement;
      return [
        { label: 'Judul KI', value: a.judul, icon: Shield },
        { label: 'Jenis', value: a.jenisHaki?.replace('_', ' '), icon: FileText },
        { label: 'Nomor Pendaftaran', value: a.nomorPendaftaran || '-', icon: FileText },
        { label: 'Status', value: a.status?.charAt(0).toUpperCase() + a.status?.slice(1), icon: Award },
        { label: 'Tahun', value: a.tahunPengajuan?.toString(), icon: Calendar },
      ].filter(f => f.value);
    }
    case 'wirausaha': {
      const a = achievement as WirausahaAchievement;
      return [
        { label: 'Nama Usaha', value: a.namaUsaha, icon: Rocket },
        { label: 'Bidang Usaha', value: a.jenisUsaha, icon: Briefcase },
        { label: 'Peran', value: 'Founder', icon: User },
        { label: 'Skala Usaha', value: a.jumlahKaryawan ? `${a.jumlahKaryawan} Karyawan` : 'Individu', icon: Building2 },
        { label: 'Periode', value: `${a.tahunMulai} - ${a.masihAktif ? 'Sekarang' : a.tahunSelesai || 'Selesai'}`, icon: Calendar },
      ].filter(f => f.value);
    }
    case 'pengembangan': {
      const a = achievement as PengembanganAchievement;
      return [
        { label: 'Nama Kegiatan', value: a.namaProgram, icon: GraduationCap },
        { label: 'Jenis Kegiatan', value: a.jenisProgram?.replace('_', ' '), icon: FileText },
        { label: 'Penyelenggara', value: a.penyelenggara, icon: Building2 },
        { label: 'Tahun', value: new Date(a.tanggalMulai).getFullYear().toString(), icon: Calendar },
        { label: 'Durasi', value: a.tanggalSelesai ? `${a.tanggalMulai} - ${a.tanggalSelesai}` : 'Berlangsung', icon: Calendar },
      ].filter(f => f.value);
    }
    case 'portofolio': {
      const a = achievement as PortofolioAchievement;
      return [
        { label: 'Judul Proyek', value: a.judulProyek, icon: FolderOpen },
        { label: 'Mata Kuliah', value: a.mataKuliah?.toUpperCase(), icon: BookOpen },
        { label: 'Semester', value: `${a.semester?.charAt(0).toUpperCase()}${a.semester?.slice(1)} ${a.tahun}`, icon: Calendar },
        { label: 'Nilai', value: a.nilai || '-', icon: Award },
      ].filter(f => f.value);
    }
  }
}

export function AchievementTimelineView({ 
  achievements, 
  category, 
  expandedId,
  onItemClick, 
  onAddNew 
}: AchievementTimelineViewProps) {
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

  if (achievements.length === 0) {
    const isAllCategory = category === 'all';
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Belum ada prestasi {isAllCategory ? '' : 'di kategori ini'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Yuk, tambahkan pencapaianmu
        </p>
        <Button onClick={onAddNew} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prestasi
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

      <div className="space-y-8">
        {sortedYears.map((year) => (
          <div key={year} className="relative">
            {/* Year Marker */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center z-10 relative">
                <span className="font-bold text-foreground">{year}</span>
              </div>
              <div className="h-px flex-1 bg-border" />
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

                return (
                  <div key={achievement.id} className="relative">
                    {/* Main Card */}
                    <div
                      onClick={() => onItemClick(achievement)}
                      className={cn(
                        'relative p-4 rounded-xl cursor-pointer transition-all duration-200',
                        'bg-card border',
                        isExpanded 
                          ? 'border-primary/50 shadow-soft' 
                          : 'border-border/50 hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/30',
                        'group'
                      )}
                    >
                      {/* Timeline Node (Desktop) */}
                      <div className={cn(
                        'hidden md:block absolute -left-[52px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full',
                        config.nodeColor
                      )} />

                      <div className="flex items-start gap-4">
                        {/* Category Icon */}
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          config.bgColor
                        )}>
                          <Icon className={cn('w-5 h-5', config.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {details.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {details.level && (
                                <span className={cn(
                                  'text-xs font-medium px-2 py-0.5 rounded-full',
                                  config.bgColor,
                                  config.color
                                )}>
                                  {details.level}
                                </span>
                              )}
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {details.subtitle}
                          </p>

                          {details.result && (
                            <p className="text-sm font-medium text-foreground mt-1">
                              {details.result}
                            </p>
                          )}

                          {/* Attachments Indicator */}
                          {hasAttachments && !isExpanded && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Dokumen tersedia
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Dropdown Detail */}
                    {isExpanded && (
                      <div className="mt-2 rounded-xl border border-border bg-muted/30 overflow-hidden animate-fade-in">
                        {/* Documentation Preview */}
                        {imageAttachments.length > 0 && (
                          <div className="p-4 border-b border-border">
                            <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                              <Paperclip className="w-4 h-4" />
                              Dokumentasi
                            </h5>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {imageAttachments.map((img) => (
                                <div 
                                  key={img.id}
                                  className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted"
                                >
                                  <img
                                    src={img.fileUrl}
                                    alt={img.fileName}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Detail Information Section */}
                        <div className="p-4 bg-background/50">
                          <h5 className="text-sm font-medium text-muted-foreground mb-3">
                            Informasi Detail
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {detailFields.map((field, index) => {
                              const FieldIcon = field.icon;
                              return (
                                <div key={index} className="flex items-start gap-3">
                                  {FieldIcon && (
                                    <FieldIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">{field.label}</p>
                                    <p className="text-sm font-medium text-foreground capitalize">
                                      {field.value}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Description if available */}
                          {(achievement as any).deskripsi || (achievement as any).deskripsiTugas || (achievement as any).deskripsiProyek || (achievement as any).deskripsiUsaha ? (
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                              <p className="text-sm text-foreground leading-relaxed">
                                {(achievement as any).deskripsi || (achievement as any).deskripsiTugas || (achievement as any).deskripsiProyek || (achievement as any).deskripsiUsaha}
                              </p>
                            </div>
                          ) : null}
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
  );
}

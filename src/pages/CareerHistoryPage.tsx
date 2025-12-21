import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAlumni } from '@/contexts/AlumniContext';
import { 
  Briefcase, Rocket, GraduationCap, Search, ChevronLeft, 
  MapPin, Calendar, Building2, User, Plus, Pencil, Trash2, Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { isCareerHistoryVisible } from '@/data/student-seed-data';
import type { StudentStatus } from '@/types/student.types';

// Career status configuration
const STATUS_CONFIG = {
  bekerja: {
    icon: Briefcase,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    nodeColor: 'bg-primary',
    label: 'Bekerja',
  },
  wirausaha: {
    icon: Rocket,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    nodeColor: 'bg-success',
    label: 'Wirausaha',
  },
  studi: {
    icon: GraduationCap,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
    nodeColor: 'bg-info',
    label: 'Studi Lanjut',
  },
  mencari: {
    icon: Search,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    nodeColor: 'bg-warning',
    label: 'Mencari Kerja',
  },
};

interface CareerItem {
  id: string;
  year: number;
  status: 'bekerja' | 'wirausaha' | 'studi' | 'mencari';
  title: string;
  subtitle?: string;
  location?: string;
  industry?: string;
  period?: string;
  isActive?: boolean;
}

export default function CareerHistoryPage() {
  const navigate = useNavigate();
  const { selectedAlumni, getAlumniDataByMasterId } = useAlumni();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedAlumni) {
      navigate('/validasi');
      return;
    }
    
    const studentStatus: StudentStatus = (selectedAlumni as any).status || 'alumni';
    if (!isCareerHistoryVisible(studentStatus)) {
      navigate('/dashboard');
    }
  }, [selectedAlumni, navigate]);

  if (!selectedAlumni) return null;

  const alumniHistory = getAlumniDataByMasterId(selectedAlumni.id);

  // Transform career history data
  const careerItems: CareerItem[] = alumniHistory.map((data, index) => {
    let title = '';
    let subtitle = '';
    let location = '';
    let industry = '';
    let period = '';

    if (data.status === 'bekerja') {
      title = data.namaPerusahaan || 'Perusahaan';
      subtitle = data.jabatan || 'Karyawan';
      location = data.lokasiPerusahaan || '';
      industry = data.bidangIndustri || '';
      period = data.tahunMulaiKerja ? `${data.tahunMulaiKerja} - Sekarang` : '';
    } else if (data.status === 'wirausaha') {
      title = data.namaUsaha || 'Usaha';
      subtitle = data.jenisUsaha || 'Bisnis';
      location = data.lokasiUsaha || '';
      period = data.tahunMulaiUsaha ? `${data.tahunMulaiUsaha} - Sekarang` : '';
    } else if (data.status === 'studi') {
      title = data.namaKampus || 'Kampus';
      subtitle = `${data.jenjang || ''} ${data.programStudi || ''}`.trim();
      location = data.lokasiKampus || '';
      period = data.tahunMulaiStudi ? `${data.tahunMulaiStudi} - Sekarang` : '';
    } else if (data.status === 'mencari') {
      title = 'Mencari Pekerjaan';
      subtitle = `Target: ${data.bidangDiincar || 'Berbagai bidang'}`;
      location = data.lokasiTujuan || '';
    }

    return {
      id: data.id,
      year: data.tahunPengisian,
      status: data.status as 'bekerja' | 'wirausaha' | 'studi' | 'mencari',
      title,
      subtitle,
      location,
      industry,
      period,
      isActive: index === alumniHistory.length - 1,
    };
  });

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              className="mb-6 -ml-2"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke Dashboard
            </Button>

            {/* Page Header */}
            <div className="mb-8 animate-fade-up">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Riwayat Karir Alumni
              </h1>
              <p className="text-muted-foreground">
                Perjalanan profesional setelah masa studi
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar - Sticky */}
              <div className="lg:col-span-4 xl:col-span-3">
                <div className="lg:sticky lg:top-28">
                  <div className="glass-card rounded-2xl p-6 animate-fade-up">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {selectedAlumni.nama}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          NIM: {selectedAlumni.nim}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Program Studi:</span>
                        <span className="text-foreground font-medium truncate">
                          {selectedAlumni.prodi}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Jurusan:</span>
                        <span className="text-foreground font-medium truncate">
                          {selectedAlumni.jurusan}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Tahun Lulus:</span>
                        <span className="text-foreground font-medium">
                          {selectedAlumni.tahunLulus}
                        </span>
                      </div>
                    </div>

                    {/* Alumni Status Badge */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                        <User className="w-3.5 h-3.5" />
                        Status: Alumni
                      </span>
                    </div>
                  </div>

                  {/* Add Career Button */}
                  <Button 
                    className="w-full mt-4"
                    onClick={() => navigate('/form')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Karir
                  </Button>
                </div>
              </div>

              {/* Right Content - Career Timeline */}
              <div className="lg:col-span-8 xl:col-span-9 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                {careerItems.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

                    <div className="space-y-4">
                      {careerItems.map((item) => {
                        const config = STATUS_CONFIG[item.status];
                        const Icon = config.icon;
                        const isExpanded = expandedId === item.id;

                        return (
                          <div key={item.id} className="relative">
                            {/* Timeline node for desktop */}
                            <div className="absolute left-[19px] top-6 w-3 h-3 rounded-full z-10 hidden sm:block"
                              style={{ backgroundColor: `hsl(var(--${item.status === 'bekerja' ? 'primary' : item.status === 'wirausaha' ? 'success' : item.status === 'studi' ? 'info' : 'warning'}))` }}
                            />

                            {/* Content Card */}
                            <div className={cn('sm:ml-14', isExpanded && 'mb-4')}>
                              <div
                                onClick={() => handleToggle(item.id)}
                                className={cn(
                                  'p-5 rounded-xl border transition-all duration-300 cursor-pointer',
                                  'hover:shadow-elevated',
                                  config.bgColor, config.borderColor,
                                  isExpanded && 'shadow-elevated'
                                )}
                              >
                                <div className="flex items-start gap-4">
                                  {/* Icon */}
                                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', config.bgColor)}>
                                    <Icon className={cn('w-6 h-6', config.color)} />
                                  </div>

                                  {/* Main Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <span className={cn(
                                        'text-xs font-medium px-2.5 py-1 rounded-full',
                                        config.bgColor, config.color
                                      )}>
                                        {config.label}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-medium">
                                        {item.year}
                                      </span>
                                      {item.isActive && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                                          Aktif
                                        </span>
                                      )}
                                    </div>

                                    <h4 className="font-semibold text-foreground text-lg break-words">
                                      {item.title}
                                    </h4>
                                    {item.subtitle && (
                                      <p className="text-muted-foreground mt-1 break-words">
                                        {item.subtitle}
                                      </p>
                                    )}
                                    {item.location && (
                                      <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="break-words">{item.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                  <div className="mt-5 pt-5 border-t border-border/50 animate-fade-up">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                      {item.industry && (
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">Industri</p>
                                          <p className="text-sm font-medium text-foreground break-words">{item.industry}</p>
                                        </div>
                                      )}
                                      {item.period && (
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">Periode</p>
                                          <p className="text-sm font-medium text-foreground">{item.period}</p>
                                        </div>
                                      )}
                                      {item.location && (
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">Lokasi</p>
                                          <p className="text-sm font-medium text-foreground break-words">{item.location}</p>
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                                        <p className={cn(
                                          'text-sm font-medium',
                                          item.isActive ? 'text-success' : 'text-muted-foreground'
                                        )}>
                                          {item.isActive ? 'Masih aktif' : 'Sudah selesai'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate('/form');
                                        }}
                                      >
                                        <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Delete functionality would go here
                                        }}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        Hapus
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="glass-card rounded-2xl p-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Belum Ada Riwayat Karir
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Tambahkan perjalanan profesionalmu setelah lulus untuk membangun rekam jejak karir yang lengkap.
                    </p>
                    <Button onClick={() => navigate('/form')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Karir
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Building, 
  Calendar, 
  FileText, 
  ArrowRight,
  Clock,
  Briefcase,
  TrendingUp,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAlumniStore, AlumniStatus } from '@/stores/alumniStore';

const statusLabels: Record<AlumniStatus, { label: string; color: string; icon: any }> = {
  working: { label: 'Bekerja', color: 'bg-accent text-accent-foreground', icon: Briefcase },
  searching: { label: 'Mencari Kerja', color: 'bg-warning text-warning-foreground', icon: Clock },
  entrepreneur: { label: 'Wirausaha', color: 'bg-success text-success-foreground', icon: Rocket },
  studying: { label: 'Melanjutkan Studi', color: 'bg-destructive text-destructive-foreground', icon: GraduationCap },
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { currentAlumni, isValidated, getAlumniSubmissions, masterData, submissions } = useAlumniStore();

  useEffect(() => {
    if (!isValidated || !currentAlumni) {
      navigate('/validasi');
    }
  }, [isValidated, currentAlumni, navigate]);

  if (!currentAlumni) {
    return null;
  }

  const alumniSubmissions = getAlumniSubmissions(currentAlumni.id);
  const latestSubmission = alumniSubmissions[alumniSubmissions.length - 1];

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Welcome Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Selamat Datang, {currentAlumni.nama.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Berikut adalah ringkasan data alumni Anda.
            </p>
          </div>

          {/* Profile Card */}
          <Card variant="elevated" className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-medium">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentAlumni.nama}</CardTitle>
                  <CardDescription>NIM: {currentAlumni.nim}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>Jurusan</span>
                  </div>
                  <p className="font-medium text-foreground">{currentAlumni.jurusan}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>Program Studi</span>
                  </div>
                  <p className="font-medium text-foreground">{currentAlumni.prodi}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Tahun Lulus</span>
                  </div>
                  <p className="font-medium text-foreground">{currentAlumni.tahunLulus}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                  {latestSubmission ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium ${statusLabels[latestSubmission.status].color}`}>
                      {statusLabels[latestSubmission.status].label}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Belum diisi</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card 
            variant="gradient" 
            className="mb-8 relative overflow-hidden animate-fade-in" 
            style={{ animationDelay: '200ms' }}
          >
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <CardContent className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">
                    {latestSubmission ? 'Update Status Anda' : 'Isi Data Status Alumni'}
                  </h2>
                  <p className="text-primary-foreground/80">
                    {latestSubmission 
                      ? 'Apakah ada perubahan status karir atau studi Anda?'
                      : 'Lengkapi informasi status kerja, usaha, atau studi lanjutan Anda.'
                    }
                  </p>
                </div>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 border"
                >
                  <Link to="/form">
                    {latestSubmission ? 'Update Data' : 'Isi Form Sekarang'}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {alumniSubmissions.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Riwayat Status
              </h2>
              
              <div className="space-y-4">
                {alumniSubmissions.map((submission, index) => {
                  const StatusIcon = statusLabels[submission.status].icon;
                  return (
                    <Card 
                      key={submission.id} 
                      variant="status"
                      className={`border-l-4 ${
                        submission.status === 'working' ? 'border-l-accent' :
                        submission.status === 'searching' ? 'border-l-warning' :
                        submission.status === 'entrepreneur' ? 'border-l-success' :
                        'border-l-destructive'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            submission.status === 'working' ? 'bg-accent/10' :
                            submission.status === 'searching' ? 'bg-warning/10' :
                            submission.status === 'entrepreneur' ? 'bg-success/10' :
                            'bg-destructive/10'
                          }`}>
                            <StatusIcon className={`h-5 w-5 ${
                              submission.status === 'working' ? 'text-accent' :
                              submission.status === 'searching' ? 'text-warning' :
                              submission.status === 'entrepreneur' ? 'text-success' :
                              'text-destructive'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusLabels[submission.status].color}`}>
                                {statusLabels[submission.status].label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {submission.tahun}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">
                              {submission.status === 'working' && submission.workingData && (
                                <>
                                  {submission.workingData.jabatan} di {submission.workingData.namaPerusahaan}, {submission.workingData.lokasiPerusahaan}
                                </>
                              )}
                              {submission.status === 'entrepreneur' && submission.entrepreneurData && (
                                <>
                                  {submission.entrepreneurData.namaUsaha} - {submission.entrepreneurData.jenisUsaha}, {submission.entrepreneurData.lokasiUsaha}
                                </>
                              )}
                              {submission.status === 'studying' && submission.studyingData && (
                                <>
                                  {submission.studyingData.jenjang} {submission.studyingData.programStudi} di {submission.studyingData.namaKampus}
                                </>
                              )}
                              {submission.status === 'searching' && submission.searchingData && (
                                <>
                                  Mencari kerja di bidang {submission.searchingData.bidangPekerjaan}, target lokasi: {submission.searchingData.lokasiTujuan}
                                </>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Disubmit: {submission.submittedAt}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {alumniSubmissions.length === 0 && (
            <Card variant="flat" className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Belum Ada Riwayat Data
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Anda belum mengisi form status alumni. Isi sekarang untuk memperbarui data Anda.
                </p>
                <Button asChild>
                  <Link to="/form">
                    Isi Form Status
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

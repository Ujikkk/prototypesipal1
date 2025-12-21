import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAlumni } from '@/contexts/AlumniContext';
import { User, GraduationCap, Building2, Calendar, FileEdit, History, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { selectedAlumni, getAlumniDataByMasterId } = useAlumni();

  useEffect(() => {
    if (!selectedAlumni) {
      navigate('/validasi');
    }
  }, [selectedAlumni, navigate]);

  if (!selectedAlumni) return null;

  const alumniHistory = getAlumniDataByMasterId(selectedAlumni.id);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bekerja': return 'Bekerja';
      case 'mencari': return 'Mencari Kerja';
      case 'wirausaha': return 'Wirausaha';
      case 'studi': return 'Melanjutkan Studi';
      default: return status;
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Selamat Datang, {selectedAlumni.nama.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground">
                Dashboard pribadi Anda untuk mengelola data alumni.
              </p>
            </div>

            {/* Profile Card */}
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informasi Profil
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.nama}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NIM</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.nim}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jurusan</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.jurusan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Program Studi</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.prodi}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 md:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tahun Lulus</p>
                    <p className="font-semibold text-foreground">{selectedAlumni.tahunLulus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    Update Status Alumni
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Isi atau perbarui data status karir Anda.
                  </p>
                </div>
                <Button onClick={() => navigate('/form')} size="lg" className="w-full md:w-auto">
                  <FileEdit className="w-5 h-5 mr-2" />
                  Isi Form Status Alumni
                </Button>
              </div>
            </div>

            {/* History Timeline */}
            {alumniHistory.length > 0 && (
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Riwayat Status
                </h2>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {alumniHistory.map((data, index) => (
                      <div key={data.id} className="relative flex gap-4 pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>

                        <div className="flex-1 glass-card rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(data.status)}`}>
                              {getStatusLabel(data.status)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {data.tahunPengisian}
                            </span>
                          </div>

                          <div className="text-sm text-foreground">
                            {data.status === 'bekerja' && (
                              <p>Bekerja di <strong>{data.namaPerusahaan}</strong> sebagai {data.jabatan} ({data.lokasiPerusahaan})</p>
                            )}
                            {data.status === 'wirausaha' && (
                              <p>Menjalankan usaha <strong>{data.namaUsaha}</strong> di bidang {data.jenisUsaha} ({data.lokasiUsaha})</p>
                            )}
                            {data.status === 'studi' && (
                              <p>Melanjutkan studi {data.jenjang} di <strong>{data.namaKampus}</strong> - {data.programStudi}</p>
                            )}
                            {data.status === 'mencari' && (
                              <p>Mencari pekerjaan di bidang {data.bidangDiincar} (lokasi target: {data.lokasiTujuan})</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

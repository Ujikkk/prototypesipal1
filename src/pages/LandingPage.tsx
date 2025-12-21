import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';

export default function LandingPage() {
  const benefits = [
    {
      icon: Users,
      title: 'Jaringan Alumni Kuat',
      description: 'Terhubung dengan ribuan alumni Polines dari berbagai angkatan dan jurusan.',
    },
    {
      icon: BarChart3,
      title: 'Data Terstruktur',
      description: 'Dashboard visual modern untuk memantau perkembangan karir alumni.',
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description: 'Analisis otomatis berbasis AI untuk insight mendalam tentang alumni.',
    },
    {
      icon: TrendingUp,
      title: 'Tracking Karir',
      description: 'Pantau perkembangan karir dari waktu ke waktu dengan timeline visual.',
    },
  ];

  const stats = [
    { value: '15,000+', label: 'Alumni Terdaftar' },
    { value: '85%', label: 'Tingkat Kerja' },
    { value: '120+', label: 'Perusahaan Partner' },
    { value: '6', label: 'Jurusan Aktif' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Validasi Identitas',
      description: 'Masukkan nama dan tahun lulus untuk menemukan data Anda di sistem.',
    },
    {
      number: '02',
      title: 'Pilih Profil Anda',
      description: 'Pilih nama Anda dari daftar alumni yang sesuai dengan data kampus.',
    },
    {
      number: '03',
      title: 'Isi Status Terkini',
      description: 'Lengkapi informasi status kerja, usaha, atau studi lanjutan Anda.',
    },
  ];

  const faqs = [
    {
      question: 'Siapa yang bisa mengisi data di SIPAL?',
      answer: 'Hanya alumni Politeknik Negeri Semarang yang terdaftar di database master kampus yang dapat mengisi data.',
    },
    {
      question: 'Apakah data saya aman?',
      answer: 'Ya, data Anda dienkripsi dan hanya digunakan untuk keperluan internal kampus serta jaringan alumni.',
    },
    {
      question: 'Bagaimana jika nama saya tidak ditemukan?',
      answer: 'Anda dapat melaporkan ke admin melalui tombol "Laporkan ke Admin" yang tersedia di halaman validasi.',
    },
    {
      question: 'Apakah saya bisa mengupdate data setiap tahun?',
      answer: 'Tentu! Kami mendorong alumni untuk mengupdate status setiap tahun agar data tetap akurat.',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTNhNWYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Sistem Pelacakan Alumni Modern</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              <span className="text-gradient">SIPAL</span> — Sistem Informasi Pelacakan Alumni
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Platform modern untuk menghubungkan, melacak, dan menganalisis data alumni 
              Politeknik Negeri Semarang secara efisien dan akurat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/validasi">
                  Mulai Input Data
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/admin">
                  Lihat Dashboard Admin
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <a 
              href="#manfaat" 
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors animate-bounce-soft"
            >
              <span className="text-sm">Pelajari Lebih Lanjut</span>
              <ChevronDown className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="manfaat" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mengapa SIPAL?
            </h2>
            <p className="text-muted-foreground">
              Platform yang dirancang khusus untuk kebutuhan tracking alumni dengan fitur lengkap dan modern.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                variant="interactive"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-soft">
                    <benefit.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cara Kerja SIPAL
            </h2>
            <p className="text-muted-foreground">
              Hanya 3 langkah mudah untuk melengkapi data alumni Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <Card variant="elevated" className="relative bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl font-bold text-accent/20 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="hero" size="lg">
              <Link to="/validasi">
                Mulai Sekarang
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dashboard Admin yang Powerful
              </h2>
              <p className="text-muted-foreground">
                Kelola dan analisis data alumni dengan dashboard modern yang dilengkapi filter bertingkat, 
                visualisasi grafik, dan fitur AI Insights.
              </p>
              <ul className="space-y-3">
                {[
                  'Filter bertingkat: Tahun, Jurusan, Prodi',
                  'Tabel data dengan search, sort, dan export',
                  'Grafik statistik visual yang interaktif',
                  'AI Insights untuk analisis otomatis',
                  'Detail profil lengkap setiap alumni',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="default" size="lg">
                <Link to="/admin">
                  Lihat Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-2xl" />
              <Card variant="elevated" className="relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border/50 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-warning/60" />
                    <div className="h-3 w-3 rounded-full bg-success/60" />
                    <span className="ml-2 text-xs text-muted-foreground">Admin Dashboard</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-20 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-accent" />
                      </div>
                      <div className="h-20 rounded-lg bg-success/10 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-success" />
                      </div>
                      <div className="h-20 rounded-lg bg-warning/10 flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-warning" />
                      </div>
                    </div>
                    <div className="h-32 rounded-lg bg-muted/50 flex items-end p-4 gap-2">
                      {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                        <div 
                          key={i} 
                          className="flex-1 gradient-primary rounded-t-md transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-muted-foreground">
              Jawaban untuk pertanyaan yang sering diajukan tentang SIPAL.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                variant="flat"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <CardContent className="relative p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                Sudah Siap Update Data Alumni?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Bergabunglah dengan ribuan alumni Polines lainnya. 
                Proses cepat, mudah, dan aman.
              </p>
              <Button 
                asChild 
                variant="glass" 
                size="xl"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Link to="/validasi">
                  Mulai Input Data Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

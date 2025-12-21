import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, Globe } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-primary">Sistem Alumni Terintegrasi</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">SIPAL</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold mt-4 text-muted-foreground">
              Sistem Informasi Pelacakan Alumni
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Politeknik Negeri Semarang menghubungkan kampus dengan alumni. 
            Lacak karir, bangun koneksi, dan berkontribusi untuk almamater tercinta.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild variant="hero" size="xl">
              <Link to="/validasi">
                Mulai Input Data
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/admin">
                Lihat Dashboard
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">12,500+</p>
              <p className="text-sm text-muted-foreground">Alumni Terdaftar</p>
            </div>
            <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground">89%</p>
              <p className="text-sm text-muted-foreground">Tingkat Keterserapan Kerja</p>
            </div>
            <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-info" />
              </div>
              <p className="text-3xl font-bold text-foreground">150+</p>
              <p className="text-sm text-muted-foreground">Kota Persebaran</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, Globe, GraduationCap, Building2 } from 'lucide-react';
import { StatCard } from '@/components/shared';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header content */}
          <div className="text-center mb-16">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left">
                <span className="text-xs text-muted-foreground block">Politeknik Negeri Semarang</span>
                <span className="text-sm font-semibold text-primary">Program Studi Administrasi Bisnis Terapan</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="gradient-text">Survey Lulusan</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              Sistem Tracer Study Polines
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up text-balance" style={{ animationDelay: '0.2s' }}>
              Arsip digital resmi & sistem terintegrasi untuk pelacakan karir, 
              pencatatan prestasi, dan analisis data lulusan ABT Polines.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Button asChild size="xl" className="group">
                <Link to="/validasi">
                  Mulai Input Data
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/admin">
                  Lihat Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">12,500+</p>
              <p className="text-sm text-muted-foreground">Alumni Terdaftar</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-success" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">89%</p>
              <p className="text-sm text-muted-foreground">Tingkat Keterserapan Kerja</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-info/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-info" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">150+</p>
              <p className="text-sm text-muted-foreground">Kota Persebaran</p>
            </div>
          </div>

          {/* System Features Tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-12 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            {['Tracer Study', 'Rekam Jejak', 'Prestasi Non-Akademik', 'AI Insight', 'Akreditasi'].map((tag) => (
              <span 
                key={tag}
                className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

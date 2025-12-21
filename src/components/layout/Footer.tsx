import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">SIPAL</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              Sistem Informasi Pelacakan Alumni Politeknik Negeri Semarang. 
              Menghubungkan kampus dengan alumni untuk membangun jejaring yang lebih kuat.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jl. Prof. Sudarto, SH, Tembalang, Semarang</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>alumni@polines.ac.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(024) 7473417</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tautan Cepat</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Beranda
              </Link>
              <Link to="/validasi" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Input Data Alumni
              </Link>
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard Admin
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Sumber Daya</h4>
            <div className="flex flex-col gap-2">
              <a href="https://www.polines.ac.id" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Website Polines
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Panduan Penggunaan
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SIPAL - Politeknik Negeri Semarang. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Dibuat dengan ❤️ untuk Alumni Polines
          </p>
        </div>
      </div>
    </footer>
  );
}

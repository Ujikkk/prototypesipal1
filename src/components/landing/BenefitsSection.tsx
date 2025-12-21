import { Shield, Zap, BarChart3, Users2 } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Data Tervalidasi',
    description: 'Sistem validasi otomatis memastikan hanya alumni terverifikasi yang dapat mengisi data.',
  },
  {
    icon: Zap,
    title: 'Proses Cepat & Mudah',
    description: 'Pengisian data hanya membutuhkan waktu kurang dari 5 menit dengan interface yang intuitif.',
  },
  {
    icon: BarChart3,
    title: 'Analisis AI Canggih',
    description: 'Dapatkan insight mendalam tentang karir alumni dengan teknologi AI terkini.',
  },
  {
    icon: Users2,
    title: 'Jejaring Alumni',
    description: 'Bangun koneksi profesional dengan sesama alumni di berbagai bidang industri.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mengapa Menggunakan SIPAL?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistem yang dirancang khusus untuk memudahkan tracking dan analisis data alumni Polines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

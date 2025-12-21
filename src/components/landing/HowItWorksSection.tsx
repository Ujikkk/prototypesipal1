import { UserCheck, FormInput, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: UserCheck,
    number: '01',
    title: 'Validasi Identitas',
    description: 'Masukkan nama dan tahun lulus Anda, lalu pilih data diri dari daftar alumni yang cocok.',
  },
  {
    icon: FormInput,
    number: '02',
    title: 'Isi Form Status',
    description: 'Lengkapi informasi status karir Anda - bekerja, wirausaha, studi lanjut, atau mencari kerja.',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'Data Tersimpan',
    description: 'Data Anda tersimpan aman dan berkontribusi pada analisis karir alumni Polines.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cara Kerja SIPAL
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tiga langkah mudah untuk melacak dan mengupdate status alumni Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-3rem)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Briefcase, Rocket, BookOpen, Search, Users, Building2 } from 'lucide-react';

const stats = [
  {
    label: 'Alumni Bekerja',
    value: 8750,
    suffix: '+',
    icon: Briefcase,
    color: 'primary',
  },
  {
    label: 'Alumni Wirausaha',
    value: 1250,
    suffix: '+',
    icon: Rocket,
    color: 'success',
  },
  {
    label: 'Studi Lanjut',
    value: 850,
    suffix: '+',
    icon: BookOpen,
    color: 'destructive',
  },
  {
    label: 'Mitra Industri',
    value: 200,
    suffix: '+',
    icon: Building2,
    color: 'info',
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive' },
  info: { bg: 'bg-info/10', text: 'text-info' },
};

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-background relative">
      {/* Navy gradient background */}
      <div className="absolute inset-0 navy-gradient opacity-95" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            Data Alumni ABT Polines
          </h2>
          <p className="text-primary-foreground/70">
            Statistik terkini dari database alumni terintegrasi
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const colors = colorClasses[stat.color];
            return (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FAQSection } from '@/components/landing/FAQSection';

/**
 * Landing Page
 * Main entry point showcasing SIPAL system features
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <BenefitsSection />
        <HowItWorksSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

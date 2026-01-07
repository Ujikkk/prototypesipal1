/**
 * Kepuasan Pengguna Lulusan Page
 * External stakeholder evaluation system for rating graduates
 * 
 * ARCHITECTURE NOTE:
 * This is a public-access page with controlled verification.
 * External users can only submit ratings, not edit any student data.
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle,
  Building2,
  Shield,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  RatingFormProgress,
  StudentSearchSelect,
  StudentSnapshotCard,
  RatingCategoryCard,
  FeedbackForm,
  EmployerInfoForm,
  StarRating,
} from '@/components/rating';
import { RATING_CATEGORIES, INDUSTRY_SECTORS } from '@/constants/rating.constants';
import type {
  RatingFormState,
  StudentSnapshot,
  GraduateFeedback,
  EmployerInfo,
  RatingCategory,
} from '@/types/rating.types';

// Initial form state
const initialFormState: RatingFormState = {
  step: 'student_selection',
  selectedStudent: null,
  ratings: {
    technical_competence: 0,
    work_ethics: 0,
    communication: 0,
    initiative: 0,
    overall: 0,
  },
  feedback: {},
  employer: {},
};

export default function KepuasanPenggunaPage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<RatingFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Step navigation
  const steps: RatingFormState['step'][] = [
    'student_selection',
    'rating',
    'feedback',
    'employer',
    'confirmation',
  ];

  const currentStepIndex = steps.indexOf(formState.step);

  const goToStep = (step: RatingFormState['step']) => {
    setFormState((prev) => ({ ...prev, step }));
  };

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      goToStep(steps[currentStepIndex + 1]);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      goToStep(steps[currentStepIndex - 1]);
    }
  };

  // Form handlers
  const handleStudentSelect = useCallback((student: StudentSnapshot) => {
    setFormState((prev) => ({ ...prev, selectedStudent: student }));
  }, []);

  const handleRatingChange = useCallback((category: RatingCategory, score: number) => {
    setFormState((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: score },
    }));
  }, []);

  const handleFeedbackChange = useCallback((feedback: GraduateFeedback) => {
    setFormState((prev) => ({ ...prev, feedback }));
  }, []);

  const handleEmployerChange = useCallback((employer: Partial<EmployerInfo>) => {
    setFormState((prev) => ({ ...prev, employer }));
  }, []);

  // Validation
  const isStep1Valid = formState.selectedStudent !== null;
  const isStep2Valid = Object.values(formState.ratings).every((r) => r > 0);
  const isStep3Valid = true; // Feedback is optional
  const isStep4Valid =
    formState.employer.companyName?.trim() &&
    formState.employer.evaluatorPosition?.trim() &&
    formState.employer.industrySector;

  const canProceed = () => {
    switch (formState.step) {
      case 'student_selection':
        return isStep1Valid;
      case 'rating':
        return isStep2Valid;
      case 'feedback':
        return isStep3Valid;
      case 'employer':
        return isStep4Valid;
      default:
        return false;
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!isStep4Valid) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would be an API call to store the rating
    console.log('Submitted rating:', {
      studentId: formState.selectedStudent?.id,
      ratings: formState.ratings,
      feedback: formState.feedback,
      employer: formState.employer,
      submittedAt: new Date(),
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    goToStep('confirmation');

    toast({
      title: 'Evaluasi berhasil dikirim!',
      description: 'Terima kasih atas partisipasi Anda.',
    });
  };

  // Calculate average rating
  const averageRating =
    Object.values(formState.ratings).reduce((a, b) => a + b, 0) / 5;

  // Success Screen
  if (isSubmitted && formState.step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center animate-fade-up">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Evaluasi Berhasil Dikirim
          </h1>
          <p className="text-muted-foreground mb-8">
            Terima kasih telah memberikan penilaian terhadap lulusan kami.
            Evaluasi Anda sangat berharga untuk pengembangan kualitas pendidikan.
          </p>

          {/* Summary */}
          <div className="glass-card rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-4">Ringkasan Evaluasi</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lulusan</span>
                <span className="font-medium text-foreground">
                  {formState.selectedStudent?.nama}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Perusahaan</span>
                <span className="font-medium text-foreground">
                  {formState.employer.companyName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rating Rata-rata</span>
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(averageRating)} onChange={() => {}} readonly showLabel={false} size="sm" />
                  <span className="font-medium text-foreground">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button asChild size="lg">
            <Link to="/">
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-foreground block leading-tight">
                  Survey Lulusan
                </span>
                <span className="text-[10px] text-muted-foreground leading-none">
                  Polines • ABT
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-success" />
              <span className="hidden sm:inline">Formulir Evaluasi Eksternal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" />
                Evaluasi Pengguna Lulusan
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Kepuasan Pengguna Lulusan
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Berikan penilaian terhadap kinerja lulusan Politeknik Negeri Semarang
                yang bekerja di perusahaan Anda.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <RatingFormProgress currentStep={formState.step} />
            </div>

            {/* Form Content */}
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {/* Step 1: Student Selection */}
              {formState.step === 'student_selection' && (
                <div className="space-y-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Pilih Lulusan yang Akan Dievaluasi
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Cari dan pilih lulusan berdasarkan nama atau NIM.
                    </p>
                    <StudentSearchSelect
                      selectedStudent={formState.selectedStudent}
                      onSelect={handleStudentSelect}
                    />
                  </div>

                  {formState.selectedStudent && (
                    <div className="animate-fade-up">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                        Lulusan Terpilih
                      </p>
                      <StudentSnapshotCard student={formState.selectedStudent} />
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Rating */}
              {formState.step === 'rating' && (
                <div className="space-y-6">
                  {formState.selectedStudent && (
                    <StudentSnapshotCard student={formState.selectedStudent} />
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-foreground">
                        Penilaian Kinerja
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {Object.values(formState.ratings).filter((r) => r > 0).length}/5 kategori
                      </span>
                    </div>

                    {RATING_CATEGORIES.map((category, index) => (
                      <RatingCategoryCard
                        key={category.id}
                        config={category}
                        value={formState.ratings[category.id]}
                        onChange={(score) => handleRatingChange(category.id, score)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Feedback */}
              {formState.step === 'feedback' && (
                <div className="space-y-6">
                  {formState.selectedStudent && (
                    <StudentSnapshotCard student={formState.selectedStudent} />
                  )}

                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Umpan Balik Kualitatif
                    </h2>
                    <FeedbackForm
                      value={formState.feedback}
                      onChange={handleFeedbackChange}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Employer Info */}
              {formState.step === 'employer' && (
                <div className="space-y-6">
                  {formState.selectedStudent && (
                    <StudentSnapshotCard student={formState.selectedStudent} />
                  )}

                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Identitas Penilai
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Informasi ini diperlukan untuk validasi dan pelaporan institusional.
                    </p>
                    <EmployerInfoForm
                      value={formState.employer}
                      onChange={handleEmployerChange}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Confirmation */}
              {formState.step === 'confirmation' && !isSubmitted && (
                <div className="space-y-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Konfirmasi Evaluasi
                    </h2>

                    {/* Student Summary */}
                    {formState.selectedStudent && (
                      <div className="mb-6">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                          Lulusan yang Dievaluasi
                        </p>
                        <StudentSnapshotCard student={formState.selectedStudent} />
                      </div>
                    )}

                    {/* Rating Summary */}
                    <div className="mb-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                        Ringkasan Penilaian
                      </p>
                      <div className="glass-card rounded-xl p-4 space-y-3">
                        {RATING_CATEGORIES.map((category) => (
                          <div key={category.id} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{category.label}</span>
                            <StarRating
                              value={formState.ratings[category.id]}
                              onChange={() => {}}
                              readonly
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                        ))}
                        <div className="pt-3 border-t border-border flex items-center justify-between">
                          <span className="font-medium text-foreground">Rata-rata</span>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-warning text-warning" />
                            <span className="font-bold text-lg text-foreground">
                              {averageRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employer Summary */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                        Identitas Penilai
                      </p>
                      <div className="glass-card rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Perusahaan</span>
                          <span className="text-sm font-medium text-foreground">
                            {formState.employer.companyName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Jabatan</span>
                          <span className="text-sm font-medium text-foreground">
                            {formState.employer.evaluatorPosition}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Industri</span>
                          <span className="text-sm font-medium text-foreground">
                            {INDUSTRY_SECTORS[formState.employer.industrySector as keyof typeof INDUSTRY_SECTORS]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="glass-card rounded-xl p-4 bg-info/5 border-info/20">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Kebijakan Privasi
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Data yang Anda berikan akan digunakan untuk keperluan evaluasi
                          kualitas lulusan dan pelaporan akreditasi. Identitas penilai
                          akan dijaga kerahasiaannya dari lulusan yang dievaluasi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 glass-card border-t backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentStepIndex === 0}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>

            {formState.step === 'confirmation' && !isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Evaluasi
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex-1 sm:flex-none"
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

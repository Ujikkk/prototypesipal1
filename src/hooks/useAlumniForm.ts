/**
 * useAlumniForm Hook
 * Encapsulates form state and logic for the alumni status form
 * 
 * ARCHITECTURE NOTE:
 * This hook extracts form logic from the FormPage component,
 * keeping the component presentation-only.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AlumniData, AlumniStatus, EducationLevel } from '@/types';
import { useAlumni } from '@/contexts/AlumniContext';
import { toast } from '@/hooks/use-toast';
import { TOTAL_FORM_STEPS } from '@/constants';

// ============ Form State Types ============

interface EmploymentFormState {
  namaPerusahaan: string;
  lokasiPerusahaan: string;
  bidangIndustri: string;
  jabatan: string;
  tahunMulaiKerja: string;
  kontakProfesional: string;
}

interface JobSeekingFormState {
  lokasiTujuan: string;
  bidangDiincar: string;
  lamaMencari: string;
}

interface EntrepreneurFormState {
  namaUsaha: string;
  jenisUsaha: string;
  lokasiUsaha: string;
  tahunMulaiUsaha: string;
  punyaKaryawan: boolean;
  jumlahKaryawan: string;
  usahaAktif: boolean;
  sosialMediaUsaha: string[];
}

interface StudyFormState {
  namaKampus: string;
  programStudi: string;
  jenjang: EducationLevel | '';
  lokasiKampus: string;
  tahunMulaiStudi: string;
}

interface ContactFormState {
  email: string;
  noHp: string;
  mediaSosial: string;
  linkedin: string;
}

interface AdditionalFormState {
  bersediaDihubungi: boolean;
  saranKomentar: string;
}

// ============ Hook Return Type ============

interface UseAlumniFormReturn {
  // Step management
  currentStep: number;
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  
  // Status
  status: AlumniStatus | null;
  setStatus: (status: AlumniStatus | null) => void;
  
  // Form states
  employment: EmploymentFormState;
  setEmployment: React.Dispatch<React.SetStateAction<EmploymentFormState>>;
  
  jobSeeking: JobSeekingFormState;
  setJobSeeking: React.Dispatch<React.SetStateAction<JobSeekingFormState>>;
  
  entrepreneur: EntrepreneurFormState;
  setEntrepreneur: React.Dispatch<React.SetStateAction<EntrepreneurFormState>>;
  
  study: StudyFormState;
  setStudy: React.Dispatch<React.SetStateAction<StudyFormState>>;
  
  contact: ContactFormState;
  setContact: React.Dispatch<React.SetStateAction<ContactFormState>>;
  
  additional: AdditionalFormState;
  setAdditional: React.Dispatch<React.SetStateAction<AdditionalFormState>>;
  
  // Social media helpers
  addSocialMedia: () => void;
  removeSocialMedia: (index: number) => void;
  updateSocialMedia: (index: number, value: string) => void;
  
  // Submit
  handleSubmit: () => void;
  isSubmitting: boolean;
}

// ============ Initial States ============

const initialEmployment: EmploymentFormState = {
  namaPerusahaan: '',
  lokasiPerusahaan: '',
  bidangIndustri: '',
  jabatan: '',
  tahunMulaiKerja: '',
  kontakProfesional: '',
};

const initialJobSeeking: JobSeekingFormState = {
  lokasiTujuan: '',
  bidangDiincar: '',
  lamaMencari: '',
};

const initialEntrepreneur: EntrepreneurFormState = {
  namaUsaha: '',
  jenisUsaha: '',
  lokasiUsaha: '',
  tahunMulaiUsaha: '',
  punyaKaryawan: false,
  jumlahKaryawan: '',
  usahaAktif: true,
  sosialMediaUsaha: [''],
};

const initialStudy: StudyFormState = {
  namaKampus: '',
  programStudi: '',
  jenjang: '',
  lokasiKampus: '',
  tahunMulaiStudi: '',
};

const initialContact: ContactFormState = {
  email: '',
  noHp: '',
  mediaSosial: '',
  linkedin: '',
};

const initialAdditional: AdditionalFormState = {
  bersediaDihubungi: true,
  saranKomentar: '',
};

// ============ Hook Implementation ============

export function useAlumniForm(): UseAlumniFormReturn {
  const navigate = useNavigate();
  const { selectedAlumni, addAlumniData } = useAlumni();
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Status state
  const [status, setStatus] = useState<AlumniStatus | null>(null);
  
  // Form states
  const [employment, setEmployment] = useState<EmploymentFormState>(initialEmployment);
  const [jobSeeking, setJobSeeking] = useState<JobSeekingFormState>(initialJobSeeking);
  const [entrepreneur, setEntrepreneur] = useState<EntrepreneurFormState>(initialEntrepreneur);
  const [study, setStudy] = useState<StudyFormState>(initialStudy);
  const [contact, setContact] = useState<ContactFormState>(initialContact);
  const [additional, setAdditional] = useState<AdditionalFormState>(initialAdditional);

  // Step navigation
  const handleNext = useCallback(() => {
    if (currentStep === 1 && !status) {
      toast({ title: 'Pilih status Anda', variant: 'destructive' });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_FORM_STEPS));
  }, [currentStep, status]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Social media helpers
  const addSocialMedia = useCallback(() => {
    setEntrepreneur((prev) => ({
      ...prev,
      sosialMediaUsaha: [...prev.sosialMediaUsaha, ''],
    }));
  }, []);

  const removeSocialMedia = useCallback((index: number) => {
    setEntrepreneur((prev) => ({
      ...prev,
      sosialMediaUsaha: prev.sosialMediaUsaha.filter((_, i) => i !== index),
    }));
  }, []);

  const updateSocialMedia = useCallback((index: number, value: string) => {
    setEntrepreneur((prev) => {
      const updated = [...prev.sosialMediaUsaha];
      updated[index] = value;
      return { ...prev, sosialMediaUsaha: updated };
    });
  }, []);

  // Submit handler
  const handleSubmit = useCallback(() => {
    if (!selectedAlumni || !status) return;
    
    if (!contact.email || !contact.noHp) {
      toast({ title: 'Email dan No. HP wajib diisi', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    const newData: AlumniData = {
      id: `f${Date.now()}`,
      alumniMasterId: selectedAlumni.id,
      status,
      tahunPengisian: new Date().getFullYear(),
      email: contact.email,
      noHp: contact.noHp,
      mediaSosial: contact.mediaSosial || undefined,
      linkedin: contact.linkedin || undefined,
      bersediaDihubungi: additional.bersediaDihubungi,
      saranKomentar: additional.saranKomentar || undefined,
      createdAt: new Date(),
    };

    // Add status-specific data
    if (status === 'bekerja') {
      Object.assign(newData, {
        namaPerusahaan: employment.namaPerusahaan,
        lokasiPerusahaan: employment.lokasiPerusahaan,
        bidangIndustri: employment.bidangIndustri,
        jabatan: employment.jabatan,
        tahunMulaiKerja: parseInt(employment.tahunMulaiKerja),
        kontakProfesional: employment.kontakProfesional || undefined,
      });
    }

    if (status === 'mencari') {
      Object.assign(newData, {
        lokasiTujuan: jobSeeking.lokasiTujuan,
        bidangDiincar: jobSeeking.bidangDiincar,
        lamaMencari: parseInt(jobSeeking.lamaMencari),
      });
    }

    if (status === 'wirausaha') {
      Object.assign(newData, {
        namaUsaha: entrepreneur.namaUsaha,
        jenisUsaha: entrepreneur.jenisUsaha,
        lokasiUsaha: entrepreneur.lokasiUsaha,
        tahunMulaiUsaha: parseInt(entrepreneur.tahunMulaiUsaha),
        punyaKaryawan: entrepreneur.punyaKaryawan,
        jumlahKaryawan: entrepreneur.punyaKaryawan 
          ? parseInt(entrepreneur.jumlahKaryawan) 
          : undefined,
        usahaAktif: entrepreneur.usahaAktif,
        sosialMediaUsaha: entrepreneur.sosialMediaUsaha.filter((s) => s.trim()),
      });
    }

    if (status === 'studi') {
      Object.assign(newData, {
        namaKampus: study.namaKampus,
        programStudi: study.programStudi,
        jenjang: study.jenjang as EducationLevel,
        lokasiKampus: study.lokasiKampus,
        tahunMulaiStudi: parseInt(study.tahunMulaiStudi),
      });
    }

    addAlumniData(newData);
    
    toast({
      title: 'Data berhasil disimpan!',
      description: 'Terima kasih telah mengisi form status alumni.',
    });
    
    setIsSubmitting(false);
    navigate('/dashboard');
  }, [
    selectedAlumni, 
    status, 
    contact, 
    additional, 
    employment, 
    jobSeeking, 
    entrepreneur, 
    study, 
    addAlumniData, 
    navigate
  ]);

  return {
    currentStep,
    totalSteps: TOTAL_FORM_STEPS,
    handleNext,
    handleBack,
    status,
    setStatus,
    employment,
    setEmployment,
    jobSeeking,
    setJobSeeking,
    entrepreneur,
    setEntrepreneur,
    study,
    setStudy,
    contact,
    setContact,
    additional,
    setAdditional,
    addSocialMedia,
    removeSocialMedia,
    updateSocialMedia,
    handleSubmit,
    isSubmitting,
  };
}

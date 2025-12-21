import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlumniMaster, AlumniData, alumniMasterData, alumniFilledData } from '@/lib/data';

interface AlumniContextType {
  selectedAlumni: AlumniMaster | null;
  setSelectedAlumni: (alumni: AlumniMaster | null) => void;
  alumniData: AlumniData[];
  addAlumniData: (data: AlumniData) => void;
  getAlumniDataByMasterId: (masterId: string) => AlumniData[];
  masterData: AlumniMaster[];
  searchAlumni: (nama: string, tahunLulus: number) => AlumniMaster[];
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AlumniContext = createContext<AlumniContextType | undefined>(undefined);

export function AlumniProvider({ children }: { children: React.ReactNode }) {
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniMaster | null>(null);
  const [alumniData, setAlumniData] = useState<AlumniData[]>(alumniFilledData);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sipal-dark-mode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('sipal-dark-mode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const addAlumniData = (data: AlumniData) => {
    setAlumniData(prev => [...prev, data]);
  };

  const getAlumniDataByMasterId = (masterId: string) => {
    return alumniData.filter(d => d.alumniMasterId === masterId);
  };

  const searchAlumni = (nama: string, tahunLulus: number) => {
    const namaLower = nama.toLowerCase().trim();
    return alumniMasterData.filter(
      alumni => 
        alumni.nama.toLowerCase().includes(namaLower) &&
        alumni.tahunLulus === tahunLulus
    );
  };

  return (
    <AlumniContext.Provider
      value={{
        selectedAlumni,
        setSelectedAlumni,
        alumniData,
        addAlumniData,
        getAlumniDataByMasterId,
        masterData: alumniMasterData,
        searchAlumni,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AlumniContext.Provider>
  );
}

export function useAlumni() {
  const context = useContext(AlumniContext);
  if (!context) {
    throw new Error('useAlumni must be used within AlumniProvider');
  }
  return context;
}

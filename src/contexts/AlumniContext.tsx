/**
 * Alumni Context (Refactored)
 * State management for alumni data
 * 
 * ARCHITECTURE NOTE:
 * This context now delegates to the service layer for business logic.
 * UI components should use this context for state, not for data manipulation.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AlumniMaster, AlumniData, AlumniDataInput } from '@/types';
import * as alumniService from '@/services/alumni.service';
import { alumniMasterData, alumniFilledData } from '@/data/seed-data';

// ============ Context Types ============

interface AlumniContextState {
  // Selected alumni (validation flow)
  selectedAlumni: AlumniMaster | null;
  
  // Data stores
  alumniData: AlumniData[];
  masterData: AlumniMaster[];
  
  // Theme
  darkMode: boolean;
  
  // Loading states
  isLoading: boolean;
}

interface AlumniContextActions {
  // Alumni selection
  setSelectedAlumni: (alumni: AlumniMaster | null) => void;
  
  // Data operations
  addAlumniData: (data: AlumniData) => void;
  getAlumniDataByMasterId: (masterId: string) => AlumniData[];
  searchAlumni: (nama: string, tahunLulus: number) => AlumniMaster[];
  
  // Theme
  toggleDarkMode: () => void;
}

type AlumniContextType = AlumniContextState & AlumniContextActions;

// ============ Context Creation ============

const AlumniContext = createContext<AlumniContextType | undefined>(undefined);

// ============ Provider Component ============

interface AlumniProviderProps {
  children: React.ReactNode;
}

export function AlumniProvider({ children }: AlumniProviderProps) {
  // State
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniMaster | null>(null);
  const [alumniData, setAlumniData] = useState<AlumniData[]>(alumniFilledData);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sipal-dark-mode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Theme toggle
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('sipal-dark-mode', String(next));
      
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return next;
    });
  }, []);

  // Add alumni data
  const addAlumniData = useCallback((data: AlumniData) => {
    setAlumniData((prev) => [...prev, data]);
  }, []);

  // Get alumni data by master ID
  const getAlumniDataByMasterId = useCallback(
    (masterId: string): AlumniData[] => {
      return alumniData.filter((d) => d.alumniMasterId === masterId);
    },
    [alumniData]
  );

  // Search alumni (delegates to service layer logic)
  const searchAlumni = useCallback(
    (nama: string, tahunLulus: number): AlumniMaster[] => {
      const namaLower = nama.toLowerCase().trim();
      return alumniMasterData.filter(
        (alumni) =>
          alumni.nama.toLowerCase().includes(namaLower) &&
          alumni.tahunLulus === tahunLulus
      );
    },
    []
  );

  // Context value
  const contextValue: AlumniContextType = {
    // State
    selectedAlumni,
    alumniData,
    masterData: alumniMasterData,
    darkMode,
    isLoading,
    
    // Actions
    setSelectedAlumni,
    addAlumniData,
    getAlumniDataByMasterId,
    searchAlumni,
    toggleDarkMode,
  };

  return (
    <AlumniContext.Provider value={contextValue}>
      {children}
    </AlumniContext.Provider>
  );
}

// ============ Custom Hook ============

export function useAlumni(): AlumniContextType {
  const context = useContext(AlumniContext);
  
  if (context === undefined) {
    throw new Error('useAlumni must be used within AlumniProvider');
  }
  
  return context;
}

// ============ Selector Hooks (for performance optimization) ============

/**
 * Hook for selected alumni only
 */
export function useSelectedAlumni() {
  const { selectedAlumni, setSelectedAlumni } = useAlumni();
  return { selectedAlumni, setSelectedAlumni };
}

/**
 * Hook for theme only
 */
export function useTheme() {
  const { darkMode, toggleDarkMode } = useAlumni();
  return { darkMode, toggleDarkMode };
}

/**
 * Hook for alumni data operations
 */
export function useAlumniData() {
  const { alumniData, addAlumniData, getAlumniDataByMasterId } = useAlumni();
  return { alumniData, addAlumniData, getAlumniDataByMasterId };
}

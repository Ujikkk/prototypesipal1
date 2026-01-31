/**
 * Alumni Context (Refactored)
 * State management for alumni data with NIM + password authentication
 * Supports both admin and student roles
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AlumniMaster, AlumniData } from '@/types';
import type { StudentProfile, StudentAccountInput, AdminProfile } from '@/types/student.types';
import { alumniMasterData, alumniFilledData } from '@/data/seed-data';
import { studentProfiles as initialStudentProfiles } from '@/data/student-seed-data';
import { adminAccounts as initialAdminAccounts } from '@/data/admin-seed-data';
import { authenticateStudent, authenticateAdmin, hashPassword, type AuthResult } from '@/services/auth.service';

// ============ Context Types ============

interface AlumniContextState {
  // Selected alumni (validation flow - legacy)
  selectedAlumni: AlumniMaster | null;
  
  // Logged in student (new NIM + password flow)
  loggedInStudent: StudentProfile | null;
  
  // Logged in admin
  loggedInAdmin: AdminProfile | null;
  
  // Student accounts (for admin management)
  studentAccounts: StudentProfile[];
  
  // Admin accounts
  adminAccounts: AdminProfile[];
  
  // Data stores
  alumniData: AlumniData[];
  masterData: AlumniMaster[];
  
  // Theme
  darkMode: boolean;
  
  // Loading states
  isLoading: boolean;
}

interface AlumniContextActions {
  // Alumni selection (legacy)
  setSelectedAlumni: (alumni: AlumniMaster | null) => void;
  
  // Student authentication
  loginWithCredentials: (nim: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  
  // Admin authentication
  loginAsAdmin: (username: string, password: string) => Promise<AuthResult>;
  logoutAdmin: () => void;
  
  // Student account management (admin)
  addStudentAccount: (data: StudentAccountInput) => Promise<{ success: boolean; error?: string }>;
  deleteStudentAccount: (studentId: string) => Promise<{ success: boolean; error?: string }>;
  updateStudentAccount: (studentId: string, updates: Partial<StudentProfile>) => Promise<{ success: boolean; error?: string }>;
  resetStudentPassword: (studentId: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  
  // Data operations
  addAlumniData: (data: AlumniData) => void;
  updateAlumniData: (id: string, data: Partial<AlumniData>) => void;
  deleteAlumniData: (id: string) => void;
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
  const [loggedInStudent, setLoggedInStudent] = useState<StudentProfile | null>(null);
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminProfile | null>(null);
  const [studentAccounts, setStudentAccounts] = useState<StudentProfile[]>(initialStudentProfiles);
  const [adminAccountsState] = useState<AdminProfile[]>(initialAdminAccounts);
  const [alumniData, setAlumniData] = useState<AlumniData[]>(alumniFilledData);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize dark mode and session from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('sipal-dark-mode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Restore student session if exists
    const savedStudentSession = localStorage.getItem('sipal-student-session');
    if (savedStudentSession) {
      try {
        const student = JSON.parse(savedStudentSession) as StudentProfile;
        setLoggedInStudent(student);
      } catch (e) {
        localStorage.removeItem('sipal-student-session');
      }
    }
    
    // Restore admin session if exists
    const savedAdminSession = localStorage.getItem('sipal-admin-session');
    if (savedAdminSession) {
      try {
        const admin = JSON.parse(savedAdminSession) as AdminProfile;
        setLoggedInAdmin(admin);
      } catch (e) {
        localStorage.removeItem('sipal-admin-session');
      }
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

  // ============ Student Authentication Functions ============

  /**
   * Login with NIM and password (student)
   */
  const loginWithCredentials = useCallback(
    async (nim: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      
      try {
        // Simulate network delay for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = authenticateStudent(nim, password, studentAccounts);
        
        if (result.success && result.student) {
          // Update student's lastLogin
          const updatedStudent = { ...result.student, lastLogin: new Date() };
          setLoggedInStudent(updatedStudent);
          
          // Save session to localStorage
          localStorage.setItem('sipal-student-session', JSON.stringify(updatedStudent));
          
          // Also set as selectedAlumni for compatibility with existing dashboard
          const masterMatch = alumniMasterData.find(m => m.nim === nim);
          if (masterMatch) {
            setSelectedAlumni(masterMatch);
          }
        }
        
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [studentAccounts]
  );

  /**
   * Logout current student
   */
  const logout = useCallback(() => {
    setLoggedInStudent(null);
    setSelectedAlumni(null);
    localStorage.removeItem('sipal-student-session');
  }, []);

  // ============ Admin Authentication Functions ============

  /**
   * Login as admin
   */
  const loginAsAdmin = useCallback(
    async (username: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      
      try {
        // Simulate network delay for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = authenticateAdmin(username, password, adminAccountsState);
        
        if (result.success && result.admin) {
          // Update admin's lastLogin
          const updatedAdmin = { ...result.admin, lastLogin: new Date() };
          setLoggedInAdmin(updatedAdmin);
          
          // Save session to localStorage
          localStorage.setItem('sipal-admin-session', JSON.stringify(updatedAdmin));
        }
        
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [adminAccountsState]
  );

  /**
   * Logout admin
   */
  const logoutAdmin = useCallback(() => {
    setLoggedInAdmin(null);
    localStorage.removeItem('sipal-admin-session');
  }, []);

  // ============ Admin Functions ============

  /**
   * Add new student account (admin only)
   */
  const addStudentAccount = useCallback(
    async (data: StudentAccountInput): Promise<{ success: boolean; error?: string }> => {
      // Check if NIM already exists
      if (studentAccounts.some(s => s.nim === data.nim)) {
        return { success: false, error: 'NIM sudah terdaftar' };
      }
      
      // Create new student profile
      const newStudent: StudentProfile = {
        id: `s${Date.now()}`,
        nama: data.nama,
        nim: data.nim,
        jurusan: 'Administrasi Bisnis',
        prodi: 'Administrasi Bisnis Terapan',
        status: data.status,
        tahunMasuk: data.tahunMasuk,
        tahunLulus: data.tahunLulus,
        email: data.email,
        noHp: data.noHp,
        passwordHash: hashPassword(data.password),
        hasCredentials: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setStudentAccounts(prev => [...prev, newStudent]);
      
      return { success: true };
    },
    [studentAccounts]
  );

  /**
   * Delete student account (admin only)
   */
  const deleteStudentAccount = useCallback(
    async (studentId: string): Promise<{ success: boolean; error?: string }> => {
      const student = studentAccounts.find(s => s.id === studentId);
      
      if (!student) {
        return { success: false, error: 'Mahasiswa tidak ditemukan' };
      }
      
      // Remove student
      setStudentAccounts(prev => prev.filter(s => s.id !== studentId));
      
      // If deleted student is currently logged in, log them out
      if (loggedInStudent?.id === studentId) {
        logout();
      }
      
      return { success: true };
    },
    [studentAccounts, loggedInStudent, logout]
  );

  /**
   * Update student account (admin only)
   */
  const updateStudentAccount = useCallback(
    async (studentId: string, updates: Partial<StudentProfile>): Promise<{ success: boolean; error?: string }> => {
      const student = studentAccounts.find(s => s.id === studentId);
      
      if (!student) {
        return { success: false, error: 'Mahasiswa tidak ditemukan' };
      }
      
      // Check NIM uniqueness if NIM is being updated
      if (updates.nim && updates.nim !== student.nim) {
        if (studentAccounts.some(s => s.nim === updates.nim)) {
          return { success: false, error: 'NIM sudah digunakan' };
        }
      }
      
      // Update student
      setStudentAccounts(prev => prev.map(s => 
        s.id === studentId 
          ? { ...s, ...updates, updatedAt: new Date() }
          : s
      ));
      
      // If updated student is currently logged in, update session
      if (loggedInStudent?.id === studentId) {
        const updatedStudent = { ...loggedInStudent, ...updates, updatedAt: new Date() };
        setLoggedInStudent(updatedStudent);
        localStorage.setItem('sipal-student-session', JSON.stringify(updatedStudent));
      }
      
      return { success: true };
    },
    [studentAccounts, loggedInStudent]
  );

  /**
   * Reset student password (admin only)
   */
  const resetStudentPassword = useCallback(
    async (studentId: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      const student = studentAccounts.find(s => s.id === studentId);
      
      if (!student) {
        return { success: false, error: 'Mahasiswa tidak ditemukan' };
      }
      
      if (newPassword.length < 6) {
        return { success: false, error: 'Password minimal 6 karakter' };
      }
      
      // Update password
      const newPasswordHash = hashPassword(newPassword);
      setStudentAccounts(prev => prev.map(s => 
        s.id === studentId 
          ? { ...s, passwordHash: newPasswordHash, updatedAt: new Date() }
          : s
      ));
      
      return { success: true };
    },
    [studentAccounts]
  );

  // ============ Legacy Functions ============

  // Add alumni data
  const addAlumniData = useCallback((data: AlumniData) => {
    setAlumniData((prev) => [...prev, data]);
  }, []);

  // Update alumni data
  const updateAlumniData = useCallback((id: string, updates: Partial<AlumniData>) => {
    setAlumniData((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  // Delete alumni data
  const deleteAlumniData = useCallback((id: string) => {
    setAlumniData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Get alumni data by master ID
  const getAlumniDataByMasterId = useCallback(
    (masterId: string): AlumniData[] => {
      return alumniData.filter((d) => d.alumniMasterId === masterId);
    },
    [alumniData]
  );

  // Search alumni
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
    loggedInStudent,
    loggedInAdmin,
    studentAccounts,
    adminAccounts: adminAccountsState,
    alumniData,
    masterData: alumniMasterData,
    darkMode,
    isLoading,
    
    // Actions
    setSelectedAlumni,
    loginWithCredentials,
    logout,
    loginAsAdmin,
    logoutAdmin,
    addStudentAccount,
    deleteStudentAccount,
    updateStudentAccount,
    resetStudentPassword,
    addAlumniData,
    updateAlumniData,
    deleteAlumniData,
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
 * Hook for logged in student
 */
export function useLoggedInStudent() {
  const { loggedInStudent, logout } = useAlumni();
  return { loggedInStudent, logout };
}

/**
 * Hook for logged in admin
 */
export function useLoggedInAdmin() {
  const { loggedInAdmin, logoutAdmin } = useAlumni();
  return { loggedInAdmin, logoutAdmin };
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

/**
 * Hook for student account management (admin)
 */
export function useStudentAccounts() {
  const { studentAccounts, addStudentAccount, deleteStudentAccount } = useAlumni();
  return { studentAccounts, addStudentAccount, deleteStudentAccount };
}

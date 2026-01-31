/**
 * Authentication Service
 * Handles password hashing and verification for student login
 * 
 * IMPORTANT: This is a DEMO implementation only!
 * In production, use Supabase Auth with bcrypt hashing server-side.
 */

import { studentProfiles } from '@/data/student-seed-data';
import type { StudentProfile } from '@/types/student.types';

/**
 * Simple hash function for demo purposes
 * DO NOT use in production - use bcrypt on server
 */
export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `demo_hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Verify password against stored hash
 */
export function verifyPassword(inputPassword: string, storedHash: string): boolean {
  const inputHash = hashPassword(inputPassword);
  return inputHash === storedHash;
}

/**
 * Authentication result type
 */
export interface AuthResult {
  success: boolean;
  student?: StudentProfile;
  error?: string;
}

/**
 * Authenticate student with NIM and password
 */
export function authenticateStudent(
  nim: string, 
  password: string,
  students: StudentProfile[]
): AuthResult {
  // Find student by NIM
  const student = students.find(s => s.nim === nim);
  
  if (!student) {
    return {
      success: false,
      error: 'NIM tidak ditemukan dalam sistem'
    };
  }
  
  // Check if student has credentials
  if (!student.hasCredentials || !student.passwordHash) {
    return {
      success: false,
      error: 'Akun belum diaktifkan. Hubungi admin untuk membuat akun.'
    };
  }
  
  // Verify password
  if (!verifyPassword(password, student.passwordHash)) {
    return {
      success: false,
      error: 'Password salah. Silakan coba lagi.'
    };
  }
  
  // Success
  return {
    success: true,
    student: {
      ...student,
      lastLogin: new Date()
    }
  };
}

/**
 * Check if NIM already exists
 */
export function isNimExists(nim: string, students: StudentProfile[]): boolean {
  return students.some(s => s.nim === nim);
}

/**
 * Generate default password hash for demo
 */
export function getDefaultPasswordHash(): string {
  return hashPassword('password123');
}

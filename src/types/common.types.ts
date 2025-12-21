/**
 * Common Types
 * Shared type definitions used across the application
 */

// ============ API Response Types ============

/**
 * Standard API response wrapper
 * Ready for Next.js API routes
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ Navigation Types ============

export interface NavItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

// ============ Theme Types ============

export type ThemeMode = 'light' | 'dark';

// ============ Select Option Types ============

export interface SelectOption {
  value: string;
  label: string;
}

// ============ Form State Types ============

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
}

// ============ Export Types ============

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export interface ExportConfig {
  format: ExportFormat;
  filename: string;
  columns: string[];
}

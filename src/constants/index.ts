/**
 * Constants Index
 * Central export point for all constants
 */

// Legacy constants (backward compatibility)
export * from './alumni.constants';

// New student-centric constants - explicit exports to avoid conflicts
export {
  ABT_PROGRAM,
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_COLORS,
  STUDENT_STATUS_CSS,
  CAREER_STATUS_LABELS,
  CAREER_STATUS_COLORS,
  CAREER_STATUS_CSS,
  ACHIEVEMENT_CATEGORY_LABELS,
  ACHIEVEMENT_CATEGORY_ICONS,
  ACHIEVEMENT_SUBCATEGORY_LABELS,
  SUBCATEGORIES_BY_CATEGORY,
  TINGKAT_OPTIONS,
  RELEVANSI_OPTIONS,
  generateYearList,
  TAHUN_MASUK_LIST,
  PROFILE_FORM_STEPS,
  TRACER_FORM_STEPS,
  ACHIEVEMENT_FORM_STEPS,
  STUDENT_EXPORT_HEADERS,
  TRACER_EXPORT_HEADERS,
  getCareerChartData,
  getStudentStatusChartData,
} from './student.constants';

// Re-export with prefixes for conflicting constants
export {
  BIDANG_INDUSTRI_LIST as STUDENT_BIDANG_INDUSTRI_LIST,
  JENJANG_OPTIONS as STUDENT_JENJANG_OPTIONS,
  TAHUN_LULUS_LIST as STUDENT_TAHUN_LULUS_LIST,
  VALIDATION_PATTERNS as STUDENT_VALIDATION_PATTERNS,
} from './student.constants';

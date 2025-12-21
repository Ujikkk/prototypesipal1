/**
 * Services Index
 * Central export point for all service modules
 */

// Legacy services (backward compatibility)
export * from './alumni.service';
export * from './insight.service';

// New student-centric services - explicit exports to avoid conflicts
export {
  getAllStudents,
  getStudentById,
  getStudentByNim,
  validateStudent,
  getFilteredStudents,
  getAlumni,
  saveStudentProfile,
  isEligibleForTracerStudy,
  getTracerStudy,
  submitTracerStudy,
  updateTracerStudy,
  getStudentAchievements,
  getFilteredAchievements,
  submitAchievement,
  verifyAchievement,
  getStudentComplete,
  getStudentSummaries,
  calculateStudentStatistics,
  calculateTracerStatistics,
  calculateAchievementStatistics,
  getCareerChartData,
  getAchievementCategoryData,
  generateStudentCSV,
  generateTracerCSV,
} from './student.service';

// Re-export with prefixes for conflicting functions
export {
  getIndustryDistribution as getStudentIndustryDistribution,
  getYearTrendData as getStudentYearTrendData,
} from './student.service';

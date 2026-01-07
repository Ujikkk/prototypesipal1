/**
 * Graduate Satisfaction Rating Types
 * External stakeholder evaluation system
 * 
 * ARCHITECTURE NOTE:
 * In production with Prisma, these would be Prisma models.
 * Designed for easy migration to database schema.
 */

// ============ Rating Categories ============

export type RatingCategory =
  | 'technical_competence'
  | 'work_ethics'
  | 'communication'
  | 'initiative'
  | 'overall';

export interface RatingCategoryConfig {
  id: RatingCategory;
  label: string;
  description: string;
  questions: string[];
}

// ============ Industry Sectors ============

export type IndustrySector =
  | 'banking_finance'
  | 'manufacturing'
  | 'retail_commerce'
  | 'technology'
  | 'healthcare'
  | 'education'
  | 'government'
  | 'hospitality'
  | 'logistics'
  | 'consulting'
  | 'media'
  | 'other';

// ============ Rating Data Structures ============

export interface CategoryRating {
  category: RatingCategory;
  score: number; // 1-5
}

export interface EmployerInfo {
  companyName: string;
  evaluatorPosition: string;
  industrySector: IndustrySector;
  companyEmail?: string;
  contactNumber?: string;
}

export interface GraduateFeedback {
  strengths?: string;
  improvements?: string;
  generalComments?: string;
}

export interface GraduateRatingSubmission {
  id: string;
  studentId: string;
  ratings: CategoryRating[];
  feedback: GraduateFeedback;
  employer: EmployerInfo;
  submittedAt: Date;
  evaluationPeriod: string; // e.g., "2024-Q1"
}

// ============ Student Snapshot (Read-Only) ============

export interface StudentSnapshot {
  id: string;
  nama: string;
  nim: string;
  prodi: string;
  tahunLulus?: number;
  careerStatus?: string;
}

// ============ Form State ============

export interface RatingFormState {
  step: 'student_selection' | 'rating' | 'feedback' | 'employer' | 'confirmation';
  selectedStudent: StudentSnapshot | null;
  ratings: Record<RatingCategory, number>;
  feedback: GraduateFeedback;
  employer: Partial<EmployerInfo>;
}

// ============ Aggregated Stats (Admin View) ============

export interface StudentRatingStats {
  studentId: string;
  totalEvaluations: number;
  averageOverall: number;
  categoryAverages: Record<RatingCategory, number>;
  latestEvaluation?: Date;
}

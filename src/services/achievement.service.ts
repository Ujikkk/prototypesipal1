// Achievement Service - Business Logic Layer

import { 
  Achievement, 
  AchievementCategory,
  KegiatanAchievement,
  PublikasiAchievement,
  HakiAchievement,
  MagangAchievement,
  PortofolioAchievement,
  WirausahaAchievement,
  PengembanganAchievement
} from '@/types/achievement.types';

// In-memory storage (will be replaced with database later)
let achievements: Achievement[] = [];

// Generate unique ID
const generateId = (): string => {
  return `ach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all achievements for a student
export const getAchievementsByMasterId = (masterId: string): Achievement[] => {
  return achievements.filter(a => a.masterId === masterId);
};

// Get achievements by category
export const getAchievementsByCategory = (masterId: string, category: AchievementCategory): Achievement[] => {
  return achievements.filter(a => a.masterId === masterId && a.category === category);
};

// Get achievement by ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id);
};

// Create new achievement
export const createAchievement = <T extends Achievement>(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T => {
  const now = new Date().toISOString();
  const achievement = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  } as T;
  
  achievements.push(achievement);
  return achievement;
};

// Update achievement
export const updateAchievement = <T extends Achievement>(id: string, data: Partial<T>): T | undefined => {
  const index = achievements.findIndex(a => a.id === id);
  if (index === -1) return undefined;
  
  achievements[index] = {
    ...achievements[index],
    ...data,
    updatedAt: new Date().toISOString(),
  } as T;
  
  return achievements[index] as T;
};

// Delete achievement
export const deleteAchievement = (id: string): boolean => {
  const index = achievements.findIndex(a => a.id === id);
  if (index === -1) return false;
  
  achievements.splice(index, 1);
  return true;
};

// Get achievement statistics for a student
export const getAchievementStats = (masterId: string): Record<AchievementCategory, number> => {
  const studentAchievements = getAchievementsByMasterId(masterId);
  
  return {
    kegiatan: studentAchievements.filter(a => a.category === 'kegiatan').length,
    publikasi: studentAchievements.filter(a => a.category === 'publikasi').length,
    haki: studentAchievements.filter(a => a.category === 'haki').length,
    magang: studentAchievements.filter(a => a.category === 'magang').length,
    portofolio: studentAchievements.filter(a => a.category === 'portofolio').length,
    wirausaha: studentAchievements.filter(a => a.category === 'wirausaha').length,
    pengembangan: studentAchievements.filter(a => a.category === 'pengembangan').length,
  };
};

// Get total achievement count
export const getTotalAchievements = (masterId: string): number => {
  return getAchievementsByMasterId(masterId).length;
};

// Export for testing/seeding
export const seedAchievements = (data: Achievement[]): void => {
  achievements = [...achievements, ...data];
};

export const clearAchievements = (): void => {
  achievements = [];
};

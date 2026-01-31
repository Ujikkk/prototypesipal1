/**
 * Admin Student Edit Modal
 * Comprehensive modal for editing student data including:
 * - Profile information
 * - Career history
 * - Achievements
 */

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, Briefcase, Trophy, Eye, EyeOff, Save, Trash2, Plus, 
  AlertCircle, CheckCircle2, Pencil, X, Building2, MapPin, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudentProfile, StudentStatus } from '@/types/student.types';
import type { Achievement } from '@/types/achievement.types';
import { ACHIEVEMENT_CATEGORIES } from '@/types/achievement.types';
import {
  getStudentCareerHistory,
  addCareerHistory,
  updateCareerHistory,
  deleteCareerHistory,
  type CareerHistoryEntry,
  type CareerHistoryInput,
} from '@/services/student.service';
import { getAchievementsByStudentId, deleteAchievement } from '@/services/achievement.service';

interface AdminStudentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfile | null;
  existingNims: string[];
  onUpdateProfile: (studentId: string, updates: Partial<StudentProfile>) => Promise<{ success: boolean; error?: string }>;
  onResetPassword: (studentId: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

const statusOptions: { value: StudentStatus; label: string }[] = [
  { value: 'active', label: 'Mahasiswa Aktif' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'on_leave', label: 'Cuti' },
  { value: 'dropout', label: 'Dropout' },
];

export function AdminStudentEditModal({
  open,
  onOpenChange,
  student,
  existingNims,
  onUpdateProfile,
  onResetPassword,
}: AdminStudentEditModalProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    nama: '',
    nim: '',
    email: '',
    noHp: '',
    status: 'active' as StudentStatus,
    tahunMasuk: currentYear,
    tahunLulus: undefined as number | undefined,
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Career history state
  const [careerHistory, setCareerHistory] = useState<CareerHistoryEntry[]>([]);
  const [editingCareer, setEditingCareer] = useState<string | null>(null);
  const [careerForm, setCareerForm] = useState<CareerHistoryInput>({
    title: '',
    subtitle: '',
    location: '',
    industry: '',
    year: currentYear,
    isActive: true,
  });
  const [showAddCareer, setShowAddCareer] = useState(false);

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Load data when student changes
  useEffect(() => {
    if (student) {
      setProfileForm({
        nama: student.nama,
        nim: student.nim,
        email: student.email || '',
        noHp: student.noHp || '',
        status: student.status,
        tahunMasuk: student.tahunMasuk,
        tahunLulus: student.tahunLulus,
      });
      setCareerHistory(getStudentCareerHistory(student.id));
      setAchievements(getAchievementsByStudentId(student.id));
      setProfileErrors({});
      setSaveResult(null);
      setShowPasswordReset(false);
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [student]);

  // Validate profile
  const validateProfile = (): boolean => {
    const errors: Record<string, string> = {};

    if (!profileForm.nama.trim() || profileForm.nama.length < 3) {
      errors.nama = 'Nama minimal 3 karakter';
    }

    if (!/^\d{8}$/.test(profileForm.nim)) {
      errors.nim = 'NIM harus 8 digit angka';
    } else if (profileForm.nim !== student?.nim && existingNims.includes(profileForm.nim)) {
      errors.nim = 'NIM sudah digunakan';
    }

    if (profileForm.status === 'alumni' && !profileForm.tahunLulus) {
      errors.tahunLulus = 'Tahun lulus wajib diisi untuk alumni';
    }

    if (profileForm.tahunLulus && profileForm.tahunLulus < profileForm.tahunMasuk) {
      errors.tahunLulus = 'Tahun lulus tidak boleh sebelum tahun masuk';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!student || !validateProfile()) return;

    setIsSaving(true);
    setSaveResult(null);

    try {
      const result = await onUpdateProfile(student.id, {
        nama: profileForm.nama,
        nim: profileForm.nim,
        email: profileForm.email || undefined,
        noHp: profileForm.noHp || undefined,
        status: profileForm.status,
        tahunMasuk: profileForm.tahunMasuk,
        tahunLulus: profileForm.tahunLulus,
      });

      if (result.success) {
        setSaveResult({ success: true, message: 'Profil berhasil diperbarui!' });
      } else {
        setSaveResult({ success: false, message: result.error || 'Gagal memperbarui profil' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!student) return;

    if (newPassword.length < 6) {
      setSaveResult({ success: false, message: 'Password minimal 6 karakter' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSaveResult({ success: false, message: 'Konfirmasi password tidak cocok' });
      return;
    }

    setIsSaving(true);
    setSaveResult(null);

    try {
      const result = await onResetPassword(student.id, newPassword);

      if (result.success) {
        setSaveResult({ success: true, message: 'Password berhasil direset!' });
        setShowPasswordReset(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSaveResult({ success: false, message: result.error || 'Gagal mereset password' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Career history handlers
  const handleAddCareer = () => {
    if (!student) return;
    
    const entry = addCareerHistory(student.id, careerForm);
    setCareerHistory([entry, ...careerHistory]);
    setCareerForm({
      title: '',
      subtitle: '',
      location: '',
      industry: '',
      year: currentYear,
      isActive: true,
    });
    setShowAddCareer(false);
  };

  const handleUpdateCareer = (id: string) => {
    const updated = updateCareerHistory(id, careerForm);
    if (updated) {
      setCareerHistory(careerHistory.map(ch => ch.id === id ? updated : ch));
    }
    setEditingCareer(null);
  };

  const handleDeleteCareer = (id: string) => {
    if (deleteCareerHistory(id)) {
      setCareerHistory(careerHistory.filter(ch => ch.id !== id));
    }
  };

  // Achievement handlers
  const handleDeleteAchievement = (id: string) => {
    if (deleteAchievement(id)) {
      setAchievements(achievements.filter(a => a.id !== id));
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>Edit Data Mahasiswa</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                {student.nama} • {student.nim}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="career" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Karir ({careerHistory.length})
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="w-4 h-4" />
              Prestasi ({achievements.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Nama */}
                <div className="space-y-2">
                  <Label>Nama Lengkap *</Label>
                  <Input
                    value={profileForm.nama}
                    onChange={(e) => setProfileForm({ ...profileForm, nama: e.target.value })}
                    className={profileErrors.nama ? 'border-destructive' : ''}
                  />
                  {profileErrors.nama && <p className="text-xs text-destructive">{profileErrors.nama}</p>}
                </div>

                {/* NIM */}
                <div className="space-y-2">
                  <Label>NIM *</Label>
                  <Input
                    value={profileForm.nim}
                    onChange={(e) => setProfileForm({ ...profileForm, nim: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                    className={profileErrors.nim ? 'border-destructive' : ''}
                  />
                  {profileErrors.nim && <p className="text-xs text-destructive">{profileErrors.nim}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>

                {/* No HP */}
                <div className="space-y-2">
                  <Label>No. HP</Label>
                  <Input
                    value={profileForm.noHp}
                    onChange={(e) => setProfileForm({ ...profileForm, noHp: e.target.value.replace(/\D/g, '').slice(0, 13) })}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={profileForm.status}
                    onValueChange={(v) => setProfileForm({ ...profileForm, status: v as StudentStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tahun Masuk */}
                <div className="space-y-2">
                  <Label>Tahun Masuk *</Label>
                  <Select
                    value={profileForm.tahunMasuk.toString()}
                    onValueChange={(v) => setProfileForm({ ...profileForm, tahunMasuk: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tahun Lulus */}
                <div className="space-y-2 col-span-2">
                  <Label>Tahun Lulus {profileForm.status === 'alumni' && '*'}</Label>
                  <Select
                    value={profileForm.tahunLulus?.toString() || ''}
                    onValueChange={(v) => setProfileForm({ ...profileForm, tahunLulus: v ? parseInt(v) : undefined })}
                  >
                    <SelectTrigger className={profileErrors.tahunLulus ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profileErrors.tahunLulus && <p className="text-xs text-destructive">{profileErrors.tahunLulus}</p>}
                </div>
              </div>

              {/* Password Reset */}
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Reset Password</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                  >
                    {showPasswordReset ? 'Batal' : 'Reset Password'}
                  </Button>
                </div>

                {showPasswordReset && (
                  <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label>Password Baru *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Konfirmasi Password *</Label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password"
                      />
                    </div>
                    <Button onClick={handleResetPassword} disabled={isSaving} size="sm">
                      {isSaving ? 'Menyimpan...' : 'Reset Password'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Save Profile Button */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveProfile} disabled={isSaving} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
                </Button>
              </div>
            </TabsContent>

            {/* Career Tab */}
            <TabsContent value="career" className="mt-0 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Riwayat Karir</h4>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowAddCareer(true);
                    setCareerForm({
                      title: '',
                      subtitle: '',
                      location: '',
                      industry: '',
                      year: currentYear,
                      isActive: true,
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
              </div>

              {/* Add Career Form */}
              {showAddCareer && (
                <div className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-sm">Tambah Riwayat Karir</h5>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddCareer(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Jabatan *</Label>
                      <Input
                        value={careerForm.title}
                        onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                        placeholder="Contoh: Marketing Manager"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Perusahaan *</Label>
                      <Input
                        value={careerForm.subtitle}
                        onChange={(e) => setCareerForm({ ...careerForm, subtitle: e.target.value })}
                        placeholder="Contoh: PT Telkom Indonesia"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Lokasi *</Label>
                      <Input
                        value={careerForm.location}
                        onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                        placeholder="Contoh: Jakarta"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Industri *</Label>
                      <Input
                        value={careerForm.industry}
                        onChange={(e) => setCareerForm({ ...careerForm, industry: e.target.value })}
                        placeholder="Contoh: Telekomunikasi"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tahun Mulai *</Label>
                      <Select
                        value={careerForm.year.toString()}
                        onValueChange={(v) => setCareerForm({ ...careerForm, year: parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={careerForm.isActive ? 'active' : 'ended'}
                        onValueChange={(v) => setCareerForm({ ...careerForm, isActive: v === 'active' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="ended">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddCareer}
                    disabled={!careerForm.title || !careerForm.subtitle || !careerForm.location || !careerForm.industry}
                  >
                    Simpan
                  </Button>
                </div>
              )}

              {/* Career List */}
              {careerHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada riwayat karir
                </div>
              ) : (
                <div className="space-y-3">
                  {careerHistory.map((career) => (
                    <div
                      key={career.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      {editingCareer === career.id ? (
                        // Edit mode
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              value={careerForm.title}
                              onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                              placeholder="Jabatan"
                            />
                            <Input
                              value={careerForm.subtitle}
                              onChange={(e) => setCareerForm({ ...careerForm, subtitle: e.target.value })}
                              placeholder="Perusahaan"
                            />
                            <Input
                              value={careerForm.location}
                              onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                              placeholder="Lokasi"
                            />
                            <Input
                              value={careerForm.industry}
                              onChange={(e) => setCareerForm({ ...careerForm, industry: e.target.value })}
                              placeholder="Industri"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdateCareer(career.id)}>
                              Simpan
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingCareer(null)}>
                              Batal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{career.title}</h5>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs",
                                career.isActive 
                                  ? "bg-success/10 text-success" 
                                  : "bg-muted text-muted-foreground"
                              )}>
                                {career.isActive ? 'Aktif' : 'Selesai'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {career.subtitle}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {career.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {career.year}{career.yearEnd ? ` - ${career.yearEnd}` : career.isActive ? ' - Sekarang' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingCareer(career.id);
                                setCareerForm({
                                  title: career.title,
                                  subtitle: career.subtitle,
                                  location: career.location,
                                  industry: career.industry,
                                  year: career.year,
                                  yearEnd: career.yearEnd,
                                  isActive: career.isActive,
                                });
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCareer(career.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="mt-0 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Prestasi Non-Akademik</h4>
              </div>

              {achievements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada prestasi tercatat
                </div>
              ) : (
                <div className="space-y-3">
                  {achievements.map((achievement) => {
                    const categoryInfo = ACHIEVEMENT_CATEGORIES[achievement.category];
                    return (
                      <div
                        key={achievement.id}
                        className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs",
                                categoryInfo?.color || 'text-primary',
                                "bg-primary/10"
                              )}>
                                {categoryInfo?.label || achievement.category}
                              </span>
                              {achievement.isUnggulan && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-warning/10 text-warning">
                                  Unggulan
                                </span>
                              )}
                            </div>
                            <h5 className="font-medium">
                              {(achievement as any).namaLomba || 
                               (achievement as any).namaSeminar || 
                               (achievement as any).judul || 
                               (achievement as any).namaPerusahaan ||
                               (achievement as any).namaUsaha ||
                               (achievement as any).namaProgram ||
                               (achievement as any).namaOrganisasi ||
                               (achievement as any).judulProyek ||
                               'Prestasi'}
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              {(achievement as any).penyelenggara || 
                               (achievement as any).posisi ||
                               (achievement as any).jabatan ||
                               (achievement as any).mataKuliah ||
                               ''}
                              {(achievement as any).tahun && ` • ${(achievement as any).tahun}`}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAchievement(achievement.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </ScrollArea>

          {/* Save Result */}
          {saveResult && (
            <div className={cn(
              "p-3 rounded-lg flex items-center gap-2 mt-4",
              saveResult.success 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            )}>
              {saveResult.success ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{saveResult.message}</span>
            </div>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

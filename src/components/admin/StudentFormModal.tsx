/**
 * StudentFormModal
 * Modal form for creating/editing student data
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { User, Briefcase, Award, Save, X } from 'lucide-react';
import type { StudentProfile, StudentStatus } from '@/types/student.types';
import type { AlumniData } from '@/types/alumni.types';
import { CareerEditForm } from './CareerEditForm';
import { AchievementEditList } from './AchievementEditList';

interface StudentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: StudentProfile | null;
  alumniData?: AlumniData | null;
  mode: 'create' | 'edit';
  onSave: (data: StudentFormData) => void;
  onSaveCareer?: (data: Partial<AlumniData>) => void;
  existingNims: string[];
}

export interface StudentFormData {
  nama: string;
  nim: string;
  email: string;
  noHp: string;
  status: StudentStatus;
  tahunMasuk: number;
  tahunLulus?: number;
}

const STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: 'active', label: 'Mahasiswa Aktif' },
  { value: 'on_leave', label: 'Cuti' },
  { value: 'dropout', label: 'Dropout' },
  { value: 'alumni', label: 'Alumni' },
];

const TAHUN_OPTIONS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export function StudentFormModal({
  open,
  onOpenChange,
  student,
  alumniData,
  mode,
  onSave,
  onSaveCareer,
  existingNims,
}: StudentFormModalProps) {
  const [activeTab, setActiveTab] = useState('profil');
  const [formData, setFormData] = useState<StudentFormData>({
    nama: '',
    nim: '',
    email: '',
    noHp: '',
    status: 'active',
    tahunMasuk: new Date().getFullYear(),
    tahunLulus: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && student) {
        setFormData({
          nama: student.nama,
          nim: student.nim,
          email: student.email || '',
          noHp: student.noHp || '',
          status: student.status,
          tahunMasuk: student.tahunMasuk,
          tahunLulus: student.tahunLulus,
        });
      } else {
        setFormData({
          nama: '',
          nim: '',
          email: '',
          noHp: '',
          status: 'active',
          tahunMasuk: new Date().getFullYear(),
          tahunLulus: undefined,
        });
      }
      setErrors({});
      setActiveTab('profil');
    }
  }, [open, mode, student]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nama validation
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter';
    }

    // NIM validation
    if (!formData.nim.trim()) {
      newErrors.nim = 'NIM wajib diisi';
    } else if (mode === 'create' && existingNims.includes(formData.nim.trim())) {
      newErrors.nim = 'NIM sudah terdaftar';
    } else if (mode === 'edit' && student && formData.nim !== student.nim && existingNims.includes(formData.nim.trim())) {
      newErrors.nim = 'NIM sudah terdaftar';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Tahun Lulus validation for alumni
    if (formData.status === 'alumni' && !formData.tahunLulus) {
      newErrors.tahunLulus = 'Tahun lulus wajib diisi untuk Alumni';
    }
    if (formData.tahunLulus && formData.tahunLulus < formData.tahunMasuk) {
      newErrors.tahunLulus = 'Tahun lulus tidak boleh sebelum tahun masuk';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: 'Validasi Gagal',
        description: 'Silakan periksa kembali form Anda',
        variant: 'destructive',
      });
      return;
    }

    onSave(formData);
    onOpenChange(false);
    toast({
      title: mode === 'create' ? 'Mahasiswa Ditambahkan' : 'Data Diperbarui',
      description: `Data ${formData.nama} berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
    });
  };

  const handleCareerSave = (data: Partial<AlumniData>) => {
    if (onSaveCareer) {
      onSaveCareer(data);
      toast({
        title: 'Data Karir Diperbarui',
        description: 'Perubahan data karir berhasil disimpan',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {mode === 'create' ? 'Tambah Mahasiswa Baru' : `Edit: ${student?.nama}`}
          </DialogTitle>
        </DialogHeader>

        {mode === 'edit' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profil" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger 
                value="karir" 
                className="flex items-center gap-2"
                disabled={formData.status !== 'alumni'}
              >
                <Briefcase className="w-4 h-4" />
                Karir
              </TabsTrigger>
              <TabsTrigger value="prestasi" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Prestasi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profil" className="mt-4">
              <ProfileForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="karir" className="mt-4">
              {formData.status === 'alumni' ? (
                <CareerEditForm
                  alumniData={alumniData}
                  onSave={handleCareerSave}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Data karir hanya tersedia untuk Alumni</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="prestasi" className="mt-4">
              <AchievementEditList studentId={student?.id} />
            </TabsContent>
          </Tabs>
        ) : (
          <ProfileForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}

        <DialogFooter className="gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          {(activeTab === 'profil' || mode === 'create') && (
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              {mode === 'create' ? 'Tambah' : 'Simpan'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Profile form component
interface ProfileFormProps {
  formData: StudentFormData;
  setFormData: React.Dispatch<React.SetStateAction<StudentFormData>>;
  errors: Record<string, string>;
}

function ProfileForm({ formData, setFormData, errors }: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama */}
        <div className="space-y-2">
          <Label htmlFor="nama">
            Nama Lengkap <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nama"
            value={formData.nama}
            onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
            placeholder="Masukkan nama lengkap"
            className={errors.nama ? 'border-destructive' : ''}
          />
          {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
        </div>

        {/* NIM */}
        <div className="space-y-2">
          <Label htmlFor="nim">
            NIM <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nim"
            value={formData.nim}
            onChange={(e) => setFormData((prev) => ({ ...prev, nim: e.target.value }))}
            placeholder="Contoh: 20210001"
            className={errors.nim ? 'border-destructive' : ''}
          />
          {errors.nim && <p className="text-xs text-destructive">{errors.nim}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="email@example.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* No HP */}
        <div className="space-y-2">
          <Label htmlFor="noHp">No. HP</Label>
          <Input
            id="noHp"
            value={formData.noHp}
            onChange={(e) => setFormData((prev) => ({ ...prev, noHp: e.target.value }))}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: StudentStatus) =>
              setFormData((prev) => ({
                ...prev,
                status: value,
                tahunLulus: value !== 'alumni' ? undefined : prev.tahunLulus,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tahun Masuk */}
        <div className="space-y-2">
          <Label>
            Tahun Masuk <span className="text-destructive">*</span>
          </Label>
          <Select
            value={String(formData.tahunMasuk)}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, tahunMasuk: Number(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              {TAHUN_OPTIONS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tahun Lulus (only for alumni) */}
        {formData.status === 'alumni' && (
          <div className="space-y-2">
            <Label>
              Tahun Lulus <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.tahunLulus ? String(formData.tahunLulus) : ''}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, tahunLulus: Number(value) }))
              }
            >
              <SelectTrigger className={errors.tahunLulus ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih tahun" />
              </SelectTrigger>
              <SelectContent>
                {TAHUN_OPTIONS.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tahunLulus && (
              <p className="text-xs text-destructive">{errors.tahunLulus}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

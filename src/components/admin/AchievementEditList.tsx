/**
 * AchievementEditList
 * List of achievements with edit/delete capabilities for admin
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Calendar,
  MapPin,
  Award,
} from 'lucide-react';
import type { NonAcademicAchievement, AchievementCategory } from '@/types/student.types';
import * as studentRepository from '@/repositories/student.repository';
import { cn } from '@/lib/utils';

interface AchievementEditListProps {
  studentId?: string;
}

const CATEGORY_OPTIONS: { value: AchievementCategory; label: string }[] = [
  { value: 'event_participation', label: 'Partisipasi Kegiatan' },
  { value: 'scientific_work', label: 'Karya Ilmiah' },
  { value: 'intellectual_property', label: 'Hak Kekayaan Intelektual' },
  { value: 'applied_academic', label: 'Akademik Terapan' },
  { value: 'entrepreneurship', label: 'Kewirausahaan' },
  { value: 'self_development', label: 'Pengembangan Diri' },
];

const TINGKAT_OPTIONS = [
  { value: 'lokal', label: 'Lokal' },
  { value: 'regional', label: 'Regional' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' },
];

export function AchievementEditList({ studentId }: AchievementEditListProps) {
  const [achievements, setAchievements] = useState<NonAcademicAchievement[]>([]);
  const [editingAchievement, setEditingAchievement] = useState<NonAcademicAchievement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load achievements
  useEffect(() => {
    const loadAchievements = async () => {
      if (!studentId) {
        setAchievements([]);
        setIsLoading(false);
        return;
      }
      try {
        const data = await studentRepository.getAchievementsByStudentId(studentId);
        setAchievements(data);
      } catch (error) {
        console.error('Failed to load achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAchievements();
  }, [studentId]);

  const handleVerify = async (id: string, verified: boolean) => {
    try {
      await studentRepository.updateAchievement(id, { verified });
      setAchievements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, verified } : a))
      );
      toast({
        title: verified ? 'Prestasi Diverifikasi' : 'Verifikasi Dibatalkan',
        description: `Status verifikasi berhasil diperbarui`,
      });
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Tidak dapat mengubah status verifikasi',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    // In production, this would delete from database
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    toast({
      title: 'Prestasi Dihapus',
      description: 'Data prestasi berhasil dihapus',
    });
  };

  const handleSaveEdit = async (data: Partial<NonAcademicAchievement>) => {
    if (!editingAchievement) return;

    try {
      await studentRepository.updateAchievement(editingAchievement.id, data);
      setAchievements((prev) =>
        prev.map((a) =>
          a.id === editingAchievement.id ? { ...a, ...data } : a
        )
      );
      setEditingAchievement(null);
      toast({
        title: 'Prestasi Diperbarui',
        description: 'Data prestasi berhasil diperbarui',
      });
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Tidak dapat memperbarui prestasi',
        variant: 'destructive',
      });
    }
  };

  const handleAddNew = async (data: Omit<NonAcademicAchievement, 'id' | 'createdAt' | 'updatedAt' | 'verified'>) => {
    if (!studentId) return;

    try {
      const newAchievement = await studentRepository.createAchievement({
        ...data,
        studentId,
      });
      setAchievements((prev) => [...prev, newAchievement]);
      setIsAddModalOpen(false);
      toast({
        title: 'Prestasi Ditambahkan',
        description: 'Data prestasi baru berhasil ditambahkan',
      });
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Tidak dapat menambahkan prestasi',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Memuat data prestasi...
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Pilih mahasiswa untuk melihat prestasi</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">
          Daftar Prestasi ({achievements.length})
        </h4>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prestasi
        </Button>
      </div>

      {/* Achievement List */}
      {achievements.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada prestasi tercatat</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Prestasi Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-foreground truncate">
                      {achievement.title}
                    </h5>
                    {achievement.verified ? (
                      <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/30">
                        <Check className="w-3 h-3 mr-1" />
                        Terverifikasi
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                        Menunggu Verifikasi
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {achievement.description || 'Tidak ada deskripsi'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(achievement.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {achievement.lokasi && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {achievement.lokasi}
                      </span>
                    )}
                    {achievement.tingkat && (
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {TINGKAT_OPTIONS.find((t) => t.value === achievement.tingkat)?.label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleVerify(achievement.id, !achievement.verified)
                    }
                    title={achievement.verified ? 'Batalkan verifikasi' : 'Verifikasi'}
                  >
                    {achievement.verified ? (
                      <X className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingAchievement(achievement)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(achievement.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AchievementFormModal
        open={!!editingAchievement}
        onOpenChange={(open) => !open && setEditingAchievement(null)}
        achievement={editingAchievement}
        onSave={handleSaveEdit}
        mode="edit"
      />

      {/* Add Modal */}
      <AchievementFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddNew}
        mode="add"
        studentId={studentId}
      />
    </div>
  );
}

// Achievement Form Modal
interface AchievementFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: NonAcademicAchievement | null;
  onSave: (data: any) => void;
  mode: 'add' | 'edit';
  studentId?: string;
}

function AchievementFormModal({
  open,
  onOpenChange,
  achievement,
  onSave,
  mode,
  studentId,
}: AchievementFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'event_participation' as AchievementCategory,
    subcategory: 'competition' as string,
    tanggal: '',
    lokasi: '',
    penyelenggara: '',
    tingkat: 'lokal' as string,
    peringkat: '',
  });

  useEffect(() => {
    if (open && mode === 'edit' && achievement) {
      setFormData({
        title: achievement.title,
        description: achievement.description || '',
        category: achievement.category,
        subcategory: achievement.subcategory,
        tanggal: new Date(achievement.tanggal).toISOString().split('T')[0],
        lokasi: achievement.lokasi || '',
        penyelenggara: achievement.penyelenggara || '',
        tingkat: achievement.tingkat || 'lokal',
        peringkat: achievement.peringkat || '',
      });
    } else if (open && mode === 'add') {
      setFormData({
        title: '',
        description: '',
        category: 'event_participation',
        subcategory: 'competition',
        tanggal: new Date().toISOString().split('T')[0],
        lokasi: '',
        penyelenggara: '',
        tingkat: 'lokal',
        peringkat: '',
      });
    }
  }, [open, mode, achievement]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Judul Wajib Diisi',
        description: 'Silakan masukkan judul prestasi',
        variant: 'destructive',
      });
      return;
    }

    onSave({
      ...formData,
      tanggal: new Date(formData.tanggal),
      studentId: studentId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            {mode === 'add' ? 'Tambah Prestasi' : 'Edit Prestasi'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Judul Prestasi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Juara 1 Lomba Bisnis Plan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Deskripsi singkat prestasi..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value: AchievementCategory) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tingkat</Label>
              <Select
                value={formData.tingkat}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tingkat: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat" />
                </SelectTrigger>
                <SelectContent>
                  {TINGKAT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tanggal: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                id="lokasi"
                value={formData.lokasi}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lokasi: e.target.value }))
                }
                placeholder="Semarang"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="penyelenggara">Penyelenggara</Label>
              <Input
                id="penyelenggara"
                value={formData.penyelenggara}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    penyelenggara: e.target.value,
                  }))
                }
                placeholder="Nama penyelenggara"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peringkat">Peringkat/Hasil</Label>
              <Input
                id="peringkat"
                value={formData.peringkat}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, peringkat: e.target.value }))
                }
                placeholder="Juara 1, Finalis, dll"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            <Check className="w-4 h-4 mr-2" />
            {mode === 'add' ? 'Tambah' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

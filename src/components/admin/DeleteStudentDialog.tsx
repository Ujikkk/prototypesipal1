/**
 * Delete Student Dialog
 * Confirmation dialog for deleting student accounts
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  studentNim: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteStudentDialog({
  open,
  onOpenChange,
  studentName,
  studentNim,
  onConfirm,
  isDeleting = false,
}: DeleteStudentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle>Hapus Akun Mahasiswa?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <p>
              Anda akan menghapus akun mahasiswa berikut:
            </p>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-semibold text-foreground">{studentName}</p>
              <p className="text-sm text-muted-foreground">NIM: {studentNim}</p>
            </div>
            <p className="text-destructive font-medium">
              ⚠️ Perhatian: Semua data terkait (riwayat karir, prestasi) juga akan dihapus secara permanen.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Student Search & Select Component
 * Allows employer to search and select alumni for evaluation
 */

import { useState, useMemo } from 'react';
import { Search, User, GraduationCap, Calendar, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { studentProfiles } from '@/data/student-seed-data';
import type { StudentSnapshot } from '@/types/rating.types';

interface StudentSearchSelectProps {
  selectedStudent: StudentSnapshot | null;
  onSelect: (student: StudentSnapshot) => void;
  className?: string;
}

export function StudentSearchSelect({
  selectedStudent,
  onSelect,
  className,
}: StudentSearchSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only alumni students
  const alumniStudents = useMemo(() => {
    return studentProfiles
      .filter((s) => s.status === 'alumni')
      .map((s) => ({
        id: s.id,
        nama: s.nama,
        nim: s.nim,
        prodi: s.prodi,
        tahunLulus: s.tahunLulus,
      }));
  }, []);

  // Search filter
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return alumniStudents;
    
    const query = searchQuery.toLowerCase();
    return alumniStudents.filter(
      (s) =>
        s.nama.toLowerCase().includes(query) ||
        s.nim.includes(query)
    );
  }, [alumniStudents, searchQuery]);

  const handleSelect = (student: typeof alumniStudents[0]) => {
    onSelect(student);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari berdasarkan nama atau NIM..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base rounded-xl"
        />
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 glass-card rounded-2xl">
            <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Tidak ada lulusan ditemukan' : 'Masukkan nama atau NIM untuk mencari'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredStudents.map((student, index) => {
              const isSelected = selectedStudent?.id === student.id;
              
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => handleSelect(student)}
                  className={cn(
                    'w-full text-left glass-card rounded-xl p-4 transition-all duration-200',
                    'hover:shadow-soft hover:border-primary/30',
                    'animate-fade-up',
                    isSelected && 'border-primary bg-primary/5 shadow-soft'
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      isSelected ? 'bg-primary' : 'bg-primary/10'
                    )}>
                      {isSelected ? (
                        <CheckCircle className="w-6 h-6 text-primary-foreground" />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{student.nama}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          {student.nim}
                        </span>
                        {student.tahunLulus && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Lulus {student.tahunLulus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        Hanya lulusan (alumni) yang dapat dievaluasi
      </p>
    </div>
  );
}

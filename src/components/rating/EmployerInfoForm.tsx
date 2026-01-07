/**
 * Employer Information Form Component
 * Collects evaluator identity information
 */

import { Building2, User, Briefcase, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { INDUSTRY_SECTORS } from '@/constants/rating.constants';
import type { EmployerInfo, IndustrySector } from '@/types/rating.types';

interface EmployerInfoFormProps {
  value: Partial<EmployerInfo>;
  onChange: (value: Partial<EmployerInfo>) => void;
  className?: string;
}

export function EmployerInfoForm({ value, onChange, className }: EmployerInfoFormProps) {
  const handleChange = (field: keyof EmployerInfo, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Required Fields */}
      <div className="space-y-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Informasi Wajib
        </p>

        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Nama Perusahaan / Instansi
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Contoh: PT Telkom Indonesia"
            value={value.companyName || ''}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        {/* Evaluator Position */}
        <div className="space-y-2">
          <Label htmlFor="evaluatorPosition" className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Jabatan Penilai
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="evaluatorPosition"
            placeholder="Contoh: HR Manager, Supervisor"
            value={value.evaluatorPosition || ''}
            onChange={(e) => handleChange('evaluatorPosition', e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        {/* Industry Sector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Sektor Industri
            <span className="text-destructive">*</span>
          </Label>
          <Select
            value={value.industrySector || ''}
            onValueChange={(val) => handleChange('industrySector', val)}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Pilih sektor industri" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INDUSTRY_SECTORS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="space-y-5 pt-4 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Informasi Tambahan (Opsional)
        </p>

        {/* Company Email */}
        <div className="space-y-2">
          <Label htmlFor="companyEmail" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Perusahaan
          </Label>
          <Input
            id="companyEmail"
            type="email"
            placeholder="hr@perusahaan.com"
            value={value.companyEmail || ''}
            onChange={(e) => handleChange('companyEmail', e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="contactNumber" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Nomor Telepon
          </Label>
          <Input
            id="contactNumber"
            type="tel"
            placeholder="021-12345678"
            value={value.contactNumber || ''}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

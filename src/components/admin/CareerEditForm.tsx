/**
 * CareerEditForm
 * Form for editing alumni career data
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Briefcase, Rocket, BookOpen, Search } from 'lucide-react';
import type { AlumniData, AlumniStatus } from '@/types/alumni.types';
import { cn } from '@/lib/utils';

interface CareerEditFormProps {
  alumniData?: AlumniData | null;
  onSave: (data: Partial<AlumniData>) => void;
}

const STATUS_OPTIONS: { value: AlumniStatus; label: string; icon: React.ElementType }[] = [
  { value: 'bekerja', label: 'Bekerja', icon: Briefcase },
  { value: 'wirausaha', label: 'Wirausaha', icon: Rocket },
  { value: 'studi', label: 'Melanjutkan Studi', icon: BookOpen },
  { value: 'mencari', label: 'Mencari Kerja', icon: Search },
];

const INDUSTRI_OPTIONS = [
  'Perbankan & Keuangan',
  'Retail & E-Commerce',
  'Manufaktur',
  'Teknologi Informasi',
  'Kesehatan',
  'Pendidikan',
  'BUMN/BUMD',
  'Konsultan',
  'Marketing & Advertising',
  'Lainnya',
];

const TAHUN_OPTIONS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export function CareerEditForm({ alumniData, onSave }: CareerEditFormProps) {
  const [status, setStatus] = useState<AlumniStatus>(alumniData?.status || 'bekerja');
  const [formData, setFormData] = useState<Partial<AlumniData>>({});

  useEffect(() => {
    if (alumniData) {
      setStatus(alumniData.status);
      setFormData(alumniData);
    }
  }, [alumniData]);

  const handleSave = () => {
    onSave({
      ...formData,
      status,
    });
  };

  const updateField = (field: keyof AlumniData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Status Selector */}
      <div className="space-y-2">
        <Label>Status Karir</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STATUS_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = status === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Form based on status */}
      <div className="space-y-4">
        {status === 'bekerja' && (
          <BekerjaForm formData={formData} updateField={updateField} />
        )}
        {status === 'wirausaha' && (
          <WirausahaForm formData={formData} updateField={updateField} />
        )}
        {status === 'studi' && (
          <StudiForm formData={formData} updateField={updateField} />
        )}
        {status === 'mencari' && (
          <MencariForm formData={formData} updateField={updateField} />
        )}
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Simpan Data Karir
      </Button>
    </div>
  );
}

// Bekerja Form
function BekerjaForm({
  formData,
  updateField,
}: {
  formData: Partial<AlumniData>;
  updateField: (field: keyof AlumniData, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama Perusahaan</Label>
          <Input
            value={formData.namaPerusahaan || ''}
            onChange={(e) => updateField('namaPerusahaan', e.target.value)}
            placeholder="PT Example Indonesia"
          />
        </div>
        <div className="space-y-2">
          <Label>Jabatan</Label>
          <Input
            value={formData.jabatan || ''}
            onChange={(e) => updateField('jabatan', e.target.value)}
            placeholder="Staff Administrasi"
          />
        </div>
        <div className="space-y-2">
          <Label>Bidang Industri</Label>
          <Select
            value={formData.bidangIndustri || ''}
            onValueChange={(value) => updateField('bidangIndustri', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih bidang" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRI_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Lokasi Perusahaan</Label>
          <Input
            value={formData.lokasiPerusahaan || ''}
            onChange={(e) => updateField('lokasiPerusahaan', e.target.value)}
            placeholder="Jakarta"
          />
        </div>
        <div className="space-y-2">
          <Label>Tahun Mulai Kerja</Label>
          <Select
            value={formData.tahunMulaiKerja ? String(formData.tahunMulaiKerja) : ''}
            onValueChange={(value) => updateField('tahunMulaiKerja', Number(value))}
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
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span>Masih Aktif</span>
            <Switch
              checked={formData.masihAktifKerja ?? true}
              onCheckedChange={(checked) => updateField('masihAktifKerja', checked)}
            />
          </Label>
          {!formData.masihAktifKerja && (
            <Select
              value={formData.tahunSelesaiKerja ? String(formData.tahunSelesaiKerja) : ''}
              onValueChange={(value) => updateField('tahunSelesaiKerja', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tahun selesai" />
              </SelectTrigger>
              <SelectContent>
                {TAHUN_OPTIONS.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}

// Wirausaha Form
function WirausahaForm({
  formData,
  updateField,
}: {
  formData: Partial<AlumniData>;
  updateField: (field: keyof AlumniData, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama Usaha</Label>
          <Input
            value={formData.namaUsaha || ''}
            onChange={(e) => updateField('namaUsaha', e.target.value)}
            placeholder="Toko Sejahtera"
          />
        </div>
        <div className="space-y-2">
          <Label>Jenis Usaha</Label>
          <Input
            value={formData.jenisUsaha || ''}
            onChange={(e) => updateField('jenisUsaha', e.target.value)}
            placeholder="Retail / Jasa / dll"
          />
        </div>
        <div className="space-y-2">
          <Label>Lokasi Usaha</Label>
          <Input
            value={formData.lokasiUsaha || ''}
            onChange={(e) => updateField('lokasiUsaha', e.target.value)}
            placeholder="Semarang"
          />
        </div>
        <div className="space-y-2">
          <Label>Tahun Mulai Usaha</Label>
          <Select
            value={formData.tahunMulaiUsaha ? String(formData.tahunMulaiUsaha) : ''}
            onValueChange={(value) => updateField('tahunMulaiUsaha', Number(value))}
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
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span>Usaha Masih Aktif</span>
            <Switch
              checked={formData.usahaAktif ?? true}
              onCheckedChange={(checked) => updateField('usahaAktif', checked)}
            />
          </Label>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span>Punya Karyawan</span>
            <Switch
              checked={formData.punyaKaryawan ?? false}
              onCheckedChange={(checked) => updateField('punyaKaryawan', checked)}
            />
          </Label>
          {formData.punyaKaryawan && (
            <Input
              type="number"
              value={formData.jumlahKaryawan || ''}
              onChange={(e) => updateField('jumlahKaryawan', Number(e.target.value))}
              placeholder="Jumlah karyawan"
              min={1}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Studi Form
function StudiForm({
  formData,
  updateField,
}: {
  formData: Partial<AlumniData>;
  updateField: (field: keyof AlumniData, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama Kampus</Label>
          <Input
            value={formData.namaKampus || ''}
            onChange={(e) => updateField('namaKampus', e.target.value)}
            placeholder="Universitas Example"
          />
        </div>
        <div className="space-y-2">
          <Label>Program Studi</Label>
          <Input
            value={formData.programStudi || ''}
            onChange={(e) => updateField('programStudi', e.target.value)}
            placeholder="Manajemen"
          />
        </div>
        <div className="space-y-2">
          <Label>Jenjang</Label>
          <Select
            value={formData.jenjang || ''}
            onValueChange={(value) => updateField('jenjang', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenjang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S1">S1</SelectItem>
              <SelectItem value="S2">S2</SelectItem>
              <SelectItem value="S3">S3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Lokasi Kampus</Label>
          <Input
            value={formData.lokasiKampus || ''}
            onChange={(e) => updateField('lokasiKampus', e.target.value)}
            placeholder="Semarang"
          />
        </div>
        <div className="space-y-2">
          <Label>Tahun Mulai Studi</Label>
          <Select
            value={formData.tahunMulaiStudi ? String(formData.tahunMulaiStudi) : ''}
            onValueChange={(value) => updateField('tahunMulaiStudi', Number(value))}
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
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span>Masih Kuliah</span>
            <Switch
              checked={formData.masihAktifStudi ?? true}
              onCheckedChange={(checked) => updateField('masihAktifStudi', checked)}
            />
          </Label>
          {!formData.masihAktifStudi && (
            <Select
              value={formData.tahunSelesaiStudi ? String(formData.tahunSelesaiStudi) : ''}
              onValueChange={(value) => updateField('tahunSelesaiStudi', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tahun selesai" />
              </SelectTrigger>
              <SelectContent>
                {TAHUN_OPTIONS.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}

// Mencari Kerja Form
function MencariForm({
  formData,
  updateField,
}: {
  formData: Partial<AlumniData>;
  updateField: (field: keyof AlumniData, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Lokasi Tujuan</Label>
          <Input
            value={formData.lokasiTujuan || ''}
            onChange={(e) => updateField('lokasiTujuan', e.target.value)}
            placeholder="Jakarta, Semarang"
          />
        </div>
        <div className="space-y-2">
          <Label>Bidang yang Diincar</Label>
          <Input
            value={formData.bidangDiincar || ''}
            onChange={(e) => updateField('bidangDiincar', e.target.value)}
            placeholder="Marketing, HR, dll"
          />
        </div>
        <div className="space-y-2">
          <Label>Lama Mencari (bulan)</Label>
          <Input
            type="number"
            value={formData.lamaMencari || ''}
            onChange={(e) => updateField('lamaMencari', Number(e.target.value))}
            placeholder="3"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}

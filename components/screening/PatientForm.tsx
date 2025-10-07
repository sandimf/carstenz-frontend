'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { PatientData } from '@/types/screening';
import { PhoneInput } from '@/components/ui/phone-input';

interface PatientFormProps {
  data: PatientData;
  onChange: (key: keyof PatientData, value: any) => void;
  errors?: Record<string, string>;
}

function calculateAge(dateString: string): string {
  if (!dateString) return '';
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
}

export function PatientForm({ data, onChange, errors = {} }: PatientFormProps) {
  // Auto-calculate age when date_of_birth changes
  useEffect(() => {
    if (data.date_of_birth) {
      onChange('age', calculateAge(data.date_of_birth));
    }
  }, [data.date_of_birth]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* NIK */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="nik">NIK</Label>
        <Input
          id="nik"
          value={data.nik}
          placeholder="NIK"
          onChange={(e) => onChange('nik', e.target.value)}
        />
        {errors.nik && <p className="text-sm text-red-600">{errors.nik}</p>}
      </div>

      {/* Name */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          value={data.name}
          placeholder="Nama Lengkap"
          onChange={(e) => onChange('name', e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Place of Birth */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="place_of_birth">Tempat Lahir</Label>
        <Input
          id="place_of_birth"
          value={data.place_of_birth}
          placeholder="Tempat Lahir"
          onChange={(e) => onChange('place_of_birth', e.target.value)}
        />
      </div>

      {/* Date of Birth */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={data.date_of_birth}
          onChange={(e) => onChange('date_of_birth', e.target.value)}
        />
        {data.date_of_birth && (
          <div className="text-sm text-muted-foreground">
            Umur: {calculateAge(data.date_of_birth)} tahun
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="gender">Jenis Kelamin</Label>
        <Select value={data.gender} onValueChange={(value) => onChange('gender', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Jenis Kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Jenis Kelamin</SelectLabel>
              <SelectItem value="laki-laki">Laki-Laki</SelectItem>
              <SelectItem value="perempuan">Perempuan</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
      </div>

      {/* Address */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="address">Alamat</Label>
        <Input
          id="address"
          value={data.address}
          placeholder="Alamat"
          onChange={(e) => onChange('address', e.target.value)}
        />
      </div>

      {/* RT/RW */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="rt_rw">RT/RW</Label>
        <Input
          id="rt_rw"
          value={data.rt_rw}
          placeholder="002/014"
          onChange={(e) => onChange('rt_rw', e.target.value)}
        />
      </div>

      {/* Village */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="village">Kel/Desa</Label>
        <Input
          id="village"
          value={data.village}
          placeholder="Kel/Desa"
          onChange={(e) => onChange('village', e.target.value)}
        />
      </div>

      {/* District */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="district">Kecamatan</Label>
        <Input
          id="district"
          value={data.district}
          placeholder="Kecamatan"
          onChange={(e) => onChange('district', e.target.value)}
        />
      </div>

      {/* Religion */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="religion">Agama</Label>
        <Input
          id="religion"
          value={data.religion}
          placeholder="Agama"
          onChange={(e) => onChange('religion', e.target.value)}
        />
      </div>

      {/* Marital Status */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="marital_status">Status Perkawinan</Label>
        <Input
          id="marital_status"
          value={data.marital_status}
          placeholder="Status Perkawinan"
          onChange={(e) => onChange('marital_status', e.target.value)}
        />
      </div>

      {/* Occupation */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="occupation">Pekerjaan</Label>
        <Input
          id="occupation"
          value={data.occupation}
          placeholder="Pekerjaan"
          onChange={(e) => onChange('occupation', e.target.value)}
        />
      </div>

      {/* Nationality */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="nationality">Kewarganegaraan</Label>
        <Input
          id="nationality"
          value={data.nationality}
          placeholder="Kewarganegaraan"
          onChange={(e) => onChange('nationality', e.target.value)}
        />
      </div>

      {/* Valid Until */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="valid_until">Berlaku Hingga</Label>
        <Input
          id="valid_until"
          value={data.valid_until}
          placeholder="Berlaku Hingga"
          onChange={(e) => onChange('valid_until', e.target.value)}
        />
      </div>

      {/* Blood Type */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="blood_type">Golongan Darah</Label>
        <Input
          id="blood_type"
          value={data.blood_type}
          placeholder="A, B, AB, O (- jika tidak diketahui)"
          onChange={(e) => onChange('blood_type', e.target.value)}
        />
      </div>

      {/* Age */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="age">Umur</Label>
        <Input
          id="age"
          value={data.age}
          placeholder="Umur"
          onChange={(e) => onChange('age', e.target.value)}
        />
      </div>

      {/* Height */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
        <Input
          id="tinggi_badan"
          type="number"
          value={data.tinggi_badan}
          placeholder="Tinggi Badan"
          onChange={(e) => onChange('tinggi_badan', e.target.value)}
        />
      </div>

      {/* Weight */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="berat_badan">Berat Badan (kg)</Label>
        <Input
          id="berat_badan"
          type="number"
          value={data.berat_badan}
          placeholder="Berat Badan"
          onChange={(e) => onChange('berat_badan', e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          placeholder="email@example.com"
          onChange={(e) => onChange('email', e.target.value)}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Contact */}
      <div className="grid w-full items-center gap-3">
      <Label htmlFor="contact">Nomor Telepon</Label>
      <PhoneInput
        id="contact"
        value={data.contact}
        defaultCountry="ID"
        onChange={(value) => onChange('contact', value)}
      />
      {errors.contact && (
        <p className="text-sm text-red-600">{errors.contact}</p>
      )}
    </div>
    </div>
  );
}
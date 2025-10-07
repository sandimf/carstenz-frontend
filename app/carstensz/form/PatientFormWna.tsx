'use client';

import React from 'react';
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
import { PatientDataWna } from '@/types/screening';
import { PhoneInput } from '@/components/ui/phone-input';

interface PatientFormProps {
  data: PatientDataWna;
  onChange: (key: keyof PatientDataWna, value: any) => void;
  errors?: Record<string, string>;
}

export function PatientFormWna({ data, onChange, errors = {} }: PatientFormProps) {
  return (
    <div className="space-y-6">
      {/* Judul di atas semua input */}
      <h1 className="text-xl font-bold">A. Personal Information</h1>

      {/* Grid input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            placeholder="Full Name"
            onChange={(e) => onChange('name', e.target.value)}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="grid w-full items-center gap-3">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => onChange('date_of_birth', e.target.value)}
          />
        </div>

        <div className="grid w-full items-center gap-3">
          <Label htmlFor="gender">Gender</Label>
          <Select value={data.gender} onValueChange={(value) => onChange('gender', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
        </div>

        <div className="grid w-full items-center gap-3">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={data.nationality}
            placeholder="Nationality"
            onChange={(e) => onChange('nationality', e.target.value)}
          />
        </div>

        <div className="grid w-full items-center gap-3">
          <Label htmlFor="passport_number">Passport/ID Number</Label>
          <Input
            id="passport_number"
            value={data.passport_number}
            placeholder="Passport Number"
            onChange={(e) => onChange('passport_number', e.target.value)}
          />
          {errors.passport_number && <p className="text-sm text-red-600">{errors.passport_number}</p>}
        </div>

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

        <div className="grid w-full items-center gap-3">
          <Label htmlFor="contact">Phone Number</Label>
          <PhoneInput
            id="contact"
            value={data.contact}
            defaultCountry="ID"
            onChange={(value) => onChange('contact', value)}
          />
          {errors.contact && <p className="text-sm text-red-600">{errors.contact}</p>}
        </div>
      </div>
    </div>
  );
}

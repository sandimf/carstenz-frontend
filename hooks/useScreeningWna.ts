import { useState } from 'react';
import { toast } from 'sonner';
import { PatientDataWna } from '@/types/screening';

export function useScreeningWna() {
  const [patientData, setPatientData] = useState<PatientDataWna>({
    passport_number: '',
    name: '',
    date_of_birth: '',
    gender: '', // ✅ sekarang TypeScript tahu ini '' | 'male' | 'female'
    nationality: '',
    email: '',
    contact: '',
    passport_images: null,
  });

  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updatePatientData = (key: keyof PatientDataWna, value: any) => {
    // Opsional: validasi gender
    if (key === 'gender' && value !== 'male' && value !== 'female' && value !== '') return;

    setPatientData((prev) => ({ ...prev, [key]: value }));
  };

  const updateAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const validatePatientData = (): boolean => {
    const requiredFields: Array<{ key: keyof PatientDataWna; label: string }> = [
      { key: 'passport_number', label: 'Passport number' },
      { key: 'name', label: 'Full Name' },
      { key: 'date_of_birth', label: 'Date Of Birth' },
      { key: 'gender', label: 'Gender' },
      { key: 'email', label: 'Email' },
    ];

    const missing = requiredFields.filter(
      (f) => !patientData[f.key] || (patientData[f.key]?.toString().trim() ?? '') === ''
    );

    if (missing.length > 0) {
      const missingLabels = missing.map((f) => f.label).join(', ');
      toast.error(`Please complete the data ${missingLabels}`);
      return false;
    }

    return true;
  };

  return {
    patientData,
    answers,
    isLoading,
    setIsLoading,
    updatePatientData,
    updateAnswer,
    validatePatientData,
  };
}

import { useState } from 'react';
import { toast } from 'sonner';
import { PatientData} from '@/types/screening';

export function useScreening() {
  const [patientData, setPatientData] = useState<PatientData>({
    nik: '',
    name: '',
    email: '',
    age: '',
    gender: '',
    contact: '',
    place_of_birth: '',
    date_of_birth: '',
    address: '',
    rt_rw: '',
    village: '',
    district: '',
    religion: '',
    marital_status: '',
    occupation: '',
    nationality: '',
    valid_until: '',
    blood_type: '',
    ktp_images: null,
    tinggi_badan: '',
    berat_badan: '',
  });

  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updatePatientData = (key: keyof PatientData, value: any) => {
    setPatientData((prev) => ({ ...prev, [key]: value }));
  };

  const updateAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const validatePatientData = (): boolean => {
    const requiredFields: Array<{ key: keyof PatientData; label: string }> = [
      { key: 'nik', label: 'NIK' },
      { key: 'name', label: 'Nama' },
      { key: 'place_of_birth', label: 'Tempat Lahir' },
      { key: 'date_of_birth', label: 'Tanggal Lahir' },
      { key: 'gender', label: 'Jenis Kelamin' },
      { key: 'address', label: 'Alamat' },
      { key: 'email', label: 'Email' },
      { key: 'contact', label: 'Nomor Telepon' },
    ];

    const missing = requiredFields.filter(
      (f) => !patientData[f.key] || (patientData[f.key]?.toString().trim() ?? '') === ''
    );

    if (missing.length > 0) {
      const missingLabels = missing.map((f) => f.label).join(', ');
      toast.error(`Silakan lengkapi data: ${missingLabels}`);
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

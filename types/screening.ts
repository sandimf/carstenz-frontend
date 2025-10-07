export interface Question {
  id: number;
  section?: string | null;
  question: string;
  type: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'checkbox_textarea' | 'textarea';
  options: QuestionOption[];
}


export interface QuestionOption {
  id: number;
  text: string;
}

export interface PatientData {
  nik: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  contact: string;
  place_of_birth: string;
  date_of_birth: string;
  address: string;
  rt_rw: string;
  village: string;
  district: string;
  religion: string;
  marital_status: string;
  occupation: string;
  nationality: string;
  valid_until: string;
  blood_type: string;
  ktp_images?: File | null;
  tinggi_badan: string;
  berat_badan: string;
}

export interface KTPAnalysisResult {
  NIK: string;
  Nama: string;
  "Tempat Lahir": string;
  "Tanggal Lahir": string;
  "Jenis Kelamin": string;
  Alamat: string;
  "RT/RW": string;
  "Kelurahan/Desa": string;
  Kecamatan: string;
  Agama: string;
  "Status Perkawinan": string;
  Pekerjaan: string;
  Kewarganegaraan: string;
  "Berlaku Hingga": string;
  "Golongan Darah": string;
}

// types/screening.ts
export interface PatientDataWna {
  passport_number: string;
  name: string;
  email: string;
  date_of_birth: string;
  gender: 'male' | 'female' | '';
  nationality: string;
  contact: string;
  passport_images?: File | null;
}


export interface PassportAnalysisResult {
  "Passport Number": string;
  "Full Name": string;
  "Date of Birth": string;
  "Gender": string;
  "Nationality": string;
  "passport_images"?: File | null;
}




export interface Answer {
  questioner_id: number;
  answer: string | string[] | CheckboxTextareaAnswer;
}

export interface CheckboxTextareaAnswer {
  options: string[];
  textarea?: string;
}

export interface ScreeningSubmission {
  patientData: PatientData;
  answers: Answer[];
}
import { apiClient } from './apiClient';

type HealthStatus = 'sehat' | 'tidak_sehat_dengan_pendamping' | 'tidak_sehat'; type MedicalAccompaniment = 'pendampingan_perawat' | 'pendampingan_paramedis' | 'pendampingan_dokter';

export const nurseService = {
    getNurseOverview: async () => { const response = await apiClient.client.get('/nurse/overview'); return response.data; },
    getNurseWaitingList: async (params?: { page?: number; per_page?: number }) => { const response = await apiClient.client.get('/nurse/waiting-list', { params }); return response.data; },

    requestAIAnalysis: async (data: {
    waitingCount: number;
    sehatCount: number;
    tidakSehatCount: number;
    finishedCount: number;
    todayCount: number;
    weekCount: number;
    monthCount: number;
    totalCount: number;
  }) => {
    const response = await apiClient.client.post('/nurse/ai-analysis', data);
    return response.data;
  },
  submitPhysicalExamination: async (data: {
    paramedis_id: number;
    patient_id: number;
    blood_pressure?: string;
    heart_rate?: number;
    oxygen_saturation?: number;
    respiratory_rate?: number;
    body_temperature?: number;
    physical_assessment?: string;
    reason?: string;
    medical_advice?: string;
    health_status: HealthStatus;
    consultation?: boolean;
    medical_accompaniment?: MedicalAccompaniment;
  }) => {
    const response = await apiClient.client.post('/screening/physical-examination', data);
    return response.data;
  },

  updatePhysicalExamination: async (id: number, data: {
    paramedis_id?: number;
    patient_id?: number;
    blood_pressure?: string;
    heart_rate?: number;
    oxygen_saturation?: number;
    respiratory_rate?: number;
    body_temperature?: number;
    physical_assessment?: string;
    reason?: string;
    medical_advice?: string;
    health_status?: HealthStatus;
    consultation?: boolean;
    medical_accompaniment?: MedicalAccompaniment;
  }) => {
    const response = await apiClient.client.put(`/screening/update/patient/physical-examination/${id}`, data);
    return response.data;
  },

  getPhysicalExaminationActivities: async (params?: { page?: number; per_page?: number; patient_id?: number; date?: string }) => {
    const response = await apiClient.client.get('/management/activity/nurse', { params });
    const { data, ...meta } = response.data;
    return { data, meta };
  },
};
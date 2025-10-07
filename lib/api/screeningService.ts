import { apiClient } from './apiClient';

export const screeningService = {
  // GET LISTS
  getScreenings: async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await apiClient.client.get('/screening/list', { params });
    return response.data;
  },
  
  getScreeningsArchive: async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await apiClient.client.get('/screening/archive', { params });
    return response.data;
  },

  getScreeningsCompleted: async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await apiClient.client.get('/screening/completed', { params });
    return response.data;
  },

  getScreeningsAll: async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await apiClient.client.get('/screening/payment', { params });
    return response.data;
  },
  
  // GET DETAIL
  getScreeningByUUID: async (uuid: string) => {
    const response = await apiClient.client.get(`/screening/detail/${uuid}`);
    return response.data;
  },

  getPatientByUUID: async (uuid: string) => {
    const response = await apiClient.client.get(`/screening/success/${uuid}`);
    return response.data;
  },

  // SUBMIT / UPDATE
  submitScreening: async (data: FormData) => {
    const response = await apiClient.client.post('/screening', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
    return response.data;
  },

  updatePatient: async (uuid: string, data: Record<string, any>) => {
    const response = await apiClient.client.put(`/screening/update/patient/${uuid}`, data);
    return response.data;
  },

  updateAnswer: async (answerId: number, data: { answer: string }) => {
    const response = await apiClient.client.put(`/screening/update/answer/${answerId}`, data);
    return response.data;
  },

  // UTILITY
  getQuestions: async () => {
    const response = await apiClient.client.get('/screenings/questionnaires');
    return response.data;
  },
  
  getScreeningsAnalysis: async (): Promise<{ patients_per_date: Record<string, number>; meta: { total_patients: number } }> => {
    try {
      const response = await apiClient.client.get('/management/analysis/screening');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch screening analysis', error);
      return { patients_per_date: {}, meta: { total_patients: 0 } };
    }



    
  }

  
};
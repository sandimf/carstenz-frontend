import { apiClient } from './apiClient';

export const managementService = {
  // STAFF / USER
  getStaff: async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await apiClient.client.get('/staff', { params });
    const { data, meta } = response.data;
    return { data, meta };
  },

  createStaff: async (data: Record<string, any>) => {
    const response = await apiClient.client.post('/staff', data);
    return response.data;
  },
  
  getUserInformation: async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await apiClient.client.get('/user/information', { params });
    const { data, ...meta } = response.data.data;
    return { data, meta };
  },

  getUserInformationChart: async (params?: { patient_id?: number; start_date?: string; end_date?: string }) => {
    const response = await apiClient.client.get('/user/information/chart', { params });
    return response.data.data;
  },
  
  // AMOUNT SERVICES
  getAmountServices: async () => {
    const res = await apiClient.client.get('/amount');
    return res.data.data;
  },

  createAmountService: async (data: { type: string; amount: number }) => {
    const res = await apiClient.client.post('/amount', data);
    return res.data;
  },

  updateAmountService: async (id: number, data: { type: string; amount: number }) => {
    const res = await apiClient.client.put(`/admin/amount-services/${id}`, data);
    return res.data;
  },

  deleteAmountService: async (id: number) => {
    const res = await apiClient.client.delete(`/admin/amount-services/${id}`);
    return res.data;
  },

  // UTILITY / VERSION
  getVersion: async () => {
    const res = await apiClient.client.get(`/version`);
    return res.data;
  },
  
  // PYTHON / AI CLIENTS
  convertHeic: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.pythonClient.post('/convert-heic', formData);
    return response.data;
  },

  analyzeKTP: async (file: File, isMobile: boolean = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mobile_optimization', isMobile.toString());
    const response = await apiClient.pythonClient.post('/analyze-ktp', formData);
    return response.data;
  },
  
  analyzePassport: async (file: File, isMobile: boolean = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mobile_optimization', isMobile.toString());
    const response = await apiClient.pythonClient.post('/analyze-passport', formData);
    return response.data;
  }
};

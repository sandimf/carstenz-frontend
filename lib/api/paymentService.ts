import { apiClient } from './apiClient';

type PeriodType = 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';
type FormatType = 'pdf' | 'excel';

export const paymentService = {
  // CASHIER
  getAmountServicesCashier: async (): Promise<{ screening_id: number; amount: number }[]> => {
    const res = await apiClient.client.get('/amount');
    return res.data.data;
  },

  submitPayment: async (data: FormData) => {
    const response = await apiClient.client.post('screening/payment/service', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getPaymentActivities: async (params?: { 
    page?: number; 
    per_page?: number; 
    search?: string; 
    patient_id?: number; 
    date?: string 
  }) => {
    const response = await apiClient.client.get('/management/activity/cashier', { params });
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  },

  // REPORTS
  getPaymentReport: async (params: {
    period_type: PeriodType;
    start_date?: string;
    end_date?: string;
    format: FormatType;
  }) => {
    const formData = new FormData();
    formData.append('period_type', params.period_type);
    formData.append('format', params.format);

    if (params.period_type === 'custom') {
      formData.append('start_date', params.start_date!);
      formData.append('end_date', params.end_date!);
    }

    const response = await apiClient.client.post('/screening/cashier/office', formData, {
      responseType: 'blob', // Karena berupa file (PDF/Excel)
    });

    return response.data;
  },

  downloadPaymentReport: async (params: {
    period_type: PeriodType;
    start_date?: string;
    end_date?: string;
    format: FormatType;
  }) => {
    const blob = await paymentService.getPaymentReport(params);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan_pembayaran.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

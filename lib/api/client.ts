import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

class APIClient {
  private client: AxiosInstance;
  private pythonClient: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_PROXY_URL || '/api/proxy',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true,
    });

    this.pythonClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_PYTHON_PROXY_URL || '/api/python-proxy',
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        const method = response.config.method?.toLowerCase();
        if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
          const message = response.data?.message || 'Operasi berhasil';
          toast.success(message);
        }
        return response;
      },
      (error: AxiosError<any>) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest?.url &&
          !originalRequest.url.includes('/auth/login') &&
          typeof window !== 'undefined'
        ) {
          this.clearAuthData();
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        if (error.response) {
          const message = error.response.data?.message || 'Terjadi kesalahan';

          if (error.response.status === 422 && error.response.data?.errors) {
            const validationErrors = error.response.data.errors;
            const firstError = Object.values(validationErrors)[0];
            toast.error(Array.isArray(firstError) ? firstError[0] : message);
          } else {
            toast.error(message);
          }
        } else if (error.request) {
          toast.error('Tidak dapat terhubung ke server');
        } else {
          toast.error('Terjadi kesalahan yang tidak terduga');
        }

        return Promise.reject(error);
      }
    );
  }

  private clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    this.token = null;
  }

  public setToken(token: string) {
    this.token = token;
  }

  // ================ NURSE OVERVIEW ================

  async requestAIAnalysis(data: {
    waitingCount: number;
    sehatCount: number;
    tidakSehatCount: number;
    finishedCount: number;
    todayCount: number;
    weekCount: number;
    monthCount: number;
    totalCount: number;
  }) {
    const response = await this.client.post('/nurse/ai-analysis', data);
    return response.data;
  }

  // ================ EXISTING METHODS ================
  async getAmountServices() {
    const res = await this.client.get('/amount');
    return res.data.data;
  }

  async getUserInformation(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await this.client.get('/user/information', { params });


    // Laravel paginator return { data, current_page, last_page, links, ... }
    const { data, ...meta } = response.data.data;

    return { data, meta };
  }

  async getUserInformationChart(params?: { patient_id?: number; start_date?: string; end_date?: string }) {
    const response = await this.client.get('/user/information/chart', { params });
    return response.data.data;
  }


  async createAmountService(data: { type: string; amount: number }) {
    const res = await this.client.post('/amount', data);
    return res.data;
  }

  async updateAmountService(id: number, data: { type: string; amount: number }) {
    const res = await this.client.put(`/admin/amount-services/${id}`, data);
    return res.data;
  }

  async deleteAmountService(id: number) {
    const res = await this.client.delete(`/admin/amount-services/${id}`);
    return res.data;
  }

  async getVersion() {
    const res = await this.client.get(`/version`);
    return res.data;
  }

  async getScreenings(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await this.client.get('/screening/list', { params });
    return response.data;
  }

  async getScreeningsArchive(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await this.client.get('/screening/archive', { params });
    return response.data;
  }

  async getScreeningsCompleted(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await this.client.get('/screening/completed', { params });
    return response.data;
  }

  async getScreeningsAll(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await this.client.get('/screening/payment', { params });
    return response.data;
  }

  async getAmountServicesCashier(): Promise<{ screening_id: number; amount: number }[]> {
    const res = await this.client.get('/amount');
    return res.data.data;
  }

  async submitPayment(data: FormData) {
    const response = await this.client.post('screening/payment/service', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getStaff(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await this.client.get('/staff', { params });
    const { data, meta } = response.data;
    return { data, meta };
  }

  async createStaff(data: Record<string, any>) {
    const response = await this.client.post('/staff', data);
    return response.data;
  }

  async updatePatient(uuid: string, data: Record<string, any>) {
    const response = await this.client.put(`/screening/update/patient/${uuid}`, data);
    return response.data;

  }


  async getScreeningsC(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await this.client.get('/screening/cartensz/list', { params });
    return response.data;
  }

  async updateAnswer(answerId: number, data: { answer: string }) {
    const response = await this.client.put(`/screening/update/answer/${answerId}`, data);
    return response.data;
  }

  async updatePhysicalExamination(id: number, data: {
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
    health_status?: 'sehat' | 'tidak_sehat_dengan_pendamping' | 'tidak_sehat';
    consultation?: boolean;
    medical_accompaniment?: 'pendampingan_perawat' | 'pendampingan_paramedis' | 'pendampingan_dokter';
  }) {
    const response = await this.client.put(`/screening/update/patient/physical-examination/${id}`, data);
    return response.data;
  }

  async submitPhysicalExamination(data: {
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
    health_status: 'sehat' | 'tidak_sehat_dengan_pendamping' | 'tidak_sehat';
    consultation?: boolean;
    medical_accompaniment?: 'pendampingan_perawat' | 'pendampingan_paramedis' | 'pendampingan_dokter';
  }) {
    const response = await this.client.post('/screening/physical-examination', data);
    return response.data;
  }

  async getScreeningByUUID(uuid: string) {
    const response = await this.client.get(`/screening/detail/${uuid}`);
    return response.data;
  }

    async getScreeningByUUIDC(uuid: string) {
    const response = await this.client.get(`/screening/cartensz/detail/${uuid}`);
    return response.data;
  }
  async me() {
    const response = await this.client.get('/me');
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { token, user } = response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', user.role);
    }

    return user;
  }

  async logout() {
    try {
      await this.client.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      this.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }

  async getQuestions() {
    const response = await this.client.get('/screenings/questionnaires');
    return response.data;
  }

    async getQuestionsCarstensz() {
    const response = await this.client.get('/screenings/questionnaires/carstensz');
    return response.data;
  }
  // ================ PAYMENT REPORTS ================
  async getPaymentReport(params: {
    period_type: 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';
    start_date?: string;
    end_date?: string;
    format: 'pdf' | 'excel';
  }) {
    const formData = new FormData();
    formData.append('period_type', params.period_type);
    formData.append('format', params.format);

    if (params.period_type === 'custom') {
      formData.append('start_date', params.start_date!);
      formData.append('end_date', params.end_date!);
    }

    const response = await this.client.post('/screening/cashier/office', formData, {
      responseType: 'blob', // karena file
    });

    return response.data;
  }

  // Download helper
  async downloadPaymentReport(params: {
    period_type: 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';
    start_date?: string;
    end_date?: string;
    format: 'pdf' | 'excel';
  }) {
    const blob = await this.getPaymentReport(params);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan_pembayaran.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }


  async submitScreening(data: FormData) {
    const response = await this.client.post('/screening', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
    return response.data;
  }

    async submitScreeningCarstensz(data: FormData) {
    const response = await this.client.post('/screening/cartensz', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
    return response.data;
  }

  async getPatientByUUID(uuid: string) {
    const response = await this.client.get(`/screening/success/${uuid}`);
    return response.data;
  }

    async getPatientCarstenszByUUID(uuid: string) {
    const response = await this.client.get(`/screening/cartensz/success/${uuid}`);
    return response.data;
  }

  async getPaymentActivities(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    patient_id?: number;
    date?: string
  }) {
    const response = await this.client.get('/management/activity/cashier', { params });

    // Backend mengirim { status, data, meta }
    // Kita ambil data dan meta dari response.data
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  }

  async createMountain(data: { name: string }) {
    const res = await this.client.post('screening/mountains/new', data);
    return res.data;
  }

  async getMountains() {
    const res = await this.client.get('/screening/mountains');
    return res.data.mountain; // ambil dari key "mountain"
  }

  async getQuestionsv2(params: { mountain_id: number; locale: string }) {
    const res = await this.client.get('/screening/questions/locale', { params });
    return res.data.data; // pastikan backend mengembalikan { data: [...] }
  }

async createQuestion(data: {
  mountain_id: number;
  locale: string;
  question_text: string;
  answer_type: string;
}) {
  const payload = {
    mountain_id: data.mountain_id,
    answer_type: data.answer_type,
    translations: [
      {
        locale: data.locale,
        question_text: data.question_text,
        options: [], // kalau ada opsi bisa dikirim sesuai tipe jawaban
      }
    ]
  };

  const res = await this.client.post('/screening/questions/locale', payload);
  return res.data;
}

// Tambahkan ini di class APIClient
async downloadScreeningsCsv(search?: string) {
  const response = await this.client.get('/screening/cartensz/export', {
    params: { search },
    responseType: 'blob', // penting supaya browser tahu ini file
  });
  return response.data;
}


  // ================ PHYSICAL EXAMINATION ACTIVITIES ================
  async getPhysicalExaminationActivities(params?: { page?: number; per_page?: number; patient_id?: number; date?: string }) {
    const response = await this.client.get('/management/activity/nurse', { params });

    const { data, ...meta } = response.data;

    return { data, meta };
  }

  async convertHeic(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.pythonClient.post('/convert-heic', formData);
    return response.data;
  }

  async getScreeningsAnalysis(): Promise<{ patients_per_date: Record<string, number>; meta: { total_patients: number } }> {
    try {
      const response = await this.client.get('/management/analysis/screening');
      // Backend mengirim { patients_per_date: { '2025-07-25': 2, ... }, meta: { total_patients: 1593 } }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch screening analysis', error);
      return { patients_per_date: {}, meta: { total_patients: 0 } };
    }
  }
  async analyzeKTP(file: File, isMobile: boolean = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mobile_optimization', isMobile.toString());
    const response = await this.pythonClient.post('/analyze-ktp', formData);
    return response.data;
  }
  async analyzePassport(file: File, isMobile: boolean = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mobile_optimization', isMobile.toString());
    const response = await this.pythonClient.post('/analyze-passport', formData);
    return response.data;
  }
}



export const apiClient = new APIClient();
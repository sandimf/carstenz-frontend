import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

export type { AxiosInstance };

class APIClient {
  public client: AxiosInstance; 
  public pythonClient: AxiosInstance; 
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
    // === REQUEST INTERCEPTOR: Tambahkan Token ===
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

    // === RESPONSE INTERCEPTOR: Notifikasi & Penanganan Error Global ===
    this.client.interceptors.response.use(
      (response) => {
        // Notifikasi Sukses untuk POST, PUT, PATCH, DELETE
        const method = response.config.method?.toLowerCase();
        if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
          const message = response.data?.message || 'Operasi berhasil';
          toast.success(message);
        }
        return response;
      },
      (error: AxiosError<any>) => {
        const originalRequest = error.config;

        // Penanganan 401 Unauthorized (Sesi Berakhir)
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

        // Penanganan Error Umum
        if (error.response) {
          const message = error.response.data?.message || 'Terjadi kesalahan';

          // Penanganan 422 Validation Error
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

  public clearAuthData() {
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
}

export const apiClient = new APIClient();
import { apiClient } from './apiClient';

export const authService = {
  me: async () => {
    const response = await apiClient.client.get('/me');
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.client.post('/auth/login', { email, password });
    const { token, user } = response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', user.role);
    }

    apiClient.setToken(token); 
    
    return user;
  },

  logout: async () => {
    try {
      await apiClient.client.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      apiClient.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  },
};
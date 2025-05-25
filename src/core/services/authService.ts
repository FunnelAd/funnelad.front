import { api } from '@/core/api';
import type { AuthResponse } from '@/core/types/auth';
import type { RegisterData } from '@/core/types/auth/responses';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/users/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/users/register', data);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  async verifyToken(): Promise<AuthResponse> {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Error en verificación de token:', error);
      throw error;
    }
  }
};

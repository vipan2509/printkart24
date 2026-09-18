import { create } from 'zustand';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (data: { firstName: string; lastName: string; email: string; phone?: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.data) {
        set({ user: res.data.data, isAuthenticated: true, error: null });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.post('/auth/login', credentials);
      if (res.data.success) {
        set({ user: res.data.data.user, isAuthenticated: true, error: null });
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login failed' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        set({ user: res.data.data.user, isAuthenticated: true, error: null });
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Registration failed' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

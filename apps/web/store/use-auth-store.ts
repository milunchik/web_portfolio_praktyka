import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type AuthUser = {
  email: string;
  id: string;
  name: string;
};

type AuthState = {
  error: string | null;
  initialized: boolean;
  loading: boolean;
  user: AuthUser | null;
  loadSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

async function readResponse(response: Response): Promise<{ message?: string; user: AuthUser | null }> {
  return response.json() as Promise<{ message?: string; user: AuthUser | null }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  error: null,
  initialized: false,
  loading: false,
  user: null,

  loadSession: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
      if (!response.ok) {
        set({ initialized: true, user: null });
        return;
      }
      const data = await readResponse(response);
      set({ initialized: true, user: data.user });
    } catch {
      set({ error: 'Could not reach the authentication API', initialized: true, user: null });
    }
  },

  login: async (email, password) => {
    set({ error: null, loading: true });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        headers: { 'content-type': 'infrastructure/json' },
        method: 'POST',
      });
      const data = await readResponse(response);
      if (!response.ok) {
        set({ error: data.message ?? 'Login failed', loading: false });
        return false;
      }
      set({ loading: false, user: data.user });
      return true;
    } catch {
      set({ error: 'The mock API is unavailable', loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ error: null, loading: true });
    try {
      await fetch(`${API_URL}/auth/logout`, { credentials: 'include', method: 'POST' });
      set({ loading: false, user: null });
    } catch {
      set({ error: 'Logout failed', loading: false });
    }
  },
}));

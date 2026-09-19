import { create } from 'zustand';
import type { SafeUser } from '@repo/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type AuthUser = SafeUser;

type AuthState = {
  error: string | null;
  initialized: boolean;
  loading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  loadSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  error: null,
  initialized: false,
  loading: false,
  user: null,
  accessToken: null,

  loadSession: async () => {
    try {
      const token = get().accessToken;
      if (!token) {
        set({ initialized: true, user: null });
        return;
      }
      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        set({ initialized: true, user: null, accessToken: null });
        return;
      }
      const user = (await response.json()) as SafeUser;
      set({ initialized: true, user });
    } catch {
      set({
        error: 'Could not reach the authentication API',
        initialized: true,
        user: null,
      });
    }
  },

  login: async (email, password) => {
    set({ error: null, loading: true });
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        body: JSON.stringify({ email, password }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        set({ error: data.message ?? 'Login failed', loading: false });
        return false;
      }
      set({ accessToken: data.accessToken });
      // Load user profile
      const userRes = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      if (userRes.ok) {
        const user = (await userRes.json()) as SafeUser;
        set({ loading: false, user });
      } else {
        set({ loading: false });
      }
      return true;
    } catch {
      set({ error: 'Authentication API is unavailable', loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ error: null, loading: true });
    try {
      const token = get().accessToken;
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          headers: { Authorization: `Bearer ${token}` },
          method: 'GET',
        });
      }
      set({ loading: false, user: null, accessToken: null });
    } catch {
      set({ error: 'Logout failed', loading: false, user: null, accessToken: null });
    }
  },
}));

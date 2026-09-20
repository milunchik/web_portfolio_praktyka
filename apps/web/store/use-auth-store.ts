import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import type { SafeUser, SignInRequest, SignUpRequest } from '../types';

export type AuthUser = SafeUser;

interface AuthState {
  error: string | null;
  initialized: boolean;
  loading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  loadSession: () => Promise<void>;
  signup: (data: SignUpRequest | { email: string; name: string; password: string }) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      error: null,
      initialized: false,
      loading: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      loadSession: async () => {
        try {
          const token = get().accessToken;
          if (!token) {
            set({ initialized: true, user: null });
            return;
          }
          const user = await userService.getMe(token);
          set({ initialized: true, user });
        } catch {
          set({
            error: 'Could not reach the authentication API',
            initialized: true,
            user: null,
          });
        }
      },

      signup: async (data: SignUpRequest | { email: string; name: string; password: string }) => {
        set({ error: null, loading: true });
        try {
          const payload: any = {
            email: data.email,
            name: (data as any).name || (data as any).fullName,
            password: data.password,
          };
          const res: any = await authService.signup(payload);
          const accessToken = res?.accessToken || res?.tokens?.accessToken;
          const refreshToken = res?.refreshToken || res?.tokens?.refreshToken;

          set({
            accessToken: accessToken ?? null,
            refreshToken: refreshToken ?? null,
          });

          if (accessToken) {
            try {
              const user = res?.user ?? (await userService.getMe(accessToken));
              set({ user, loading: false });
            } catch {
              set({ loading: false });
            }
          } else {
            set({ loading: false });
          }
          return true;
        } catch (err: any) {
          set({
            error: err?.message
              ? Array.isArray(err.message)
                ? err.message.join(', ')
                : err.message
              : 'Sign up failed',
            loading: false,
          });
          return false;
        }
      },

      login: async (email: string, password: string) => {
        set({ error: null, loading: true });
        try {
          const tokens: any = await authService.signin({ email, password });
          const accessToken = tokens?.accessToken || tokens?.tokens?.accessToken;
          const refreshToken = tokens?.refreshToken || tokens?.tokens?.refreshToken;

          set({
            accessToken: accessToken ?? null,
            refreshToken: refreshToken ?? null,
          });

          if (accessToken) {
            const user = await userService.getMe(accessToken);
            set({ loading: false, user });
          } else {
            set({ loading: false });
          }
          return true;
        } catch (err: any) {
          set({
            error: err?.message
              ? Array.isArray(err.message)
                ? err.message.join(', ')
                : err.message
              : 'Login failed',
            loading: false,
          });
          return false;
        }
      },

      logout: async () => {
        set({ error: null, loading: true });
        try {
          const token = get().accessToken;
          if (token) {
            await authService.logout(token);
          }
        } catch {
          // ignore
        } finally {
          set({ loading: false, user: null, accessToken: null, refreshToken: null });
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user: AuthUser | null) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

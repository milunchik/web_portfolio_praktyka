import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { clearAuthCookies, setAuthCookies } from '../utils/auth-cookie';
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
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: { accessToken: string | null; refreshToken?: string | null }) => void;
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

      setTokens: (tokens: { accessToken: string | null; refreshToken?: string | null }) => {
        const currentRefreshToken = get().refreshToken;
        const newRefreshToken =
          tokens.refreshToken !== undefined ? tokens.refreshToken : currentRefreshToken;

        setAuthCookies(tokens.accessToken, newRefreshToken);
        set({
          accessToken: tokens.accessToken,
          ...(tokens.refreshToken !== undefined ? { refreshToken: tokens.refreshToken } : {}),
        });
      },

      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          clearAuthCookies();
          set({ user: null, accessToken: null, refreshToken: null });
          return false;
        }

        try {
          const res = await authService.refreshTokens({ refreshToken });
          const newAccessToken = res?.accessToken || (res as any)?.tokens?.accessToken;
          const newRefreshToken =
            res?.refreshToken || (res as any)?.tokens?.refreshToken || refreshToken;

          if (newAccessToken) {
            setAuthCookies(newAccessToken, newRefreshToken);
            set({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });

            try {
              const user = await userService.getMe(newAccessToken);
              set({ user });
            } catch {
              // Failed to get user profile, keep token
            }
            return true;
          }
        } catch {
          // Token refresh failed
        }

        clearAuthCookies();
        set({ user: null, accessToken: null, refreshToken: null });
        return false;
      },

      loadSession: async () => {
        const { accessToken, refreshToken } = get();

        if (!accessToken && !refreshToken) {
          clearAuthCookies();
          set({ initialized: true, user: null });
          return;
        }

        if (accessToken) {
          try {
            const user = await userService.getMe(accessToken);
            setAuthCookies(accessToken, refreshToken);
            set({ initialized: true, user });
            return;
          } catch (err: any) {
            // Token might be expired, try refreshing
            console.warn('Session verification failed, attempting token refresh...');
          }
        }

        // Try refreshing if access token was invalid/expired but refresh token is available
        if (refreshToken) {
          try {
            const res = await authService.refreshTokens({ refreshToken });
            const newAccessToken = res?.accessToken || (res as any)?.tokens?.accessToken;
            const newRefreshToken =
              res?.refreshToken || (res as any)?.tokens?.refreshToken || refreshToken;

            if (newAccessToken) {
              setAuthCookies(newAccessToken, newRefreshToken);
              set({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              });

              try {
                const user = await userService.getMe(newAccessToken);
                set({ initialized: true, user });
                return;
              } catch {
                // If user fetch fails after refresh
              }
            }
          } catch {
            // Refresh failed
          }
        }

        // Clean up invalid session
        clearAuthCookies();
        set({
          initialized: true,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
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

          setAuthCookies(accessToken ?? null, refreshToken ?? null);
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

          setAuthCookies(accessToken ?? null, refreshToken ?? null);
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
          // ignore logout network errors
        } finally {
          clearAuthCookies();
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

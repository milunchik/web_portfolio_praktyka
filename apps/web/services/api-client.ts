import { ApiError, RequestOptions } from '../types/api.types';
import { clearAuthCookies, getAuthCookie, setAuthCookies } from '../utils/auth-cookie';

export class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.accessToken) {
            return parsed.state.accessToken;
          }
        }
      } catch {
        // ignore parse error
      }
      const cookieToken = getAuthCookie('auth_token');
      if (cookieToken) return cookieToken;
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.refreshToken) {
            return parsed.state.refreshToken;
          }
        }
      } catch {
        // ignore parse error
      }
      const cookieRefreshToken = getAuthCookie('refresh_token');
      if (cookieRefreshToken) return cookieRefreshToken;
    }
    return null;
  }

  /**
   * Refreshes the access token using the stored refresh token.
   * Queues concurrent refresh requests to avoid duplicate API calls.
   */
  async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.handleAuthFailure();
        return null;
      }

      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          this.handleAuthFailure();
          return null;
        }

        const data = await response.json();
        const newAccessToken = data?.accessToken || data?.tokens?.accessToken;
        const newRefreshToken =
          data?.refreshToken || data?.tokens?.refreshToken || refreshToken;

        if (!newAccessToken) {
          this.handleAuthFailure();
          return null;
        }

        // Sync with browser storage, cookies, and Zustand store
        if (typeof window !== 'undefined') {
          setAuthCookies(newAccessToken, newRefreshToken);
          try {
            const stored = localStorage.getItem('auth-storage');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.state) {
                parsed.state.accessToken = newAccessToken;
                parsed.state.refreshToken = newRefreshToken;
                localStorage.setItem('auth-storage', JSON.stringify(parsed));
              }
            }
          } catch {
            // ignore storage errors
          }

          try {
            const { useAuthStore } = await import('../store/use-auth-store');
            useAuthStore.getState().setTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          } catch {
            // ignore dynamic import errors
          }
        }

        return newAccessToken;
      } catch (err) {
        console.error('Failed to refresh authentication token:', err);
        this.handleAuthFailure();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private handleAuthFailure(): void {
    if (typeof window !== 'undefined') {
      clearAuthCookies();
      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.state) {
            parsed.state.accessToken = null;
            parsed.state.refreshToken = null;
            parsed.state.user = null;
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
          }
        }
      } catch {
        // ignore
      }

      try {
        import('../store/use-auth-store').then(({ useAuthStore }) => {
          useAuthStore.getState().setUser(null);
          useAuthStore.getState().setTokens({
            accessToken: null,
            refreshToken: null,
          });
        });
      } catch {
        // ignore
      }
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { token, params, headers, _retry, ...customConfig } = options;
    const url = this.buildUrl(path, params);

    const authToken = token ?? this.getAuthToken();

    const mergedHeaders: Record<string, string> = {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...((headers as Record<string, string>) || {}),
    };

    const isFormData = customConfig.body instanceof FormData;
    if (!isFormData && !mergedHeaders['Content-Type']) {
      mergedHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...customConfig,
      headers: mergedHeaders,
    });

    const isAuthEndpoint =
      path.includes('/auth/signin') ||
      path.includes('/auth/signup') ||
      path.includes('/auth/refresh');

    // Automatic Token Refresh on 401 Unauthorized
    if (response.status === 401 && !_retry && !isAuthEndpoint) {
      const newAccessToken = await this.refreshAccessToken();
      if (newAccessToken) {
        return this.request<T>(path, {
          ...options,
          token: newAccessToken,
          _retry: true,
        });
      }
    }

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error: ApiError = {
        statusCode: response.status,
        message: errorData.message || 'An unexpected error occurred',
        error: errorData.error,
      };

      throw error;
    }

    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return (await response.json()) as T;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async delete<T = void>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  async upload<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }

  async getBlob(path: string, options?: RequestOptions): Promise<Blob> {
    const { token, params, headers, _retry, ...customConfig } = options ?? {};
    const url = this.buildUrl(path, params);
    const authToken = token ?? this.getAuthToken();

    const mergedHeaders: Record<string, string> = {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...((headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, {
      ...customConfig,
      method: 'GET',
      headers: mergedHeaders,
    });

    if (response.status === 401 && !_retry) {
      const newAccessToken = await this.refreshAccessToken();
      if (newAccessToken) {
        return this.getBlob(path, {
          ...options,
          token: newAccessToken,
          _retry: true,
        });
      }
    }

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();

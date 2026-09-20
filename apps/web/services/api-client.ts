import { ApiError, RequestOptions } from '../types/api.types';

export class ApiClient {
  private baseUrl: string;

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
    }
    return null;
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
    const { token, params, headers, ...customConfig } = options;
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
    const { token, params, headers, ...customConfig } = options ?? {};
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

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();

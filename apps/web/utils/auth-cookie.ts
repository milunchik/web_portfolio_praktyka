export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Sets auth cookies in the browser environment.
 * Uses SameSite=Lax and path=/ so Next.js middleware and API routes can read them.
 */
export function setAuthCookies(accessToken: string | null, refreshToken?: string | null): void {
  if (typeof document === 'undefined') return;

  if (accessToken) {
    // 7 days expiration for access token cookie
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }

  if (refreshToken !== undefined) {
    if (refreshToken) {
      // 30 days expiration for refresh token cookie
      const maxAge = 30 * 24 * 60 * 60;
      document.cookie = `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refreshToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } else {
      document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  }
}

/**
 * Clears all authentication cookies.
 */
export function clearAuthCookies(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

/**
 * Reads an auth cookie value from document.cookie.
 */
export function getAuthCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match && match[3] ? decodeURIComponent(match[3]) : null;
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from './utils/auth-cookie';

// Routes that strictly require user authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/cv',
  '/onboarding',
];

// Guest-only routes (accessible only when not logged in)
const AUTH_ROUTES = [
  '/signin',
  '/signup',
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Unauthenticated user trying to access a protected route
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/signin', request.url);
    if (pathname !== '/dashboard') {
      signInUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(signInUrl);
  }

  // Authenticated user trying to access signin/signup/login/register
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets with extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico, .pdf)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)',
  ],
};

'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/use-auth-store';
import { Logo } from './Logo';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/cv',
  '/onboarding',
];

const AUTH_ROUTES = [
  '/signin',
  '/signup',
  '/login',
  '/register',
];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { initialized, user, accessToken, refreshToken, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  const isAuthenticated = Boolean(user || accessToken || refreshToken);

  useEffect(() => {
    if (!initialized) return;

    if (isProtectedRoute && !isAuthenticated) {
      const redirectUrl =
        pathname && pathname !== '/dashboard'
          ? `/signin?from=${encodeURIComponent(pathname)}`
          : '/signin';
      router.replace(redirectUrl);
    } else if (isAuthRoute && isAuthenticated) {
      const fromParam = searchParams?.get('from');
      const target = fromParam ? decodeURIComponent(fromParam) : '/dashboard';
      router.replace(target);
    }
  }, [initialized, isProtectedRoute, isAuthRoute, isAuthenticated, pathname, router, searchParams]);

  // If on a protected route and still initializing, show a loading placeholder
  if (isProtectedRoute && !initialized) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Loading session...</span>
          </div>
        </div>
      </div>
    );
  }

  // If on a protected route and not authenticated after initialization, show loader while redirecting
  if (isProtectedRoute && initialized && !isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Redirecting to sign in...</span>
          </div>
        </div>
      </div>
    );
  }

  // If on an auth route and already authenticated, show loader while redirecting to dashboard
  if (isAuthRoute && initialized && isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <AuthGuard>{children}</AuthGuard>
    </React.Suspense>
  );
};

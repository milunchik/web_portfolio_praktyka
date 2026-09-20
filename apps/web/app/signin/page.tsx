'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Sparkles, Code2, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/use-auth-store';

export default function SignInPage() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim()) {
      setFormError('Please enter your email address');
      return;
    }
    if (!password) {
      setFormError('Please enter your password');
      return;
    }

    const success = await login(email.trim(), password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Column: Hero & Visual Showcase */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-100 via-emerald-50/30 to-slate-200/60 p-12 lg:flex xl:p-16 border-r border-slate-200/70">
        {/* Subtle Background Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-300/15 blur-3xl" />

        {/* Top Header / Logo */}
        <div className="relative z-10">
          <Logo size="md" />
        </div>

        {/* Middle Main Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-8 py-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.15]">
              Your code. <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Your story.
              </span>{' '}
              <br />
              In one place.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-md pt-2">
              Create a stunning developer portfolio, showcase your work, and open new opportunities.
            </p>
          </div>

          {/* Floating UI Elements / Cards Showcase */}
          <div className="relative pt-4">
            <div className="relative h-44 w-full">
              {/* Floating Card 1: Better Developers */}
              <div className="absolute top-0 right-4 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg shadow-slate-200/50 backdrop-blur-md transition-transform hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Better Developers</p>
                  <p className="text-[11px] text-slate-500">Brighter Futures</p>
                </div>
              </div>

              {/* Floating Card 2: Ideas to Impact */}
              <div className="absolute top-16 left-6 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg shadow-slate-200/50 backdrop-blur-md transition-transform hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Ideas to Impact</p>
                  <p className="text-[11px] text-emerald-600 font-medium">Showcase & Grow</p>
                </div>
              </div>

              {/* Floating Badge 3: Build Learn Grow */}
              <div className="absolute bottom-0 left-28 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Build
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  Learn
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  Grow
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info link */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
          <span>Explore features and templates</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-slate-100/80">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>
            <div className="space-y-1 pt-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back
              </h2>
              <p className="text-sm text-slate-500">
                Sign in to your account
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {(formError || error) && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError(null);
                if (error) clearError();
              }}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError(null);
                  if (error) clearError();
                }}
                leftIcon={<Lock className="h-4 w-4" />}
                autoComplete="current-password"
                required
              />
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={loading}
              className="mt-2 font-semibold shadow-emerald-600/20"
            >
              Sign in
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

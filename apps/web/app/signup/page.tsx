'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Sparkles, Code2, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PasswordRequirements, isPasswordStrong } from '../../components/PasswordRequirements';
import { useAuthStore } from '../../store/use-auth-store';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, loading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!fullName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setFormError('Please enter your email address');
      return;
    }
    if (!password) {
      setFormError('Please enter a password');
      return;
    }
    if (!isPasswordStrong(password)) {
      setFormError('Please ensure your password meets all requirements below');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const success = await signup({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      publicUrl: fullName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    });

    if (success) {
      router.push('/onboarding');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Column: Hero & Value Props */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-100 via-emerald-50/30 to-slate-200/60 p-12 lg:flex xl:p-16 border-r border-slate-200/70">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-300/15 blur-3xl" />

        {/* Top Header / Logo */}
        <div className="relative z-10">
          <Logo size="md" />
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-auto max-w-lg space-y-8 py-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl xl:text-5xl leading-[1.15]">
              Start your developer <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                journey with Devfolio
              </span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-md pt-1">
              Create your portfolio, showcase your work, and connect with opportunities.
            </p>
          </div>

          {/* 3 Key Feature Items */}
          <div className="space-y-5 pt-2">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-900">Showcase your skills</h3>
                <p className="text-xs text-slate-500">Build a beautiful portfolio</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100/70 text-teal-600 font-mono font-bold">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-900">Share your projects</h3>
                <p className="text-xs text-slate-500">Let your work speak for you</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100/70 text-cyan-600">
                <Rocket className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-900">Grow your opportunities</h3>
                <p className="text-xs text-slate-500">Get discovered by top companies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="relative z-10 space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Devfolio Platform
          </p>
          <p className="text-sm font-medium text-slate-700">
            Your code. Your story. In one place.
          </p>
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-slate-100/80">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="lg:hidden pb-2">
              <Logo size="sm" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create your account
            </h2>
            <p className="text-sm text-slate-500">
              Start building your professional portfolio
            </p>
          </div>

          {/* Error Alert */}
          {(formError || error) && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (formError) setFormError(null);
                if (error) clearError();
              }}
              leftIcon={<User className="h-4 w-4" />}
              autoComplete="name"
              required
            />

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

            <div className="space-y-2">
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
                autoComplete="new-password"
                required
              />

              {/* Dynamic Password Requirements Checklist */}
              <PasswordRequirements password={password} />
            </div>

            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formError) setFormError(null);
                if (error) clearError();
              }}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
              error={
                confirmPassword && password !== confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
              required
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={loading}
              className="mt-2 font-semibold shadow-emerald-600/20"
            >
              Create account
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-1">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

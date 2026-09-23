'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/use-auth-store';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams?.get('from');

  const {
    login,
    loading,
    error,
    clearError,
  } = useAuthStore();

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
      const destination = fromParam ? decodeURIComponent(fromParam) : '/dashboard';
      router.push(destination);
    }
  };

  return (
      <main className="flex min-h-screen w-full overflow-hidden bg-white">
        {/* =====================================================
          LEFT SIDE
          Full 50% of desktop screen
      ====================================================== */}
        <section
            className="
          relative
          hidden
          min-h-screen
          w-1/2
          overflow-hidden
          border-r
          border-slate-200/70
          bg-gradient-to-br
          from-[#f7fafc]
          via-[#f3f8f8]
          to-[#eef5f7]
          lg:flex
          lg:flex-col
        "
        >
          {/* Background lighting */}
          <div
              className="
            pointer-events-none
            absolute
            -left-40
            -top-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-emerald-100/50
            blur-[100px]
          "
          />

          <div
              className="
            pointer-events-none
            absolute
            -bottom-40
            -right-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-cyan-100/40
            blur-[110px]
          "
          />

          {/* Soft light from the left, like reference */}
          <div
              className="
            pointer-events-none
            absolute
            left-0
            top-[140px]
            h-[420px]
            w-[120px]
            bg-white/50
            blur-2xl
          "
          />

          {/* Logo */}
          <div
              className="
            relative
            z-20
            px-12
            pt-10
            xl:px-16
            xl:pt-12
            2xl:px-20
          "
          >
            <Logo size="md" />
          </div>

          {/* Main heading */}
          <div
              className="
            relative
            z-20
            mt-[90px]
            px-12
            xl:px-16
            2xl:mt-[110px]
            2xl:px-20
          "
          >
            <h1
                className="
              max-w-[500px]
              text-[44px]
              font-extrabold
              leading-[1.16]
              tracking-[-0.035em]
              text-slate-950
              xl:text-[48px]
              2xl:text-[52px]
            "
            >
            </h1>
            <p
                className="
              mt-6
              max-w-[440px]
              text-[17px]
              leading-[1.7]
              text-slate-500
              xl:text-[18px]
            "
            >
              Create a stunning developer portfolio,
              <br className="hidden xl:block" />
              showcase your work, and open new
              <br className="hidden xl:block" />
              opportunities.
            </p>
          </div>

          {/* Main bottom illustration */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex justify-end overflow-hidden">
            <img
                src="/table.png"
                alt="Developer workspace"
                className="
                w-[78%]
                max-w-[720px]
                translate-x-[-20%]
                translate-y-[5%]
                object-contain
                object-bottom
                xl:w-[82%]
                2xl:max-w-[780px]
              "
            />
          </div>
        </section>

        {/* =====================================================
          RIGHT SIDE
          Full 50% of desktop screen
      ====================================================== */}
        <section
            className="
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          bg-[#fbfdff]
          px-6
          py-10
          sm:px-10
          lg:w-1/2
          lg:px-12
          xl:px-16
        "
        >
          {/* Login Card */}
          <div
              className="
            w-full
            max-w-[520px]
            rounded-[24px]
            border
            border-slate-100
            bg-white
            px-8
            py-10
            shadow-[0_20px_70px_rgba(15,23,42,0.06)]
            sm:px-10
            sm:py-12
            xl:px-12
            xl:py-14
          "
          >
            {/* Logo */}
            <div className="flex justify-center">
              <Logo size="md" />
            </div>

            {/* Header */}
            <div className="mt-12 text-center">
              <h1
                  className="
                text-[30px]
                font-bold
                tracking-[-0.025em]
                text-slate-950
                sm:text-[32px]
              "
              >
                Welcome back
              </h1>

              <p className="mt-2 text-[16px] text-slate-500">
                Sign in to your account
              </p>
            </div>

            {/* Error */}
            {(formError || error) && (
                <div
                    className="
                mt-8
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-rose-200
                bg-rose-50
                p-3.5
                text-sm
                text-rose-700
              "
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>
                {formError || error}
              </span>
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
            >
              {/* Email */}
              <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (formError) {
                      setFormError(null);
                    }

                    if (error) {
                      clearError();
                    }
                  }}
                  leftIcon={
                    <Mail className="h-5 w-5" />
                  }
                  autoComplete="email"
                  required
              />

              {/* Password */}
              <div>
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (formError) {
                        setFormError(null);
                      }

                      if (error) {
                        clearError();
                      }
                    }}
                    leftIcon={
                      <Lock className="h-5 w-5" />
                    }
                    autoComplete="current-password"
                    required
                />

                {/* Forgot password */}
                <div className="mt-3 flex justify-end">
                  <Link
                      href="/forgot-password"
                      className="
                    text-sm
                    font-semibold
                    text-emerald-600
                    transition-colors
                    hover:text-emerald-700
                    hover:underline
                  "
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Sign In */}
              <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                  className="
                !mt-9
                h-14
                text-base
                font-semibold
                shadow-lg
                shadow-emerald-600/10
              "
              >
                Sign in
              </Button>
            </form>

            {/* Bottom divider */}
            <div className="my-7 flex items-center">
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Sign Up */}
            <div className="text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{' '}

                <Link
                    href="/signup"
                    className="
                  font-semibold
                  text-emerald-600
                  transition-colors
                  hover:text-emerald-700
                  hover:underline
                "
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

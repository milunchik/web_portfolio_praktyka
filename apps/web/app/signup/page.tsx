'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Sparkles,
  Code2,
  Rocket,
  AlertCircle,
} from 'lucide-react';

import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import {
  PasswordRequirements,
  isPasswordStrong,
} from '../../components/PasswordRequirements';
import { useAuthStore } from '../../store';

export default function SignUpPage() {
  const router = useRouter();

  const {
    signup,
    loading,
    error,
    clearError,
  } = useAuthStore();

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
      setFormError(
          'Please ensure your password meets all requirements below',
      );
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
      <main className="flex min-h-screen w-full bg-slate-50">
        {/* =====================================================
          LEFT SIDE
          50% desktop width
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
          from-slate-100
          via-emerald-50/30
          to-slate-200/60
          px-12
          py-10
          lg:flex
          lg:flex-col
          xl:px-16
          xl:py-12
        "
        >
          {/* Decorative background */}
          <div
              className="
            pointer-events-none
            absolute
            -left-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-emerald-300/15
            blur-3xl
          "
          />

          <div
              className="
            pointer-events-none
            absolute
            -bottom-32
            -right-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-teal-300/15
            blur-3xl
          "
          />

          {/* Logo */}
          <div className="relative z-10">
            <Logo size="md" />
          </div>

          {/* Main content */}
          <div className="relative z-10 mt-[72px]">
            {/* Heading */}
            <div>
              <h1
                  className="
                max-w-[440px]
                text-[32px]
                font-extrabold
                leading-[1.2]
                tracking-[-0.025em]
                text-slate-950
              "
              >
                Start your developer
                <br />
                journey with Devfolio
              </h1>

              <p
                  className="
                mt-4
                max-w-[410px]
                text-[17px]
                leading-6
                text-slate-500
              "
              >
                Create your portfolio, showcase your work,
                <br />
                and connect with opportunities.
              </p>
            </div>

            {/* Features */}
            <div className="mt-10 space-y-7">
              {/* Feature 1 */}
              <div className="flex items-center gap-5">
                <div
                    className="
                  flex
                  h-[58px]
                  w-[58px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100/70
                  text-emerald-600
                "
                >
                  <Sparkles className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-[16px] font-semibold text-slate-950">
                    Showcase your skills
                  </h3>

                  <p className="mt-1 text-[14px] text-slate-500">
                    Build a beautiful portfolio
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-5">
                <div
                    className="
                  flex
                  h-[58px]
                  w-[58px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100/70
                  text-emerald-600
                "
                >
                  <Code2 className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-[16px] font-semibold text-slate-950">
                    Share your projects
                  </h3>

                  <p className="mt-1 text-[14px] text-slate-500">
                    Let your work speak for you
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-5">
                <div
                    className="
                  flex
                  h-[58px]
                  w-[58px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100/70
                  text-emerald-600
                "
                >
                  <Rocket className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-[16px] font-semibold text-slate-950">
                    Grow your opportunities
                  </h3>

                  <p className="mt-1 text-[14px] text-slate-500">
                    Get discovered by top companies
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br/>
          {/* Bottom illustration */}
          <div className="relative z-10 mt-auto min-h-[300px]">
            {/* Optional text on the left */}
            {/* Image */}
            <img
                src="/windows.png"
                alt="Developer workspace"
                className="
              absolute
              -bottom-10
              right-[-20px]
              w-[390px]
              max-w-none
              object-contain
              xl:w-[440px]
            "
            />
          </div>
        </section>

        {/* =====================================================
          RIGHT SIDE
          50% desktop width
      ====================================================== */}
        <section
            className="
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          bg-white
          px-6
          py-10
          sm:px-10
          lg:w-1/2
          lg:px-12
          xl:px-16
        "
        >
          <div className="w-full max-w-[530px]">
            {/* Mobile logo */}
            <div className="mb-10 lg:hidden">
              <Logo size="md" />
            </div>

            {/* Header */}
            <div className="mb-9 text-center">
              <h2
                  className="
                text-[30px]
                font-bold
                tracking-[-0.025em]
                text-slate-950
                sm:text-[32px]
              "
              >
                Create your account
              </h2>

              <p className="mt-2 text-[16px] text-slate-500">
                Start building your professional portfolio
              </p>
            </div>

            {/* Error */}
            {(formError || error) && (
                <div
                    className="
                mb-5
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
                className="space-y-5"
            >
              {/* Full name */}
              <Input
                  label="Full name"
                  type="text"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);

                    if (formError) {
                      setFormError(null);
                    }

                    if (error) {
                      clearError();
                    }
                  }}
                  leftIcon={
                    <User className="h-5 w-5" />
                  }
                  autoComplete="name"
                  required
              />

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
              <div className="space-y-2">
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
                    autoComplete="new-password"
                    required
                />

                <PasswordRequirements
                    password={password}
                />
              </div>

              {/* Confirm password */}
              <Input
                  label="Confirm password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);

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
                  autoComplete="new-password"
                  error={
                    confirmPassword &&
                    password !== confirmPassword
                        ? 'Passwords do not match'
                        : undefined
                  }
                  required
              />

              {/* Submit */}
              <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                  className="
                !mt-7
                h-14
                font-semibold
                shadow-lg
                shadow-emerald-600/10
              "
              >
                Create account
              </Button>
            </form>

            {/* Sign in */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                    href="/signin"
                    className="
                  font-semibold
                  text-emerald-600
                  transition-colors
                  hover:text-emerald-700
                  hover:underline
                "
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
  );
}
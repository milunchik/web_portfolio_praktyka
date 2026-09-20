'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Image as ImageIcon,
  ArrowUpRight,
  Sparkles,
  Download,
  Eye,
  CheckCircle2,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { AppSidebar } from '../../components/AppSidebar';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/use-auth-store';
import { useUserStore } from '../../store/use-user-store';
import { useEducationStore } from '../../store/use-education-store';
import { useExperienceStore } from '../../store/use-experience-store';
import { useLanguageStore } from '../../store/use-language-store';
import { useProjectStore } from '../../store/use-project-store';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { profile, fetchProfile, downloadCvMe } = useUserStore();
  const { educations, fetchMyEducations } = useEducationStore();
  const { experiences, fetchMyExperiences } = useExperienceStore();
  const { languages, fetchMyLanguages } = useLanguageStore();
  const { projects, fetchMyProjects } = useProjectStore();

  useEffect(() => {
    fetchProfile();
    fetchMyEducations();
    fetchMyExperiences();
    fetchMyLanguages();
    fetchMyProjects();
  }, [
    fetchProfile,
    fetchMyEducations,
    fetchMyExperiences,
    fetchMyLanguages,
    fetchMyProjects,
  ]);

  const displayName = profile?.fullName || user?.fullName || 'Developer';
  const publicSlug = profile?.publicUrl || user?.publicUrl || 'jane-doe';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 text-white shadow-lg shadow-emerald-900/10">
              <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Portfolio is Live</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Welcome back, {displayName}!
                  </h1>
                  <p className="max-w-xl text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Your developer portfolio and generated CV are updated and ready to share with employers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/user/${publicSlug}`} target="_blank">
                    <Button
                      variant="secondary"
                      size="md"
                      leftIcon={<Eye className="h-4 w-4" />}
                    >
                      View Public Portfolio
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => downloadCvMe()}
                  >
                    Download CV
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Education</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{educations.length}</p>
                <Link
                  href="/profile?tab=education"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:underline"
                >
                  Manage education →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Experience</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{experiences.length}</p>
                <Link
                  href="/profile?tab=experience"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:underline"
                >
                  Manage experience →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Projects</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <FolderGit2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{projects.length}</p>
                <Link
                  href="/profile?tab=projects"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:underline"
                >
                  Manage projects →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Languages</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{languages.length}</p>
                <Link
                  href="/profile?tab=languages"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:underline"
                >
                  Manage languages →
                </Link>
              </div>
            </div>

            {/* Quick Actions & Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Portfolio Completeness</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Profile Status</span>
                    <span className="text-emerald-600 font-bold">100% Ready</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>
                <div className="space-y-2 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Basic profile details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Work experience and tech stack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Education and qualifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Portfolio projects and CV generation</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Your Public Portfolio Link</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Share this link with recruiters, employers, or on social media. It includes your bio, projects, experience, education, and generated CV.
                </p>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-800">
                  <span className="text-slate-400">/user/</span>
                  <span className="font-semibold text-emerald-700">{publicSlug}</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <Link href={`/user/${publicSlug}`} target="_blank">
                    <Button size="sm" variant="primary" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                      Open Public Page
                    </Button>
                  </Link>
                  <Link href="/profile?tab=general">
                    <Button size="sm" variant="outline">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  MapPin,
  Download,
  Mail,
  Sparkles,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Code2,
  Calendar,
  Languages as LanguagesIcon,
  Layers,
  ArrowRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { PublicHeader } from '../../../components/PublicHeader';
import { PublicFooter } from '../../../components/PublicFooter';
import { Button } from '../../../components/Button';
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  DribbbleIcon,
} from '../../../components/SocialIcons';
import { userService } from '../../../services/user.service';
import type {
  SafeUser,
  Experience,
  Education,
  Project,
  CvDisplayOptions,
} from '@repo/contracts';

const formatLanguageLevel = (level: string) => {
  return level
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getLevelPercentage = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'elementary':
      return '20%';
    case 'pre_intermediate':
      return '40%';
    case 'intermediate':
      return '60%';
    case 'upper_intermediate':
      return '80%';
    case 'advanced':
      return '100%';
    default:
      return '60%';
  }
};

const formatDateRange = (start: string | Date, end: string | Date | null | undefined) => {
  const formatSingle = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const startFormatted = formatSingle(start);
  const endFormatted = end ? formatSingle(end) : 'Present';
  return `${startFormatted} \u2014 ${endFormatted}`;
};

export default function PublicPortfolioPage() {
  const params = useParams();
  const publicUrl = params?.publicUrl as string;

  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!publicUrl) return;
    const loadUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.getByPublicUrl(publicUrl);
        setUser(data);
      } catch (err) {
        console.error('Failed to load portfolio', err);
        setError('Portfolio not found or unavailable');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [publicUrl]);

  const handleDownloadCv = async () => {
    if (!publicUrl) return;
    setDownloading(true);
    try {
      const blob = await userService.getCvBlobByPublicUrl(
        publicUrl,
        user?.cvOptions || undefined,
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user?.fullName || 'Developer'}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download CV', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="mt-4 text-xs font-semibold text-slate-500">
          Loading developer portfolio...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-slate-50">
        <PublicHeader />
        <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-xs">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Portfolio Not Found
          </h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            We couldn&apos;t find a portfolio at &quot;{publicUrl}&quot;. The user might have changed their link or the page does not exist.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/">
              <Button variant="outline" size="sm">
                Go to Homepage
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Create Your Own
              </Button>
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const cvOpts = (user.cvOptions as CvDisplayOptions | null) || {};
  const showPhoto = cvOpts.showPhoto !== false;
  const showContact = cvOpts.showContact !== false;
  const showAbout = cvOpts.showAbout !== false;
  const showSkills = cvOpts.showSkills !== false;
  const showProjects = cvOpts.showProjects !== false;
  const showExperience = cvOpts.showExperience !== false;
  const showEducation = cvOpts.showEducation !== false;
  const showLanguages = cvOpts.showLanguages !== false;

  const displayName = user.fullName || 'Jane Doe';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarPhotoUrl =
    user.avatarUrl ||
    user.fileUrl ||
    (user.fileName?.startsWith('http') ? user.fileName : null) ||
    (user as any).medias?.[0]?.url ||
    null;

  const experiences = (user.experience || []) as Experience[];
  const educations = (user.education || []) as Education[];
  const projects = (user.projects || []) as Project[];
  const rawLanguages = (user.languages || []) as any[];

  // Collect tech stack from experience
  const uniqueSkills = Array.from(
    new Set(experiences.flatMap((exp) => exp.skills || []))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <PublicHeader
        onDownloadCv={handleDownloadCv}
        isDownloadingCv={downloading}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8 space-y-12">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
          {/* Subtle accent glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            {showPhoto && (
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-4xl font-black text-white shadow-md">
                {avatarPhotoUrl ? (
                  <img
                    src={avatarPhotoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
            )}

            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for new opportunities</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  {displayName}
                </h1>
                <p className="text-base font-semibold text-emerald-700">
                  Software Engineer / Full-stack Developer
                </p>
              </div>

              {showAbout && user.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {user.description}
                </p>
              )}

              {/* Action Buttons & Contact Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  isLoading={downloading}
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={handleDownloadCv}
                >
                  Download CV
                </Button>

                {showContact && user.email && (
                  <a href={`mailto:${user.email}`}>
                    <Button
                      variant="outline"
                      size="md"
                      leftIcon={<Mail className="h-4 w-4 text-slate-500" />}
                    >
                      Contact me
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT ME SECTION */}
        {showAbout && user.description && (
          <section id="about" className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <span>About me</span>
              </h2>
              <p className="text-xs text-slate-500">
                A brief overview of my engineering focus and background.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {user.description}
              </p>
            </div>
          </section>
        )}

        {/* 3. TECH STACK / SKILLS SECTION */}
        {showSkills && uniqueSkills.length > 0 && (
          <section id="skills" className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-emerald-600" />
                <span>Tech stack</span>
              </h2>
              <p className="text-xs text-slate-500">
                Technologies and tools I work with
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap gap-2">
                {uniqueSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-mono font-medium text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. PROJECTS SECTION */}
        {showProjects && projects.length > 0 && (
          <section id="projects" className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-emerald-600" />
                <span>Featured projects</span>
              </h2>
              <p className="text-xs text-slate-500">
                Software solutions and applications I have built
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">
                        {proj.title}
                      </h3>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Code2 className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px]">Devfolio Project</span>
                    <span className="font-semibold text-emerald-600">Production Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. EXPERIENCE SECTION */}
        {showExperience && experiences.length > 0 && (
          <section id="experience" className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                <span>Work experience</span>
              </h2>
              <p className="text-xs text-slate-500">
                My professional software engineering history
              </p>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {exp.position}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700">
                        {exp.company}
                      </p>
                    </div>
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] font-medium text-slate-600 w-fit">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {exp.skills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 font-mono text-[11px] text-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. EDUCATION SECTION */}
        {showEducation && educations.length > 0 && (
          <section id="education" className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                <span>Education</span>
              </h2>
              <p className="text-xs text-slate-500">
                Academic degrees and formal qualifications
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 capitalize">
                      {edu.degree} Degree
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 pt-1">
                    {edu.title}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. LANGUAGES SECTION */}
        {showLanguages && rawLanguages.length > 0 && (
          <section id="languages" className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <LanguagesIcon className="h-5 w-5 text-emerald-600" />
                <span>Languages</span>
              </h2>
              <p className="text-xs text-slate-500">
                Language proficiency and communication skills
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              {rawLanguages.map((item) => {
                const lang = item.language || item;
                const name = lang.name || 'Language';
                const level = lang.level || 'intermediate';
                const percent = getLevelPercentage(level);

                return (
                  <div key={item.id || name} className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="font-bold text-slate-800">{name}</span>
                      <span className="text-slate-500 capitalize">
                        {formatLanguageLevel(level)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: percent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 8. CONTACT / CTA SECTION */}
        {showContact && (
          <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-xl text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Let&apos;s build something great together
            </h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-300 leading-relaxed">
              I am always interested in discussing new opportunities, full-stack projects, and engineering challenges.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {user.email && (
                <a href={`mailto:${user.email}`}>
                  <Button variant="primary" size="lg" leftIcon={<Mail className="h-4 w-4" />}>
                    Send an email
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleDownloadCv}
                isLoading={downloading}
              >
                Get CV (PDF)
              </Button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}

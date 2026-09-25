'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  Loader2,
  Code2,
  Languages as LanguagesIcon,
  ArrowRight,
  AlertCircle,
  Globe,
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
import { analyticsService } from '../../../services/analytics.service';
import { useAuthStore } from '../../../store/use-auth-store';
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
      return '25%';
    case 'pre_intermediate':
      return '45%';
    case 'intermediate':
      return '65%';
    case 'upper_intermediate':
      return '85%';
    case 'advanced':
      return '100%';
    default:
      return '60%';
  }
};

const formatTimelineDate = (start: string | Date, end: string | Date | null | undefined) => {
  const formatSingle = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.getFullYear().toString();
  };
  const startY = formatSingle(start);
  const endY = end ? formatSingle(end) : 'Present';
  if (startY === endY && endY !== 'Present') {
    return startY;
  }
  return `${startY} – ${endY}`;
};

const parseDateVal = (val: string | Date | null | undefined, isEnd = false): number => {
  if (!val) return isEnd ? Infinity : 0;
  if (val instanceof Date) return val.getTime();
  const str = String(val).trim();
  if (!str || str.toLowerCase() === 'present') return Infinity;
  const parsed = new Date(str).getTime();
  if (!isNaN(parsed)) return parsed;
  const num = parseInt(str, 10);
  if (!isNaN(num)) return new Date(num, 0, 1).getTime();
  return 0;
};

const sortTimelineDesc = <T extends { startDate?: string | Date | null; endDate?: string | Date | null }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const aEnd = parseDateVal(a.endDate, true);
    const bEnd = parseDateVal(b.endDate, true);
    if (aEnd !== bEnd) {
      return bEnd - aEnd;
    }
    const aStart = parseDateVal(a.startDate, false);
    const bStart = parseDateVal(b.startDate, false);
    return bStart - aStart;
  });
};

const getProjectImage = (proj: any): string | null => {
  return (
    proj?.imageUrl ||
    proj?.image ||
    proj?.previewUrl ||
    proj?.fileUrl ||
    (typeof proj?.fileName === 'string' && proj.fileName.startsWith('http')
      ? proj.fileName
      : null) ||
    proj?.medias?.[0]?.url ||
    proj?.media?.url ||
    null
  );
};

export default function PublicPortfolioPage() {
  const params = useParams();
  const publicUrl = params?.publicUrl as string;
  const currentUser = useAuthStore((state) => state.user);

  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const hasTrackedViewRef = useRef(false);

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

  // Track profile_view once public user is loaded
  useEffect(() => {
    if (!user || !publicUrl || hasTrackedViewRef.current) return;

    // Check if the viewer is the owner
    const isOwner =
      currentUser && (currentUser.id === user.id || currentUser.publicUrl === publicUrl);

    if (isOwner) {
      return;
    }

    hasTrackedViewRef.current = true;
    analyticsService.trackEvent({
      publicUrl,
      portfolioOwnerId: user.id,
      eventType: 'profile_view',
    });
  }, [user, publicUrl, currentUser]);

  const isOwner = Boolean(
    currentUser && user && (currentUser.id === user.id || currentUser.publicUrl === publicUrl),
  );

  const trackInteraction = (
    eventType: 'cv_download' | 'contact_click' | 'project_click' | 'social_link_click',
    meta?: { projectId?: number; target?: string },
  ) => {
    if (isOwner || !user || !publicUrl) return;
    analyticsService.trackEvent({
      publicUrl,
      portfolioOwnerId: user.id,
      eventType,
      projectId: meta?.projectId,
      target: meta?.target,
    });
  };

  const handleDownloadCv = async () => {
    if (!publicUrl) return;
    trackInteraction('cv_download');
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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f8fbff]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="mt-4 text-xs font-semibold text-slate-500">
          Loading developer portfolio...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-[#f8fbff]">
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
  const showAbout = cvOpts.showAbout !== false;
  const showSkills = cvOpts.showSkills !== false;
  const showProjects = cvOpts.showProjects !== false;
  const showExperience = cvOpts.showExperience !== false;
  const showEducation = cvOpts.showEducation !== false;
  const showLanguages = cvOpts.showLanguages !== false;

  const displayName = user.fullName || 'Developer';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarPhotoUrl =
    user.avatarUrl ||
    user.fileUrl ||
    (user.fileName?.startsWith('http') ? user.fileName : null) ||
    (user as any).medias?.[0]?.url ||
    null;

  const rawExperiences = (user.experience || []) as Experience[];
  const rawEducations = (user.education || []) as Education[];
  const projects = (user.projects || []) as Project[];
  const rawLanguages = (user.languages || []) as any[];

  // Sort experience & education from most recent to earliest
  const experiences = sortTimelineDesc(rawExperiences);
  const educations = sortTimelineDesc(rawEducations);

  // Derive job title from latest experience or fallback
  const latestExperience = experiences[0];
  const jobTitle = latestExperience?.position || 'Software Engineer / Full-stack Developer';

  // Collect tech stack from experience skills or profile
  const uniqueSkills = Array.from(
    new Set(experiences.flatMap((exp) => exp.skills || []))
  );

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <PublicHeader
        onDownloadCv={handleDownloadCv}
        isDownloadingCv={downloading}
      />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 sm:px-6 py-6 space-y-6">
        {/* ================================================== */}
        {/* 1. PROFILE / HERO CARD */}
        {/* ================================================== */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
            {/* LEFT: Large Circular Avatar */}
            {showPhoto && (
              <div className="relative shrink-0">
                <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-4xl font-bold text-white shadow-xs ring-4 ring-slate-50">
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
                {/* Online status indicator dot */}
                <span
                  className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white"
                  title="Available for hire"
                />
              </div>
            )}

            {/* CENTER: Main Profile Details */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-slate-900 leading-tight">
                  {displayName}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-emerald-600 mt-0.5">
                  {jobTitle}
                </p>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500 font-medium">
                {user.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{user.location}</span>
                  </span>
                )}
                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    onClick={() => trackInteraction('contact_click', { target: 'email' })}
                    className="inline-flex items-center gap-1.5 hover:text-emerald-600 transition"
                  >
                    <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{user.email}</span>
                  </a>
                )}
              </div>

              {/* Short Bio */}
              {user.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {user.description}
                </p>
              )}

              {/* Social Links Row */}
              {(user.github || user.linkedin || user.twitter || user.dribbble || user.website) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {user.github && (
                    <a
                      href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('social_link_click', { target: 'github' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <GithubIcon className="h-3.5 w-3.5 text-slate-700" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('social_link_click', { target: 'linkedin' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <LinkedinIcon className="h-3.5 w-3.5 text-slate-700" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {user.twitter && (
                    <a
                      href={user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('social_link_click', { target: 'twitter' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <TwitterIcon className="h-3.5 w-3.5 text-slate-700" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {user.dribbble && (
                    <a
                      href={user.dribbble.startsWith('http') ? user.dribbble : `https://dribbble.com/${user.dribbble}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('social_link_click', { target: 'dribbble' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <DribbbleIcon className="h-3.5 w-3.5 text-slate-700" />
                      <span>Dribbble</span>
                    </a>
                  )}
                  {user.website && (
                    <a
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('social_link_click', { target: 'website' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Globe className="h-3.5 w-3.5 text-slate-700" />
                      <span>{user.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT AREA: Download CV & Status/Quote */}
            <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                isLoading={downloading}
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleDownloadCv}
                className="font-semibold shadow-xs"
              >
                Download CV
              </Button>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs text-slate-700 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-emerald-900">Open for work</p>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Available for freelance, contract, or full-time opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* MAIN TWO-COLUMN LAYOUT */}
        {/* ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,1.1fr)] gap-6 items-start">
          {/* -------------------------------------------------- */}
          {/* LEFT COLUMN: About Me, Tech Stack, Featured Projects */}
          {/* -------------------------------------------------- */}
          <div className="space-y-6">
            {/* 1. ABOUT ME */}
            {showAbout && (
              <section
                id="about"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3 scroll-mt-24"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <User className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    About me
                  </h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {user.about ||
                    user.description ||
                    'Passionate software developer with a focus on building high-performance, accessible, and elegant web applications. Experienced across modern frontend frameworks, backend architecture, and database management.'}
                </p>
              </section>
            )}

            {/* 2. TECH STACK */}
            {showSkills && (
              <section
                id="skills"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 scroll-mt-24"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Tech stack
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {uniqueSkills.length > 0 ? (
                    uniqueSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-100/80 px-3 py-1.5 text-xs sm:text-[13px] font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      No tech stack items listed yet.
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* 3. FEATURED PROJECTS */}
            {showProjects && (
              <section id="projects" className="space-y-4 scroll-mt-24">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <FolderGit2 className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                      Featured projects
                    </h2>
                  </div>
                  {projects.length > 0 && (
                    <a
                      href="#projects"
                      className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                    >
                      <span>View all projects</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((proj) => {
                      const projectImg = getProjectImage(proj);
                      return (
                        <div
                          key={proj.id}
                          onClick={() =>
                            trackInteraction('project_click', {
                              projectId: proj.id,
                              target: proj.title,
                            })
                          }
                          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-xs transition hover:border-emerald-300 hover:shadow-md overflow-hidden cursor-pointer"
                        >
                          <div className="p-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 shrink-0">
                                <Code2 className="h-3.5 w-3.5" />
                              </div>
                              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                {proj.title}
                              </h3>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                              {proj.description}
                            </p>
                          </div>

                          {/* Show picture ONLY if picture of the project exists */}
                          {projectImg && (
                            <div className="relative border-t border-slate-100 overflow-hidden aspect-[16/9] w-full bg-slate-100">
                              <img
                                src={projectImg}
                                alt={proj.title}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-xs text-slate-400">
                    No featured projects added yet.
                  </div>
                )}
              </section>
            )}
          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT COLUMN: Experience Timeline, Education Timeline, Contact CTA */}
          {/* -------------------------------------------------- */}
          <div className="space-y-6">
            {/* 1. EXPERIENCE TIMELINE CARD */}
            {showExperience && (
              <section
                id="experience"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6 scroll-mt-24"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Experience
                  </h2>
                </div>

                {experiences.length > 0 ? (
                  <div className="relative space-y-6 before:absolute before:inset-0 before:left-[84px] sm:before:left-[92px] before:w-px before:bg-slate-200">
                    {experiences.map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        className="relative flex items-start gap-3.5"
                      >
                        {/* Date column on left */}
                        <div className="w-18 sm:w-20 shrink-0 text-right pt-0.5">
                          <span className="text-xs font-semibold text-slate-500 block leading-tight">
                            {formatTimelineDate(exp.startDate, exp.endDate)}
                          </span>
                        </div>

                        {/* Timeline marker point */}
                        <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center mt-0.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                        </div>

                        {/* Experience Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
                            {exp.position}
                          </h3>
                          <p className="text-xs font-semibold text-emerald-600">
                            {exp.company}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No experience records added.</p>
                )}
              </section>
            )}

            {/* 2. EDUCATION TIMELINE CARD */}
            {showEducation && (
              <section
                id="education"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6 scroll-mt-24"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Education
                  </h2>
                </div>

                {educations.length > 0 ? (
                  <div className="relative space-y-6 before:absolute before:inset-0 before:left-[84px] sm:before:left-[92px] before:w-px before:bg-slate-200">
                    {educations.map((edu, idx) => (
                      <div
                        key={edu.id || idx}
                        className="relative flex items-start gap-3.5"
                      >
                        {/* Date column on left */}
                        <div className="w-18 sm:w-20 shrink-0 text-right pt-0.5">
                          <span className="text-xs font-semibold text-slate-500 block leading-tight">
                            {formatTimelineDate(edu.startDate, edu.endDate)}
                          </span>
                        </div>

                        {/* Timeline marker point */}
                        <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center mt-0.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                        </div>

                        {/* Education Content */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
                            {edu.title}
                          </h3>
                          <p className="text-xs font-semibold text-emerald-600 capitalize">
                            {edu.degree} Degree
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No education records added.</p>
                )}
              </section>
            )}

            {/* 3. LANGUAGES (Compact card if present) */}
            {showLanguages && rawLanguages.length > 0 && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <LanguagesIcon className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Languages
                  </h2>
                </div>

                <div className="space-y-3">
                  {rawLanguages.map((item) => {
                    const lang = item.language || item;
                    const name = lang.name || 'Language';
                    const level = lang.level || 'intermediate';
                    const percent = getLevelPercentage(level);

                    return (
                      <div key={item.id || name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="font-bold text-slate-800">{name}</span>
                          <span className="text-slate-500 capitalize">
                            {formatLanguageLevel(level)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
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

            {/* 4. COMPACT CONTACT CTA */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    Let&apos;s build something great together!
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    I&apos;m open to new opportunities and interesting projects.
                  </p>
                </div>
              </div>
              <div className="pt-1">
                {user.email ? (
                  <a
                    href={`mailto:${user.email}`}
                    onClick={() => trackInteraction('contact_click', { target: 'email' })}
                    className="block w-full"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      className="font-semibold shadow-xs"
                      leftIcon={<Mail className="h-4 w-4" />}
                    >
                      Get in touch
                    </Button>
                  </a>
                ) : (
                  <Link href="/signup" className="block w-full">
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      className="font-semibold shadow-xs"
                    >
                      Get in touch
                    </Button>
                  </Link>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}

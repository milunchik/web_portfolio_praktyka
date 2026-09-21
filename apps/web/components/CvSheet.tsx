'use client';

import React from 'react';
import { Mail, Globe, MapPin } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
} from './SocialIcons';
import type { SafeUser, Experience, Education, Project } from '@repo/contracts';

export interface CvDisplayOptionsState {
  showPhoto: boolean;
  showContact: boolean;
  showAbout: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showSkills: boolean;
  showLanguages: boolean;
  showProjects: boolean;
}

interface CvSheetProps {
  user: SafeUser;
  options: CvDisplayOptionsState;
}

const formatDateRange = (start: string | Date, end: string | Date | null | undefined) => {
  const formatSingle = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const startFormatted = formatSingle(start);
  const endFormatted = end ? formatSingle(end) : 'Present';
  return `${startFormatted} — ${endFormatted}`;
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

const formatLanguageLevel = (level: string) => {
  return level
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const CvSheet: React.FC<CvSheetProps> = ({ user, options }) => {
  const rawExperiences = (user.experience || []) as Experience[];
  const rawEducations = (user.education || []) as Education[];
  const projects = (user.projects || []) as Project[];
  const rawLanguages = (user.languages || []) as any[];

  const experiences = sortTimelineDesc(rawExperiences);
  const educations = sortTimelineDesc(rawEducations);

  // Collect unique skills from experience
  const uniqueSkills = Array.from(
    new Set(experiences.flatMap((exp) => exp.skills || []))
  );

  const displayName = user.fullName || 'Jane Doe';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarPhotoUrl =
    user.avatarUrl ||
    user.fileUrl ||
    (user.fileName?.startsWith('http') ? user.fileName : null) ||
    (user as any).medias?.[0]?.url ||
    null;

  const publicPortfolioUrl = user.publicUrl
    ? typeof window !== 'undefined'
      ? `${window.location.origin}/user/${user.publicUrl}`
      : `http://localhost:3000/user/${user.publicUrl}`
    : null;

  return (
    <div
      id="cv-document"
      className="relative mx-auto w-full max-w-[800px] rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-md transition-all text-slate-800 font-sans print:border-none print:shadow-none print:rounded-none print:p-0 print:m-0 print:max-w-none print:w-full print:min-h-0"
      style={{ minHeight: '1050px' }}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6 print:pb-4">
        <div className="space-y-1.5 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 print:text-2xl">
            {displayName}
          </h1>
          <p className="text-sm font-semibold text-emerald-700">
            Software Engineer / Full-stack Developer
          </p>

          {options.showContact && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs text-slate-500">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 print:hidden" />
                  <span>{user.location}</span>
                </span>
              )}
              {user.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400 print:hidden" />
                  <span>{user.email}</span>
                </span>
              )}
              {user.website && (
                <span className="flex items-center gap-1 font-mono">
                  <Globe className="h-3.5 w-3.5 text-slate-400 print:hidden" />
                  <span>{user.website.replace(/^https?:\/\//, '')}</span>
                </span>
              )}
              {user.github && (
                <span className="flex items-center gap-1 font-mono">
                  <GithubIcon className="h-3.5 w-3.5 text-slate-400 print:hidden" />
                  <span>github.com/{user.github.replace(/^https?:\/\/github\.com\//, '')}</span>
                </span>
              )}
              {user.linkedin && (
                <span className="flex items-center gap-1 font-mono">
                  <LinkedinIcon className="h-3.5 w-3.5 text-slate-400 print:hidden" />
                  <span>linkedin.com/in/{user.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                </span>
              )}
              {publicPortfolioUrl && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Globe className="h-3.5 w-3.5 text-slate-400 print:hidden" />
                  <span>{publicPortfolioUrl}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {options.showPhoto && (
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl sm:text-3xl font-bold text-white shadow-xs print:rounded-xl">
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
      </div>

      <div className="space-y-6 pt-6 text-xs print:pt-4 print:space-y-5">
        {/* SUMMARY / ABOUT */}
        {options.showAbout && (user.about || user.description) && (
          <section className="space-y-2 print:break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {user.about || user.description}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {options.showExperience && experiences.length > 0 && (
          <section className="space-y-3 print:break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Work Experience
            </h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{exp.position}</span>
                      <span className="text-emerald-700 font-semibold"> @ {exp.company}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.skills && exp.skills.length > 0 && (
                    <p className="text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-500">Skills: </span>
                      {exp.skills.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {options.showEducation && educations.length > 0 && (
          <section className="space-y-2.5 print:break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Education
            </h2>
            <div className="space-y-2">
              {educations.map((edu) => (
                <div key={edu.id} className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{edu.title}</span>
                    {edu.degree && (
                      <span className="text-slate-500 capitalize"> — {edu.degree} Degree</span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {options.showProjects && projects.length > 0 && (
          <section className="space-y-2.5 print:break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Featured Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {options.showSkills && uniqueSkills.length > 0 && (
          <section className="space-y-1.5 print:break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Technical Skills
            </h2>
            <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
              {uniqueSkills.join('  •  ')}
            </p>
          </section>
        )}

        {/* LANGUAGES */}
        {options.showLanguages && rawLanguages.length > 0 && (
          <section className="space-y-2 print:break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {rawLanguages.map((item) => {
                const lang = item.language || item;
                const name = lang.name || 'Language';
                const level = lang.level || 'intermediate';
                return (
                  <div key={item.id || name} className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-medium text-slate-800">{name}</span>
                    <span className="text-slate-400 capitalize">{formatLanguageLevel(level)}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

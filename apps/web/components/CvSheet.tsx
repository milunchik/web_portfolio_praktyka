'use client';

import React from 'react';
import { Mail, Globe, MapPin, Sparkles } from 'lucide-react';
import type { SafeUser, Experience, Education, Project, Language } from '@repo/contracts';

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

export const CvSheet: React.FC<CvSheetProps> = ({ user, options }) => {
  const experiences = (user.experience || []) as Experience[];
  const educations = (user.education || []) as Education[];
  const projects = (user.projects || []) as Project[];
  const rawLanguages = (user.languages || []) as any[];

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

  return (
    <div
      id="cv-document"
      className="relative mx-auto w-full max-w-[800px] rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-md transition-all text-slate-800 font-sans"
      style={{ minHeight: '1050px' }}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1.5 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {displayName}
          </h1>
          <p className="text-sm font-semibold text-emerald-700">
            Software Engineer / Full-stack Developer
          </p>

          {options.showContact && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-slate-500">
              {user.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </span>
              )}
              {user.publicUrl && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span>devfolio.com/user/{user.publicUrl}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {options.showPhoto && (
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl sm:text-3xl font-bold text-white shadow-xs">
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

      <div className="space-y-6 pt-6 text-xs">
        {/* SUMMARY / ABOUT */}
        {options.showAbout && user.description && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {user.description}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {options.showExperience && experiences.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {exp.position}{' '}
                      <span className="text-emerald-700 font-semibold font-sans">
                        @ {exp.company}
                      </span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-slate-600 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.skills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600"
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

        {/* EDUCATION */}
        {options.showEducation && educations.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Education
            </h2>
            <div className="space-y-2">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      {edu.title}
                    </span>
                    <span className="text-slate-500 capitalize ml-1.5">
                      — {edu.degree} Degree
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {options.showProjects && projects.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 space-y-1"
                >
                  <h4 className="font-bold text-slate-900 text-xs">
                    {proj.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {options.showSkills && uniqueSkills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {uniqueSkills.map((sk) => (
                <span
                  key={sk}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-mono font-medium text-slate-700"
                >
                  {sk}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {options.showLanguages && rawLanguages.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1">
              Languages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rawLanguages.map((item) => {
                const lang = item.language || item;
                const name = lang.name || 'Language';
                const level = lang.level || 'intermediate';
                const percent = getLevelPercentage(level);

                return (
                  <div key={item.id || name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800">{name}</span>
                      <span className="text-slate-400 capitalize">
                        {formatLanguageLevel(level)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: percent }}
                      />
                    </div>
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

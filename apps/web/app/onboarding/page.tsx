'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  CheckCircle2,
  Camera,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Globe,
  Users,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useAuthStore } from '../../store/use-auth-store';
import { useUserStore } from '../../store/use-user-store';
import { useEducationStore } from '../../store/use-education-store';
import { useExperienceStore } from '../../store/use-experience-store';
import { useLanguageStore } from '../../store/use-language-store';
import { useProjectStore } from '../../store/use-project-store';
import { useMediaStore } from '../../store/use-media-store';
import type { EducationDegree, LanguageLevel } from '@repo/contracts';

const steps = [
  { id: 1, title: 'Basic information', icon: <User className="h-4 w-4" /> },
  { id: 2, title: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 3, title: 'Experience', icon: <Briefcase className="h-4 w-4" /> },
  { id: 4, title: 'Skills & Languages', icon: <Code2 className="h-4 w-4" /> },
  { id: 5, title: 'Projects', icon: <FolderGit2 className="h-4 w-4" /> },
  { id: 6, title: 'Finish', icon: <CheckCircle2 className="h-4 w-4" /> },
];

const popularSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'Prisma',
  'Tailwind CSS',
  'Docker',
  'Git',
  'GraphQL',
  'Python',
  'AWS',
];

const languageLevels: { value: LanguageLevel; label: string }[] = [
  { value: 'elementary', label: 'Elementary' },
  { value: 'pre_intermediate', label: 'Pre-intermediate' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'upper_intermediate', label: 'Upper-intermediate' },
  { value: 'advanced', label: 'Advanced / Native' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { profile, fetchProfile, updateProfile } = useUserStore();
  const {
    educations,
    fetchMyEducations,
    createEducation,
    deleteEducation,
  } = useEducationStore();
  const {
    experiences,
    fetchMyExperiences,
    createExperience,
    deleteExperience,
  } = useExperienceStore();
  const {
    languages,
    fetchMyLanguages,
    createLanguage,
    deleteLanguage,
  } = useLanguageStore();
  const {
    projects,
    fetchMyProjects,
    createProject,
    deleteProject,
  } = useProjectStore();
  const { medias, uploadFile, fetchMyMedias } = useMediaStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  // Step 1: Basic Info state
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);

  // Step 2: Education modal/form state
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduTitle, setEduTitle] = useState('');
  const [eduDegree, setEduDegree] = useState<EducationDegree>('bachelor');
  const [eduStartDate, setEduStartDate] = useState('');
  const [eduEndDate, setEduEndDate] = useState('');
  const [eduIsCurrent, setEduIsCurrent] = useState(false);

  // Step 3: Experience modal/form state
  const [showExpModal, setShowExpModal] = useState(false);
  const [expCompany, setExpCompany] = useState('');
  const [expPosition, setExpPosition] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expIsCurrent, setExpIsCurrent] = useState(false);
  const [expSkillInput, setExpSkillInput] = useState('');
  const [expSkills, setExpSkills] = useState<string[]>([]);

  // Step 4: Skills & Languages state
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkillText, setNewSkillText] = useState('');
  const [langName, setLangName] = useState('');
  const [langLevel, setLangLevel] = useState<LanguageLevel>('intermediate');

  // Step 5: Projects modal/form state
  const [showProjModal, setShowProjModal] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDescription, setProjDescription] = useState('');

  // Initial data loading
  useEffect(() => {
    fetchProfile();
    fetchMyEducations();
    fetchMyExperiences();
    fetchMyLanguages();
    fetchMyProjects();
    fetchMyMedias();
  }, [
    fetchProfile,
    fetchMyEducations,
    fetchMyExperiences,
    fetchMyLanguages,
    fetchMyProjects,
    fetchMyMedias,
  ]);

  // Synchronize state with loaded profile
  useEffect(() => {
    const data = profile || user;
    if (data) {
      setFullName(data.fullName || '');
      setDescription(data.description || '');
      const existingAvatar =
        data.avatarUrl ||
        data.fileUrl ||
        (data.fileName?.startsWith('http') ? data.fileName : null);
      if (existingAvatar) {
        setAvatarUrl(existingAvatar);
      }
    }
  }, [profile, user]);

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep || completedSteps.includes(stepId)) {
      setStepError(null);
      setCurrentStep(stepId);
    }
  };

  const markCompleted = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  // Step 1 Save & Next
  const handleSaveStep1 = async () => {
    setStepError(null);
    if (!fullName.trim()) {
      setStepError('Please enter your full name');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await updateProfile({
        fullName: fullName.trim(),
        description: description.trim() || undefined,
        ...(avatarFileName ? { fileName: avatarFileName } : {}),
      });
      if (updated) {
        setUser({ ...user, ...updated });
      }
      markCompleted(1);
      setCurrentStep(2);
    } catch {
      setStepError('Failed to save basic information');
    } finally {
      setIsSaving(false);
    }
  };

  // Step 2: Add Education
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduTitle.trim()) return;
    setIsSaving(true);
    try {
      await createEducation({
        title: eduTitle.trim(),
        degree: eduDegree,
        startDate: eduStartDate ? new Date(eduStartDate).toISOString() : new Date().toISOString(),
        endDate: eduIsCurrent || !eduEndDate ? null : new Date(eduEndDate).toISOString(),
      });
      setShowEduModal(false);
      setEduTitle('');
      setEduStartDate('');
      setEduEndDate('');
      setEduIsCurrent(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Step 3: Add Experience
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCompany.trim() || !expPosition.trim()) return;
    setIsSaving(true);
    try {
      await createExperience({
        company: expCompany.trim(),
        position: expPosition.trim(),
        description: expDescription.trim() || 'Software development and engineering',
        startDate: expStartDate ? new Date(expStartDate).toISOString() : new Date().toISOString(),
        endDate: expIsCurrent || !expEndDate ? null : new Date(expEndDate).toISOString(),
        skills: expSkills,
      });
      setShowExpModal(false);
      setExpCompany('');
      setExpPosition('');
      setExpDescription('');
      setExpStartDate('');
      setExpEndDate('');
      setExpIsCurrent(false);
      setExpSkills([]);
    } finally {
      setIsSaving(false);
    }
  };

  // Step 4: Add Language
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langName.trim()) return;
    setIsSaving(true);
    try {
      await createLanguage({
        name: langName.trim(),
        level: langLevel,
      });
      setLangName('');
      setLangLevel('intermediate');
    } finally {
      setIsSaving(false);
    }
  };

  // Step 5: Add Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    setIsSaving(true);
    try {
      await createProject({
        title: projTitle.trim(),
        description: projDescription.trim() || 'A modern software project built with scalable tools.',
      });
      setShowProjModal(false);
      setProjTitle('');
      setProjDescription('');
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const media = await uploadFile(file);
      if (media?.url) {
        setAvatarUrl(media.url);
        const fileNameToSave = media.fileName || media.url;
        setAvatarFileName(fileNameToSave);
        const updated = await updateProfile({
          fileName: fileNameToSave,
        });
        if (updated) {
          setUser({ ...user, ...updated });
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const currentUserName = user?.fullName || profile?.fullName || 'Jane Doe';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white px-8 py-3.5 sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-700">
              {currentUserName}
            </span>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Brand & Value Props (3 cols) */}
          <div className="hidden lg:col-span-3 lg:flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 p-7 shadow-xs">
            <div className="space-y-6">
              <span className="inline-block rounded-lg bg-emerald-100/70 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                ONBOARDING
              </span>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Let&apos;s build your portfolio together
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete a few simple steps to set up your profile. This information will be visible on your public portfolio and you can always edit it later.
                </p>
              </div>

              {/* Supporting Features */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Showcase yourself</h4>
                    <p className="text-[11px] text-slate-500">Highlight your skills, experience and projects.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Get discovered</h4>
                    <p className="text-[11px] text-slate-500">Let opportunities find you.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Join a growing community</h4>
                    <p className="text-[11px] text-slate-500">Be part of a network of builders and creators.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Slogan */}
            <div className="border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-500">
              Your code. Your story. In one place.
            </div>
          </div>

          {/* Middle Column: Vertical Step Navigation (3 cols) */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xs h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">
              Setup Steps
            </h3>
            <div className="space-y-1.5">
              {steps.map((s) => {
                const isActive = currentStep === s.id;
                const isDone = completedSteps.includes(s.id);

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleStepClick(s.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                        : isDone
                        ? 'text-slate-700 hover:bg-slate-50'
                        : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.id}
                    </div>
                    <span className="text-xs">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Main Step Form (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-200/70 bg-white p-6 sm:p-10 shadow-xs flex flex-col justify-between">
            {/* Step Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Step {currentStep} of 6
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                    {currentStep === 1 && "Let's set up your profile"}
                    {currentStep === 2 && 'Add your education'}
                    {currentStep === 3 && 'Share your experience'}
                    {currentStep === 4 && 'Skills & Languages'}
                    {currentStep === 5 && 'Featured projects'}
                    {currentStep === 6 && 'Ready to launch!'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentStep === 1 && 'This information will be visible on your public portfolio. You can always change it later.'}
                    {currentStep === 2 && 'Add institutions and degrees you hold or are currently studying.'}
                    {currentStep === 3 && 'List your relevant positions, roles, and software projects.'}
                    {currentStep === 4 && 'Add tech stack skills and languages you speak.'}
                    {currentStep === 5 && 'Showcase notable projects you have built.'}
                    {currentStep === 6 && 'Review your profile information and enter the dashboard.'}
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {stepError && (
                <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{stepError}</span>
                </div>
              )}

              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-slate-500 overflow-hidden shadow-inner">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-900">Add a profile photo</h4>
                      <p className="text-[11px] text-slate-500">
                        A clear photo helps you make a great first impression.
                      </p>
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50">
                        <Camera className="h-3.5 w-3.5 text-slate-500" />
                        <span>{avatarUrl ? 'Change photo' : 'Add photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <Input
                    label="Full name"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    leftIcon={<User className="h-4 w-4" />}
                    required
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700">
                        Short description
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {description.length}/500
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      maxLength={500}
                      placeholder="Tell us about yourself - your background, interests and what you're working on."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Education */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Added Educations ({educations.length})
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Plus className="h-3.5 w-3.5" />}
                      onClick={() => setShowEduModal(true)}
                    >
                      Add education
                    </Button>
                  </div>

                  {educations.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                      No education records added yet. Click &quot;Add education&quot; to add your studies.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {educations.map((edu) => (
                        <div
                          key={edu.id}
                          className="flex items-start justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{edu.title}</h4>
                            <p className="text-[11px] text-slate-500 capitalize">{edu.degree} Degree</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">
                              {new Date(edu.startDate).getFullYear()} -{' '}
                              {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteEducation(edu.id)}
                            className="text-slate-400 hover:text-rose-500 transition p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Experience */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Added Experience ({experiences.length})
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Plus className="h-3.5 w-3.5" />}
                      onClick={() => setShowExpModal(true)}
                    >
                      Add experience
                    </Button>
                  </div>

                  {experiences.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                      No experience records added yet. Click &quot;Add experience&quot; to add roles.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {experiences.map((exp) => (
                        <div
                          key={exp.id}
                          className="flex items-start justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900">{exp.position}</h4>
                            <p className="text-[11px] text-emerald-700 font-medium">{exp.company}</p>
                            <p className="text-[11px] text-slate-600 line-clamp-2">{exp.description}</p>
                            {exp.skills && exp.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {exp.skills.map((sk) => (
                                  <span
                                    key={sk}
                                    className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 font-mono"
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteExperience(exp.id)}
                            className="text-slate-400 hover:text-rose-500 transition p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Skills & Languages */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Skills tags */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-800">
                      Select Your Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSkills.map((sk) => {
                        const isSelected = selectedSkills.includes(sk);
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedSkills(selectedSkills.filter((s) => s !== sk));
                              } else {
                                setSelectedSkills([...selectedSkills, sk]);
                              }
                            }}
                            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {sk}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <label className="text-xs font-semibold text-slate-800">
                      Languages ({languages.length})
                    </label>

                    <form onSubmit={handleAddLanguage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Language (e.g. English)"
                        value={langName}
                        onChange={(e) => setLangName(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <select
                        value={langLevel}
                        onChange={(e) => setLangLevel(e.target.value as LanguageLevel)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      >
                        {languageLevels.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" size="sm" variant="outline">
                        Add
                      </Button>
                    </form>

                    {languages.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {languages.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs"
                          >
                            <span className="font-medium text-slate-800">{l.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600 capitalize">
                                {l.level.replace('_', ' ')}
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteLanguage(l.id)}
                                className="text-slate-400 hover:text-rose-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Projects */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Added Projects ({projects.length})
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Plus className="h-3.5 w-3.5" />}
                      onClick={() => setShowProjModal(true)}
                    >
                      Add project
                    </Button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                      No projects added yet. Add at least one project to highlight your work.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="flex items-start justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {proj.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteProject(proj.id)}
                            className="text-slate-400 hover:text-rose-500 transition p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: Finish */}
              {currentStep === 6 && (
                <div className="space-y-6 text-center py-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-xs">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-slate-900">
                      Portfolio Setup Complete!
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your profile and public developer portfolio are ready. You can manage and update any part of your portfolio from Profile Settings anytime.
                    </p>
                  </div>

                  {/* Summary card */}
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="text-slate-400 font-mono text-[10px]">FULL NAME</p>
                      <p className="font-semibold text-slate-800">{fullName || 'Jane Doe'}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="text-slate-400 font-mono text-[10px]">PUBLIC LINK</p>
                      <p className="font-semibold text-emerald-600 truncate">
                        {user?.publicUrl ? `/${user.publicUrl}` : '/jane-doe'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="text-slate-400 font-mono text-[10px]">SECTIONS ADDED</p>
                      <p className="font-semibold text-slate-800">
                        {educations.length} Edu • {experiences.length} Exp • {projects.length} Proj
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="text-slate-400 font-mono text-[10px]">STATUS</p>
                      <p className="font-semibold text-emerald-600">Active & Ready</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <Link href="/profile">
                      <Button variant="outline" size="md">
                        View profile
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Go to dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Buttons */}
            {currentStep < 6 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                    onClick={() => {
                      setStepError(null);
                      setCurrentStep(currentStep - 1);
                    }}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => {
                    if (currentStep === 1) {
                      handleSaveStep1();
                    } else {
                      markCompleted(currentStep);
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                >
                  {currentStep === 5 ? 'Finish setup' : 'Next →'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Education Modal */}
      <Modal
        isOpen={showEduModal}
        onClose={() => setShowEduModal(false)}
        title="Add Education"
        description="Enter the educational institution and qualification details."
      >
        <form onSubmit={handleAddEducation} className="space-y-4">
          <Input
            label="Institution / University"
            placeholder="e.g. National Technical University"
            value={eduTitle}
            onChange={(e) => setEduTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Degree</label>
            <select
              value={eduDegree}
              onChange={(e) => setEduDegree(e.target.value as EducationDegree)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
            >
              <option value="bachelor">Bachelor&apos;s Degree</option>
              <option value="master">Master&apos;s Degree</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start date"
              type="date"
              value={eduStartDate}
              onChange={(e) => setEduStartDate(e.target.value)}
              required
            />
            {!eduIsCurrent && (
              <Input
                label="End date"
                type="date"
                value={eduEndDate}
                onChange={(e) => setEduEndDate(e.target.value)}
              />
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 pt-1">
            <input
              type="checkbox"
              checked={eduIsCurrent}
              onChange={(e) => setEduIsCurrent(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Currently studying here</span>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowEduModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save education
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Experience Modal */}
      <Modal
        isOpen={showExpModal}
        onClose={() => setShowExpModal(false)}
        title="Add Experience"
        description="Enter details about your previous or current software engineering roles."
      >
        <form onSubmit={handleAddExperience} className="space-y-4">
          <Input
            label="Company"
            placeholder="e.g. TechCorp"
            value={expCompany}
            onChange={(e) => setExpCompany(e.target.value)}
            required
          />

          <Input
            label="Position"
            placeholder="e.g. Senior Full-stack Developer"
            value={expPosition}
            onChange={(e) => setExpPosition(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Describe your responsibilities and achievements..."
              value={expDescription}
              onChange={(e) => setExpDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start date"
              type="date"
              value={expStartDate}
              onChange={(e) => setExpStartDate(e.target.value)}
              required
            />
            {!expIsCurrent && (
              <Input
                label="End date"
                type="date"
                value={expEndDate}
                onChange={(e) => setExpEndDate(e.target.value)}
              />
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={expIsCurrent}
              onChange={(e) => setExpIsCurrent(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Currently working here</span>
          </label>

          {/* Skills tags input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Skills / Technologies</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React)"
                value={expSkillInput}
                onChange={(e) => setExpSkillInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  if (expSkillInput.trim() && !expSkills.includes(expSkillInput.trim())) {
                    setExpSkills([...expSkills, expSkillInput.trim()]);
                    setExpSkillInput('');
                  }
                }}
              >
                Add
              </Button>
            </div>
            {expSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {expSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs text-emerald-800"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => setExpSkills(expSkills.filter((s) => s !== sk))}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowExpModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save experience
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Project Modal */}
      <Modal
        isOpen={showProjModal}
        onClose={() => setShowProjModal(false)}
        title="Add Project"
        description="Share details about a project you created or contributed to."
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <Input
            label="Project title"
            placeholder="e.g. TaskFlow Productivity App"
            value={projTitle}
            onChange={(e) => setProjTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              placeholder="What problem does this project solve? What tech stack did you use?"
              value={projDescription}
              onChange={(e) => setProjDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowProjModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        Devfolio Onboarding • Step {currentStep} of 6
      </footer>
    </div>
  );
}

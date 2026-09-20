'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Image as ImageIcon,
  Languages as LanguagesIcon,
  Globe,
  Camera,
  Trash2,
  Copy,
  Check,
  Download,
  Plus,
  ArrowUpRight,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { AppSidebar } from '../../components/AppSidebar';
import { AppHeader } from '../../components/AppHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  DribbbleIcon,
} from '../../components/SocialIcons';
import { useAuthStore } from '../../store/use-auth-store';
import { useUserStore } from '../../store/use-user-store';
import { useEducationStore } from '../../store/use-education-store';
import { useExperienceStore } from '../../store/use-experience-store';
import { useLanguageStore } from '../../store/use-language-store';
import { useProjectStore } from '../../store/use-project-store';
import { useMediaStore } from '../../store/use-media-store';
import type { EducationDegree, LanguageLevel } from '@repo/contracts';

type TabKey = 'general' | 'education' | 'experience' | 'projects' | 'languages' | 'media';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'General', icon: <User className="h-4 w-4" /> },
  { key: 'education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
  { key: 'experience', label: 'Experience', icon: <Briefcase className="h-4 w-4" /> },
  { key: 'projects', label: 'Projects', icon: <FolderGit2 className="h-4 w-4" /> },
  { key: 'languages', label: 'Languages', icon: <LanguagesIcon className="h-4 w-4" /> },
  { key: 'media', label: 'Media', icon: <ImageIcon className="h-4 w-4" /> },
];

const languageLevels: { value: LanguageLevel; label: string }[] = [
  { value: 'elementary', label: 'Elementary' },
  { value: 'pre_intermediate', label: 'Pre-intermediate' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'upper_intermediate', label: 'Upper-intermediate' },
  { value: 'advanced', label: 'Advanced / Native' },
];

function ProfileSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams?.get('tab') as TabKey;
  const activeTab: TabKey = tabs.some((t) => t.key === rawTab) ? rawTab : 'general';

  const { user, setUser } = useAuthStore();
  const { profile, fetchProfile, updateProfile, downloadCvMe } = useUserStore();
  const {
    educations,
    fetchMyEducations,
    createEducation,
    updateEducation,
    deleteEducation,
  } = useEducationStore();
  const {
    experiences,
    fetchMyExperiences,
    createExperience,
    updateExperience,
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
    updateProject,
    deleteProject,
  } = useProjectStore();
  const {
    medias,
    fetchMyMedias,
    uploadFile,
    deleteMedia,
    uploading,
  } = useMediaStore();

  // General tab form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [location, setLocation] = useState('Kyiv, Ukraine');
  const [website, setWebsite] = useState('https://jane-doe.dev');
  const [github, setGithub] = useState('jane-doe');
  const [linkedin, setLinkedin] = useState('janedoe');
  const [twitter, setTwitter] = useState('jane_doe');
  const [dribbble, setDribbble] = useState('jane-doe');

  // UI status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isDownloadingCv, setIsDownloadingCv] = useState(false);

  // Education Modal
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEduId, setEditingEduId] = useState<number | null>(null);
  const [eduTitle, setEduTitle] = useState('');
  const [eduDegree, setEduDegree] = useState<EducationDegree>('bachelor');
  const [eduStartDate, setEduStartDate] = useState('');
  const [eduEndDate, setEduEndDate] = useState('');
  const [eduIsCurrent, setEduIsCurrent] = useState(false);

  // Experience Modal
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [expCompany, setExpCompany] = useState('');
  const [expPosition, setExpPosition] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expIsCurrent, setExpIsCurrent] = useState(false);
  const [expSkillInput, setExpSkillInput] = useState('');
  const [expSkills, setExpSkills] = useState<string[]>([]);

  // Project Modal
  const [showProjModal, setShowProjModal] = useState(false);
  const [editingProjId, setEditingProjId] = useState<number | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projDescription, setProjDescription] = useState('');

  // Language Inline Form
  const [langName, setLangName] = useState('');
  const [langLevel, setLangLevel] = useState<LanguageLevel>('intermediate');

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

  // Sync profile data with form
  useEffect(() => {
    const data = profile || user;
    if (data) {
      setFullName(data.fullName || '');
      setEmail(data.email || '');
      setDescription(data.description || '');
      setPublicUrl(data.publicUrl || '');
    }
  }, [profile, user]);

  const handleTabChange = (tab: TabKey) => {
    router.push(`/profile?tab=${tab}`);
  };

  const handleCopyPublicUrl = () => {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/user/${publicUrl || 'jane-doe'}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updated = await updateProfile({
        fullName: fullName.trim(),
        description: description.trim() || undefined,
        publicUrl: publicUrl.trim() || undefined,
      });

      if (updated) {
        setUser({ ...user, ...updated });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Failed to save profile changes');
      }
    } catch {
      setSaveError('An error occurred while saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const media = await uploadFile(file);
      if (media) {
        const updated = await updateProfile({
          fileName: media.fileName || media.url,
        });
        if (updated) {
          setUser({ ...user, ...updated });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }
    } catch {
      setSaveError('Failed to upload profile photo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateProfile({
        fileName: null,
      });
      if (updated) {
        setUser({ ...user, ...updated });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveError('Failed to remove profile photo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateCv = async () => {
    setIsDownloadingCv(true);
    try {
      await downloadCvMe();
    } finally {
      setIsDownloadingCv(false);
    }
  };

  // Education Handlers
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduTitle.trim()) return;
    setIsSaving(true);

    try {
      if (editingEduId) {
        await updateEducation(editingEduId, {
          title: eduTitle.trim(),
          degree: eduDegree,
          startDate: eduStartDate ? new Date(eduStartDate).toISOString() : new Date().toISOString(),
          endDate: eduIsCurrent || !eduEndDate ? null : new Date(eduEndDate).toISOString(),
        });
      } else {
        await createEducation({
          title: eduTitle.trim(),
          degree: eduDegree,
          startDate: eduStartDate ? new Date(eduStartDate).toISOString() : new Date().toISOString(),
          endDate: eduIsCurrent || !eduEndDate ? null : new Date(eduEndDate).toISOString(),
        });
      }
      setShowEduModal(false);
      setEditingEduId(null);
      setEduTitle('');
      setEduStartDate('');
      setEduEndDate('');
      setEduIsCurrent(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Experience Handlers
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCompany.trim() || !expPosition.trim()) return;
    setIsSaving(true);

    try {
      if (editingExpId) {
        await updateExperience(editingExpId, {
          company: expCompany.trim(),
          position: expPosition.trim(),
          description: expDescription.trim() || 'Software engineering',
          startDate: expStartDate ? new Date(expStartDate).toISOString() : new Date().toISOString(),
          endDate: expIsCurrent || !expEndDate ? null : new Date(expEndDate).toISOString(),
          skills: expSkills,
        });
      } else {
        await createExperience({
          company: expCompany.trim(),
          position: expPosition.trim(),
          description: expDescription.trim() || 'Software engineering',
          startDate: expStartDate ? new Date(expStartDate).toISOString() : new Date().toISOString(),
          endDate: expIsCurrent || !expEndDate ? null : new Date(expEndDate).toISOString(),
          skills: expSkills,
        });
      }
      setShowExpModal(false);
      setEditingExpId(null);
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

  // Project Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    setIsSaving(true);

    try {
      if (editingProjId) {
        await updateProject(editingProjId, {
          title: projTitle.trim(),
          description: projDescription.trim() || 'Portfolio project',
        });
      } else {
        await createProject({
          title: projTitle.trim(),
          description: projDescription.trim() || 'Portfolio project',
        });
      }
      setShowProjModal(false);
      setEditingProjId(null);
      setProjTitle('');
      setProjDescription('');
    } finally {
      setIsSaving(false);
    }
  };

  // Language Handlers
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

  // Media Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const displayName = fullName || user?.fullName || 'Jane Doe';
  const displayUrl = publicUrl || user?.publicUrl || 'jane-doe';

  // Resolved Avatar URL
  const avatarPhotoUrl =
    profile?.avatarUrl ||
    profile?.fileUrl ||
    user?.avatarUrl ||
    user?.fileUrl ||
    (profile?.fileName?.startsWith('http') ? profile?.fileName : null) ||
    (user?.fileName?.startsWith('http') ? user?.fileName : null) ||
    medias?.[0]?.url ||
    null;

  // Extract skills from experiences
  const collectedSkills = Array.from(
    new Set(experiences.flatMap((exp) => exp.skills || []))
  );
  const previewSkills =
    collectedSkills.length > 0
      ? collectedSkills
      : ['JavaScript', 'React', 'Node.js', 'PostgreSQL'];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Authenticated Left Sidebar */}
      <AppSidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Profile Settings
              </h1>
              <p className="text-sm text-slate-500">
                Manage your personal information and portfolio content. Make it yours.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 border-b border-slate-200">
              {tabs.map((t) => {
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => handleTabChange(t.key)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
                      isActive
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                      {t.icon}
                    </span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Two-Column Grid: Left Forms / Right Preview & Actions */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column (8 cols): Active Tab Content */}
              <div className="space-y-6 lg:col-span-8">
                {/* Feedback Alerts */}
                {saveSuccess && (
                  <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 shadow-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Profile settings successfully saved!</span>
                  </div>
                )}
                {saveError && (
                  <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 shadow-xs">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span>{saveError}</span>
                  </div>
                )}

                {/* TAB: GENERAL */}
                {activeTab === 'general' && (
                  <form onSubmit={handleSaveGeneral} className="space-y-6">
                    {/* Card 1: Basic Information */}
                    <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Basic information
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          This information will be visible on your public portfolio.
                        </p>
                      </div>

                      {/* Photo Section */}
                      <div className="space-y-2 border-t border-slate-100 pt-5">
                        <label className="text-xs font-semibold text-slate-700">
                          Profile photo
                        </label>
                        <div className="flex items-center gap-5">
                          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-xl font-bold text-white shadow-xs">
                            {avatarPhotoUrl ? (
                              <img
                                src={avatarPhotoUrl}
                                alt={displayName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex gap-2">
                              <label className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50">
                                {avatarPhotoUrl ? 'Change photo' : 'Add photo'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfilePhotoUpload}
                                  className="hidden"
                                />
                              </label>
                              {avatarPhotoUrl && (
                                <button
                                  type="button"
                                  onClick={handleRemovePhoto}
                                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                  Remove photo
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              JPG, PNG up to 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Name & Email inputs */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                        <Input
                          label="Full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          leftIcon={<User className="h-4 w-4" />}
                          required
                        />

                        <Input
                          label="Email address"
                          type="email"
                          value={email}
                          disabled
                          helperText="Email is managed by authentication."
                        />
                      </div>

                      {/* Short Description */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-slate-700">
                            Short description
                          </label>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {description.length}/500
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          maxLength={500}
                          placeholder="Full-stack developer passionate about building modern web applications and solving real-world problems."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 placeholder:text-slate-400 transition hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      {/* Public URL Input */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-medium text-slate-700">
                          Public URL (your portfolio link)
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                              /user/
                            </span>
                            <input
                              type="text"
                              value={publicUrl}
                              onChange={(e) => setPublicUrl(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-16 pr-4 text-xs font-mono text-slate-900 transition hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            leftIcon={
                              copiedUrl ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Copy className="h-4 w-4 text-slate-500" />
                              )
                            }
                            onClick={handleCopyPublicUrl}
                          >
                            {copiedUrl ? 'Copied' : 'Copy link'}
                          </Button>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          This is your public portfolio link. Share it with the world!
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Location & Social links */}
                    <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Location & Social links
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Help others find and connect with you.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
                        <Input
                          label="Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          leftIcon={<MapPin className="h-4 w-4" />}
                          placeholder="Kyiv, Ukraine"
                        />

                        <Input
                          label="Website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          leftIcon={<Globe className="h-4 w-4" />}
                          placeholder="https://jane-doe.dev"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-1">
                        <Input
                          label="GitHub"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          leftIcon={<GithubIcon className="h-4 w-4 text-slate-400" />}
                          placeholder="jane-doe"
                        />

                        <Input
                          label="LinkedIn"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          leftIcon={<LinkedinIcon className="h-4 w-4 text-slate-400" />}
                          placeholder="janedoe"
                        />

                        <Input
                          label="Twitter / X"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          leftIcon={<TwitterIcon className="h-4 w-4 text-slate-400" />}
                          placeholder="jane_doe"
                        />

                        <Input
                          label="Dribbble"
                          value={dribbble}
                          onChange={(e) => setDribbble(e.target.value)}
                          leftIcon={<DribbbleIcon className="h-4 w-4 text-slate-400" />}
                          placeholder="jane-doe"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const data = profile || user;
                          if (data) {
                            setFullName(data.fullName || '');
                            setDescription(data.description || '');
                            setPublicUrl(data.publicUrl || '');
                          }
                        }}
                      >
                        Discard changes
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSaving}
                      >
                        Save changes
                      </Button>
                    </div>
                  </form>
                )}

                {/* TAB: EDUCATION */}
                {activeTab === 'education' && (
                  <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Education</h3>
                        <p className="text-xs text-slate-500">
                          Manage your degrees and academic background.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => {
                          setEditingEduId(null);
                          setEduTitle('');
                          setEduDegree('bachelor');
                          setEduStartDate('');
                          setEduEndDate('');
                          setEduIsCurrent(false);
                          setShowEduModal(true);
                        }}
                      >
                        Add education
                      </Button>
                    </div>

                    {educations.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500">
                        No education records found. Click &quot;Add education&quot; to create one.
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        {educations.map((edu) => (
                          <div
                            key={edu.id}
                            className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50"
                          >
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-slate-900">{edu.title}</h4>
                              <p className="text-xs text-slate-600 capitalize">
                                {edu.degree} Degree
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono pt-1">
                                {new Date(edu.startDate).getFullYear()} -{' '}
                                {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingEduId(edu.id);
                                  setEduTitle(edu.title);
                                  setEduDegree(edu.degree || 'bachelor');
                                  setEduStartDate(
                                    edu.startDate ? new Date(edu.startDate).toISOString().slice(0, 10) : ''
                                  );
                                  setEduEndDate(
                                    edu.endDate ? new Date(edu.endDate).toISOString().slice(0, 10) : ''
                                  );
                                  setEduIsCurrent(!edu.endDate);
                                  setShowEduModal(true);
                                }}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEducation(edu.id)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: EXPERIENCE */}
                {activeTab === 'experience' && (
                  <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Experience</h3>
                        <p className="text-xs text-slate-500">
                          Manage your work history and positions.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => {
                          setEditingExpId(null);
                          setExpCompany('');
                          setExpPosition('');
                          setExpDescription('');
                          setExpStartDate('');
                          setExpEndDate('');
                          setExpIsCurrent(false);
                          setExpSkills([]);
                          setShowExpModal(true);
                        }}
                      >
                        Add experience
                      </Button>
                    </div>

                    {experiences.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500">
                        No experience records found. Click &quot;Add experience&quot; to add your software roles.
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        {experiences.map((exp) => (
                          <div
                            key={exp.id}
                            className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50"
                          >
                            <div className="space-y-1.5">
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{exp.position}</h4>
                                <p className="text-xs font-semibold text-emerald-700">{exp.company}</p>
                              </div>
                              <p className="text-xs text-slate-600 max-w-xl">{exp.description}</p>
                              {exp.skills && exp.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {exp.skills.map((sk) => (
                                    <span
                                      key={sk}
                                      className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-700 font-mono"
                                    >
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingExpId(exp.id);
                                  setExpCompany(exp.company);
                                  setExpPosition(exp.position);
                                  setExpDescription(exp.description);
                                  setExpStartDate(
                                    exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 10) : ''
                                  );
                                  setExpEndDate(
                                    exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 10) : ''
                                  );
                                  setExpIsCurrent(!exp.endDate);
                                  setExpSkills(exp.skills || []);
                                  setShowExpModal(true);
                                }}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteExperience(exp.id)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: PROJECTS */}
                {activeTab === 'projects' && (
                  <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Projects</h3>
                        <p className="text-xs text-slate-500">
                          Manage your portfolio software projects.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => {
                          setEditingProjId(null);
                          setProjTitle('');
                          setProjDescription('');
                          setShowProjModal(true);
                        }}
                      >
                        Add project
                      </Button>
                    </div>

                    {projects.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500">
                        No projects found. Add projects to display on your public portfolio.
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        {projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50"
                          >
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                              <p className="text-xs text-slate-600 max-w-xl">{proj.description}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProjId(proj.id);
                                  setProjTitle(proj.title);
                                  setProjDescription(proj.description);
                                  setShowProjModal(true);
                                }}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProject(proj.id)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: LANGUAGES */}
                {activeTab === 'languages' && (
                  <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Languages</h3>
                      <p className="text-xs text-slate-500">
                        Add languages and your proficiency levels.
                      </p>
                    </div>

                    <form onSubmit={handleAddLanguage} className="flex gap-2 border-t border-slate-100 pt-4">
                      <input
                        type="text"
                        placeholder="Language (e.g. English, Ukrainian, German)"
                        value={langName}
                        onChange={(e) => setLangName(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <select
                        value={langLevel}
                        onChange={(e) => setLangLevel(e.target.value as LanguageLevel)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      >
                        {languageLevels.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" variant="primary" size="sm">
                        Add language
                      </Button>
                    </form>

                    {languages.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No languages added yet.
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2">
                        {languages.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs"
                          >
                            <span className="font-semibold text-slate-800">{l.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700 capitalize">
                                {l.level.replace('_', ' ')}
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteLanguage(l.id)}
                                className="text-slate-400 hover:text-rose-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: MEDIA */}
                {activeTab === 'media' && (
                  <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Media Files</h3>
                        <p className="text-xs text-slate-500">
                          Upload and manage portfolio images and assets.
                        </p>
                      </div>
                      <label className="cursor-pointer rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 inline-flex items-center gap-1.5">
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span>Upload media</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    {medias.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500">
                        No media uploaded yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 pt-2">
                        {medias.map((m) => (
                          <div
                            key={m.id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-xs"
                          >
                            <div className="aspect-video w-full rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center">
                              {m.mimeType?.startsWith('image/') ? (
                                <img
                                  src={m.url}
                                  alt={m.fileName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FileText className="h-8 w-8 text-slate-400" />
                              )}
                            </div>
                            <div className="mt-2 flex items-center justify-between px-1">
                              <p className="truncate text-xs font-medium text-slate-700">
                                {m.fileName}
                              </p>
                              <button
                                type="button"
                                onClick={() => deleteMedia(m.id)}
                                className="text-slate-400 hover:text-rose-500 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column (4 cols): Live Preview & CV Generation Cards */}
              <div className="space-y-6 lg:col-span-4">
                {/* 1. Live Public Preview Card */}
                <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Preview
                    </span>
                    <Link
                      href={`/user/${displayUrl}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <span>View public profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Mini Preview Box */}
                  <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-sm font-bold text-white shadow-xs">
                        {avatarPhotoUrl ? (
                          <img
                            src={avatarPhotoUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{displayName}</h4>
                        <p className="text-xs text-slate-500">Full-stack Developer</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Social badges */}
                    <div className="flex items-center gap-1.5 pt-1 text-slate-400">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <GithubIcon className="h-3.5 w-3.5 text-slate-600" />
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <LinkedinIcon className="h-3.5 w-3.5 text-slate-600" />
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <TwitterIcon className="h-3.5 w-3.5 text-slate-600" />
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <DribbbleIcon className="h-3.5 w-3.5 text-slate-600" />
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {description || 'Full-stack developer passionate about building modern web applications and solving real-world problems.'}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {previewSkills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="rounded-lg bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 font-mono"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. CV Generation Card */}
                <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">CV Generation</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Generate a professional CV from your profile information. Keep it up to date and ready to share with employers.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                      <span>Uses your profile information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                      <span>Clean, professional design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                      <span>Download as PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                      <span>Always up to date</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    isLoading={isDownloadingCv}
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={handleGenerateCv}
                    className="mt-2"
                  >
                    Generate CV
                  </Button>
                </div>

                {/* 3. Account Card */}
                <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900">Account</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Manage your account settings, password and data preferences.
                  </p>
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline pt-1"
                  >
                    <span>Go to account settings &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Education Modal */}
      <Modal
        isOpen={showEduModal}
        onClose={() => setShowEduModal(false)}
        title={editingEduId ? 'Edit Education' : 'Add Education'}
      >
        <form onSubmit={handleSaveEducation} className="space-y-4">
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

      {/* Experience Modal */}
      <Modal
        isOpen={showExpModal}
        onClose={() => setShowExpModal(false)}
        title={editingExpId ? 'Edit Experience' : 'Add Experience'}
      >
        <form onSubmit={handleSaveExperience} className="space-y-4">
          <Input
            label="Company"
            placeholder="e.g. Google, TechCorp"
            value={expCompany}
            onChange={(e) => setExpCompany(e.target.value)}
            required
          />

          <Input
            label="Position"
            placeholder="e.g. Senior Software Engineer"
            value={expPosition}
            onChange={(e) => setExpPosition(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Responsibilities, achievements, and contributions..."
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

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. TypeScript)"
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

      {/* Project Modal */}
      <Modal
        isOpen={showProjModal}
        onClose={() => setShowProjModal(false)}
        title={editingProjId ? 'Edit Project' : 'Add Project'}
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          <Input
            label="Project title"
            placeholder="e.g. E-commerce API"
            value={projTitle}
            onChange={(e) => setProjTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              placeholder="What does this project do? Which frameworks were used?"
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
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <ProfileSettingsContent />
    </Suspense>
  );
}

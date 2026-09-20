'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  Download,
  Copy,
  Check,
  Printer,
  ExternalLink,
  Sparkles,
  Loader2,
  FileText,
  Eye,
  Sliders,
} from 'lucide-react';
import { AppSidebar } from '../../components/AppSidebar';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { CvSheet, CvDisplayOptionsState } from '../../components/CvSheet';
import { ToggleSwitch } from '../../components/ToggleSwitch';
import { useAuthStore } from '../../store/use-auth-store';
import { useUserStore } from '../../store/use-user-store';

function CvPreviewContent() {
  const { user } = useAuthStore();
  const { profile, fetchProfile, updateProfile, downloadCvMe } = useUserStore();

  const [options, setOptions] = useState<CvDisplayOptionsState>({
    showPhoto: true,
    showContact: true,
    showAbout: true,
    showExperience: true,
    showEducation: true,
    showSkills: true,
    showLanguages: true,
    showProjects: true,
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSavingOptions, setIsSavingOptions] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const saved = (profile?.cvOptions || user?.cvOptions) as CvDisplayOptionsState | undefined;
    if (saved && typeof saved === 'object') {
      setOptions((prev) => ({
        showPhoto: saved.showPhoto !== undefined ? Boolean(saved.showPhoto) : prev.showPhoto,
        showContact: saved.showContact !== undefined ? Boolean(saved.showContact) : prev.showContact,
        showAbout: saved.showAbout !== undefined ? Boolean(saved.showAbout) : prev.showAbout,
        showExperience: saved.showExperience !== undefined ? Boolean(saved.showExperience) : prev.showExperience,
        showEducation: saved.showEducation !== undefined ? Boolean(saved.showEducation) : prev.showEducation,
        showSkills: saved.showSkills !== undefined ? Boolean(saved.showSkills) : prev.showSkills,
        showLanguages: saved.showLanguages !== undefined ? Boolean(saved.showLanguages) : prev.showLanguages,
        showProjects: saved.showProjects !== undefined ? Boolean(saved.showProjects) : prev.showProjects,
      }));
    }
  }, [profile?.cvOptions, user?.cvOptions]);

  const currentUser = profile || user;
  const publicSlug = currentUser?.publicUrl || 'jane-doe';

  const handleOptionChange = async (key: keyof CvDisplayOptionsState, val: boolean) => {
    const newOptions = { ...options, [key]: val };
    setOptions(newOptions);
    setIsSavingOptions(true);
    try {
      await updateProfile({ cvOptions: newOptions });
    } finally {
      setIsSavingOptions(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCvMe(options);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000';
    const fullUrl = `${origin}/user/${publicSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 print:bg-white print:min-h-0 print:block">
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible print:block print:w-full">
        <div className="print:hidden">
          <AppHeader />
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 print:p-0 print:m-0 print:overflow-visible print:w-full print:block">
          <div className="mx-auto max-w-7xl space-y-6 print:m-0 print:p-0 print:max-w-none print:w-full print:space-y-0">
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  CV Preview
                </h1>
                <p className="text-sm text-slate-500">
                  View, customize and download your professional resume. Preferences are saved automatically.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="h-4 w-4" />}
                  onClick={handlePrint}
                >
                  Print
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isDownloading}
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={handleDownload}
                >
                  Download PDF
                </Button>
              </div>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 print:block print:w-full print:gap-0">
              {/* Left Column (8 cols): Document Sheet Preview */}
              <div className="lg:col-span-8 flex justify-center print:w-full print:block print:p-0 print:m-0">
                <CvSheet user={currentUser} options={options} />
              </div>

              {/* Right Column (4 cols): Display Options & Download Controls */}
              <div className="space-y-6 lg:col-span-4 print:hidden">
                {/* Display Options Panel */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Display Options
                      </h3>
                    </div>
                    {isSavingOptions ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        Saved to DB
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 divide-y divide-slate-100">
                    <ToggleSwitch
                      label="Show profile photo"
                      checked={options.showPhoto}
                      onChange={(val) => handleOptionChange('showPhoto', val)}
                    />
                    <ToggleSwitch
                      label="Show contact information"
                      checked={options.showContact}
                      onChange={(val) => handleOptionChange('showContact', val)}
                    />
                    <ToggleSwitch
                      label="Show about me"
                      checked={options.showAbout}
                      onChange={(val) => handleOptionChange('showAbout', val)}
                    />
                    <ToggleSwitch
                      label="Show experience"
                      checked={options.showExperience}
                      onChange={(val) => handleOptionChange('showExperience', val)}
                    />
                    <ToggleSwitch
                      label="Show education"
                      checked={options.showEducation}
                      onChange={(val) => handleOptionChange('showEducation', val)}
                    />
                    <ToggleSwitch
                      label="Show skills"
                      checked={options.showSkills}
                      onChange={(val) => handleOptionChange('showSkills', val)}
                    />
                    <ToggleSwitch
                      label="Show languages"
                      checked={options.showLanguages}
                      onChange={(val) => handleOptionChange('showLanguages', val)}
                    />
                    <ToggleSwitch
                      label="Show projects"
                      checked={options.showProjects}
                      onChange={(val) => handleOptionChange('showProjects', val)}
                    />
                  </div>
                </div>

                {/* Download & Share Panel */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Download className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Download & Share
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Download an A4 PDF document containing your selected portfolio information, or share your live public link.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <Button
                      variant="primary"
                      fullWidth
                      isLoading={isDownloading}
                      leftIcon={<Download className="h-4 w-4" />}
                      onClick={handleDownload}
                    >
                      Download PDF
                    </Button>

                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={
                        copiedUrl ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-500" />
                        )
                      }
                      onClick={handleCopyLink}
                    >
                      {copiedUrl ? 'Copied Public URL!' : 'Copy Public Portfolio URL'}
                    </Button>

                    <Link href={`/user/${publicSlug}`} target="_blank" className="block">
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<ExternalLink className="h-4 w-4 text-slate-500" />}
                      >
                        View Live Public Page
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CvPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <CvPreviewContent />
    </Suspense>
  );
}

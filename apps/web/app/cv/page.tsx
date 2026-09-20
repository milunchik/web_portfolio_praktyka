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
  const { profile, fetchProfile, downloadCvMe } = useUserStore();

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

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const currentUser = profile || user;
  const publicSlug = currentUser?.publicUrl || 'jane-doe';

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCvMe();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://devfolio.com'}/user/${publicSlug}`;
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
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  CV Preview
                </h1>
                <p className="text-sm text-slate-500">
                  View and download your professional resume.
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column (8 cols): Document Sheet Preview */}
              <div className="lg:col-span-8 flex justify-center">
                <CvSheet user={currentUser} options={options} />
              </div>

              {/* Right Column (4 cols): Display Options & Download Controls */}
              <div className="space-y-6 lg:col-span-4">
                {/* Display Options Panel */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Sliders className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Display Options
                    </h3>
                  </div>

                  <div className="space-y-1 divide-y divide-slate-100">
                    <ToggleSwitch
                      label="Show profile photo"
                      checked={options.showPhoto}
                      onChange={(val) =>
                        setOptions({ ...options, showPhoto: val })
                      }
                    />
                    <ToggleSwitch
                      label="Show contact information"
                      checked={options.showContact}
                      onChange={(val) =>
                        setOptions({ ...options, showContact: val })
                      }
                    />
                    <ToggleSwitch
                      label="Show about me"
                      checked={options.showAbout}
                      onChange={(val) =>
                        setOptions({ ...options, showAbout: val })
                      }
                    />
                    <ToggleSwitch
                      label="Show experience"
                      checked={options.showExperience}
                      onChange={(val) =>
                        setOptions({ ...options, showExperience: val })
                      }
                    />
                    <ToggleSwitch
                      label="Show education"
                      checked={options.showEducation}
                      onChange={(val) =>
                        setOptions({ ...options, showEducation: val })
                      }
                    />
                    <ToggleSwitch
                      label="Show skills"
                      checked={options.showSkills}
                      onChange={(val) =>
                        setOptions({ ...options, showSkills: val })
                      }
                    />
                    <ToggleSwitch
                      label="Show languages"
                      checked={options.showLanguages}
                      onChange={(val) =>
                        setOptions({ ...options, showLanguages: val })
                      }
                    />
                    <ToggleSwitch
                      label="Show projects"
                      checked={options.showProjects}
                      onChange={(val) =>
                        setOptions({ ...options, showProjects: val })
                      }
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
                      {copiedUrl ? 'Copied to clipboard' : 'Copy public link'}
                    </Button>
                  </div>

                  <div className="border-t border-slate-100 pt-3 text-center">
                    <Link
                      href={`/user/${publicSlug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View public portfolio</span>
                      <ExternalLink className="h-3 w-3" />
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

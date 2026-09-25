'use client';

import { useAuthStore, useUserStore } from '../../store';
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '../../components/AppSidebar';
import { AppHeader } from '../../components/AppHeader';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import {
    CheckCircle2,
    KeyRound,
    Loader2,
    LockKeyhole,
    LogOut,
    Mail,
    Monitor,
    ShieldCheck,
    Trash2,
} from 'lucide-react';

function Settings() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { profile, fetchProfile } = useUserStore();

    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [isLoggingOutSessions, setIsLoggingOutSessions] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        const data = profile || user;

        if (data?.email) {
            setEmail(data.email);
        }
    }, [profile, user]);

    const handleSaveEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        setEmailError(null);
        setEmailSuccess(false);

        if (!email.trim()) {
            setEmailError('Email is required');
            return;
        }

        setIsSavingEmail(true);

        try {
            const updated = await userService.updateEmail(email.trim());
            if (updated) {
                useAuthStore.getState().setUser(updated);
            }

            setEmailSuccess(true);

            setTimeout(() => {
                setEmailSuccess(false);
            }, 3000);
        } catch (err: any) {
            setEmailError(
                err?.message
                    ? Array.isArray(err.message)
                        ? err.message.join(', ')
                        : err.message
                    : 'An error occurred while updating email',
            );
        } finally {
            setIsSavingEmail(false);
            await fetchProfile();
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        setPasswordError(null);
        setPasswordSuccess(false);

        if (!currentPassword) {
            setPasswordError('Current password is required');
            return;
        }

        if (!newPassword) {
            setPasswordError('New password is required');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError('Password must contain at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setIsSavingPassword(true);

        try {
            await userService.changePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setPasswordSuccess(true);

            setTimeout(() => {
                setPasswordSuccess(false);
            }, 5000);
        } catch (err: any) {
            setPasswordError(
                err?.message
                    ? Array.isArray(err.message)
                        ? err.message.join(', ')
                        : err.message
                    : 'An error occurred while changing password',
            );
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleLogoutAllSessions = async () => {
        setIsLoggingOutSessions(true);

        try {
            await authService.logoutAll();
            await logout();
            router.push('/signin');
        } catch {
            await logout();
            router.push('/signin');
        } finally {
            setIsLoggingOutSessions(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.',
        );

        if (!confirmed) {
            return;
        }

        setIsDeletingAccount(true);

        try {
            await userService.deleteAccount();
            await logout();
            router.push('/signup');
        } catch (err: any) {
            alert(
                err?.message
                    ? Array.isArray(err.message)
                        ? err.message.join(', ')
                        : err.message
                    : 'Failed to delete account',
            );
        } finally {
            setIsDeletingAccount(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AppSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />

                <main className="flex-1 overflow-y-auto px-8 py-8">
                    <div className="mx-auto max-w-5xl space-y-6">
                        {/* Header */}
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                Account Settings
                            </h1>

                            <p className="text-sm text-slate-500">
                                Manage your account information, security and
                                active sessions.
                            </p>
                        </div>

                        {/* Email */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                                    <Mail className="h-5 w-5 text-emerald-600" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Email address
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        This email is used to sign in to your
                                        account.
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSaveEmail}
                                className="space-y-4"
                            >
                                <div className="max-w-xl">
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>

                                {emailError && (
                                    <p className="text-sm text-red-600">
                                        {emailError}
                                    </p>
                                )}

                                {emailSuccess && (
                                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Email updated successfully.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSavingEmail}
                                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSavingEmail && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}

                                    Save email
                                </button>
                            </form>
                        </section>

                        {/* Password */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                                    <LockKeyhole className="h-5 w-5 text-emerald-600" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Password
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Change the password you use to access
                                        your account.
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={handleChangePassword}
                                className="max-w-xl space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="currentPassword"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Current password
                                    </label>

                                    <input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                        placeholder="Enter your current password"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        New password
                                    </label>

                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="Enter a new password"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Confirm new password
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Repeat your new password"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <KeyRound className="h-4 w-4 text-emerald-600" />

                                        Password requirements
                                    </div>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Use at least 8 characters. A strong
                                        password should include uppercase and
                                        lowercase letters, numbers and special
                                        characters.
                                    </p>
                                </div>

                                {passwordError && (
                                    <p className="text-sm text-red-600">
                                        {passwordError}
                                    </p>
                                )}

                                {passwordSuccess && (
                                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Password changed successfully.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSavingPassword}
                                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSavingPassword && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}

                                    Change password
                                </button>
                            </form>
                        </section>

                        {/* Active Sessions */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Active sessions
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage devices that are currently
                                        signed in to your account.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between gap-4 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                            <Monitor className="h-5 w-5 text-slate-600" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Current device
                                                </p>

                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                    Active
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-slate-500">
                                                This is your current session
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Sign out everywhere
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        End all active sessions on other
                                        devices.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogoutAllSessions}
                                    disabled={isLoggingOutSessions}
                                    className="inline-flex shrink-0 items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                                >
                                    {isLoggingOutSessions ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="mr-2 h-4 w-4" />
                                    )}

                                    Log out all devices
                                </button>
                            </div>
                        </section>

                        {/* Danger Zone */}
                        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Danger zone
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Permanently delete your Devfolio
                                        account and all associated data.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-6 rounded-xl border border-red-100 bg-red-50/50 p-5">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Delete account
                                    </p>

                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                                        This will permanently delete your
                                        profile, public portfolio, projects,
                                        education, experience, languages,
                                        uploaded media and active sessions.
                                        This action cannot be undone.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeletingAccount}
                                    className="inline-flex shrink-0 items-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isDeletingAccount ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}

                                    Delete account
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
            }
        >
            <Settings />
        </Suspense>
    );
}

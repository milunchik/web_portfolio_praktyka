'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '../store/use-auth-store';

export function AuthPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, initialized, loadSession, loading, login, logout, user } = useAuthStore();

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login(email, password);
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
      <p className="text-sm font-medium text-slate-500">Authentication</p>

      {!initialized ? (
        <p className="mt-4 text-sm text-slate-600">Loading session…</p>
      ) : user ? (
        <div className="mt-4">
          <p className="font-semibold text-slate-900">Signed in as {user.fullName}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <button
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            disabled={loading}
            onClick={() => void logout()}
          >
            {loading ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      ) : (
        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Email
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Password
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            className="mt-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs text-slate-400">Requires the backend authentication API.</p>
        </form>
      )}
    </section>
  );
}

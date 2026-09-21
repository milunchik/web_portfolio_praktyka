import type { HealthResponse } from '@repo/contracts';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { AuthPanel } from './auth-panel';
import { Counter } from './counter';

async function getHealth(): Promise<HealthResponse | null> {
  try {
    const response = await fetch(`${process.env.API_URL ?? 'http://localhost:3001'}/health`, {
      cache: 'no-store',
    });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-xs mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Developer Portfolio Platform</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-[1.15]">
          Your code. <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Your story.
          </span>{' '}
          In one place.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
          Create a stunning developer portfolio, showcase your work, and open new opportunities with Devfolio.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Create your account
            </Button>
          </Link>
          <Link href="/signin">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Devfolio. Build. Share. Grow.</p>
      </footer>
    </main>
  );
}

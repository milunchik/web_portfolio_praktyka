import type { HealthResponse } from '@repo/contracts';
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
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          Tailwind CSS + Zustand
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">NestJS + Next.js</h1>
        <p className="mt-3 text-slate-600">
          API status:{' '}
          <span className={health ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-600'}>
            {health?.status ?? 'offline'}
          </span>
        </p>
        <AuthPanel />
        <Counter />
      </div>
    </main>
  );
}

'use client';

import { useCounterStore } from '../store/use-counter-store';

export function Counter() {
  const { count, decrement, increment, reset } = useCounterStore();

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Zustand counter</p>
      <p className="my-4 text-5xl font-bold tabular-nums text-slate-900">{count}</p>
      <div className="flex justify-center gap-3">
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700" onClick={decrement}>
          Decrease
        </button>
        <button className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100" onClick={reset}>
          Reset
        </button>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500" onClick={increment}>
          Increase
        </button>
      </div>
    </section>
  );
}

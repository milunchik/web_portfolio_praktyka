'use client';

import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  description,
}) => {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none py-1.5">
      <div className="space-y-0.5">
        <span className="text-xs font-semibold text-slate-700 block">{label}</span>
        {description && (
          <span className="text-[11px] text-slate-400 block">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
          checked ? 'bg-emerald-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};

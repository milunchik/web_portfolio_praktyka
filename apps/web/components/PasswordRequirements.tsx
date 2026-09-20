import React from 'react';
import { Check } from 'lucide-react';

interface PasswordRequirementsProps {
  password?: string;
  className?: string;
}

export interface PasswordRule {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (pw: string) => pw.length >= 8,
  },
  {
    id: 'number',
    label: 'Includes a number',
    test: (pw: string) => /\d/.test(pw),
  },
  {
    id: 'uppercase',
    label: 'Includes an uppercase letter',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    id: 'special',
    label: 'Includes a special character (e.g. !@#)',
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
];

export const isPasswordStrong = (pw: string) => {
  return passwordRules.every((rule) => rule.test(pw));
};

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password = '',
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 space-y-2 ${className}`}
    >
      {passwordRules.map((rule) => {
        const isValid = rule.test(password);
        return (
          <div
            key={rule.id}
            className={`flex items-center gap-2 transition-colors ${
              isValid ? 'text-emerald-700 font-medium' : 'text-slate-500'
            }`}
          >
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${
                isValid
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              <Check className="h-2.5 w-2.5 stroke-[3]" />
            </div>
            <span>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
};

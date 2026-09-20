import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightElement, error, helperText, type = 'text', className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
              leftIcon ? 'pl-10' : ''
            } ${isPassword || rightElement ? 'pr-11' : ''} ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300'
            } ${className}`}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 flex items-center text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : (
            rightElement && (
              <div className="absolute right-3.5 flex items-center text-slate-400">
                {rightElement}
              </div>
            )
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

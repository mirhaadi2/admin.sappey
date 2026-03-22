import React from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">{icon}</div>}
          <input
            ref={ref}
            className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-300'
            } disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <span>⚠</span> {error.message}
          </p>
        )}
        {helperText && !error && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

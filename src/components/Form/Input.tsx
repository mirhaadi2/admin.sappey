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
    const isCheckbox = props.type === 'checkbox';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {isCheckbox ? (
        <div className={`flex items-start gap-2 ${className}`}>
          <input
            ref={ref}
            autoComplete="off"
            className={`h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 transition-colors ${
              error ? 'border-red-500' : ''
            }`}
            {...props}
          />
          <div className="flex flex-col">
            {label && (
              <label className="text-sm font-medium text-slate-700">
                {label}
                {props.required && <span className="text-red-600 ml-1">*</span>}
              </label>
            )}
            {helperText && !error && (
              <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1">
                <span>⚠</span> {error.message}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          {label && (
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {label}
              {props.required && <span className="text-red-600 ml-1">*</span>}
            </label>
          )}
          <div className="relative">
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                {icon}
              </div>
            )}
            <input
              ref={ref}
              autoComplete="off"
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
          {helperText && !error && (
            <p className="mt-1 text-sm text-slate-500">{helperText}</p>
          )}
        </>
      )}
    </div>
  );
  }
);

Input.displayName = 'Input';

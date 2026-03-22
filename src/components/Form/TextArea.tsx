import React from 'react';
import { FieldError } from 'react-hook-form';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: FieldError;
  helperText?: string;
  fullWidth?: boolean;
  charLimit?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, fullWidth = true, charLimit, className = '', value, ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors resize-vertical ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-300'
          } disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        <div className="flex items-center justify-between mt-2">
          <div>
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span>⚠</span> {error.message}
              </p>
            )}
            {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
          </div>
          {charLimit && (
            <p className={`text-xs ${charCount > charLimit ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
              {charCount}/{charLimit}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

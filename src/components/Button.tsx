import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

// Updated to match your Blue/Indigo Portal Theme
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-sm active:scale-[0.98]',
  danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md hover:shadow-red-500/20 active:scale-[0.98]',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.98]',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-[0.98]',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-1.5 text-[15px]', // Slightly larger padding for a modern feel
  lg: 'px-4 py-2 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <CircleNotch size={18} className="animate-spin weight-bold" />
        ) : (
          icon && <span className="flex items-center">{icon}</span>
        )}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
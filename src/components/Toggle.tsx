import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  isLoading?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    isActive,
    isLoading = false,
    activeLabel = 'On',
    inactiveLabel = 'Off',
    size = 'md',
    disabled,
    className = '',
    ...props
  }, ref) => {
    
    // Adjusted container sizes to allow for padding
    const sizeStyles = {
      sm: 'w-10 h-6',
      md: 'w-12 h-7',
      lg: 'w-16 h-9',
    };

    const knobSizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-7 h-7',
    };

    // Calculation: (Container Width - Knob Width - (Left Padding + Right Padding))
    const knobTranslateStyles = {
      sm: 'translate-x-4', // 40px - 16px - 8px(padding)
      md: 'translate-x-5', // 48px - 20px - 8px(padding)
      lg: 'translate-x-7', // 64px - 28px - 8px(padding)
    };

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={isActive}
        disabled={disabled || isLoading}
        // Added "px-1" to ensure a consistent margin on both sides
        className={`relative inline-flex items-center px-1 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20'
            : 'bg-slate-300 shadow-inner'
        } ${className}`}
        {...props}
      >
        {/* Animated knob */}
        <span
          className={`inline-flex items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${knobSizeStyles[size]} ${
            isActive ? knobTranslateStyles[size] : 'translate-x-0'
          }`}
        >
          {isLoading && (
            <CircleNotch 
              size={size === 'sm' ? 12 : size === 'md' ? 14 : 18} 
              className="animate-spin text-blue-600" 
              weight="bold" 
            />
          )}
        </span>

        {/* Hidden label for accessibility */}
        <span className="sr-only">
          {isActive ? activeLabel : inactiveLabel}
        </span>
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
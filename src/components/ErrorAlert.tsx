import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Error',
  message,
  className = ''
}) => {
  return (
    <div className={`flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 ${className}`}>
      <WarningCircle size={24} weight="duotone" className="flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { CheckCircle, X, WarningCircle } from '@phosphor-icons/react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 4000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideDelay = Math.max(300, duration - 300);
    const hideTimer = setTimeout(() => setIsVisible(false), hideDelay);
    const closeTimer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
  };

  return (
    <div
      className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'} ${typeStyles[type]} z-[9999]`}
    >
      {type === 'success' && <CheckCircle size={20} className={iconColor[type]} weight="fill" />}
      {type === 'error' && <X size={20} className={iconColor[type]} weight="bold" />}
      {type === 'warning' && <WarningCircle size={20} className={iconColor[type]} weight="fill" />}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
};

export default Toast;

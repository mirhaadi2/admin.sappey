import React from 'react';

type StatusColor = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  color?: StatusColor;
  icon?: React.ReactNode;
  variant?: 'filled' | 'outline';
}

const colorMap: Record<StatusColor, { filled: string; outline: string }> = {
  success: {
    filled: 'bg-green-100 text-green-800',
    outline: 'border border-green-300 text-green-700',
  },
  warning: {
    filled: 'bg-yellow-100 text-yellow-800',
    outline: 'border border-yellow-300 text-yellow-700',
  },
  danger: {
    filled: 'bg-red-100 text-red-800',
    outline: 'border border-red-300 text-red-700',
  },
  info: {
    filled: 'bg-blue-100 text-blue-800',
    outline: 'border border-blue-300 text-blue-700',
  },
  default: {
    filled: 'bg-slate-100 text-slate-800',
    outline: 'border border-slate-300 text-slate-700',
  },
};

const dotColorMap: Record<StatusColor, string> = {
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600',
  info: 'bg-blue-600',
  default: 'bg-slate-600',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  color = 'default',
  icon,
  variant = 'filled',
}) => {
  const colorStyle = colorMap[color][variant];
  const dotColor = dotColorMap[color];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${colorStyle}`}>
      {!icon && <span className={`w-2 h-2 rounded-full ${dotColor}`} />}
      {icon && icon}
      <span>{status}</span>
    </span>
  );
};

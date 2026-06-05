'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-app-bg-deep disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] focus:ring-[#0066FF] shadow-sm shadow-[#0066FF]/20',
    secondary: 'bg-app-bg-surface hover:bg-app-border-base text-app-text-on-card border border-app-border-base focus:ring-app-border-base',
    ghost: 'hover:bg-app-bg-surface text-app-text-secondary hover:text-app-text-primary focus:ring-app-border-base',
    danger: 'bg-[#FF3B30] hover:bg-[#D62D20] text-[#F3F4F6] focus:ring-[#FF3B30] shadow-sm shadow-[#FF3B30]/20',
    success: 'bg-[#00C853] hover:bg-[#00A843] text-[#F3F4F6] focus:ring-[#00C853] shadow-sm shadow-[#00C853]/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}

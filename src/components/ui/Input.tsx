'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  prefixIcon,
  suffixIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#D1D5DB]">{label}</label>
      )}
      <div className="relative">
        {prefixIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
            {prefixIcon}
          </div>
        )}
        <input
          className={`
            w-full bg-[#181F32] border border-[#2A354D] rounded-lg px-3 py-2 text-sm
            text-[#F3F4F6] placeholder-[#6B7280]
            focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${prefixIcon ? 'pl-10' : ''}
            ${suffixIcon ? 'pr-10' : ''}
            ${error ? 'border-[#FF3B30] focus:ring-[#FF3B30]' : ''}
            ${className}
          `}
          {...props}
        />
        {suffixIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B7280]">
            {suffixIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-[#FF3B30]">{error}</p>
      )}
    </div>
  );
}

'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#D1D5DB]">{label}</label>
      )}
      <select
        className={`
          w-full bg-[#181F32] border border-[#2A354D] rounded-lg px-3 py-2 text-sm
          text-[#F3F4F6] placeholder-[#6B7280]
          focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[#FF3B30] focus:ring-[#FF3B30]' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-[#FF3B30]">{error}</p>
      )}
    </div>
  );
}

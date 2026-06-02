'use client';

import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = '搜索...', className = '' }: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (value && ref.current) ref.current.focus(); }, []);
  return (
    <div className={`flex-1 relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1E2736] border border-[#2A354D] rounded-lg pl-10 pr-8 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface FilterTabsProps {
  options: { label: string; value: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            value === opt.value
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-gray-400 hover:text-gray-300 border border-transparent'
          }`}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className="ml-1.5 text-xs opacity-60">({opt.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { FilterConfig } from './types';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;

  rightSlot?: React.ReactNode;
}

/**
 * 通用筛选条：左侧搜索 + 中间筛选 + 右侧自定义 slot
 */
export function FilterBar({
  searchPlaceholder = '搜索...',
  searchValue = '',
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  rightSlot,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-10 pr-9"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange?.('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            aria-label="清空搜索"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {filters.map((f) => (
        <div key={f.key} className={f.width || 'w-40'}>
          <Select
            value={filterValues[f.key] || ''}
            onChange={(e) => onFilterChange?.(f.key, e.target.value)}
            options={[{ value: '', label: `全部${f.label}` }, ...f.options]}
          />
        </div>
      ))}

      {rightSlot && <div className="flex items-center gap-2 ml-auto">{rightSlot}</div>}
    </div>
  );
}

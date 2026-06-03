'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BulkAction } from './types';

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  selectedIds: string[];
  onClear: () => void;
}

/**
 * 批量操作条：选中 N 项时显示在表格上方
 */
export function BulkActionBar({ selectedCount, actions, selectedIds, onClear }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-blue-300">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-medium">
          {selectedCount}
        </span>
        <span>已选择 {selectedCount} 项</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {actions.map((action) => {
          const variant = action.danger ? 'danger' : 'secondary';
          const size = 'sm' as const;
          return (
            <Button
              key={action.key}
              variant={variant}
              size={size}
              disabled={action.disabled}
              onClick={() => action.onClick(selectedIds)}
              icon={action.icon}
            >
              {action.label}
            </Button>
          );
        })}
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

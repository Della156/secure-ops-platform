'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

/**
 * 详情抽屉（右侧滑出）
 */
export function DetailDrawer({
  open,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
  footer,
}: DetailDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="关闭详情"
      />

      {/* 抽屉主体 */}
      <div
        className={`relative w-full ${width} h-full bg-[#111625] border-l border-[#2A354D] flex flex-col animate-in slide-in-from-right`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
          <h3 className="text-lg font-semibold text-slate-50">{title || '详情'}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* 底部 */}
        {footer && (
          <div className="px-6 py-3 border-t border-[#2A354D] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function Empty({
  title = '暂无数据',
  description = '当前没有可显示的内容',
  icon,
  action,
}: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-[#2A354D] mb-4">
        {icon || <Inbox className="w-16 h-16" />}
      </div>
      <h3 className="text-lg font-medium text-[#9CA3AF] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#6B7280] mb-4 max-w-xs text-center">{description}</p>
      )}
      {action}
    </div>
  );
}

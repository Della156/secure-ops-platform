'use client';

import React from 'react';

interface LoadingProps {
  text?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ text = '加载中...', fullPage = false, size = 'md' }: LoadingProps) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`animate-spin rounded-full border-[#0066FF] border-t-transparent ${sizes[size]}`}
      />
      <p className="text-[#9CA3AF] text-sm">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {spinner}
      </div>
    );
  }

  return spinner;
}

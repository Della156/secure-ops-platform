'use client';

import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Loading } from './ui/Loading';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function PageShell({
  title,
  description,
  breadcrumb,
  actions,
  children,
  loading = false,
  error = null,
  onRetry,
  className = '',
}: PageShellProps) {
  // 加载状态
  if (loading) {
    return (
      <div className="p-4">
        <Loading fullPage text="页面加载中..." />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-[#FF3B30] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#F3F4F6] mb-2">加载失败</h2>
          <p className="text-[#9CA3AF] mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
            >
              重试
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      {/* 面包屑 — 紧凑导航 */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-6">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={index === breadcrumb.length - 1 ? 'text-[#9CA3AF]' : ''}>
                {item.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* 内容区域 */}
      {children}
    </div>
  );
}

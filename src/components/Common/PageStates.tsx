'use client';

import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export function LoadingState({ message = '加载中...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-400" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = '加载失败', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
      <span className="text-sm text-red-300 mb-4">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
        >
          重新加载
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = '暂无数据', icon }: { message?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      {icon || <Inbox className="w-10 h-10 mb-3" />}
      <span className="text-sm">{message}</span>
    </div>
  );
}

export function LoadingSkeleton({ rows = 3, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-[#2A354D] rounded animate-pulse flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface ActionConfig {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  loading?: boolean;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode | ActionConfig[] }) {
  const renderActions = (): React.ReactNode => {
    if (!actions) return null;
    if (Array.isArray(actions) && actions.length > 0 && 'icon' in actions[0] && 'label' in actions[0] && 'onClick' in actions[0]) {
      return (actions as ActionConfig[]).map((action, i) => {
        const Icon = action.icon;
        return (
          <button
            key={i}
            onClick={action.onClick}
            disabled={action.loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042] disabled:opacity-50"
          >
            {action.loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            {action.label}
          </button>
        );
      });
    }
    return actions as React.ReactNode;
  };

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{renderActions()}</div>}
    </div>
  );
}

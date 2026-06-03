'use client';

import React from 'react';
import { AlertOctagon, RefreshCw, Lightbulb, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FailureAnalysisProps {
  reason: string;
  suggestion?: string;
  onRetry?: () => void;
}

/**
 * 失败归因面板
 */
export function FailureAnalysis({ reason, suggestion, onRetry }: FailureAnalysisProps) {
  return (
    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
      <div className="flex items-start gap-2 mb-2">
        <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-300">失败原因</p>
          <p className="text-xs text-red-200/80 mt-0.5">{reason}</p>
        </div>
      </div>
      {suggestion && (
        <div className="flex items-start gap-2 ml-6 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-yellow-300">建议</p>
            <p className="text-xs text-slate-300 mt-0.5">{suggestion}</p>
          </div>
        </div>
      )}
      {onRetry && (
        <div className="ml-6 mt-2">
          <Button variant="primary" size="sm" onClick={onRetry}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />一键重试
          </Button>
        </div>
      )}
    </div>
  );
}

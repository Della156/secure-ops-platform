'use client';

import React from 'react';
import { Check, X, User, ChevronRight, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import type { ApprovalLevel } from './types';

interface ApprovalConfigProps {
  levels: ApprovalLevel[];
}

/**
 * 审批流配置：多级审批（初审→复核→发布）
 */
export function ApprovalConfig({ levels }: ApprovalConfigProps) {
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          审批流配置
        </h3>

        <div className="flex items-center gap-2">
          {levels.map((lvl, idx) => (
            <React.Fragment key={lvl.level}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    lvl.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    lvl.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-[#0066FF]/20 text-blue-400'
                  }`}>
                    {lvl.status === 'approved' ? <Check className="w-4 h-4" /> :
                     lvl.status === 'rejected' ? <X className="w-4 h-4" /> :
                     lvl.level}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{lvl.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3" />{lvl.approver}
                    </p>
                  </div>
                </div>
                <div className="ml-9">
                  <StatusBadge
                    status={
                      lvl.status === 'approved' ? 'success' :
                      lvl.status === 'rejected' ? 'failed' :
                      'pending'
                    }
                  />
                </div>
              </div>
              {idx < levels.length - 1 && (
                <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <Card>
        <h4 className="text-sm font-medium text-slate-300 mb-3">审批规则</h4>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <span>高风险/关键策略：需 {levels.length} 级审批通过后方可发布</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <span>中风险策略：需 2 级审批</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <span>低风险策略：可自动通过</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <span>任一级审批驳回，流程立即终止并通知提交人</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

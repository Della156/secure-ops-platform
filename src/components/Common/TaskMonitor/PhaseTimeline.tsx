'use client';

import React from 'react';
import { Check, Clock, FileText, Send, Shield, CheckCircle2 } from 'lucide-react';
import type { TaskPhase } from './types';

const PHASES: { key: TaskPhase; label: string; icon: any; description: string }[] = [
  { key: 'submitted', label: '提交', icon: FileText, description: '工单已创建' },
  { key: 'reviewing', label: '审核', icon: Shield, description: '等待审批' },
  { key: 'dispatching', label: '下发', icon: Send, description: '下发到设备' },
  { key: 'verifying', label: '校验', icon: Clock, description: '执行校验中' },
  { key: 'done', label: '完成', icon: CheckCircle2, description: '任务结束' },
];

interface PhaseTimelineProps {
  currentPhase: TaskPhase;
  failed?: boolean;
}

/**
 * 阶段时间轴：5 阶段（提交→审核→下发→校验→完成）
 */
export function PhaseTimeline({ currentPhase, failed = false }: PhaseTimelineProps) {
  const currentIdx = PHASES.findIndex((p) => p.key === currentPhase);

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isComplete = failed ? idx < currentIdx : idx < currentIdx;
          const isCurrent = !failed && idx === currentIdx;
          const isFailed = failed && idx === currentIdx;
          return (
            <React.Fragment key={phase.key}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isFailed ? 'border-red-500 bg-red-500/20' :
                    isComplete ? 'border-green-500 bg-green-500/20' :
                    isCurrent ? 'border-blue-500 bg-blue-500/20 animate-pulse' :
                    'border-[#2A354D] bg-[#111625]'
                  }`}
                >
                  {isFailed ? (
                    <span className="text-red-400 text-sm font-bold">!</span>
                  ) : isComplete ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Icon className={`w-4 h-4 ${
                      isCurrent ? 'text-blue-400' : 'text-slate-500'
                    }`} />
                  )}
                </div>
                <p className={`text-[10px] mt-1 ${
                  isFailed ? 'text-red-400' :
                  isComplete ? 'text-green-400' :
                  isCurrent ? 'text-blue-400' :
                  'text-slate-500'
                }`}>
                  {phase.label}
                </p>
              </div>
              {idx < PHASES.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 -mt-3 ${
                  isComplete ? 'bg-green-500' : 'bg-[#2A354D]'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 text-center">
        {failed
          ? `${PHASES[currentIdx]?.label}阶段失败`
          : `当前: ${PHASES[currentIdx]?.label} - ${PHASES[currentIdx]?.description}`}
      </p>
    </div>
  );
}

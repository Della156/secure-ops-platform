'use client';

import React, { useState } from 'react';
import { GitCommit, History, RotateCcw, Eye, User, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import type { PolicyVersion } from './types';

interface VersionHistoryProps {
  versions: PolicyVersion[];
}

/**
 * 版本历史：版本列表 + 差异对比 + 回滚
 */
export function VersionHistory({ versions }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(
    versions.find((v) => v.isCurrent)?.version || null
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 左侧：版本列表 */}
      <Card padding="none" className="lg:col-span-1">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-200">版本列表</h3>
        </div>
        <div className="divide-y divide-[#2A354D] max-h-[600px] overflow-y-auto">
          {versions.map((v) => {
            const isSelected = selectedVersion === v.version;
            return (
              <button
                key={v.version}
                onClick={() => setSelectedVersion(v.version)}
                className={`w-full px-4 py-3 text-left hover:bg-[#1A2236] transition-colors ${
                  isSelected ? 'bg-[#1A2236]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-mono font-semibold text-blue-400">
                    {v.version}
                  </span>
                  {v.isCurrent && (
                    <StatusBadge status="success" />
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-1.5">{v.notes}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />{v.releasedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{v.releasedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitCommit className="w-3 h-3" />{v.changeCount} 处变更
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 右侧：版本详情 */}
      <Card className="lg:col-span-2">
        {selectedVersion ? (
          <VersionDetail version={versions.find((v) => v.version === selectedVersion)!} />
        ) : (
          <p className="text-center text-slate-500 py-12">请选择左侧版本查看详情</p>
        )}
      </Card>
    </div>
  );
}

function VersionDetail({ version }: { version: PolicyVersion }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-mono font-bold text-blue-400">{version.version}</h3>
            {version.isCurrent && <StatusBadge status="success" />}
          </div>
          <p className="text-sm text-slate-400">{version.notes}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-3.5 h-3.5 mr-1" />查看差异
          </Button>
          {!version.isCurrent && (
            <Button variant="secondary" size="sm">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />回滚到此版本
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-[#111625] rounded-lg">
          <p className="text-xs text-slate-500">发布人</p>
          <p className="text-sm text-slate-200 mt-0.5">{version.releasedBy}</p>
        </div>
        <div className="p-3 bg-[#111625] rounded-lg">
          <p className="text-xs text-slate-500">发布时间</p>
          <p className="text-sm text-slate-200 mt-0.5">{version.releasedAt}</p>
        </div>
        <div className="p-3 bg-[#111625] rounded-lg">
          <p className="text-xs text-slate-500">变更数</p>
          <p className="text-sm text-slate-200 mt-0.5">{version.changeCount} 处</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">变更内容</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start gap-2 p-2 rounded bg-green-500/10 text-green-400">
            <span className="font-mono">+</span>
            <span>新增：账户锁定阈值从 5 次提升至 3 次</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded bg-green-500/10 text-green-400">
            <span className="font-mono">+</span>
            <span>新增：日志保留时长从 90 天延长至 180 天</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded bg-yellow-500/10 text-yellow-400">
            <span className="font-mono">~</span>
            <span>修改：密码复杂度要求增强（增加符号要求）</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded bg-red-500/10 text-red-400">
            <span className="font-mono">-</span>
            <span>移除：telnet 协议支持（已废弃）</span>
          </div>
        </div>
      </div>
    </div>
  );
}

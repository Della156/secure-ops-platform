'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { ComplianceMappingItem as Mapping } from './types';

interface ComplianceMappingProps {
  frameworks: string[];
  mappings: Mapping[];
}

/**
 * 合规映射：等保/CIS/SOX/GDPR 条款映射矩阵
 */
export function ComplianceMapping({ frameworks, mappings }: ComplianceMappingProps) {
  const [activeFramework, setActiveFramework] = useState(frameworks[0] || '');

  const filtered = mappings.filter((m) => m.framework === activeFramework);

  // 统计
  const totalClauses = filtered.length;
  const covered = filtered.filter((m) => m.coverage >= 0.8).length;
  const partial = filtered.filter((m) => m.coverage >= 0.4 && m.coverage < 0.8).length;
  const uncovered = filtered.filter((m) => m.coverage < 0.4).length;
  const overallCoverage = totalClauses > 0
    ? filtered.reduce((sum, m) => sum + m.coverage, 0) / totalClauses
    : 0;

  return (
    <div className="space-y-4">
      {/* 框架切换 Tab */}
      <div className="flex items-center gap-2 border-b border-[#2A354D]">
        {frameworks.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFramework(f)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeFramework === f
                ? 'border-[#0066FF] text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">总覆盖率</p>
              <p className="text-xl font-bold text-slate-50">{(overallCoverage * 100).toFixed(1)}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">完全覆盖</p>
              <p className="text-xl font-bold text-green-400">{covered}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">部分覆盖</p>
              <p className="text-xl font-bold text-yellow-400">{partial}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">未覆盖</p>
              <p className="text-xl font-bold text-red-400">{uncovered}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 条款列表 */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-medium">条款编号</th>
                <th className="px-4 py-3 text-left font-medium">条款名称</th>
                <th className="px-4 py-3 text-left font-medium">关联策略</th>
                <th className="px-4 py-3 text-left font-medium">覆盖率</th>
                <th className="px-4 py-3 text-left font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const status =
                  m.coverage >= 0.8 ? 'success' :
                  m.coverage >= 0.4 ? 'warning' :
                  'failed';
                const statusText =
                  m.coverage >= 0.8 ? '已覆盖' :
                  m.coverage >= 0.4 ? '部分覆盖' :
                  '未覆盖';
                return (
                  <tr key={m.clause} className="border-t border-[#2A354D] hover:bg-[#1A2236]">
                    <td className="px-4 py-3 font-mono text-blue-400">{m.clause}</td>
                    <td className="px-4 py-3 text-slate-200">{m.clauseName}</td>
                    <td className="px-4 py-3 text-slate-400">{m.policyCount} 个</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[120px] bg-[#111625] rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'success' ? 'bg-green-500' :
                              status === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${m.coverage * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-10">
                          {(m.coverage * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={status as any} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

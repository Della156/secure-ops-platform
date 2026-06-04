'use client';

import React, { useState } from 'react';
import { Search, Filter, Play, RefreshCw, CheckCircle2, AlertTriangle, XCircle, TrendingUp, Target, Award } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const policies = [
  { id: 'policy-001', name: '恶意软件检测策略', tool: 'EPP', effectiveness: 92, coverage: 98, lastEvaluation: '2026-06-03 08:00', status: 'effective' },
  { id: 'policy-002', name: '入侵行为检测规则', tool: 'HIDS', effectiveness: 85, coverage: 95, lastEvaluation: '2026-06-03 07:30', status: 'effective' },
  { id: 'policy-003', name: '文件完整性监控', tool: 'FIM', effectiveness: 78, coverage: 88, lastEvaluation: '2026-06-03 07:00', status: 'warning' },
  { id: 'policy-004', name: '网络流量分析规则', tool: 'NTA', effectiveness: 95, coverage: 92, lastEvaluation: '2026-06-03 06:30', status: 'effective' },
  { id: 'policy-005', name: '漏洞扫描策略', tool: 'VS', effectiveness: 45, coverage: 60, lastEvaluation: '2026-05-28 10:00', status: 'ineffective' },
];

const statusConfig = {
  effective: { label: '有效', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  warning: { label: '需优化', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertTriangle },
  ineffective: { label: '无效', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-3 h-3" />;

export function ToolPolicyEvaluation() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredPolicies = policies.filter(policy => {
    if (search && !policy.name.includes(search) && !policy.tool.includes(search)) return false;
    if (statusFilter && policy.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: policies.length,
    effective: policies.filter(p => p.status === 'effective').length,
    avgEffectiveness: Math.round(policies.reduce((sum, p) => sum + p.effectiveness, 0) / policies.length),
    avgCoverage: Math.round(policies.reduce((sum, p) => sum + p.coverage, 0) / policies.length),
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="工具策略有效性评估" description="评估主机安全策略的有效性"
        actions={[
          { icon: Play, label: '执行评估', onClick: () => {} },
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">策略总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">有效策略</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{stats.effective}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">平均有效性</span>
          </div>
          <div className="text-2xl font-semibold text-[#0066FF]">{stats.avgEffectiveness}%</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-sm text-[#9CA3AF]">平均覆盖率</span>
          </div>
          <div className="text-2xl font-semibold text-[#F59E0B]">{stats.avgCoverage}%</div>
        </div>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="搜索策略名称"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="effective">有效</option>
              <option value="warning">需优化</option>
              <option value="ineffective">无效</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">策略名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">所属工具</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">有效性</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">覆盖率</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">最后评估时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map(policy => {
                const config = statusConfig[policy.status];
                const Icon = config.icon;
                return (
                  <tr key={policy.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6] font-medium">{policy.name}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{policy.tool}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#181F32] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${policy.effectiveness >= 80 ? 'bg-[#00D4AA]' : policy.effectiveness >= 60 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                            style={{ width: `${policy.effectiveness}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#F3F4F6]">{policy.effectiveness}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#181F32] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${policy.coverage >= 90 ? 'bg-[#00D4AA]' : policy.coverage >= 70 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                            style={{ width: `${policy.coverage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#F3F4F6]">{policy.coverage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                        <IconComponent icon={Icon} />
                        {config.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{policy.lastEvaluation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
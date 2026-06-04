'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, RefreshCw, Shield, CheckCircle2, AlertTriangle, Clock, FileText } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const policies = [
  { id: 'policy-001', name: '终端防火墙策略', scope: '全部终端', status: 'active', applied: 156, total: 160, lastUpdate: '2026-06-03 08:00' },
  { id: 'policy-002', name: '杀毒软件强制策略', scope: '全部终端', status: 'active', applied: 158, total: 160, lastUpdate: '2026-06-03 07:30' },
  { id: 'policy-003', name: 'USB设备管控策略', scope: '办公终端', status: 'active', applied: 89, total: 95, lastUpdate: '2026-06-03 07:00' },
  { id: 'policy-004', name: '屏幕保护策略', scope: '全部终端', status: 'inactive', applied: 0, total: 160, lastUpdate: '2026-05-28 10:00' },
  { id: 'policy-005', name: '软件白名单策略', scope: '服务器终端', status: 'active', applied: 23, total: 25, lastUpdate: '2026-06-03 06:30' },
];

const statusConfig = {
  active: { label: '生效中', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  inactive: { label: '已停用', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-3 h-3" />;

export function EndpointPolicyManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredPolicies = policies.filter(policy => {
    if (search && !policy.name.includes(search) && !policy.scope.includes(search)) return false;
    if (statusFilter && policy.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    avgAppliedRate: Math.round(policies.reduce((sum, p) => sum + (p.applied / p.total) * 100, 0) / policies.length),
    totalEndpoints: policies.reduce((sum, p) => sum + p.total, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="终端安全策略管理" description="管理终端安全策略"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Plus, label: '新建策略', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">策略总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">生效策略</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{stats.active}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">平均应用率</span>
          </div>
          <div className="text-2xl font-semibold text-[#0066FF]">{stats.avgAppliedRate}%</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-sm text-[#9CA3AF]">覆盖终端</span>
          </div>
          <div className="text-2xl font-semibold text-[#F59E0B]">{stats.totalEndpoints}</div>
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
              <option value="active">生效中</option>
              <option value="inactive">已停用</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">策略名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">适用范围</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">应用情况</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">最后更新</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map(policy => {
                const config = statusConfig[policy.status];
                const Icon = config.icon;
                return (
                  <tr key={policy.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6] font-medium">{policy.name}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{policy.scope}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                        <IconComponent icon={Icon} />
                        {config.label}
                      </span>
                    </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#181F32] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${(policy.applied / policy.total) >= 0.9 ? 'bg-[#00D4AA]' : (policy.applied / policy.total) >= 0.7 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                          style={{ width: `${(policy.applied / policy.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#F3F4F6]">{policy.applied}/{policy.total}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{policy.lastUpdate}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#181F32] rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#181F32] rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
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
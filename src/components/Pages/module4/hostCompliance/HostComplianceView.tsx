'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, RefreshCw, Server, Shield, CheckCircle2, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const tools = [
  { id: 'tool-001', name: 'Host Intrusion Detection', type: 'HIDS', status: 'active', coverage: 95, lastUpdate: '2026-06-03 08:00' },
  { id: 'tool-002', name: 'Endpoint Protection', type: 'EPP', status: 'active', coverage: 88, lastUpdate: '2026-06-03 07:30' },
  { id: 'tool-003', name: 'File Integrity Monitor', type: 'FIM', status: 'warning', coverage: 72, lastUpdate: '2026-06-03 07:00' },
  { id: 'tool-004', name: 'Network Traffic Analyzer', type: 'NTA', status: 'active', coverage: 91, lastUpdate: '2026-06-03 06:30' },
  { id: 'tool-005', name: 'Vulnerability Scanner', type: 'VS', status: 'error', coverage: 45, lastUpdate: '2026-05-28 10:00' },
];

const statusConfig = {
  active: { label: '正常', color: 'bg-green-500/20 text-green-400' },
  warning: { label: '警告', color: 'bg-yellow-500/20 text-yellow-400' },
  error: { label: '异常', color: 'bg-red-500/20 text-red-400' },
};

export function HostComplianceView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTools = tools.filter(tool => {
    if (search && !tool.name.includes(search) && !tool.type.includes(search)) return false;
    if (statusFilter && tool.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalTools: tools.length,
    activeTools: tools.filter(t => t.status === 'active').length,
    avgCoverage: Math.round(tools.reduce((sum, t) => sum + t.coverage, 0) / tools.length),
    warningTools: tools.filter(t => t.status === 'warning').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="主机合规管理视图" description="综合展示主机合规管理任务相关信息"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Plus, label: '添加工具', onClick: () => {} },
        ]}
      />

      <StatsCardGrid>
        <StatsCard title="工具总数" value={stats.totalTools} icon={<Server className="w-5 h-5" />} />
        <StatsCard title="正常运行" value={stats.activeTools} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="平均覆盖率" value={`${stats.avgCoverage}%`} icon={<Activity className="w-5 h-5" />} color="blue" />
        <StatsCard title="需关注" value={stats.warningTools} icon={<AlertTriangle className="w-5 h-5" />} color="yellow" />
      </StatsCardGrid>

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
                placeholder="搜索工具名称或类型"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="active">正常</option>
              <option value="warning">警告</option>
              <option value="error">异常</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
          {filteredTools.map(tool => (
            <div key={tool.id} className="p-4 bg-[#161B22] rounded-lg border border-[#2A354D] hover:border-[#3A4553] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#0066FF]" />
                  <div>
                    <div className="font-medium text-[#F3F4F6]">{tool.name}</div>
                    <div className="text-sm text-[#9CA3AF]">{tool.type}</div>
                  </div>
                </div>
                <StatusBadge status={tool.status} />
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                  <span>覆盖率</span>
                  <span>{tool.coverage}%</span>
                </div>
                <div className="h-2 bg-[#181F32] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${tool.coverage >= 80 ? 'bg-[#00D4AA]' : tool.coverage >= 60 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                    style={{ width: `${tool.coverage}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">更新: {tool.lastUpdate}</span>
                <button className="p-1.5 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#181F32] rounded transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
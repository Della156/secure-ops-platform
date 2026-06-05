'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, RefreshCw, Calendar, Package, CheckCircle2, AlertTriangle, Clock, Download } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const patches = [
  { id: 'PATCH-001', name: 'Windows KB5034441', severity: 'critical', status: 'pending', releasedAt: '2026-06-03', affectedAssets: 156 },
  { id: 'PATCH-002', name: 'Linux Kernel 6.5.0', severity: 'high', status: 'deploying', releasedAt: '2026-06-02', affectedAssets: 89 },
  { id: 'PATCH-003', name: 'Apache HTTP Server 2.4.58', severity: 'medium', status: 'completed', releasedAt: '2026-06-01', affectedAssets: 45 },
  { id: 'PATCH-004', name: 'MySQL 8.4.1', severity: 'high', status: 'pending', releasedAt: '2026-05-31', affectedAssets: 23 },
  { id: 'PATCH-005', name: 'OpenSSL 3.2.1', severity: 'critical', status: 'testing', releasedAt: '2026-05-30', affectedAssets: 178 },
];

const severityConfig = {
  critical: { label: '严重', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
  high: { label: '高危', color: 'bg-orange-500/20 text-orange-400', icon: AlertTriangle },
  medium: { label: '中危', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  low: { label: '低危', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
};

const IconComponent = ({ icon: Icon }: { icon: any }) => <Icon className="w-3 h-3" />;

const statusConfig = {
  pending: { label: '待部署', color: 'bg-gray-500/20 text-gray-400' },
  testing: { label: '测试中', color: 'bg-blue-500/20 text-blue-400' },
  deploying: { label: '部署中', color: 'bg-purple-500/20 text-purple-400' },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-400' },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400' },
};

export function PatchManagementView() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredPatches = patches.filter(patch => {
    if (search && !patch.name.includes(search) && !patch.id.includes(search)) return false;
    if (severityFilter && patch.severity !== severityFilter) return false;
    if (statusFilter && patch.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalPatches: patches.length,
    criticalPatches: patches.filter(p => p.severity === 'critical').length,
    pendingPatches: patches.filter(p => p.status === 'pending').length,
    deployedPatches: patches.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁管理视图" description="综合展示补丁管理任务相关信息"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Download, label: '导出', onClick: () => {} },
        ]}
      />

      <StatsCardGrid>
        <StatsCard title="补丁总数" value={stats.totalPatches} icon={<Package className="w-5 h-5" />} />
        <StatsCard title="严重补丁" value={stats.criticalPatches} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <StatsCard title="待部署" value={stats.pendingPatches} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatsCard title="已部署" value={stats.deployedPatches} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
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
                placeholder="搜索补丁名称或ID"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6E7681]" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部级别</option>
                <option value="critical">严重</option>
                <option value="high">高危</option>
                <option value="medium">中危</option>
                <option value="low">低危</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部状态</option>
                <option value="pending">待部署</option>
                <option value="testing">测试中</option>
                <option value="deploying">部署中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors">
            <Plus className="w-4 h-4" />
            <span>新增补丁</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">补丁ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">补丁名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">严重级别</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">发布时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">影响资产数</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatches.map(patch => {
                const severity = severityConfig[patch.severity as keyof typeof severityConfig];
                const SeverityIcon = severity.icon;
                return (
                  <tr key={patch.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6]">{patch.id}</td>
                    <td className="py-3 px-4 text-[#F3F4F6]">{patch.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${severity.color}`}>
                        <IconComponent icon={SeverityIcon} />
                        {severity.label}
                      </span>
                    </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={patch.status} />
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{patch.releasedAt}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{patch.affectedAssets}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#181F32] rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-[#2A354D]">
          <span className="text-sm text-[#9CA3AF]">显示 1-{filteredPatches.length} 条，共 {patches.length} 条</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded disabled:opacity-50" disabled>上一页</button>
            <button className="px-3 py-1 text-sm bg-[#0066FF] text-white rounded">1</button>
            <button className="px-3 py-1 text-sm text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
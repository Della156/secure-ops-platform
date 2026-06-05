'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, RefreshCw, Smartphone, Shield, CheckCircle2, AlertTriangle, Clock, User } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const endpoints = [
  { id: 'ep-001', name: 'PC-WIN-001', user: '张三', os: 'Windows 10', agent: '已安装', status: 'compliant', lastCheck: '2026-06-03 08:00' },
  { id: 'ep-002', name: 'PC-WIN-002', user: '李四', os: 'Windows 11', agent: '已安装', status: 'compliant', lastCheck: '2026-06-03 07:30' },
  { id: 'ep-003', name: 'PC-MAC-001', user: '王五', os: 'macOS 14', agent: '已安装', status: 'warning', lastCheck: '2026-06-03 07:00' },
  { id: 'ep-004', name: 'PC-LIN-001', user: '赵六', os: 'Ubuntu 22.04', agent: '未安装', status: 'non_compliant', lastCheck: '2026-05-28 10:00' },
  { id: 'ep-005', name: 'LAPTOP-001', user: '钱七', os: 'Windows 11', agent: '已安装', status: 'compliant', lastCheck: '2026-06-03 06:30' },
];

const statusConfig = {
  compliant: { label: '合规', color: 'bg-green-500/20 text-green-400' },
  warning: { label: '警告', color: 'bg-yellow-500/20 text-yellow-400' },
  non_compliant: { label: '不合规', color: 'bg-red-500/20 text-red-400' },
};

export function EndpointComplianceView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredEndpoints = endpoints.filter(ep => {
    if (search && !ep.name.includes(search) && !ep.user.includes(search)) return false;
    if (statusFilter && ep.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: endpoints.length,
    compliant: endpoints.filter(e => e.status === 'compliant').length,
    warning: endpoints.filter(e => e.status === 'warning').length,
    nonCompliant: endpoints.filter(e => e.status === 'non_compliant').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="终端合规管理视图" description="综合展示终端合规管理任务相关信息"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Plus, label: '添加终端', onClick: () => {} },
        ]}
      />

      <StatsCardGrid>
        <StatsCard title="终端总数" value={stats.total} icon={<Smartphone className="w-5 h-5" />} />
        <StatsCard title="合规终端" value={stats.compliant} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="警告终端" value={stats.warning} icon={<AlertTriangle className="w-5 h-5" />} color="yellow" />
        <StatsCard title="不合规终端" value={stats.nonCompliant} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
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
                placeholder="搜索终端名称或用户"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="compliant">合规</option>
              <option value="warning">警告</option>
              <option value="non_compliant">不合规</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Shield className="w-4 h-4" />
            <span>合规率: {Math.round((stats.compliant / stats.total) * 100)}%</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">终端名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">用户</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作系统</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">代理状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">合规状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">最后检查</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEndpoints.map(ep => (
                <tr key={ep.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                  <td className="py-3 px-4 text-[#F3F4F6] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#0066FF]" />
                    {ep.name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#9CA3AF]" />
                      <span className="text-[#F3F4F6]">{ep.user}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{ep.os}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${ep.agent === '已安装' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {ep.agent}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={ep.status} />
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ep.lastCheck}
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-2 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#181F32] rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
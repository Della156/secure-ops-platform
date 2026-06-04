'use client';
import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, RefreshCw, Clock, CheckCircle2, XCircle, Package } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const history = [
  { id: 'hist-001', name: 'Windows 补丁批量更新', date: '2026-06-03', time: '08:00-08:30', status: 'success', hosts: 50, success: 48, fail: 2 },
  { id: 'hist-002', name: 'Linux 安全补丁部署', date: '2026-06-03', time: '07:30-07:45', status: 'success', hosts: 20, success: 20, fail: 0 },
  { id: 'hist-003', name: '数据库补丁升级', date: '2026-06-02', time: '14:00-14:20', status: 'success', hosts: 5, success: 5, fail: 0 },
  { id: 'hist-004', name: '应用服务器补丁更新', date: '2026-06-02', time: '10:00-10:15', status: 'failed', hosts: 15, success: 12, fail: 3 },
  { id: 'hist-005', name: '全量补丁扫描', date: '2026-06-01', time: '09:00-09:30', status: 'success', hosts: 100, success: 98, fail: 2 },
];

const statusConfig = {
  success: { label: '成功', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

export function PatchManagementHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredHistory = history.filter(item => {
    if (search && !item.name.includes(search)) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁管理任务历史查询" description="查询补丁管理任务历史记录"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Download, label: '导出', onClick: () => {} },
        ]}
      />

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
                placeholder="搜索任务名称"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg">
              <Calendar className="w-4 h-4 text-[#6E7681]" />
              <input
                type="date"
                className="bg-transparent text-[#F3F4F6] focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">任务名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">执行日期</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">执行时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">主机数</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">成功/失败</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(item => {
                const config = statusConfig[item.status];
                const Icon = config.icon;
                return (
                  <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6] flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#0066FF]" />
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{item.date}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#F3F4F6]">{item.hosts}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-400">{item.success}</span>
                      <span className="text-[#6E7681]"> / </span>
                      <span className="text-red-400">{item.fail}</span>
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
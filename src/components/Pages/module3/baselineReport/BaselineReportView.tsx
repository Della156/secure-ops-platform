'use client';

import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Plus, Eye, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader, LoadingState } from '@/components/Common/PageStates';

const reports = [
  { id: 'BR-001', name: '主机安全基线检查', status: 'completed', totalItems: 100, compliant: 89, nonCompliant: 11, reportTime: '2026-06-01 08:00' },
  { id: 'BR-002', name: '网络安全基线检查', status: 'running', totalItems: 80, compliant: 45, nonCompliant: 23, reportTime: '2026-06-02 08:00' },
  { id: 'BR-003', name: '应用安全基线检查', status: 'pending', totalItems: 60, compliant: 0, nonCompliant: 0, reportTime: '2026-06-03 00:00' },
  { id: 'BR-004', name: '数据库基线检查', status: 'failed', totalItems: 46, compliant: 34, nonCompliant: 12, reportTime: '2026-06-02 06:00' },
  { id: 'BR-005', name: '系统安全基线检查', status: 'completed', totalItems: 120, compliant: 115, nonCompliant: 5, reportTime: '2026-06-03 08:00' },
];

export function BaselineReportView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading] = useState(false);

  const filteredReports = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    if (statusFilter && report.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalTasks: reports.length,
    totalItems: reports.reduce((sum, r) => sum + r.totalItems, 0),
    totalCompliant: reports.reduce((sum, r) => sum + r.compliant, 0),
    totalNonCompliant: reports.reduce((sum, r) => sum + r.nonCompliant, 0),
  };

  const complianceRate = stats.totalItems > 0 ? Math.round((stats.totalCompliant / stats.totalItems) * 100) : 0;

  if (isLoading) return <LoadingState message="加载基线报告数据..." />;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线防护报告视图" description="管理和监控基线检查任务与报告"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建检查任务
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="总报告任务" value={stats.totalTasks} icon={<Calendar className="w-5 h-5" />} />
        <StatsCard title="基线检查项总数" value={stats.totalItems} icon={<CheckCircle2 className="w-5 h-5" />} color="yellow" />
        <StatsCard title="合规项数" value={stats.totalCompliant} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="不合规项数" value={stats.totalNonCompliant} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
      </StatsCardGrid>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">整体合规率</h4>
            <p className="text-xs text-slate-400">所有基线检查任务的综合合规情况</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs text-slate-400">合规</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs text-slate-400">不合规</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#111625" strokeWidth="12" fill="none" />
              <circle cx="80" cy="80" r="70" stroke="#4F46E5" strokeWidth="12" fill="none" strokeDasharray={`${complianceRate * 4.4} 440`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{complianceRate}%</div>
                <div className="text-xs text-slate-400">合规率</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索报告名称或ID..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5 focus:border-blue-500 outline-none"
              >
                <option value="">全部状态</option>
                <option value="pending">待执行</option>
                <option value="running">执行中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
              </select>
            </div>
          </div>
          <div className="text-xs text-slate-500">共 {filteredReports.length} 条记录</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">检查项总数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">合规项</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">不合规项</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">合规率</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredReports.map(report => {
                const rate = report.totalItems > 0 ? Math.round((report.compliant / report.totalItems) * 100) : 0;
                return (
                  <tr key={report.id} className="hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-sm text-blue-400 font-mono">{report.id}</td>
                    <td className="px-4 py-3 text-sm text-white">{report.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{report.totalItems}</td>
                    <td className="px-4 py-3 text-sm text-green-400">{report.compliant}</td>
                    <td className="px-4 py-3 text-sm text-red-400">{report.nonCompliant}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-sm text-slate-300">{rate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={report.status} pulse={report.status === 'running'} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <Eye className="w-3 h-3" />详情
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
          <div className="text-xs text-slate-500">显示 1-{filteredReports.length} 条，共 {reports.length} 条</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">1</button>
            <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaselineReportView;
'use client';

import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Plus, Eye, Calendar, CheckCircle2, Clock, Zap } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader, LoadingState } from '@/components/Common/PageStates';

const reports = [
  { id: 'DR-001', name: '告警日报_20260603', status: 'completed', alertCount: 156, disposedCount: 142, disposalRate: 91 },
  { id: 'DR-002', name: '告警日报_20260602', status: 'completed', alertCount: 189, disposedCount: 180, disposalRate: 95 },
  { id: 'DR-003', name: '告警日报_20260604', status: 'running', alertCount: 0, disposedCount: 0, disposalRate: 0 },
  { id: 'DR-004', name: '告警日报_20260601', status: 'completed', alertCount: 203, disposedCount: 195, disposalRate: 96 },
  { id: 'DR-005', name: '告警日报_20260531', status: 'failed', alertCount: 145, disposedCount: 130, disposalRate: 90 },
];

export function DailyReportSummary() {
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
    todayAlerts: 156,
    disposedAlerts: 142,
    disposalRate: 91,
  };

  if (isLoading) return <LoadingState message="加载告警日报数据..." />;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="告警日报视图" description="管理和监控告警日报任务"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建报告任务
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="总报告任务" value={stats.totalTasks} icon={<Calendar className="w-5 h-5" />} />
        <StatsCard title="今日告警数" value={stats.todayAlerts} icon={<Zap className="w-5 h-5" />} color="yellow" />
        <StatsCard title="已处置告警" value={stats.disposedAlerts} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="告警处置率" value={`${stats.disposalRate}%`} icon={<Clock className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

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
                <option value="pending">待生成</option>
                <option value="running">生成中</option>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">告警总数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">已处置数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">处置率</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{report.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{report.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{report.alertCount}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{report.disposedCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${report.disposalRate}%` }} />
                      </div>
                      <span className="text-sm text-slate-300">{report.disposalRate}%</span>
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
          <div className="text-xs text-slate-500">显示 1-5 条，共 5 条</div>
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

export default DailyReportSummary;

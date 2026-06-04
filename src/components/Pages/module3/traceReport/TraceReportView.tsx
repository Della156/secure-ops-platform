'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Calendar, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const reports = [
  { id: 'TR-001', name: 'APT攻击溯源报告', status: 'completed', totalItems: 100, hasIOC: true, generateTime: '2026-06-03 08:00' },
  { id: 'TR-002', name: '勒索病毒溯源报告', status: 'running', totalItems: 80, hasIOC: false, generateTime: '2026-06-03 09:00' },
  { id: 'TR-003', name: '数据泄露溯源报告', status: 'pending', totalItems: 60, hasIOC: true, generateTime: '2026-06-03 10:00' },
  { id: 'TR-004', name: '横向渗透溯源报告', status: 'completed', totalItems: 120, hasIOC: true, generateTime: '2026-06-02 08:00' },
  { id: 'TR-005', name: '钓鱼攻击溯源报告', status: 'failed', totalItems: 40, hasIOC: false, generateTime: '2026-06-02 07:00' },
];

export function TraceReportView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredReports = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    if (statusFilter && report.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    hasIOCReports: reports.filter(r => r.hasIOC).length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="溯源报告视图" description="溯源分析结果管理与报告生成"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建报告
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="总报告任务" value={stats.totalReports} icon={<Calendar className="w-5 h-5" />} />
        <StatsCard title="已完成报告数" value={stats.completedReports} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="含IOC报告数" value={stats.hasIOCReports} icon={<AlertTriangle className="w-5 h-5" />} color="yellow" />
        <StatsCard title="待处理" value={reports.filter(r => r.status === 'pending').length} icon={<Clock className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索报告名称或ID..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">含IOC</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">生成时间</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{report.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{report.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{report.totalItems}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${report.hasIOC ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {report.hasIOC ? '是' : '否'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={report.status} pulse={report.status === 'running'} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{report.generateTime}</td>
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

export default TraceReportView;

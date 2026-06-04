'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, Eye, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const history = [
  { id: 'HIST-001', taskName: '全网资产扫描任务', taskId: 'TASK-001', status: 'completed', startTime: '2026-06-03 08:00', endTime: '2026-06-03 09:35', duration: '1小时35分', discovered: 234, scanned: 250 },
  { id: 'HIST-002', taskName: '办公区资产发现', taskId: 'TASK-002', status: 'completed', startTime: '2026-06-03 06:00', endTime: '2026-06-03 06:45', duration: '45分钟', discovered: 45, scanned: 45 },
  { id: 'HIST-003', taskName: '数据中心扫描', taskId: 'TASK-004', status: 'failed', startTime: '2026-06-02 14:00', endTime: '2026-06-02 14:30', duration: '30分钟', discovered: 89, scanned: 120 },
  { id: 'HIST-004', taskName: '云环境资产同步', taskId: 'TASK-003', status: 'completed', startTime: '2026-06-02 10:00', endTime: '2026-06-02 10:25', duration: '25分钟', discovered: 567, scanned: 567 },
  { id: 'HIST-005', taskName: '设备指纹更新', taskId: 'TASK-005', status: 'completed', startTime: '2026-06-02 09:00', endTime: '2026-06-02 09:40', duration: '40分钟', discovered: 267, scanned: 267 },
];

export function AssetDiscoveryHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredHistory = history.filter(item => {
    if (search && !item.taskName.includes(search) && !item.taskId.includes(search)) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  const handleExport = () => {
    alert('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产发现任务历史查询" description="查询和查看资产发现任务历史记录"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="export" onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" /> 导出
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索任务名称..."
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
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            />
            <span className="text-slate-500">至</span>
            <input
              type="date"
              value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            查询
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">记录ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">任务ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">开始时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">结束时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">耗时</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">发现/扫描</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredHistory.map(item => (
                <tr key={item.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.taskName}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 font-mono">{item.taskId}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />{item.startTime}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.endTime}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${item.discovered === item.scanned ? 'text-green-400' : 'text-yellow-400'}`}>
                      {item.discovered} / {item.scanned}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                        <Eye className="w-3 h-3" />查看详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
          <div className="text-xs text-slate-500">显示 1-{filteredHistory.length} 条，共 {history.length} 条</div>
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

export default AssetDiscoveryHistory;
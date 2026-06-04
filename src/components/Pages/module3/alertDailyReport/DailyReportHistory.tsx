'use client';

import React, { useState } from 'react';
import { Search, Calendar, Filter, Eye, Download } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const history = [
  { id: 'DR-H001', name: '告警日报_20260603', createTime: '2026-06-03 08:00', alertCount: 156, disposalRate: 91, status: 'completed' },
  { id: 'DR-H002', name: '告警日报_20260602', createTime: '2026-06-02 08:00', alertCount: 189, disposalRate: 95, status: 'completed' },
  { id: 'DR-H003', name: '告警日报_20260601', createTime: '2026-06-01 08:00', alertCount: 203, disposalRate: 96, status: 'completed' },
  { id: 'DR-H004', name: '告警日报_20260531', createTime: '2026-05-31 08:00', alertCount: 145, disposalRate: 90, status: 'failed' },
  { id: 'DR-H005', name: '告警日报_20260530', createTime: '2026-05-30 08:00', alertCount: 167, disposalRate: 93, status: 'completed' },
];

const statusColors = {
  completed: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
};

export function DailyReportHistory() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = history.filter(item => {
    if (search && !item.name.includes(search) && !item.id.includes(search)) return false;
    if (dateFilter && !item.createTime.includes(dateFilter)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="告警日报任务历史查询" description="查询和查看历史告警日报任务记录"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" />导出记录
          </button>,
        ]}
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索报告名称或ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#20293F] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#20293F] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">生成时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">告警总数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">处置率</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{item.createTime}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.alertCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.disposalRate}%` }} />
                      </div>
                      <span className="text-sm text-slate-300">{item.disposalRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[item.status as keyof typeof statusColors]}`}>
                      {item.status === 'completed' ? '已完成' : '失败'}
                    </span>
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

export default DailyReportHistory;

'use client';

import React, { useState } from 'react';
import { Search, Calendar, Download, Eye } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const history = [
  { id: 'TH-001', name: '主机安全基线检查', status: 'completed', executeTime: '2026-06-03 08:00', result: '成功', complianceRate: 89 },
  { id: 'TH-002', name: '网络安全基线检查', status: 'completed', executeTime: '2026-06-02 08:00', result: '成功', complianceRate: 85 },
  { id: 'TH-003', name: '数据库基线检查', status: 'failed', executeTime: '2026-06-02 06:00', result: '失败', complianceRate: 0 },
  { id: 'TH-004', name: '应用安全基线检查', status: 'completed', executeTime: '2026-06-02 05:00', result: '部分成功', complianceRate: 72 },
  { id: 'TH-005', name: '系统安全基线检查', status: 'completed', executeTime: '2026-06-02 04:00', result: '成功', complianceRate: 92 },
];

export function BaselineReportHistory() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = history.filter(item => {
    if (search && !item.name.includes(search) && !item.id.includes(search)) return false;
    if (dateFilter && !item.executeTime.includes(dateFilter)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线防护报告任务历史查询" description="查询和查看历史基线报告任务记录"
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">任务ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">执行时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">合规率</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">执行结果</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{item.executeTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.complianceRate >= 90 ? 'bg-green-500' : item.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.complianceRate}%` }} />
                      </div>
                      <span className="text-sm text-slate-300">{item.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.result === '成功' ? 'completed' : item.result === '部分成功' ? 'running' : 'failed'} />
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
          <div className="text-xs text-slate-500">显示 1-{filtered.length} 条，共 {history.length} 条</div>
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

export default BaselineReportHistory;
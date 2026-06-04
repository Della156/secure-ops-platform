'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, Eye, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const history = [
  { id: 'HIST-001', taskName: '2026年6月资产分析', taskId: 'ANALY-001', status: 'completed', startTime: '2026-06-03 08:00', endTime: '2026-06-03 08:30', duration: '30分钟', analyzedAssets: 543, findings: 23 },
  { id: 'HIST-002', taskName: '数据中心资产分析', taskId: 'ANALY-002', status: 'completed', startTime: '2026-06-03 09:00', endTime: '2026-06-03 09:45', duration: '45分钟', analyzedAssets: 250, findings: 15 },
  { id: 'HIST-003', taskName: '2026年5月资产分析', taskId: 'ANALY-005', status: 'completed', startTime: '2026-05-01 00:00', endTime: '2026-05-01 01:30', duration: '1小时30分', analyzedAssets: 530, findings: 31 },
];

export function AssetAnalysisHistory() {
  const [search, setSearch] = useState('');

  const filteredHistory = history.filter(item => {
    if (search && !item.taskName.includes(search) && !item.taskId.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产分析任务历史查询" description="查询和查看资产分析任务历史记录"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
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
            <Calendar className="w-4 h-4 text-slate-500" />
            <input type="date" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none" />
            <span className="text-slate-500">至</span>
            <input type="date" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none" />
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">分析资产数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">发现问题数</th>
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
                  <td className="px-4 py-3 text-sm text-white">{item.analyzedAssets}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.findings}</td>
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

export default AssetAnalysisHistory;
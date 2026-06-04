'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, Eye, CheckCircle2, XCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  name: string;
  type: string;
  target: string;
  result: 'success' | 'failed';
  time: string;
  duration: string;
}

const items: HistoryItem[] = [
  { id: 'HIS-001', name: 'Kinsing 查杀', type: '挖矿木马', target: '终端-0128', result: 'success', time: '2026-06-03 07:30:15', duration: '2分25秒' },
  { id: 'HIS-002', name: 'Emotet 隔离', type: '勒索软件', target: '终端-0256', result: 'success', time: '2026-06-03 09:15:30', duration: '15秒' },
  { id: 'HIS-003', name: 'Trojan.Agent 清理', type: '木马', target: '终端-0101', result: 'success', time: '2026-06-02 14:20:00', duration: '1分30秒' },
  { id: 'HIS-004', name: 'WannaCry 检测', type: '勒索软件', target: '文件服务器', result: 'failed', time: '2026-06-01 16:00:00', duration: '5分钟' },
];

export function VirusHistory() {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filtered = items.filter(item => {
    if (search && !item.name.includes(search) && !item.target.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">病毒处置任务历史查询</h2>
            <p className="text-xs text-slate-500 mt-1">查看所有已完成的病毒处置任务记录</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Download className="w-3.5 h-3.5" />导出
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text" placeholder="搜索任务/目标..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date" placeholder="开始日期"
              value={startDate} onChange={e => setStartDate(e.target.value)}
              className="flex-1 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-2 py-1.5"
            />
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date" placeholder="结束日期"
              value={endDate} onChange={e => setEndDate(e.target.value)}
              className="flex-1 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-2 py-1.5"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <h3 className="text-sm font-semibold text-white">历史记录 ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111625]">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">任务ID</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">任务名称</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">病毒类型</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">目标</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">结果</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">执行时间</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">耗时</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-xs text-blue-400 font-mono">{item.id}</td>
                  <td className="px-4 py-3 text-xs text-white">{item.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{item.type}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{item.target}</td>
                  <td className="px-4 py-3">
                    {item.result === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="w-3 h-3" />成功</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" />失败</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{item.time}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{item.duration}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <Eye className="w-3 h-3" />查看
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

export default VirusHistory;

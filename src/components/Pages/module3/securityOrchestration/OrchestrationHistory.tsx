'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, Eye } from 'lucide-react';

const mockHistory = [
  { id: 'SOH-001', name: '安全编排任务A', startTime: '2024-01-15 08:00:00', endTime: '2024-01-15 10:30:00', status: 'completed', triggers: 12, successRate: 98 },
  { id: 'SOH-002', name: '安全编排任务B', startTime: '2024-01-15 09:00:00', endTime: '2024-01-15 10:15:00', status: 'completed', triggers: 8, successRate: 95 },
  { id: 'SOH-003', name: '安全编排任务C', startTime: '2024-01-14 08:00:00', endTime: '2024-01-14 16:00:00', status: 'completed', triggers: 24, successRate: 100 },
  { id: 'SOH-004', name: '安全编排任务D', startTime: '2024-01-14 10:00:00', endTime: '2024-01-14 10:30:00', status: 'failed', triggers: 3, successRate: 67 },
];

const getStatusColor = (status: string) => {
  return status === 'completed' 
    ? 'bg-green-500/20 text-green-400 border-green-500/40' 
    : 'bg-red-500/20 text-red-400 border-red-500/40';
};

const getStatusText = (status: string) => {
  return status === 'completed' ? '已完成' : '失败';
};

export function OrchestrationHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">编排任务历史查询</h1>
          <p className="text-slate-400 mt-1">查询历史编排任务记录，查看详细执行信息</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索任务名称或ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Calendar className="w-3.5 h-3.5" />选择日期
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Filter className="w-3.5 h-3.5" />筛选
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">任务 ID</th>
              <th className="text-left px-4 py-2.5">任务名称</th>
              <th className="text-left px-4 py-2.5">开始时间</th>
              <th className="text-left px-4 py-2.5">结束时间</th>
              <th className="text-left px-4 py-2.5">状态</th>
              <th className="text-left px-4 py-2.5">触发次数</th>
              <th className="text-left px-4 py-2.5">成功率</th>
              <th className="text-right px-4 py-2.5">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map(item => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3 text-white">{item.name}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{item.startTime}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{item.endTime}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{item.triggers}</td>
                <td className="px-4 py-3">
                  <span className={item.successRate >= 95 ? 'text-green-400' : 'text-yellow-400'}>{item.successRate}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <button className="flex items-center gap-1 px-2 py-1 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded">
                      <Eye className="w-3 h-3" />查看详情
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {filteredHistory.length} 条记录 / 总 {mockHistory.length} 条</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300" disabled>‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">2</button>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
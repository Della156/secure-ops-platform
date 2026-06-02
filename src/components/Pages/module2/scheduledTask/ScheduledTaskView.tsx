'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Play, Pause, Trash2, Clock, Calendar, Repeat } from 'lucide-react';

interface TaskItem {
  id: string;
  name: string;
  cron: string;
  lastRun: string;
  nextRun: string;
  status: 'running' | 'paused' | 'completed';
  result: 'success' | 'failed';
}

const mockData: TaskItem[] = [
  { id: 'ST-001', name: '每日数据备份', cron: '0 2 * * *', lastRun: '2026-06-02 02:00:00', nextRun: '2026-06-03 02:00:00', status: 'running', result: 'success' },
  { id: 'ST-002', name: '安全日志清理', cron: '0 3 * * *', lastRun: '2026-06-02 03:00:00', nextRun: '2026-06-03 03:00:00', status: 'running', result: 'success' },
  { id: 'ST-003', name: '系统健康检查', cron: '0 */6 * * *', lastRun: '2026-06-02 12:00:00', nextRun: '2026-06-02 18:00:00', status: 'running', result: 'success' },
  { id: 'ST-004', name: '特征库更新检查', cron: '0 4 * * *', lastRun: '2026-06-02 04:00:00', nextRun: '2026-06-03 04:00:00', status: 'paused', result: 'success' },
  { id: 'ST-005', name: '用户权限审计', cron: '0 1 * * 0', lastRun: '2026-06-01 01:00:00', nextRun: '2026-06-08 01:00:00', status: 'running', result: 'failed' },
];

export function ScheduledTaskView() {
  const [data, setData] = useState<TaskItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchSearch = !searchKeyword || item.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: item.status === 'running' ? 'paused' : 'running' } : item
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">定时任务管理</h2>
        <p className="text-sm text-gray-400 mt-1">定时任务列表展示、任务状态管理、条件查询、数据导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="running">运行中</option>
                <option value="paused">已暂停</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              新建任务
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出数据
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cron表达式</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次执行</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">下次执行</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs bg-[#111827] rounded text-gray-400">{item.cron}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{item.lastRun}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">{item.nextRun}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {item.status === 'running' && <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">运行中</span>}
                    {item.status === 'paused' && <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">已暂停</span>}
                    {item.status === 'completed' && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">已完成</span>}
                    {item.result === 'failed' && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(item.id)} className={`p-2 rounded-lg transition-colors ${item.status === 'running' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                      {item.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">暂无数据</div>
        )}
      </div>
    </div>
  );
}
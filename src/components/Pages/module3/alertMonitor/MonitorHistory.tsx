'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface HistoryTask {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'failed';
  alertCount: number;
  processedCount: number;
}

const mockTasks: HistoryTask[] = [
  { id: 'HIST-001', name: 'SIEM告警采集任务', startTime: '2026-06-03 08:00:00', endTime: '2026-06-03 08:30:00', status: 'completed', alertCount: 1256, processedCount: 1256 },
  { id: 'HIST-002', name: '防火墙日志采集任务', startTime: '2026-06-03 08:00:00', endTime: '2026-06-03 08:45:00', status: 'completed', alertCount: 892, processedCount: 892 },
  { id: 'HIST-003', name: '告警自动分析任务', startTime: '2026-06-03 09:00:00', endTime: '2026-06-03 09:20:00', status: 'completed', alertCount: 314, processedCount: 187 },
  { id: 'HIST-004', name: '影响范围评估任务', startTime: '2026-06-03 09:30:00', endTime: '2026-06-03 09:45:00', status: 'completed', alertCount: 24, processedCount: 24 },
  { id: 'HIST-005', name: '趋势预测任务', startTime: '2026-06-03 10:00:00', endTime: '2026-06-03 10:30:00', status: 'failed', alertCount: 0, processedCount: 0 },
];

export function MonitorHistory() {
  const [tasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    return status === 'completed' 
      ? <CheckCircle className="w-4 h-4 text-green-400" />
      : <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'text-green-400 bg-green-500/20' 
      : 'text-red-400 bg-red-500/20';
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}分${seconds}秒`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">告警辅助监测任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史任务记录查询、任务详情查看、执行链路分析</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索任务名称..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
            >
              <option value="all">全部状态</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              时间筛选
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出记录
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">执行时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">耗时</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">告警数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">处理数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.startTime}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{getDuration(task.startTime, task.endTime)}</td>
                <td className="px-4 py-3 text-sm text-white">{task.alertCount}</td>
                <td className="px-4 py-3 text-sm text-blue-400">{task.processedCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status === 'completed' ? '已完成' : '失败'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded text-blue-400 transition-colors" title="查看详情">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
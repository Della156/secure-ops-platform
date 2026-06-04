'use client';

import React, { useState } from 'react';
import { Search, Download, Eye, PlayCircle, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

interface ForensicsTask {
  id: string;
  name: string;
  target: string;
  status: 'in_progress' | 'completed' | 'failed' | 'pending';
  startTime: string;
  progress: number;
  sampleCount: number;
  logCount: number;
}

const tasks: ForensicsTask[] = [
  { id: 'FOR-001', name: '终端异常取证', target: 'PC-WIN-001', status: 'completed', startTime: '2026-06-03 09:30:00', progress: 100, sampleCount: 5, logCount: 120 },
  { id: 'FOR-002', name: '恶意软件取证', target: 'PC-WIN-005', status: 'in_progress', startTime: '2026-06-03 10:15:00', progress: 65, sampleCount: 3, logCount: 85 },
  { id: 'FOR-003', name: '数据泄露调查', target: 'PC-LINUX-003', status: 'completed', startTime: '2026-06-03 08:00:00', progress: 100, sampleCount: 12, logCount: 256 },
  { id: 'FOR-004', name: '入侵取证分析', target: 'PC-WIN-008', status: 'pending', startTime: '2026-06-03 14:00:00', progress: 0, sampleCount: 0, logCount: 0 },
  { id: 'FOR-005', name: '可疑行为追踪', target: 'PC-MAC-002', status: 'completed', startTime: '2026-06-03 07:30:00', progress: 100, sampleCount: 8, logCount: 189 },
];

const stats = [
  { label: '总取证任务', value: 24, icon: <PlayCircle className="w-4 h-4" />, color: '#0066FF' },
  { label: '取证中', value: 3, icon: <Clock className="w-4 h-4" />, color: '#F59E0B' },
  { label: '已完成', value: 19, icon: <CheckCircle2 className="w-4 h-4" />, color: '#22C55E' },
  { label: '失败', value: 2, icon: <XCircle className="w-4 h-4" />, color: '#EF4444' },
];

export function EndpointForensicsView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (search && !task.name.includes(search) && !task.target.includes(search)) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    return true;
  });

  const getStatusConfig = (status: ForensicsTask['status']) => {
    const config = {
      in_progress: { label: '取证中', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <Clock className="w-3 h-3" /> },
      completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
      failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
      pending: { label: '待取证', color: 'text-slate-400', bg: 'bg-slate-500/20', icon: <Clock className="w-3 h-3" /> },
    };
    return config[status];
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">{stat.label}</span>
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div className="text-xl font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">终端取证视图</h3>
            <p className="text-xs text-slate-500 mt-1">管理和监控终端取证任务</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <RefreshCw className="w-3.5 h-3.5" />刷新
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text" placeholder="搜索任务名称或目标终端..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-3 py-1.5"
          >
            <option value="all">全部状态</option>
            <option value="in_progress">取证中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
            <option value="pending">待取证</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
            <Download className="w-3.5 h-3.5" />导出
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111625]">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">任务ID</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">任务名称</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">目标终端</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">状态</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">进度</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">样本数</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">日志数</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">开始时间</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const sc = getStatusConfig(task.status);
                return (
                  <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-xs text-blue-400 font-mono">{task.id}</td>
                    <td className="px-4 py-3 text-xs text-white">{task.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{task.target}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-green-500' : task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-slate-500'}`} style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 ml-2">{task.progress}%</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{task.sampleCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{task.logCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{task.startTime}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Eye className="w-3 h-3" />查看详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EndpointForensicsView;

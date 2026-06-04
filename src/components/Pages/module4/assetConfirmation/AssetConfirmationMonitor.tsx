'use client';
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Play, Pause, Square, Activity, Clock, CheckCircle2, AlertCircle, Server } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const tasks = [
  { id: 'CONF-001', name: '2026年6月资产确认', type: '定时任务', status: 'completed', progress: 100, startTime: '2026-06-03 08:00', endTime: '2026-06-03 08:30', confirmed: 521, total: 543 },
  { id: 'CONF-002', name: '数据中心资产确认', type: '手动任务', status: 'running', progress: 72, startTime: '2026-06-03 09:00', endTime: '-', confirmed: 180, total: 250 },
  { id: 'CONF-003', name: '云环境资产确认', type: '定时任务', status: 'pending', progress: 0, startTime: '-', endTime: '2026-06-03 10:00', confirmed: 0, total: 600 },
];

export function AssetConfirmationMonitor() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (search && !task.name.includes(search) && !task.id.includes(search)) return false;
    if (statusFilter && task.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    running: tasks.filter(t => t.status === 'running').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产确认任务状态监控" description="实时监控资产确认任务状态"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新状态
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-slate-400">任务总数</div>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-xs text-slate-400">已完成</div>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.running}</div>
              <div className="text-xs text-slate-400">进行中</div>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-xs text-slate-400">待执行</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <div className="flex items-center gap-4">
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
                <option value="running">运行中</option>
                <option value="completed">已完成</option>
                <option value="pending">待执行</option>
              </select>
            </div>
          </div>
          <div className="text-xs text-slate-500">共 {filteredTasks.length} 条任务</div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredTasks.map(task => (
            <div key={task.id} className="p-4 hover:bg-[#111625]/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{task.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${task.type === '定时任务' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                        {task.type}
                      </span>
                      <StatusBadge status={task.status} pulse={task.status === 'running'} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {task.startTime !== '-' && `开始时间: ${task.startTime}`}
                      {task.endTime !== '-' && ` | 结束时间: ${task.endTime}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.status === 'running' && (
                    <>
                      <button className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg hover:bg-yellow-500/30">
                        <Pause className="w-3 h-3" /> 暂停
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30">
                        <Square className="w-3 h-3" /> 停止
                      </button>
                    </>
                  )}
                  {task.status === 'pending' && (
                    <button className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30">
                      <Play className="w-3 h-3" /> 启动
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">进度</span>
                    <span className="text-white">{task.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-400">{task.confirmed} / {task.total}</div>
                  <div className="text-xs text-slate-400">已确认数</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssetConfirmationMonitor;
'use client';

import React, { useState } from 'react';
import { Calendar, Play, Pause, RefreshCw, Clock, AlertCircle } from 'lucide-react';

interface Job {
  id: string;
  name: string;
  cron: string;
  lastRun: string;
  nextRun: string;
  status: 'running' | 'paused' | 'completed' | 'failed';
  runCount: number;
  successRate: number;
}

export function JobSchedulerMonitor() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockJobs: Job[] = [
    { id: 'J001', name: '数据同步任务', cron: '0 0 * * *', lastRun: '2026-06-04 00:00:00', nextRun: '2026-06-05 00:00:00', status: 'completed', runCount: 156, successRate: 100 },
    { id: 'J002', name: '日志清理任务', cron: '0 2 * * *', lastRun: '2026-06-04 02:00:00', nextRun: '2026-06-05 02:00:00', status: 'completed', runCount: 89, successRate: 98 },
    { id: 'J003', name: '备份任务', cron: '0 3 * * *', lastRun: '2026-06-04 03:00:00', nextRun: '2026-06-05 03:00:00', status: 'running', runCount: 45, successRate: 100 },
    { id: 'J004', name: '报表生成任务', cron: '0 6 * * MON', lastRun: '2026-06-02 06:00:00', nextRun: '2026-06-09 06:00:00', status: 'paused', runCount: 12, successRate: 95 },
    { id: 'J005', name: '数据统计任务', cron: '*/30 * * * *', lastRun: '2026-06-04 10:30:00', nextRun: '2026-06-04 11:00:00', status: 'running', runCount: 289, successRate: 99 },
    { id: 'J006', name: '告警汇总任务', cron: '0 * * * *', lastRun: '2026-06-04 10:00:00', nextRun: '2026-06-04 11:00:00', status: 'failed', runCount: 234, successRate: 96 },
  ];

  const statuses = ['all', 'running', 'paused', 'completed', 'failed'];

  const filteredJobs = selectedStatus === 'all' ? mockJobs : mockJobs.filter(j => j.status === selectedStatus);

  const stats = {
    total: mockJobs.length,
    running: mockJobs.filter(j => j.status === 'running').length,
    paused: mockJobs.filter(j => j.status === 'paused').length,
    failed: mockJobs.filter(j => j.status === 'failed').length,
  };

  const toggleJob = (id: string) => {
    console.log('Toggle job:', id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">定时任务调度监控</h2>
          <p className="text-sm text-gray-400 mt-1">监控定时任务的运行状态和执行情况</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">任务总数</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">运行中</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Pause className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">已暂停</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats.paused}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">失败</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">状态筛选:</span>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded text-xs ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111625] text-gray-400 hover:bg-[#2A354D]'
              }`}
            >
              {status === 'all' ? '全部' : status === 'running' ? '运行中' : status === 'paused' ? '已暂停' : status === 'completed' ? '已完成' : '失败'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">任务名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Cron表达式</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">上次执行</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">下次执行</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">执行次数</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">成功率</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3 font-medium text-white">{job.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400 font-mono">{job.cron}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{job.lastRun}</td>
                <td className="px-4 py-3 text-sm text-blue-400">{job.nextRun}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{job.runCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${job.successRate >= 95 ? 'bg-green-500' : job.successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${job.successRate}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{job.successRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    job.status === 'running' ? 'bg-green-500/20 text-green-400' :
                    job.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                    job.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {job.status === 'running' ? <Play className="w-3 h-3" /> :
                     job.status === 'paused' ? <Pause className="w-3 h-3" /> :
                     job.status === 'completed' ? <Clock className="w-3 h-3" /> :
                     <AlertCircle className="w-3 h-3" />}
                    {job.status === 'running' ? '运行中' : job.status === 'paused' ? '已暂停' : job.status === 'completed' ? '已完成' : '失败'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => toggleJob(job.id)}
                    className={`p-1.5 rounded ${job.status === 'running' ? 'hover:bg-[#111625] text-yellow-400' : 'hover:bg-[#111625] text-green-400'}`}
                  >
                    {job.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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

export default JobSchedulerMonitor;
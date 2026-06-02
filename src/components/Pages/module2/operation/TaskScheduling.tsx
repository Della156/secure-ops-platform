'use client';

import React, { useState } from 'react';
import { Search, Calendar, Clock, Play, Pause, Trash2, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';

interface ScheduledTask {
  id: string;
  name: string;
  type: string;
  cron: string;
  nextRun: string;
  lastRun: string;
  status: 'enabled' | 'disabled';
  executor: string;
}

const mockData: ScheduledTask[] = [
  { id: 'SCHED-001', name: '安全设备巡检', type: '巡检', cron: '0 4 * * *', nextRun: '2026-06-03 04:00:00', lastRun: '2026-06-02 04:00:00', status: 'enabled', executor: 'system' },
  { id: 'SCHED-002', name: '日志清理', type: '清理', cron: '0 2 * * *', nextRun: '2026-06-03 02:00:00', lastRun: '2026-06-02 02:00:00', status: 'enabled', executor: 'system' },
  { id: 'SCHED-003', name: '数据备份', type: '备份', cron: '0 1 * * *', nextRun: '2026-06-03 01:00:00', lastRun: '2026-06-02 01:00:00', status: 'enabled', executor: 'system' },
  { id: 'SCHED-004', name: '漏洞扫描', type: '扫描', cron: '0 0 * * 1', nextRun: '2026-06-08 00:00:00', lastRun: '2026-06-01 00:00:00', status: 'enabled', executor: 'admin' },
  { id: 'SCHED-005', name: '系统升级', type: '升级', cron: '0 0 1 * *', nextRun: '2026-07-01 00:00:00', lastRun: '2026-06-01 00:00:00', status: 'disabled', executor: 'admin' },
];

export function TaskScheduling() {
  const [data] = useState<ScheduledTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    enabled: data.filter(d => d.status === 'enabled').length,
    disabled: data.filter(d => d.status === 'disabled').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'enabled') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">禁用</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'enabled') return <Play className="w-4 h-4 text-green-400" />;
    return <Pause className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">任务调度管理</h2>
        <p className="text-sm text-gray-400 mt-1">管理定时任务和调度策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">定时任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已启用</p>
              <p className="text-xl font-semibold text-green-400">{stats.enabled}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">已禁用</p>
              <p className="text-xl font-semibold text-gray-400">{stats.disabled}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cron表达式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">下次执行</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次执行</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">执行者</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400 font-mono">{item.cron}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-400">{item.nextRun}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastRun}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.executor}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
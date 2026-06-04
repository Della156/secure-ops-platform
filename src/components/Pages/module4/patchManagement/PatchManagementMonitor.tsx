'use client';
import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Activity, CheckCircle2, AlertTriangle, XCircle, Clock, Package } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const tasks = [
  { id: 'task-001', name: 'Windows 补丁批量更新', status: 'running', progress: 65, totalHosts: 50, completedHosts: 32, startTime: '08:00:00', eta: '预计 15 分钟' },
  { id: 'task-002', name: 'Linux 安全补丁部署', status: 'completed', progress: 100, totalHosts: 20, completedHosts: 20, startTime: '07:30:00', eta: '已完成' },
  { id: 'task-003', name: '数据库补丁升级', status: 'pending', progress: 0, totalHosts: 5, completedHosts: 0, startTime: '-', eta: '等待执行' },
  { id: 'task-004', name: '应用服务器补丁更新', status: 'failed', progress: 30, totalHosts: 15, completedHosts: 4, startTime: '08:15:00', eta: '执行失败' },
];

const statusConfig = {
  running: { label: '运行中', color: 'bg-blue-500/20 text-blue-400', icon: Activity },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  pending: { label: '等待中', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

export function PatchManagementMonitor() {
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (search && !task.name.includes(search)) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁管理任务状态监控" description="实时监控补丁管理任务状态"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">任务总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">运行中</span>
          </div>
          <div className="text-2xl font-semibold text-[#0066FF]">{stats.running}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">已完成</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{stats.completed}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm text-[#9CA3AF]">失败</span>
          </div>
          <div className="text-2xl font-semibold text-[#EF4444]">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              placeholder="搜索任务名称"
            />
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredTasks.map(task => {
            const config = statusConfig[task.status];
            const Icon = config.icon;
            return (
              <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-[#181F32]">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${config.color}`}>
                    {task.status === 'running' ? (
                      <Activity className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-[#F3F4F6]">{task.name}</div>
                    <div className="text-sm text-[#9CA3AF]">
                      {task.completedHosts}/{task.totalHosts} 台主机
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="w-32">
                    <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                      <span>进度</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#181F32] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${task.status === 'completed' ? 'bg-[#00D4AA]' : task.status === 'failed' ? 'bg-[#EF4444]' : 'bg-[#0066FF]'}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#9CA3AF]">开始: {task.startTime}</div>
                    <div className="text-sm text-[#F3F4F6]">{task.eta}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
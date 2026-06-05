'use client';
import React, { useState } from 'react';
import { Search, RefreshCw, Activity, CheckCircle2, AlertTriangle, XCircle, Clock, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const tasks = [
  { id: 'task-001', name: '终端安全软件升级', status: 'running', progress: 70, startTime: '08:00:00', eta: '预计 10 分钟' },
  { id: 'task-002', name: '终端合规扫描', status: 'completed', progress: 100, startTime: '07:30:00', eta: '已完成' },
  { id: 'task-003', name: '安全软件版本同步', status: 'running', progress: 35, startTime: '08:15:00', eta: '预计 20 分钟' },
  { id: 'task-004', name: '终端补丁更新', status: 'pending', progress: 0, startTime: '-', eta: '等待执行' },
];

const statusConfig = {
  running: { label: '运行中', color: 'bg-blue-500/20 text-blue-400', icon: Activity },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  pending: { label: '等待中', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

export function EndpointComplianceMonitor() {
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (search && !task.name.includes(search)) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="终端合规管理任务状态监控" description="实时监控终端合规管理任务状态"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-[#0066FF]" />
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
            <Clock className="w-5 h-5 text-[#9CA3AF]" />
            <span className="text-sm text-[#9CA3AF]">等待中</span>
          </div>
          <div className="text-2xl font-semibold text-[#9CA3AF]">{stats.pending}</div>
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
            const config = statusConfig[task.status as keyof typeof statusConfig];
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
                      进度: {task.progress}%
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
                        className={`h-full ${task.status === 'completed' ? 'bg-[#00D4AA]' : 'bg-[#0066FF]'}`}
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
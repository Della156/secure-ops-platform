'use client';
import React, { useState } from 'react';
import { Search, Filter, Play, Pause, Square, RefreshCw, Server, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const tasks = [
  { id: 'task-001', name: 'Windows KB5034441', asset: 'web-server-01', status: 'completed', progress: 100, message: '部署成功', startTime: '02:00:00', endTime: '02:05:32' },
  { id: 'task-002', name: 'Windows KB5034441', asset: 'db-server-01', status: 'in_progress', progress: 65, message: '正在安装...', startTime: '02:05:35', endTime: '' },
  { id: 'task-003', name: 'Windows KB5034441', asset: 'app-server-01', status: 'pending', progress: 0, message: '等待执行', startTime: '', endTime: '' },
  { id: 'task-004', name: 'Linux Kernel 6.5.0', asset: 'api-gateway-01', status: 'failed', progress: 30, message: '安装失败：依赖缺失', startTime: '02:00:00', endTime: '02:02:18' },
  { id: 'task-005', name: 'Linux Kernel 6.5.0', asset: 'cdn-node-01', status: 'completed', progress: 100, message: '部署成功', startTime: '02:00:00', endTime: '02:08:45' },
];

const statusConfig = {
  pending: { label: '等待执行', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
  in_progress: { label: '执行中', color: 'bg-blue-500/20 text-blue-400', icon: Loader2 },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-3 h-3" />;

export function PatchUpgradeExecute() {
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (search && !task.name.includes(search) && !task.asset.includes(search)) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁升级执行" description="执行补丁升级任务"
        actions={[
          { icon: Play, label: '开始执行', onClick: () => {} },
          { icon: Pause, label: '暂停', onClick: () => {} },
          { icon: Square, label: '停止', onClick: () => {} },
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">任务总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">执行中</span>
          </div>
          <div className="text-2xl font-semibold text-[#0066FF]">{stats.inProgress}</div>
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
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm text-[#9CA3AF]">失败</span>
          </div>
          <div className="text-2xl font-semibold text-[#EF4444]">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="搜索补丁或资产"
              />
            </div>
          </div>
          <div className="text-sm text-[#9CA3AF]">
            总体进度: {Math.round((stats.completed / stats.total) * 100)}%
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredTasks.map(task => {
            const config = statusConfig[task.status];
            const Icon = config.icon;
            return (
              <div key={task.id} className="p-4 hover:bg-[#181F32]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Server className="w-5 h-5 text-[#0066FF]" />
                      <div>
                        <div className="font-medium text-[#F3F4F6]">{task.name}</div>
                        <div className="text-sm text-[#9CA3AF]">目标资产: {task.asset}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                        <IconComponent icon={Icon} />
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                      <span>进度</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#181F32] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          task.status === 'completed' ? 'bg-[#00D4AA]' :
                          task.status === 'failed' ? 'bg-[#EF4444]' :
                          'bg-[#0066FF]'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                    <span>消息: {task.message}</span>
                    {task.startTime && <span>开始: {task.startTime}</span>}
                    {task.endTime && <span>结束: {task.endTime}</span>}
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
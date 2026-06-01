'use client';

import React, { useState } from 'react';
import { Search, Filter, Activity, Clock, CheckCircle2, XCircle, PlayCircle, PauseCircle } from 'lucide-react';

interface TaskProgress {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending' | 'paused';
  progress: number;
  startTime: string;
  estimatedEndTime: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

const mockTasks: TaskProgress[] = [
  { id: 'TASK-001', name: '防火墙配置同步任务', status: 'running', progress: 65, startTime: '2026-06-01 10:30:00', estimatedEndTime: '2026-06-01 10:45:00', assignee: '张三', priority: 'high', tags: ['网络', '配置'] },
  { id: 'TASK-002', name: 'IDS日志采集任务', status: 'success', progress: 100, startTime: '2026-06-01 09:00:00', estimatedEndTime: '2026-06-01 09:45:23', assignee: '李四', priority: 'medium', tags: ['日志', '安全'] },
  { id: 'TASK-003', name: '网络设备监控扫描', status: 'failed', progress: 45, startTime: '2026-06-01 08:00:00', estimatedEndTime: '2026-06-01 08:30:00', assignee: '王五', priority: 'high', tags: ['监控', '设备'] },
  { id: 'TASK-004', name: '数据库备份任务', status: 'pending', progress: 0, startTime: '-', estimatedEndTime: '-', assignee: '赵六', priority: 'medium', tags: ['数据库', '备份'] },
  { id: 'TASK-005', name: 'Web应用安全扫描', status: 'success', progress: 100, startTime: '2026-06-01 07:00:00', estimatedEndTime: '2026-06-01 08:30:15', assignee: '张三', priority: 'high', tags: ['Web', '安全'] },
  { id: 'TASK-006', name: '漏洞评估任务', status: 'running', progress: 80, startTime: '2026-06-01 10:00:00', estimatedEndTime: '2026-06-01 10:50:00', assignee: '李四', priority: 'high', tags: ['漏洞', '评估'] },
  { id: 'TASK-007', name: '系统安全基线检查', status: 'success', progress: 100, startTime: '2026-05-31 22:00:00', estimatedEndTime: '2026-05-31 23:15:40', assignee: '王五', priority: 'medium', tags: ['基线', '安全'] },
  { id: 'TASK-008', name: '终端安全检测', status: 'paused', progress: 60, startTime: '2026-05-31 20:00:00', estimatedEndTime: '2026-05-31 20:45:00', assignee: '赵六', priority: 'low', tags: ['终端', '安全'] },
];

export function GlobalProgressView() {
  const [tasks, setTasks] = useState<TaskProgress[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) || task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      running: { label: '运行中', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Activity },
      success: { label: '成功', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2 },
      failed: { label: '失败', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
      pending: { label: '等待', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: PlayCircle },
      paused: { label: '已暂停', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: PauseCircle },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-green-500/20 text-green-400',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = { high: '高', medium: '中', low: '低' };
    return labels[priority as keyof typeof labels] || '中';
  };

  const getStatusTasks = (status: string) => filteredTasks.filter(task => task.status === status);

  const statuses = ['running', 'pending', 'paused', 'success', 'failed'];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务执行进度全局视图</h1>
        <p className="text-slate-400">查看所有任务的执行状态和进度概览</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索任务名称或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="running">运行中</option>
              <option value="pending">等待</option>
              <option value="paused">已暂停</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              看板视图
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              列表视图
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {statuses.map(status => {
          const config = getStatusConfig(status);
          const tasksByStatus = getStatusTasks(status);
          const Icon = config.icon;
          return (
            <div key={status} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" style={{ color: config.color.includes('blue') ? '#60a5fa' : config.color.includes('green') ? '#22c55e' : config.color.includes('red') ? '#ef4444' : config.color.includes('purple') ? '#a855f7' : '#eab308' }} />
                  <span className="text-sm font-medium text-slate-300">{config.label}</span>
                </div>
                <span className="text-2xl font-bold text-white">{tasksByStatus.length}</span>
              </div>
              <div className="text-xs text-slate-500">个任务</div>
            </div>
          );
        })}
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statuses.map(status => {
            const config = getStatusConfig(status);
            const tasksByStatus = getStatusTasks(status);
            return (
              <div key={status} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>{config.label}</span>
                    <span className="text-xs text-slate-400">{tasksByStatus.length}</span>
                  </div>
                </div>
                <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {tasksByStatus.map(task => (
                    <div key={task.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors">
                      <div className="font-medium text-white text-sm mb-2">{task.name}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>{getPriorityLabel(task.priority)}</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              task.status === 'success' ? 'bg-green-500' :
                              task.status === 'failed' ? 'bg-red-500' :
                              task.status === 'running' ? 'bg-blue-500' :
                              task.status === 'paused' ? 'bg-purple-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.startTime !== '-' ? task.startTime : '未开始'}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags.map((tag, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {tasksByStatus.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      暂无任务
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">任务ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">任务名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">优先级</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">进度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">负责人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">开始时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTasks.map((task) => {
                const statusConfig = getStatusConfig(task.status);
                return (
                  <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{task.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>{statusConfig.label}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{getPriorityLabel(task.priority)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              task.status === 'success' ? 'bg-green-500' :
                              task.status === 'failed' ? 'bg-red-500' :
                              task.status === 'running' ? 'bg-blue-500' :
                              task.status === 'paused' ? 'bg-purple-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{task.assignee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{task.startTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">暂无数据</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

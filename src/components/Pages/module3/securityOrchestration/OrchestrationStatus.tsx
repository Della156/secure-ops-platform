'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Pause, Play, Eye, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const mockTasks = [
  { id: 'SO-001', name: '安全编排任务A', status: 'running', progress: 75, duration: '2小时30分', lastUpdate: '2分钟前', nextStep: '资产关联分析' },
  { id: 'SO-002', name: '安全编排任务B', status: 'running', progress: 45, duration: '1小时15分', lastUpdate: '5分钟前', nextStep: '决策策略匹配' },
  { id: 'SO-003', name: '安全编排任务C', status: 'completed', progress: 100, duration: '4小时', lastUpdate: '1小时前', nextStep: '-' },
  { id: 'SO-004', name: '安全编排任务D', status: 'running', progress: 60, duration: '3小时', lastUpdate: '1分钟前', nextStep: '处置动作执行' },
  { id: 'SO-005', name: '安全编排任务E', status: 'failed', progress: 30, duration: '30分钟', lastUpdate: '30分钟前', nextStep: '-' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'running': return '运行中';
    case 'completed': return '已完成';
    case 'failed': return '失败';
    default: return status;
  }
};

export function OrchestrationStatus() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 2, 100);
          return { ...task, progress: Math.round(newProgress) };
        }
        return task;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">编排任务状态监控</h1>
          <p className="text-slate-400 mt-1">实时监控安全编排任务的执行状态</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ${autoRefresh ? 'bg-blue-600 text-white' : 'bg-[#2A354D] text-slate-300 hover:bg-[#364360]'}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? '自动刷新中' : '开启自动刷新'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <RefreshCw className="w-3.5 h-3.5" />手动刷新
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">任务总数</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-semibold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">运行中</span>
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          </div>
          <div className="text-2xl font-semibold text-white">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">已完成</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-semibold text-white">{stats.completed}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">失败</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-semibold text-white">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">任务 ID</th>
              <th className="text-left px-4 py-2.5">任务名称</th>
              <th className="text-left px-4 py-2.5">状态</th>
              <th className="text-left px-4 py-2.5">进度</th>
              <th className="text-left px-4 py-2.5">运行时长</th>
              <th className="text-left px-4 py-2.5">下一步</th>
              <th className="text-left px-4 py-2.5">最后更新</th>
              <th className="text-right px-4 py-2.5">操作</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">{task.id}</td>
                <td className="px-4 py-3 text-white">{task.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs ${getStatusColor(task.status)}`}>
                    {task.status === 'running' && <Activity className="w-3 h-3 animate-pulse" />}
                    {task.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    {task.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                    {getStatusText(task.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#111625] rounded-full overflow-hidden w-24">
                      <div 
                        className={`h-full rounded-full ${task.status === 'failed' ? 'bg-red-500' : task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-10 text-right">{task.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300 text-xs">{task.duration}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{task.nextStep}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{task.lastUpdate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:bg-[#2A354D] rounded" title="查看">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {task.status === 'running' && (
                      <button className="p-1.5 hover:bg-[#2A354D] rounded" title="暂停">
                        <Pause className="w-3.5 h-3.5 text-orange-400" />
                      </button>
                    )}
                    {task.status === 'failed' && (
                      <button className="p-1.5 hover:bg-[#2A354D] rounded" title="重试">
                        <Play className="w-3.5 h-3.5 text-green-400" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {tasks.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
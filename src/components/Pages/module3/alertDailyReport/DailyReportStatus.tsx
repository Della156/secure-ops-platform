'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, X, AlertCircle, CheckCircle2, Clock, Send } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const tasks = [
  { id: 'DR-001', name: '告警日报_20260603', status: 'completed', progress: 100, pushStatus: 'success', pushTime: '08:00' },
  { id: 'DR-002', name: '告警日报_20260604', status: 'running', progress: 75, pushStatus: 'pending', pushTime: '--' },
  { id: 'DR-003', name: '告警日报_20260605', status: 'pending', progress: 0, pushStatus: 'pending', pushTime: '--' },
  { id: 'DR-004', name: '告警日报_20260601', status: 'completed', progress: 100, pushStatus: 'success', pushTime: '08:00' },
  { id: 'DR-005', name: '告警日报_20260531', status: 'failed', progress: 45, pushStatus: 'failed', pushTime: '--' },
];

const statusConfig = {
  pending: { label: '待生成', color: 'text-slate-400', bg: 'bg-slate-500/20', icon: <Clock className="w-4 h-4" /> },
  running: { label: '生成中', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-4 h-4" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <AlertCircle className="w-4 h-4" /> },
};

const pushStatusConfig = {
  pending: { label: '待推送', color: 'text-slate-400' },
  success: { label: '推送成功', color: 'text-green-400' },
  failed: { label: '推送失败', color: 'text-red-400' },
};

export function DailyReportStatus() {
  const [taskList, setTaskList] = useState(tasks);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaskList(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.floor(Math.random() * 10), 100);
          return {
            ...task,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'running',
          };
        }
        return task;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRetry = (taskId: string) => {
    setTaskList(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: 'running', progress: 0, pushStatus: 'pending', pushTime: '--' } : task
    ));
  };

  const handleStart = (taskId: string) => {
    setTaskList(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: 'running', progress: 0, pushStatus: 'pending', pushTime: '--' } : task
    ));
  };

  const handleStop = (taskId: string) => {
    setTaskList(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: 'failed', pushStatus: 'failed' } : task
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="告警日报任务状态监控" description="实时监控告警日报任务的生成和推送状态"
        actions={[
          <button key="refresh" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042] disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 刷新
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {taskList.map(task => {
          const config = statusConfig[task.status as keyof typeof statusConfig];
          const pushConfig = pushStatusConfig[task.pushStatus as keyof typeof pushStatusConfig];
          return (
            <div key={task.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <span className={config.color}>{config.icon}</span>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-blue-400">{task.id}</div>
                    <div className="text-sm text-white">{task.name}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.color}`}>
                  {config.label}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">生成进度</span>
                  <span className="text-xs text-white">{task.progress}%</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2A354D]">
                  <div className="flex items-center gap-2">
                    <Send className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-400">推送状态:</span>
                    <span className={`text-xs ${pushConfig.color}`}>{pushConfig.label}</span>
                  </div>
                  {task.pushTime !== '--' && (
                    <span className="text-xs text-slate-500">推送时间: {task.pushTime}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-500">已耗时: --</span>
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <button onClick={() => handleStart(task.id)} className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-md hover:bg-green-500/30">
                        <Play className="w-3 h-3" />开始
                      </button>
                    )}
                    {task.status === 'running' && (
                      <button onClick={() => handleStop(task.id)} className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-md hover:bg-red-500/30">
                        <X className="w-3 h-3" />停止
                      </button>
                    )}
                    {task.status === 'failed' && (
                      <button onClick={() => handleRetry(task.id)} className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md hover:bg-blue-500/30">
                        <RefreshCw className="w-3 h-3" />重试
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyReportStatus;

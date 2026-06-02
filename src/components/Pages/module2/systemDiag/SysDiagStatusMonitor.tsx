'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Server, TrendingUp, TrendingDown } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  target: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
  startTime: string;
  estimatedTime: string;
}

const mockTasks: TaskItem[] = [
  { id: 'SD-001', title: '系统故障排查', target: '服务器SRV-01', status: 'processing', progress: 65, startTime: '10:30:00', estimatedTime: '00:10:00' },
  { id: 'SD-002', title: '服务异常分析', target: '应用服务器APP-02', status: 'completed', progress: 100, startTime: '09:15:00', estimatedTime: '00:12:18' },
  { id: 'SD-003', title: '日志异常检测', target: '日志服务器LOG-01', status: 'processing', progress: 30, startTime: '10:45:00', estimatedTime: '00:08:00' },
];

export function SysDiagStatusMonitor() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'processing' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 5, 100);
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' as const : 'processing' as const
          };
        }
        return task;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: tasks.length,
    processing: tasks.filter(t => t.status === 'processing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统故障诊断任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">诊断任务执行状态的实时监控，诊断进度展示</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">总任务</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">诊断中</p>
          <p className="text-xl font-semibold text-blue-400">{stats.processing}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">已完成</p>
          <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">待诊断</p>
          <p className="text-xl font-semibold text-gray-400">{stats.pending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">{task.title}</span>
              </div>
              {task.status === 'processing' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>诊断目标: {task.target}</span>
              <span>开始时间: {task.startTime}</span>
            </div>

            {task.status !== 'pending' && (
              <div className="mb-3">
                <div className="w-full bg-[#111827] rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{Math.round(task.progress)}%</span>
                  <span className="text-xs text-gray-400">预计耗时: {task.estimatedTime}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">任务ID: {task.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                task.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {task.status === 'processing' ? '诊断中' : task.status === 'completed' ? '已完成' : '待诊断'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
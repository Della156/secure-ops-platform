'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface AuditTask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  lastUpdate: string;
}

const mockTasks: AuditTask[] = [
  { id: 'TASK-001', name: '定期权限审计', status: 'running', progress: 65, startTime: '2026-06-02 10:00:00', lastUpdate: '10:05:30' },
  { id: 'TASK-002', name: '僵尸账号检测', status: 'completed', progress: 100, startTime: '2026-06-02 09:00:00', lastUpdate: '09:15:00' },
  { id: 'TASK-003', name: '权限滥用检测', status: 'running', progress: 30, startTime: '2026-06-02 08:30:00', lastUpdate: '08:45:00' },
];

export function AuditTaskStatusMonitor() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 5, 100);
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">审计任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">审计任务执行状态的实时监控，状态变更记录</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {task.status === 'running' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
                {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {task.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                <span className="text-white font-medium">{task.name}</span>
              </div>
              <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-400 mb-4">
              <div className="flex justify-between">
                <span>开始时间</span>
                <span>{task.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span>最后更新</span>
                <span className="text-blue-400">{task.lastUpdate}</span>
              </div>
            </div>

            {task.status !== 'failed' && (
              <div className="mb-3">
                <div className="w-full bg-[#111827] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{Math.round(task.progress)}%</p>
              </div>
            )}

            <span className={`text-xs px-2 py-1 rounded ${
              task.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
              task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {task.status === 'running' ? '执行中' : task.status === 'completed' ? '已完成' : '失败'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
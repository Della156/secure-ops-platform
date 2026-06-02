'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Clock, User, Shield } from 'lucide-react';

interface RevokeTask {
  id: string;
  name: string;
  targetUser: string;
  targetPerm: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
}

const mockTasks: RevokeTask[] = [
  { id: 'REVOKE-001', name: '权限回收', targetUser: 'user-001', targetPerm: 'admin', status: 'running', progress: 65, startTime: '2026-06-02 10:00:00' },
  { id: 'REVOKE-002', name: '权限回收', targetUser: 'user-002', targetPerm: 'write', status: 'completed', progress: 100, startTime: '2026-06-02 09:30:00' },
  { id: 'REVOKE-003', name: '权限回收', targetUser: 'user-003', targetPerm: 'read', status: 'failed', progress: 30, startTime: '2026-06-02 09:00:00' },
];

export function RevokeStatusMonitor() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          return { ...task, progress: task.progress + Math.random() * 10 };
        }
        if (task.status === 'running' && task.progress >= 100) {
          return { ...task, progress: 100, status: 'completed' as const };
        }
        return task;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">回收过程状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">回收任务执行状态的实时监控，进度展示</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium text-sm">{task.name}</span>
              </div>
              {task.status === 'running' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {task.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
            </div>
            
            <div className="space-y-2 text-xs text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>目标用户: {task.targetUser}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>回收权限: {task.targetPerm}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>开始时间: {task.startTime}</span>
              </div>
            </div>

            {task.status !== 'failed' && (
              <div>
                <div className="w-full bg-[#111827] rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${Math.min(task.progress, 100)}%` }} 
                  />
                </div>
                <p className="text-xs text-gray-400">{Math.round(task.progress)}%</p>
              </div>
            )}

            <span className={`text-xs px-2 py-1 rounded mt-3 inline-block ${
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
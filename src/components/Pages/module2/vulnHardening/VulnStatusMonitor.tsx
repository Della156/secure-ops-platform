'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

interface MonitorTask {
  id: string;
  name: string;
  vulnId: string;
  target: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  verification: 'pending' | 'passed' | 'failed';
}

const mockTasks: MonitorTask[] = [
  { id: 'MON-001', name: 'CVE-2024-0001 修复', vulnId: 'CVE-2024-0001', target: 'prod-server-01', status: 'running', progress: 75, verification: 'pending' },
  { id: 'MON-002', name: 'CVE-2024-0002 修复', vulnId: 'CVE-2024-0002', target: 'prod-db', status: 'completed', progress: 100, verification: 'passed' },
];

export function VulnStatusMonitor() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          return { ...task, progress: task.progress + 2 };
        }
        if (task.status === 'running' && task.progress >= 100) {
          return { ...task, progress: 100, status: 'completed' as const, verification: 'passed' as const };
        }
        return task;
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全漏洞加固任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">加固任务执行状态的实时监控，修复结果验证</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium">{task.name}</span>
              </div>
              {task.status === 'running' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
              <div>漏洞编号: <span className="text-red-400">{task.vulnId}</span></div>
              <div>目标: {task.target}</div>
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
                <p className="text-xs text-gray-400 mt-1">{Math.round(task.progress)}%</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${
                task.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {task.status === 'running' ? '执行中' : task.status === 'completed' ? '已完成' : '失败'}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                task.verification === 'passed' ? 'bg-green-500/20 text-green-400' :
                task.verification === 'failed' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {task.verification === 'passed' ? '验证通过' : task.verification === 'failed' ? '验证失败' : '待验证'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
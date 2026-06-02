'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle, Archive, Shield } from 'lucide-react';

interface ExecTask {
  id: string;
  name: string;
  target: string;
  strategy: string;
  status: 'idle' | 'backing-up' | 'executing' | 'completed' | 'failed';
  progress: number;
}

const mockTasks: ExecTask[] = [
  { id: 'EXEC-001', name: '系统加固', target: 'prod-server-01', strategy: '标准加固策略', status: 'executing', progress: 65 },
  { id: 'EXEC-002', name: '数据库加固', target: 'prod-db', strategy: '数据库加固策略', status: 'backing-up', progress: 80 },
  { id: 'EXEC-003', name: '网络设备加固', target: 'fw-01', strategy: '网络设备策略', status: 'idle', progress: 0 },
];

export function HardeningExec() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'backing-up' && task.progress < 100) {
          const newProgress = Math.min(task.progress + 5, 100);
          if (newProgress >= 100) {
            return { ...task, progress: 0, status: 'executing' as const };
          }
          return { ...task, progress: newProgress };
        }
        if (task.status === 'executing' && task.progress < 100) {
          const newProgress = Math.min(task.progress + 3, 100);
          if (newProgress >= 100) {
            return { ...task, progress: 100, status: 'completed' as const };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExecute = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'backing-up', progress: 0 } : task
    ));
  };

  const getStatusText = (status: string) => {
    if (status === 'backing-up') return '备份中...';
    if (status === 'executing') return '执行中...';
    if (status === 'completed') return '已完成';
    if (status === 'failed') return '失败';
    return '待执行';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全基线加固执行</h2>
        <p className="text-sm text-gray-400 mt-1">按策略自动执行加固操作，支持批量加固，执行前备份</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium text-sm">{task.name}</span>
              </div>
              {task.status === 'backing-up' && <Archive className="w-5 h-5 text-yellow-400 animate-pulse" />}
              {task.status === 'executing' && <Clock className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {task.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-400" />}
            </div>
            
            <div className="space-y-2 text-xs text-gray-400 mb-4">
              <div>目标: {task.target}</div>
              <div>策略: {task.strategy}</div>
            </div>

            {(task.status === 'backing-up' || task.status === 'executing') && (
              <div className="mb-3">
                <div className="w-full bg-[#111827] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      task.status === 'backing-up' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{Math.round(task.progress)}%</p>
              </div>
            )}

            <span className={`text-xs px-2 py-1 rounded mb-3 inline-block ${
              task.status === 'backing-up' ? 'bg-yellow-500/20 text-yellow-400' :
              task.status === 'executing' ? 'bg-blue-500/20 text-blue-400' :
              task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
              task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {getStatusText(task.status)}
            </span>

            {task.status === 'idle' && (
              <button 
                onClick={() => handleExecute(task.id)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mt-3"
              >
                <Play className="w-4 h-4" />
                开始加固
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
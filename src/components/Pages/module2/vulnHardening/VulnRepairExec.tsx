'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface RepairTask {
  id: string;
  name: string;
  vulnId: string;
  target: string;
  status: 'idle' | 'executing' | 'completed' | 'failed';
  progress: number;
}

const mockTasks: RepairTask[] = [
  { id: 'REPAIR-001', name: 'CVE-2024-0001 修复', vulnId: 'CVE-2024-0001', target: 'prod-server-01', status: 'executing', progress: 65 },
  { id: 'REPAIR-002', name: 'CVE-2024-0002 修复', vulnId: 'CVE-2024-0002', target: 'prod-db', status: 'completed', progress: 100 },
  { id: 'REPAIR-003', name: 'CVE-2024-0003 修复', vulnId: 'CVE-2024-0003', target: 'app-01', status: 'idle', progress: 0 },
];

export function VulnRepairExec() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'executing' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 10, 100);
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
      task.id === id ? { ...task, status: 'executing', progress: 0 } : task
    ));
  };

  const handleBatchExecute = () => {
    setTasks(tasks.map(task => 
      task.status === 'idle' ? { ...task, status: 'executing', progress: 0 } : task
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全漏洞加固执行</h2>
        <p className="text-sm text-gray-400 mt-1">按策略自动执行漏洞修复（如打补丁、修改配置），支持批量执行</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <button 
          onClick={handleBatchExecute}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Play className="w-4 h-4" />
          批量执行修复
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium text-sm">{task.name}</span>
              </div>
              {task.status === 'executing' && <Clock className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {task.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-400" />}
            </div>
            
            <div className="space-y-2 text-xs text-gray-400 mb-4">
              <div>漏洞编号: <span className="text-red-400">{task.vulnId}</span></div>
              <div>目标: {task.target}</div>
            </div>

            {task.status !== 'idle' && task.status !== 'failed' && (
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

            <span className={`text-xs px-2 py-1 rounded mb-3 inline-block ${
              task.status === 'executing' ? 'bg-blue-500/20 text-blue-400' :
              task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
              task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {task.status === 'executing' ? '执行中' : task.status === 'completed' ? '已完成' : task.status === 'failed' ? '失败' : '待执行'}
            </span>

            {task.status === 'idle' && (
              <button 
                onClick={() => handleExecute(task.id)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mt-3"
              >
                <Play className="w-4 h-4" />
                执行修复
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
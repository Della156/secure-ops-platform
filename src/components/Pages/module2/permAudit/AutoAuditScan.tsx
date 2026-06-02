'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, AlertCircle, Database } from 'lucide-react';

interface ScanTask {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'scanning' | 'completed';
  progress: number;
  result?: { issues: number; total: number };
}

const mockTasks: ScanTask[] = [
  { id: 'SCAN-001', name: '全面权限审计', type: '定期扫描', status: 'scanning', progress: 45 },
  { id: 'SCAN-002', name: '僵尸账号检测', type: '专项扫描', status: 'completed', progress: 100, result: { issues: 12, total: 150 } },
  { id: 'SCAN-003', name: '权限滥用检测', type: '专项扫描', status: 'idle', progress: 0 },
];

export function AutoAuditScan() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'scanning' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 10, 100);
          if (newProgress >= 100) {
            return { 
              ...task, 
              progress: 100, 
              status: 'completed' as const,
              result: { issues: Math.floor(Math.random() * 20), total: 100 }
            };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'scanning', progress: 0 } : task
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">自动执行审计扫描</h2>
        <p className="text-sm text-gray-400 mt-1">按策略自动触发审计扫描，扫描进度展示，扫描结果存储</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium text-sm">{task.name}</span>
              </div>
              {task.status === 'scanning' && <Clock className="w-5 h-5 text-blue-400 animate-spin" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="text-xs text-gray-400 mb-3">
              扫描类型: <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{task.type}</span>
            </div>

            {task.status !== 'idle' && (
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

            {task.result && (
              <div className="bg-[#111827] rounded-lg p-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">扫描总数</span>
                  <span className="text-white">{task.result.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">发现问题</span>
                  <span className="text-red-400">{task.result.issues}</span>
                </div>
              </div>
            )}

            <button 
              onClick={() => handleScan(task.id)}
              disabled={task.status === 'scanning'}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                task.status === 'scanning' 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              {task.status === 'scanning' ? '扫描中...' : task.status === 'completed' ? '重新扫描' : '开始扫描'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
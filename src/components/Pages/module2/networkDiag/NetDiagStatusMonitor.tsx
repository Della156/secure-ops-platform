'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Network } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  target: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
  startTime: string;
}

const mockTasks: TaskItem[] = [
  { id: 'DIAG-001', title: '链路异常排查', target: '北京-上海链路', status: 'processing', progress: 65, startTime: '09:00:00' },
  { id: 'DIAG-002', title: '设备故障分析', target: '交换机SW-01', status: 'completed', progress: 100, startTime: '08:30:00' },
  { id: 'DIAG-003', title: '网络延迟诊断', target: '广州节点', status: 'pending', progress: 0, startTime: '' },
];

export function NetDiagStatusMonitor() {
  const [tasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟状态更新
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">网络故障诊断任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">诊断任务执行状态的实时监控，诊断进度展示</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">{task.title}</span>
              </div>
              {task.status === 'processing' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>诊断目标: {task.target}</span>
              {task.startTime && <span>开始时间: {task.startTime}</span>}
            </div>

            {task.status !== 'pending' && (
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
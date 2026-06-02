'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, FileText } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
  assignee: string;
}

const mockTasks: TaskItem[] = [
  { id: 'FW-001', title: '新增访问策略', status: 'processing', progress: 65, assignee: '张三' },
  { id: 'FW-002', title: '删除过期策略', status: 'completed', progress: 100, assignee: '李四' },
  { id: 'FW-003', title: '修改端口范围', status: 'pending', progress: 0, assignee: '王五' },
];

export function FwStatusMonitor() {
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
        <h2 className="text-xl font-semibold text-white">防火墙策略工单任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">工单处理状态的实时监控</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">{task.title}</span>
              </div>
              {task.status === 'processing' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>{task.id}</span>
              <span>处理人: {task.assignee}</span>
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

            <span className={`text-xs px-2 py-0.5 rounded ${
              task.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
              task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {task.status === 'processing' ? '处理中' : task.status === 'completed' ? '已完成' : '待处理'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
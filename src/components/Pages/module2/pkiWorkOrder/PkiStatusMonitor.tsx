'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, Shield, FileText } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  certType: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
  assignee: string;
}

const mockTasks: TaskItem[] = [
  { id: 'PKI-001', title: '颁发SSL证书', certType: 'SSL证书', status: 'processing', progress: 75, assignee: '张三' },
  { id: 'PKI-002', title: '员工入职证书配置', certType: '客户端证书', status: 'completed', progress: 100, assignee: '李四' },
  { id: 'PKI-003', title: '证书续期', certType: '代码签名证书', status: 'pending', progress: 0, assignee: '王五' },
];

export function PkiStatusMonitor() {
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
        <h2 className="text-xl font-semibold text-white">PKI工单任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">工单处理状态的实时监控，证书制作进度展示</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">{task.title}</span>
              </div>
              {task.status === 'processing' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>{task.id}</span>
              <span>证书类型: {task.certType}</span>
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
              <span className="text-xs text-gray-400">处理人: {task.assignee}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                task.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {task.status === 'processing' ? '处理中' : task.status === 'completed' ? '已完成' : '待处理'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
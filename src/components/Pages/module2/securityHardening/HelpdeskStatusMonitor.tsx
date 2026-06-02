'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, AlertTriangle, Phone } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'completed';
  assignee: string;
  waitingTime: number;
  progress: number;
}

const mockTasks: TaskItem[] = [
  { id: 'HD-001', title: '系统登录异常', priority: 'high', status: 'processing', assignee: '张三', waitingTime: 5, progress: 60 },
  { id: 'HD-002', title: '权限申请审批', priority: 'medium', status: 'pending', assignee: '李四', waitingTime: 15, progress: 0 },
  { id: 'HD-003', title: '设备配置咨询', priority: 'low', status: 'completed', assignee: '王五', waitingTime: 0, progress: 100 },
];

export function HelpdeskStatusMonitor() {
  const [tasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟任务进度更新
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-500/20 text-red-400';
    if (priority === 'medium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  const getPriorityText = (priority: string) => {
    if (priority === 'high') return '高';
    if (priority === 'medium') return '中';
    return '低';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全客服任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">客服任务处理状态的实时监控，响应超时告警，处理进度展示</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium text-sm">{task.title}</span>
              </div>
              {task.status === 'processing' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                优先级: {getPriorityText(task.priority)}
              </span>
              {task.waitingTime > 10 && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <Clock className="w-3 h-3" />
                  超时告警
                </span>
              )}
            </div>

            {task.status !== 'completed' && (
              <div className="mb-3">
                <div className="w-full bg-[#111827] rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500 transition-all" 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{Math.round(task.progress)}%</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">处理人: {task.assignee}</span>
              <span className={`px-2 py-0.5 rounded ${
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
'use client';

import React, { useState } from 'react';
import { Play, Clock, Calendar, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface DrillTask {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed';
  scheduleType: 'immediate' | 'scheduled';
  scheduledTime?: string;
  progress?: number;
}

const mockTasks: DrillTask[] = [
  { id: 'DRILL-001', name: '安全策略演练', type: '策略验证', status: 'pending', scheduleType: 'immediate' },
  { id: 'DRILL-002', name: '备份恢复演练', type: '灾难恢复', status: 'running', scheduleType: 'scheduled', scheduledTime: '2026-06-03 02:00:00', progress: 65 },
  { id: 'DRILL-003', name: '漏洞扫描演练', type: '安全检测', status: 'completed', scheduleType: 'immediate' },
  { id: 'DRILL-004', name: '应急响应演练', type: '应急响应', status: 'pending', scheduleType: 'scheduled', scheduledTime: '2026-06-05 09:00:00' },
];

export function DrillTaskExec() {
  const [tasks, setTasks] = useState<DrillTask[]>(mockTasks);
  const [scheduleTime, setScheduleTime] = useState('');

  const handleExecute = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'running', progress: 0 } : task
    ));
    
    setTimeout(() => {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, progress: 50 } : task
      ));
    }, 1000);
    
    setTimeout(() => {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, progress: 100, status: 'completed' } : task
      ));
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />已完成</span>;
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><Clock className="w-3 h-3 inline mr-1 animate-spin" />执行中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">待执行</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">演练任务执行</h2>
        <p className="text-sm text-gray-400 mt-1">演练任务的立即执行、定时执行调度，演练任务状态监控</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">新建演练任务</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">执行方式：</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Zap className="w-4 h-4" />
              立即执行
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Clock className="w-4 h-4" />
              定时执行
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">{task.name}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{task.type}</span>
                  {getStatusBadge(task.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    执行方式: {task.scheduleType === 'immediate' ? '立即执行' : '定时执行'}
                  </span>
                  {task.scheduledTime && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      调度时间: {task.scheduledTime}
                    </span>
                  )}
                </div>
                {task.status === 'running' && task.progress !== undefined && (
                  <div className="mt-3">
                    <div className="w-64 bg-[#111827] rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${task.progress}%` }} />
                    </div>
                    <p className="text-sm text-blue-400 mt-1">{task.progress}%</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {task.status === 'pending' && (
                  <button onClick={() => handleExecute(task.id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    立即执行
                  </button>
                )}
                {task.status === 'completed' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    再次执行
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
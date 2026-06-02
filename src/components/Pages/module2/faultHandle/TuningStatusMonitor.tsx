'use client';

import React, { useState } from 'react';
import { Activity, Clock, CheckCircle, AlertCircle, TrendingUp, Settings } from 'lucide-react';

interface TuningTask {
  id: string;
  name: string;
  target: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  params: { name: string; oldValue: string; newValue: string }[];
  startTime: string;
}

const mockTasks: TuningTask[] = [
  { 
    id: 'TUNE-001', 
    name: '内存参数调优', 
    target: 'prod-app-01', 
    status: 'running', 
    progress: 75,
    params: [
      { name: 'heap-size', oldValue: '2G', newValue: '4G' },
      { name: 'max-threads', oldValue: '100', newValue: '200' },
    ],
    startTime: '2026-06-02 10:00:00'
  },
  { 
    id: 'TUNE-002', 
    name: '连接池优化', 
    target: 'prod-db', 
    status: 'completed', 
    progress: 100,
    params: [
      { name: 'max-connections', oldValue: '100', newValue: '200' },
      { name: 'timeout', oldValue: '30s', newValue: '60s' },
    ],
    startTime: '2026-06-02 09:00:00'
  },
  { 
    id: 'TUNE-003', 
    name: '缓存配置调整', 
    target: 'redis-cluster', 
    status: 'failed', 
    progress: 30,
    params: [
      { name: 'max-memory', oldValue: '4G', newValue: '8G' },
    ],
    startTime: '2026-06-02 08:30:00'
  },
];

export function TuningStatusMonitor() {
  const [tasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState<TuningTask | null>(null);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统配置调优任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">调优任务执行状态的实时监控，参数变更对比</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">调优任务列表</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTask?.id === task.id 
                    ? 'bg-blue-600/20 border border-blue-500/50' 
                    : 'bg-[#111827] hover:bg-[#2A354D]/50'
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium text-sm">{task.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'running' && (
                      <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                    )}
                    {task.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {task.status === 'failed' && (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      task.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                      task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {task.status === 'running' ? '执行中' : task.status === 'completed' ? '已完成' : '失败'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{task.target}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.startTime}
                  </span>
                </div>
                {task.status === 'running' && (
                  <div className="mt-2">
                    <div className="w-full bg-[#2A354D] rounded-full h-1">
                      <div 
                        className="h-1 rounded-full bg-blue-500 transition-all" 
                        style={{ width: `${task.progress}%` }} 
                      />
                    </div>
                    <p className="text-xs text-blue-400 mt-1">{task.progress}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">参数变更对比</h3>
          
          {selectedTask ? (
            <div className="space-y-4">
              <div className="bg-[#111827] rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{selectedTask.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    selectedTask.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    selectedTask.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedTask.status === 'running' ? '执行中' : selectedTask.status === 'completed' ? '已完成' : '失败'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-4">目标: {selectedTask.target}</div>
                
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs">
                      <th className="text-left py-2">参数名</th>
                      <th className="text-left py-2">变更前</th>
                      <th className="text-left py-2">变更后</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTask.params.map((param, idx) => (
                      <tr key={idx} className="border-t border-[#2A354D]">
                        <td className="py-2 text-gray-300">{param.name}</td>
                        <td className="py-2 text-red-400">{param.oldValue}</td>
                        <td className="py-2 text-green-400">{param.newValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <TrendingUp className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">选择任务查看参数变更</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
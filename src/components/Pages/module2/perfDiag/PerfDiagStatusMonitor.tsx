'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Server, Play, Pause, RotateCcw } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  target: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedTime: string;
}

const mockTasks: TaskItem[] = [
  { id: 'PERF-001', title: 'CPU性能分析', target: 'SRV-01', type: 'CPU分析', status: 'processing', progress: 65, startTime: '10:30:00', estimatedTime: '00:02:00' },
  { id: 'PERF-002', title: '内存泄漏检测', target: 'APP-02', type: '内存分析', status: 'completed', progress: 100, startTime: '10:15:00', estimatedTime: '00:08:30' },
  { id: 'PERF-003', title: '数据库慢查询分析', target: 'DB-01', type: '数据库分析', status: 'processing', progress: 35, startTime: '10:28:00', estimatedTime: '00:05:00' },
  { id: 'PERF-004', title: '网络带宽测试', target: 'SW-01', type: '网络测试', status: 'pending', progress: 0, startTime: '-', estimatedTime: '00:03:00' },
  { id: 'PERF-005', title: '磁盘IO监控', target: 'STOR-01', type: '存储分析', status: 'failed', progress: 45, startTime: '10:00:00', estimatedTime: '00:04:00' },
];

export function PerfDiagStatusMonitor() {
  const [tasks, setTasks] = useState(mockTasks);
  const [lastUpdate, setLastUpdate] = useState('10:30:00');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
      setTasks(prev => prev.map(task => {
        if (task.status === 'processing' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 5, 100);
          return { ...task, progress: newProgress, status: newProgress >= 100 ? 'completed' : 'processing' };
        }
        return task;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: tasks.length,
    processing: tasks.filter(t => t.status === 'processing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Activity className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return '运行中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return '等待中';
    }
  };

  const handleRetry = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: 'processing', progress: 0, startTime: new Date().toLocaleTimeString('zh-CN', { hour12: false }) } : task
    ));
  };

  const handlePause = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id && task.status === 'processing' ? { ...task, status: 'pending' } : task
    ));
  };

  const handleStart = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id && task.status === 'pending' ? { ...task, status: 'processing', startTime: new Date().toLocaleTimeString('zh-CN', { hour12: false }) } : task
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">性能诊断任务状态监控</h2>
            <p className="text-sm text-gray-400 mt-1">状态实时监控</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            最后更新: {lastUpdate}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">总任务</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">运行中</p>
          <p className="text-xl font-semibold text-blue-400">{stats.processing}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">已完成</p>
          <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">失败</p>
          <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {tasks.map((task) => (
          <div key={task.id} className={`bg-[#1E2736] border rounded-lg p-4 ${getStatusColor(task.status).split(' ').slice(2).join(' ')}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                <div>
                  <span className="text-white font-medium">{task.title}</span>
                  <span className="text-xs text-gray-500 ml-2">{task.id}</span>
                </div>
              </div>
              {getStatusIcon(task.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-500">目标</span>
                <p className="text-sm text-gray-300">{task.target}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">类型</span>
                <p className="text-sm text-gray-300">{task.type}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">开始时间</span>
                <p className="text-sm text-gray-300">{task.startTime}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">预计耗时</span>
                <p className="text-sm text-gray-300">{task.estimatedTime}</p>
              </div>
            </div>

            {task.status !== 'pending' && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">进度</span>
                  <span className="text-xs text-gray-400">{Math.round(task.progress)}%</span>
                </div>
                <div className="w-full bg-[#111827] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'failed' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(task.status).split(' ').slice(0, 2).join(' ')}`}>
                {getStatusLabel(task.status)}
              </span>
              <div className="flex items-center gap-1">
                {task.status === 'pending' && (
                  <button 
                    onClick={() => handleStart(task.id)}
                    className="p-1.5 hover:bg-[#2A354D] rounded transition-colors"
                    title="开始"
                  >
                    <Play className="w-4 h-4 text-green-400" />
                  </button>
                )}
                {task.status === 'processing' && (
                  <button 
                    onClick={() => handlePause(task.id)}
                    className="p-1.5 hover:bg-[#2A354D] rounded transition-colors"
                    title="暂停"
                  >
                    <Pause className="w-4 h-4 text-yellow-400" />
                  </button>
                )}
                {task.status === 'failed' && (
                  <button 
                    onClick={() => handleRetry(task.id)}
                    className="p-1.5 hover:bg-[#2A354D] rounded transition-colors"
                    title="重试"
                  >
                    <RotateCcw className="w-4 h-4 text-blue-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <h3 className="text-sm font-medium text-gray-300">任务执行历史</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">进度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">开始时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#2A354D]/30">
                  <td className="px-4 py-3 text-sm text-blue-400">{task.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{task.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{task.target}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status).split(' ').slice(0, 2).join(' ')}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {task.status !== 'pending' && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#111827] rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' :
                              task.status === 'failed' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`} 
                            style={{ width: `${task.progress}%` }} 
                          />
                        </div>
                        <span className="text-xs text-gray-400">{Math.round(task.progress)}%</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{task.startTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

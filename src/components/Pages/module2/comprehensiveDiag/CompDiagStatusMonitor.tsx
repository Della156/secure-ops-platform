'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Server, Network, Database, Shield } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  target: string;
  type: 'network' | 'server' | 'database' | 'security' | 'storage';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedTime: string;
  currentStep: string;
}

const mockTasks: TaskItem[] = [
  { id: 'CD-001', title: '网络系统综合诊断', target: '数据中心网络设备', type: 'network', status: 'processing', progress: 65, startTime: '10:30:00', estimatedTime: '00:20:00', currentStep: '路由表分析' },
  { id: 'CD-002', title: '服务器集群健康检查', target: '应用服务器集群', type: 'server', status: 'completed', progress: 100, startTime: '09:15:00', estimatedTime: '00:15:00', currentStep: '完成' },
  { id: 'CD-003', title: '数据库性能诊断', target: '主数据库集群', type: 'database', status: 'processing', progress: 30, startTime: '10:45:00', estimatedTime: '00:25:00', currentStep: '慢查询分析' },
  { id: 'CD-004', title: '安全系统状态检查', target: '防火墙/IDS系统', type: 'security', status: 'pending', progress: 0, startTime: '-', estimatedTime: '00:18:00', currentStep: '等待中' },
  { id: 'CD-005', title: '存储系统性能诊断', target: 'SAN存储阵列', type: 'storage', status: 'failed', progress: 45, startTime: '08:30:00', estimatedTime: '00:22:00', currentStep: '连接超时' },
];

export function CompDiagStatusMonitor() {
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'processing' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 8, 100);
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' as const : 'processing' as const,
            currentStep: newProgress >= 100 ? '完成' : task.currentStep
          };
        }
        return task;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: tasks.length,
    processing: tasks.filter(t => t.status === 'processing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'network': return <Network className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'storage': return <Server className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'network': return 'text-cyan-400';
      case 'server': return 'text-blue-400';
      case 'database': return 'text-green-400';
      case 'security': return 'text-purple-400';
      case 'storage': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">综合故障诊断任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">诊断任务执行状态的实时监控</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">总任务</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">诊断中</p>
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
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">待诊断</p>
          <p className="text-xl font-semibold text-gray-400">{stats.pending}</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`${getTypeColor(task.type)}`}>
                  {getTypeIcon(task.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{task.title}</span>
                    <span className="text-xs text-gray-500">{task.id}</span>
                  </div>
                  <p className="text-sm text-gray-400">{task.target}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {task.status === 'processing' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
                {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {task.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                {task.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                <span className={`px-3 py-1 rounded text-xs ${
                  task.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                  task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {task.status === 'processing' ? '诊断中' : 
                   task.status === 'completed' ? '已完成' : 
                   task.status === 'failed' ? '失败' : '待诊断'}
                </span>
              </div>
            </div>

            {task.status !== 'pending' && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>{task.currentStep}</span>
                  <span>{Math.round(task.progress)}%</span>
                </div>
                <div className="w-full bg-[#111827] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      task.status === 'completed' ? 'bg-green-500' : 
                      task.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-4">
              <div className="flex items-center gap-4">
                <span>开始时间: {task.startTime}</span>
                <span>预计耗时: {task.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                {task.status === 'failed' && (
                  <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors">
                    重试
                  </button>
                )}
                {task.status === 'pending' && (
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors">
                    启动
                  </button>
                )}
                <button className="px-3 py-1 bg-[#2A354D] text-gray-300 rounded hover:bg-[#3A455D] transition-colors">
                  详情
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

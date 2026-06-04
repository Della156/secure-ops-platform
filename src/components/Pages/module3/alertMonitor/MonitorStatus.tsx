'use client';

import React, { useState } from 'react';
import { RefreshCw, Play, Pause, Eye, Clock, CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MonitorTask {
  id: string;
  name: string;
  status: 'running' | 'waiting' | 'completed' | 'failed';
  progress: number;
  duration: string;
}

const mockTasks: MonitorTask[] = [
  { id: 'MON-001', name: 'SIEM告警采集', status: 'running', progress: 75, duration: '02:30:15' },
  { id: 'MON-002', name: '防火墙日志采集', status: 'running', progress: 60, duration: '01:45:30' },
  { id: 'MON-003', name: '告警自动分析', status: 'running', progress: 45, duration: '00:55:20' },
  { id: 'MON-004', name: '影响范围评估', status: 'waiting', progress: 0, duration: '--' },
  { id: 'MON-005', name: '趋势预测', status: 'completed', progress: 100, duration: '00:30:00' },
  { id: 'MON-006', name: '旧数据清理', status: 'failed', progress: 30, duration: '00:15:00' },
];

const statusDistribution = [
  { name: '运行中', value: 3, color: '#22C55E' },
  { name: '等待中', value: 1, color: '#3B82F6' },
  { name: '已完成', value: 1, color: '#10B981' },
  { name: '失败', value: 1, color: '#EF4444' },
];

export function MonitorStatus() {
  const [tasks] = useState(mockTasks);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 text-green-400" />;
      case 'waiting': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-500/20';
      case 'waiting': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">告警辅助监测任务状态监控</h2>
            <p className="text-sm text-gray-400 mt-1">实时监控所有监测任务状态、进度、运行时长</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '刷新中...' : '刷新'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">运行中</span>
          </div>
          <p className="text-2xl font-semibold text-green-400">3</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">等待中</span>
          </div>
          <p className="text-2xl font-semibold text-blue-400">1</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">已完成</span>
          </div>
          <p className="text-2xl font-semibold text-green-400">1</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-gray-400 text-sm">失败</span>
          </div>
          <p className="text-2xl font-semibold text-red-400">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">状态分布</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={25} outerRadius={50} paddingAngle={2} dataKey="value">
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">任务状态列表</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-[#111827] rounded-lg p-4 border ${task.status === 'failed' ? 'border-red-500/50' : 'border-[#2A354D]'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <span className="text-white text-sm font-medium">{task.name}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getStatusColor(task.status)}`}>
                        {task.status === 'running' ? '运行中' : task.status === 'waiting' ? '等待中' : task.status === 'completed' ? '已完成' : '失败'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-gray-400 text-xs">运行时长</span>
                      <p className="text-white text-sm">{task.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      {task.status === 'running' && (
                        <button className="p-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 rounded text-yellow-400 transition-colors" title="暂停">
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {(task.status === 'waiting' || task.status === 'failed') && (
                        <button className="p-1.5 bg-green-600/20 hover:bg-green-600/30 rounded text-green-400 transition-colors" title="启动">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {task.status !== 'waiting' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">进度</span>
                      <span className="text-gray-400">{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#2A354D] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(task.status)}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
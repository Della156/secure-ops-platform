'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Clock, Database, AlertTriangle } from 'lucide-react';

interface MonitorItem {
  id: string;
  taskName: string;
  target: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  lastUpdate: string;
  message: string;
}

const mockData: MonitorItem[] = [
  { id: 'MON-001', taskName: '数据库恢复', target: 'prod-db', status: 'running', progress: 75, startTime: '2026-06-02 10:00:00', lastUpdate: '刚刚', message: '正在恢复数据表...' },
  { id: 'MON-002', taskName: '日志恢复', target: 'log-server', status: 'success', progress: 100, startTime: '2026-06-02 11:00:00', lastUpdate: '10分钟前', message: '恢复完成' },
  { id: 'MON-003', taskName: '配置恢复', target: 'config-server', status: 'pending', progress: 0, startTime: '-', lastUpdate: '-', message: '等待执行' },
  { id: 'MON-004', taskName: '用户数据恢复', target: 'user-db', status: 'failed', progress: 40, startTime: '2026-06-02 09:00:00', lastUpdate: '1小时前', message: '备份文件损坏' },
];

export function RestoreStatusMonitor() {
  const [data, setData] = useState<MonitorItem[]>(mockData);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setData(prev => prev.map(item => {
        if (item.status === 'running' && item.progress < 100) {
          return { ...item, progress: Math.min(100, item.progress + Math.random() * 5) };
        }
        return item;
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === 'running') return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
    if (status === 'success') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'failed') return <XCircle className="w-5 h-5 text-red-400" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStatusText = (status: string) => {
    if (status === 'running') return '恢复中';
    if (status === 'success') return '已成功';
    if (status === 'failed') return '失败';
    return '等待中';
  };

  const stats = {
    running: data.filter(d => d.status === 'running').length,
    success: data.filter(d => d.status === 'success').length,
    failed: data.filter(d => d.status === 'failed').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">恢复状态监控</h2>
            <p className="text-sm text-gray-400 mt-1">恢复任务执行状态的实时监控，状态变更记录</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">实时更新</span>
            <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">恢复中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已成功</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">等待中</p>
              <p className="text-xl font-semibold text-gray-400">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{item.taskName}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.target}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{item.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {item.status === 'running' && (
                  <div className="text-right">
                    <div className="w-32 bg-[#111827] rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <p className="text-sm text-blue-400 mt-1">{Math.round(item.progress)}%</p>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-xs text-gray-500">状态</p>
                  <p className={`text-sm font-medium ${item.status === 'success' ? 'text-green-400' : item.status === 'failed' ? 'text-red-400' : item.status === 'running' ? 'text-blue-400' : 'text-gray-400'}`}>
                    {getStatusText(item.status)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
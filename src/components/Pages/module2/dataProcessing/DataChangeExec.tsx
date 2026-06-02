'use client';

import React, { useState } from 'react';
import { Play, Clock, Calendar, CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap } from 'lucide-react';

interface ChangeTask {
  id: string;
  name: string;
  type: string;
  target: string;
  changeContent: string;
  scheduleType: 'manual' | 'scheduled';
  scheduledTime: string;
  status: 'ready' | 'executing' | 'completed' | 'failed';
  result: string;
}

const mockData: ChangeTask[] = [
  { id: 'DC-001', name: '用户密码批量更新', type: '密码变更', target: 'user-service', changeContent: '更新100个用户密码', scheduleType: 'manual', scheduledTime: '-', status: 'completed', result: '成功更新100个用户密码' },
  { id: 'DC-002', name: '配置参数调整', type: '配置变更', target: 'config-service', changeContent: '调整连接池大小', scheduleType: 'scheduled', scheduledTime: '2026-06-03 02:00:00', status: 'ready', result: '-' },
  { id: 'DC-003', name: '数据库索引重建', type: '数据维护', target: 'database', changeContent: '重建用户表索引', scheduleType: 'manual', scheduledTime: '-', status: 'executing', result: '执行中...' },
  { id: 'DC-004', name: '缓存数据刷新', type: '缓存更新', target: 'cache-service', changeContent: '刷新全局缓存', scheduleType: 'manual', scheduledTime: '-', status: 'failed', result: '网络超时，重试中' },
];

export function DataChangeExec() {
  const [data, setData] = useState<ChangeTask[]>(mockData);
  const [scheduleTime, setScheduleTime] = useState('');

  const handleExecute = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: 'executing' } : item
    ));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />已完成</span>;
    if (status === 'executing') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />执行中</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400"><Clock className="w-3 h-3 inline mr-1" />待执行</span>;
  };

  const stats = {
    ready: data.filter(d => d.status === 'ready').length,
    executing: data.filter(d => d.status === 'executing').length,
    completed: data.filter(d => d.status === 'completed').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据变更执行</h2>
        <p className="text-sm text-gray-400 mt-1">数据处理变更执行（手动/定时），变更结果验证</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">待执行</p>
          <p className="text-2xl font-semibold text-gray-400 mt-1">{stats.ready}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">执行中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.executing}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已完成</p>
              <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
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
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">快速执行</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Zap className="w-4 h-4" />
            立即执行
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">定时执行：</span>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Clock className="w-4 h-4" />
              定时执行
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.type}</span>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-gray-400 mb-2">目标: <span className="text-white">{item.target}</span></p>
                <p className="text-sm text-gray-400">变更内容: {item.changeContent}</p>
                {item.scheduleType === 'scheduled' && (
                  <p className="text-sm text-yellow-400 mt-2">
                    <Clock className="w-3 h-3 inline mr-1" />
                    定时时间: {item.scheduledTime}
                  </p>
                )}
                {item.result !== '-' && (
                  <p className={`text-sm mt-2 ${item.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.result}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {item.status === 'ready' && (
                  <button 
                    onClick={() => handleExecute(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    执行
                  </button>
                )}
                {item.status === 'executing' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    执行中
                  </button>
                )}
                {item.status === 'failed' && (
                  <button 
                    onClick={() => handleExecute(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                    重试
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
'use client';

import React, { useState } from 'react';
import { Play, Clock, Calendar, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';

interface ScheduleItem {
  id: string;
  taskName: string;
  source: string;
  target: string;
  scheduleType: 'immediate' | 'scheduled';
  scheduledTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

const mockData: ScheduleItem[] = [
  { id: 'SC-001', taskName: '数据库恢复', source: 'prod-db_20260602', target: 'prod-db', scheduleType: 'immediate', scheduledTime: '-', priority: 'high', status: 'completed' },
  { id: 'SC-002', taskName: '日志恢复', source: 'log-server_20260602', target: 'log-server', scheduleType: 'scheduled', scheduledTime: '2026-06-03 02:00:00', priority: 'medium', status: 'pending' },
  { id: 'SC-003', taskName: '配置恢复', source: 'config-server_20260602', target: 'config-server', scheduleType: 'immediate', scheduledTime: '-', priority: 'high', status: 'executing' },
  { id: 'SC-004', taskName: '用户数据恢复', source: 'user-db_20260601', target: 'user-db', scheduleType: 'immediate', scheduledTime: '-', priority: 'high', status: 'failed' },
];

export function RestoreTaskSchedule() {
  const [data, setData] = useState<ScheduleItem[]>(mockData);
  const [scheduleTime, setScheduleTime] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleExecute = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: 'executing' } : item
    ));
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">高优先级</span>;
    if (priority === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中优先级</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低优先级</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />已完成</span>;
    if (status === 'executing') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><Clock className="w-3 h-3 inline mr-1 animate-spin" />执行中</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">待执行</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">恢复任务调度</h2>
        <p className="text-sm text-gray-400 mt-1">恢复任务的立即执行、定时执行调度，恢复任务优先级配置</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">新建恢复任务</h3>
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">优先级：</span>
            <div className="flex gap-2">
              <button onClick={() => setPriority('high')} className={`px-3 py-1 rounded-lg text-xs transition-colors ${priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-[#2A354D] text-gray-400 hover:bg-[#3A456D]'}`}>高</button>
              <button onClick={() => setPriority('medium')} className={`px-3 py-1 rounded-lg text-xs transition-colors ${priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[#2A354D] text-gray-400 hover:bg-[#3A456D]'}`}>中</button>
              <button onClick={() => setPriority('low')} className={`px-3 py-1 rounded-lg text-xs transition-colors ${priority === 'low' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#2A354D] text-gray-400 hover:bg-[#3A456D]'}`}>低</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white">{item.taskName}</span>
                  {getPriorityBadge(item.priority)}
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-gray-400">来源: {item.source}</p>
                <p className="text-sm text-gray-400">目标: {item.target}</p>
                {item.scheduleType === 'scheduled' && (
                  <p className="text-sm text-yellow-400 mt-2">
                    <Clock className="w-3 h-3 inline mr-1" />
                    调度时间: {item.scheduledTime}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {item.status === 'pending' && (
                  <button onClick={() => handleExecute(item.id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    立即执行
                  </button>
                )}
                {item.status === 'failed' && (
                  <button onClick={() => handleExecute(item.id)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
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
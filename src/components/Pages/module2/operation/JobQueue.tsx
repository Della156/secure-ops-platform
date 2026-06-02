'use client';

import React, { useState } from 'react';
import { Search, ClipboardList, Clock, CheckCircle, XCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface JobItem {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  queuePosition: number;
  submittedAt: string;
  startedAt: string;
  worker: string;
}

const mockData: JobItem[] = [
  { id: 'JOB-001', name: '安全策略同步', priority: 'high', status: 'processing', queuePosition: 1, submittedAt: '2026-06-02 10:30:00', startedAt: '2026-06-02 10:30:05', worker: 'worker-01' },
  { id: 'JOB-002', name: '日志分析', priority: 'medium', status: 'queued', queuePosition: 2, submittedAt: '2026-06-02 10:31:00', startedAt: '-', worker: '-' },
  { id: 'JOB-003', name: '漏洞扫描', priority: 'high', status: 'queued', queuePosition: 3, submittedAt: '2026-06-02 10:32:00', startedAt: '-', worker: '-' },
  { id: 'JOB-004', name: '数据备份', priority: 'low', status: 'completed', queuePosition: 0, submittedAt: '2026-06-02 10:20:00', startedAt: '2026-06-02 10:20:05', worker: 'worker-02' },
  { id: 'JOB-005', name: '配置更新', priority: 'medium', status: 'failed', queuePosition: 0, submittedAt: '2026-06-02 10:15:00', startedAt: '2026-06-02 10:15:05', worker: 'worker-03' },
];

export function JobQueue() {
  const [data] = useState<JobItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    processing: data.filter(d => d.status === 'processing').length,
    queued: data.filter(d => d.status === 'queued').length,
    completed: data.filter(d => d.status === 'completed').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">高</span>;
    if (priority === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">低</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'processing') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">处理中</span>;
    if (status === 'queued') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">队列中</span>;
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'processing') return <ArrowDown className="w-4 h-4 text-blue-400 animate-pulse" />;
    if (status === 'queued') return <ClipboardList className="w-4 h-4 text-yellow-400" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">任务队列管理</h2>
        <p className="text-sm text-gray-400 mt-1">管理任务队列和执行状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">处理中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.processing}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">队列中</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.queued}</p>
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

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">优先级</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">队列位置</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">提交时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">开始时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Worker</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getPriorityBadge(item.priority)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.queuePosition > 0 ? `第${item.queuePosition}位` : '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.submittedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.startedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.worker}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { MessageSquare, ArrowUp, ArrowDown, Clock, AlertTriangle } from 'lucide-react';

interface Queue {
  name: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  status: 'normal' | 'warning' | 'error';
}

export function MessageQueueMonitor() {
  const [selectedQueue, setSelectedQueue] = useState<string>('all');

  const mockQueues: Queue[] = [
    { name: 'sync-task', pending: 12, processing: 3, completed: 1567, failed: 2, status: 'normal' },
    { name: 'alert-notify', pending: 89, processing: 15, completed: 890, failed: 15, status: 'warning' },
    { name: 'data-export', pending: 5, processing: 2, completed: 234, failed: 0, status: 'normal' },
    { name: 'audit-log', pending: 234, processing: 45, completed: 12345, failed: 3, status: 'normal' },
    { name: 'backup-job', pending: 0, processing: 0, completed: 67, failed: 1, status: 'normal' },
    { name: 'api-request', pending: 1567, processing: 234, completed: 98765, failed: 45, status: 'warning' },
  ];

  const filteredQueues = selectedQueue === 'all' ? mockQueues : mockQueues.filter(q => q.name === selectedQueue);

  const totalStats = {
    pending: mockQueues.reduce((sum, q) => sum + q.pending, 0),
    processing: mockQueues.reduce((sum, q) => sum + q.processing, 0),
    completed: mockQueues.reduce((sum, q) => sum + q.completed, 0),
    failed: mockQueues.reduce((sum, q) => sum + q.failed, 0),
  };

  const queues = ['all', ...mockQueues.map(q => q.name)];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">消息队列监控</h2>
          <p className="text-sm text-gray-400 mt-1">监控消息队列状态和处理情况</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">待处理</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{totalStats.pending}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">处理中</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{totalStats.processing}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">已完成</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{totalStats.completed.toLocaleString()}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">失败</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{totalStats.failed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <select
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {queues.map(q => (
              <option key={q} value={q}>{q === 'all' ? '全部队列' : q}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">队列名称</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">待处理</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">处理中</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">已完成</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">失败</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueues.map((queue) => (
              <tr key={queue.name} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3 font-medium text-white">{queue.name}</td>
                <td className="px-4 py-3 text-sm text-right text-yellow-400">{queue.pending}</td>
                <td className="px-4 py-3 text-sm text-right text-blue-400">{queue.processing}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-400">{queue.completed.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-right text-red-400">{queue.failed}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    queue.status === 'normal' ? 'bg-green-500/20 text-green-400' :
                    queue.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {queue.status === 'normal' ? '正常' : queue.status === 'warning' ? '警告' : '错误'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MessageQueueMonitor;
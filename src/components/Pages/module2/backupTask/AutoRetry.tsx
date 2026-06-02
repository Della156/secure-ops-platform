'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, Search } from 'lucide-react';

interface RetryItem {
  id: string;
  taskName: string;
  target: string;
  failedTime: string;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'retrying' | 'success' | 'exhausted';
  lastRetry: string;
  nextRetry: string;
}

const mockData: RetryItem[] = [
  { id: 'RTY-001', taskName: '用户数据备份', target: 'user-db', failedTime: '2026-06-02 01:10:00', retryCount: 2, maxRetries: 3, status: 'retrying', lastRetry: '2026-06-02 01:15:00', nextRetry: '2026-06-02 01:20:00' },
  { id: 'RTY-002', taskName: '代码仓库备份', target: 'git-server', failedTime: '2026-06-02 04:05:00', retryCount: 3, maxRetries: 3, status: 'exhausted', lastRetry: '2026-06-02 04:20:00', nextRetry: '-' },
  { id: 'RTY-003', taskName: '日志文件备份', target: 'log-server', failedTime: '2026-06-02 03:10:00', retryCount: 1, maxRetries: 3, status: 'success', lastRetry: '2026-06-02 03:15:00', nextRetry: '-' },
  { id: 'RTY-004', taskName: '配置文件备份', target: 'config-server', failedTime: '2026-06-02 05:00:00', retryCount: 0, maxRetries: 3, status: 'pending', lastRetry: '-', nextRetry: '2026-06-02 05:05:00' },
];

export function AutoRetry() {
  const [data] = useState<RetryItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(item =>
    !searchKeyword || 
    item.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.target.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    pending: data.filter(d => d.status === 'pending').length,
    retrying: data.filter(d => d.status === 'retrying').length,
    success: data.filter(d => d.status === 'success').length,
    exhausted: data.filter(d => d.status === 'exhausted').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400"><Clock className="w-3 h-3 inline mr-1" />待重试</span>;
    if (status === 'retrying') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />重试中</span>;
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />重试成功</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><AlertTriangle className="w-3 h-3 inline mr-1" />重试耗尽</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">异常自动重试</h2>
        <p className="text-sm text-gray-400 mt-1">备份失败任务的自动重试执行，重试结果记录</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">待重试</p>
              <p className="text-xl font-semibold text-gray-400">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">重试中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.retrying}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">重试成功</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">重试耗尽</p>
              <p className="text-xl font-semibold text-red-400">{stats.exhausted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索任务名称或目标..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">失败时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">重试次数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">下次重试</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white font-medium">{item.taskName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.target}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.failedTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{item.retryCount}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-sm text-gray-400">{item.maxRetries}</span>
                      <div className="w-16 bg-[#111827] rounded-full h-1.5 ml-2">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${(item.retryCount / item.maxRetries) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.nextRetry}</td>
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
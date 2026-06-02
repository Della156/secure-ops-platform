'use client';

import React, { useState } from 'react';
import { Search, Trash2, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface CleanupTask {
  id: string;
  name: string;
  type: string;
  schedule: string;
  retentionDays: number;
  lastCleanup: string;
  cleanedCount: number;
  status: 'success' | 'failed' | 'pending';
}

const mockData: CleanupTask[] = [
  { id: 'CLN-001', name: '临时日志清理', type: '自动', schedule: '每日 04:00', retentionDays: 7, lastCleanup: '2026-06-02 04:00:00', cleanedCount: 15000, status: 'success' },
  { id: 'CLN-002', name: '归档日志清理', type: '自动', schedule: '每周日 01:00', retentionDays: 30, lastCleanup: '2026-05-25 01:00:00', cleanedCount: 500000, status: 'success' },
  { id: 'CLN-003', name: '错误日志清理', type: '手动', schedule: '按需', retentionDays: 90, lastCleanup: '2026-06-01 10:00:00', cleanedCount: 12000, status: 'success' },
  { id: 'CLN-004', name: '调试日志清理', type: '自动', schedule: '每日 03:00', retentionDays: 3, lastCleanup: '2026-06-02 03:00:00', cleanedCount: 80000, status: 'success' },
  { id: 'CLN-005', name: '审计日志清理', type: '手动', schedule: '按需', retentionDays: 180, lastCleanup: '-', cleanedCount: 0, status: 'pending' },
];

export function LogCleanup() {
  const [data] = useState<CleanupTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    failed: data.filter(d => d.status === 'failed').length,
    pending: data.filter(d => d.status === 'pending').length,
    totalCleaned: data.reduce((sum, d) => sum + d.cleanedCount, 0),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">成功</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待执行</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志数据清理</h2>
        <p className="text-sm text-gray-400 mt-1">管理日志数据的清理策略和执行状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">清理任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功</p>
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
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待执行</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">已清理日志</p>
          <p className="text-2xl font-semibold text-white mt-1">{(stats.totalCleaned / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">调度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次清理</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">清理数量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.schedule}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.retentionDays}天</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastCleanup}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{(item.cleanedCount / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
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
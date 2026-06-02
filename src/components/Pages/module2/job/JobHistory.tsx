'use client';

import React, { useState } from 'react';
import { Search, History, CheckCircle, XCircle, Clock } from 'lucide-react';

interface HistoryItem {
  id: string;
  name: string;
  type: string;
  status: 'success' | 'failed';
  startTime: string;
  endTime: string;
  duration: string;
  executor: string;
}

const mockData: HistoryItem[] = [
  { id: 'HIST-001', name: '日志清理作业', type: '清理', status: 'success', startTime: '2026-06-02 04:00:00', endTime: '2026-06-02 04:30:00', duration: '30分钟', executor: 'system' },
  { id: 'HIST-002', name: '数据备份作业', type: '备份', status: 'success', startTime: '2026-06-02 02:00:00', endTime: '2026-06-02 02:15:00', duration: '15分钟', executor: 'system' },
  { id: 'HIST-003', name: '系统升级作业', type: '升级', status: 'failed', startTime: '2026-06-02 01:00:00', endTime: '2026-06-02 01:10:00', duration: '10分钟', executor: 'admin' },
  { id: 'HIST-004', name: '安全策略同步', type: '同步', status: 'success', startTime: '2026-06-01 10:00:00', endTime: '2026-06-01 10:05:00', duration: '5分钟', executor: 'system' },
  { id: 'HIST-005', name: '漏洞扫描作业', type: '扫描', status: 'success', startTime: '2026-06-01 09:00:00', endTime: '2026-06-01 09:30:00', duration: '30分钟', executor: 'admin' },
];

export function JobHistory() {
  const [data] = useState<HistoryItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">成功</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业历史记录</h2>
        <p className="text-sm text-gray-400 mt-1">查看作业执行历史</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">历史作业总数</p>
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
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">作业名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">开始时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">结束时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">耗时</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">执行者</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.startTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.endTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.duration}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.executor}</td>
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
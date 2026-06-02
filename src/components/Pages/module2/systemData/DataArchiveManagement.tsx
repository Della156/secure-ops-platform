'use client';

import React, { useState } from 'react';
import { Search, Archive, Clock, CheckCircle, XCircle, AlertTriangle, Folder } from 'lucide-react';

interface ArchiveTask {
  id: string;
  name: string;
  source: string;
  target: string;
  retentionDays: number;
  schedule: string;
  lastArchive: string;
  archivedSize: string;
  status: 'success' | 'failed' | 'running' | 'pending';
}

const mockData: ArchiveTask[] = [
  { id: 'ARCH-001', name: '日志数据归档', source: '日志数据库', target: '归档存储', retentionDays: 90, schedule: '每月1日', lastArchive: '2026-06-01 00:00:00', archivedSize: '15GB', status: 'success' },
  { id: 'ARCH-002', name: '审计数据归档', source: '审计数据库', target: '归档存储', retentionDays: 180, schedule: '每季度', lastArchive: '2026-04-01 00:00:00', archivedSize: '8GB', status: 'success' },
  { id: 'ARCH-003', name: '报表数据归档', source: '报表服务', target: '归档存储', retentionDays: 365, schedule: '每年', lastArchive: '2026-01-01 00:00:00', archivedSize: '5GB', status: 'success' },
  { id: 'ARCH-004', name: '配置数据归档', source: '配置管理', target: '归档存储', retentionDays: 30, schedule: '每周日', lastArchive: '-', archivedSize: '0MB', status: 'running' },
  { id: 'ARCH-005', name: '漏洞数据归档', source: '漏洞管理', target: '归档存储', retentionDays: 365, schedule: '每月', lastArchive: '2026-05-01 00:00:00', archivedSize: '2GB', status: 'failed' },
];

export function DataArchiveManagement() {
  const [data] = useState<ArchiveTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.source.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    running: data.filter(d => d.status === 'running').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">成功</span>;
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">归档中</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待归档</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'running') return <Archive className="w-4 h-4 text-blue-400 animate-pulse" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据归档管理</h2>
        <p className="text-sm text-gray-400 mt-1">管理数据归档任务和归档策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">归档任务总数</p>
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
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">归档中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.running}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">来源</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">调度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次归档</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">归档大小</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Archive className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Folder className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.target}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.retentionDays}天</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.schedule}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastArchive}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{item.archivedSize}</td>
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
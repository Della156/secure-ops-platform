'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRightLeft } from 'lucide-react';

interface SyncTask {
  id: string;
  name: string;
  source: string;
  target: string;
  frequency: string;
  lastSync: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  syncCount: number;
}

const mockData: SyncTask[] = [
  { id: 'SYNC-001', name: '安全设备数据同步', source: '防火墙集群', target: '安全数据库', frequency: '每5分钟', lastSync: '2026-06-02 10:30:00', status: 'success', syncCount: 150 },
  { id: 'SYNC-002', name: '日志数据同步', source: '日志服务器', target: '数据仓库', frequency: '每小时', lastSync: '2026-06-02 10:00:00', status: 'success', syncCount: 800 },
  { id: 'SYNC-003', name: '资产数据同步', source: 'CMDB', target: '安全平台', frequency: '每天', lastSync: '2026-06-02 00:00:00', status: 'success', syncCount: 1200 },
  { id: 'SYNC-004', name: '漏洞数据同步', source: '漏洞扫描器', target: '漏洞管理', frequency: '每30分钟', lastSync: '-', status: 'running', syncCount: 50 },
  { id: 'SYNC-005', name: '策略数据同步', source: '策略管理', target: '执行引擎', frequency: '实时', lastSync: '2026-06-02 10:28:00', status: 'failed', syncCount: 300 },
];

export function DataSyncManagement() {
  const [data] = useState<SyncTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.source.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    running: data.filter(d => d.status === 'running').length,
    failed: data.filter(d => d.status === 'failed').length,
    totalSync: data.reduce((sum, d) => sum + d.syncCount, 0),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">成功</span>;
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">同步中</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待同步</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'running') return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据同步管理</h2>
        <p className="text-sm text-gray-400 mt-1">管理系统数据的同步任务和状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">同步任务总数</p>
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
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">同步中</p>
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
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">已同步记录</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalSync}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">频率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次同步</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">同步数量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.target}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.frequency}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastSync}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.syncCount}</td>
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
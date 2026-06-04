'use client';

import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, RefreshCw, Bell, Filter } from 'lucide-react';

interface SyncTaskStatus {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'waiting';
  progress: number;
  lastSync: string;
  nextSync: string;
  syncCount: number;
  successRate: number;
  errorMsg?: string;
}

export function SyncStatusMonitor() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const mockData: SyncTaskStatus[] = [
    { id: 'ST-001', name: '用户数据同步', status: 'running', progress: 65, lastSync: '2026-06-04 10:30:00', nextSync: '2026-06-04 10:35:00', syncCount: 1256, successRate: 99.8 },
    { id: 'ST-002', name: '资产数据同步', status: 'success', progress: 100, lastSync: '2026-06-04 02:00:00', nextSync: '2026-06-05 02:00:00', syncCount: 89, successRate: 100 },
    { id: 'ST-003', name: '日志数据同步', status: 'failed', progress: 0, lastSync: '2026-06-03 18:45:00', nextSync: '-', syncCount: 4521, successRate: 98.5, errorMsg: '连接超时' },
    { id: 'ST-004', name: '告警数据同步', status: 'running', progress: 30, lastSync: '2026-06-04 10:25:00', nextSync: '2026-06-04 10:35:00', syncCount: 893, successRate: 99.2 },
    { id: 'ST-005', name: '威胁情报同步', status: 'waiting', progress: 0, lastSync: '2026-06-04 10:00:00', nextSync: '2026-06-04 11:00:00', syncCount: 156, successRate: 100 },
  ];

  const filteredData = mockData.filter(item => 
    filterStatus === 'all' || item.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'waiting': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'waiting': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'running': return '同步中';
      case 'success': return '已完成';
      case 'failed': return '失败';
      case 'waiting': return '等待中';
      default: return status;
    }
  };

  const stats = {
    total: mockData.length,
    running: mockData.filter(d => d.status === 'running').length,
    success: mockData.filter(d => d.status === 'success').length,
    failed: mockData.filter(d => d.status === 'failed').length,
    avgSuccessRate: (mockData.reduce((sum, d) => sum + d.successRate, 0) / mockData.length).toFixed(1),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">同步任务状态监控</h2>
          <p className="text-sm text-gray-400 mt-1">实时监控同步任务运行状态，及时发现异常并告警</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm ${autoRefresh ? 'bg-blue-600 text-white' : 'bg-[#20293F] text-gray-300'}`} onClick={() => setAutoRefresh(!autoRefresh)}>
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? '自动刷新中' : '手动刷新'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20293F] border border-[#2A354D] text-gray-300 rounded text-sm hover:bg-[#2A354D]">
            <Bell className="w-4 h-4" />
            告警设置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">任务总数</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">同步中</div>
          <div className="text-2xl font-bold text-blue-400">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">已完成</div>
          <div className="text-2xl font-bold text-green-400">{stats.success}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">失败</div>
          <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">平均成功率</div>
          <div className="text-2xl font-bold text-purple-400">{stats.avgSuccessRate}%</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部状态</option>
            <option value="running">同步中</option>
            <option value="success">已完成</option>
            <option value="failed">失败</option>
            <option value="waiting">等待中</option>
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">任务名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">进度</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">上次同步</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">同步次数</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">成功率</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${getStatusColor(item.status)} bg-[#111625]`}>
                    {getStatusIcon(item.status)}
                    {getStatusLabel(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-24 h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.status === 'running' ? 'bg-blue-500' : item.status === 'success' ? 'bg-green-500' : item.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{item.progress}%</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.lastSync}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.syncCount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${item.successRate >= 99 ? 'text-green-400' : item.successRate >= 95 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.successRate}%
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

export default SyncStatusMonitor;
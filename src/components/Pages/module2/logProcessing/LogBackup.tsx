'use client';

import React, { useState } from 'react';
import { Search, CloudDownload, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface BackupTask {
  id: string;
  name: string;
  type: string;
  schedule: string;
  retentionDays: number;
  lastBackup: string;
  status: 'success' | 'failed' | 'pending';
  size: string;
}

const mockData: BackupTask[] = [
  { id: 'BK-001', name: '安全日志备份', type: '增量备份', schedule: '每小时', retentionDays: 7, lastBackup: '2026-06-02 10:00:00', status: 'success', size: '1.2 GB' },
  { id: 'BK-002', name: '系统日志备份', type: '增量备份', schedule: '每小时', retentionDays: 7, lastBackup: '2026-06-02 10:00:00', status: 'success', size: '2.5 GB' },
  { id: 'BK-003', name: '全量日志备份', type: '全量备份', schedule: '每日 02:00', retentionDays: 30, lastBackup: '2026-06-02 02:00:00', status: 'success', size: '45 GB' },
  { id: 'BK-004', name: '审计日志备份', type: '全量备份', schedule: '每日 03:00', retentionDays: 180, lastBackup: '2026-06-01 03:00:00', status: 'failed', size: '-' },
  { id: 'BK-005', name: '归档日志备份', type: '全量备份', schedule: '每周日 01:00', retentionDays: 365, lastBackup: '-', status: 'pending', size: '-' },
];

export function LogBackup() {
  const [data] = useState<BackupTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    failed: data.filter(d => d.status === 'failed').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">成功</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待执行</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志数据备份</h2>
        <p className="text-sm text-gray-400 mt-1">管理日志数据的备份策略和执行状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">备份任务总数</p>
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
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">调度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次备份</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">大小</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CloudDownload className="w-4 h-4 text-blue-400" />
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
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastBackup}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.size}</td>
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
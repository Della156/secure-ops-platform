'use client';

import React, { useState } from 'react';
import { Search, Backpack, Clock, CheckCircle, XCircle, AlertTriangle, Cloud } from 'lucide-react';

interface BackupTask {
  id: string;
  name: string;
  source: string;
  target: string;
  type: string;
  schedule: string;
  lastBackup: string;
  backupSize: string;
  status: 'success' | 'failed' | 'running' | 'pending';
}

const mockData: BackupTask[] = [
  { id: 'BACKUP-001', name: '数据库全量备份', source: '主数据库', target: '云存储', type: '全量', schedule: '每日 02:00', lastBackup: '2026-06-02 02:00:00', backupSize: '50GB', status: 'success' },
  { id: 'BACKUP-002', name: '配置文件备份', source: '配置中心', target: '云存储', type: '增量', schedule: '每小时', lastBackup: '2026-06-02 10:00:00', backupSize: '100MB', status: 'success' },
  { id: 'BACKUP-003', name: '日志备份', source: '日志服务器', target: '本地存储', type: '增量', schedule: '每日 03:00', lastBackup: '2026-06-02 03:00:00', backupSize: '20GB', status: 'success' },
  { id: 'BACKUP-004', name: '系统备份', source: '操作系统', target: '云存储', type: '全量', schedule: '每周日 01:00', lastBackup: '-', backupSize: '0GB', status: 'running' },
  { id: 'BACKUP-005', name: '应用数据备份', source: '应用服务器', target: '本地存储', type: '增量', schedule: '每6小时', lastBackup: '2026-06-02 06:00:00', backupSize: '5GB', status: 'failed' },
];

export function DataBackupManagement() {
  const [data] = useState<BackpackTask[]>(mockData);
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
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">备份中</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待备份</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'running') return <Backpack className="w-4 h-4 text-blue-400 animate-pulse" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据备份管理</h2>
        <p className="text-sm text-gray-400 mt-1">管理数据备份任务和备份策略</p>
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
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Backpack className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">备份中</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">调度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次备份</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份大小</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Backpack className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Cloud className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.target}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${item.type === '全量' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.schedule}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastBackup}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{item.backupSize}</td>
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
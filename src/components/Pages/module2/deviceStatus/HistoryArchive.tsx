'use client';

import React, { useState } from 'react';
import { Search, Archive, Download, Clock, Trash2, Settings, FolderOpen, FileText, CheckCircle } from 'lucide-react';

interface ArchiveRecord {
  id: string;
  taskName: string;
  deviceType: string;
  deviceCount: number;
  recordCount: number;
  dataSize: string;
  archiveType: 'auto' | 'manual';
  archivePeriod: string;
  retentionDays: number;
  status: 'completed' | 'in_progress' | 'failed';
  archiveTime: string;
  archiveBy: string;
}

const mockData: ArchiveRecord[] = [
  { id: 'ARCH-001', taskName: '设备运行状态日归档', deviceType: '全类型', deviceCount: 48, recordCount: 34560, dataSize: '2.3GB', archiveType: 'auto', archivePeriod: '2026-05-31', retentionDays: 90, status: 'completed', archiveTime: '2026-06-01 00:00:00', archiveBy: '系统自动' },
  { id: 'ARCH-002', taskName: '安全检查周归档', deviceType: '全类型', deviceCount: 52, recordCount: 52480, dataSize: '4.1GB', archiveType: 'auto', archivePeriod: '2026-05-25 ~ 2026-05-31', retentionDays: 180, status: 'completed', archiveTime: '2026-05-31 23:00:00', archiveBy: '系统自动' },
  { id: 'ARCH-003', taskName: '核心交换机专项归档', deviceType: '交换机', deviceCount: 8, recordCount: 11520, dataSize: '850MB', archiveType: 'manual', archivePeriod: '2026-05', retentionDays: 365, status: 'completed', archiveTime: '2026-06-01 10:00:00', archiveBy: 'admin' },
  { id: 'ARCH-004', taskName: '防火墙日志归档', deviceType: '防火墙', deviceCount: 6, recordCount: 86400, dataSize: '6.2GB', archiveType: 'auto', archivePeriod: '2026-04', retentionDays: 365, status: 'completed', archiveTime: '2026-05-01 00:00:00', archiveBy: '系统自动' },
  { id: 'ARCH-005', taskName: '服务器健康度归档', deviceType: '服务器', deviceCount: 20, recordCount: 28800, dataSize: '1.8GB', archiveType: 'manual', archivePeriod: '2026-Q1', retentionDays: 730, status: 'completed', archiveTime: '2026-04-01 08:00:00', archiveBy: 'admin' },
];

interface ArchiveStrategy {
  id: string;
  name: string;
  deviceType: string;
  archiveFrequency: string;
  retentionDays: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  status: 'enabled' | 'disabled';
  nextArchiveTime: string;
}

const mockStrategies: ArchiveStrategy[] = [
  { id: 'STR-001', name: '设备运行状态日归档策略', deviceType: '全类型', archiveFrequency: '每日', retentionDays: 90, compressionEnabled: true, encryptionEnabled: false, status: 'enabled', nextArchiveTime: '2026-06-02 00:00:00' },
  { id: 'STR-002', name: '安全检查周归档策略', deviceType: '全类型', archiveFrequency: '每周', retentionDays: 180, compressionEnabled: true, encryptionEnabled: true, status: 'enabled', nextArchiveTime: '2026-06-08 00:00:00' },
  { id: 'STR-003', name: '防火墙日志归档策略', deviceType: '防火墙', archiveFrequency: '每月', retentionDays: 365, compressionEnabled: true, encryptionEnabled: true, status: 'enabled', nextArchiveTime: '2026-07-01 00:00:00' },
  { id: 'STR-004', name: '服务器性能归档策略', deviceType: '服务器', archiveFrequency: '每日', retentionDays: 90, compressionEnabled: false, encryptionEnabled: false, status: 'disabled', nextArchiveTime: '-' },
];

export function HistoryArchive() {
  const [activeTab, setActiveTab] = useState<'records' | 'strategies'>('records');
  const [records] = useState<ArchiveRecord[]>(mockData);
  const [strategies] = useState<ArchiveStrategy[]>(mockStrategies);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredRecords = records.filter(r =>
    !searchKeyword || r.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) || r.deviceType.includes(searchKeyword)
  );

  const filteredStrategies = strategies.filter(s =>
    !searchKeyword || s.name.toLowerCase().includes(searchKeyword.toLowerCase()) || s.deviceType.includes(searchKeyword)
  );

  const stats = {
    totalArchives: records.length,
    totalSize: records.reduce((sum, r) => sum + parseFloat(r.dataSize), 0).toFixed(1) + 'GB',
    totalRecords: records.reduce((sum, r) => sum + r.recordCount, 0).toLocaleString(),
    activeStrategies: strategies.filter(s => s.status === 'enabled').length,
  };

  const getStatusBadge = (status: 'completed' | 'in_progress' | 'failed' | 'enabled' | 'disabled') => {
    const config: Record<string, string> = {
      completed: 'bg-green-500/20 text-green-400',
      in_progress: 'bg-blue-500/20 text-blue-400',
      failed: 'bg-red-500/20 text-red-400',
      enabled: 'bg-green-500/20 text-green-400',
      disabled: 'bg-gray-500/20 text-gray-400',
    };
    const labels: Record<string, string> = { completed: '已完成', in_progress: '归档中', failed: '失败', enabled: '启用', disabled: '停用' };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${config[status]}`}>{labels[status]}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">检查历史数据归档</h2>
        <p className="text-sm text-gray-400 mt-1">管理历史检查数据的自动/手动归档，设置归档策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Archive className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">归档记录</p>
              <p className="text-xl font-semibold text-white">{stats.totalArchives}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">总归档容量</p>
              <p className="text-xl font-semibold text-blue-400">{stats.totalSize}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">归档记录数</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalRecords}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">活跃策略</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.activeStrategies}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg mb-6">
        <div className="flex border-b border-[#2A354D]">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'records' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            归档记录
          </button>
          <button
            onClick={() => setActiveTab('strategies')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'strategies' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            归档策略配置
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'records' ? '搜索归档任务...' : '搜索策略名称...'}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Archive className="w-4 h-4" />
            手动归档
          </button>
        </div>
      </div>

      {activeTab === 'records' && (
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A354D]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">归档任务</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备类型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">记录数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">数据量</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">归档方式</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">归档周期</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">归档时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{record.taskName}</td>
                    <td className="px-4 py-3 text-sm text-white">{record.deviceType}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{record.deviceCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{record.recordCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{record.dataSize}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${record.archiveType === 'auto' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {record.archiveType === 'auto' ? '自动' : '手动'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{record.archivePeriod}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{record.retentionDays}天</td>
                    <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      <div>{record.archiveTime}</div>
                      <div className="text-xs text-gray-500">{record.archiveBy}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看详情">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="下载">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecords.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
        </div>
      )}

      {activeTab === 'strategies' && (
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A354D]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略名称</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备类型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">归档频率</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">压缩</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">加密</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">下次归档时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStrategies.map((strategy) => (
                  <tr key={strategy.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3 text-sm text-white">{strategy.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{strategy.deviceType}</td>
                    <td className="px-4 py-3 text-sm text-blue-400">{strategy.archiveFrequency}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{strategy.retentionDays}天</td>
                    <td className="px-4 py-3">
                      {strategy.compressionEnabled ? <CheckCircle className="w-4 h-4 text-green-400" /> : <span className="text-gray-500">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      {strategy.encryptionEnabled ? <CheckCircle className="w-4 h-4 text-green-400" /> : <span className="text-gray-500">-</span>}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(strategy.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{strategy.nextArchiveTime}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="编辑">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStrategies.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
        </div>
      )}
    </div>
  );
}

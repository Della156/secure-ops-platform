'use client';

import React, { useState } from 'react';
import { Search, FileText, Monitor, Bell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface LogMonitorItem {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'error';
  logLevel: string;
  retentionDays: number;
  lastUpdate: string;
  description: string;
}

const mockData: LogMonitorItem[] = [
  { id: 'LOG-001', name: 'Access Log', type: 'Access', status: 'running', logLevel: 'INFO', retentionDays: 30, lastUpdate: '2026-06-02 10:35:00', description: '访问日志记录' },
  { id: 'LOG-002', name: 'Error Log', type: 'Error', status: 'running', logLevel: 'ERROR', retentionDays: 90, lastUpdate: '2026-06-02 10:35:00', description: '错误日志记录' },
  { id: 'LOG-003', name: 'Security Log', type: 'Security', status: 'running', logLevel: 'WARN', retentionDays: 180, lastUpdate: '2026-06-02 10:35:00', description: '安全审计日志' },
  { id: 'LOG-004', name: 'Performance Log', type: 'Performance', status: 'stopped', logLevel: 'DEBUG', retentionDays: 7, lastUpdate: '2026-06-02 09:00:00', description: '性能监控日志' },
  { id: 'LOG-005', name: 'System Monitor', type: 'Monitor', status: 'running', logLevel: 'INFO', retentionDays: 30, lastUpdate: '2026-06-02 10:35:00', description: '系统监控数据' },
];

export function LogMonitorCheck() {
  const [data] = useState<LogMonitorItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    running: data.filter(d => d.status === 'running').length,
    stopped: data.filter(d => d.status === 'stopped').length,
    error: data.filter(d => d.status === 'error').length,
    avgRetention: Math.round(data.reduce((sum, d) => sum + d.retentionDays, 0) / data.length),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">运行中</span>;
    if (status === 'stopped') return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">已停止</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">错误</span>;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'Access') return <FileText className="w-4 h-4 text-blue-400" />;
    if (type === 'Error') return <XCircle className="w-4 h-4 text-red-400" />;
    if (type === 'Security') return <Bell className="w-4 h-4 text-yellow-400" />;
    return <Monitor className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志与监控配置检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查中间件的日志配置和监控状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">配置总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">运行中</p>
              <p className="text-xl font-semibold text-green-400">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">已停止</p>
              <p className="text-xl font-semibold text-gray-400">{stats.stopped}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">错误</p>
              <p className="text-xl font-semibold text-red-400">{stats.error}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均保留天数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.avgRetention}天</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志级别</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后更新</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm text-gray-400">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.logLevel}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.retentionDays}天</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastUpdate}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
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
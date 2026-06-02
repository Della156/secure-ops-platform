'use client';

import React, { useState } from 'react';
import { Search, FileText, Bell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface LogAuditItem {
  id: string;
  deviceName: string;
  logType: string;
  status: 'running' | 'stopped' | 'error';
  logLevel: string;
  retentionDays: number;
  lastUpdate: string;
  description: string;
}

const mockData: LogAuditItem[] = [
  { id: 'LOG-001', deviceName: '防火墙-FW-01', logType: '安全日志', status: 'running', logLevel: 'INFO', retentionDays: 90, lastUpdate: '2026-06-02 10:35:00', description: '记录安全事件日志' },
  { id: 'LOG-002', deviceName: '防火墙-FW-01', logType: '流量日志', status: 'running', logLevel: 'DEBUG', retentionDays: 30, lastUpdate: '2026-06-02 10:35:00', description: '记录网络流量日志' },
  { id: 'LOG-003', deviceName: '入侵检测-IDS-01', logType: '告警日志', status: 'running', logLevel: 'WARN', retentionDays: 180, lastUpdate: '2026-06-02 10:35:00', description: '记录入侵检测告警' },
  { id: 'LOG-004', deviceName: 'Web防火墙-WAF-01', logType: '访问日志', status: 'running', logLevel: 'INFO', retentionDays: 60, lastUpdate: '2026-06-02 10:35:00', description: '记录Web访问日志' },
  { id: 'LOG-005', deviceName: 'VPN网关-VPN-01', logType: '审计日志', status: 'stopped', logLevel: '-', retentionDays: 0, lastUpdate: '2026-06-02 09:00:00', description: 'VPN接入审计日志' },
];

export function LogAuditCheck() {
  const [data] = useState<LogAuditItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.deviceName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.logType.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    running: data.filter(d => d.status === 'running').length,
    stopped: data.filter(d => d.status === 'stopped').length,
    error: data.filter(d => d.status === 'error').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">运行中</span>;
    if (status === 'stopped') return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">已停止</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">错误</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志与审计策略检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查安全设备的日志配置和审计策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志类型</th>
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
                  <td className="px-4 py-3 text-sm text-white">{item.deviceName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.logType}</span>
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
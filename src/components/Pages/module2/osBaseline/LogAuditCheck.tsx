'use client';

import React, { useState } from 'react';
import { Search, FileText, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface LogAuditItem {
  id: string;
  hostname: string;
  ip: string;
  checkItem: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  lastCheck: string;
  logPath?: string;
}

const mockData: LogAuditItem[] = [
  { id: 'LA-001', hostname: 'server-01', ip: '192.168.2.10', checkItem: '系统日志配置', status: 'pass', details: '系统日志配置正确，日志轮转正常', logPath: '/var/log/messages', lastCheck: '2026-06-02 08:00:00' },
  { id: 'LA-002', hostname: 'server-01', ip: '192.168.2.10', checkItem: '审计日志配置', status: 'pass', details: '审计日志已启用，记录完整', logPath: '/var/log/audit/', lastCheck: '2026-06-02 08:00:00' },
  { id: 'LA-003', hostname: 'server-02', ip: '192.168.2.11', checkItem: '日志文件权限', status: 'warning', details: '部分日志文件权限过松', logPath: '/var/log/', lastCheck: '2026-06-02 08:05:00' },
  { id: 'LA-004', hostname: 'server-03', ip: '192.168.2.12', checkItem: '系统日志配置', status: 'fail', details: '系统日志未配置，未启用日志记录', lastCheck: '2026-06-02 08:10:00' },
  { id: 'LA-005', hostname: 'server-03', ip: '192.168.2.12', checkItem: '审计日志配置', status: 'fail', details: '审计日志服务未启动', lastCheck: '2026-06-02 08:10:00' },
];

export function LogAuditCheck() {
  const [data] = useState<LogAuditItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.hostname.toLowerCase().includes(searchKeyword.toLowerCase()) || d.checkItem.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    pass: data.filter(d => d.status === 'pass').length,
    warning: data.filter(d => d.status === 'warning').length,
    fail: data.filter(d => d.status === 'fail').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pass') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">通过</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志与审计策略检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查操作系统的日志配置和审计策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">检查项总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.pass}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.fail}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">主机名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查项</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志路径</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">详情</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.hostname}</span>
                      <span className="text-xs text-gray-500">({item.ip})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.checkItem}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{item.logPath || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.details}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.lastCheck}
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
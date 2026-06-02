'use client';

import React, { useState } from 'react';
import { Search, FileText, Bell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AuditLogItem {
  id: string;
  database: string;
  logType: string;
  status: 'enabled' | 'disabled';
  retentionDays: number;
  level: string;
  lastReview: string;
  description: string;
}

const mockData: AuditLogItem[] = [
  { id: 'AUD-001', database: 'MySQL-Prod', logType: '访问日志', status: 'enabled', retentionDays: 90, level: 'ALL', lastReview: '2026-06-01', description: '记录所有数据库访问操作' },
  { id: 'AUD-002', database: 'MySQL-Prod', logType: 'DDL日志', status: 'enabled', retentionDays: 180, level: 'ALL', lastReview: '2026-06-01', description: '记录数据定义语言操作' },
  { id: 'AUD-003', database: 'PostgreSQL-Prod', logType: '访问日志', status: 'enabled', retentionDays: 90, level: 'ALL', lastReview: '2026-05-28', description: '记录所有数据库访问操作' },
  { id: 'AUD-004', database: 'Oracle-Dev', logType: '访问日志', status: 'disabled', retentionDays: 0, level: '-', lastReview: '-', description: '未启用审计日志' },
  { id: 'AUD-005', database: 'SQLServer-Staging', logType: '权限变更日志', status: 'disabled', retentionDays: 0, level: '-', lastReview: '-', description: '未启用权限变更审计' },
];

export function AuditLogCheck() {
  const [data] = useState<AuditLogItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.database.toLowerCase().includes(searchKeyword.toLowerCase()) || d.logType.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    enabled: data.filter(d => d.status === 'enabled').length,
    disabled: data.filter(d => d.status === 'disabled').length,
    avgRetention: Math.round(data.filter(d => d.status === 'enabled').reduce((sum, d) => sum + d.retentionDays, 0) / Math.max(1, data.filter(d => d.status === 'enabled').length)),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'enabled') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">未启用</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">审计日志策略检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查数据库审计日志的配置和策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">日志项总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已启用</p>
              <p className="text-xl font-semibold text-green-400">{stats.enabled}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">未启用</p>
              <p className="text-xl font-semibold text-red-400">{stats.disabled}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">数据库</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志级别</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次审核</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.database}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.logType}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.retentionDays}天</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.level}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastReview}</td>
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
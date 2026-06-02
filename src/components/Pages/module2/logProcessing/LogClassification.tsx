'use client';

import React, { useState } from 'react';
import { Search, Folder, Tag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface LogCategory {
  id: string;
  name: string;
  type: string;
  count: number;
  status: 'active' | 'inactive';
  retentionDays: number;
  description: string;
}

const mockData: LogCategory[] = [
  { id: 'CAT-001', name: '安全事件日志', type: 'Security', count: 150000, status: 'active', retentionDays: 180, description: '安全设备产生的安全事件日志' },
  { id: 'CAT-002', name: '系统操作日志', type: 'System', count: 800000, status: 'active', retentionDays: 90, description: '操作系统和中间件的操作日志' },
  { id: 'CAT-003', name: '应用访问日志', type: 'Application', count: 2000000, status: 'active', retentionDays: 30, description: '业务应用的访问日志' },
  { id: 'CAT-004', name: '网络流量日志', type: 'Network', count: 500000, status: 'active', retentionDays: 60, description: '网络设备的流量日志' },
  { id: 'CAT-005', name: '审计日志', type: 'Audit', count: 120000, status: 'inactive', retentionDays: 365, description: '安全审计相关日志' },
];

export function LogClassification() {
  const [data] = useState<LogCategory[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    active: data.filter(d => d.status === 'active').length,
    inactive: data.filter(d => d.status === 'inactive').length,
    totalLogs: data.reduce((sum, d) => sum + d.count, 0),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">禁用</span>;
  };

  const getTypeColor = (type: string) => {
    if (type === 'Security') return 'text-red-400';
    if (type === 'System') return 'text-blue-400';
    if (type === 'Application') return 'text-green-400';
    if (type === 'Network') return 'text-purple-400';
    return 'text-yellow-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志数据分类管理</h2>
        <p className="text-sm text-gray-400 mt-1">管理日志数据的分类和存储策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">分类总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">启用</p>
              <p className="text-xl font-semibold text-green-400">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">禁用</p>
              <p className="text-xl font-semibold text-gray-400">{stats.inactive}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">日志总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{(stats.totalLogs / 10000).toFixed(0)}万</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">分类名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志数量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留天数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" className={getTypeColor(item.type)} />
                      <span className={`text-sm ${getTypeColor(item.type)}`}>{item.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{(item.count / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.retentionDays}天</td>
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
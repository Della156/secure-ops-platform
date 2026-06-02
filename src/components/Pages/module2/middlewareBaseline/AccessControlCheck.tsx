'use client';

import React, { useState } from 'react';
import { Search, Shield, User, Key, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AccessRule {
  id: string;
  role: string;
  resource: string;
  permission: string;
  status: 'allowed' | 'denied' | 'pending';
  description: string;
  lastModified: string;
}

const mockData: AccessRule[] = [
  { id: 'ACL-001', role: 'admin', resource: '/admin/*', permission: 'ALL', status: 'allowed', description: '管理员全部权限', lastModified: '2026-06-01 10:00:00' },
  { id: 'ACL-002', role: 'operator', resource: '/api/*', permission: 'READ', status: 'allowed', description: '操作员只读权限', lastModified: '2026-06-01 10:05:00' },
  { id: 'ACL-003', role: 'guest', resource: '/public/*', permission: 'READ', status: 'allowed', description: '访客公开访问', lastModified: '2026-06-01 10:10:00' },
  { id: 'ACL-004', role: 'operator', resource: '/admin/*', permission: 'WRITE', status: 'denied', description: '禁止操作员修改管理配置', lastModified: '2026-06-01 10:15:00' },
  { id: 'ACL-005', role: 'api-user', resource: '/api/data/*', permission: 'WRITE', status: 'pending', description: 'API用户数据写入权限待审批', lastModified: '2026-06-02 09:00:00' },
];

export function AccessControlCheck() {
  const [data] = useState<AccessRule[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.role.toLowerCase().includes(searchKeyword.toLowerCase()) || d.resource.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    allowed: data.filter(d => d.status === 'allowed').length,
    denied: data.filter(d => d.status === 'denied').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'allowed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">允许</span>;
    if (status === 'denied') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">拒绝</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待审批</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">访问控制与权限检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查中间件的访问控制策略和权限配置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">规则总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">允许</p>
              <p className="text-xl font-semibold text-green-400">{stats.allowed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">拒绝</p>
              <p className="text-xl font-semibold text-red-400">{stats.denied}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待审批</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">角色</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">资源</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">权限</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后修改</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{item.resource}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">{item.permission}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastModified}</td>
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
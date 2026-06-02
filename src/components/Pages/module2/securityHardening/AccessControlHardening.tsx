'use client';

import React, { useState } from 'react';
import { Search, Shield, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AccessRule {
  id: string;
  name: string;
  source: string;
  destination: string;
  protocol: string;
  action: 'allow' | 'deny';
  status: 'enabled' | 'disabled';
  priority: number;
}

const mockData: AccessRule[] = [
  { id: 'ACL-001', name: '管理员访问规则', source: '192.168.1.0/24', destination: '*', protocol: 'ALL', action: 'allow', status: 'enabled', priority: 10 },
  { id: 'ACL-002', name: '禁止外部SSH', source: '0.0.0.0/0', destination: '*', protocol: 'SSH', action: 'deny', status: 'enabled', priority: 20 },
  { id: 'ACL-003', name: '允许内部HTTP', source: '10.0.0.0/8', destination: '*', protocol: 'HTTP', action: 'allow', status: 'enabled', priority: 30 },
  { id: 'ACL-004', name: '禁止内部RDP', source: '10.0.0.0/8', destination: '*', protocol: 'RDP', action: 'deny', status: 'disabled', priority: 40 },
  { id: 'ACL-005', name: '安全设备通信', source: '172.16.0.0/16', destination: '*', protocol: 'HTTPS', action: 'allow', status: 'enabled', priority: 5 },
];

export function AccessControlHardening() {
  const [data] = useState<AccessRule[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.source.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    enabled: data.filter(d => d.status === 'enabled').length,
    disabled: data.filter(d => d.status === 'disabled').length,
    allow: data.filter(d => d.action === 'allow').length,
    deny: data.filter(d => d.action === 'deny').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'enabled') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">禁用</span>;
  };

  const getActionBadge = (action: string) => {
    if (action === 'allow') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">允许</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">拒绝</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">访问控制加固</h2>
        <p className="text-sm text-gray-400 mt-1">管理访问控制规则和策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">规则总数</p>
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
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">已禁用</p>
              <p className="text-xl font-semibold text-gray-400">{stats.disabled}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">允许规则</p>
              <p className="text-xl font-semibold text-green-400">{stats.allow}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">拒绝规则</p>
              <p className="text-xl font-semibold text-red-400">{stats.deny}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">规则名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">源地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">协议</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">动作</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">优先级</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{item.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{item.destination}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.protocol}</td>
                  <td className="px-4 py-3">{getActionBadge(item.action)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.priority}</td>
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
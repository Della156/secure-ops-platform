'use client';

import React, { useState } from 'react';
import { Search, Shield, User, Key, CheckCircle, XCircle } from 'lucide-react';

interface AccessRule {
  id: string;
  deviceName: string;
  ruleName: string;
  source: string;
  destination: string;
  action: 'allow' | 'deny';
  protocol: string;
  status: 'active' | 'inactive';
}

const mockData: AccessRule[] = [
  { id: 'RULE-001', deviceName: '防火墙-FW-01', ruleName: '允许内网访问DMZ', source: '192.168.1.0/24', destination: '192.168.10.0/24', action: 'allow', protocol: 'TCP', status: 'active' },
  { id: 'RULE-002', deviceName: '防火墙-FW-01', ruleName: '拒绝外部访问管理端口', source: '0.0.0.0/0', destination: '192.168.1.0/24', action: 'deny', protocol: 'ALL', status: 'active' },
  { id: 'RULE-003', deviceName: '防火墙-FW-01', ruleName: '允许VPN接入', source: '10.0.0.0/8', destination: '192.168.1.0/24', action: 'allow', protocol: 'UDP', status: 'active' },
  { id: 'RULE-004', deviceName: 'Web防火墙-WAF-01', ruleName: '允许HTTPS访问', source: '0.0.0.0/0', destination: '192.168.10.10', action: 'allow', protocol: 'TCP', status: 'active' },
  { id: 'RULE-005', deviceName: 'Web防火墙-WAF-01', ruleName: '拒绝SQL注入', source: '0.0.0.0/0', destination: '192.168.10.10', action: 'deny', protocol: 'HTTP', status: 'active' },
];

export function AccessControlCheck() {
  const [data] = useState<AccessRule[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.deviceName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.ruleName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    allowRules: data.filter(d => d.action === 'allow').length,
    denyRules: data.filter(d => d.action === 'deny').length,
    activeRules: data.filter(d => d.status === 'active').length,
  };

  const getActionBadge = (action: string) => {
    if (action === 'allow') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">允许</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">拒绝</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">禁用</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">权限与访问控制检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查安全设备的访问控制策略配置</p>
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
              <p className="text-gray-400 text-xs">允许规则</p>
              <p className="text-xl font-semibold text-green-400">{stats.allowRules}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">拒绝规则</p>
              <p className="text-xl font-semibold text-red-400">{stats.denyRules}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">启用规则</p>
              <p className="text-xl font-semibold text-blue-400">{stats.activeRules}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">规则名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">源地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目的地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">协议</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">动作</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.deviceName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">{item.ruleName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{item.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{item.destination}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.protocol}</td>
                  <td className="px-4 py-3">{getActionBadge(item.action)}</td>
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
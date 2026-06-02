'use client';

import React, { useState } from 'react';
import { Search, Server, Shield, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface PortItem {
  id: string;
  deviceName: string;
  port: number;
  protocol: string;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  securityLevel: 'secure' | 'warning' | 'danger';
  description: string;
}

const mockData: PortItem[] = [
  { id: 'PORT-001', deviceName: '防火墙-FW-01', port: 443, protocol: 'HTTPS', service: '管理控制台', status: 'open', securityLevel: 'secure', description: 'HTTPS管理端口，已启用TLS' },
  { id: 'PORT-002', deviceName: '防火墙-FW-01', port: 22, protocol: 'SSH', service: '远程管理', status: 'open', securityLevel: 'warning', description: 'SSH端口开放，已限制IP访问' },
  { id: 'PORT-003', deviceName: '入侵检测-IDS-01', port: 514, protocol: 'UDP', service: 'Syslog', status: 'open', securityLevel: 'secure', description: '日志收集端口' },
  { id: 'PORT-004', deviceName: 'Web防火墙-WAF-01', port: 80, protocol: 'HTTP', service: 'HTTP服务', status: 'open', securityLevel: 'warning', description: 'HTTP端口，建议强制HTTPS' },
  { id: 'PORT-005', deviceName: 'VPN网关-VPN-01', port: 1701, protocol: 'UDP', service: 'L2TP', status: 'open', securityLevel: 'danger', description: 'VPN端口暴露在外网' },
];

export function ServicePortCheck() {
  const [data] = useState<PortItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.deviceName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.service.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    open: data.filter(d => d.status === 'open').length,
    secure: data.filter(d => d.securityLevel === 'secure').length,
    warning: data.filter(d => d.securityLevel === 'warning').length,
    danger: data.filter(d => d.securityLevel === 'danger').length,
  };

  const getStatusIcon = (status: string) => {
    if (status === 'open') return <Unlock className="w-4 h-4 text-green-400" />;
    if (status === 'closed') return <Lock className="w-4 h-4 text-gray-400" />;
    return <Shield className="w-4 h-4 text-blue-400" />;
  };

  const getSecurityBadge = (level: string) => {
    if (level === 'secure') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">安全</span>;
    if (level === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">危险</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">服务与端口检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查安全设备服务端口的安全配置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">端口总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Unlock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">开放端口</p>
              <p className="text-xl font-semibold text-blue-400">{stats.open}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">安全</p>
              <p className="text-xl font-semibold text-green-400">{stats.secure}</p>
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
            <Lock className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">危险</p>
              <p className="text-xl font-semibold text-red-400">{stats.danger}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">端口</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">协议</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">服务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">安全级别</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.deviceName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white font-mono">{item.port}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.protocol}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.service}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(item.status)}
                      <span className={`text-sm capitalize ${item.status === 'open' ? 'text-green-400' : item.status === 'closed' ? 'text-gray-400' : 'text-blue-400'}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getSecurityBadge(item.securityLevel)}</td>
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
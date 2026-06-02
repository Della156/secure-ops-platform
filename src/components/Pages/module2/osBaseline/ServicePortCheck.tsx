'use client';

import React, { useState } from 'react';
import { Search, Server, AlertTriangle, CheckCircle, XCircle, Network } from 'lucide-react';

interface ServicePort {
  id: string;
  hostname: string;
  ip: string;
  serviceName: string;
  port: number;
  protocol: 'TCP' | 'UDP';
  status: 'allowed' | 'restricted' | 'blocked';
  description: string;
  lastCheck: string;
}

const mockData: ServicePort[] = [
  { id: 'SP-001', hostname: 'server-01', ip: '192.168.2.10', serviceName: 'SSH', port: 22, protocol: 'TCP', status: 'allowed', description: 'SSH远程管理端口', lastCheck: '2026-06-02 08:00:00' },
  { id: 'SP-002', hostname: 'server-01', ip: '192.168.2.10', serviceName: 'HTTP', port: 80, protocol: 'TCP', status: 'allowed', description: 'HTTP服务端口', lastCheck: '2026-06-02 08:00:00' },
  { id: 'SP-003', hostname: 'server-01', ip: '192.168.2.10', serviceName: 'HTTPS', port: 443, protocol: 'TCP', status: 'allowed', description: 'HTTPS服务端口', lastCheck: '2026-06-02 08:00:00' },
  { id: 'SP-004', hostname: 'server-02', ip: '192.168.2.11', serviceName: 'FTP', port: 21, protocol: 'TCP', status: 'restricted', description: 'FTP服务端口，已限制访问', lastCheck: '2026-06-02 08:05:00' },
  { id: 'SP-005', hostname: 'server-03', ip: '192.168.2.12', serviceName: 'Telnet', port: 23, protocol: 'TCP', status: 'blocked', description: 'Telnet服务已禁用', lastCheck: '2026-06-02 08:10:00' },
];

export function ServicePortCheck() {
  const [data] = useState<ServicePort[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.hostname.toLowerCase().includes(searchKeyword.toLowerCase()) || d.serviceName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    allowed: data.filter(d => d.status === 'allowed').length,
    restricted: data.filter(d => d.status === 'restricted').length,
    blocked: data.filter(d => d.status === 'blocked').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'allowed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">允许</span>;
    if (status === 'restricted') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">限制</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">禁用</span>;
  };

  const getProtocolBadge = (protocol: string) => {
    return protocol === 'TCP' ? <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">TCP</span> : <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">UDP</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">服务与端口策略检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查操作系统服务和端口的安全配置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">端口总数</p>
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
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">限制</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.restricted}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">禁用</p>
              <p className="text-xl font-semibold text-red-400">{stats.blocked}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">服务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">端口号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">协议</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.hostname}</span>
                      <span className="text-xs text-gray-500">({item.ip})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.serviceName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white">{item.port}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getProtocolBadge(item.protocol)}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastCheck}</td>
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
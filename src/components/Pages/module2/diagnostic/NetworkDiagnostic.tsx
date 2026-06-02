'use client';

import React, { useState } from 'react';
import { Search, Network, Pin, Wifi, CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'warning';
  latency: number;
  packetLoss: number;
  bandwidth: string;
}

const mockData: NetworkNode[] = [
  { id: 'NET-001', name: '防火墙-主', type: '防火墙', status: 'online', latency: 2, packetLoss: 0, bandwidth: '10Gbps' },
  { id: 'NET-002', name: '负载均衡器', type: '负载均衡', status: 'online', latency: 1, packetLoss: 0, bandwidth: '40Gbps' },
  { id: 'NET-003', name: '交换机-核心', type: '交换机', status: 'online', latency: 0, packetLoss: 0, bandwidth: '100Gbps' },
  { id: 'NET-004', name: '路由器-边界', type: '路由器', status: 'warning', latency: 15, packetLoss: 1, bandwidth: '10Gbps' },
  { id: 'NET-005', name: 'VPN网关', type: 'VPN', status: 'offline', latency: -1, packetLoss: -1, bandwidth: '-' },
];

export function NetworkDiagnostic() {
  const [data] = useState<NetworkNode[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    online: data.filter(d => d.status === 'online').length,
    warning: data.filter(d => d.status === 'warning').length,
    offline: data.filter(d => d.status === 'offline').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'online') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">在线</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">离线</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'online') return <Wifi className="w-4 h-4 text-green-400" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">网络诊断</h2>
        <p className="text-sm text-gray-400 mt-1">诊断和监控网络设备状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">网络设备总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">在线</p>
              <p className="text-xl font-semibold text-green-400">{stats.online}</p>
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
              <p className="text-gray-400 text-xs">离线</p>
              <p className="text-xl font-semibold text-red-400">{stats.offline}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">延迟</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">丢包率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">带宽</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${item.latency >= 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {item.latency >= 0 ? `${item.latency}ms` : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${item.packetLoss > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {item.packetLoss >= 0 ? `${item.packetLoss}%` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.bandwidth}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
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
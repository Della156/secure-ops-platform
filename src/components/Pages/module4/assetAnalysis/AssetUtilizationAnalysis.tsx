'use client';
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Cpu, HardDrive, Wifi, Server, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const utilizationData = [
  { id: 'ASSET-001', name: 'web-server-01', cpu: 78, memory: 65, disk: 45, network: 82, status: 'normal' },
  { id: 'ASSET-002', name: 'db-server-01', cpu: 92, memory: 88, disk: 72, network: 65, status: 'high' },
  { id: 'ASSET-003', name: 'api-gateway-01', cpu: 45, memory: 38, disk: 25, network: 78, status: 'low' },
  { id: 'ASSET-004', name: 'cdn-node-01', cpu: 67, memory: 52, disk: 58, network: 95, status: 'high' },
];

const statusColors: Record<string, string> = {
  'high': 'bg-red-500/20 text-red-400',
  'normal': 'bg-green-500/20 text-green-400',
  'low': 'bg-blue-500/20 text-blue-400',
};

const metricIcons = {
  cpu: Cpu,
  memory: HardDrive,
  network: Wifi,
  disk: Server,
};

const metricColors = {
  cpu: 'bg-yellow-500',
  memory: 'bg-blue-500',
  disk: 'bg-green-500',
  network: 'bg-purple-500',
};

export function AssetUtilizationAnalysis() {
  const [search, setSearch] = useState('');

  const filteredAssets = utilizationData.filter(asset => {
    if (search && !asset.name.includes(search) && !asset.id.includes(search)) return false;
    return true;
  });

  const avgUtilization = {
    cpu: Math.round(utilizationData.reduce((sum, a) => sum + a.cpu, 0) / utilizationData.length),
    memory: Math.round(utilizationData.reduce((sum, a) => sum + a.memory, 0) / utilizationData.length),
    disk: Math.round(utilizationData.reduce((sum, a) => sum + a.disk, 0) / utilizationData.length),
    network: Math.round(utilizationData.reduce((sum, a) => sum + a.network, 0) / utilizationData.length),
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产使用效率分析" description="分析资产资源使用效率"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新数据
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(avgUtilization).map(([key, value]) => {
          const Icon = metricIcons[key as keyof typeof metricIcons];
          const color = metricColors[key as keyof typeof metricColors];
          const labels: Record<string, string> = { cpu: 'CPU', memory: '内存', disk: '磁盘', network: '网络' };
          return (
            <div key={key} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{value}%</div>
                  <div className="text-xs text-slate-400">{labels[key]}</div>
                </div>
              </div>
              <div className="mt-3 h-2 bg-[#111625] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text" placeholder="搜索资产名称..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{asset.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[asset.status]}`}>
                      {asset.status === 'high' ? '高负载' : asset.status === 'normal' ? '正常' : '低负载'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{asset.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>实时数据</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries({ cpu: asset.cpu, memory: asset.memory, disk: asset.disk, network: asset.network }).map(([key, value]) => {
                const Icon = metricIcons[key as keyof typeof metricIcons];
                const color = metricColors[key as keyof typeof metricColors];
                const labels: Record<string, string> = { cpu: 'CPU', memory: '内存', disk: '磁盘', network: '网络' };
                return (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-400">{labels[key]}</span>
                    </div>
                    <div className="text-lg font-bold text-white">{value}%</div>
                    <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetUtilizationAnalysis;
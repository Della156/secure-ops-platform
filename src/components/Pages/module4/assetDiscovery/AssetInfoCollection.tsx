'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, Download, Upload, Server, Database, Network, Cloud, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const collectedAssets = [
  { id: 'COL-001', assetId: 'ASSET-001', assetName: 'web-server-01', type: '服务器', ip: '192.168.1.101', collectStatus: 'completed', collectTime: '2026-06-03 08:00', dataSize: '2.3 MB' },
  { id: 'COL-002', assetId: 'ASSET-002', assetName: 'db-server-01', type: '数据库', ip: '192.168.1.102', collectStatus: 'completed', collectTime: '2026-06-03 08:05', dataSize: '15.8 MB' },
  { id: 'COL-003', assetId: 'ASSET-003', assetName: 'api-gateway-01', type: '网络设备', ip: '192.168.1.103', collectStatus: 'running', collectTime: '-', dataSize: '1.2 MB' },
  { id: 'COL-004', assetId: 'ASSET-004', assetName: 'cdn-node-01', type: '云服务', ip: '10.0.0.51', collectStatus: 'pending', collectTime: '-', dataSize: '-' },
  { id: 'COL-005', assetId: 'ASSET-005', assetName: 'backup-server-01', type: '服务器', ip: '192.168.1.105', collectStatus: 'failed', collectTime: '2026-06-02 18:00', dataSize: '0 KB' },
];

const typeIcons = {
  '服务器': Server,
  '数据库': Database,
  '网络设备': Network,
  '云服务': Cloud,
};

export function AssetInfoCollection() {
  const [search, setSearch] = useState('');

  const filteredAssets = collectedAssets.filter(asset => {
    if (search && !asset.assetName.includes(search) && !asset.assetId.includes(search) && !asset.ip.includes(search)) return false;
    return true;
  });

  const handleBatchCollect = () => {
    alert('开始批量采集');
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产信息采集" description="采集和管理资产详细信息"
        actions={[
          <button key="upload" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <Upload className="w-4 h-4" /> 导入数据
          </button>,
          <button key="download" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <Download className="w-4 h-4" /> 导出数据
          </button>,
          <button key="batch" onClick={handleBatchCollect} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <RefreshCw className="w-4 h-4" /> 批量采集
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-slate-400">采集完成</div>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <RefreshCw className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-slate-400">采集中</div>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-slate-400">待采集</div>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-slate-400">采集失败</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索资产名称、ID或IP..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">采集ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">资产ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">资产名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">类型</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">IP地址</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">采集状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">采集时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">数据大小</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredAssets.map(asset => {
                const Icon = typeIcons[asset.type as keyof typeof typeIcons] || Server;
                return (
                  <tr key={asset.id} className="hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-sm text-blue-400 font-mono">{asset.id}</td>
                    <td className="px-4 py-3 text-sm text-white font-mono">{asset.assetId}</td>
                    <td className="px-4 py-3 text-sm text-white">{asset.assetName}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 flex items-center gap-1">
                        <Icon className="w-3 h-3" />{asset.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">{asset.ip}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={asset.collectStatus} pulse={asset.collectStatus === 'running'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{asset.collectTime}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{asset.dataSize}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <Eye className="w-3 h-3" />查看详情
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssetInfoCollection;
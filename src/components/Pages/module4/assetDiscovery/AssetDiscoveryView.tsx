'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, RefreshCw, Calendar, Server, Network, Database, Cloud, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const assets = [
  { id: 'ASSET-001', name: 'web-server-01', type: '服务器', ip: '192.168.1.101', status: 'online', lastScan: '2026-06-03 08:00' },
  { id: 'ASSET-002', name: 'db-server-01', type: '数据库', ip: '192.168.1.102', status: 'online', lastScan: '2026-06-03 08:05' },
  { id: 'ASSET-003', name: 'api-gateway-01', type: '网络设备', ip: '192.168.1.103', status: 'online', lastScan: '2026-06-03 08:10' },
  { id: 'ASSET-004', name: 'cdn-node-01', type: '云服务', ip: '10.0.0.51', status: 'online', lastScan: '2026-06-03 08:15' },
  { id: 'ASSET-005', name: 'backup-server-01', type: '服务器', ip: '192.168.1.105', status: 'offline', lastScan: '2026-06-02 18:00' },
];

const typeIcons = {
  '服务器': Server,
  '数据库': Database,
  '网络设备': Network,
  '云服务': Cloud,
};

const typeColors = {
  '服务器': 'bg-blue-500/20 text-blue-400',
  '数据库': 'bg-green-500/20 text-green-400',
  '网络设备': 'bg-purple-500/20 text-purple-400',
  '云服务': 'bg-orange-500/20 text-orange-400',
};

export function AssetDiscoveryView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredAssets = assets.filter(asset => {
    if (search && !asset.name.includes(search) && !asset.id.includes(search) && !asset.ip.includes(search)) return false;
    if (statusFilter && asset.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalAssets: assets.length,
    onlineAssets: assets.filter(a => a.status === 'online').length,
    offlineAssets: assets.filter(a => a.status === 'offline').length,
    scanCoverage: 92,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产发现视图" description="综合展示资产发现任务相关信息"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建任务
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="资产总数" value={stats.totalAssets} icon={<Server className="w-5 h-5" />} />
        <StatsCard title="在线资产" value={stats.onlineAssets} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="离线资产" value={stats.offlineAssets} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <StatsCard title="扫描覆盖率" value={`${stats.scanCoverage}%`} icon={<Calendar className="w-5 h-5" />} color="yellow" />
      </StatsCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text" placeholder="搜索资产名称、ID或IP..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                  >
                    <option value="">全部状态</option>
                    <option value="online">在线</option>
                    <option value="offline">离线</option>
                  </select>
                </div>
              </div>
              <div className="text-xs text-slate-500">共 {filteredAssets.length} 条记录</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#111625]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">资产ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">资产名称</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">类型</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">IP地址</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">最后扫描</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A354D]">
                  {filteredAssets.map(asset => {
                    const Icon = typeIcons[asset.type as keyof typeof typeIcons] || Server;
                    return (
                      <tr key={asset.id} className="hover:bg-[#111625]/50">
                        <td className="px-4 py-3 text-sm text-blue-400 font-mono">{asset.id}</td>
                        <td className="px-4 py-3 text-sm text-white">{asset.name}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${typeColors[asset.type as keyof typeof typeColors]}`}>
                            <Icon className="w-3 h-3" />{asset.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300 font-mono">{asset.ip}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={asset.status === 'online' ? 'completed' : 'failed'} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-400">{asset.lastScan}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                              <Eye className="w-3 h-3" />详情
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
              <div className="text-xs text-slate-500">显示 1-{filteredAssets.length} 条，共 {assets.length} 条</div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>上一页</button>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">1</button>
                <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>下一页</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">资产类型分布</h4>
            <div className="space-y-3">
              {[
                { type: '服务器', count: 2, percentage: 40 },
                { type: '数据库', count: 1, percentage: 20 },
                { type: '网络设备', count: 1, percentage: 20 },
                { type: '云服务', count: 1, percentage: 20 },
              ].map(item => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300">{item.type}</span>
                    <span className="text-xs text-white">{item.count}</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${typeColors[item.type as keyof typeof typeColors].split(' ')[0]}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">扫描任务统计</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">今日扫描</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本周扫描</span>
                <span className="text-white">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本月扫描</span>
                <span className="text-white">189</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDiscoveryView;
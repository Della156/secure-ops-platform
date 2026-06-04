'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, RefreshCw, CheckCircle2, AlertCircle, Clock, User, Tag, Server } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const tasks = [
  { id: 'CONF-001', name: '2026年6月资产确认', status: 'completed', totalAssets: 543, confirmed: 521, unconfirmed: 22, lastRun: '2026-06-03 08:00' },
  { id: 'CONF-002', name: '数据中心资产确认', status: 'running', totalAssets: 250, confirmed: 180, unconfirmed: 70, lastRun: '2026-06-03 09:00' },
  { id: 'CONF-003', name: '云环境资产确认', status: 'pending', totalAssets: 600, confirmed: 0, unconfirmed: 600, lastRun: '-' },
];

const assets = [
  { id: 'ASSET-001', name: 'web-server-01', owner: 'admin', status: 'confirmed', confirmTime: '2026-06-03 08:00', tags: ['生产', 'Web'] },
  { id: 'ASSET-002', name: 'db-server-01', owner: 'dba', status: 'confirmed', confirmTime: '2026-06-03 08:05', tags: ['生产', '数据库'] },
  { id: 'ASSET-003', name: 'api-gateway-01', owner: 'user1', status: 'unconfirmed', confirmTime: '-', tags: ['测试', 'API'] },
  { id: 'ASSET-004', name: 'cdn-node-01', owner: 'admin', status: 'confirmed', confirmTime: '2026-06-03 08:15', tags: ['CDN', '云服务'] },
];

export function AssetConfirmationView() {
  const [search, setSearch] = useState('');

  const filteredAssets = assets.filter(asset => {
    if (search && !asset.name.includes(search) && !asset.owner.includes(search)) return false;
    return true;
  });

  const stats = {
    totalAssets: assets.length,
    confirmedAssets: assets.filter(a => a.status === 'confirmed').length,
    unconfirmedAssets: assets.filter(a => a.status === 'unconfirmed').length,
    confirmRate: Math.round((3 / 4) * 100),
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产确认视图" description="综合展示资产确认任务相关信息"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建确认任务
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="资产总数" value={stats.totalAssets} icon={<Server className="w-5 h-5" />} />
        <StatsCard title="已确认" value={stats.confirmedAssets} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="待确认" value={stats.unconfirmedAssets} icon={<AlertCircle className="w-5 h-5" />} color="yellow" />
        <StatsCard title="确认率" value={`${stats.confirmRate}%`} icon={<Clock className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D]">
              <h3 className="text-white font-medium">确认任务列表</h3>
            </div>
            <div className="divide-y divide-[#2A354D]">
              {tasks.map(task => (
                <div key={task.id} className="p-4 hover:bg-[#111625]/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 font-mono text-sm">{task.id}</span>
                    <StatusBadge status={task.status} pulse={task.status === 'running'} />
                  </div>
                  <div className="text-white font-medium text-sm">{task.name}</div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-slate-400">总数: <span className="text-white">{task.totalAssets}</span></span>
                    <span className="text-green-400">已确认: {task.confirmed}</span>
                    {task.unconfirmed > 0 && <span className="text-yellow-400">待确认: {task.unconfirmed}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <h3 className="text-white font-medium">资产列表</h3>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                <input
                  type="text" placeholder="搜索资产..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="divide-y divide-[#2A354D]">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="p-4 hover:bg-[#111625]/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Server className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{asset.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <User className="w-3 h-3" />{asset.owner}
                        <span className="text-slate-600">|</span>
                        <Tag className="w-3 h-3" />{asset.tags.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${asset.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {asset.status === 'confirmed' ? '已确认' : '待确认'}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">{asset.confirmTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetConfirmationView;
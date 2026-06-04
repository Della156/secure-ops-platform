'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, RefreshCw, CheckCircle2, AlertTriangle, Clock, ArrowRight, Server } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const reconciliationTasks = [
  { id: 'RECON-001', name: '2026年6月资产核对', status: 'completed', totalAssets: 543, matched: 521, mismatched: 22, lastRun: '2026-06-03 08:00' },
  { id: 'RECON-002', name: '数据中心资产核对', status: 'running', totalAssets: 250, matched: 180, mismatched: 0, lastRun: '2026-06-03 09:00' },
  { id: 'RECON-003', name: '云环境资产核对', status: 'pending', totalAssets: 600, matched: 0, mismatched: 0, lastRun: '-' },
  { id: 'RECON-004', name: '办公区资产核对', status: 'failed', totalAssets: 124, matched: 100, mismatched: 24, lastRun: '2026-06-02 16:00' },
];

const assets = [
  { id: 'ASSET-001', name: 'web-server-01', source: 'CMDB', status: 'matched', lastSync: '2026-06-03 08:00' },
  { id: 'ASSET-002', name: 'db-server-01', source: 'CMDB', status: 'matched', lastSync: '2026-06-03 08:05' },
  { id: 'ASSET-003', name: 'api-gateway-01', source: '扫描发现', status: 'mismatched', lastSync: '2026-06-03 08:10' },
  { id: 'ASSET-004', name: 'cdn-node-01', source: '云平台', status: 'matched', lastSync: '2026-06-03 08:15' },
];

export function AssetReconciliationView() {
  const [search, setSearch] = useState('');

  const filteredTasks = reconciliationTasks.filter(task => {
    if (search && !task.name.includes(search) && !task.id.includes(search)) return false;
    return true;
  });

  const stats = {
    totalTasks: reconciliationTasks.length,
    completedTasks: reconciliationTasks.filter(t => t.status === 'completed').length,
    runningTasks: reconciliationTasks.filter(t => t.status === 'running').length,
    matchedRate: Math.round((521 / 543) * 100),
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产核对视图" description="综合展示资产核对任务相关信息"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建核对任务
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="核对任务总数" value={stats.totalTasks} icon={<Server className="w-5 h-5" />} />
        <StatsCard title="已完成任务" value={stats.completedTasks} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="进行中任务" value={stats.runningTasks} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatsCard title="匹配率" value={`${stats.matchedRate}%`} icon={<ArrowRight className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-white font-medium">核对任务列表</h3>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {filteredTasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-[#111625]/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-sm">{task.id}</span>
                    <StatusBadge status={task.status} pulse={task.status === 'running'} />
                  </div>
                  <span className="text-xs text-slate-400">{task.lastRun}</span>
                </div>
                <div className="text-white font-medium">{task.name}</div>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-slate-400">总数: <span className="text-white">{task.totalAssets}</span></span>
                  <span className="text-green-400">匹配: {task.matched}</span>
                  {task.mismatched > 0 && <span className="text-red-400">不匹配: {task.mismatched}</span>}
                </div>
                {task.status === 'running' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">进度</span>
                      <span className="text-white">{Math.round((task.matched / task.totalAssets) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(task.matched / task.totalAssets) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-white font-medium">资产状态概览</h3>
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
            {assets.map(asset => (
              <div key={asset.id} className="p-4 hover:bg-[#111625]/50 flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">{asset.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">来源: {asset.source}</div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${asset.status === 'matched' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {asset.status === 'matched' ? '匹配' : '不匹配'}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">{asset.lastSync}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetReconciliationView;
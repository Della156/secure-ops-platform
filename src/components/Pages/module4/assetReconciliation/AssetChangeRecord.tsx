'use client';
import React, { useState } from 'react';
import { Search, Filter, Calendar, Eye, ArrowRight, Clock, User, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const changes = [
  { id: 'CHANGE-001', assetId: 'ASSET-001', assetName: 'web-server-01', changeType: '属性变更', field: 'IP地址', oldValue: '192.168.1.101', newValue: '192.168.1.102', time: '2026-06-03 08:00', operator: 'admin' },
  { id: 'CHANGE-002', assetId: 'ASSET-003', assetName: 'api-gateway-01', changeType: '属性变更', field: '责任人', oldValue: 'admin', newValue: 'user1', time: '2026-06-03 07:30', operator: 'admin' },
  { id: 'CHANGE-003', assetId: 'ASSET-005', assetName: 'backup-server-01', changeType: '状态变更', field: '运行状态', oldValue: '在线', newValue: '离线', time: '2026-06-02 16:00', operator: 'system' },
  { id: 'CHANGE-004', assetId: 'ASSET-006', assetName: 'new-server-01', changeType: '新增资产', field: '-', oldValue: '-', newValue: '服务器', time: '2026-06-03 09:00', operator: 'admin' },
  { id: 'CHANGE-005', assetId: 'ASSET-007', assetName: 'old-server-01', changeType: '删除资产', field: '-', oldValue: '服务器', newValue: '-', time: '2026-06-02 10:00', operator: 'admin' },
];

const changeTypeColors: Record<string, string> = {
  '属性变更': 'bg-blue-500/20 text-blue-400',
  '状态变更': 'bg-green-500/20 text-green-400',
  '新增资产': 'bg-yellow-500/20 text-yellow-400',
  '删除资产': 'bg-red-500/20 text-red-400',
};

export function AssetChangeRecord() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredChanges = changes.filter(change => {
    if (search && !change.assetName.includes(search) && !change.assetId.includes(search)) return false;
    if (typeFilter && change.changeType !== typeFilter) return false;
    return true;
  });

  const types = [...new Set(changes.map(c => c.changeType))];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产变更记录" description="查看资产变更历史记录"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索资产名称或ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            >
              <option value="">全部类型</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input type="date" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredChanges.map(change => (
          <div key={change.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <span className="text-blue-400 font-mono text-sm">{change.id}</span>
                <span className={`text-xs px-2 py-1 rounded ${changeTypeColors[change.changeType as keyof typeof changeTypeColors]}`}>
                  {change.changeType}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{change.time}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />{change.operator}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-white font-medium">{change.assetName}</span>
                <span className="text-slate-500 text-sm ml-2">({change.assetId})</span>
              </div>
              {change.field !== '-' && (
                <>
                  <span className="text-slate-500">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">{change.field}:</span>
                    <span className="text-red-400 text-sm line-through">{change.oldValue}</span>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                    <span className="text-green-400 text-sm">{change.newValue}</span>
                  </div>
                </>
              )}
              {change.changeType === '新增资产' && (
                <>
                  <span className="text-slate-500">|</span>
                  <span className="text-green-400 text-sm">新增: {change.newValue}</span>
                </>
              )}
              {change.changeType === '删除资产' && (
                <>
                  <span className="text-slate-500">|</span>
                  <span className="text-red-400 text-sm">删除: {change.oldValue}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetChangeRecord;
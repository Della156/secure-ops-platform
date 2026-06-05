'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, RefreshCw, ArrowLeftRight, CheckCircle2, AlertCircle, XCircle, Server, Database, Cloud } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const comparisons = [
  { id: 'COMP-001', assetId: 'ASSET-001', name: 'web-server-01', source1: 'CMDB', source2: '扫描发现', status: 'matched', diffCount: 0 },
  { id: 'COMP-002', assetId: 'ASSET-002', name: 'db-server-01', source1: 'CMDB', source2: '云平台', status: 'matched', diffCount: 0 },
  { id: 'COMP-003', assetId: 'ASSET-003', name: 'api-gateway-01', source1: 'CMDB', source2: '扫描发现', status: 'mismatched', diffCount: 3 },
  { id: 'COMP-004', assetId: 'ASSET-004', name: 'cdn-node-01', source1: '云平台', source2: '扫描发现', status: 'matched', diffCount: 0 },
  { id: 'COMP-005', assetId: 'ASSET-005', name: 'backup-server-01', source1: 'CMDB', source2: '扫描发现', status: 'missing', diffCount: 1 },
];

const sourceIcons: Record<string, React.ReactNode> = {
  'CMDB': <Database className="w-4 h-4" />,
  '扫描发现': <Server className="w-4 h-4" />,
  '云平台': <Cloud className="w-4 h-4" />,
};

const sourceColors: Record<string, string> = {
  'CMDB': 'bg-blue-500/20 text-blue-400',
  '扫描发现': 'bg-green-500/20 text-green-400',
  '云平台': 'bg-orange-500/20 text-orange-400',
};

export function AssetInfoComparison() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredComparisons = comparisons.filter(comp => {
    if (search && !comp.name.includes(search) && !comp.assetId.includes(search)) return false;
    if (statusFilter && comp.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产信息比对" description="比对不同来源的资产信息"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新比对
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建比对任务
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
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            >
              <option value="">全部状态</option>
              <option value="matched">匹配</option>
              <option value="mismatched">不匹配</option>
              <option value="missing">缺失</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComparisons.map(comp => (
          <div key={comp.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-mono text-sm">{comp.assetId}</span>
                  <span className="text-white font-medium">{comp.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  comp.status === 'matched' ? 'bg-green-500/20 text-green-400' : 
                  comp.status === 'mismatched' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {comp.status === 'matched' ? <CheckCircle2 className="w-3 h-3" /> : 
                   comp.status === 'mismatched' ? <XCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {comp.status === 'matched' ? '匹配' : comp.status === 'mismatched' ? '不匹配' : '缺失'}
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <Eye className="w-3 h-3" /> 查看详情
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111625] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded ${sourceColors[comp.source1 as keyof typeof sourceColors]}`}>
                      {sourceIcons[comp.source1]}
                    </span>
                    <span className="text-sm text-white">{comp.source1}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>IP: 192.168.1.101</div>
                    <div>类型: 服务器</div>
                    <div>责任人: admin</div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowLeftRight className="w-8 h-8 text-blue-400" />
                </div>
                <div className="bg-[#111625] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded ${sourceColors[comp.source2 as keyof typeof sourceColors]}`}>
                      {sourceIcons[comp.source2]}
                    </span>
                    <span className="text-sm text-white">{comp.source2}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>IP: {comp.status === 'mismatched' ? <span className="text-red-400">192.168.1.103</span> : '192.168.1.101'}</div>
                    <div>类型: 服务器</div>
                    <div>责任人: {comp.status === 'mismatched' ? <span className="text-red-400">user1</span> : 'admin'}</div>
                  </div>
                </div>
              </div>
              {comp.diffCount > 0 && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    发现 {comp.diffCount} 处差异，请查看详情
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetInfoComparison;
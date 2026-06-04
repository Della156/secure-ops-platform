'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, RefreshCw, Shield, CheckCircle2, AlertTriangle, Clock, Server } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const stats = {
  totalBaselines: 156,
  compliantBaselines: 142,
  nonCompliantBaselines: 14,
  complianceRate: 91,
};

const baselines = [
  { id: 'BASE-001', name: '操作系统安全基线', status: 'compliant', assets: 45, lastScan: '2026-06-03 08:00' },
  { id: 'BASE-002', name: '数据库安全基线', status: 'compliant', assets: 23, lastScan: '2026-06-03 08:05' },
  { id: 'BASE-003', name: '网络设备安全基线', status: 'non-compliant', assets: 18, lastScan: '2026-06-03 08:10' },
  { id: 'BASE-004', name: '应用安全基线', status: 'compliant', assets: 60, lastScan: '2026-06-03 08:15' },
];

export function BaselineManagementView() {
  const [search, setSearch] = useState('');

  const filteredBaselines = baselines.filter(baseline => {
    if (search && !baseline.name.includes(search) && !baseline.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线管理视图" description="综合展示基线管理相关信息"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建基线
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="基线总数" value={stats.totalBaselines} icon={<Shield className="w-5 h-5" />} />
        <StatsCard title="合规基线" value={stats.compliantBaselines} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="不合规基线" value={stats.nonCompliantBaselines} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <StatsCard title="合规率" value={`${stats.complianceRate}%`} icon={<Clock className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <h3 className="text-white font-medium">基线列表</h3>
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
            <input
              type="text" placeholder="搜索基线..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-lg focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="divide-y divide-[#2A354D]">
          {filteredBaselines.map(baseline => (
            <div key={baseline.id} className="p-4 hover:bg-[#111625]/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{baseline.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${baseline.status === 'compliant' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {baseline.status === 'compliant' ? '合规' : '不合规'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {baseline.id} | 关联资产: {baseline.assets} | 最后扫描: {baseline.lastScan}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <Eye className="w-3 h-3" /> 查看详情
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BaselineManagementView;
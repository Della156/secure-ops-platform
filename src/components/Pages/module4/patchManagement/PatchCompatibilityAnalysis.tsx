'use client';

import React, { useState } from 'react';
import { Search, Filter, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Clock, Server, Package, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const compatibilityResults = [
  { id: 'comp-001', patch: 'Windows KB5034441', asset: 'web-server-01', os: 'Windows Server 2019', status: 'compatible', details: '兼容性良好', risk: 'low' },
  { id: 'comp-002', patch: 'Windows KB5034441', asset: 'db-server-01', os: 'Windows Server 2016', status: 'compatible', details: '兼容性良好', risk: 'low' },
  { id: 'comp-003', patch: 'Windows KB5034441', asset: 'app-server-01', os: 'Windows Server 2012', status: 'warning', details: '部分组件可能受影响', risk: 'medium' },
  { id: 'comp-004', patch: 'Linux Kernel 6.5.0', asset: 'api-gateway-01', os: 'CentOS 7', status: 'incompatible', details: '内核版本不兼容', risk: 'high' },
  { id: 'comp-005', patch: 'Linux Kernel 6.5.0', asset: 'cdn-node-01', os: 'Ubuntu 22.04', status: 'compatible', details: '兼容性良好', risk: 'low' },
];

const statusConfig = {
  compatible: { label: '兼容', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  warning: { label: '警告', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertTriangle },
  incompatible: { label: '不兼容', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-3 h-3" />;

const riskConfig = {
  low: { label: '低', color: 'bg-green-500/20 text-green-400' },
  medium: { label: '中', color: 'bg-yellow-500/20 text-yellow-400' },
  high: { label: '高', color: 'bg-red-500/20 text-red-400' },
};

export function PatchCompatibilityAnalysis() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredResults = compatibilityResults.filter(result => {
    if (search && !result.patch.includes(search) && !result.asset.includes(search)) return false;
    if (statusFilter && result.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: compatibilityResults.length,
    compatible: compatibilityResults.filter(r => r.status === 'compatible').length,
    warning: compatibilityResults.filter(r => r.status === 'warning').length,
    incompatible: compatibilityResults.filter(r => r.status === 'incompatible').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁兼容性分析" description="分析补丁与目标资产的兼容性"
        actions={[
          { icon: RefreshCw, label: '重新分析', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">分析总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">兼容</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{stats.compatible}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-sm text-[#9CA3AF]">警告</span>
          </div>
          <div className="text-2xl font-semibold text-[#F59E0B]">{stats.warning}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm text-[#9CA3AF]">不兼容</span>
          </div>
          <div className="text-2xl font-semibold text-[#EF4444]">{stats.incompatible}</div>
        </div>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="搜索补丁或资产"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="compatible">兼容</option>
              <option value="warning">警告</option>
              <option value="incompatible">不兼容</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">补丁名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">目标资产</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作系统</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">兼容性</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">风险等级</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">详情</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(result => {
                const config = statusConfig[result.status];
                const Icon = config.icon;
                return (
                  <tr key={result.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6]">{result.patch}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-[#F3F4F6]">{result.asset}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{result.os}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                        <IconComponent icon={Icon} />
                        {config.label}
                      </span>
                    </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${riskConfig[result.risk].color}`}>
                      {riskConfig[result.risk].label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{result.details}</td>
                  <td className="py-3 px-4">
                    <button className="flex items-center gap-1 text-sm text-[#0066FF] hover:text-[#0080FF]">
                      <span>查看详情</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
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
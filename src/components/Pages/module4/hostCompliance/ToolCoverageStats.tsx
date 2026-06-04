'use client';
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, BarChart3, PieChart, TrendingUp, Server, Shield } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const coverageData = [
  { id: 'group-001', name: 'Web服务器组', totalAssets: 50, coveredAssets: 48, coverage: 96 },
  { id: 'group-002', name: '数据库服务器组', totalAssets: 20, coveredAssets: 18, coverage: 90 },
  { id: 'group-003', name: '应用服务器组', totalAssets: 35, coveredAssets: 30, coverage: 86 },
  { id: 'group-004', name: '网络设备组', totalAssets: 15, coveredAssets: 12, coverage: 80 },
  { id: 'group-005', name: '云服务组', totalAssets: 40, coveredAssets: 35, coverage: 88 },
];

export function ToolCoverageStats() {
  const [search, setSearch] = useState('');

  const filteredData = coverageData.filter(item => {
    if (search && !item.name.includes(search)) return false;
    return true;
  });

  const overallStats = {
    totalAssets: coverageData.reduce((sum, item) => sum + item.totalAssets, 0),
    coveredAssets: coverageData.reduce((sum, item) => sum + item.coveredAssets, 0),
    avgCoverage: Math.round(coverageData.reduce((sum, item) => sum + item.coverage, 0) / coverageData.length),
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="工具覆盖率统计" description="统计主机安全工具的覆盖率"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">资产总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{overallStats.totalAssets}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">已覆盖资产</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{overallStats.coveredAssets}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">平均覆盖率</span>
          </div>
          <div className="text-2xl font-semibold text-[#0066FF]">{overallStats.avgCoverage}%</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-sm text-[#9CA3AF]">未覆盖资产</span>
          </div>
          <div className="text-2xl font-semibold text-[#F59E0B]">{overallStats.totalAssets - overallStats.coveredAssets}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0D1117] rounded-xl border border-[#2A354D] p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#0066FF]" />
            <h3 className="text-lg font-semibold text-[#F3F4F6]">各分组覆盖率</h3>
          </div>
          <div className="space-y-4">
            {filteredData.map(item => (
              <div key={item.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#F3F4F6]">{item.name}</span>
                  <span className="text-[#9CA3AF]">{item.coveredAssets}/{item.totalAssets} ({item.coverage}%)</span>
                </div>
                <div className="h-3 bg-[#181F32] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.coverage >= 90 ? 'bg-[#00D4AA]' : item.coverage >= 70 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                    style={{ width: `${item.coverage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D1117] rounded-xl border border-[#2A354D] p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-[#0066FF]" />
            <h3 className="text-lg font-semibold text-[#F3F4F6]">覆盖分布</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00D4AA]" />
                <span className="text-[#F3F4F6]">已覆盖</span>
              </div>
              <span className="text-[#F3F4F6] font-semibold">{overallStats.coveredAssets}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="text-[#F3F4F6]">未覆盖</span>
              </div>
              <span className="text-[#F3F4F6] font-semibold">{overallStats.totalAssets - overallStats.coveredAssets}</span>
            </div>
            <div className="pt-4 border-t border-[#2A354D]">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#9CA3AF]">总体覆盖率</span>
                <span className="text-[#00D4AA] font-semibold">{overallStats.avgCoverage}%</span>
              </div>
              <div className="h-2 bg-[#181F32] rounded-full overflow-hidden">
                <div className="h-full bg-[#00D4AA]" style={{ width: `${overallStats.avgCoverage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
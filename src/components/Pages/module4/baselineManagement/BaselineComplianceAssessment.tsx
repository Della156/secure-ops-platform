'use client';
import React, { useState } from 'react';
import { Search, Download, Shield, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';

const complianceData = [
  { baseline: '操作系统安全基线', totalAssets: 45, compliant: 42, rate: 93, trend: 'up' },
  { baseline: '数据库安全基线', totalAssets: 23, compliant: 20, rate: 87, trend: 'up' },
  { baseline: '网络设备安全基线', totalAssets: 18, compliant: 15, rate: 83, trend: 'down' },
  { baseline: '应用安全基线', totalAssets: 60, compliant: 56, rate: 93, trend: 'stable' },
];

export function BaselineComplianceAssessment() {
  const [search, setSearch] = useState('');

  const filteredData = complianceData.filter(item => {
    if (search && !item.baseline.includes(search)) return false;
    return true;
  });

  const avgComplianceRate = Math.round(complianceData.reduce((sum, item) => sum + item.rate, 0) / complianceData.length);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线合规评估" description="评估基线合规状态"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" /> 导出评估报告
          </button>,
        ]}
      />

      <StatsCardGrid cols={3}>
        <StatsCard title="平均合规率" value={`${avgComplianceRate}%`} icon={<Shield className="w-5 h-5" />} />
        <StatsCard title="合规资产总数" value={complianceData.reduce((sum, item) => sum + item.compliant, 0)} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="不合规资产数" value={complianceData.reduce((sum, item) => sum + (item.totalAssets - item.compliant), 0)} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
      </StatsCardGrid>

      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text" placeholder="搜索基线..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">基线名称</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">评估资产数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">合规数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">合规率</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">趋势</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.baseline}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right">{item.totalAssets}</td>
                  <td className="px-4 py-3 text-sm text-green-400 text-right">{item.compliant}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 bg-[#111625] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.rate >= 90 ? 'bg-green-500' : item.rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.rate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${item.rate >= 90 ? 'text-green-400' : item.rate >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{item.rate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      {item.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : item.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <span className={`text-xs px-3 py-1 rounded-full ${item.rate >= 90 ? 'bg-green-500/20 text-green-400' : item.rate >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {item.rate >= 90 ? '优秀' : item.rate >= 70 ? '良好' : '需改进'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-3">合规趋势分析</h4>
          <div className="space-y-3">
            {['1月', '2月', '3月', '4月', '5月', '6月'].map((month, idx) => (
              <div key={month}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{month}</span>
                  <span className="text-white">{85 + idx * 2}%</span>
                </div>
                <div className="h-3 bg-[#111625] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${85 + idx * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-3">风险等级分布</h4>
          <div className="space-y-3">
            {[
              { level: '高风险', count: 5, color: 'bg-red-500' },
              { level: '中风险', count: 12, color: 'bg-yellow-500' },
              { level: '低风险', count: 28, color: 'bg-green-500' },
              { level: '无风险', count: 91, color: 'bg-blue-500' },
            ].map(item => (
              <div key={item.level} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-xs text-slate-300">{item.level}</span>
                </div>
                <span className="text-xs text-white">{item.count} 项</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaselineComplianceAssessment;
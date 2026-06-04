'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, RefreshCw, TrendingUp, AlertTriangle, Server, Database, Network, Cloud, BarChart3 } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { PageHeader } from '@/components/Common/PageStates';

const stats = {
  totalAssets: 1543,
  monthlyGrowth: 4.5,
  highRiskAssets: 23,
  avgUtilization: 78,
};

const trendData = [
  { month: '1月', count: 1200 },
  { month: '2月', count: 1250 },
  { month: '3月', count: 1320 },
  { month: '4月', count: 1380 },
  { month: '5月', count: 1450 },
  { month: '6月', count: 1543 },
];

const riskDistribution = [
  { level: '高风险', count: 23, percentage: 1.5 },
  { level: '中风险', count: 156, percentage: 10.1 },
  { level: '低风险', count: 564, percentage: 36.6 },
  { level: '无风险', count: 800, percentage: 51.8 },
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

const assetTypes = [
  { type: '服务器', count: 456, growth: 5.2 },
  { type: '数据库', count: 189, growth: 3.1 },
  { type: '网络设备', count: 234, growth: 2.8 },
  { type: '云服务', count: 664, growth: 6.5 },
];

export function AssetAnalysisView() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产分析视图" description="综合展示资产分析相关信息"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建分析任务
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="资产总数" value={stats.totalAssets} icon={<Server className="w-5 h-5" />} />
        <StatsCard title="月增长率" value={`+${stats.monthlyGrowth}%`} icon={<TrendingUp className="w-5 h-5" />} color="green" />
        <StatsCard title="高风险资产" value={stats.highRiskAssets} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <StatsCard title="平均利用率" value={`${stats.avgUtilization}%`} icon={<BarChart3 className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
          <h3 className="text-white font-medium mb-4">资产增长趋势</h3>
          <div className="flex items-end justify-between h-48 gap-4">
            {trendData.map(item => (
              <div key={item.month} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-slate-400 mb-2">{item.month}</div>
                <div className="w-full bg-blue-500/20 rounded-t-lg transition-all hover:bg-blue-500/30" style={{ height: `${(item.count / 1600) * 100}%`, minHeight: '20px' }}>
                  <div className="text-center mt-2">
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
          <h3 className="text-white font-medium mb-4">风险分布</h3>
          <div className="space-y-3">
            {riskDistribution.map(item => (
              <div key={item.level}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`${item.level === '高风险' ? 'text-red-400' : item.level === '中风险' ? 'text-yellow-400' : 'text-slate-300'}`}>{item.level}</span>
                  <span className="text-white">{item.count}</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.level === '高风险' ? 'bg-red-500' : item.level === '中风险' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assetTypes.map(item => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons] || Server;
          return (
            <div key={item.type} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-lg ${typeColors[item.type as keyof typeof typeColors]}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-xl font-bold text-white">{item.count}</div>
                  <div className="text-xs text-slate-400">{item.type}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>增长率: +{item.growth}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AssetAnalysisView;
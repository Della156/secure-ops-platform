'use client';
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, TrendingUp, TrendingDown, Minus, Calendar, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const trends = [
  { id: 'TREND-001', metric: '资产总数', current: 1543, previous: 1450, change: 6.4, trend: 'up' },
  { id: 'TREND-002', metric: '服务器数量', current: 456, previous: 434, change: 5.1, trend: 'up' },
  { id: 'TREND-003', metric: '数据库数量', current: 189, previous: 183, change: 3.3, trend: 'up' },
  { id: 'TREND-004', metric: '网络设备', current: 234, previous: 228, change: 2.6, trend: 'up' },
  { id: 'TREND-005', metric: '云服务数量', current: 664, previous: 605, change: 9.8, trend: 'up' },
];

const monthlyData = [
  { month: '1月', assets: 1200, servers: 380, databases: 156, network: 198, cloud: 466 },
  { month: '2月', assets: 1250, servers: 395, databases: 162, network: 205, cloud: 488 },
  { month: '3月', assets: 1320, servers: 412, databases: 168, network: 215, cloud: 525 },
  { month: '4月', assets: 1380, servers: 428, databases: 174, network: 222, cloud: 556 },
  { month: '5月', assets: 1450, servers: 442, databases: 180, network: 228, cloud: 600 },
  { month: '6月', assets: 1543, servers: 456, databases: 189, network: 234, cloud: 664 },
];

export function AssetTrendAnalysis() {
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产趋势分析" description="分析资产增长趋势"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新数据
          </button>,
        ]}
      />

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <select
            value={timeRange} onChange={e => setTimeRange(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
          >
            <option value="1M">近1个月</option>
            <option value="3M">近3个月</option>
            <option value="6M">近6个月</option>
            <option value="1Y">近1年</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {trends.map(trend => (
          <div key={trend.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-2">{trend.metric}</div>
            <div className="text-2xl font-bold text-white mb-2">{trend.current}</div>
            <div className={`flex items-center gap-1 text-xs ${
              trend.trend === 'up' ? 'text-green-400' : trend.trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {trend.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              <span>{trend.trend === 'up' ? '+' : ''}{trend.change}%</span>
              <span className="text-slate-500">较上期</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          资产月度增长趋势
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">月份</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">资产总数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">服务器</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">数据库</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">网络设备</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">云服务</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(item => (
                <tr key={item.month} className="border-b border-[#2A354D] last:border-b-0">
                  <td className="px-4 py-3 text-sm text-white">{item.month}</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-400">{item.assets}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-400">{item.servers}</td>
                  <td className="px-4 py-3 text-sm text-right text-purple-400">{item.databases}</td>
                  <td className="px-4 py-3 text-sm text-right text-cyan-400">{item.network}</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-400">{item.cloud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssetTrendAnalysis;
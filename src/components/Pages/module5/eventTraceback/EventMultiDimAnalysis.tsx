'use client';

import React, { useState } from 'react';
import {
  Network, Search, Filter, Download, RefreshCw,
  Layers, BarChart3, PieChart, TrendingUp,
  ArrowRight, Target, Database, Clock
} from 'lucide-react';

interface Dimension {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const dimensions = {
  source: [
    { id: 's1', name: '外部网络', count: 156, percentage: 45, color: '#EF4444' },
    { id: 's2', name: '内部网络', count: 124, percentage: 36, color: '#3B82F6' },
    { id: 's3', name: 'VPN接入', count: 45, percentage: 13, color: '#8B5CF6' },
    { id: 's4', name: 'API接口', count: 21, percentage: 6, color: '#22C55E' },
  ],
  severity: [
    { id: 'v1', name: '严重', count: 34, percentage: 10, color: '#EF4444' },
    { id: 'v2', name: '高', count: 89, percentage: 26, color: '#F59E0B' },
    { id: 'v3', name: '中', count: 124, percentage: 36, color: '#EAB308' },
    { id: 'v4', name: '低', count: 99, percentage: 28, color: '#22C55E' },
  ],
  type: [
    { id: 't1', name: '攻击事件', count: 145, percentage: 42, color: '#EF4444' },
    { id: 't2', name: '漏洞告警', count: 89, percentage: 26, color: '#F59E0B' },
    { id: 't3', name: '合规违规', count: 67, percentage: 19, color: '#3B82F6' },
    { id: 't4', name: '异常行为', count: 45, percentage: 13, color: '#8B5CF6' },
  ],
};

const correlationData = [
  { source: '外部网络', type: '攻击事件', count: 89 },
  { source: '外部网络', type: '漏洞告警', count: 45 },
  { source: '内部网络', type: '异常行为', count: 56 },
  { source: '内部网络', type: '合规违规', count: 43 },
  { source: 'VPN接入', type: '攻击事件', count: 23 },
  { source: 'VPN接入', type: '漏洞告警', count: 15 },
];

export function EventMultiDimAnalysis() {
  const [activeTab, setActiveTab] = useState('source');

  const tabs = [
    { id: 'source', label: '来源分析', icon: <Network className="w-4 h-4" /> },
    { id: 'severity', label: '严重级别', icon: <Target className="w-4 h-4" /> },
    { id: 'type', label: '事件类型', icon: <Layers className="w-4 h-4" /> },
  ];

  const currentData = dimensions[activeTab as keyof typeof dimensions];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" />
            事件多维度关联分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">从多个维度分析事件，发现关联规律</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '分析维度', value: '4个', icon: <Layers className="w-4 h-4" />, color: 'blue' },
          { label: '关联事件', value: '346', icon: <Network className="w-4 h-4" />, color: 'purple' },
          { label: '核心发现', value: '8条', icon: <Target className="w-4 h-4" />, color: 'green' },
          { label: '分析耗时', value: '2.3s', icon: <Clock className="w-4 h-4" />, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="flex border-b border-[#2A354D]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#111625] text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-[#111625]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                分布统计
              </h3>
              <div className="space-y-3">
                {currentData.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{item.name}</span>
                      <span className="text-white">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-6 bg-[#111625] rounded-lg overflow-hidden flex items-center">
                      <div
                        className="h-full rounded-lg flex items-center px-2"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color, opacity: 0.8 }}
                      >
                        <span className="text-xs text-white font-medium">{item.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-400" />
                占比分布
              </h3>
              <div className="flex justify-center">
                <svg width="200" height="200" className="transform -rotate-90">
                  {(() => {
                    let acc = 0;
                    return currentData.map((item, i) => {
                      const angle = (item.percentage / 100) * 360;
                      const startAngle = acc;
                      const endAngle = acc + angle;
                      acc = endAngle;
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const x1 = 100 + 60 * Math.cos(startRad);
                      const y1 = 100 + 60 * Math.sin(startRad);
                      const x2 = 100 + 60 * Math.cos(endRad);
                      const y2 = 100 + 60 * Math.sin(endRad);
                      const largeArc = angle > 180 ? 1 : 0;
                      return (
                        <g key={i}>
                          <path
                            d={`M 100 100 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={item.color}
                            opacity={0.8}
                          />
                        </g>
                      );
                    });
                  })()}
                  <circle cx="100" cy="100" r="35" fill="#0F172A" />
                  <text x="100" y="95" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    346
                  </text>
                  <text x="100" y="115" textAnchor="middle" fill="#64748B" fontSize="10">
                    总事件
                  </text>
                </svg>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {currentData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-400">{item.name}</span>
                    <span className="text-white ml-auto">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-green-400" />
          维度关联矩阵
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#111625]">
                <th className="text-left px-3 py-2 text-gray-400">来源</th>
                {['攻击事件', '漏洞告警', '合规违规', '异常行为'].map((type, i) => (
                  <th key={i} className="text-center px-3 py-2 text-gray-400">{type}</th>
                ))}
                <th className="text-right px-3 py-2 text-gray-400">总计</th>
              </tr>
            </thead>
            <tbody>
              {[
                { source: '外部网络', values: [89, 45, 12, 10], total: 156 },
                { source: '内部网络', values: [34, 28, 43, 19], total: 124 },
                { source: 'VPN接入', values: [23, 15, 5, 2], total: 45 },
                { source: 'API接口', values: [9, 1, 7, 4], total: 21 },
              ].map((row, i) => (
                <tr key={i} className="border-t border-[#2A354D]">
                  <td className="px-3 py-2 text-gray-300">{row.source}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="px-3 py-2 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-6 rounded ${
                        val > 50 ? 'bg-red-500/20 text-red-400' :
                        val > 20 ? 'bg-yellow-500/20 text-yellow-400' :
                        val > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-[#111625] text-gray-500'
                      }`}>
                        {val}
                      </div>
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right text-white font-medium">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-2">关键发现 #1</h3>
          <p className="text-xs text-gray-400">
            外部网络来源的攻击事件占比最高(42%)，建议加强边界防护和流量监控。
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-2">关键发现 #2</h3>
          <p className="text-xs text-gray-400">
            中等严重级别事件占比最大(36%)，需关注潜在风险累积效应。
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventMultiDimAnalysis;
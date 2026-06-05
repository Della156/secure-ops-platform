'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3, Search, Filter, Download, RefreshCw,
  Plus, X, ChevronRight, Settings, Layers,
  PieChart, LineChart, TrendingUp, Database,
  Zap, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface Dimension {
  id: string;
  name: string;
  type: 'category' | 'numeric' | 'date';
  selected: boolean;
}

interface AnalysisResult {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'summary';
  data: Record<string, unknown>[];
}

const dimensions: Dimension[] = [
  { id: 'time', name: '时间', type: 'date', selected: true },
  { id: 'asset', name: '资产', type: 'category', selected: true },
  { id: 'severity', name: '严重级别', type: 'category', selected: false },
  { id: 'type', name: '事件类型', type: 'category', selected: false },
  { id: 'source', name: '来源', type: 'category', selected: false },
  { id: 'count', name: '数量', type: 'numeric', selected: true },
  { id: 'duration', name: '持续时间', type: 'numeric', selected: false },
  { id: 'score', name: '风险评分', type: 'numeric', selected: false },
];

const mockResults: any = [
  { id: '1', name: '安全事件趋势分析', type: 'chart' as const, data: [
    { date: '5/27', count: 120, avgScore: 75 },
    { date: '5/28', count: 156, avgScore: 82 },
    { date: '5/29', count: 98, avgScore: 68 },
    { date: '5/30', count: 145, avgScore: 78 },
    { date: '5/31', count: 178, avgScore: 85 },
    { date: '6/1', count: 134, avgScore: 72 },
    { date: '6/2', count: 167, avgScore: 80 },
  ]},
  { id: '2', name: '资产风险分布', type: 'chart' as const, data: [
    { asset: 'WEB-APP', high: 15, medium: 23, low: 45 },
    { asset: '数据库', high: 8, medium: 15, low: 22 },
    { asset: '网络设备', high: 5, medium: 12, low: 30 },
    { asset: '服务器', high: 12, medium: 18, low: 35 },
  ]},
  { id: '3', name: '事件类型统计', type: 'chart' as const, data: [
    { type: '攻击事件', count: 456, percentage: 42 },
    { type: '漏洞告警', count: 234, percentage: 22 },
    { type: '合规违规', count: 189, percentage: 18 },
    { type: '异常行为', count: 198, percentage: 18 },
  ]},
];

function DimensionTag({ dimension, onToggle }: { dimension: Dimension; onToggle: (id: string) => void }) {
  return (
    <button
      onClick={() => onToggle(dimension.id)}
      className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
        dimension.selected
          ? 'bg-blue-600 text-white'
          : 'bg-[#111625] border border-[#2A354D] text-gray-400 hover:bg-[#20293F]'
      }`}
    >
      {dimension.name}
      {dimension.selected && <X className="w-3 h-3" />}
    </button>
  );
}

function SimpleLineChart({ data }: { data: { date: string; count: number; avgScore: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count));
  const width = 500;
  const height = 150;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * chartWidth,
    y: padding + chartHeight - (d.count / maxCount) * chartHeight,
    label: d.date,
    value: d.count,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="bg-[#111625] rounded-lg">
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + chartHeight * p}
          x2={width - padding}
          y2={padding + chartHeight * p}
          stroke="rgba(255,255,255,0.05)"
        />
      ))}
      <path d={linePath} fill="none" stroke="#3B82F6" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3B82F6" />
      ))}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - 5} fill="#64748B" fontSize="10" textAnchor="middle">
          {p.label}
        </text>
      ))}
    </svg>
  );
}

function HorizontalBarChart({ data }: { data: { type: string; count: number; percentage: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{item.type}</span>
            <span className="text-white">{item.count} ({item.percentage}%)</span>
          </div>
          <div className="h-6 bg-[#111625] rounded-lg overflow-hidden flex items-center">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center px-2"
              style={{ width: `${item.percentage}%` }}
            >
              <span className="text-xs text-white font-medium">{item.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CustomMultiDimAnalysis() {
  const [selectedDimensions, setSelectedDimensions] = useState(dimensions.filter(d => d.selected).map(d => d.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trend');

  const handleToggleDimension = (id: string) => {
    setSelectedDimensions(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: 'trend', label: '趋势分析', icon: <LineChart className="w-4 h-4" /> },
    { id: 'distribution', label: '分布分析', icon: <PieChart className="w-4 h-4" /> },
    { id: 'comparison', label: '对比分析', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            自定义多维度数据关联分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">自定义维度组合，进行多维度数据关联分析</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            高级配置
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">选择分析维度:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dimensions.map(dimension => (
              <DimensionTag
                key={dimension.id}
                dimension={dimension}
                onToggle={handleToggleDimension}
              />
            ))}
          </div>
        </div>
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
          {activeTab === 'trend' && (
            <div className="space-y-4">
              <div className="bg-[#111625] rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  安全事件趋势
                </h3>
                <SimpleLineChart data={mockResults[0].data as { date: string; count: number; avgScore: number }[]} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '今日事件', value: 167, change: +12, color: 'blue' },
                  { label: '平均风险分', value: 80, change: +5, color: 'orange' },
                  { label: '处理率', value: '78%', change: +8, color: 'green' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#111625] rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <span className={`text-xs flex items-center gap-0.5 ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#111625] rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-3">资产风险分布</h3>
                <div className="space-y-2">
                  {mockResults[1].data.map((item: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="text-xs text-gray-400">{item.asset}</div>
                      <div className="flex gap-1 h-4">
                        <div className="flex-1 bg-red-500/50 rounded" style={{ width: `${(item.high / (item.high + item.medium + item.low)) * 100}%` }} />
                        <div className="flex-1 bg-yellow-500/50 rounded" style={{ width: `${(item.medium / (item.high + item.medium + item.low)) * 100}%` }} />
                        <div className="flex-1 bg-green-500/50 rounded" style={{ width: `${(item.low / (item.high + item.medium + item.low)) * 100}%` }} />
                      </div>
                      <div className="text-xs text-gray-500">高:{item.high} 中:{item.medium} 低:{item.low}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#111625] rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-3">事件类型分布</h3>
                <HorizontalBarChart data={mockResults[2].data as { type: string; count: number; percentage: number }[]} />
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="bg-[#111625] rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4 flex items-center justify-between">
                  <span>本周 vs 上周对比</span>
                  <select className="bg-[#20293F] border border-[#2A354D] text-white text-xs rounded px-2 py-1">
                    <option>按日对比</option>
                    <option>按周对比</option>
                    <option>按月对比</option>
                  </select>
                </h3>
                <div className="flex items-end justify-between h-40 gap-2">
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => {
                    const lastWeek = Math.floor(Math.random() * 100) + 50;
                    const thisWeek = Math.floor(Math.random() * 100) + 50;
                    const maxVal = 150;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="flex gap-1 w-full justify-center">
                          <div
                            className="w-3 rounded-t bg-gray-500/50"
                            style={{ height: `${(lastWeek / maxVal) * 100}%`, minHeight: '8px' }}
                          />
                          <div
                            className="w-3 rounded-t bg-blue-500"
                            style={{ height: `${(thisWeek / maxVal) * 100}%`, minHeight: '8px' }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-500/50" />
                    <span className="text-xs text-gray-400">上周</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-xs text-gray-400">本周</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          分析结果导出
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出为 Excel
          </button>
          <button className="px-4 py-2 bg-[#111625] border border-[#2A354D] text-gray-300 text-sm rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出为 CSV
          </button>
          <button className="px-4 py-2 bg-[#111625] border border-[#2A354D] text-gray-300 text-sm rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出为 JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomMultiDimAnalysis;
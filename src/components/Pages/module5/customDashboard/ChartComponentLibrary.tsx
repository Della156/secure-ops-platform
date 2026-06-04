'use client';

import React, { useState } from 'react';
import {
  BarChart3, PieChart, LineChart, AreaChart,
  Table, Gauge, Activity, TrendingUp,
  Search, Plus, Download, RefreshCw,
  Grid3X3, LayoutGrid, ChevronRight, Check
} from 'lucide-react';

interface ChartComponent {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  usage: number;
  tags: string[];
}

const chartComponents: ChartComponent[] = [
  { id: 'bar', name: '柱状图', category: '基础图表', icon: <BarChart3 className="w-6 h-6" />, description: '用于展示数据对比和趋势分析', usage: 156, tags: ['对比', '趋势', '统计'] },
  { id: 'pie', name: '饼图', category: '基础图表', icon: <PieChart className="w-6 h-6" />, description: '用于展示数据占比和分布', usage: 123, tags: ['占比', '分布', '分类'] },
  { id: 'line', name: '折线图', category: '基础图表', icon: <LineChart className="w-6 h-6" />, description: '用于展示数据随时间变化趋势', usage: 145, tags: ['趋势', '时间序列', '变化'] },
  { id: 'area', name: '面积图', category: '基础图表', icon: <AreaChart className="w-6 h-6" />, description: '用于展示数据量的累积变化', usage: 89, tags: ['累积', '趋势', '对比'] },
  { id: 'gauge', name: '仪表盘', category: '指标展示', icon: <Gauge className="w-6 h-6" />, description: '用于展示关键指标数值', usage: 98, tags: ['指标', '数值', '实时'] },
  { id: 'table', name: '数据表格', category: '数据展示', icon: <Table className="w-6 h-6" />, description: '用于展示详细数据列表', usage: 203, tags: ['列表', '详细', '数据'] },
  { id: 'activity', name: '活动流', category: '实时监控', icon: <Activity className="w-6 h-6" />, description: '用于展示实时活动和日志', usage: 76, tags: ['实时', '日志', '流'] },
  { id: 'trend', name: '趋势卡片', category: '指标展示', icon: <TrendingUp className="w-6 h-6" />, description: '用于展示指标趋势变化', usage: 112, tags: ['趋势', '指标', '变化'] },
];

const categories = ['全部', ...new Set(chartComponents.map(c => c.category))];

export function ChartComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  const filteredComponents = chartComponents.filter(component => {
    const matchSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = categoryFilter === '全部' || component.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const toggleComponent = (id: string) => {
    setSelectedComponents(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-400" />
            可视化图表组件库
          </h2>
          <p className="text-sm text-gray-400 mt-1">浏览和选择可用的图表组件，用于自定义仪表盘</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出配置
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索组件名称、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {selectedComponents.length > 0 && (
            <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              添加 {selectedComponents.length} 个组件
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            onClick={() => toggleComponent(component.id)}
            className={`bg-[#20293F] border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500/50 ${
              selectedComponents.includes(component.id)
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-[#2A354D]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedComponents.includes(component.id)
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-[#111625] text-gray-400'
              }`}>
                {component.icon}
              </div>
              {selectedComponents.includes(component.id) && (
                <Check className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <h3 className="text-sm font-medium text-white mb-1">{component.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{component.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {component.tags.map((tag, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-[#111625] text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">使用次数: {component.usage}</span>
              <span className="text-gray-500 flex items-center gap-1">
                {component.category} <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-purple-400" />
          组件使用统计
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '总组件数', value: chartComponents.length },
            { label: '已选择', value: selectedComponents.length },
            { label: '最常用', value: '数据表格' },
            { label: '分类数', value: categories.length - 1 },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111625] rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChartComponentLibrary;
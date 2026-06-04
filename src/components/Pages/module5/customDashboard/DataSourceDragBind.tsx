'use client';

import React, { useState } from 'react';
import {
  Database, Search, Plus, X, ArrowRight,
  Zap, Link2, Settings, Download, RefreshCw,
  ChevronDown, Check, GripVertical
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected';
  metrics: string[];
}

interface Metric {
  id: string;
  name: string;
  type: 'numeric' | 'datetime' | 'string';
  unit?: string;
}

const dataSources: DataSource[] = [
  { id: 'ds-001', name: '安全事件数据库', type: 'MySQL', status: 'connected', metrics: ['事件数', '风险等级', '来源IP', '发生时间'] },
  { id: 'ds-002', name: '资产台账', type: 'PostgreSQL', status: 'connected', metrics: ['资产数量', '风险评分', '资产类型', '位置'] },
  { id: 'ds-003', name: '告警系统', type: 'API', status: 'connected', metrics: ['告警数', '严重级别', '告警来源', '处理状态'] },
  { id: 'ds-004', name: '漏洞扫描器', type: 'REST API', status: 'disconnected', metrics: ['漏洞数', 'CVSS评分', '修复状态', '资产ID'] },
];

const availableMetrics: Metric[] = [
  { id: 'm-001', name: '事件数量', type: 'numeric', unit: '个' },
  { id: 'm-002', name: '风险评分', type: 'numeric', unit: '分' },
  { id: 'm-003', name: '处理时间', type: 'datetime' },
  { id: 'm-004', name: '来源IP', type: 'string' },
  { id: 'm-005', name: '严重级别', type: 'string' },
  { id: 'm-006', name: '资产数量', type: 'numeric', unit: '台' },
  { id: 'm-007', name: '漏洞数', type: 'numeric', unit: '个' },
  { id: 'm-008', name: '告警数', type: 'numeric', unit: '条' },
];

export function DataSourceDragBind() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [boundMetrics, setBoundMetrics] = useState<string[]>(['m-001', 'm-002']);

  const toggleMetric = (id: string) => {
    setBoundMetrics(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const filteredMetrics = availableMetrics.filter(metric =>
    metric.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-green-400" />
            多数据源指标拖拽式选取与绑定
          </h2>
          <p className="text-sm text-gray-400 mt-1">从多个数据源中选择指标并绑定到仪表盘</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新数据源
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出配置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="p-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              数据源列表
            </h3>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {dataSources.map((source) => (
              <div
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className={`p-3 cursor-pointer transition-all ${
                  selectedSource === source.id
                    ? 'bg-blue-500/10 border-l-2 border-blue-500'
                    : 'hover:bg-[#111625]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">{source.name}</span>
                  <div className={`w-2 h-2 rounded-full ${source.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Zap className="w-3 h-3" />
                  {source.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="p-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              可用指标
            </h3>
          </div>
          <div className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="搜索指标..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-xs rounded-lg pl-8 pr-3 py-1.5"
              />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredMetrics.map((metric) => (
                <div
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`p-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                    boundMetrics.includes(metric.id)
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-[#111625] hover:bg-[#1a2234]'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="text-xs text-white">{metric.name}</div>
                    <div className="text-[10px] text-gray-500">
                      {metric.type === 'numeric' && `数值型 ${metric.unit ? `(${metric.unit})` : ''}`}
                      {metric.type === 'datetime' && '日期时间'}
                      {metric.type === 'string' && '字符串'}
                    </div>
                  </div>
                  {boundMetrics.includes(metric.id) && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="p-3 border-b border-[#2A354D]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-green-400" />
                已绑定指标
              </h3>
              <span className="text-xs text-gray-400">{boundMetrics.length} 个指标</span>
            </div>
          </div>
          <div className="p-3">
            {boundMetrics.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Link2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>拖拽或点击指标添加到这里</p>
              </div>
            ) : (
              <div className="space-y-2">
                {boundMetrics.map((metricId) => {
                  const metric = availableMetrics.find(m => m.id === metricId);
                  if (!metric) return null;
                  return (
                    <div key={metricId} className="flex items-center gap-2 p-2 bg-[#111625] rounded-lg">
                      <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs text-blue-400 font-bold">
                          {boundMetrics.indexOf(metricId) + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-white">{metric.name}</div>
                        <div className="text-[10px] text-gray-500">
                          {metric.type === 'numeric' && `数值型 ${metric.unit ? `(${metric.unit})` : ''}`}
                          {metric.type === 'datetime' && '日期时间'}
                          {metric.type === 'string' && '字符串'}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMetric(metricId)}
                        className="p-1 hover:bg-[#2A354D] rounded"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#2A354D]">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" />
              应用到仪表盘
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          绑定配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '数据源', value: selectedSource ? dataSources.find(d => d.id === selectedSource)?.name : '未选择', icon: <Database className="w-4 h-4" /> },
            { label: '绑定指标数', value: `${boundMetrics.length} 个`, icon: <Zap className="w-4 h-4" /> },
            { label: '数据更新频率', value: '实时', icon: <RefreshCw className="w-4 h-4" /> },
            { label: '数据格式', value: 'JSON', icon: <Settings className="w-4 h-4" /> },
          ].map((item, i) => (
            <div key={i} className="bg-[#111625] rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                {item.icon}
                {item.label}
              </div>
              <div className="text-sm text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataSourceDragBind;
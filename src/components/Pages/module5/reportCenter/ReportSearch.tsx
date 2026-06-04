'use client';

import React, { useState } from 'react';
import {
  Search, Filter, Download, RefreshCw,
  FileText, Calendar, User, Tag,
  ArrowRight, X, Clock, MapPin
} from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  date: string;
  author: string;
  score: number;
  summary: string;
}

const searchResults: SearchResult[] = [
  { id: 'r1', name: '2026年6月安全态势分析报告', type: 'PDF', date: '2026-06-02', author: '张工', score: 95, summary: '本月整体安全态势稳定，共检测到安全事件156起，较上月下降12%...' },
  { id: 'r2', name: 'Q2季度安全审计报告', type: 'PDF', date: '2026-06-01', author: '李工', score: 88, summary: '本季度安全审计共发现高危漏洞34个，中度风险67个，已修复率85%...' },
  { id: 'r3', name: '漏洞扫描月度报告', type: 'PDF', date: '2026-05-31', author: '王工', score: 82, summary: '本月漏洞扫描覆盖资产234台，发现新漏洞45个，已修复38个...' },
];

export function ReportSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [authorFilter, setAuthorFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    setActiveFilters(prev => prev.includes(filter) ? prev : [...prev, filter]);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const quickFilters = [
    { label: '本月', icon: <Calendar className="w-3 h-3" /> },
    { label: '本季度', icon: <Calendar className="w-3 h-3" /> },
    { label: '张工', icon: <User className="w-3 h-3" /> },
    { label: 'PDF', icon: <FileText className="w-3 h-3" /> },
    { label: '态势分析', icon: <Tag className="w-3 h-3" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-orange-400" />
            报告检索中心
          </h2>
          <p className="text-sm text-gray-400 mt-1">快速检索和查找安全分析报告</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出结果
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="搜索报告名称、内容、作者..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-lg rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded">
            搜索
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.map((filter, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                {filter}
                <button onClick={() => removeFilter(filter)} className="hover:text-blue-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-gray-400 mb-1 block">开始日期</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-gray-400 mb-1 block">结束日期</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
          />
        </div>
        <div className="min-w-[150px]">
          <label className="text-xs text-gray-400 mb-1 block">作者</label>
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
          >
            <option value="">全部作者</option>
            <option value="张工">张工</option>
            <option value="李工">李工</option>
            <option value="王工">王工</option>
            <option value="赵工">赵工</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
            筛选
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">快速筛选</h3>
          <span className="text-xs text-gray-500">点击添加筛选条件</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter, i) => (
            <button
              key={i}
              onClick={() => addFilter(filter.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                activeFilters.includes(filter.label)
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-[#111625] text-gray-400 hover:bg-[#20293F]'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">搜索结果</h3>
          <span className="text-xs text-gray-500">共找到 {searchResults.length} 条结果</span>
        </div>

        <div className="space-y-3">
          {searchResults.map((result) => (
            <div key={result.id} className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/30 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-medium text-white">{result.name}</h3>
                    <span className="text-xs text-gray-500 px-1.5 py-0.5 rounded bg-[#20293F]">
                      匹配度 {result.score}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{result.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {result.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {result.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {result.type}
                    </span>
                  </div>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  查看详情 <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">搜索统计</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">搜索耗时</span>
              <span className="text-white">0.32秒</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">检索范围</span>
              <span className="text-white">128份报告</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">平均匹配度</span>
              <span className="text-white">88%</span>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">搜索历史</h3>
          <div className="space-y-2">
            {['安全态势分析', '漏洞扫描报告', 'Q2审计报告'].map((term, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                <span>{term}</span>
                <Clock className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportSearch;
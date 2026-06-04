'use client';

import React, { useState } from 'react';
import {
  Search, Filter, Download, RefreshCw,
  BookOpen, Scale, ShieldAlert, FileText,
  ChevronRight, Clock, X, Tag
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'case' | 'rule' | 'intel';
  category: string;
  date: string;
  score: number;
  summary: string;
}

const searchResults: SearchResult[] = [
  { id: 'r1', title: '暴力破解攻击案例分析', type: 'case', category: '攻击事件', date: '2026-05-30', score: 95, summary: '详细分析了暴力破解攻击的特征、攻击手法和防御措施...' },
  { id: 'r2', title: '暴力破解检测规则', type: 'rule', category: '攻击检测', date: '2026-01-01', score: 88, summary: '检测连续失败登录尝试的安全规则...' },
  { id: 'r3', title: 'APT组织活动情报', type: 'intel', category: 'APT情报', date: '2026-06-02', score: 82, summary: '最新APT组织活动情报，包含IOC指标...' },
];

function TypeIcon({ type }: { type: SearchResult['type'] }) {
  const icons = {
    case: <BookOpen className="w-4 h-4 text-blue-400" />,
    rule: <Scale className="w-4 h-4 text-green-400" />,
    intel: <ShieldAlert className="w-4 h-4 text-orange-400" />,
  };
  return icons[type];
}

function TypeBadge({ type }: { type: SearchResult['type'] }) {
  const config = {
    case: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '案例' },
    rule: { bg: 'bg-green-500/10', text: 'text-green-400', label: '规则' },
    intel: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: '情报' },
  };
  const { bg, text, label } = config[type];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function KnowledgeSearchLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    setActiveFilters(prev => prev.includes(filter) ? prev : [...prev, filter]);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const quickFilters = [
    { label: '案例', icon: <BookOpen className="w-3 h-3" /> },
    { label: '规则', icon: <Scale className="w-3 h-3" /> },
    { label: '情报', icon: <ShieldAlert className="w-3 h-3" /> },
    { label: '高危', icon: <Tag className="w-3 h-3" /> },
    { label: '本月', icon: <Clock className="w-3 h-3" /> },
  ];

  const stats = {
    total: 128,
    cases: 45,
    rules: 36,
    intel: 47,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            知识库检索
          </h2>
          <p className="text-sm text-gray-400 mt-1">统一检索案例、规则和情报知识</p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '知识总数', value: stats.total, icon: <Search className="w-4 h-4" />, color: 'cyan' },
          { label: '案例', value: stats.cases, icon: <BookOpen className="w-4 h-4" />, color: 'blue' },
          { label: '规则', value: stats.rules, icon: <Scale className="w-4 h-4" />, color: 'green' },
          { label: '情报', value: stats.intel, icon: <ShieldAlert className="w-4 h-4" />, color: 'orange' },
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

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="搜索知识库..."
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
                    <TypeIcon type={result.type} />
                    <h3 className="text-sm font-medium text-white">{result.title}</h3>
                    <TypeBadge type={result.type} />
                    <span className={`text-xs px-1.5 py-0.5 rounded ${result.score >= 90 ? 'bg-green-500/20 text-green-400' : result.score >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {result.score}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{result.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {result.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {result.date}
                    </span>
                  </div>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  查看详情 <ChevronRight className="w-3 h-3" />
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
              <span className="text-white">0.45秒</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">检索范围</span>
              <span className="text-white">128条知识</span>
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
            {['暴力破解', 'SQL注入', '漏洞分析', '威胁情报'].map((term, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {term}
                <Search className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeSearchLibrary;
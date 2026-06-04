'use client';

import React, { useState } from 'react';
import {
  ShieldAlert, Search, Filter, Plus, Edit3, Trash2,
  Eye, ChevronRight, AlertTriangle, Clock, User,
  Tag, CheckCircle2, XCircle, Globe
} from 'lucide-react';

interface Intel {
  id: string;
  title: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  source: string;
  date: string;
  status: 'active' | 'archived';
  confidence: number;
}

const intelData: Intel[] = [
  { id: 'i1', title: 'APT组织"海莲花"最新活动', type: 'APT情报', severity: 'high', source: '内部情报', date: '2026-06-02', status: 'active', confidence: 95 },
  { id: 'i2', title: '新型勒索软件"BlackCat"变种分析', type: '恶意软件', severity: 'high', source: '外部情报', date: '2026-06-01', status: 'active', confidence: 88 },
  { id: 'i3', title: 'CVE-2026-XXXX漏洞预警', type: '漏洞情报', severity: 'high', source: 'CVE数据库', date: '2026-05-31', status: 'active', confidence: 92 },
  { id: 'i4', title: '钓鱼邮件攻击趋势分析', type: '攻击趋势', severity: 'medium', source: '内部情报', date: '2026-05-30', status: 'active', confidence: 75 },
  { id: 'i5', title: '已知恶意IP地址列表更新', type: 'IOC情报', severity: 'medium', source: '外部情报', date: '2026-05-29', status: 'archived', confidence: 85 },
];

function SeverityBadge({ severity }: { severity: Intel['severity'] }) {
  const config = {
    high: { bg: 'bg-red-500/10', text: 'text-red-400', label: '高危' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中危' },
    low: { bg: 'bg-green-500/10', text: 'text-green-400', label: '低危' },
  };
  const { bg, text, label } = config[severity];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: Intel['status'] }) {
  const config = {
    active: { bg: 'bg-green-500/10', text: 'text-green-400', label: '活跃' },
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: '归档' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function ThreatIntelLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredIntel = intelData.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: intelData.length,
    active: intelData.filter(i => i.status === 'active').length,
    high: intelData.filter(i => i.severity === 'high').length,
    avgConfidence: Math.round(intelData.reduce((acc, i) => acc + i.confidence, 0) / intelData.length),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-400" />
            威胁情报库
          </h2>
          <p className="text-sm text-gray-400 mt-1">收集和管理威胁情报，支持情报关联分析</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            导入情报
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '情报总数', value: stats.total, icon: <ShieldAlert className="w-4 h-4" />, color: 'orange' },
          { label: '活跃情报', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
          { label: '高危情报', value: stats.high, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
          { label: '平均置信度', value: `${stats.avgConfidence}%`, icon: <Globe className="w-4 h-4" />, color: 'blue' },
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
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索情报..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">全部类型</option>
              <option value="APT情报">APT情报</option>
              <option value="恶意软件">恶意软件</option>
              <option value="漏洞情报">漏洞情报</option>
              <option value="攻击趋势">攻击趋势</option>
              <option value="IOC情报">IOC情报</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredIntel.map((item) => (
            <div key={item.id} className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/30 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                    <SeverityBadge severity={item.severity} />
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {item.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${item.confidence >= 90 ? 'bg-green-500/10 text-green-400' : item.confidence >= 70 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      置信度 {item.confidence}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-[#20293F] rounded" title="查看">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-[#20293F] rounded" title="编辑">
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded" title="删除">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">情报来源</h3>
          <div className="space-y-2">
            {[
              { name: '内部情报', count: 2, percentage: 40 },
              { name: '外部情报', count: 2, percentage: 40 },
              { name: 'CVE数据库', count: 1, percentage: 20 },
            ].map((source, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{source.name}</span>
                  <span className="text-white">{source.count} ({source.percentage}%)</span>
                </div>
                <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${source.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">情报操作</h3>
          <div className="space-y-2">
            {['批量导出情报', '关联分析', '情报订阅', '共享情报'].map((option, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {option}
                <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreatIntelLibrary;
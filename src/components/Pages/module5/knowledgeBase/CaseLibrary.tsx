'use client';

import React, { useState } from 'react';
import {
  BookOpen, Search, Filter, Plus, Edit3, Trash2,
  Eye, ChevronRight, AlertTriangle, Clock, User,
  Tag, CheckCircle2, XCircle
} from 'lucide-react';

interface Case {
  id: string;
  title: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  author: string;
  views: number;
  status: 'resolved' | 'active';
}

const cases: Case[] = [
  { id: 'c1', title: '2026年5月暴力破解攻击事件分析', type: '攻击事件', severity: 'high', date: '2026-05-30', author: '张工', views: 156, status: 'resolved' },
  { id: 'c2', title: 'SQL注入漏洞利用案例分析', type: '漏洞分析', severity: 'high', date: '2026-05-28', author: '李工', views: 89, status: 'resolved' },
  { id: 'c3', title: '内部人员违规访问事件调查', type: '合规事件', severity: 'medium', date: '2026-05-25', author: '王工', views: 67, status: 'resolved' },
  { id: 'c4', title: '勒索软件攻击应急响应案例', type: '攻击事件', severity: 'high', date: '2026-05-20', author: '张工', views: 234, status: 'resolved' },
  { id: 'c5', title: 'DDoS攻击防护实践案例', type: '防护案例', severity: 'medium', date: '2026-05-15', author: '刘工', views: 145, status: 'active' },
];

function SeverityBadge({ severity }: { severity: Case['severity'] }) {
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

function StatusBadge({ status }: { status: Case['status'] }) {
  const config = {
    resolved: { bg: 'bg-green-500/10', text: 'text-green-400', label: '已解决' },
    active: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '进行中' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function CaseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredCases = cases.filter(caseItem => {
    const matchSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSeverity = severityFilter === 'all' || caseItem.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const stats = {
    total: cases.length,
    high: cases.filter(c => c.severity === 'high').length,
    medium: cases.filter(c => c.severity === 'medium').length,
    views: cases.reduce((acc, c) => acc + c.views, 0),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            案例库
          </h2>
          <p className="text-sm text-gray-400 mt-1">安全事件案例库，支持检索和学习</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            添加案例
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '案例总数', value: stats.total, icon: <BookOpen className="w-4 h-4" />, color: 'blue' },
          { label: '高危案例', value: stats.high, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
          { label: '中危案例', value: stats.medium, icon: <XCircle className="w-4 h-4" />, color: 'yellow' },
          { label: '总浏览量', value: stats.views, icon: <Eye className="w-4 h-4" />, color: 'green' },
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
              placeholder="搜索案例..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">全部级别</option>
              <option value="high">高危</option>
              <option value="medium">中危</option>
              <option value="low">低危</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/30 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white">{caseItem.title}</h3>
                    <SeverityBadge severity={caseItem.severity} />
                    <StatusBadge status={caseItem.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {caseItem.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {caseItem.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {caseItem.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {caseItem.views}
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
          <h3 className="text-sm font-medium text-white mb-3">案例分类</h3>
          <div className="space-y-2">
            {[
              { name: '攻击事件', count: 2 },
              { name: '漏洞分析', count: 1 },
              { name: '合规事件', count: 1 },
              { name: '防护案例', count: 1 },
            ].map((cat, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {cat.name}
                <span className="text-white">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">热门案例</h3>
          <div className="space-y-2">
            {cases.sort((a, b) => b.views - a.views).slice(0, 3).map((caseItem, i) => (
              <div key={i} className="flex items-center gap-2 py-2 px-3 hover:bg-[#111625] rounded">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  i === 0 ? 'bg-yellow-500 text-black' :
                  i === 1 ? 'bg-gray-400 text-black' : 'bg-orange-500 text-black'
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs text-gray-400 flex-1 truncate">{caseItem.title}</span>
                <Eye className="w-3 h-3 text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseLibrary;
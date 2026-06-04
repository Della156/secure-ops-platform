'use client';

import React, { useState } from 'react';
import {
  Scale, Search, Filter, Plus, Edit3, Trash2,
  Eye, ChevronRight, CheckCircle2, XCircle,
  Clock, User, Tag, AlertTriangle
} from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  author: string;
  date: string;
  status: 'enabled' | 'disabled';
  matches: number;
}

const rules: Rule[] = [
  { id: 'r1', name: '暴力破解检测规则', category: '攻击检测', severity: 'high', author: '安全团队', date: '2026-01-01', status: 'enabled', matches: 156 },
  { id: 'r2', name: 'SQL注入检测规则', category: 'Web安全', severity: 'high', author: '安全团队', date: '2026-01-01', status: 'enabled', matches: 89 },
  { id: 'r3', name: '异常流量检测规则', category: '流量分析', severity: 'medium', author: '张工', date: '2026-02-15', status: 'enabled', matches: 45 },
  { id: 'r4', name: '恶意软件检测规则', category: '终端安全', severity: 'high', author: '安全团队', date: '2026-01-01', status: 'enabled', matches: 234 },
  { id: 'r5', name: '权限异常检测规则', category: '身份安全', severity: 'medium', author: '李工', date: '2026-03-01', status: 'disabled', matches: 12 },
];

function SeverityBadge({ severity }: { severity: Rule['severity'] }) {
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

function StatusBadge({ status }: { status: Rule['status'] }) {
  const config = {
    enabled: { bg: 'bg-green-500/10', text: 'text-green-400', label: '启用', icon: <CheckCircle2 className="w-3 h-3" /> },
    disabled: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: '禁用', icon: <XCircle className="w-3 h-3" /> },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function ExpertRuleLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRules = rules.filter(rule => {
    const matchSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || rule.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: rules.length,
    enabled: rules.filter(r => r.status === 'enabled').length,
    matches: rules.reduce((acc, r) => acc + r.matches, 0),
    high: rules.filter(r => r.severity === 'high').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-green-400" />
            专家规则库
          </h2>
          <p className="text-sm text-gray-400 mt-1">安全检测规则管理，支持自定义规则</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            添加规则
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '规则总数', value: stats.total, icon: <Scale className="w-4 h-4" />, color: 'green' },
          { label: '启用规则', value: stats.enabled, icon: <CheckCircle2 className="w-4 h-4" />, color: 'blue' },
          { label: '匹配次数', value: stats.matches, icon: <Eye className="w-4 h-4" />, color: 'purple' },
          { label: '高危规则', value: stats.high, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
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
              placeholder="搜索规则..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">全部状态</option>
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/30 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white">{rule.name}</h3>
                    <SeverityBadge severity={rule.severity} />
                    <StatusBadge status={rule.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {rule.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {rule.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rule.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      匹配 {rule.matches} 次
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
          <h3 className="text-sm font-medium text-white mb-3">规则分类</h3>
          <div className="space-y-2">
            {[
              { name: '攻击检测', count: 1 },
              { name: 'Web安全', count: 1 },
              { name: '流量分析', count: 1 },
              { name: '终端安全', count: 1 },
              { name: '身份安全', count: 1 },
            ].map((cat, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {cat.name}
                <span className="text-white">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">规则模板</h3>
          <div className="space-y-2">
            {['创建空白规则', '从现有规则复制', '导入规则文件', '导出所有规则'].map((option, i) => (
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

export default ExpertRuleLibrary;
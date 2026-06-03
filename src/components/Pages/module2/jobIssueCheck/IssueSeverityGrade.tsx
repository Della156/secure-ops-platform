'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck, Settings, Search, Filter, Eye, Zap, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface GradeIssue {
  id: string;
  issueType: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  affectedSystems: string[];
  score: number;
  lastUpdated: string;
}

const mockGradeIssues: GradeIssue[] = [
  { id: 'GRADE-001', issueType: '安全漏洞', description: '存在高危安全漏洞CVE-2024-XXXX', severity: 'critical', impact: '可能导致未授权访问和数据泄露', affectedSystems: ['web-server-01', 'web-server-02'], score: 9.8, lastUpdated: '2026-06-02 10:00:00' },
  { id: 'GRADE-002', issueType: '配置错误', description: '数据库连接超时设置不合理', severity: 'high', impact: '可能导致服务不可用', affectedSystems: ['prod-db-01'], score: 7.2, lastUpdated: '2026-06-02 09:30:00' },
  { id: 'GRADE-003', issueType: '性能问题', description: 'CPU使用率持续超过80%', severity: 'medium', impact: '可能影响系统响应速度', affectedSystems: ['app-server-01'], score: 5.5, lastUpdated: '2026-06-02 09:00:00' },
  { id: 'GRADE-004', issueType: '冗余配置', description: '存在未使用的防火墙规则', severity: 'low', impact: '无明显影响，建议清理', affectedSystems: ['fw-01'], score: 2.1, lastUpdated: '2026-06-02 08:30:00' },
  { id: 'GRADE-005', issueType: '安全策略', description: '密码策略强度不足', severity: 'high', impact: '可能导致账户被破解', affectedSystems: ['ad-server'], score: 8.0, lastUpdated: '2026-06-02 08:00:00' },
];

const pieData = [
  { name: '严重', value: 1, color: '#EF4444' },
  { name: '高', value: 2, color: '#F97316' },
  { name: '中', value: 1, color: '#EAB308' },
  { name: '低', value: 1, color: '#3B82F6' },
];

const severityCriteria = [
  { level: 'critical', label: '严重', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30', score: '9.0 - 10.0', impact: '系统崩溃、数据泄露、重大安全事件' },
  { level: 'high', label: '高', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30', score: '7.0 - 8.9', impact: '服务中断、性能严重下降' },
  { level: 'medium', label: '中', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30', score: '4.0 - 6.9', impact: '功能异常、性能下降' },
  { level: 'low', label: '低', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30', score: '0.0 - 3.9', impact: '轻微问题、不影响主要功能' },
];

export function IssueSeverityGrade() {
  const [data] = useState<GradeIssue[]>(mockGradeIssues);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<GradeIssue | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.issueType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
      case 'high': return { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
      case 'medium': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
      case 'low': return { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
    }
  };

  const stats = {
    total: data.length,
    critical: data.filter(d => d.severity === 'critical').length,
    high: data.filter(d => d.severity === 'high').length,
    medium: data.filter(d => d.severity === 'medium').length,
    low: data.filter(d => d.severity === 'low').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">问题严重程度分级</h2>
        <p className="text-sm text-gray-400 mt-1">严重程度判定、问题分级展示</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">问题总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">严重</p>
              <p className="text-xl font-semibold text-red-400">{stats.critical}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">高</p>
              <p className="text-xl font-semibold text-orange-400">{stats.high}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">中</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.medium}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">低</p>
              <p className="text-xl font-semibold text-blue-400">{stats.low}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索问题..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="all">全部等级</option>
                    <option value="critical">严重</option>
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredData.map((item) => {
              const style = getSeverityStyle(item.severity);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIssue(item)}
                  className={`bg-[#1E2736] border rounded-lg p-4 cursor-pointer transition-all ${selectedIssue?.id === item.id ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-[#2A354D] hover:border-[#2A354D]/70'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center`}>
                        <span className={`text-xl font-bold ${style.color}`}>{item.score.toFixed(1)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{item.issueType}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${style.bg} ${style.color}`}>
                            {item.severity === 'critical' ? '严重' : item.severity === 'high' ? '高' : item.severity === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>影响: {item.impact}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {item.affectedSystems.map(sys => (
                            <span key={sys} className="px-2 py-0.5 text-xs rounded-full bg-gray-600/30 text-gray-300">{sys}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              严重程度分布
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              分级标准
            </h3>
            <div className="space-y-3">
              {severityCriteria.map((criteria) => (
                <div key={criteria.level} className={`p-3 rounded-lg border ${criteria.bgColor} ${criteria.borderColor}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${criteria.color}`}>{criteria.label}</span>
                    <span className="text-xs text-gray-400">分值: {criteria.score}</span>
                  </div>
                  <p className="text-xs text-gray-400">{criteria.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedIssue && (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
              <div className="p-4 border-b border-[#2A354D] flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">问题详情</h3>
                <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-white text-xs">关闭</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">问题ID</p>
                  <p className="text-sm text-white">{selectedIssue.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">问题类型</p>
                  <p className="text-sm text-white">{selectedIssue.issueType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">严重程度</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityStyle(selectedIssue.severity).bg} ${getSeverityStyle(selectedIssue.severity).color}`}>
                      {selectedIssue.severity === 'critical' ? '严重' : selectedIssue.severity === 'high' ? '高' : selectedIssue.severity === 'medium' ? '中' : '低'}
                    </span>
                    <span className="text-sm text-white font-mono">分值: {selectedIssue.score.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">问题描述</p>
                  <p className="text-sm text-gray-300">{selectedIssue.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">影响说明</p>
                  <p className="text-sm text-gray-300">{selectedIssue.impact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">影响系统</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedIssue.affectedSystems.map(sys => (
                      <span key={sys} className="px-2 py-0.5 text-xs rounded-full bg-gray-600/30 text-gray-300">{sys}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">最后更新</p>
                  <p className="text-sm text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedIssue.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

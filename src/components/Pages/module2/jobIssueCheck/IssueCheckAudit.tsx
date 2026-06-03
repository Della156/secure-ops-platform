'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Shield, Settings, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

interface AuditItem {
  id: string;
  operator: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  result: 'success' | 'failed';
}

interface RuleChange {
  id: string;
  ruleName: string;
  changeType: 'create' | 'update' | 'delete';
  operator: string;
  timestamp: string;
  before: string;
  after: string;
}

const mockAuditData: AuditItem[] = [
  { id: 'AUD-IC-001', operator: 'admin', action: '创建检查任务', target: '网络设备配置检查', details: '创建了针对 core-switch-01 的配置检查任务', timestamp: '2026-06-02 10:00:00', result: 'success' },
  { id: 'AUD-IC-002', operator: 'admin', action: '执行检查任务', target: '网络设备配置检查', details: '任务执行完成，未发现问题', timestamp: '2026-06-02 10:05:00', result: 'success' },
  { id: 'AUD-IC-003', operator: 'admin', action: '修改检查规则', target: '数据库安全基线规则', details: '修改了密码复杂度检查规则', timestamp: '2026-06-02 09:30:00', result: 'success' },
  { id: 'AUD-IC-004', operator: 'ops', action: '执行检查任务', target: 'Web服务器性能检查', details: '任务执行失败，连接超时', timestamp: '2026-06-02 09:00:00', result: 'failed' },
  { id: 'AUD-IC-005', operator: 'admin', action: '导出检查报告', target: '防火墙规则检查', details: '导出了检查报告 PDF', timestamp: '2026-06-02 08:30:00', result: 'success' },
  { id: 'AUD-IC-006', operator: 'admin', action: '查看问题详情', target: '应用部署一致性检查', details: '查看了发现的配置问题', timestamp: '2026-06-02 08:00:00', result: 'success' },
];

const mockRuleChanges: RuleChange[] = [
  { id: 'RULE-001', ruleName: '密码复杂度规则', changeType: 'update', operator: 'admin', timestamp: '2026-06-02 09:30:00', before: '密码长度至少8位', after: '密码长度至少12位，包含大小写字母和数字' },
  { id: 'RULE-002', ruleName: '端口扫描规则', changeType: 'create', operator: 'admin', timestamp: '2026-06-01 18:00:00', before: '-', after: '禁止扫描内部网络端口' },
  { id: 'RULE-003', ruleName: '旧版协议检查规则', changeType: 'delete', operator: 'admin', timestamp: '2026-06-01 12:00:00', before: '检查 SSLv3 协议', after: '-' },
];

export function IssueCheckAudit() {
  const [activeTab, setActiveTab] = useState<'audit' | 'rules'>('audit');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredAuditData = mockAuditData.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.operator.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.action.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.target.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesSearch;
  });

  const filteredRuleChanges = mockRuleChanges.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.operator.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.ruleName.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesSearch;
  });

  const getResultBadge = (result: string) => {
    if (result === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />成功</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" />失败</span>;
  };

  const getChangeTypeBadge = (type: string) => {
    if (type === 'create') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">创建</span>;
    if (type === 'update') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">更新</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">删除</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业问题检查任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">审计日志记录、规则变更记录</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'audit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'}`}
          >
            审计日志
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'rules' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'}`}
          >
            规则变更记录
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'audit' ? '搜索操作人、操作或目标...' : '搜索规则名称或操作人...'}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出日志
          </button>
        </div>
      </div>

      {activeTab === 'audit' && (
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">详情</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredAuditData.map((item) => (
                <tr key={item.id} className="hover:bg-[#2A354D]/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{item.operator}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.action}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{item.target}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-400">{item.details}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{item.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{getResultBadge(item.result)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAuditData.length === 0 && <p className="text-gray-500 text-center py-8">暂无记录</p>}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-4">
          {filteredRuleChanges.map((item) => (
            <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{item.ruleName}</span>
                      {getChangeTypeBadge(item.changeType)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {item.operator}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.before !== '-' && (
                  <div className="bg-[#111827] border border-red-500/20 rounded-lg p-3">
                    <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      修改前
                    </p>
                    <p className="text-sm text-gray-300">{item.before}</p>
                  </div>
                )}
                {item.after !== '-' && (
                  <div className="bg-[#111827] border border-green-500/20 rounded-lg p-3">
                    <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      修改后
                    </p>
                    <p className="text-sm text-gray-300">{item.after}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredRuleChanges.length === 0 && (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-12 h-12 mb-4 opacity-50" />
              <p>暂无记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

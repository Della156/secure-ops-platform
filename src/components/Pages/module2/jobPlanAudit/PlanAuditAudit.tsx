'use client';

import React, { useState } from 'react';
import { Search, Filter, FileText, User, Clock, Shield, Settings, Download } from 'lucide-react';

interface AuditLog {
  id: string;
  operationType: string;
  operator: string;
  targetPlan: string;
  operationTime: string;
  operationDetail: string;
  ipAddress: string;
}

interface RuleChange {
  id: string;
  ruleName: string;
  operator: string;
  changeType: 'add' | 'modify' | 'delete';
  changeTime: string;
  beforeChange: string;
  afterChange: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: 'LOG-001', operationType: '提交审核', operator: '张工', targetPlan: '系统补丁升级方案', operationTime: '2026-06-02 09:00:00', operationDetail: '提交方案至审核流程', ipAddress: '192.168.1.101' },
  { id: 'LOG-002', operationType: '审核通过', operator: '李经理', targetPlan: '系统补丁升级方案', operationTime: '2026-06-02 10:15:00', operationDetail: '审核通过，方案可执行', ipAddress: '192.168.1.1' },
  { id: 'LOG-003', operationType: '驳回审核', operator: '钱经理', targetPlan: '网络架构优化方案', operationTime: '2026-06-01 15:00:00', operationDetail: '方案缺少风险评估报告', ipAddress: '192.168.1.2' },
  { id: 'LOG-004', operationType: '重新提交', operator: '王工', targetPlan: '网络架构优化方案', operationTime: '2026-06-01 14:00:00', operationDetail: '补充风险评估后重新提交', ipAddress: '192.168.1.102' },
  { id: 'LOG-005', operationType: '规则修改', operator: '系统管理员', targetPlan: '-', operationTime: '2026-05-31 16:30:00', operationDetail: '修改合规性检查规则', ipAddress: '192.168.1.254' },
];

const mockRuleChanges: RuleChange[] = [
  { id: 'RULE-CHG-001', ruleName: '变更风险评估完整', operator: '系统管理员', changeType: 'modify', changeTime: '2026-05-31 16:30:00', beforeChange: '风险等级：中', afterChange: '风险等级：高' },
  { id: 'RULE-CHG-002', ruleName: '回滚方案明确', operator: '系统管理员', changeType: 'add', changeTime: '2026-05-30 10:00:00', beforeChange: '-', afterChange: '新增规则：要求包含详细回滚步骤' },
  { id: 'RULE-CHG-003', ruleName: '测试方案完整', operator: '系统管理员', changeType: 'modify', changeTime: '2026-05-29 14:00:00', beforeChange: '测试覆盖率要求：70%', afterChange: '测试覆盖率要求：80%' },
];

export function PlanAuditAudit() {
  const [activeTab, setActiveTab] = useState<'logs' | 'rules'>('logs');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredLogs = mockAuditLogs.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.operationType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.targetPlan.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesSearch;
  });

  const filteredRules = mockRuleChanges.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.ruleName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesType = typeFilter === 'all' || item.changeType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getOperationTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      '提交审核': 'bg-blue-500/20 text-blue-400',
      '审核通过': 'bg-green-500/20 text-green-400',
      '驳回审核': 'bg-red-500/20 text-red-400',
      '重新提交': 'bg-yellow-500/20 text-yellow-400',
      '规则修改': 'bg-purple-500/20 text-purple-400',
    };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${colors[type] || 'bg-gray-500/20 text-gray-400'}`}>{type}</span>;
  };

  const getChangeTypeBadge = (type: string) => {
    if (type === 'add') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">新增</span>;
    if (type === 'modify') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">修改</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">删除</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业方案审核任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">审计日志记录、规则变更记录、日志查询</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'logs' ? 'bg-blue-600 text-white' : 'bg-[#1E2736] border border-[#2A354D] text-gray-300 hover:bg-[#2A354D]'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            审计日志
          </div>
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'rules' ? 'bg-blue-600 text-white' : 'bg-[#1E2736] border border-[#2A354D] text-gray-300 hover:bg-[#2A354D]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            规则变更
          </div>
        </button>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'logs' ? '搜索操作类型、操作人、方案名称...' : '搜索规则名称、操作人...'}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            {activeTab === 'rules' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="all">全部变更类型</option>
                  <option value="add">新增</option>
                  <option value="modify">修改</option>
                  <option value="delete">删除</option>
                </select>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出日志
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          {activeTab === 'logs' ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A354D]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作类型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作人</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标方案</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作详情</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP地址</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((item) => (
                  <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3">{getOperationTypeBadge(item.operationType)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{item.operator}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.targetPlan}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{item.operationTime}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.operationDetail}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A354D]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">规则名称</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更类型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作人</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更前</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更后</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((item) => (
                  <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white font-medium">{item.ruleName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getChangeTypeBadge(item.changeType)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.operator}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.changeTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.beforeChange}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.afterChange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {((activeTab === 'logs' && filteredLogs.length === 0) || (activeTab === 'rules' && filteredRules.length === 0)) && (
          <p className="text-gray-500 text-center py-8">暂无数据</p>
        )}
      </div>
    </div>
  );
}
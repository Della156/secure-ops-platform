'use client';

import React, { useState } from 'react';
import { Search, Filter, Clock, FileText, History, Settings, Download, Calendar } from 'lucide-react';

interface AuditLog {
  id: string;
  operator: string;
  action: string;
  target: string;
  time: string;
  ip: string;
  details: string;
  type: 'audit' | 'rule' | 'config';
}

interface RuleChange {
  id: string;
  ruleName: string;
  operator: string;
  changeType: 'create' | 'update' | 'delete';
  before: string;
  after: string;
  time: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: 'LOG-001', operator: '审核员A', action: '通过审核', target: 'AUD-2024-001 核心数据库备份', time: '2026-06-01 11:00:00', ip: '192.168.1.100', details: '审核通过，同意执行备份作业', type: 'audit' },
  { id: 'LOG-002', operator: '管理员', action: '修改规则', target: '风险权重配置', time: '2026-06-01 10:30:00', ip: '192.168.1.1', details: '将操作类型风险权重从25调整为30', type: 'rule' },
  { id: 'LOG-003', operator: '审核员B', action: '驳回审核', target: 'AUD-2024-003 网络配置调整', time: '2026-05-31 14:30:00', ip: '192.168.1.101', details: '缺少应急预案，驳回申请', type: 'audit' },
  { id: 'LOG-004', operator: '管理员', action: '创建规则', target: '超时告警规则', time: '2026-05-31 09:00:00', ip: '192.168.1.1', details: '新增30分钟超时自动告警规则', type: 'rule' },
  { id: 'LOG-005', operator: '审核员C', action: '通过审核', target: 'AUD-2024-004 安全策略更新', time: '2026-05-30 16:45:00', ip: '192.168.1.102', details: '安全团队已评审，同意执行', type: 'audit' },
];

const mockRuleChanges: RuleChange[] = [
  { id: 'CHANGE-001', ruleName: '风险权重配置', operator: '管理员', changeType: 'update', before: '操作类型权重: 25', after: '操作类型权重: 30', time: '2026-06-01 10:30:00' },
  { id: 'CHANGE-002', ruleName: '超时告警规则', operator: '管理员', changeType: 'create', before: '-', after: '新增30分钟超时自动告警', time: '2026-05-31 09:00:00' },
  { id: 'CHANGE-003', ruleName: '资质校验规则', operator: '管理员', changeType: 'update', before: '启用状态: 否', after: '启用状态: 是', time: '2026-05-30 14:00:00' },
];

export function JobAuditAudit() {
  const [activeTab, setActiveTab] = useState<'logs' | 'rules'>('logs');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchSearch = !searchKeyword ||
      log.operator.includes(searchKeyword) ||
      log.action.includes(searchKeyword) ||
      log.target.includes(searchKeyword);
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    return matchSearch && matchType;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'audit':
        return <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">审核操作</span>;
      case 'rule':
        return <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">规则变更</span>;
      case 'config':
        return <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">配置变更</span>;
      default:
        return type;
    }
  };

  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case 'create':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">新增</span>;
      case 'update':
        return <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">修改</span>;
      case 'delete':
        return <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">删除</span>;
      default:
        return type;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业审核任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">审计日志记录、规则变更记录、日志查询</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex bg-[#111827] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === 'logs'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4" />
                审计日志
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === 'rules'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                规则变更
              </span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#2A354D] hover:bg-[#253042] text-gray-300 rounded-lg transition-colors ml-auto">
            <Download className="w-4 h-4" />
            导出日志
          </button>
        </div>
      </div>

      {activeTab === 'logs' ? (
        <>
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索操作人、操作类型或目标..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部类型</option>
                  <option value="audit">审核操作</option>
                  <option value="rule">规则变更</option>
                  <option value="config">配置变更</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111827]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">日志编号</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作类型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作目标</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">IP地址</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#2A354D]/30">
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-400">{log.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-white">{log.operator}</span>
                    </td>
                    <td className="px-4 py-4">
                      {getTypeBadge(log.type)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">{log.target}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">{log.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-400">{log.ip}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-400">{log.details}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">变更编号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">规则名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">变更类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">变更前</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">变更后</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">变更时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {mockRuleChanges.map((change) => (
                <tr key={change.id} className="hover:bg-[#2A354D]/30">
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-400">{change.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white">{change.ruleName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-300">{change.operator}</span>
                  </td>
                  <td className="px-4 py-4">
                    {getChangeTypeBadge(change.changeType)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500">{change.before}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-green-400">{change.after}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{change.time}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

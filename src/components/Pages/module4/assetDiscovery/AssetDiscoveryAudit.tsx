'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, User, Calendar, Eye, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const auditLogs = [
  { id: 'AUD-001', operator: 'admin', operation: '创建任务', target: 'TASK-001', targetName: '全网资产扫描任务', time: '2026-06-03 08:00', ip: '192.168.1.100' },
  { id: 'AUD-002', operator: 'admin', operation: '启动任务', target: 'TASK-001', targetName: '全网资产扫描任务', time: '2026-06-03 08:00', ip: '192.168.1.100' },
  { id: 'AUD-003', operator: 'user1', operation: '查看任务', target: 'TASK-002', targetName: '办公区资产发现', time: '2026-06-03 06:30', ip: '192.168.1.101' },
  { id: 'AUD-004', operator: 'admin', operation: '创建任务', target: 'TASK-003', targetName: '云环境资产同步', time: '2026-06-03 10:00', ip: '192.168.1.100' },
  { id: 'AUD-005', operator: 'admin', operation: '删除任务', target: 'TASK-006', targetName: '旧扫描任务', time: '2026-06-02 16:00', ip: '192.168.1.100' },
  { id: 'AUD-006', operator: 'user2', operation: '导出报告', target: 'REPORT-001', targetName: '资产发现报告', time: '2026-06-02 15:30', ip: '192.168.1.102' },
];

const operationColors: Record<string, string> = {
  '创建任务': 'bg-green-500/20 text-green-400',
  '启动任务': 'bg-blue-500/20 text-blue-400',
  '查看任务': 'bg-gray-500/20 text-gray-400',
  '删除任务': 'bg-red-500/20 text-red-400',
  '导出报告': 'bg-yellow-500/20 text-yellow-400',
};

export function AssetDiscoveryAudit() {
  const [search, setSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredLogs = auditLogs.filter(log => {
    if (search && !log.targetName.includes(search) && !log.target.includes(search)) return false;
    if (operatorFilter && log.operator !== operatorFilter) return false;
    return true;
  });

  const operators = [...new Set(auditLogs.map(log => log.operator))];

  const handleExport = () => {
    alert('导出审计日志成功');
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产发现任务审计" description="审计资产发现任务操作记录"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="export" onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" /> 导出日志
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索目标名称或ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <select
              value={operatorFilter} onChange={e => setOperatorFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            >
              <option value="">全部操作员</option>
              {operators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            />
            <span className="text-slate-500">至</span>
            <input
              type="date"
              value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            查询
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">审计ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作员</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作类型</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">目标</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作IP</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{log.id}</td>
                  <td className="px-4 py-3 text-sm text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />{log.operator}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${operationColors[log.operation as keyof typeof operationColors] || 'bg-gray-500/20 text-gray-400'}`}>
                      {log.operation}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{log.targetName}</div>
                    <div className="text-xs text-slate-400 font-mono">{log.target}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />{log.time}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 font-mono">{log.ip}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                        <Eye className="w-3 h-3" />详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
          <div className="text-xs text-slate-500">显示 1-{filteredLogs.length} 条，共 {auditLogs.length} 条</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">1</button>
            <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDiscoveryAudit;
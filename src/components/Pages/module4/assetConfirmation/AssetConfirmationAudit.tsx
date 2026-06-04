'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, User, Calendar, Eye, Clock, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const auditLogs = [
  { id: 'AUD-001', operator: 'admin', operation: '创建确认任务', target: 'CONF-001', targetName: '2026年6月资产确认', time: '2026-06-03 08:00', ip: '192.168.1.100' },
  { id: 'AUD-002', operator: 'admin', operation: '确认资产', target: 'ASSET-001', targetName: 'web-server-01', time: '2026-06-03 08:05', ip: '192.168.1.100' },
  { id: 'AUD-003', operator: 'user1', operation: '确认资产', target: 'ASSET-002', targetName: 'db-server-01', time: '2026-06-03 08:10', ip: '192.168.1.101' },
  { id: 'AUD-004', operator: 'admin', operation: '添加标签', target: 'TAG-001', targetName: '生产', time: '2026-06-03 09:00', ip: '192.168.1.100' },
];

const operationColors: Record<string, string> = {
  '创建确认任务': 'bg-green-500/20 text-green-400',
  '确认资产': 'bg-blue-500/20 text-blue-400',
  '添加标签': 'bg-yellow-500/20 text-yellow-400',
};

export function AssetConfirmationAudit() {
  const [search, setSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (search && !log.targetName.includes(search) && !log.target.includes(search)) return false;
    if (operatorFilter && log.operator !== operatorFilter) return false;
    return true;
  });

  const operators = [...new Set(auditLogs.map(log => log.operator))];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产确认任务审计" description="审计资产确认任务操作记录"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
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
                    <span className={`text-xs px-2 py-1 rounded ${operationColors[log.operation] || 'bg-gray-500/20 text-gray-400'}`}>
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

export default AssetConfirmationAudit;
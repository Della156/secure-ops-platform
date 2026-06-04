'use client';

import React, { useState } from 'react';
import { Search, Calendar, Download } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const auditLogs = [
  { id: 'AUD-BR001', time: '2026-06-03 08:00:00', operator: 'system', action: '生成报告', target: 'BR-001', result: '成功' },
  { id: 'AUD-BR002', time: '2026-06-03 08:05:00', operator: 'system', action: '推送报告', target: 'BR-001 -> 安全运维组', result: '成功' },
  { id: 'AUD-BR003', time: '2026-06-03 09:00:00', operator: 'admin', action: '查看报告', target: 'BR-001', result: '成功' },
  { id: 'AUD-BR004', time: '2026-06-03 09:30:00', operator: 'admin', action: '导出报告', target: 'BR-001', result: '成功' },
  { id: 'AUD-BR005', time: '2026-06-03 10:00:00', operator: 'system', action: '生成报告', target: 'BR-002', result: '失败' },
  { id: 'AUD-BR006', time: '2026-06-03 10:05:00', operator: 'system', action: '重试生成', target: 'BR-002', result: '成功' },
  { id: 'AUD-BR007', time: '2026-06-03 11:00:00', operator: 'zhangsan', action: '配置工具', target: 'BT-001', result: '成功' },
  { id: 'AUD-BR008', time: '2026-06-03 11:30:00', operator: 'lisi', action: '手动调用', target: 'BT-002', result: '成功' },
];

const resultColors = {
  '成功': 'bg-green-500/20 text-green-400',
  '失败': 'bg-red-500/20 text-red-400',
};

export function BaselineReportAudit() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = auditLogs.filter(log => {
    if (search && !log.target.includes(search) && !log.operator.includes(search)) return false;
    if (dateFilter && !log.time.includes(dateFilter)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线防护报告任务审计" description="查看基线报告相关的操作审计日志"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" />导出日志
          </button>,
        ]}
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索操作对象或操作人..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#20293F] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#20293F] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">日志ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作类型</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作对象</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作结果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{log.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{log.time}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{log.operator}</td>
                  <td className="px-4 py-3 text-sm text-white">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{log.target}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${resultColors[log.result as keyof typeof resultColors]}`}>
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
          <div className="text-xs text-slate-500">显示 1-{filtered.length} 条，共 {auditLogs.length} 条</div>
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

export default BaselineReportAudit;
'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, User, Clock, FileText, CheckCircle2, XCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  target: string;
  result: 'success' | 'failed';
  ip: string;
}

const logs: AuditLog[] = [
  { id: 'AUD-001', timestamp: '2026-06-03 07:30:15', operator: '系统自动', action: '病毒查杀', target: '终端-0128', result: 'success', ip: '192.168.1.128' },
  { id: 'AUD-002', timestamp: '2026-06-03 09:15:30', operator: '系统自动', action: '主机隔离', target: '终端-0256', result: 'success', ip: '192.168.1.256' },
  { id: 'AUD-003', timestamp: '2026-06-03 09:30:00', operator: '系统自动', action: '病毒查杀', target: '服务器-045', result: 'success', ip: '192.168.1.45' },
  { id: 'AUD-004', timestamp: '2026-06-02 14:20:00', operator: '系统自动', action: '病毒清理', target: '终端-0101', result: 'success', ip: '192.168.1.101' },
  { id: 'AUD-005', timestamp: '2026-06-01 16:00:00', operator: '安全工程师', action: '系统修复', target: '文件服务器', result: 'failed', ip: '192.168.1.100' },
];

export function VirusAudit() {
  const [search, setSearch] = useState('');

  const filtered = logs.filter(log => {
    if (search && !log.action.includes(search) && !log.target.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">病毒处置任务审计</h2>
            <p className="text-xs text-slate-500 mt-1">完整记录所有病毒处置操作的审计日志</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出日志
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索操作/目标..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <h3 className="text-sm font-semibold text-white">审计日志 ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111625]">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">日志ID</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">时间</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作人</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">目标</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">结果</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">来源IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-xs text-blue-400 font-mono">{log.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{log.operator}</td>
                  <td className="px-4 py-3 text-xs text-white">{log.action}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{log.target}</td>
                  <td className="px-4 py-3">
                    {log.result === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="w-3 h-3" />成功</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" />失败</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VirusAudit;

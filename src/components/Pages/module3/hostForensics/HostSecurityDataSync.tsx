'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, Database, Clock, CheckCircle2, XCircle, PlayCircle } from 'lucide-react';

interface HostSync {
  id: string;
  hostName: string;
  status: 'synced' | 'syncing' | 'failed';
  lastSync: string;
  alertCount: number;
  fileChangeCount: number;
  processCount: number;
}

const hosts: HostSync[] = [
  { id: 'HOST-001', hostName: 'HOST-001', status: 'synced', lastSync: '2026-06-03 09:00:00', alertCount: 15, fileChangeCount: 23, processCount: 156 },
  { id: 'HOST-002', hostName: 'HOST-002', status: 'synced', lastSync: '2026-06-03 09:15:00', alertCount: 8, fileChangeCount: 12, processCount: 89 },
  { id: 'HOST-005', hostName: 'HOST-005', status: 'syncing', lastSync: '2026-06-03 10:00:00', alertCount: 0, fileChangeCount: 0, processCount: 0 },
  { id: 'HOST-008', hostName: 'HOST-008', status: 'synced', lastSync: '2026-06-03 08:30:00', alertCount: 22, fileChangeCount: 45, processCount: 234 },
  { id: 'HOST-012', hostName: 'HOST-012', status: 'failed', lastSync: '2026-06-03 07:00:00', alertCount: 0, fileChangeCount: 0, processCount: 0 },
];

const statusConfig = {
  synced: { label: '已同步', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  syncing: { label: '同步中', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <PlayCircle className="w-3 h-3" /> },
  failed: { label: '同步失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
};

export function HostSecurityDataSync() {
  const [search, setSearch] = useState('');

  const filtered = hosts.filter(host => {
    if (search && !host.hostName.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">主机安全数据同步</h3>
            <p className="text-xs text-slate-500 mt-1">同步主机安全数据（告警/文件变更/进程行为）</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            <RefreshCw className="w-3.5 h-3.5" />手动同步
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text" placeholder="搜索主机名称..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111625]">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">主机名称</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">同步状态</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">最后同步时间</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">告警数</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">文件变更数</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">进程数</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(host => {
                const sc = statusConfig[host.status as keyof typeof statusConfig];
                return (
                  <tr key={host.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-xs text-white flex items-center gap-2">
                      <Database className="w-3 h-3 text-blue-400" />{host.hostName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{host.lastSync}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{host.alertCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{host.fileChangeCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{host.processCount}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300">查看数据</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HostSecurityDataSync;

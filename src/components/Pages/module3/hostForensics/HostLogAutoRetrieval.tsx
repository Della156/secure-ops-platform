'use client';

import React, { useState } from 'react';
import { Search, Download, Clock, Database, FileText, Terminal } from 'lucide-react';

interface LogRetrieval {
  id: string;
  hostName: string;
  logType: 'system' | 'application' | 'security' | 'command';
  status: 'completed' | 'in_progress';
  size: string;
  retrieveTime: string;
}

const logRetrievals: LogRetrieval[] = [
  { id: 'LOG-H-001', hostName: 'HOST-001', logType: 'system', status: 'completed', size: '512 KB', retrieveTime: '2026-06-03 09:00:00' },
  { id: 'LOG-H-002', hostName: 'HOST-001', logType: 'application', status: 'completed', size: '256 KB', retrieveTime: '2026-06-03 09:05:00' },
  { id: 'LOG-H-003', hostName: 'HOST-001', logType: 'security', status: 'completed', size: '1.2 MB', retrieveTime: '2026-06-03 09:10:00' },
  { id: 'LOG-H-004', hostName: 'HOST-005', logType: 'command', status: 'in_progress', size: '768 KB', retrieveTime: '2026-06-03 10:00:00' },
  { id: 'LOG-H-005', hostName: 'HOST-008', logType: 'system', status: 'completed', size: '384 KB', retrieveTime: '2026-06-03 08:30:00' },
];

const logTypeConfig = {
  system: { label: '系统日志', icon: <Database className="w-3 h-3" /> },
  application: { label: '应用日志', icon: <FileText className="w-3 h-3" /> },
  security: { label: '安全日志', icon: <Terminal className="w-3 h-3" /> },
  command: { label: '命令历史', icon: <Terminal className="w-3 h-3" /> },
};

const statusConfig = {
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
  in_progress: { label: '调取中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
};

export function HostLogAutoRetrieval() {
  const [search, setSearch] = useState('');

  const filtered = logRetrievals.filter(item => {
    if (search && !item.hostName.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">主机日志信息自动调取</h3>
            <p className="text-xs text-slate-500 mt-1">自动调取主机日志信息进行取证分析</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Download className="w-3.5 h-3.5" />打包下载
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
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">任务ID</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">主机名称</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">日志类型</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">状态</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">日志大小</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">调取时间</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-xs text-blue-400 font-mono">{item.id}</td>
                  <td className="px-4 py-3 text-xs text-white">{item.hostName}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      {logTypeConfig[item.logType].icon}{logTypeConfig[item.logType].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusConfig[item.status].bg} ${statusConfig[item.status].color}`}>
                      {statusConfig[item.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">{item.size}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{item.retrieveTime}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-blue-400 hover:text-blue-300">查看日志</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HostLogAutoRetrieval;

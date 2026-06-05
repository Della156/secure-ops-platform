'use client';

import React, { useState } from 'react';
import { Search, Download, Clock, Database, FileText, Network } from 'lucide-react';

interface LogRetrieval {
  id: string;
  endpoint: string;
  logType: 'system' | 'application' | 'process' | 'network';
  status: 'completed' | 'in_progress' | 'failed';
  size: string;
  retrieveTime: string;
}

const logRetrievals: LogRetrieval[] = [
  { id: 'LOG-001', endpoint: 'PC-WIN-001', logType: 'system', status: 'completed', size: '256 KB', retrieveTime: '2026-06-03 09:30:00' },
  { id: 'LOG-002', endpoint: 'PC-WIN-001', logType: 'application', status: 'completed', size: '512 KB', retrieveTime: '2026-06-03 09:31:00' },
  { id: 'LOG-003', endpoint: 'PC-WIN-001', logType: 'process', status: 'completed', size: '128 KB', retrieveTime: '2026-06-03 09:32:00' },
  { id: 'LOG-004', endpoint: 'PC-WIN-005', logType: 'network', status: 'in_progress', size: '1.2 MB', retrieveTime: '2026-06-03 10:15:00' },
  { id: 'LOG-005', endpoint: 'PC-LINUX-003', logType: 'system', status: 'completed', size: '768 KB', retrieveTime: '2026-06-03 08:00:00' },
];

const logTypeConfig = {
  system: { label: '系统日志', icon: <Database className="w-3 h-3" /> },
  application: { label: '应用日志', icon: <FileText className="w-3 h-3" /> },
  process: { label: '进程列表', icon: <Clock className="w-3 h-3" /> },
  network: { label: '网络连接', icon: <Network className="w-3 h-3" /> },
};

const statusConfig = {
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
  in_progress: { label: '调取中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
};

export function EndpointLogAutoRetrieval() {
  const [search, setSearch] = useState('');

  const filtered = logRetrievals.filter(item => {
    if (search && !item.endpoint.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">终端日志信息自动调取</h3>
            <p className="text-xs text-slate-500 mt-1">自动调取终端日志信息进行取证分析</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Download className="w-3.5 h-3.5" />打包下载
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text" placeholder="搜索终端名称..."
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
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">终端名称</th>
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
                  <td className="px-4 py-3 text-xs text-white">{item.endpoint}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      {logTypeConfig[item.logType as keyof typeof logTypeConfig].icon}{logTypeConfig[item.logType as keyof typeof logTypeConfig].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusConfig[item.status as keyof typeof statusConfig].bg} ${statusConfig[item.status as keyof typeof statusConfig].color}`}>
                      {statusConfig[item.status as keyof typeof statusConfig].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">{item.size}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{item.retrieveTime}</td>
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

export default EndpointLogAutoRetrieval;

'use client';

import React, { useState } from 'react';
import { Search, FileText, Filter, Calendar, Download } from 'lucide-react';

interface LogRecord {
  id: string;
  source: string;
  level: string;
  message: string;
  timestamp: string;
  host: string;
}

const mockData: LogRecord[] = [
  { id: 'LOG-001', source: '安全设备日志', level: 'ERROR', message: '防火墙规则匹配失败', timestamp: '2026-06-02 10:30:15', host: 'fw-01' },
  { id: 'LOG-002', source: '操作系统日志', level: 'WARN', message: '磁盘空间使用率超过80%', timestamp: '2026-06-02 10:28:30', host: 'server-01' },
  { id: 'LOG-003', source: '应用日志', level: 'INFO', message: '用户登录成功', timestamp: '2026-06-02 10:25:00', host: 'app-01' },
  { id: 'LOG-004', source: '网络流量日志', level: 'CRITICAL', message: '检测到异常流量模式', timestamp: '2026-06-02 10:20:45', host: 'lb-01' },
  { id: 'LOG-005', source: '数据库日志', level: 'ERROR', message: '连接超时', timestamp: '2026-06-02 10:18:00', host: 'db-01' },
];

export function LogRetrieval() {
  const [data] = useState<LogRecord[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.message.toLowerCase().includes(searchKeyword.toLowerCase()) || d.source.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchLevel = levelFilter === 'all' || d.level === levelFilter;
    return matchKeyword && matchLevel;
  });

  const getLevelColor = (level: string) => {
    if (level === 'CRITICAL') return 'text-red-400';
    if (level === 'ERROR') return 'text-orange-400';
    if (level === 'WARN') return 'text-yellow-400';
    return 'text-green-400';
  };

  const getLevelBadge = (level: string) => {
    if (level === 'CRITICAL') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
    if (level === 'ERROR') return <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400">错误</span>;
    if (level === 'WARN') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">信息</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志数据检索</h2>
        <p className="text-sm text-gray-400 mt-1">检索和查询日志数据</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索日志内容..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部级别</option>
                <option value="CRITICAL">严重</option>
                <option value="ERROR">错误</option>
                <option value="WARN">警告</option>
                <option value="INFO">信息</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出日志
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">来源</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">级别</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">消息</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">主机</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.source}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getLevelBadge(item.level)}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.message}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.host}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
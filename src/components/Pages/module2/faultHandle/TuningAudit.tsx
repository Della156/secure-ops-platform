'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

interface AuditItem {
  id: string;
  action: string;
  target: string;
  operator: string;
  time: string;
  result: 'success' | 'failed';
  params: { name: string; oldValue: string; newValue: string }[];
}

const mockData: AuditItem[] = [
  {
    id: 'AUD-001',
    action: '内存调优',
    target: 'prod-app-01',
    operator: 'admin',
    time: '2026-06-02 10:00:00',
    result: 'success',
    params: [
      { name: 'heap-size', oldValue: '2G', newValue: '4G' },
      { name: 'max-threads', oldValue: '100', newValue: '200' },
    ],
  },
  {
    id: 'AUD-002',
    action: '连接池优化',
    target: 'prod-db',
    operator: 'ops',
    time: '2026-06-02 09:00:00',
    result: 'success',
    params: [
      { name: 'max-connections', oldValue: '100', newValue: '200' },
      { name: 'timeout', oldValue: '30s', newValue: '60s' },
    ],
  },
  {
    id: 'AUD-003',
    action: '缓存配置调整',
    target: 'redis-cluster',
    operator: 'admin',
    time: '2026-06-02 08:30:00',
    result: 'failed',
    params: [
      { name: 'max-memory', oldValue: '4G', newValue: '8G' },
    ],
  },
];

export function TuningAudit() {
  const [data] = useState(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredData = data.filter(item => {
    const matchSearch = !searchKeyword || 
      item.action.includes(searchKeyword) || 
      item.target.includes(searchKeyword) || 
      item.operator.includes(searchKeyword);
    const matchDate = !dateFilter || item.time.startsWith(dateFilter);
    return matchSearch && matchDate;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统配置调优操作审计</h2>
        <p className="text-sm text-gray-400 mt-1">调优操作的详细日志记录（操作人、时间、对象、变更前后值），日志查询与导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索操作、目标或操作人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标对象</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">参数变更</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400">
                    {item.action}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{item.target}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{item.operator}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{item.time}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {item.result === 'success' 
                    ? <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />成功</span>
                    : <span className="flex items-center gap-1 text-red-400 text-sm"><XCircle className="w-4 h-4" />失败</span>}
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {item.params.map((param, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="text-gray-400">{param.name}:</span>
                        <span className="text-red-400 ml-1 line-through">{param.oldValue}</span>
                        <span className="text-green-400 ml-1">{param.newValue}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && <div className="text-center py-8 text-gray-500">暂无数据</div>}
      </div>
    </div>
  );
}
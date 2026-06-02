'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, CheckCircle, AlertTriangle, Filter, Eye, ChevronDown } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  target: string;
  type: string;
  result: 'success' | 'failed';
  diagTime: string;
  duration: string;
  reportUrl: string;
  assignee: string;
}

const mockHistory: HistoryItem[] = [
  { id: 'PERF-HIST-001', title: 'CPU性能分析', target: 'SRV-01', type: 'CPU分析', result: 'success', diagTime: '2026-06-01 14:30:00', duration: '00:08:30', reportUrl: '#', assignee: '张三' },
  { id: 'PERF-HIST-002', title: '内存泄漏检测', target: 'APP-02', type: '内存分析', result: 'failed', diagTime: '2026-06-01 10:15:00', duration: '00:12:00', reportUrl: '#', assignee: '李四' },
  { id: 'PERF-HIST-003', title: '数据库慢查询分析', target: 'DB-01', type: '数据库分析', result: 'success', diagTime: '2026-05-31 16:45:00', duration: '00:06:30', reportUrl: '#', assignee: '王五' },
  { id: 'PERF-HIST-004', title: '网络带宽测试', target: 'SW-01', type: '网络测试', result: 'success', diagTime: '2026-05-30 09:20:00', duration: '00:03:15', reportUrl: '#', assignee: '赵六' },
  { id: 'PERF-HIST-005', title: '磁盘IO监控', target: 'STOR-01', type: '存储分析', result: 'success', diagTime: '2026-05-29 15:10:00', duration: '00:05:45', reportUrl: '#', assignee: '钱七' },
];

export function PerfDiagHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.title.includes(searchKeyword) || 
      item.id.includes(searchKeyword) ||
      item.target.includes(searchKeyword);
    const matchesStatus = statusFilter === 'all' || item.result === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueTypes = [...new Set(history.map(item => item.type))];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">性能诊断任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史记录查询、详情查看、报告下载</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索任务名称、ID或目标..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部类型</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">至</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                <div className="flex items-center gap-1">
                  任务ID
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">耗时</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">负责人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400">{item.id}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{item.title}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.type}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{item.target}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{item.diagTime}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{item.duration}</td>
                <td className="px-4 py-4 text-sm text-gray-300">{item.assignee}</td>
                <td className="px-4 py-4">
                  {item.result === 'success' ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      成功
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      失败
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      查看
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      报告
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-400">
          共 {filteredHistory.length} 条记录
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
            上一页
          </button>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  target: string;
  result: 'success' | 'failed';
  diagTime: string;
  reportUrl: string;
}

const mockHistory: HistoryItem[] = [
  { id: 'DIAG-HIST-001', title: '链路异常排查', target: '北京-上海链路', result: 'success', diagTime: '2026-06-01 10:30:00', reportUrl: '#' },
  { id: 'DIAG-HIST-002', title: '设备故障分析', target: '交换机SW-01', result: 'failed', diagTime: '2026-05-31 14:15:00', reportUrl: '#' },
];

export function NetDiagHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredHistory = history.filter(item => 
    !searchKeyword || item.title.includes(searchKeyword) || item.id.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">网络故障诊断任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史诊断任务记录查询，诊断详情查看，诊断报告下载</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索任务标题或ID..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出记录
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断目标</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断时间</th>
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
                <td className="px-4 py-4 text-sm text-gray-300">{item.target}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{item.diagTime}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {item.result === 'success' ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />成功
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />失败
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                    下载报告
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
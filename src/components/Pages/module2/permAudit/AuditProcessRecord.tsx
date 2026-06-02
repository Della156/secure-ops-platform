'use client';

import React, { useState } from 'react';
import { Search, FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProcessItem {
  id: string;
  scanItem: string;
  status: 'success' | 'failed';
  duration: number;
  detail?: string;
}

const mockProcess: ProcessItem[] = [
  { id: 'P-001', scanItem: '账号信息采集', status: 'success', duration: 5 },
  { id: 'P-002', scanItem: '权限关系分析', status: 'success', duration: 12 },
  { id: 'P-003', scanItem: '僵尸账号检测', status: 'success', duration: 8 },
  { id: 'P-004', scanItem: '权限滥用检测', status: 'failed', duration: 25, detail: '超时异常' },
  { id: 'P-005', scanItem: '特权账号审计', status: 'success', duration: 15 },
];

export function AuditProcessRecord() {
  const [process] = useState(mockProcess);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredProcess = process.filter(item => 
    !searchKeyword || item.scanItem.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">审计过程记录</h2>
        <p className="text-sm text-gray-400 mt-1">审计扫描过程的详细记录（扫描项、耗时、发现的问题），审计日志查询</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索扫描项..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">扫描项</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">耗时</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredProcess.map((item) => (
              <tr key={item.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{item.scanItem}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {item.status === 'success' ? (
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
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{item.duration}秒</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{item.detail || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
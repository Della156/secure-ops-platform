'use client';

import React, { useState } from 'react';
import { Search, Calendar, Shield, FileText } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  certType: string;
  certNumber: string;
  status: 'issued' | 'revoked';
  createTime: string;
  operation: string;
}

const mockHistory: HistoryItem[] = [
  { id: 'PKI-HIST-001', title: '颁发SSL证书', certType: 'SSL证书', certNumber: 'CERT-2026-001', status: 'issued', createTime: '2026-06-01 09:00:00', operation: '证书发放' },
  { id: 'PKI-HIST-002', title: '员工入职证书配置', certType: '客户端证书', certNumber: 'CERT-2026-002', status: 'issued', createTime: '2026-05-31 14:30:00', operation: '证书发放' },
];

export function PkiHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredHistory = history.filter(item => 
    !searchKeyword || item.title.includes(searchKeyword) || item.certNumber.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">PKI工单任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史工单任务记录查询，证书发放/清除记录查询</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索工单标题或证书编号..."
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">工单ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">证书类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">证书编号</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间</th>
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
                  <span className="flex items-center gap-1 text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-blue-400" />
                    {item.certType}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-blue-400">{item.certNumber}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.operation}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.status === 'issued' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.status === 'issued' ? '已发放' : '已吊销'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{item.createTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
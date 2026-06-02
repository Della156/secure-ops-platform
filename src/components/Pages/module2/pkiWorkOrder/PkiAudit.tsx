'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Shield, CheckCircle, XCircle } from 'lucide-react';

interface AuditItem {
  id: string;
  operator: string;
  action: string;
  certNumber: string;
  certType: string;
  userName: string;
  time: string;
  result: 'success' | 'failed';
}

const mockAudit: AuditItem[] = [
  { id: 'AUD-PKI-001', operator: '张三', action: '颁发证书', certNumber: 'CERT-2026-001', certType: 'SSL证书', userName: '系统用户', time: '2026-06-02 09:30:00', result: 'success' },
  { id: 'AUD-PKI-002', operator: '李四', action: '吊销证书', certNumber: 'CERT-2026-002', certType: '客户端证书', userName: '王五', time: '2026-06-01 14:15:00', result: 'success' },
];

export function PkiAudit() {
  const [audit] = useState(mockAudit);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredAudit = audit.filter(item => 
    !searchKeyword || item.operator.includes(searchKeyword) || item.certNumber.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">PKI工单任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">工单处理操作的审计日志记录，操作人、时间、证书信息查询</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索操作人或证书编号..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">证书编号</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">证书类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">用户</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredAudit.map((item) => (
              <tr key={item.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{item.operator}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.action}</span>
                </td>
                <td className="px-4 py-4 text-sm text-blue-400">{item.certNumber}</td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-1 text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-blue-400" />
                    {item.certType}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{item.userName}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{item.time}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {item.result === 'success' ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />成功
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <XCircle className="w-4 h-4" />失败
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
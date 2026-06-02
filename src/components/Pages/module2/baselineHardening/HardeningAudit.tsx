'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Shield, Settings, CheckCircle, XCircle } from 'lucide-react';

interface AuditItem {
  id: string;
  operator: string;
  target: string;
  strategy: string;
  action: string;
  time: string;
  result: 'success' | 'failed';
}

const mockAudit: AuditItem[] = [
  { id: 'AUD-001', operator: 'admin', target: 'prod-server-01', strategy: '标准加固策略', action: '执行加固', time: '2026-06-02 10:00:00', result: 'success' },
  { id: 'AUD-002', operator: 'admin', target: 'prod-db', strategy: '数据库加固策略', action: '执行加固', time: '2026-06-02 09:30:00', result: 'success' },
  { id: 'AUD-003', operator: 'ops', target: 'fw-01', strategy: '网络设备策略', action: '执行加固', time: '2026-06-02 09:00:00', result: 'failed' },
];

export function HardeningAudit() {
  const [audit] = useState(mockAudit);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredAudit = audit.filter(item => 
    !searchKeyword || item.operator.includes(searchKeyword) || item.target.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全基线加固审计</h2>
        <p className="text-sm text-gray-400 mt-1">加固操作的详细审计日志记录（操作人、时间、对象、策略），日志查询与导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索操作人或目标..."
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标对象</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">加固策略</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
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
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{item.target}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{item.strategy}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.action}</span>
                </td>
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
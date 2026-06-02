'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Phone, CheckCircle, TrendingUp } from 'lucide-react';

interface AuditItem {
  id: string;
  operator: string;
  action: string;
  customer: string;
  taskId: string;
  time: string;
  qualityScore: number;
}

const mockAudit: AuditItem[] = [
  { id: 'AUD-HD-001', operator: '张三', action: '处理工单', customer: '用户A', taskId: 'HD-001', time: '2026-06-02 10:30:00', qualityScore: 95 },
  { id: 'AUD-HD-002', operator: '李四', action: '审批权限', customer: '用户B', taskId: 'HD-002', time: '2026-06-02 09:15:00', qualityScore: 88 },
];

export function HelpdeskAudit() {
  const [audit] = useState(mockAudit);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredAudit = audit.filter(item => 
    !searchKeyword || item.operator.includes(searchKeyword) || item.customer.includes(searchKeyword)
  );

  const avgQualityScore = Math.round(audit.reduce((sum, item) => sum + item.qualityScore, 0) / audit.length);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全客服审计</h2>
        <p className="text-sm text-gray-400 mt-1">客服操作日志记录，服务质量分析，审计报告导出</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">处理工单</p>
              <p className="text-xl font-semibold text-white">{audit.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">平均服务质量</p>
              <p className="text-xl font-semibold text-green-400">{avgQualityScore}%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">服务达标率</p>
              <p className="text-xl font-semibold text-blue-400">100%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索操作人或客户..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出审计报告
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">客户</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">工单ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">服务质量</th>
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
                <td className="px-4 py-4 text-sm text-gray-300">{item.customer}</td>
                <td className="px-4 py-4 text-sm text-blue-400">{item.taskId}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{item.time}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm ${item.qualityScore >= 90 ? 'text-green-400' : item.qualityScore >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.qualityScore}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
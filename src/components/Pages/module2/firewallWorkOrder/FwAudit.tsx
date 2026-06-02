'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, FileText, CheckCircle, XCircle } from 'lucide-react';

interface AuditItem {
  id: string;
  operator: string;
  action: string;
  taskId: string;
  taskTitle: string;
  changeType: string;
  time: string;
  result: 'success' | 'failed';
}

const mockAudit: AuditItem[] = [
  { id: 'AUD-FW-001', operator: '张三', action: '执行策略新增', taskId: 'FW-001', taskTitle: '新增DMZ访问策略', changeType: '策略新增', time: '2026-06-02 09:30:00', result: 'success' },
  { id: 'AUD-FW-002', operator: '李四', action: '执行策略删除', taskId: 'FW-002', taskTitle: '删除过期策略', changeType: '策略删除', time: '2026-06-01 14:15:00', result: 'success' },
];

export function FwAudit() {
  const [audit] = useState(mockAudit);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredAudit = audit.filter(item => 
    !searchKeyword || item.operator.includes(searchKeyword) || item.taskTitle.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略工单任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">工单处理操作及策略变更的审计日志记录，日志查询与导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索操作人或工单标题..."
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">变更类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">工单</th>
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
                <td className="px-4 py-4 text-sm text-gray-300">{item.changeType}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{item.taskTitle}</span>
                    <span className="text-xs text-blue-400">{item.taskId}</span>
                  </div>
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
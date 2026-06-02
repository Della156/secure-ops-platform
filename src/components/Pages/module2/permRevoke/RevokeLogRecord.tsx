'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Shield, CheckCircle, XCircle } from 'lucide-react';

interface LogItem {
  id: string;
  operator: string;
  targetUser: string;
  targetPerm: string;
  action: string;
  time: string;
  result: 'success' | 'failed';
  detail: string;
}

const mockLogs: LogItem[] = [
  { id: 'LOG-001', operator: 'admin', targetUser: 'user-001', targetPerm: 'admin', action: '回收权限', time: '2026-06-02 10:00:00', result: 'success', detail: '权限回收成功' },
  { id: 'LOG-002', operator: 'admin', targetUser: 'user-002', targetPerm: 'write', action: '回收权限', time: '2026-06-02 09:30:00', result: 'success', detail: '权限回收成功' },
  { id: 'LOG-003', operator: 'admin', targetUser: 'user-003', targetPerm: 'read', action: '回收权限', time: '2026-06-02 09:00:00', result: 'failed', detail: '用户不存在' },
];

export function RevokeLogRecord() {
  const [logs] = useState(mockLogs);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredLogs = logs.filter(item => 
    !searchKeyword || item.operator.includes(searchKeyword) || item.targetUser.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">回收操作日志记录</h2>
        <p className="text-sm text-gray-400 mt-1">回收操作的详细日志记录（操作人、时间、对象、权限），日志查询与导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索操作人或目标用户..."
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标用户</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">回收权限</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{log.operator}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{log.targetUser}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{log.targetPerm}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">{log.action}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{log.time}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {log.result === 'success' ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />成功
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <XCircle className="w-4 h-4" />失败
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
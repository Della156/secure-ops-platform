'use client';

import React, { useState } from 'react';
import { Search, Download, Filter, Calendar, User, Eye, ArrowRight } from 'lucide-react';

interface AuditLog {
  id: string;
  time: string;
  operator: string;
  action: string;
  target: string;
  result: 'success' | 'failed';
  detail: string;
}

export function SyncLogAudit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');

  const auditLogs: AuditLog[] = [
    { id: 'AL-001', time: '2026-06-04 10:35:23', operator: 'admin', action: '创建同步任务', target: '用户数据同步', result: 'success', detail: '创建了新的增量同步任务，数据源: MySQL主库，目标: Elasticsearch' },
    { id: 'AL-002', time: '2026-06-04 10:30:15', operator: 'admin', action: '执行同步', target: '告警数据同步', result: 'success', detail: '手动触发告警数据同步，成功同步 2341 条记录' },
    { id: 'AL-003', time: '2026-06-04 10:15:45', operator: 'user01', action: '修改策略', target: '每小时增量同步', result: 'success', detail: '将同步周期从每30分钟修改为每小时' },
    { id: 'AL-004', time: '2026-06-04 10:05:32', operator: 'user02', action: '停用任务', target: '日志数据同步', result: 'success', detail: '停用日志数据同步任务' },
    { id: 'AL-005', time: '2026-06-04 09:45:18', operator: 'admin', action: '执行同步', target: '威胁情报同步', result: 'failed', detail: '同步失败，网络超时，请检查网络连接' },
    { id: 'AL-006', time: '2026-06-04 09:30:00', operator: 'admin', action: '创建策略', target: '每日全量同步', result: 'success', detail: '创建每日全量同步策略，执行时间: 02:00' },
    { id: 'AL-007', time: '2026-06-04 08:15:22', operator: 'user01', action: '查看日志', target: '资产数据同步', result: 'success', detail: '查看资产数据同步执行日志' },
    { id: 'AL-008', time: '2026-06-04 02:00:00', operator: 'system', action: '自动执行', target: '每日全量同步', result: 'success', detail: '自动执行每日全量同步，成功同步 2847 条记录' },
  ];

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const operators = ['admin', 'user01', 'user02', 'system'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">同步日志审计</h2>
          <p className="text-sm text-gray-400 mt-1">记录并查询同步任务的执行日志，支持审计追溯</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Download className="w-4 h-4" />
          导出报表
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索操作或目标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">全部操作人</option>
              {operators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-2 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作人</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">目标对象</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">结果</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">详情</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3 text-sm text-gray-300">{log.time}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{log.operator}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{log.action}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{log.target}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {log.result === 'success' ? '成功' : '失败'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 max-w-[300px] truncate">{log.detail}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredLogs.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">8</div>
          <div className="text-xs text-gray-500 mt-1">今日操作次数</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">7</div>
          <div className="text-xs text-gray-500 mt-1">成功操作</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">1</div>
          <div className="text-xs text-gray-500 mt-1">失败操作</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">3</div>
          <div className="text-xs text-gray-500 mt-1">操作人数</div>
        </div>
      </div>
    </div>
  );
}

export default SyncLogAudit;
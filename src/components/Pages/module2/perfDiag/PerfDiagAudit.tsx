'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Server, CheckCircle, XCircle, Filter, Eye } from 'lucide-react';

interface AuditItem {
  id: string;
  operator: string;
  action: string;
  target: string;
  taskId: string;
  time: string;
  result: 'success' | 'failed';
  ip: string;
  details: string;
}

const mockAudit: AuditItem[] = [
  { id: 'AUD-PERF-001', operator: '张三', action: '启动诊断任务', target: 'SRV-01', taskId: 'PERF-001', time: '2026-06-02 10:30:00', result: 'success', ip: '192.168.1.101', details: '启动CPU性能分析任务' },
  { id: 'AUD-PERF-002', operator: '李四', action: '下载报告', target: 'APP-02', taskId: 'PERF-002', time: '2026-06-02 10:15:00', result: 'success', ip: '192.168.1.102', details: '下载内存泄漏检测报告' },
  { id: 'AUD-PERF-003', operator: '王五', action: '查看详情', target: 'DB-01', taskId: 'PERF-003', time: '2026-06-02 09:45:00', result: 'success', ip: '192.168.1.103', details: '查看数据库慢查询分析结果' },
  { id: 'AUD-PERF-004', operator: '赵六', action: '暂停任务', target: 'SW-01', taskId: 'PERF-004', time: '2026-06-02 09:20:00', result: 'success', ip: '192.168.1.104', details: '暂停网络带宽测试任务' },
  { id: 'AUD-PERF-005', operator: '钱七', action: '重试任务', target: 'STOR-01', taskId: 'PERF-005', time: '2026-06-02 08:30:00', result: 'failed', ip: '192.168.1.105', details: '重试磁盘IO监控任务失败' },
  { id: 'AUD-PERF-006', operator: '张三', action: '导出数据', target: '全部', taskId: '-', time: '2026-06-02 08:00:00', result: 'success', ip: '192.168.1.101', details: '导出性能诊断任务统计数据' },
];

export function PerfDiagAudit() {
  const [audit] = useState(mockAudit);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');

  const filteredAudit = audit.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.operator.includes(searchKeyword) || 
      item.taskId.includes(searchKeyword) ||
      item.action.includes(searchKeyword) ||
      item.target.includes(searchKeyword);
    const matchesResult = resultFilter === 'all' || item.result === resultFilter;
    const matchesOperator = operatorFilter === 'all' || item.operator === operatorFilter;
    return matchesSearch && matchesResult && matchesOperator;
  });

  const uniqueOperators = [...new Set(audit.map(item => item.operator))];

  const stats = {
    total: audit.length,
    success: audit.filter(a => a.result === 'success').length,
    failed: audit.filter(a => a.result === 'failed').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">性能诊断任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">日志记录、执行审计</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">总操作</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">成功</p>
          <p className="text-xl font-semibold text-green-400">{stats.success}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">失败</p>
          <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索操作人、任务ID、操作或目标..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部结果</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <select
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部操作人</option>
              {uniqueOperators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审计ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">IP地址</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredAudit.map((item) => (
              <tr key={item.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4 text-sm text-blue-400">{item.id}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{item.operator}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{item.ip}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.action}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Server className="w-4 h-4 text-blue-400" />
                    {item.target}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-blue-400">{item.taskId}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{item.time}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {item.result === 'success' ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      成功
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <XCircle className="w-4 h-4" />
                      失败
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-400">
          共 {filteredAudit.length} 条记录
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
            上一页
          </button>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}

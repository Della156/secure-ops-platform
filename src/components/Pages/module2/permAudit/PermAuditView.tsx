'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface AuditTask {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'failed' | 'running';
  auditTime: string;
  issues: number;
}

const mockTasks: AuditTask[] = [
  { id: 'AUDIT-001', name: '定期权限审计', type: '定期审计', status: 'completed', auditTime: '2026-06-02 10:00:00', issues: 5 },
  { id: 'AUDIT-002', name: '僵尸账号检测', type: '专项审计', status: 'completed', auditTime: '2026-06-02 09:00:00', issues: 12 },
  { id: 'AUDIT-003', name: '权限滥用检测', type: '专项审计', status: 'running', auditTime: '2026-06-02 08:30:00', issues: 0 },
  { id: 'AUDIT-004', name: '特权账号审计', type: '专项审计', status: 'failed', auditTime: '2026-06-02 08:00:00', issues: 0 },
];

export function PermAuditView() {
  const [tasks] = useState(mockTasks);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchSearch = !searchKeyword || task.name.includes(searchKeyword) || task.type.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    running: tasks.filter(t => t.status === 'running').length,
    totalIssues: tasks.reduce((sum, t) => sum + t.issues, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">权限审计视图</h2>
        <p className="text-sm text-gray-400 mt-1">审计任务列表展示、审计过程展示、审计结果展示、条件查询、数据导出、数据统计</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">任务总数</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">已完成</p>
          <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">失败</p>
          <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">发现问题</p>
          <p className="text-xl font-semibold text-yellow-400">{stats.totalIssues}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称或类型..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
                <option value="running">执行中</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审计类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审计时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">发现问题</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{task.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{task.type}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{task.auditTime}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {task.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />已完成
                    </span>
                  ) : task.status === 'failed' ? (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <XCircle className="w-4 h-4" />失败
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-400 text-sm">
                      <Clock className="w-4 h-4 animate-spin" />执行中
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm font-medium ${task.issues > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {task.issues} 个
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
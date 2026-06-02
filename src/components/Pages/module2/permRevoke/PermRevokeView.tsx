'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, CheckCircle, XCircle, Clock, User } from 'lucide-react';

interface RevokeTask {
  id: string;
  name: string;
  targetUser: string;
  targetPerm: string;
  status: 'completed' | 'failed' | 'pending';
  revokeTime: string;
  result?: string;
}

const mockTasks: RevokeTask[] = [
  { id: 'REVOKE-001', name: '权限回收任务', targetUser: 'user-001', targetPerm: 'admin', status: 'completed', revokeTime: '2026-06-02 10:00:00', result: '回收成功' },
  { id: 'REVOKE-002', name: '权限回收任务', targetUser: 'user-002', targetPerm: 'write', status: 'completed', revokeTime: '2026-06-02 09:30:00', result: '回收成功' },
  { id: 'REVOKE-003', name: '权限回收任务', targetUser: 'user-003', targetPerm: 'read', status: 'failed', revokeTime: '2026-06-02 09:00:00', result: '回收失败：用户不存在' },
  { id: 'REVOKE-004', name: '权限回收任务', targetUser: 'user-004', targetPerm: 'admin', status: 'pending', revokeTime: '2026-06-02 08:30:00' },
];

export function PermRevokeView() {
  const [tasks] = useState(mockTasks);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchSearch = !searchKeyword || task.targetUser.includes(searchKeyword) || task.targetPerm.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">权限回收任务视图</h2>
        <p className="text-sm text-gray-400 mt-1">权限回收任务列表展示、回收过程展示、回收结果展示、条件查询、数据导出、数据统计</p>
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
          <p className="text-gray-400 text-xs">待执行</p>
          <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户或权限..."
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
                <option value="pending">待执行</option>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标用户</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">回收权限</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">回收时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4 text-sm text-gray-300">{task.name}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{task.targetUser}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{task.targetPerm}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{task.revokeTime}</span>
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
                    <span className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Clock className="w-4 h-4" />待执行
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{task.result || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
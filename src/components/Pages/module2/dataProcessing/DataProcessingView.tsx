'use client';

import React, { useState } from 'react';
import { Search, Download, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Filter } from 'lucide-react';

interface TaskItem {
  id: string;
  taskName: string;
  type: string;
  status: 'success' | 'failed' | 'in-progress' | 'pending';
  startTime: string;
  endTime: string;
  executor: string;
  description: string;
}

const mockData: TaskItem[] = [
  { id: 'DP-001', taskName: '用户数据同步', type: '数据同步', status: 'success', startTime: '2026-06-02 08:00:00', endTime: '2026-06-02 08:05:32', executor: 'system', description: '同步用户信息到主数据库' },
  { id: 'DP-002', taskName: '日志数据清洗', type: '数据清洗', status: 'success', startTime: '2026-06-02 09:00:00', endTime: '2026-06-02 09:15:45', executor: 'system', description: '清洗无效日志记录' },
  { id: 'DP-003', taskName: '备份数据校验', type: '数据校验', status: 'in-progress', startTime: '2026-06-02 10:00:00', endTime: '-', executor: 'admin', description: '校验备份数据完整性' },
  { id: 'DP-004', taskName: '配置数据更新', type: '数据变更', status: 'failed', startTime: '2026-06-02 11:00:00', endTime: '2026-06-02 11:02:18', executor: 'admin', description: '更新系统配置参数' },
  { id: 'DP-005', taskName: '归档数据迁移', type: '数据迁移', status: 'pending', startTime: '-', endTime: '-', executor: 'system', description: '迁移历史归档数据' },
];

export function DataProcessingView() {
  const [data] = useState<TaskItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.type.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    failed: data.filter(d => d.status === 'failed').length,
    inProgress: data.filter(d => d.status === 'in-progress').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />成功</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />失败</span>;
    if (status === 'in-progress') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />处理中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400"><Clock className="w-3 h-3 inline mr-1" />待执行</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统数据处理视图</h2>
        <p className="text-sm text-gray-400 mt-1">数据处理任务列表展示、处理过程展示、处理结果展示、条件查询、数据导出</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">处理中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.inProgress}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称或类型..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="success">成功</option>
                <option value="failed">失败</option>
                <option value="in-progress">处理中</option>
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

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">开始时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">结束时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">执行人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white font-medium">{item.taskName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.type}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.startTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.endTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.executor}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
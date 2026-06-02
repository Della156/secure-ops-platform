'use client';

import React, { useState } from 'react';
import { Search, Download, Clock, CheckCircle, XCircle, AlertTriangle, Filter, RefreshCw, Database } from 'lucide-react';

interface TaskItem {
  id: string;
  taskName: string;
  source: string;
  target: string;
  backupTime: string;
  status: 'success' | 'failed' | 'in-progress' | 'pending';
  startTime: string;
  endTime: string;
  result: string;
}

const mockData: TaskItem[] = [
  { id: 'RS-001', taskName: '数据库恢复', source: 'prod-db_20260602', target: 'prod-db', backupTime: '2026-06-02 02:00:00', status: 'success', startTime: '2026-06-02 10:00:00', endTime: '2026-06-02 10:30:00', result: '恢复成功' },
  { id: 'RS-002', taskName: '日志恢复', source: 'log-server_20260602', target: 'log-server', backupTime: '2026-06-02 03:00:00', status: 'success', startTime: '2026-06-02 11:00:00', endTime: '2026-06-02 11:15:00', result: '恢复成功' },
  { id: 'RS-003', taskName: '配置恢复', source: 'config-server_20260602', target: 'config-server', backupTime: '2026-06-02 04:00:00', status: 'in-progress', startTime: '2026-06-02 12:00:00', endTime: '-', result: '恢复中...' },
  { id: 'RS-004', taskName: '用户数据恢复', source: 'user-db_20260601', target: 'user-db', backupTime: '2026-06-01 02:00:00', status: 'failed', startTime: '2026-06-02 09:00:00', endTime: '2026-06-02 09:10:00', result: '恢复失败，备份文件损坏' },
  { id: 'RS-005', taskName: '代码仓库恢复', source: 'git-server_20260602', target: 'git-server', backupTime: '2026-06-02 04:00:00', status: 'pending', startTime: '-', endTime: '-', result: '等待执行' },
];

export function RestoreTaskView() {
  const [data] = useState<TaskItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.target.toLowerCase().includes(searchKeyword.toLowerCase());
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
    if (status === 'in-progress') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />恢复中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400"><Clock className="w-3 h-3 inline mr-1" />待执行</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">恢复任务视图</h2>
        <p className="text-sm text-gray-400 mt-1">恢复任务列表展示、恢复过程展示、恢复结果展示、条件查询、数据导出</p>
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
              <p className="text-gray-400 text-xs">恢复中</p>
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
                placeholder="搜索任务名称或目标..."
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
                <option value="in-progress">恢复中</option>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份源</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">结果</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white font-medium">{item.taskName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.target}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.backupTime}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className={`px-4 py-3 text-sm ${item.status === 'success' ? 'text-green-400' : item.status === 'failed' ? 'text-red-400' : 'text-gray-400'}`}>{item.result}</td>
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
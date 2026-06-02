'use client';

import React, { useState } from 'react';
import { Search, Database, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface DataTask {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  lastExecute: string;
  nextExecute: string;
  description: string;
}

const mockData: DataTask[] = [
  { id: 'DATA-001', name: '数据同步任务', type: '同步', status: 'completed', lastExecute: '2026-06-02 10:00:00', nextExecute: '2026-06-02 11:00:00', description: '同步安全设备数据' },
  { id: 'DATA-002', name: '数据清洗任务', type: '清洗', status: 'running', lastExecute: '2026-06-02 09:30:00', nextExecute: '-', description: '清洗日志数据' },
  { id: 'DATA-003', name: '数据备份任务', type: '备份', status: 'completed', lastExecute: '2026-06-02 02:00:00', nextExecute: '2026-06-03 02:00:00', description: '备份数据库' },
  { id: 'DATA-004', name: '数据归档任务', type: '归档', status: 'pending', lastExecute: '-', nextExecute: '2026-06-02 12:00:00', description: '归档历史数据' },
  { id: 'DATA-005', name: '数据导出任务', type: '导出', status: 'failed', lastExecute: '2026-06-02 08:00:00', nextExecute: '2026-06-02 14:00:00', description: '导出报表数据' },
];

export function SystemDataView() {
  const [data] = useState<DataTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    completed: data.filter(d => d.status === 'completed').length,
    running: data.filter(d => d.status === 'running').length,
    pending: data.filter(d => d.status === 'pending').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">运行中</span>;
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待执行</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'running') return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
    if (status === 'pending') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统数据处理视图</h2>
        <p className="text-sm text-gray-400 mt-1">管理和监控系统数据的处理任务</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已完成</p>
              <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">运行中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待执行</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
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
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次执行</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">下次执行</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastExecute}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.nextExecute}</td>
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
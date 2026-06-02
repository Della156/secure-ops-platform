'use client';

import React, { useState } from 'react';
import { Search, Briefcase, Play, Pause, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface JobItem {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  endTime: string;
  executor: string;
}

const mockData: JobItem[] = [
  { id: 'JOB-001', name: '安全策略同步作业', type: '同步', status: 'running', progress: 65, startTime: '2026-06-02 10:00:00', endTime: '-', executor: 'system' },
  { id: 'JOB-002', name: '日志清理作业', type: '清理', status: 'completed', progress: 100, startTime: '2026-06-02 04:00:00', endTime: '2026-06-02 04:30:00', executor: 'system' },
  { id: 'JOB-003', name: '数据备份作业', type: '备份', status: 'completed', progress: 100, startTime: '2026-06-02 02:00:00', endTime: '2026-06-02 02:15:00', executor: 'system' },
  { id: 'JOB-004', name: '漏洞扫描作业', type: '扫描', status: 'pending', progress: 0, startTime: '-', endTime: '-', executor: 'admin' },
  { id: 'JOB-005', name: '系统升级作业', type: '升级', status: 'failed', progress: 30, startTime: '2026-06-02 01:00:00', endTime: '2026-06-02 01:10:00', executor: 'admin' },
];

export function JobView() {
  const [data] = useState<JobItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    running: data.filter(d => d.status === 'running').length,
    completed: data.filter(d => d.status === 'completed').length,
    pending: data.filter(d => d.status === 'pending').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">运行中</span>;
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待执行</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'running') return <Play className="w-4 h-4 text-blue-400" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业管理视图</h2>
        <p className="text-sm text-gray-400 mt-1">管理和监控系统作业</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">作业总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">运行中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.running}</p>
            </div>
          </div>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">作业名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">进度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">开始时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">结束时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">执行者</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.progress === 100 ? 'bg-green-500' : item.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-sm text-gray-400 w-10 text-right">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.startTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.endTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.executor}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </td>
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
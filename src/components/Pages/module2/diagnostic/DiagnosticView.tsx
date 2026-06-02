'use client';

import React, { useState } from 'react';
import { Search, Activity, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface DiagnosticTask {
  id: string;
  name: string;
  target: string;
  type: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  lastRun: string;
  nextRun: string;
  duration: string;
}

const mockData: DiagnosticTask[] = [
  { id: 'DIAG-001', name: '网络连通性诊断', target: '全部设备', type: '网络诊断', status: 'success', lastRun: '2026-06-02 10:30:00', nextRun: '2026-06-02 11:00:00', duration: '5秒' },
  { id: 'DIAG-002', name: '服务健康检查', target: '应用服务器', type: '服务诊断', status: 'success', lastRun: '2026-06-02 10:25:00', nextRun: '2026-06-02 10:55:00', duration: '12秒' },
  { id: 'DIAG-003', name: '数据库连接诊断', target: '数据库服务器', type: '数据库诊断', status: 'warning', lastRun: '2026-06-02 10:20:00', nextRun: '2026-06-02 10:50:00', duration: '8秒' },
  { id: 'DIAG-004', name: '安全策略验证', target: '防火墙', type: '安全诊断', status: 'error', lastRun: '2026-06-02 10:15:00', nextRun: '2026-06-02 10:45:00', duration: '15秒' },
  { id: 'DIAG-005', name: '性能诊断', target: '负载均衡器', type: '性能诊断', status: 'success', lastRun: '2026-06-02 10:10:00', nextRun: '2026-06-02 10:40:00', duration: '20秒' },
];

export function DiagnosticView() {
  const [data] = useState<DiagnosticTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.target.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    warning: data.filter(d => d.status === 'warning').length,
    error: data.filter(d => d.status === 'error').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">正常</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    if (status === 'error') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">异常</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">待诊断</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    if (status === 'error') return <XCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统诊断视图</h2>
        <p className="text-sm text-gray-400 mt-1">管理和监控系统诊断任务</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">诊断任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">正常</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">异常</p>
              <p className="text-xl font-semibold text-red-400">{stats.error}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">待诊断</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.pending}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">诊断任务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次运行</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">下次运行</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">耗时</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.target}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastRun}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{item.nextRun}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.duration}</td>
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
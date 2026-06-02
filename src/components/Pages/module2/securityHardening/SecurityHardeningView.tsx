'use client';

import React, { useState } from 'react';
import { Search, Shield, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface HardeningTask {
  id: string;
  name: string;
  target: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  status: 'completed' | 'pending' | 'failed';
  lastExecute: string;
}

const mockData: HardeningTask[] = [
  { id: 'HARD-001', name: '密码策略加固', target: '系统账户', type: '账户安全', severity: 'high', status: 'completed', lastExecute: '2026-06-02 10:00:00' },
  { id: 'HARD-002', name: '防火墙规则优化', target: '网络边界', type: '网络安全', severity: 'high', status: 'completed', lastExecute: '2026-06-02 09:30:00' },
  { id: 'HARD-003', name: 'SSH安全配置', target: '服务器', type: '访问控制', severity: 'medium', status: 'completed', lastExecute: '2026-06-02 09:00:00' },
  { id: 'HARD-004', name: '数据库权限加固', target: '数据库', type: '数据安全', severity: 'high', status: 'pending', lastExecute: '-' },
  { id: 'HARD-005', name: '日志审计配置', target: '所有设备', type: '审计安全', severity: 'medium', status: 'failed', lastExecute: '2026-06-02 08:00:00' },
];

export function SecurityHardeningView() {
  const [data] = useState<HardeningTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.target.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    completed: data.filter(d => d.status === 'completed').length,
    pending: data.filter(d => d.status === 'pending').length,
    failed: data.filter(d => d.status === 'failed').length,
    highSeverity: data.filter(d => d.severity === 'high').length,
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">高</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">低</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待执行</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'pending') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全加固视图</h2>
        <p className="text-sm text-gray-400 mt-1">管理和监控安全加固任务</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">加固任务总数</p>
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
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">高危任务</p>
              <p className="text-xl font-semibold text-red-400">{stats.highSeverity}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标对象</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">严重程度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次执行</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.target}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3">{getSeverityBadge(item.severity)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastExecute}</td>
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
'use client';

import React, { useState } from 'react';
import { Search, Activity, CheckCircle, XCircle, AlertTriangle, Server } from 'lucide-react';

interface BusinessService {
  id: string;
  name: string;
  type: string;
  status: 'normal' | 'warning' | 'error';
  healthScore: number;
  responseTime: number;
  availability: number;
  lastCheck: string;
  checkCount: number;
}

const mockData: BusinessService[] = [
  { id: 'BS-001', name: '用户登录服务', type: '认证服务', status: 'normal', healthScore: 95, responseTime: 120, availability: 99.9, lastCheck: '2026-06-02 10:30:00', checkCount: 156 },
  { id: 'BS-002', name: '数据查询服务', type: '数据服务', status: 'normal', healthScore: 92, responseTime: 245, availability: 99.8, lastCheck: '2026-06-02 10:29:00', checkCount: 234 },
  { id: 'BS-003', name: 'API网关服务', type: '网关服务', status: 'warning', healthScore: 78, responseTime: 450, availability: 99.5, lastCheck: '2026-06-02 10:28:00', checkCount: 512 },
  { id: 'BS-004', name: '消息队列服务', type: '消息服务', status: 'error', healthScore: 45, responseTime: 1200, availability: 98.0, lastCheck: '2026-06-02 10:27:00', checkCount: 89 },
  { id: 'BS-005', name: '缓存服务', type: '数据服务', status: 'normal', healthScore: 98, responseTime: 15, availability: 100, lastCheck: '2026-06-02 10:30:00', checkCount: 876 },
];

export function BusinessCheckView() {
  const [data] = useState<BusinessService[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.includes(searchKeyword)
  );

  const stats = {
    total: data.length,
    normal: data.filter(d => d.status === 'normal').length,
    warning: data.filter(d => d.status === 'warning').length,
    error: data.filter(d => d.status === 'error').length,
    avgHealth: Math.round(data.reduce((sum, d) => sum + d.healthScore, 0) / data.length),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'normal') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">正常</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">告警</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">异常</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">业务功能检查视图</h2>
        <p className="text-sm text-gray-400 mt-1">全面检查各类业务服务的运行状态和健康状况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">服务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">正常运行</p>
              <p className="text-xl font-semibold text-green-400">{stats.normal}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">告警</p>
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
          <p className="text-gray-400 text-sm">平均健康度</p>
          <p className={`text-2xl font-semibold mt-1 ${stats.avgHealth >= 90 ? 'text-green-400' : stats.avgHealth >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{stats.avgHealth}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">服务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">健康度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">响应时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">可用性</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查次数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
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
                  <td className="px-4 py-3 text-sm text-gray-400">{item.type}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.healthScore >= 90 ? 'bg-green-500' : item.healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.healthScore}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(item.healthScore)}`}>{item.healthScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.responseTime}ms</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.availability}%</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.checkCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastCheck}</td>
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
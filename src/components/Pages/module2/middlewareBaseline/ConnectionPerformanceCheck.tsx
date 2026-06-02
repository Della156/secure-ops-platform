'use client';

import React, { useState } from 'react';
import { Search, Activity, Zap, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConnectionItem {
  id: string;
  connectionType: string;
  currentConnections: number;
  maxConnections: number;
  responseTime: number;
  throughput: string;
  status: 'healthy' | 'warning' | 'critical';
  lastCheck: string;
}

const mockData: ConnectionItem[] = [
  { id: 'CONN-001', connectionType: 'HTTP连接', currentConnections: 156, maxConnections: 500, responseTime: 45, throughput: '12.5 MB/s', status: 'healthy', lastCheck: '2026-06-02 10:30:00' },
  { id: 'CONN-002', connectionType: '数据库连接', currentConnections: 48, maxConnections: 100, responseTime: 120, throughput: '8.2 MB/s', status: 'healthy', lastCheck: '2026-06-02 10:30:00' },
  { id: 'CONN-003', connectionType: '缓存连接', currentConnections: 89, maxConnections: 200, responseTime: 15, throughput: '25.6 MB/s', status: 'healthy', lastCheck: '2026-06-02 10:30:00' },
  { id: 'CONN-004', connectionType: '消息队列', currentConnections: 320, maxConnections: 400, responseTime: 85, throughput: '5.8 MB/s', status: 'warning', lastCheck: '2026-06-02 10:30:00' },
  { id: 'CONN-005', connectionType: '外部API', currentConnections: 24, maxConnections: 50, responseTime: 520, throughput: '1.2 MB/s', status: 'critical', lastCheck: '2026-06-02 10:30:00' },
];

const chartData = [
  { time: '09:00', connections: 120, responseTime: 40 },
  { time: '09:30', connections: 180, responseTime: 55 },
  { time: '10:00', connections: 240, responseTime: 68 },
  { time: '10:30', connections: 210, responseTime: 52 },
  { time: '11:00', connections: 190, responseTime: 48 },
  { time: '11:30', connections: 260, responseTime: 72 },
];

export function ConnectionPerformanceCheck() {
  const [data] = useState<ConnectionItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.connectionType.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    totalConnections: data.reduce((sum, d) => sum + d.currentConnections, 0),
    avgResponseTime: Math.round(data.reduce((sum, d) => sum + d.responseTime, 0) / data.length),
    healthy: data.filter(d => d.status === 'healthy').length,
    warning: data.filter(d => d.status === 'warning').length,
    critical: data.filter(d => d.status === 'critical').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'healthy') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">健康</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
  };

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'text-green-400';
    if (status === 'warning') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">连接与性能安全检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查中间件的连接状态和性能指标</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">总连接数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalConnections}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">平均响应时间</p>
              <p className="text-xl font-semibold text-blue-400">{stats.avgResponseTime}ms</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">健康</p>
              <p className="text-xl font-semibold text-green-400">{stats.healthy}</p>
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
            <Zap className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">严重</p>
              <p className="text-xl font-semibold text-red-400">{stats.critical}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">连接趋势</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
            <Line type="monotone" dataKey="connections" name="连接数" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="responseTime" name="响应时间(ms)" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">连接类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">当前连接</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最大连接</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">响应时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">吞吐量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.connectionType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.currentConnections}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.maxConnections}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${item.responseTime > 500 ? 'text-red-400' : item.responseTime > 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {item.responseTime}ms
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.throughput}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
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
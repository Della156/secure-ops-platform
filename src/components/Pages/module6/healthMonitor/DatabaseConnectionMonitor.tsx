'use client';

import React, { useState } from 'react';
import { Database, Activity, Clock, AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react';

interface Database {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'mongodb' | 'redis';
  status: 'healthy' | 'warning' | 'critical';
  connections: number;
  maxConnections: number;
  activeConnections: number;
  responseTime: number;
  queriesPerSecond: number;
}

export function DatabaseConnectionMonitor() {
  const [timeRange, setTimeRange] = useState('1h');

  const mockDatabases: Database[] = [
    { id: 'DB-001', name: 'MySQL主库', type: 'mysql', status: 'healthy', connections: 156, maxConnections: 500, activeConnections: 45, responseTime: 12, queriesPerSecond: 1250 },
    { id: 'DB-002', name: 'MySQL从库', type: 'mysql', status: 'healthy', connections: 89, maxConnections: 500, activeConnections: 32, responseTime: 15, queriesPerSecond: 890 },
    { id: 'DB-003', name: 'PostgreSQL', type: 'postgresql', status: 'warning', connections: 245, maxConnections: 300, activeConnections: 189, responseTime: 45, queriesPerSecond: 670 },
    { id: 'DB-004', name: 'MongoDB集群', type: 'mongodb', status: 'healthy', connections: 312, maxConnections: 500, activeConnections: 78, responseTime: 23, queriesPerSecond: 450 },
    { id: 'DB-005', name: 'Redis缓存', type: 'redis', status: 'healthy', connections: 456, maxConnections: 1000, activeConnections: 234, responseTime: 2, queriesPerSecond: 5680 },
  ];

  const timeRanges = ['1h', '6h', '24h', '7d'];

  const stats = {
    totalConnections: mockDatabases.reduce((sum, d) => sum + d.connections, 0),
    avgResponseTime: Math.round(mockDatabases.reduce((sum, d) => sum + d.responseTime, 0) / mockDatabases.length),
    totalQPS: mockDatabases.reduce((sum, d) => sum + d.queriesPerSecond, 0),
    healthyCount: mockDatabases.filter(d => d.status === 'healthy').length,
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mysql': return 'MySQL';
      case 'postgresql': return 'PostgreSQL';
      case 'mongodb': return 'MongoDB';
      case 'redis': return 'Redis';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'healthy': return '健康';
      case 'warning': return '警告';
      case 'critical': return '严重';
      default: return status;
    }
  };

  const getConnectionUsage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">数据库连接池状态与性能监控</h2>
          <p className="text-sm text-gray-400 mt-1">监控数据库连接池状态，分析性能指标</p>
        </div>
        <div className="flex items-center gap-1">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                timeRange === range 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-[#20293F] text-gray-300 hover:bg-[#2A354D]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">总连接数</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalConnections}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">平均响应时间</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgResponseTime}ms</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">总QPS</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalQPS.toLocaleString()}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">健康数据库</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.healthyCount}/{mockDatabases.length}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">数据库名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">连接数</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">活跃连接</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">响应时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">QPS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
            </tr>
          </thead>
          <tbody>
            {mockDatabases.map((db) => (
              <tr key={db.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{db.name}</div>
                  <div className="text-xs text-gray-500">{db.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-[#2A354D] text-gray-300 text-xs rounded">
                    {getTypeLabel(db.type)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-300">{db.connections}/{db.maxConnections}</div>
                  <div className="w-full h-1.5 bg-[#111625] rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getConnectionUsage(db.connections, db.maxConnections) > 80 ? 'bg-red-500' : getConnectionUsage(db.connections, db.maxConnections) > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${getConnectionUsage(db.connections, db.maxConnections)}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{db.activeConnections}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{db.responseTime}ms</td>
                <td className="px-4 py-3 text-sm text-gray-300">{db.queriesPerSecond.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(db.status)}`}>
                    {getStatusLabel(db.status)}
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

export default DatabaseConnectionMonitor;
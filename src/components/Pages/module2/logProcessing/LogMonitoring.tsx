'use client';

import React, { useState } from 'react';
import { Search, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LogMonitorItem {
  id: string;
  source: string;
  level: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  lastOccurrence: string;
  status: 'normal' | 'warning' | 'critical';
}

const mockData: LogMonitorItem[] = [
  { id: 'MON-001', source: '安全设备日志', level: 'ERROR', count: 15, trend: 'down', lastOccurrence: '2026-06-02 10:28:00', status: 'normal' },
  { id: 'MON-002', source: '操作系统日志', level: 'WARN', count: 120, trend: 'up', lastOccurrence: '2026-06-02 10:25:00', status: 'warning' },
  { id: 'MON-003', source: '应用日志', level: 'ERROR', count: 5, trend: 'stable', lastOccurrence: '2026-06-02 10:20:00', status: 'normal' },
  { id: 'MON-004', source: '网络流量日志', level: 'CRITICAL', count: 3, trend: 'up', lastOccurrence: '2026-06-02 10:15:00', status: 'critical' },
  { id: 'MON-005', source: '数据库日志', level: 'ERROR', count: 0, trend: 'stable', lastOccurrence: '-', status: 'normal' },
];

const chartData = [
  { time: '08:00', errors: 20, warnings: 80 },
  { time: '08:30', errors: 18, warnings: 95 },
  { time: '09:00', errors: 15, warnings: 85 },
  { time: '09:30', errors: 12, warnings: 100 },
  { time: '10:00', errors: 18, warnings: 110 },
  { time: '10:30', errors: 23, warnings: 120 },
];

export function LogMonitoring() {
  const [data] = useState<LogMonitorItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.source.toLowerCase().includes(searchKeyword.toLowerCase()) || d.level.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    totalAlerts: data.reduce((sum, d) => sum + d.count, 0),
    critical: data.filter(d => d.status === 'critical').length,
    warning: data.filter(d => d.status === 'warning').length,
    normal: data.filter(d => d.status === 'normal').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'critical') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">正常</span>;
  };

  const getLevelColor = (level: string) => {
    if (level === 'CRITICAL') return 'text-red-400';
    if (level === 'ERROR') return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志数据监测</h2>
        <p className="text-sm text-gray-400 mt-1">实时监测日志数据的异常情况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">告警总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalAlerts}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">严重</p>
              <p className="text-xl font-semibold text-red-400">{stats.critical}</p>
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
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">正常</p>
              <p className="text-xl font-semibold text-green-400">{stats.normal}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">日志告警趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Line type="monotone" dataKey="errors" name="错误" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="warnings" name="警告" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-gray-300">实时告警</h3>
          </div>
          <div className="p-4 space-y-3">
            {filteredData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${item.status === 'critical' ? 'text-red-400' : item.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}`} />
                  <div>
                    <p className="text-sm text-white">{item.source}</p>
                    <p className={`text-xs ${getLevelColor(item.level)}`}>{item.level}: {item.count} 次</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志源</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">级别</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">数量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">趋势</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后出现</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.source}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${getLevelColor(item.level)}`}>{item.level}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.count}</td>
                  <td className="px-4 py-3">
                    {item.trend === 'up' && <span className="text-red-400">↑ 上升</span>}
                    {item.trend === 'down' && <span className="text-green-400">↓ 下降</span>}
                    {item.trend === 'stable' && <span className="text-gray-400">→ 稳定</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastOccurrence}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
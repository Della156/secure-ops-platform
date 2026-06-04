'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Clock, Zap, Activity } from 'lucide-react';

interface ApiStat {
  apiName: string;
  calls: number;
  avgLatency: number;
  errorRate: number;
  status: 'normal' | 'warning' | 'critical';
}

export function ApiCallAnalysis() {
  const [timeRange, setTimeRange] = useState('24h');

  const mockStats: ApiStat[] = [
    { apiName: '用户数据API', calls: 12560, avgLatency: 23, errorRate: 0.5, status: 'normal' },
    { apiName: '资产查询API', calls: 8930, avgLatency: 45, errorRate: 1.2, status: 'normal' },
    { apiName: '告警推送API', calls: 4520, avgLatency: 67, errorRate: 3.5, status: 'warning' },
    { apiName: '日志查询API', calls: 2340, avgLatency: 156, errorRate: 5.8, status: 'critical' },
    { apiName: '威胁情报API', calls: 1890, avgLatency: 89, errorRate: 0.8, status: 'normal' },
    { apiName: '报表生成API', calls: 560, avgLatency: 234, errorRate: 2.1, status: 'warning' },
  ];

  const timeRanges = ['1h', '6h', '24h', '7d', '30d'];

  const summaryStats = {
    totalCalls: mockStats.reduce((sum, s) => sum + s.calls, 0),
    avgLatency: Math.round(mockStats.reduce((sum, s) => sum + s.avgLatency, 0) / mockStats.length),
    errorRate: (mockStats.reduce((sum, s) => sum + s.errorRate, 0) / mockStats.length).toFixed(1),
    warningCount: mockStats.filter(s => s.status === 'warning').length,
    criticalCount: mockStats.filter(s => s.status === 'critical').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'warning': return '警告';
      case 'critical': return '严重';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">API调用分析</h2>
          <p className="text-sm text-gray-400 mt-1">分析API调用情况，监控性能指标和错误率</p>
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
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">总调用次数</span>
          </div>
          <div className="text-2xl font-bold text-white">{summaryStats.totalCalls.toLocaleString()}</div>
          <div className="text-xs text-green-400 mt-1">+12.5% 较昨日</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">平均延迟</span>
          </div>
          <div className="text-2xl font-bold text-white">{summaryStats.avgLatency}ms</div>
          <div className="text-xs text-red-400 mt-1">+3.2ms 较昨日</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">错误率</span>
          </div>
          <div className="text-2xl font-bold text-white">{summaryStats.errorRate}%</div>
          <div className="text-xs text-red-400 mt-1">+0.8% 较昨日</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">异常API</span>
          </div>
          <div className="text-2xl font-bold text-white">{summaryStats.warningCount + summaryStats.criticalCount}</div>
          <div className="text-xs text-gray-400 mt-1">{summaryStats.warningCount}警告 / {summaryStats.criticalCount}严重</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">调用趋势</span>
        </div>
        <div className="flex items-end justify-between h-32 gap-2">
          {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((time, idx) => {
            const height = 30 + Math.random() * 70;
            return (
              <div key={time} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${height}%`, minHeight: '8px' }} />
                <span className="text-xs text-gray-500">{time}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">API名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">调用次数</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">平均延迟</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">错误率</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
            </tr>
          </thead>
          <tbody>
            {mockStats.map((item) => (
              <tr key={item.apiName} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{item.apiName}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.calls.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.avgLatency}ms</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.errorRate}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
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

export default ApiCallAnalysis;
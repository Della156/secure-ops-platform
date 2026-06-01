'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, TooltipProps } from 'recharts';
import { Download, Calendar, Activity, TrendingUp, AlertCircle, Zap, BarChart3, PieChart as PieChartIcon, Clock, Users, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const hourlyData = [
  { label: '00:00', calls: 120, success: 115, failed: 5, avgTime: 234 },
  { label: '04:00', calls: 85, success: 82, failed: 3, avgTime: 210 },
  { label: '08:00', calls: 245, success: 238, failed: 7, avgTime: 289 },
  { label: '12:00', calls: 320, success: 310, failed: 10, avgTime: 312 },
  { label: '16:00', calls: 285, success: 276, failed: 9, avgTime: 298 },
  { label: '20:00', calls: 195, success: 189, failed: 6, avgTime: 256 },
];

const dailyData = [
  { label: '周一', calls: 1850, success: 1790, failed: 60, avgTime: 267 },
  { label: '周二', calls: 1920, success: 1856, failed: 64, avgTime: 278 },
  { label: '周三', calls: 2100, success: 2034, failed: 66, avgTime: 265 },
  { label: '周四', calls: 1890, success: 1823, failed: 67, avgTime: 289 },
  { label: '周五', calls: 1650, success: 1598, failed: 52, avgTime: 254 },
  { label: '周六', calls: 1100, success: 1072, failed: 28, avgTime: 234 },
  { label: '周日', calls: 980, success: 956, failed: 24, avgTime: 221 },
];

const apiStats = [
  { name: '获取威胁情报', totalCalls: 2450, successRate: 96.3, avgTime: 234, errorRate: 3.7, trend: 5.2 },
  { name: '执行安全扫描', totalCalls: 1890, successRate: 98.4, avgTime: 187, errorRate: 1.6, trend: -2.1 },
  { name: '获取扫描结果', totalCalls: 670, successRate: 78.3, avgTime: 456, errorRate: 21.7, trend: 12.5 },
  { name: '同步资产数据', totalCalls: 1560, successRate: 94.2, avgTime: 389, errorRate: 5.8, trend: -1.8 },
];

const applicationStats = [
  { name: 'Web应用', calls: 2100, success: 1985, avgTime: 245 },
  { name: '内部系统', calls: 3200, success: 3120, avgTime: 278 },
  { name: '测试环境', calls: 870, success: 834, avgTime: 221 },
  { name: '移动端', calls: 500, success: 482, avgTime: 298 },
];

const responseTimeDistribution = [
  { range: '0-100ms', count: 1250, percentage: 32 },
  { range: '100-300ms', count: 1890, percentage: 48 },
  { range: '300-500ms', count: 560, percentage: 14 },
  { range: '500-1000ms', count: 180, percentage: 5 },
  { range: '1000ms+', count: 40, percentage: 1 },
];

const statusDistribution = [
  { name: '成功', value: 4580, color: '#22c55e' },
  { name: '失败', value: 125, color: '#ef4444' },
  { name: '警告', value: 75, color: '#eab308' },
];

const methodDistribution = [
  { name: 'GET', count: 3200, percentage: 58, color: '#3b82f6' },
  { name: 'POST', count: 1250, percentage: 23, color: '#22c55e' },
  { name: 'PUT', count: 480, percentage: 9, color: '#eab308' },
  { name: 'DELETE', count: 550, percentage: 10, color: '#ef4444' },
];

export function ApiCallAnalysis() {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedApi, setSelectedApi] = useState('all');
  const [viewMode, setViewMode] = useState<'time' | 'application'>('time');

  const currentData = timeRange === '7d' ? dailyData : hourlyData;

  const CustomTooltip = (props: TooltipProps<number, string>) => {
    const { active, payload, label } = props as any;
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-[#181F32] border border-[#2A354D] rounded-lg p-3 shadow-lg min-w-[150px]">
          <p className="text-[#D1D5DB] text-sm mb-2 font-medium">{label}</p>
          {payload.map((entry: any, index: any) => (
            <p key={index} className="text-sm mb-1" style={{ color: entry.color }}>
              <span className="text-[#9CA3AF]">{entry.name}: </span>
              <span className="font-medium">{entry.value}{entry.unit || ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    const reportData = [
      ['时间', '总调用', '成功', '失败', '平均响应时间(ms)'],
      ...currentData.map((d: { label: string; calls: number; success: number; failed: number; avgTime: number }) => [d.label, d.calls, d.success, d.failed, d.avgTime])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `api-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalCalls = apiStats.reduce((sum, a) => sum + a.totalCalls, 0);
  const avgSuccessRate = (apiStats.reduce((sum, a) => sum + a.successRate, 0) / apiStats.length).toFixed(1);
  const avgResponseTime = Math.round(apiStats.reduce((sum, a) => sum + a.avgTime, 0) / apiStats.length);
  const totalErrors = apiStats.reduce((sum, a) => sum + Math.round(a.totalCalls * (a.errorRate / 100)), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务API接口调用分析与统计</h1>
        <p className="text-[#9CA3AF]">分析和监控任务API调用性能指标</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#9CA3AF]" />
            <div className="flex bg-[#181F32] rounded-lg p-1">
              {[['1h', '1小时'], ['6h', '6小时'], ['24h', '24小时'], ['7d', '7天']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTimeRange(key as any)}
                  className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                    timeRange === key ? 'bg-[#0066FF] text-[#F3F4F6]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#181F32] rounded-lg p-1">
              <button
                onClick={() => setViewMode('time')}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
                  viewMode === 'time' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <Clock className="w-4 h-4" />
                时间维度
              </button>
              <button
                onClick={() => setViewMode('application')}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
                  viewMode === 'application' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <Users className="w-4 h-4" />
                应用维度
              </button>
            </div>

            <select
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="all">全部API</option>
              <option value="API-001">获取威胁情报</option>
              <option value="API-002">执行安全扫描</option>
              <option value="API-003">获取扫描结果</option>
              <option value="API-004">同步资产数据</option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              导出报表
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9CA3AF] text-sm">总调用次数</p>
            <Activity className="w-5 h-5 text-[#0066FF]" />
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">{totalCalls.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-4 h-4 text-[#00C853]" />
            <p className="text-[#00C853] text-sm">↑ 12% vs 上期</p>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9CA3AF] text-sm">平均成功率</p>
            <TrendingUp className="w-5 h-5 text-[#00C853]" />
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">{avgSuccessRate}%</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-4 h-4 text-[#00C853]" />
            <p className="text-[#00C853] text-sm">↑ 2.1% vs 上期</p>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9CA3AF] text-sm">平均响应时间</p>
            <Zap className="w-5 h-5 text-[#FF9100]" />
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">{avgResponseTime}ms</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-4 h-4 text-[#FF3B30]" />
            <p className="text-[#FF3B30] text-sm">↑ 5.2% vs 上期</p>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9CA3AF] text-sm">错误次数</p>
            <AlertCircle className="w-5 h-5 text-[#FF3B30]" />
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">{totalErrors}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-4 h-4 text-[#00C853]" />
            <p className="text-[#00C853] text-sm">↓ 8.3% vs 上期</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#0066FF]" />
            <h3 className="text-lg font-semibold text-[#F3F4F6]">调用次数趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentData}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={CustomTooltip as any} />
              <Legend wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="calls" name="总调用" stroke="#3b82f6" fillOpacity={1} fill="url(#totalGradient)" />
              <Area type="monotone" dataKey="success" name="成功" stroke="#22c55e" fillOpacity={1} fill="url(#successGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#FF9100]" />
            <h3 className="text-lg font-semibold text-[#F3F4F6]">平均响应时间趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={CustomTooltip as any} />
              <Legend wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="avgTime" name="响应时间(ms)" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ fill: '#06b6d4', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {viewMode === 'application' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#6366F1]" />
              <h3 className="text-lg font-semibold text-[#F3F4F6]">应用调用分布</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                <Tooltip content={CustomTooltip as any} />
                <Legend wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }} />
                <Bar dataKey="calls" name="总调用" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="success" name="成功" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-[#FF9100]" />
              <h3 className="text-lg font-semibold text-[#F3F4F6]">请求方法分布</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="count"
                  label={({ name }) => `${name}`}
                  labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                >
                  {methodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={CustomTooltip as any} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#00BCD4]" />
              <h3 className="text-lg font-semibold text-[#F3F4F6]">响应时间分布</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="range" type="category" stroke="#94a3b8" width={80} />
                <Tooltip content={CustomTooltip as any} />
                <Legend wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }} />
                <Bar dataKey="count" name="调用次数" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-[#00C853]" />
              <h3 className="text-lg font-semibold text-[#F3F4F6]">调用状态分布</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                  labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={CustomTooltip as any} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[#0066FF]" />
          <h3 className="text-lg font-semibold text-[#F3F4F6]">API性能对比</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {apiStats.map((api, index) => (
            <div key={index} className="p-4 bg-[#181F32] rounded-lg border border-[#2A354D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#F3F4F6] font-medium text-sm">{api.name}</span>
                <span className={`text-xs font-medium ${api.successRate >= 95 ? 'text-[#00C853]' : api.successRate >= 80 ? 'text-[#FF9100]' : 'text-[#FF3B30]'}`}>
                  {api.successRate}%
                </span>
              </div>
              <div className="w-full bg-[#2A354D] rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${api.successRate >= 95 ? 'bg-[#00C853]' : api.successRate >= 80 ? 'bg-[#FF9100]' : 'bg-[#FF3B30]'}`}
                  style={{ width: `${api.successRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>总调用: {api.totalCalls}</span>
                <span>平均: {api.avgTime}ms</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {api.trend >= 0 ? (
                  <>
                    <ArrowUpRight className="w-3 h-3 text-[#FF3B30]" />
                    <span className="text-xs text-[#FF3B30]">↑{api.trend}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3 h-3 text-[#00C853]" />
                    <span className="text-xs text-[#00C853]">↓{Math.abs(api.trend)}%</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
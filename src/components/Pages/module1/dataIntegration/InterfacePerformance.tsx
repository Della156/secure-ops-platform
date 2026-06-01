'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, Activity, TrendingUp, AlertCircle, Zap, FileText, Clock, Server, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';

const performanceData = [
  { name: '10:00', total: 45, success: 42, failed: 3, avgTime: 234, p95Time: 345 },
  { name: '10:15', total: 52, success: 48, failed: 4, avgTime: 187, p95Time: 298 },
  { name: '10:30', total: 48, success: 40, failed: 8, avgTime: 312, p95Time: 456 },
  { name: '10:45', total: 60, success: 55, failed: 5, avgTime: 256, p95Time: 389 },
  { name: '11:00', total: 42, success: 38, failed: 4, avgTime: 198, p95Time: 276 },
  { name: '11:15', total: 50, success: 45, failed: 5, avgTime: 223, p95Time: 312 },
  { name: '11:30', total: 47, success: 43, failed: 4, avgTime: 201, p95Time: 287 },
  { name: '11:45', total: 55, success: 51, failed: 4, avgTime: 245, p95Time: 356 },
];

const interfaceStats = [
  { name: '威胁情报平台接口', totalCalls: 245, successRate: 96.3, avgTime: 234, p95Time: 345, errorRate: 3.7, availability: 99.2 },
  { name: '日志分析系统接口', totalCalls: 189, successRate: 98.4, avgTime: 187, p95Time: 267, errorRate: 1.6, availability: 99.8 },
  { name: '资产发现服务', totalCalls: 67, successRate: 78.3, avgTime: 456, p95Time: 678, errorRate: 21.7, availability: 92.1 },
  { name: '漏洞扫描系统', totalCalls: 156, successRate: 94.2, avgTime: 389, p95Time: 512, errorRate: 5.8, availability: 97.5 },
  { name: '防火墙日志接口', totalCalls: 134, successRate: 97.8, avgTime: 156, p95Time: 234, errorRate: 2.2, availability: 99.5 },
];

const responseTimeData = [
  { name: '0-100ms', count: 45, percentage: 18 },
  { name: '100-300ms', count: 128, percentage: 51 },
  { name: '300-500ms', count: 47, percentage: 19 },
  { name: '500-1000ms', count: 24, percentage: 10 },
  { name: '1000ms+', count: 5, percentage: 2 },
];

const errorDistribution = [
  { name: '超时', value: 35 },
  { name: '认证失败', value: 15 },
  { name: '服务不可用', value: 25 },
  { name: '请求错误', value: 12 },
  { name: '其他', value: 13 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function InterfacePerformance() {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [selectedInterface, setSelectedInterface] = useState('all');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm mb-2 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: <span className="font-medium">{entry.value}{entry.unit || ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    alert('正在导出性能分析报告...');
  };

  const totalCalls = interfaceStats.reduce((sum, i) => sum + i.totalCalls, 0);
  const avgSuccessRate = (interfaceStats.reduce((sum, i) => sum + i.successRate, 0) / interfaceStats.length).toFixed(1);
  const avgResponseTime = Math.round(interfaceStats.reduce((sum, i) => sum + i.avgTime, 0) / interfaceStats.length);
  const totalErrors = Math.round(interfaceStats.reduce((sum, i) => sum + (i.totalCalls * (i.errorRate / 100)), 0));
  const avgAvailability = (interfaceStats.reduce((sum, i) => sum + i.availability, 0) / interfaceStats.length).toFixed(1);

  const getStatusColor = (value: number, type: 'success' | 'time' | 'availability') => {
    if (type === 'success') {
      return value >= 95 ? 'text-green-400' : value >= 85 ? 'text-yellow-400' : 'text-red-400';
    }
    if (type === 'time') {
      return value < 200 ? 'text-green-400' : value < 500 ? 'text-yellow-400' : 'text-red-400';
    }
    return value >= 99 ? 'text-green-400' : value >= 95 ? 'text-yellow-400' : 'text-red-400';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">数据接口调用性能分析</h1>
              <p className="text-slate-400 text-sm">分析和监控数据接口调用性能指标</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div className="flex bg-slate-800 rounded-lg p-1">
              {(['1h', '6h', '24h', '7d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                    timeRange === range ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {range === '1h' ? '1小时' : range === '6h' ? '6小时' : range === '24h' ? '24小时' : '7天'}
                </button>
              ))}
            </div>
          </div>

          <select
            value={selectedInterface}
            onChange={(e) => setSelectedInterface(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部接口</option>
            <option value="IF-001">威胁情报平台接口</option>
            <option value="IF-002">日志分析系统接口</option>
            <option value="IF-003">资产发现服务</option>
            <option value="IF-004">漏洞扫描系统</option>
            <option value="IF-005">防火墙日志接口</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">总调用次数</p>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{totalCalls}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">↑ 12% vs 上期</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">平均成功率</p>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(parseFloat(avgSuccessRate), 'success')}`}>{avgSuccessRate}%</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">↑ 2.1% vs 上期</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">平均响应时间</p>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(avgResponseTime, 'time')}`}>{avgResponseTime}ms</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDown className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">↓ 5.2% vs 上期</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">错误次数</p>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{totalErrors}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDown className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">↓ 8.3% vs 上期</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">平均可用性</p>
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(parseFloat(avgAvailability), 'availability')}`}>{avgAvailability}%</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">↑ 0.5% vs 上期</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">调用次数趋势</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-400">总调用</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-400">成功</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-400">失败</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" name="总调用" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="success" name="成功" stroke="#22c55e" fillOpacity={1} fill="url(#colorSuccess)" />
              <Area type="monotone" dataKey="failed" name="失败" stroke="#ef4444" fillOpacity={1} fill="url(#colorFailed)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">错误分布</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={errorDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {errorDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">响应时间趋势</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-slate-400">平均响应时间</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-slate-400">P95响应时间</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgTime" name="平均响应时间(ms)" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
              <Line type="monotone" dataKey="p95Time" name="P95响应时间(ms)" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">响应时间分布</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={responseTimeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="调用次数" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                {responseTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name.includes('1000') ? '#ef4444' : entry.name.includes('500') ? '#f59e0b' : '#8b5cf6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">接口性能对比</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4" />
            <span>基于 {timeRange === '1h' ? '最近1小时' : timeRange === '6h' ? '最近6小时' : timeRange === '24h' ? '最近24小时' : '最近7天'}数据</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {interfaceStats.map((iface, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-4 hover:bg-slate-750 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-slate-400" />
                <span className="text-white font-medium text-sm">{iface.name}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">成功率</span>
                    <span className={`text-xs font-medium ${getStatusColor(iface.successRate, 'success')}`}>
                      {iface.successRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${iface.successRate >= 95 ? 'bg-green-500' : iface.successRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${iface.successRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">平均响应时间</span>
                    <span className={`text-xs font-medium ${getStatusColor(iface.avgTime, 'time')}`}>
                      {iface.avgTime}ms
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${iface.avgTime < 200 ? 'bg-green-500' : iface.avgTime < 500 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(iface.avgTime / 10, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className="text-xs text-slate-500">总调用</span>
                  <span className="text-xs text-slate-300 font-medium">{iface.totalCalls}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">性能报告摘要</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">最佳性能接口</p>
            <p className="text-white font-medium">防火墙日志接口</p>
            <p className="text-xs text-green-400">平均响应时间: 156ms</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">最差性能接口</p>
            <p className="text-white font-medium">资产发现服务</p>
            <p className="text-xs text-red-400">成功率: 78.3%</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">最频繁调用</p>
            <p className="text-white font-medium">威胁情报平台接口</p>
            <p className="text-xs text-blue-400">调用次数: 245次</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">建议优化</p>
            <p className="text-white font-medium">资产发现服务</p>
            <p className="text-xs text-yellow-400">高延迟需优化</p>
          </div>
        </div>
      </div>
    </div>
  );
}
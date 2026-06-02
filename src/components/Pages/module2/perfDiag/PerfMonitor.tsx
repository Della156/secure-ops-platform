'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Cpu, HardDrive, MemoryStick, Wifi, Server, Clock, RefreshCw, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Metric {
  name: string;
  current: number;
  unit: string;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

const metricHistoryData = [
  { time: '10:00', cpu: 45, memory: 62, disk: 35, network: 40 },
  { time: '10:05', cpu: 52, memory: 65, disk: 35, network: 45 },
  { time: '10:10', cpu: 48, memory: 63, disk: 36, network: 42 },
  { time: '10:15', cpu: 75, memory: 70, disk: 36, network: 55 },
  { time: '10:20', cpu: 68, memory: 72, disk: 36, network: 58 },
  { time: '10:25', cpu: 55, memory: 68, disk: 37, network: 50 },
  { time: '10:30', cpu: 62, memory: 69, disk: 37, network: 52 },
];

const mockMetrics: Metric[] = [
  { name: 'CPU使用率', current: 62, unit: '%', threshold: 80, status: 'normal' },
  { name: '内存使用率', current: 69, unit: '%', threshold: 85, status: 'normal' },
  { name: '磁盘使用率', current: 88, unit: '%', threshold: 90, status: 'warning' },
  { name: '网络带宽', current: 52, unit: 'Mbps', threshold: 80, status: 'normal' },
];

const mockAlerts = [
  { id: 1, level: 'warning', message: '磁盘使用率接近阈值', time: '10:28:00' },
  { id: 2, level: 'info', message: 'CPU使用率短暂升高', time: '10:20:00' },
  { id: 3, level: 'info', message: '系统性能正常', time: '10:15:00' },
];

export function PerfMonitor() {
  const [metrics] = useState(mockMetrics);
  const [alerts] = useState(mockAlerts);
  const [lastUpdate, setLastUpdate] = useState('10:30:00');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical': return '严重';
      case 'warning': return '警告';
      default: return '正常';
    }
  };

  const getMetricIcon = (name: string) => {
    if (name.includes('CPU')) return <Cpu className="w-5 h-5" />;
    if (name.includes('内存')) return <MemoryStick className="w-5 h-5" />;
    if (name.includes('磁盘')) return <HardDrive className="w-5 h-5" />;
    if (name.includes('网络')) return <Wifi className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">性能指标监控</h2>
            <p className="text-sm text-gray-400 mt-1">指标采集、数据展示、趋势曲线、阈值告警</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              最后更新: {lastUpdate}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status).split(' ')[1]}`}>
                  {getMetricIcon(metric.name)}
                </div>
                <span className="text-sm text-gray-300">{metric.name}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(metric.status)}`}>
                {getStatusLabel(metric.status)}
              </span>
            </div>
            <div className="text-2xl font-semibold text-white mb-2">
              {metric.current}{metric.unit}
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  metric.status === 'critical' ? 'bg-red-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} 
                style={{ width: `${Math.min(metric.current, 100)}%` }} 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">阈值: {metric.threshold}{metric.unit}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">性能趋势</h3>
            <select className="px-3 py-1 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm">
              <option>最近30分钟</option>
              <option>最近1小时</option>
              <option>最近24小时</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metricHistoryData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Area type="monotone" dataKey="cpu" name="CPU" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCpu)" />
              <Area type="monotone" dataKey="memory" name="内存" stroke="#10B981" fillOpacity={1} fill="url(#colorMemory)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-medium text-gray-300">告警记录</h3>
            </div>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-[#111827] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    alert.level === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    alert.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {alert.level === 'warning' ? '警告' : alert.level === 'critical' ? '严重' : '信息'}
                  </span>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-300">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">服务器列表</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">服务器</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">CPU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">内存</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">磁盘</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">网络</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              <tr className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-3 text-sm text-gray-300">SRV-01 (主服务器)</td>
                <td className="px-4 py-3 text-sm text-green-400">62%</td>
                <td className="px-4 py-3 text-sm text-green-400">69%</td>
                <td className="px-4 py-3 text-sm text-yellow-400">88%</td>
                <td className="px-4 py-3 text-sm text-green-400">52Mbps</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">需要关注</span>
                </td>
              </tr>
              <tr className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-3 text-sm text-gray-300">APP-02 (应用服务器)</td>
                <td className="px-4 py-3 text-sm text-green-400">45%</td>
                <td className="px-4 py-3 text-sm text-green-400">58%</td>
                <td className="px-4 py-3 text-sm text-green-400">42%</td>
                <td className="px-4 py-3 text-sm text-green-400">35Mbps</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">正常</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Wifi, Activity } from 'lucide-react';

export function ResourceMonitor() {
  const [metrics, setMetrics] = useState({
    cpu: { current: 45, peak: 78, trend: 5 },
    memory: { current: 62, peak: 85, trend: -3 },
    disk: { current: 75, peak: 82, trend: 2 },
    network: { in: '125 MB/s', out: '89 MB/s', latency: '12 ms' },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        cpu: {
          current: Math.floor(Math.random() * 30) + 30,
          peak: Math.max(70, Math.floor(Math.random() * 25) + 75),
          trend: Math.floor(Math.random() * 10) - 5,
        },
        memory: {
          current: Math.floor(Math.random() * 20) + 50,
          peak: Math.max(75, Math.floor(Math.random() * 20) + 80),
          trend: Math.floor(Math.random() * 10) - 5,
        },
        disk: {
          current: Math.min(95, Math.floor(Math.random() * 10) + 70),
          peak: Math.max(75, Math.floor(Math.random() * 15) + 80),
          trend: Math.floor(Math.random() * 5),
        },
        network: {
          in: `${Math.floor(Math.random() * 100) + 50} MB/s`,
          out: `${Math.floor(Math.random() * 80) + 30} MB/s`,
          latency: `${Math.floor(Math.random() * 20) + 5} ms`,
        },
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <Activity className="w-3 h-3 text-red-400" />;
    if (trend < 0) return <Activity className="w-3 h-3 text-green-400 rotate-180" />;
    return <Activity className="w-3 h-3 text-gray-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-red-400';
    if (trend < 0) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">资源使用监控</h1>
          <p className="text-slate-400 mt-1">实时监控系统资源使用情况</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">CPU使用率</span>
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-bold text-white">{metrics.cpu.current}%</span>
            <span className="text-xs text-slate-500 pb-1">峰值 {metrics.cpu.peak}%</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getTrendIcon(metrics.cpu.trend)}
            <span className={`text-xs ${getTrendColor(metrics.cpu.trend)}`}>
              {metrics.cpu.trend > 0 ? '+' : ''}{metrics.cpu.trend}%
            </span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${metrics.cpu.current}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">内存使用率</span>
            <HardDrive className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-bold text-white">{metrics.memory.current}%</span>
            <span className="text-xs text-slate-500 pb-1">峰值 {metrics.memory.peak}%</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getTrendIcon(metrics.memory.trend)}
            <span className={`text-xs ${getTrendColor(metrics.memory.trend)}`}>
              {metrics.memory.trend > 0 ? '+' : ''}{metrics.memory.trend}%
            </span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: `${metrics.memory.current}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">磁盘使用率</span>
            <HardDrive className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-bold text-white">{metrics.disk.current}%</span>
            <span className="text-xs text-slate-500 pb-1">峰值 {metrics.disk.peak}%</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getTrendIcon(metrics.disk.trend)}
            <span className={`text-xs ${getTrendColor(metrics.disk.trend)}`}>
              {metrics.disk.trend > 0 ? '+' : ''}{metrics.disk.trend}%
            </span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: `${metrics.disk.current}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">网络状态</span>
            <Wifi className="w-5 h-5 text-orange-400" />
          </div>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">入站流量</span>
              <span className="text-white font-medium">{metrics.network.in}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">出站流量</span>
              <span className="text-white font-medium">{metrics.network.out}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">网络延迟</span>
              <span className="text-green-400 font-medium">{metrics.network.latency}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">网络连接正常</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">CPU使用趋势</h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {Array.from({ length: 20 }).map((_, index) => (
              <div 
                key={index} 
                className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                style={{ height: `${20 + Math.random() * 70}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">内存使用趋势</h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {Array.from({ length: 20 }).map((_, index) => (
              <div 
                key={index} 
                className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm"
                style={{ height: `${30 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
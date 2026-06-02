'use client';

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Activity, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DeviceMetrics {
  id: string;
  name: string;
  ip: string;
  type: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastUpdate: string;
}

const generateMockMetrics = (): DeviceMetrics[] => [
  { id: 'DEV-001', name: '核心交换机-CORE-01', ip: '192.168.1.1', type: '交换机', cpu: 35, memory: 48, disk: 62, network: 78, status: 'healthy', lastUpdate: new Date().toLocaleTimeString() },
  { id: 'DEV-002', name: '边界防火墙-FW-01', ip: '192.168.1.254', type: '防火墙', cpu: 42, memory: 55, disk: 45, network: 85, status: 'healthy', lastUpdate: new Date().toLocaleTimeString() },
  { id: 'DEV-003', name: '入侵检测系统-IDS-01', ip: '192.168.1.10', type: 'IDS', cpu: 78, memory: 82, disk: 38, network: 92, status: 'warning', lastUpdate: new Date().toLocaleTimeString() },
  { id: 'DEV-004', name: 'Web应用防火墙-WAF-01', ip: '192.168.1.20', type: 'WAF', cpu: 28, memory: 35, disk: 30, network: 65, status: 'healthy', lastUpdate: new Date().toLocaleTimeString() },
  { id: 'DEV-005', name: '负载均衡器-LB-01', ip: '192.168.1.30', type: '负载均衡', cpu: 0, memory: 0, disk: 0, network: 0, status: 'offline', lastUpdate: '-' },
  { id: 'DEV-006', name: '数据库服务器-DB-01', ip: '192.168.2.10', type: '服务器', cpu: 65, memory: 78, disk: 85, network: 45, status: 'warning', lastUpdate: new Date().toLocaleTimeString() },
  { id: 'DEV-007', name: '应用服务器-APP-01', ip: '192.168.2.20', type: '服务器', cpu: 88, memory: 91, disk: 72, network: 55, status: 'error', lastUpdate: new Date().toLocaleTimeString() },
  { id: 'DEV-008', name: '路由器-RT-01', ip: '192.168.0.1', type: '路由器', cpu: 22, memory: 38, disk: 55, network: 42, status: 'healthy', lastUpdate: new Date().toLocaleTimeString() },
];

export function RealtimeMonitor() {
  const [metrics, setMetrics] = useState<DeviceMetrics[]>(generateMockMetrics());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        if (m.status === 'offline') {
          return { ...m, lastUpdate: new Date().toLocaleTimeString() };
        }
        const newCpu = Math.min(100, Math.max(0, m.cpu + (Math.random() - 0.5) * 10));
        const newMemory = Math.min(100, Math.max(0, m.memory + (Math.random() - 0.5) * 5));
        const newNetwork = Math.min(100, Math.max(0, m.network + (Math.random() - 0.5) * 15));
        const newStatus = newCpu > 90 || newMemory > 90 ? 'error' : newCpu > 70 || newMemory > 70 ? 'warning' : 'healthy';
        return {
          ...m,
          cpu: newCpu,
          memory: newMemory,
          network: newNetwork,
          status: newStatus,
          lastUpdate: new Date().toLocaleTimeString(),
        };
      }));
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const filteredMetrics = metrics.filter(m =>
    !searchKeyword || m.name.toLowerCase().includes(searchKeyword.toLowerCase()) || m.ip.includes(searchKeyword)
  );

  const stats = {
    healthy: metrics.filter(m => m.status === 'healthy').length,
    warning: metrics.filter(m => m.status === 'warning').length,
    error: metrics.filter(m => m.status === 'error').length,
    offline: metrics.filter(m => m.status === 'offline').length,
  };

  const getStatusBadge = (status: string) => {
    const config = {
      healthy: { icon: <CheckCircle className="w-4 h-4" />, label: '健康', class: 'bg-green-500/20 text-green-400' },
      warning: { icon: <AlertTriangle className="w-4 h-4" />, label: '警告', class: 'bg-yellow-500/20 text-yellow-400' },
      error: { icon: <XCircle className="w-4 h-4" />, label: '错误', class: 'bg-red-500/20 text-red-400' },
      offline: { icon: <Wifi className="w-4 h-4" />, label: '离线', class: 'bg-gray-500/20 text-gray-400' },
    };
    const { icon, label, class: className } = config[status as keyof typeof config];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
        {icon} {label}
      </span>
    );
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">运行状态实时监测</h2>
        <p className="text-sm text-gray-400 mt-1">实时监控设备关键指标，包括 CPU、内存、磁盘、网络使用率</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded border-gray-500 bg-[#111827] text-blue-500 focus:ring-blue-500"
              />
              自动刷新
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              disabled={!autoRefresh}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value={15}>15秒</option>
              <option value={30}>30秒</option>
              <option value={60}>60秒</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索设备..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
            <button
              onClick={() => setMetrics(generateMockMetrics())}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              手动刷新
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">健康</p>
            <p className="text-xl font-semibold text-green-400">{stats.healthy}</p>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">警告</p>
            <p className="text-xl font-semibold text-yellow-400">{stats.warning}</p>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">错误</p>
            <p className="text-xl font-semibold text-red-400">{stats.error}</p>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
            <Wifi className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">离线</p>
            <p className="text-xl font-semibold text-gray-400">{stats.offline}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMetrics.map((device) => (
          <div
            key={device.id}
            className={`bg-[#1E2736] border rounded-lg p-4 ${
              device.status === 'error' ? 'border-red-500/50' :
              device.status === 'warning' ? 'border-yellow-500/50' :
              device.status === 'offline' ? 'border-gray-500/50' : 'border-[#2A354D]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">{device.name}</h3>
                <p className="text-gray-400 text-sm">{device.ip} · {device.type}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(device.status)}
                <span className="text-gray-500 text-xs">更新: {device.lastUpdate}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm w-12">CPU</span>
                <div className="flex-1 bg-[#111827] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(device.cpu)}`}
                    style={{ width: `${device.cpu}%` }}
                  />
                </div>
                <span className="text-white text-sm w-12 text-right">{device.cpu.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm w-12">内存</span>
                <div className="flex-1 bg-[#111827] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(device.memory)}`}
                    style={{ width: `${device.memory}%` }}
                  />
                </div>
                <span className="text-white text-sm w-12 text-right">{device.memory.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <HardDrive className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm w-12">磁盘</span>
                <div className="flex-1 bg-[#111827] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(device.disk)}`}
                    style={{ width: `${device.disk}%` }}
                  />
                </div>
                <span className="text-white text-sm w-12 text-right">{device.disk.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm w-12">网络</span>
                <div className="flex-1 bg-[#111827] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(device.network)}`}
                    style={{ width: `${device.network}%` }}
                  />
                </div>
                <span className="text-white text-sm w-12 text-right">{device.network.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

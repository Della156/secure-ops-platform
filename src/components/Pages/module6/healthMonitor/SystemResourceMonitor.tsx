'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, MemoryStick, Wifi, Activity, RefreshCw } from 'lucide-react';

export function SystemResourceMonitor() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleString());
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const resources = {
    cpu: { used: 42, total: 100, label: 'CPU 使用率', unit: '%' },
    memory: { used: 2.4, total: 8, label: '内存使用', unit: 'GB' },
    disk: { used: 128, total: 512, label: '磁盘使用', unit: 'GB' },
    network: { used: 156, total: 1000, label: '网络流量', unit: 'Mbps' },
  };

  const processes = [
    { name: 'nginx', cpu: 12, memory: 156 },
    { name: 'api-server', cpu: 25, memory: 512 },
    { name: 'redis', cpu: 3, memory: 256 },
    { name: 'postgres', cpu: 2, memory: 1024 },
    { name: 'worker', cpu: 0, memory: 128 },
  ];

  const getColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">系统资源监控</h2>
          <p className="text-sm text-gray-400 mt-1">实时监控系统资源使用情况</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">上次更新: {lastUpdate}</span>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${autoRefresh ? 'bg-green-600/20 text-green-400' : 'bg-[#2A354D] text-gray-400'}`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? '自动刷新' : '手动刷新'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">{resources.cpu.label}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {resources.cpu.used} <span className="text-sm text-gray-400">{resources.cpu.unit}</span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
            <div className={`h-full ${getColor(resources.cpu.used)} rounded-full transition-all duration-500`} style={{ width: `${resources.cpu.used}%` }} />
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <MemoryStick className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">{resources.memory.label}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {resources.memory.used} <span className="text-sm text-gray-400">{resources.memory.unit}</span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
            <div className={`h-full ${getColor((resources.memory.used / resources.memory.total) * 100)} rounded-full transition-all duration-500`} style={{ width: `${(resources.memory.used / resources.memory.total) * 100}%` }} />
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">{resources.disk.label}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {resources.disk.used} <span className="text-sm text-gray-400">{resources.disk.unit}</span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
            <div className={`h-full ${getColor((resources.disk.used / resources.disk.total) * 100)} rounded-full transition-all duration-500`} style={{ width: `${(resources.disk.used / resources.disk.total) * 100}%` }} />
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-400">{resources.network.label}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {resources.network.used} <span className="text-sm text-gray-400">{resources.network.unit}</span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
            <div className={`h-full ${getColor((resources.network.used / resources.network.total) * 100)} rounded-full transition-all duration-500`} style={{ width: `${(resources.network.used / resources.network.total) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-[#111625] flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">进程资源使用</span>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {processes.map((process, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{process.name}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16">CPU</span>
                    <div className="w-24 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                      <div className={`h-full ${getColor(process.cpu)} rounded-full`} style={{ width: `${process.cpu}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{process.cpu}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16">内存</span>
                    <div className="w-24 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                      <div className={`h-full ${getColor((process.memory / 2048) * 100)} rounded-full`} style={{ width: `${(process.memory / 2048) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-12">{process.memory} MB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemResourceMonitor;
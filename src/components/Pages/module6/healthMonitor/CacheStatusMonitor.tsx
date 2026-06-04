'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Database, Zap, RefreshCw } from 'lucide-react';

interface CacheEntry {
  key: string;
  size: string;
  hits: number;
  misses: number;
  ttl: string;
  status: 'active' | 'expiring';
}

export function CacheStatusMonitor() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleString());
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const mockCache: CacheEntry[] = [
    { key: 'user:admin', size: '2.4 KB', hits: 156, misses: 3, ttl: '5m', status: 'active' },
    { key: 'config:system', size: '1.2 KB', hits: 89, misses: 1, ttl: '1h', status: 'active' },
    { key: 'role:admin', size: '856 B', hits: 234, misses: 5, ttl: '10m', status: 'active' },
    { key: 'token:jwt', size: '512 B', hits: 567, misses: 23, ttl: '30s', status: 'expiring' },
    { key: 'menu:main', size: '3.1 KB', hits: 12, misses: 0, ttl: '1h', status: 'active' },
  ];

  const stats = {
    totalKeys: 128,
    usedMemory: '128 MB',
    maxMemory: '512 MB',
    hitRate: 94.5,
    missRate: 5.5,
  };

  const memoryPercent = (parseFloat(stats.usedMemory) / parseFloat(stats.maxMemory)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">缓存状态监控</h2>
          <p className="text-sm text-gray-400 mt-1">监控缓存使用状态和命中率</p>
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
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">缓存键数量</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalKeys}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">内存使用</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.usedMemory}</div>
          <div className="mt-2 h-1.5 bg-[#111625] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: `${memoryPercent}%` }}
            />
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">命中率</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.hitRate}%</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">未命中率</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.missRate}%</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-[#111625]">
          <span className="text-sm font-medium text-white">缓存条目</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">缓存键</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">大小</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">命中</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">未命中</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">TTL</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
            </tr>
          </thead>
          <tbody>
            {mockCache.map((entry) => (
              <tr key={entry.key} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3 font-medium text-white font-mono text-sm">{entry.key}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{entry.size}</td>
                <td className="px-4 py-3 text-sm text-green-400">{entry.hits}</td>
                <td className="px-4 py-3 text-sm text-red-400">{entry.misses}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{entry.ttl}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${entry.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {entry.status === 'active' ? '活跃' : '即将过期'}
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

export default CacheStatusMonitor;
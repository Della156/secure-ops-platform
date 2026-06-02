'use client';

import React, { useState } from 'react';
import { Search, Play, Square, RefreshCw, Settings, Activity } from 'lucide-react';

interface CheckMode {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  runCount: number;
  lastRun: string;
}

const mockData: CheckMode[] = [
  { id: 'MODE-001', name: '全量检查模式', description: '检查所有业务服务的完整状态', status: 'active', runCount: 156, lastRun: '2026-06-02 08:00:00' },
  { id: 'MODE-002', name: '快速检查模式', description: '仅检查核心服务的关键指标', status: 'active', runCount: 342, lastRun: '2026-06-02 10:30:00' },
  { id: 'MODE-003', name: '深度检查模式', description: '详细检查所有服务的各项指标', status: 'inactive', runCount: 23, lastRun: '2026-06-01 22:00:00' },
  { id: 'MODE-004', name: '定时检查模式', description: '按预设时间间隔自动执行检查', status: 'active', runCount: 892, lastRun: '2026-06-02 10:00:00' },
  { id: 'MODE-005', name: '异常触发模式', description: '检测到异常时自动触发检查', status: 'active', runCount: 45, lastRun: '2026-06-02 09:15:00' },
];

export function MultiModeCheck() {
  const [data] = useState<CheckMode[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    active: data.filter(d => d.status === 'active').length,
    inactive: data.filter(d => d.status === 'inactive').length,
    totalRuns: data.reduce((sum, d) => sum + d.runCount, 0),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">停用</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">多模式业务检查</h2>
        <p className="text-sm text-gray-400 mt-1">支持多种检查模式，满足不同场景的业务检查需求</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">检查模式数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">启用模式</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">停用模式</p>
          <p className="text-2xl font-semibold text-gray-400 mt-1">{stats.inactive}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">累计执行次数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalRuns}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索检查模式..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              新建检查模式
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {filteredData.map((item) => (
            <div key={item.id} className={`bg-[#111827] rounded-lg p-4 ${item.status === 'active' ? 'border border-green-500/30' : 'border border-[#2A354D]'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-medium">{item.name}</h3>
                </div>
                {getStatusBadge(item.status)}
              </div>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">执行次数: <span className="text-gray-400">{item.runCount}</span></p>
                  <p className="text-xs text-gray-500">上次执行: <span className="text-gray-400">{item.lastRun}</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-500/20 rounded-lg transition-colors" title="配置">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg transition-colors ${item.status === 'active' ? 'text-red-400 hover:bg-red-500/20' : 'text-green-400 hover:bg-green-500/20'}`} title={item.status === 'active' ? '停止' : '启动'}>
                    {item.status === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
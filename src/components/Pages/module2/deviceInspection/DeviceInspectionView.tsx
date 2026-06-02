'use client';

import React, { useState } from 'react';
import { Search, Filter, Play, FileText, CheckCircle, Clock, Server } from 'lucide-react';

interface InspectionItem {
  id: string;
  name: string;
  device: string;
  status: 'pending' | 'running' | 'completed';
  result: 'success' | 'warning' | 'failed';
  lastRun: string;
  nextRun: string;
}

const mockData: InspectionItem[] = [
  { id: 'INS-001', name: '每日设备巡检', device: '全部设备', status: 'completed', result: 'success', lastRun: '2026-06-02 02:00:00', nextRun: '2026-06-03 02:00:00' },
  { id: 'INS-002', name: '网络设备巡检', device: '网络设备组', status: 'running', result: 'success', lastRun: '-', nextRun: '-' },
  { id: 'INS-003', name: '服务器巡检', device: '服务器组', status: 'completed', result: 'warning', lastRun: '2026-06-02 03:00:00', nextRun: '2026-06-03 03:00:00' },
  { id: 'INS-004', name: '安全设备巡检', device: '安全设备组', status: 'pending', result: 'success', lastRun: '2026-06-01 04:00:00', nextRun: '2026-06-02 16:00:00' },
];

export function DeviceInspectionView() {
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = mockData.filter(item =>
    !searchKeyword || item.name.toLowerCase().includes(searchKeyword.toLowerCase()) || item.device.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">进行中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">待执行</span>;
  };

  const getResultBadge = (result: string) => {
    if (result === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />通过</span>;
    if (result === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">有警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">设备巡检</h2>
        <p className="text-sm text-gray-400 mt-1">设备巡检任务列表展示、巡检配置、巡检结果查看</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索巡检任务..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Server className="w-4 h-4" />
              新建巡检任务
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{item.name}</span>
                  {getStatusBadge(item.status)}
                  {getResultBadge(item.result)}
                </div>
                <p className="text-sm text-gray-400">巡检设备: {item.device}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    上次执行: {item.lastRun}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    下次执行: {item.nextRun}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'pending' && (
                  <button className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    立即执行
                  </button>
                )}
                <button className="flex items-center gap-1 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  查看报告
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
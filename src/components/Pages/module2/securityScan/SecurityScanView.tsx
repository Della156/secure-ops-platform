'use client';

import React, { useState } from 'react';
import { Search, Filter, Play, Pause, Trash2, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

interface ScanItem {
  id: string;
  name: string;
  target: string;
  type: string;
  status: 'running' | 'paused' | 'completed';
  progress: number;
  result: 'success' | 'warning' | 'failed';
  startTime: string;
}

const mockData: ScanItem[] = [
  { id: 'SCAN-001', name: '全盘漏洞扫描', target: '所有服务器', type: '漏洞扫描', status: 'completed', progress: 100, result: 'warning', startTime: '2026-06-02 09:00:00' },
  { id: 'SCAN-002', name: 'Web安全扫描', target: 'web-server-01', type: 'Web扫描', status: 'running', progress: 65, result: 'success', startTime: '2026-06-02 10:30:00' },
  { id: 'SCAN-003', name: '配置合规检查', target: 'db-server-01', type: '合规扫描', status: 'completed', progress: 100, result: 'success', startTime: '2026-06-02 08:00:00' },
  { id: 'SCAN-004', name: '恶意软件检测', target: '终端设备', type: '恶意软件', status: 'paused', progress: 40, result: 'success', startTime: '2026-06-02 11:00:00' },
];

export function SecurityScanView() {
  const [data, setData] = useState<ScanItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchSearch = !searchKeyword || item.name.toLowerCase().includes(searchKeyword.toLowerCase()) || item.target.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    return matchSearch && matchType;
  });

  const toggleStatus = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: item.status === 'running' ? 'paused' : 'running' } : item
    ));
  };

  const getResultBadge = (result: string) => {
    if (result === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />通过</span>;
    if (result === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400"><AlertTriangle className="w-3 h-3 inline mr-1" />有风险</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全扫描任务</h2>
        <p className="text-sm text-gray-400 mt-1">扫描任务管理、扫描配置、扫描结果查看</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部类型</option>
                <option value="漏洞扫描">漏洞扫描</option>
                <option value="Web扫描">Web扫描</option>
                <option value="合规扫描">合规扫描</option>
                <option value="恶意软件">恶意软件</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Shield className="w-4 h-4" />
            新建扫描任务
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.type}</span>
                  {getResultBadge(item.result)}
                </div>
                <p className="text-sm text-gray-400">扫描目标: {item.target}</p>
                <p className="text-sm text-gray-500">开始时间: {item.startTime}</p>
                {item.status === 'running' && (
                  <div className="mt-3">
                    <div className="w-64 bg-[#111827] rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <p className="text-sm text-blue-400 mt-1">{item.progress}%</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(item.id)} className={`p-2 rounded-lg transition-colors ${item.status === 'running' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                  {item.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
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
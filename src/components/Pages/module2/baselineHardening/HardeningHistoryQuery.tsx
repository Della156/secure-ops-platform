'use client';

import React, { useState } from 'react';
import { Search, Calendar, Shield, Clock, CheckCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  name: string;
  target: string;
  strategy: string;
  hardeningTime: string;
  status: 'success' | 'failed';
  params: { name: string; oldValue: string; newValue: string }[];
}

const mockHistory: HistoryItem[] = [
  { 
    id: 'HIST-001', 
    name: '系统基线加固', 
    target: 'prod-server-01', 
    strategy: '标准加固策略', 
    hardeningTime: '2026-06-02 10:00:00',
    status: 'success',
    params: [
      { name: 'firewall', oldValue: 'disabled', newValue: 'enabled' },
      { name: 'ssh-port', oldValue: '22', newValue: '2222' },
    ]
  },
  { 
    id: 'HIST-002', 
    name: '数据库加固', 
    target: 'prod-db', 
    strategy: '数据库加固策略', 
    hardeningTime: '2026-06-02 09:30:00',
    status: 'success',
    params: [
      { name: 'max-connections', oldValue: '100', newValue: '200' },
    ]
  },
];

export function HardeningHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter(item => 
    !searchKeyword || item.target.includes(searchKeyword) || item.strategy.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全基线加固历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史加固任务记录查询，加固详情查看，加固前后对比</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索目标或策略..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">历史记录列表</h3>
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedItem?.id === item.id 
                    ? 'bg-blue-600/20 border border-blue-500/50' 
                    : 'bg-[#111827] hover:bg-[#2A354D]/50'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium text-sm">{item.name}</span>
                  </div>
                  {item.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{item.target}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.hardeningTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">加固详情</h3>
          
          {selectedItem ? (
            <div className="space-y-4">
              <div className="bg-[#111827] rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{selectedItem.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    selectedItem.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedItem.status === 'success' ? '成功' : '失败'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                  <div>目标: {selectedItem.target}</div>
                  <div>策略: {selectedItem.strategy}</div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedItem.hardeningTime}
                  </div>
                </div>
                
                <h4 className="text-xs text-gray-400 mb-2">参数变更对比</h4>
                <div className="space-y-2">
                  {selectedItem.params.map((param, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-[#1E2736] p-2 rounded">
                      <span className="text-gray-300">{param.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 line-through">{param.oldValue}</span>
                        <span className="text-green-400">{param.newValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Shield className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">选择记录查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
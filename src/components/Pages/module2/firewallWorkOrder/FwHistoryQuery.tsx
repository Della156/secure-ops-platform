'use client';

import React, { useState } from 'react';
import { Search, Calendar, FileText, GitCompare } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  status: 'completed' | 'cancelled';
  createTime: string;
  completeTime: string;
  beforeConfig: string;
  afterConfig: string;
}

const mockHistory: HistoryItem[] = [
  { 
    id: 'FW-HIST-001', 
    title: '新增DMZ访问策略', 
    status: 'completed',
    createTime: '2026-06-01 09:00:00',
    completeTime: '2026-06-01 09:30:00',
    beforeConfig: '无',
    afterConfig: 'add rule DMZ_IN allow tcp 192.168.1.0/24 -> 10.0.0.0/8 port 80'
  },
  { 
    id: 'FW-HIST-002', 
    title: '删除过期策略', 
    status: 'completed',
    createTime: '2026-05-31 14:00:00',
    completeTime: '2026-05-31 14:15:00',
    beforeConfig: 'add rule OLD_RULE allow tcp any -> 10.0.0.0/8 port 21',
    afterConfig: '已删除'
  },
];

export function FwHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter(item => 
    !searchKeyword || item.title.includes(searchKeyword) || item.id.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略工单任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史工单任务记录查询，策略变更详情查看，变更前后对比</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索工单标题或ID..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">历史工单列表</h3>
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
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">{item.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{item.id}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.createTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">变更详情与对比</h3>
          
          {selectedItem ? (
            <div className="space-y-4">
              <div className="bg-[#111827] rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{selectedItem.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    selectedItem.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {selectedItem.status === 'completed' ? '已完成' : '已取消'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    创建: {selectedItem.createTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    完成: {selectedItem.completeTime}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <GitCompare className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">配置变更对比</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">变更前</p>
                    <div className="p-2 bg-red-500/10 rounded border border-red-500/30">
                      <p className="text-xs text-red-400 font-mono">{selectedItem.beforeConfig}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">变更后</p>
                    <div className="p-2 bg-green-500/10 rounded border border-green-500/30">
                      <p className="text-xs text-green-400 font-mono">{selectedItem.afterConfig}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileText className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">选择工单查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
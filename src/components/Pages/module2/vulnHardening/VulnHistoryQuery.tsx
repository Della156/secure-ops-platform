'use client';

import React, { useState } from 'react';
import { Search, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  name: string;
  vulnId: string;
  target: string;
  repairTime: string;
  status: 'success' | 'failed';
  beforeVersion: string;
  afterVersion: string;
}

const mockHistory: HistoryItem[] = [
  { id: 'HIST-001', name: 'CVE-2024-0001 修复', vulnId: 'CVE-2024-0001', target: 'prod-server-01', repairTime: '2026-06-02 10:00:00', status: 'success', beforeVersion: '1.0.0', afterVersion: '1.0.1' },
  { id: 'HIST-002', name: 'CVE-2024-0002 修复', vulnId: 'CVE-2024-0002', target: 'prod-db', repairTime: '2026-06-02 09:30:00', status: 'success', beforeVersion: '2.0.0', afterVersion: '2.0.1' },
];

export function VulnHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter(item => 
    !searchKeyword || item.vulnId.includes(searchKeyword) || item.target.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全漏洞加固历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史漏洞加固记录查询，加固详情查看，修复前后对比</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索漏洞编号或目标..."
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
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-white font-medium text-sm">{item.name}</span>
                  </div>
                  {item.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="text-red-400">{item.vulnId}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.repairTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">修复详情</h3>
          
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
                  <div>漏洞编号: <span className="text-red-400">{selectedItem.vulnId}</span></div>
                  <div>目标: {selectedItem.target}</div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedItem.repairTime}
                  </div>
                </div>
                
                <h4 className="text-xs text-gray-400 mb-2">版本对比</h4>
                <div className="flex items-center justify-between text-sm bg-[#1E2736] p-2 rounded">
                  <div>
                    <span className="text-gray-500 text-xs">修复前</span>
                    <p className="text-red-400 line-through">{selectedItem.beforeVersion}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">修复后</span>
                    <p className="text-green-400">{selectedItem.afterVersion}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">选择记录查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
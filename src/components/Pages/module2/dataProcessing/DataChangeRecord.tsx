'use client';

import React, { useState } from 'react';
import { Search, Calendar, User, FileText, ChevronRight, ArrowLeftRight, Clock } from 'lucide-react';

interface ChangeRecord {
  id: string;
  changeType: string;
  target: string;
  executor: string;
  executeTime: string;
  beforeValue: string;
  afterValue: string;
  description: string;
}

const mockData: ChangeRecord[] = [
  { id: 'CR-001', changeType: '配置更新', target: 'user-service', executor: 'admin', executeTime: '2026-06-02 10:30:00', beforeValue: 'timeout=30s', afterValue: 'timeout=60s', description: '延长连接超时时间' },
  { id: 'CR-002', changeType: '数据同步', target: 'database', executor: 'system', executeTime: '2026-06-02 09:15:00', beforeValue: 'version=1.0.0', afterValue: 'version=1.0.1', description: '同步用户数据到主库' },
  { id: 'CR-003', changeType: '权限变更', target: 'auth-service', executor: 'admin', executeTime: '2026-06-02 08:45:00', beforeValue: 'role=viewer', afterValue: 'role=admin', description: '提升用户权限' },
  { id: 'CR-004', changeType: '参数调整', target: 'config-service', executor: 'system', executeTime: '2026-06-02 07:30:00', beforeValue: 'max_connections=100', afterValue: 'max_connections=200', description: '增加最大连接数' },
];

export function DataChangeRecord() {
  const [data] = useState<ChangeRecord[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ChangeRecord | null>(null);

  const filteredData = data.filter(item =>
    !searchKeyword || 
    item.target.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.changeType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.executor.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据变更记录</h2>
        <p className="text-sm text-gray-400 mt-1">数据变更的详细记录、变更前后对比、历史查询</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索目标、类型或执行人..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-gray-300">变更记录列表</h3>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedRecord(item)}
                className={`p-4 cursor-pointer hover:bg-[#2A354D]/50 transition-colors ${selectedRecord?.id === item.id ? 'bg-[#2A354D]/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{item.changeType}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.target}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.executor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.executeTime}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedRecord?.id === item.id ? 'rotate-90 text-blue-400' : 'text-gray-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-gray-300">变更详情</h3>
          </div>
          <div className="p-4">
            {selectedRecord ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{selectedRecord.changeType}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{selectedRecord.target}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">变更前</p>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-red-400 font-mono">{selectedRecord.beforeValue}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <ArrowLeftRight className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">变更后</p>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-sm text-green-400 font-mono">{selectedRecord.afterValue}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">变更描述</p>
                  <p className="text-sm text-gray-300">{selectedRecord.description}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-[#2A354D]">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    执行人: {selectedRecord.executor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    执行时间: {selectedRecord.executeTime}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FileText className="w-12 h-12 mb-4 opacity-50" />
                <p>请选择一条变更记录查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
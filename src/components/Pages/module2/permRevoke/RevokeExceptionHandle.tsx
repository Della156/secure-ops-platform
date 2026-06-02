'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, Search } from 'lucide-react';

interface ExceptionItem {
  id: string;
  taskName: string;
  targetUser: string;
  targetPerm: string;
  errorReason: string;
  errorTime: string;
  retryCount: number;
}

const mockExceptions: ExceptionItem[] = [
  { id: 'EXC-001', taskName: '权限回收任务', targetUser: 'user-001', targetPerm: 'admin', errorReason: '用户不存在', errorTime: '2026-06-02 10:00:00', retryCount: 2 },
  { id: 'EXC-002', taskName: '权限回收任务', targetUser: 'user-002', targetPerm: 'write', errorReason: '权限已不存在', errorTime: '2026-06-02 09:30:00', retryCount: 1 },
  { id: 'EXC-003', taskName: '权限回收任务', targetUser: 'user-003', targetPerm: 'read', errorReason: '网络超时', errorTime: '2026-06-02 09:00:00', retryCount: 3 },
];

export function RevokeExceptionHandle() {
  const [exceptions] = useState(mockExceptions);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredExceptions = exceptions.filter(item => 
    !searchKeyword || item.targetUser.includes(searchKeyword) || item.errorReason.includes(searchKeyword)
  );

  const handleRetry = (id: string) => {
    alert(`正在重试任务: ${id}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">回收异常处理</h2>
        <p className="text-sm text-gray-400 mt-1">回收失败时的异常原因分析，手动重试</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索用户或错误原因..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredExceptions.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">{item.taskName}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">目标用户</p>
                    <p className="text-gray-300">{item.targetUser}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">回收权限</p>
                    <p className="text-gray-300">{item.targetPerm}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">错误原因</p>
                    <p className="text-red-400">{item.errorReason}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">错误时间</p>
                    <p className="text-gray-400">{item.errorTime}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <span>重试次数: {item.retryCount}</span>
                  {item.retryCount >= 3 && <span className="text-red-400">已达到最大重试次数</span>}
                </div>
              </div>
              <button 
                onClick={() => handleRetry(item.id)}
                disabled={item.retryCount >= 3}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  item.retryCount >= 3 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
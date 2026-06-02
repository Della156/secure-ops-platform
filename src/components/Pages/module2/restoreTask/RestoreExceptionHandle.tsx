'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Search, XCircle, Info } from 'lucide-react';

interface ExceptionItem {
  id: string;
  taskName: string;
  target: string;
  errorType: string;
  errorMessage: string;
  errorTime: string;
  status: 'pending' | 'handled' | 'resolved';
  suggestedAction: string;
}

const mockData: ExceptionItem[] = [
  { id: 'EX-001', taskName: '用户数据恢复', target: 'user-db', errorType: '备份文件损坏', errorMessage: '无法读取备份文件，文件校验失败', errorTime: '2026-06-02 09:10:00', status: 'pending', suggestedAction: '请检查备份文件完整性，尝试使用其他备份恢复' },
  { id: 'EX-002', taskName: '配置恢复', target: 'config-server', errorType: '网络超时', errorMessage: '连接目标服务器超时', errorTime: '2026-06-02 08:30:00', status: 'handled', suggestedAction: '检查网络连接，稍后重试' },
  { id: 'EX-003', taskName: '代码仓库恢复', target: 'git-server', errorType: '权限不足', errorMessage: '没有足够的权限写入目标目录', errorTime: '2026-06-02 07:45:00', status: 'resolved', suggestedAction: '联系管理员获取写入权限' },
];

export function RestoreExceptionHandle() {
  const [data, setData] = useState<ExceptionItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(item =>
    !searchKeyword || 
    item.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.errorType.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleResolve = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: 'resolved' } : item
    ));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">待处理</span>;
    if (status === 'handled') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">处理中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已解决</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">恢复异常处理</h2>
        <p className="text-sm text-gray-400 mt-1">恢复失败时的自动告警，异常原因分析，手动干预接口</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索任务名称或错误类型..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">{item.taskName}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.target}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">{item.errorType}</span>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-red-400 mb-3">{item.errorMessage}</p>
                <div className="bg-[#111827] border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400">建议操作</span>
                  </div>
                  <p className="text-sm text-yellow-400 mt-1">{item.suggestedAction}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>错误时间: {item.errorTime}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {item.status !== 'resolved' && (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Info className="w-4 h-4" />
                      查看详情
                    </button>
                    <button onClick={() => handleResolve(item.id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      重试恢复
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Search, Play, Square, RefreshCw, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DetectionTask {
  id: string;
  serviceName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'running' | 'completed' | 'failed';
  responseTime: number;
  lastDetection: string;
  successRate: number;
}

const mockData: DetectionTask[] = [
  { id: 'DT-001', serviceName: '用户登录API', endpoint: '/api/auth/login', method: 'POST', status: 'running', responseTime: 125, lastDetection: '2026-06-02 10:30:00', successRate: 99.8 },
  { id: 'DT-002', serviceName: '数据查询API', endpoint: '/api/data/query', method: 'GET', status: 'completed', responseTime: 234, lastDetection: '2026-06-02 10:29:00', successRate: 100 },
  { id: 'DT-003', serviceName: '订单创建API', endpoint: '/api/orders', method: 'POST', status: 'completed', responseTime: 345, lastDetection: '2026-06-02 10:28:00', successRate: 99.5 },
  { id: 'DT-004', serviceName: '支付回调API', endpoint: '/api/payment/callback', method: 'POST', status: 'failed', responseTime: 0, lastDetection: '2026-06-02 10:25:00', successRate: 85.0 },
  { id: 'DT-005', serviceName: '消息推送API', endpoint: '/api/message/push', method: 'POST', status: 'running', responseTime: 89, lastDetection: '2026-06-02 10:30:00', successRate: 99.9 },
];

export function AutomatedDetection() {
  const [data] = useState<DetectionTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.serviceName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.endpoint.includes(searchKeyword)
  );

  const stats = {
    total: data.length,
    running: data.filter(d => d.status === 'running').length,
    completed: data.filter(d => d.status === 'completed').length,
    failed: data.filter(d => d.status === 'failed').length,
    avgSuccessRate: (data.reduce((sum, d) => sum + d.successRate, 0) / data.length).toFixed(1),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">运行中</span>;
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-500/20 text-green-400',
      POST: 'bg-blue-500/20 text-blue-400',
      PUT: 'bg-yellow-500/20 text-yellow-400',
      DELETE: 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${colors[method]}`}>{method}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">业务功能自动化拨测</h2>
        <p className="text-sm text-gray-400 mt-1">自动对业务接口进行拨测，实时监控服务可用性</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">拨测任务数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">运行中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已完成</p>
              <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均成功率</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.avgSuccessRate}%</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索服务名称/接口..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Square className="w-4 h-4" />
              停止全部
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              启动拨测
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">服务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">接口地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">请求方法</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">响应时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">成功率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后拨测</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.serviceName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{item.endpoint}</td>
                  <td className="px-4 py-3">{getMethodBadge(item.method)}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-white">
                    {item.status !== 'failed' ? `${item.responseTime}ms` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.successRate >= 95 ? 'bg-green-500' : item.successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.successRate}%` }} />
                      </div>
                      <span className={`text-sm ${item.successRate >= 95 ? 'text-green-400' : item.successRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{item.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.lastDetection}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors">
                      <RefreshCw className="w-3 h-3" />
                      重试
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
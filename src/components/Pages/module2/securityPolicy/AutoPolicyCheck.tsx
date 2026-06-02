'use client';

import React, { useState } from 'react';
import { Search, Play, Clock, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';

interface PolicyCheckTask {
  id: string;
  taskName: string;
  deviceType: string;
  deviceCount: number;
  triggerMode: 'auto' | 'manual' | 'scheduled';
  scheduleTime?: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  endTime?: string;
  compliantCount: number;
  nonCompliantCount: number;
}

const mockData: PolicyCheckTask[] = [
  { id: 'PCT-001', taskName: '防火墙策略自动检查', deviceType: '防火墙', deviceCount: 6, triggerMode: 'scheduled', scheduleTime: '2026-06-01 02:00:00', status: 'completed', progress: 100, startTime: '2026-06-01 02:00:00', endTime: '2026-06-01 02:35:00', compliantCount: 48, nonCompliantCount: 3 },
  { id: 'PCT-002', taskName: '路由器ACL检查', deviceType: '路由器', deviceCount: 4, triggerMode: 'manual', status: 'running', progress: 65, startTime: '2026-06-01 10:00:00', compliantCount: 12, nonCompliantCount: 5 },
  { id: 'PCT-003', taskName: '交换机端口安全检查', deviceType: '交换机', deviceCount: 12, triggerMode: 'auto', status: 'pending', progress: 0, startTime: '-', compliantCount: 0, nonCompliantCount: 0 },
  { id: 'PCT-004', taskName: 'WAF防护规则检查', deviceType: 'WAF', deviceCount: 2, triggerMode: 'scheduled', scheduleTime: '2026-06-01 06:00:00', status: 'completed', progress: 100, startTime: '2026-06-01 06:00:00', endTime: '2026-06-01 06:15:00', compliantCount: 18, nonCompliantCount: 0 },
  { id: 'PCT-005', taskName: 'IDS签名规则检查', deviceType: 'IDS', deviceCount: 3, triggerMode: 'manual', status: 'failed', progress: 30, startTime: '2026-06-01 09:30:00', compliantCount: 8, nonCompliantCount: 2 },
];

export function AutoPolicyCheck() {
  const [data] = useState<PolicyCheckTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.deviceType.includes(searchKeyword);
    const matchMode = !filterMode || d.triggerMode === filterMode;
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchKeyword && matchMode && matchStatus;
  });

  const stats = {
    total: data.length,
    running: data.filter(d => d.status === 'running').length,
    completed: data.filter(d => d.status === 'completed').length,
    compliant: data.reduce((sum, d) => sum + d.compliantCount, 0),
    nonCompliant: data.reduce((sum, d) => sum + d.nonCompliantCount, 0),
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; icon: any; label: string }> = {
      running: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <Clock className="w-3 h-3 mr-1" />, label: '运行中' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: <CheckCircle className="w-3 h-3 mr-1" />, label: '已完成' },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle className="w-3 h-3 mr-1" />, label: '失败' },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: <Clock className="w-3 h-3 mr-1" />, label: '待执行' },
    };
    const { bg, text, icon, label } = config[status] || config.pending;
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{icon}{label}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全策略自动检查</h2>
        <p className="text-sm text-gray-400 mt-1">自动或定时触发策略检查，自动比对合规性并标记不合规项</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">检查任务</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">运行中</p>
          <p className="text-2xl font-semibold text-blue-400 mt-1">{stats.running}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">已完成</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">合规项</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.compliant}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">不合规项</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">{stats.nonCompliant}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="搜索任务名称..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部触发方式</option>
              <option value="auto">自动触发</option>
              <option value="manual">手动触发</option>
              <option value="scheduled">定时触发</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部状态</option>
              <option value="running">运行中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
              <option value="pending">待执行</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#2A354D] text-white rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              检查规则配置
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              立即检查
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">触发方式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">进度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规/不合规</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">开始时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((task) => (
                <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-gray-400">{task.id}</td>
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{task.taskName}</td>
                  <td className="px-4 py-3 text-sm text-white">{task.deviceType}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${task.triggerMode === 'auto' ? 'bg-purple-500/20 text-purple-400' : task.triggerMode === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {task.triggerMode === 'auto' ? '自动' : task.triggerMode === 'scheduled' ? '定时' : '手动'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                  <td className="px-4 py-3">
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${task.status === 'completed' ? 'bg-green-500' : task.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-green-400">{task.compliantCount} 合规</span>
                    {task.nonCompliantCount > 0 && <span className="text-red-400 ml-2">{task.nonCompliantCount} 不合规</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{task.startTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看详情"><AlertTriangle className="w-4 h-4" /></button>
                      {task.status === 'pending' && <button className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors" title="立即执行"><Play className="w-4 h-4" /></button>}
                    </div>
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

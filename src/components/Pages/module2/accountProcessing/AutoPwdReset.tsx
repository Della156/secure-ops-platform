'use client';

import React, { useState } from 'react';
import { Key, Users, Clock, CheckCircle, XCircle, AlertTriangle, Send, Settings, RefreshCw } from 'lucide-react';

interface ResetTask {
  id: string;
  account: string;
  trigger: 'auto' | 'manual';
  policy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resetTime: string;
  notification: 'sent' | 'pending';
}

const mockData: ResetTask[] = [
  { id: 'PR-001', account: 'user001', trigger: 'auto', policy: '随机生成', status: 'completed', resetTime: '2026-06-02 08:00:00', notification: 'sent' },
  { id: 'PR-002', account: 'user002', trigger: 'manual', policy: '指定密码', status: 'completed', resetTime: '2026-06-02 09:30:00', notification: 'sent' },
  { id: 'PR-003', account: 'user003', trigger: 'auto', policy: '随机生成', status: 'processing', resetTime: '2026-06-02 10:00:00', notification: 'pending' },
  { id: 'PR-004', account: 'user004', trigger: 'auto', policy: '随机生成', status: 'failed', resetTime: '2026-06-02 11:00:00', notification: 'pending' },
  { id: 'PR-005', account: 'user005', trigger: 'manual', policy: '指定密码', status: 'pending', resetTime: '-', notification: 'pending' },
];

export function AutoPwdReset() {
  const [data, setData] = useState<ResetTask[]>(mockData);
  const [policyType, setPolicyType] = useState<'random' | 'specified'>('random');
  const [targetAccounts, setTargetAccounts] = useState('');

  const stats = {
    total: data.length,
    completed: data.filter(d => d.status === 'completed').length,
    processing: data.filter(d => d.status === 'processing').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />已完成</span>;
    if (status === 'processing') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />处理中</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400"><Clock className="w-3 h-3 inline mr-1" />待执行</span>;
  };

  const getNotificationBadge = (notification: string) => {
    if (notification === 'sent') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已通知</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">待通知</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">密码自动重置</h2>
        <p className="text-sm text-gray-400 mt-1">针对合规要求或用户申请，自动执行密码重置操作，重置策略配置（随机生成/指定密码），重置结果通知</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
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
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">处理中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.processing}</p>
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
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">重置策略配置</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">重置方式：</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPolicyType('random')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${policyType === 'random' ? 'bg-blue-600 text-white' : 'bg-[#2A354D] text-gray-400 hover:bg-[#3A456D]'}`}
              >
                随机生成
              </button>
              <button 
                onClick={() => setPolicyType('specified')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${policyType === 'specified' ? 'bg-blue-600 text-white' : 'bg-[#2A354D] text-gray-400 hover:bg-[#3A456D]'}`}
              >
                指定密码
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="输入目标账号（逗号分隔）"
              value={targetAccounts}
              onChange={(e) => setTargetAccounts(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Key className="w-4 h-4" />
            执行重置
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">账号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">触发方式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">重置策略</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">重置时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">通知状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white font-medium">{item.account}</td>
                  <td className="px-4 py-3">
                    {item.trigger === 'auto' ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">自动</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">手动</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.policy}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.resetTime}</td>
                  <td className="px-4 py-3">{getNotificationBadge(item.notification)}</td>
                  <td className="px-4 py-3">
                    {item.notification === 'pending' && (
                      <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs">
                        <Send className="w-3 h-3" />
                        发送通知
                      </button>
                    )}
                    {item.status === 'failed' && (
                      <button className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs">
                        <RefreshCw className="w-3 h-3" />
                        重试
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
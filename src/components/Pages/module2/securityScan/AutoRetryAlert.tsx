'use client';

import React, { useState } from 'react';
import { RefreshCw, Bell, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

interface RetryPolicy {
  id: string;
  name: string;
  maxRetries: number;
  interval: string;
  alertThreshold: number;
  status: 'active' | 'inactive';
}

interface FailedTask {
  id: string;
  name: string;
  target: string;
  failureCount: number;
  lastAttempt: string;
  status: 'pending' | 'retrying' | 'alerted';
}

const mockPolicies: RetryPolicy[] = [
  { id: 'POLICY-001', name: '默认重试策略', maxRetries: 3, interval: '5分钟', alertThreshold: 3, status: 'active' },
  { id: 'POLICY-002', name: '快速重试策略', maxRetries: 5, interval: '2分钟', alertThreshold: 5, status: 'active' },
  { id: 'POLICY-003', name: '保守重试策略', maxRetries: 2, interval: '10分钟', alertThreshold: 2, status: 'inactive' },
];

const mockFailedTasks: FailedTask[] = [
  { id: 'TASK-001', name: '权限分配任务', target: 'user-001', failureCount: 3, lastAttempt: '2026-06-02 10:00:00', status: 'pending' },
  { id: 'TASK-002', name: '权限分配任务', target: 'user-002', failureCount: 5, lastAttempt: '2026-06-02 09:30:00', status: 'alerted' },
  { id: 'TASK-003', name: '权限分配任务', target: 'user-003', failureCount: 2, lastAttempt: '2026-06-02 09:00:00', status: 'retrying' },
];

export function AutoRetryAlert() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [failedTasks, setFailedTasks] = useState(mockFailedTasks);

  const handleRetry = (taskId: string) => {
    setFailedTasks(failedTasks.map(task => 
      task.id === taskId ? { ...task, status: 'retrying' } : task
    ));
    setTimeout(() => {
      setFailedTasks(failedTasks.map(task => 
        task.id === taskId ? { ...task, status: 'pending', failureCount: task.failureCount + 1 } : task
      ));
    }, 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">异常分配自动重试与告警</h2>
        <p className="text-sm text-gray-400 mt-1">分配失败任务的重试策略配置，自动重试执行，重试失败后告警</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">重试策略配置</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              新增策略
            </button>
          </div>
          <div className="space-y-3">
            {policies.map((policy) => (
              <div key={policy.id} className="bg-[#111827] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{policy.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${policy.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {policy.status === 'active' ? '启用' : '禁用'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span>最大重试: {policy.maxRetries}次</span>
                  <span>重试间隔: {policy.interval}</span>
                  <span>告警阈值: {policy.alertThreshold}次</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">失败任务列表</h3>
          <div className="space-y-3">
            {failedTasks.map((task) => (
              <div key={task.id} className="bg-[#111827] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {task.status === 'alerted' ? (
                      <Bell className="w-4 h-4 text-red-400" />
                    ) : task.status === 'retrying' ? (
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-white font-medium text-sm">{task.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.status === 'alerted' ? 'bg-red-500/20 text-red-400' :
                    task.status === 'retrying' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {task.status === 'alerted' ? '已告警' : task.status === 'retrying' ? '重试中' : '待重试'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-2">
                  <span>目标: {task.target}</span>
                  <span>失败次数: {task.failureCount}</span>
                  <span>最后尝试: {task.lastAttempt}</span>
                </div>
                <button 
                  onClick={() => handleRetry(task.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs rounded transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  手动重试
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Save, Clock, Calendar, Settings, CheckCircle, AlertCircle } from 'lucide-react';

export function ScheduledTaskConfig() {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('backup');
  const [cronType, setCronType] = useState('daily');
  const [customCron, setCustomCron] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const cronPresets = {
    daily: '每天 02:00',
    hourly: '每小时',
    weekly: '每周日 01:00',
    monthly: '每月1号 00:00',
    custom: '自定义',
  };

  const taskTypes = [
    { value: 'backup', label: '数据备份' },
    { value: 'health', label: '健康检查' },
    { value: 'cleanup', label: '日志清理' },
    { value: 'update', label: '特征库更新' },
    { value: 'audit', label: '安全审计' },
    { value: 'custom', label: '自定义任务' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">定时任务配置</h2>
        <p className="text-sm text-gray-400 mt-1">任务配置（Cron表达式配置、任务类型、执行参数）</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-300">基本信息</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">任务名称</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="输入任务名称"
                className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">任务类型</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {taskTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-[#111827] text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="enabled" className="text-sm text-gray-300">启用任务</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-[#111827] text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="notifications" className="text-sm text-gray-300">任务通知</label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-300">执行计划</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">预设周期</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(cronPresets).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCronType(key)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${cronType === key ? 'bg-blue-600 text-white' : 'bg-[#111827] text-gray-300 hover:bg-[#2A354D]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {cronType === 'custom' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cron表达式</label>
                <input
                  type="text"
                  value={customCron}
                  onChange={(e) => setCustomCron(e.target.value)}
                  placeholder="秒 分 时 日 月 周"
                  className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-2 p-3 bg-[#111827] rounded-lg">
                  <p className="text-xs text-gray-500">格式说明：</p>
                  <p className="text-xs text-gray-400 mt-1">秒(0-59) 分(0-59) 时(0-23) 日(1-31) 月(1-12) 周(0-6)</p>
                </div>
              </div>
            )}

            <div className="bg-[#111827] rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">下次执行时间: 2026-06-03 02:00:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button className="px-6 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
          取消
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>
    </div>
  );
}
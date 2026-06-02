'use client';

import React, { useState } from 'react';
import { Save, Shield, Target, Clock, Settings, CheckCircle } from 'lucide-react';

export function ScanConfig() {
  const [scanName, setScanName] = useState('');
  const [scanType, setScanType] = useState('vulnerability');
  const [targets, setTargets] = useState('');
  const [scheduleType, setScheduleType] = useState('manual');
  const [customCron, setCustomCron] = useState('');
  const [enabled, setEnabled] = useState(true);

  const scanTypes = [
    { value: 'vulnerability', label: '漏洞扫描' },
    { value: 'web', label: 'Web安全扫描' },
    { value: 'compliance', label: '合规检查' },
    { value: 'malware', label: '恶意软件检测' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">扫描配置</h2>
        <p className="text-sm text-gray-400 mt-1">扫描目标配置、扫描策略配置、扫描频率设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-300">基本配置</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">扫描任务名称</label>
              <input
                type="text"
                value={scanName}
                onChange={(e) => setScanName(e.target.value)}
                placeholder="输入扫描任务名称"
                className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">扫描类型</label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {scanTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">扫描目标</label>
              <textarea
                value={targets}
                onChange={(e) => setTargets(e.target.value)}
                placeholder="输入扫描目标，每行一个"
                className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
              />
              <div className="mt-2 flex items-center gap-2">
                <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                  选择设备
                </button>
                <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                  选择分组
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-300">高级配置</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">执行方式</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setScheduleType('manual')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${scheduleType === 'manual' ? 'bg-blue-600 text-white' : 'bg-[#111827] text-gray-300 hover:bg-[#2A354D]'}`}
                >
                  手动执行
                </button>
                <button
                  onClick={() => setScheduleType('scheduled')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${scheduleType === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-[#111827] text-gray-300 hover:bg-[#2A354D]'}`}
                >
                  定时执行
                </button>
              </div>
            </div>

            {scheduleType === 'scheduled' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cron表达式</label>
                <input
                  type="text"
                  value={customCron}
                  onChange={(e) => setCustomCron(e.target.value)}
                  placeholder="秒 分 时 日 月 周"
                  className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enabled"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-[#111827] text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enabled" className="text-sm text-gray-300">启用扫描任务</label>
            </div>

            <div className="bg-[#111827] rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">下次执行时间: 手动触发</span>
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
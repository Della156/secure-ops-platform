'use client';

import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';

interface StrategyItem {
  id: string;
  name: string;
  vulnId: string;
  fixPlan: string;
  targets: string[];
  enabled: boolean;
}

const mockStrategies: StrategyItem[] = [
  { id: 'STRATEGY-001', name: 'CVE-2024-0001 修复', vulnId: 'CVE-2024-0001', fixPlan: '升级至最新版本', targets: ['prod-server-01', 'prod-server-02'], enabled: true },
  { id: 'STRATEGY-002', name: 'CVE-2024-0002 修复', vulnId: 'CVE-2024-0002', fixPlan: '应用安全补丁', targets: ['prod-db'], enabled: true },
  { id: 'STRATEGY-003', name: 'CVE-2024-0003 修复', vulnId: 'CVE-2024-0003', fixPlan: '修改配置文件', targets: ['app-01'], enabled: false },
];

export function VulnStrategyConfig() {
  const [strategies, setStrategies] = useState(mockStrategies);

  const toggleStrategy = (id: string) => {
    setStrategies(strategies.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全漏洞加固策略制定</h2>
        <p className="text-sm text-gray-400 mt-1">漏洞加固策略的新增、修改、删除、查询，策略包括漏洞编号、修复方案、执行对象</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">漏洞加固策略列表</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增策略
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">{strategy.name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${strategy.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {strategy.enabled ? '启用' : '禁用'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">漏洞编号</p>
                    <p className="text-gray-300">{strategy.vulnId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">修复方案</p>
                    <p className="text-gray-300">{strategy.fixPlan}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">执行对象:</span>
                  {strategy.targets.map((target, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs rounded bg-[#2A354D] text-gray-400">{target}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-[#2A354D] hover:bg-[#3D4A61] rounded-lg text-gray-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toggleStrategy(strategy.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    strategy.enabled ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {strategy.enabled ? '禁用' : '启用'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
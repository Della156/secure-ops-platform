'use client';

import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react';

interface AuditRule {
  id: string;
  name: string;
  type: string;
  description: string;
  cycle: string;
  enabled: boolean;
}

const mockRules: AuditRule[] = [
  { id: 'RULE-001', name: '僵尸账号检测', type: '账号审计', description: '检测90天未登录的账号', cycle: '每天', enabled: true },
  { id: 'RULE-002', name: '权限滥用检测', type: '权限审计', description: '检测异常权限使用行为', cycle: '每周', enabled: true },
  { id: 'RULE-003', name: '特权账号审计', type: '账号审计', description: '审计特权账号使用情况', cycle: '每月', enabled: false },
  { id: 'RULE-004', name: '权限继承检测', type: '权限审计', description: '检测不合理的权限继承', cycle: '每周', enabled: true },
];

export function AuditRuleConfig() {
  const [rules, setRules] = useState(mockRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">审计规则与策略配置</h2>
        <p className="text-sm text-gray-400 mt-1">审计规则（如僵尸账号、权限滥用、特权账号）的新增、修改、删除、查询，审计周期配置</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">审计规则列表</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增规则
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{rule.name}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{rule.type}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${rule.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {rule.enabled ? '启用' : '禁用'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{rule.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    审计周期: {rule.cycle}
                  </span>
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
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    rule.enabled ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {rule.enabled ? '禁用' : '启用'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Shield, XCircle } from 'lucide-react';

interface ComplianceItem {
  id: string;
  policyName: string;
  checkItem: string;
  status: 'compliant' | 'non-compliant';
  baseline: string;
  current: string;
  riskLevel: 'high' | 'medium' | 'low';
}

const mockItems: ComplianceItem[] = [
  { id: 'COMP-001', policyName: '策略A', checkItem: '高危端口检查', status: 'non-compliant', baseline: '禁止开放22端口', current: '允许22端口', riskLevel: 'high' },
  { id: 'COMP-002', policyName: '策略B', checkItem: '访问控制检查', status: 'non-compliant', baseline: '禁止any->any', current: '允许any->any', riskLevel: 'high' },
  { id: 'COMP-003', policyName: '策略C', checkItem: '协议检查', status: 'compliant', baseline: '仅允许TCP', current: '仅允许TCP', riskLevel: 'low' },
];

export function PolicyComplianceDetect() {
  const [items] = useState(mockItems);

  const stats = {
    total: items.length,
    compliant: items.filter(i => i.status === 'compliant').length,
    nonCompliant: items.filter(i => i.status === 'non-compliant').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略安全合规检测</h2>
        <p className="text-sm text-gray-400 mt-1">自动检测策略是否符合安全基线（如是否允许高危端口），不合规策略识别与展示</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">检测项总数</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">合规</p>
              <p className="text-xl font-semibold text-green-400">{stats.compliant}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">不合规</p>
              <p className="text-xl font-semibold text-red-400">{stats.nonCompliant}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className={`bg-[#1E2736] border rounded-lg p-4 ${
            item.status === 'compliant' ? 'border-green-500/30' : 'border-red-500/30'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className={`w-5 h-5 ${item.status === 'compliant' ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-white font-medium">{item.policyName}</span>
                {item.status === 'compliant' ? (
                  <span className="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-400">合规</span>
                ) : (
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    item.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.riskLevel === 'high' ? '高风险' : item.riskLevel === 'medium' ? '中风险' : '低风险'}
                  </span>
                )}
              </div>
              {item.status === 'compliant' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">检查项</p>
                <p className="text-gray-300">{item.checkItem}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">安全基线</p>
                <p className="text-green-400">{item.baseline}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">当前配置</p>
                <p className={item.status === 'compliant' ? 'text-green-400' : 'text-red-400'}>{item.current}</p>
              </div>
            </div>

            {item.status === 'non-compliant' && (
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                <p className="text-sm text-red-400">
                  ⚠️ 不合规：当前配置 "{item.current}" 不符合安全基线 "{item.baseline}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
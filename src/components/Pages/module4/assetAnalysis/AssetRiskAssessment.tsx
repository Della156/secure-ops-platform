'use client';
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, AlertTriangle, AlertCircle, Info, CheckCircle2, Shield } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const riskLevels = [
  { level: '高风险', count: 23, color: 'red', icon: AlertTriangle },
  { level: '中风险', count: 156, color: 'yellow', icon: AlertCircle },
  { level: '低风险', count: 564, color: 'blue', icon: Info },
  { level: '无风险', count: 800, color: 'green', icon: CheckCircle2 },
];

const riskAssets = [
  { id: 'ASSET-001', name: 'web-server-01', type: '服务器', riskLevel: '高风险', riskScore: 85, riskReason: '存在高危漏洞', lastScan: '2026-06-03 08:00' },
  { id: 'ASSET-002', name: 'db-server-01', type: '数据库', riskLevel: '中风险', riskScore: 55, riskReason: '弱密码检测', lastScan: '2026-06-03 08:05' },
  { id: 'ASSET-003', name: 'api-gateway-01', type: '网络设备', riskLevel: '高风险', riskScore: 92, riskReason: '未授权访问', lastScan: '2026-06-03 08:10' },
  { id: 'ASSET-004', name: 'cdn-node-01', type: '云服务', riskLevel: '低风险', riskScore: 25, riskReason: '配置合规', lastScan: '2026-06-03 08:15' },
];

const levelColors: Record<string, string> = {
  '高风险': 'bg-red-500/20 text-red-400 border-red-500/30',
  '中风险': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  '低风险': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  '无风险': 'bg-green-500/20 text-green-400 border-green-500/30',
};

const scoreColors: Record<string, string> = {
  '高风险': 'bg-red-500',
  '中风险': 'bg-yellow-500',
  '低风险': 'bg-blue-500',
  '无风险': 'bg-green-500',
};

export function AssetRiskAssessment() {
  const [riskFilter, setRiskFilter] = useState('');

  const filteredAssets = riskAssets.filter(asset => {
    if (riskFilter && asset.riskLevel !== riskFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产风险评估" description="评估和管理资产风险"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新评估
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {riskLevels.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.level} className={`bg-[#20293F] border rounded-lg p-4 ${levelColors[item.level as keyof typeof levelColors]}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                  <Icon className={`w-5 h-5 text-${item.color}-400`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{item.count}</div>
                  <div className="text-xs">{item.level}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Filter className="w-4 h-4 text-slate-500" />
        <select
          value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
          className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
        >
          <option value="">全部风险等级</option>
          <option value="高风险">高风险</option>
          <option value="中风险">中风险</option>
          <option value="低风险">低风险</option>
          <option value="无风险">无风险</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className={`bg-[#20293F] border rounded-lg p-4 ${levelColors[asset.riskLevel as keyof typeof levelColors]}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{asset.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-500/20 text-gray-400">{asset.type}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{asset.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{asset.riskScore}</div>
                <div className="text-xs">风险分数</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>风险等级</span>
                  <span>{asset.riskLevel}</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${scoreColors[asset.riskLevel as keyof typeof scoreColors]}`} style={{ width: `${asset.riskScore}%` }} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">风险原因</div>
                <div className="text-sm">{asset.riskReason}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetRiskAssessment;
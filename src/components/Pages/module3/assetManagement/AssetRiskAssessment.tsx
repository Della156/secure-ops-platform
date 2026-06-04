'use client';

import { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const mockAssets = [
  { id: 'asset-001', name: 'Web服务器-01', riskScore: 85, riskLevel: 'high', lastAssessed: '2024-01-15', vulnerabilities: 3 },
  { id: 'asset-002', name: '数据库-01', riskScore: 62, riskLevel: 'medium', lastAssessed: '2024-01-14', vulnerabilities: 2 },
  { id: 'asset-003', name: '终端PC-001', riskScore: 35, riskLevel: 'low', lastAssessed: '2024-01-15', vulnerabilities: 1 },
  { id: 'asset-004', name: '防火墙-01', riskScore: 45, riskLevel: 'low', lastAssessed: '2024-01-13', vulnerabilities: 0 },
  { id: 'asset-005', name: 'Web服务器-02', riskScore: 92, riskLevel: 'high', lastAssessed: '2024-01-15', vulnerabilities: 5 },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getRiskTextColor = (level: string) => {
  switch (level) {
    case 'high': return 'text-red-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-green-400';
    default: return 'text-gray-400';
  }
};

const getRiskBgColor = (level: string) => {
  switch (level) {
    case 'high': return 'bg-red-500/20';
    case 'medium': return 'bg-yellow-500/20';
    case 'low': return 'bg-green-500/20';
    default: return 'bg-gray-500/20';
  }
};

export function AssetRiskAssessment() {
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);

  const stats = {
    totalAssets: mockAssets.length,
    highRisk: mockAssets.filter(a => a.riskLevel === 'high').length,
    mediumRisk: mockAssets.filter(a => a.riskLevel === 'medium').length,
    lowRisk: mockAssets.filter(a => a.riskLevel === 'low').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">资产风险评估</h1>
          <p className="text-slate-400 mt-1">评估和监控资产风险等级</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          执行评估
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">评估资产</span>
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.totalAssets}</div>
        </div>
        <div className="bg-[#20293F] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">高风险</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2">{stats.highRisk}</div>
        </div>
        <div className="bg-[#20293F] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">中风险</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.mediumRisk}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">低风险</span>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.lowRisk}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">资产名称</th>
                <th className="text-left px-4 py-2.5">风险评分</th>
                <th className="text-left px-4 py-2.5">风险等级</th>
                <th className="text-left px-4 py-2.5">漏洞数量</th>
                <th className="text-left px-4 py-2.5">上次评估</th>
              </tr>
            </thead>
            <tbody>
              {mockAssets.map(asset => (
                <tr 
                  key={asset.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedAsset.id === asset.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <td className="px-4 py-3 text-white font-medium">{asset.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#111625] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getRiskColor(asset.riskLevel)}`}
                          style={{ width: `${asset.riskScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getRiskTextColor(asset.riskLevel)}`}>
                        {asset.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${getRiskBgColor(asset.riskLevel)} ${getRiskTextColor(asset.riskLevel)}`}>
                      {asset.riskLevel === 'high' ? '高风险' : asset.riskLevel === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{asset.vulnerabilities}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />{asset.lastAssessed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">评估详情</h3>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                <span className="text-white font-medium">{selectedAsset.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${getRiskBgColor(selectedAsset.riskLevel)} ${getRiskTextColor(selectedAsset.riskLevel)}`}>
                  {selectedAsset.riskLevel === 'high' ? '高风险' : selectedAsset.riskLevel === 'medium' ? '中风险' : '低风险'}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">风险评分</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-[#111625] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getRiskColor(selectedAsset.riskLevel)}`}
                      style={{ width: `${selectedAsset.riskScore}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getRiskTextColor(selectedAsset.riskLevel)}`}>
                    {selectedAsset.riskScore}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">漏洞数量</span>
                  <span className="text-white">{selectedAsset.vulnerabilities} 个</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">上次评估时间</span>
                  <span className="text-white">{selectedAsset.lastAssessed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">评估状态</span>
                  <span className="text-green-400">已完成</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  查看详细报告
                </button>
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                  重新评估
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
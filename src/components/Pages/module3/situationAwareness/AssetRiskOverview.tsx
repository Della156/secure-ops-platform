'use client';

import { useState } from 'react';
import { Server, Shield, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

const mockAssets = [
  { id: 'ASSET-001', name: 'Web服务器群', type: '服务器', riskLevel: 'high', riskScore: 85, change: 5, vulnerabilities: 12 },
  { id: 'ASSET-002', name: '数据库集群', type: '数据库', riskLevel: 'medium', riskScore: 62, change: -3, vulnerabilities: 5 },
  { id: 'ASSET-003', name: '终端设备群', type: '终端', riskLevel: 'medium', riskScore: 58, change: 2, vulnerabilities: 8 },
  { id: 'ASSET-004', name: '网络设备', type: '网络', riskLevel: 'low', riskScore: 35, change: -1, vulnerabilities: 2 },
  { id: 'ASSET-005', name: '云服务实例', type: '云', riskLevel: 'high', riskScore: 78, change: 8, vulnerabilities: 9 },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'low': return 'bg-green-500/20 text-green-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-red-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-green-400';
};

export function AssetRiskOverview() {
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);

  const stats = {
    total: mockAssets.length,
    high: mockAssets.filter(a => a.riskLevel === 'high').length,
    medium: mockAssets.filter(a => a.riskLevel === 'medium').length,
    low: mockAssets.filter(a => a.riskLevel === 'low').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">资产风险概览</h1>
          <p className="text-slate-400 mt-1">全面展示资产风险状况，识别高风险资产</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">资产总数</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">高风险</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.high}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">中风险</span>
            <TrendingUp className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">低风险</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.low}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#111625] text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-4 py-2.5">资产名称</th>
                  <th className="text-left px-4 py-2.5">类型</th>
                  <th className="text-left px-4 py-2.5">风险等级</th>
                  <th className="text-left px-4 py-2.5">风险分数</th>
                  <th className="text-left px-4 py-2.5">较昨日</th>
                  <th className="text-left px-4 py-2.5">漏洞数</th>
                </tr>
              </thead>
              <tbody>
                {mockAssets.map(asset => (
                  <tr 
                    key={asset.id} 
                    className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer ${
                      selectedAsset.id === asset.id ? 'bg-blue-500/10' : ''
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <td className="px-4 py-3 text-white">{asset.name}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{asset.type}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getRiskColor(asset.riskLevel)}`}>
                        {asset.riskLevel === 'high' ? '高' : asset.riskLevel === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                          <div className={`h-full ${asset.riskLevel === 'high' ? 'bg-red-500' : asset.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${asset.riskScore}%` }} />
                        </div>
                        <span className={`text-xs ${getScoreColor(asset.riskScore)}`}>{asset.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs flex items-center gap-1 ${asset.change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {asset.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {asset.change > 0 ? '+' : ''}{asset.change}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{asset.vulnerabilities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">资产详情</h3>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                <div className={`w-12 h-12 rounded-lg ${getRiskColor(selectedAsset.riskLevel)} flex items-center justify-center`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedAsset.name}</p>
                  <p className="text-slate-500 text-xs">{selectedAsset.id}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">风险分数</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-[#111625] rounded-full overflow-hidden">
                      <div className={`h-full ${selectedAsset.riskLevel === 'high' ? 'bg-red-500' : selectedAsset.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${selectedAsset.riskScore}%` }} />
                    </div>
                    <span className={`text-lg font-bold ${getScoreColor(selectedAsset.riskScore)}`}>{selectedAsset.riskScore}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">风险等级</p>
                    <span className={`text-sm ${getRiskColor(selectedAsset.riskLevel)} px-2 py-1 rounded`}>
                      {selectedAsset.riskLevel === 'high' ? '高风险' : selectedAsset.riskLevel === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">漏洞数量</p>
                    <p className="text-sm text-orange-400">{selectedAsset.vulnerabilities} 个</p>
                  </div>
                </div>
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  查看详细报告
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
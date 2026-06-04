'use client';

import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const mockPolicies = [
  { name: '防火墙规则策略', compliance: 95, status: 'compliant', lastCheck: '2024-01-15' },
  { name: '访问控制策略', compliance: 88, status: 'compliant', lastCheck: '2024-01-14' },
  { name: '数据加密策略', compliance: 100, status: 'compliant', lastCheck: '2024-01-13' },
  { name: '入侵检测策略', compliance: 65, status: 'warning', lastCheck: '2024-01-12' },
  { name: '漏洞扫描策略', compliance: 78, status: 'warning', lastCheck: '2024-01-15' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant': return 'text-green-400';
    case 'warning': return 'text-yellow-400';
    case 'non-compliant': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'compliant': return 'bg-green-500/20';
    case 'warning': return 'bg-yellow-500/20';
    case 'non-compliant': return 'bg-red-500/20';
    default: return 'bg-gray-500/20';
  }
};

export function PolicyCompliance() {
  const [selectedPolicy, setSelectedPolicy] = useState(mockPolicies[0]);

  const stats = {
    total: mockPolicies.length,
    compliant: mockPolicies.filter(p => p.status === 'compliant').length,
    warning: mockPolicies.filter(p => p.status === 'warning').length,
    avgCompliance: Math.round(mockPolicies.reduce((sum, p) => sum + p.compliance, 0) / mockPolicies.length),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">策略合规检查</h1>
          <p className="text-slate-400 mt-1">检查策略合规性，确保符合安全标准</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          执行合规检查
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">策略总数</span>
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">合规策略</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.compliant}</div>
        </div>
        <div className="bg-[#20293F] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">待整改</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.warning}</div>
        </div>
        <div className="bg-[#20293F] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">平均合规率</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">{stats.avgCompliance}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">策略名称</th>
                <th className="text-left px-4 py-2.5">合规率</th>
                <th className="text-left px-4 py-2.5">状态</th>
                <th className="text-left px-4 py-2.5">上次检查</th>
              </tr>
            </thead>
            <tbody>
              {mockPolicies.map((policy, index) => (
                <tr 
                  key={index}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedPolicy.name === policy.name ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedPolicy(policy)}
                >
                  <td className="px-4 py-3 text-white font-medium">{policy.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#111625] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            policy.compliance >= 90 ? 'bg-green-500' :
                            policy.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${policy.compliance}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(policy.status)}`}>
                        {policy.compliance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusBgColor(policy.status)} ${getStatusColor(policy.status)}`}>
                      {policy.status === 'compliant' ? '合规' : policy.status === 'warning' ? '待整改' : '不合规'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{policy.lastCheck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">合规详情</h3>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                <span className="text-white font-medium">{selectedPolicy.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${getStatusBgColor(selectedPolicy.status)} ${getStatusColor(selectedPolicy.status)}`}>
                  {selectedPolicy.status === 'compliant' ? '合规' : selectedPolicy.status === 'warning' ? '待整改' : '不合规'}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">合规率</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-[#111625] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        selectedPolicy.compliance >= 90 ? 'bg-green-500' :
                        selectedPolicy.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedPolicy.compliance}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getStatusColor(selectedPolicy.status)}`}>
                    {selectedPolicy.compliance}%
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">上次检查时间</span>
                  <span className="text-white">{selectedPolicy.lastCheck}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">检查状态</span>
                  <span className={`${getStatusColor(selectedPolicy.status)}`}>
                    {selectedPolicy.status === 'compliant' ? '检查通过' : '需要整改'}
                  </span>
                </div>
              </div>
              {selectedPolicy.status !== 'compliant' && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-xs">
                    该策略存在合规问题，建议尽快整改以符合安全标准要求。
                  </p>
                </div>
              )}
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  查看合规报告
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
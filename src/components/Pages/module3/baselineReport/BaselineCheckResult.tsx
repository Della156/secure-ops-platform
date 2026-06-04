'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, CheckCircle2, XCircle, AlertTriangle, PieChart, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const checkResults = [
  { id: 'CR-001', checkItem: '账户策略-密码复杂度', standardValue: '至少8位，包含大小写字母和数字', actualValue: '6位，仅数字', result: 'non-compliant', riskLevel: '高' },
  { id: 'CR-002', checkItem: '账户策略-密码过期', standardValue: '90天', actualValue: '90天', result: 'compliant', riskLevel: '-' },
  { id: 'CR-003', checkItem: '端口策略-不必要端口', standardValue: '仅开放必要端口', actualValue: '开放22,80,443以外端口', result: 'non-compliant', riskLevel: '中' },
  { id: 'CR-004', checkItem: '审计策略-日志记录', standardValue: '记录所有关键操作', actualValue: '记录关键操作', result: 'compliant', riskLevel: '-' },
  { id: 'CR-005', checkItem: '权限策略-最小权限', standardValue: '遵循最小权限原则', actualValue: '存在过度授权', result: 'non-compliant', riskLevel: '中' },
  { id: 'CR-006', checkItem: '加密策略-传输加密', standardValue: 'TLS 1.2+', actualValue: 'TLS 1.2', result: 'compliant', riskLevel: '-' },
  { id: 'CR-007', checkItem: '备份策略-定期备份', standardValue: '每日备份', actualValue: '每周备份', result: 'non-compliant', riskLevel: '低' },
  { id: 'CR-008', checkItem: '更新策略-补丁更新', standardValue: '30天内更新', actualValue: '45天未更新', result: 'non-compliant', riskLevel: '高' },
];

const nonCompliantByType = [
  { type: '账户策略', count: 2, percentage: 25 },
  { type: '端口策略', count: 1, percentage: 12.5 },
  { type: '权限策略', count: 1, percentage: 12.5 },
  { type: '备份策略', count: 1, percentage: 12.5 },
  { type: '更新策略', count: 1, percentage: 12.5 },
  { type: '其他', count: 2, percentage: 25 },
];

const riskLevelStats = {
  high: 2,
  medium: 2,
  low: 1,
};

const resultColors = {
  compliant: 'bg-green-500/20 text-green-400',
  nonCompliant: 'bg-red-500/20 text-red-400',
};

const riskLevelColors = {
  '高': 'bg-red-500/20 text-red-400',
  '中': 'bg-yellow-500/20 text-yellow-400',
  '低': 'bg-blue-500/20 text-blue-400',
  '-': 'bg-slate-500/20 text-slate-400',
};

const typeColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];

export function BaselineCheckResult() {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');

  const filteredResults = checkResults.filter(result => {
    if (search && !result.checkItem.includes(search)) return false;
    if (filterRisk && result.riskLevel !== filterRisk) return false;
    return true;
  });

  const compliantCount = checkResults.filter(r => r.result === 'compliant').length;
  const nonCompliantCount = checkResults.filter(r => r.result === 'non-compliant').length;
  const complianceRate = Math.round((compliantCount / checkResults.length) * 100);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线防护检查结果展示" description="查看基线检查的详细结果和合规情况"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" />导出结果
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#111625" strokeWidth="12" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="#4F46E5" strokeWidth="12" fill="none" strokeDasharray={`${complianceRate * 3.52} 352`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className="text-3xl font-bold text-white">{complianceRate}%</div>
                    <div className="text-xs text-slate-400">合规率</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#111625] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{compliantCount}</div>
                <div className="text-xs text-slate-400">合规项</div>
              </div>
              <div className="bg-[#111625] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{nonCompliantCount}</div>
                <div className="text-xs text-slate-400">不合规项</div>
              </div>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">风险等级分布</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">高风险</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(riskLevelStats.high / checkResults.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-red-400">{riskLevelStats.high}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">中风险</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(riskLevelStats.medium / checkResults.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-yellow-400">{riskLevelStats.medium}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">低风险</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(riskLevelStats.low / checkResults.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-blue-400">{riskLevelStats.low}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-semibold text-white">不合规项分布（按类型）</h4>
            </div>
            <div className="space-y-3">
              {nonCompliantByType.map((item, index) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${typeColors[index % typeColors.length]}`} />
                      <span className="text-xs text-slate-300">{item.type}</span>
                    </div>
                    <span className="text-xs text-white">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${typeColors[index % typeColors.length]}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text" placeholder="搜索检查项..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-4 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
                    className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5 focus:border-blue-500 outline-none"
                  >
                    <option value="">全部风险等级</option>
                    <option value="高">高风险</option>
                    <option value="中">中风险</option>
                    <option value="低">低风险</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#111625]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">检查项</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">标准值</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">实际值</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">结果</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">风险等级</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A354D]">
                  {filteredResults.map(result => (
                    <tr key={result.id} className="hover:bg-[#111625]/50">
                      <td className="px-4 py-3 text-sm text-white">{result.checkItem}</td>
                      <td className="px-4 py-3 text-sm text-green-400">{result.standardValue}</td>
                      <td className="px-4 py-3 text-sm text-red-400">{result.actualValue}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${resultColors[result.result as keyof typeof resultColors]}`}>
                          {result.result === 'compliant' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {result.result === 'compliant' ? '合规' : '不合规'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${riskLevelColors[result.riskLevel as keyof typeof riskLevelColors]}`}>
                          {result.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaselineCheckResult;
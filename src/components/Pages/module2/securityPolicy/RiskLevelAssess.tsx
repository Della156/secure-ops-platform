'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, AlertTriangle, Shield, Eye } from 'lucide-react';

interface RiskPolicy {
  id: string;
  policyName: string;
  policyType: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
  assessmentModel: string;
  status: 'enabled' | 'disabled';
  affectedDevices: number;
  updateTime: string;
}

const mockData: RiskPolicy[] = [
  { id: 'RP-001', policyName: '高危端口开放策略', policyType: '端口安全', riskLevel: 'high', riskFactors: ['22端口开放', '23端口开放', '3389端口开放'], assessmentModel: '高危端口评分模型v1.0', status: 'enabled', affectedDevices: 8, updateTime: '2026-05-20 10:00:00' },
  { id: 'RP-002', policyName: '弱密码策略', policyType: '账户安全', riskLevel: 'high', riskFactors: ['密码复杂度不足', '使用默认密码', '密码未定期更换'], assessmentModel: '弱密码评分模型v1.2', status: 'enabled', affectedDevices: 15, updateTime: '2026-05-18 14:30:00' },
  { id: 'RP-003', policyName: 'ACL规则过宽策略', policyType: '访问控制', riskLevel: 'medium', riskFactors: ['允许any作为源', '允许any作为目标', '允许大范围端口'], assessmentModel: 'ACL评分模型v2.0', status: 'enabled', affectedDevices: 12, updateTime: '2026-05-15 09:15:00' },
  { id: 'RP-004', policyName: '证书过期风险', policyType: '证书安全', riskLevel: 'medium', riskFactors: ['证书即将过期', '证书算法弱'], assessmentModel: '证书评分模型v1.0', status: 'enabled', affectedDevices: 5, updateTime: '2026-05-22 11:45:00' },
  { id: 'RP-005', policyName: '日志未配置策略', policyType: '审计配置', riskLevel: 'low', riskFactors: ['审计日志未开启', '日志保留周期不足'], assessmentModel: '审计评分模型v1.1', status: 'disabled', affectedDevices: 3, updateTime: '2026-04-10 16:00:00' },
];

export function RiskLevelAssess() {
  const [data, setData] = useState<RiskPolicy[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.policyName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.policyType.includes(searchKeyword);
    const matchLevel = !filterLevel || d.riskLevel === filterLevel;
    return matchKeyword && matchLevel;
  });

  const stats = {
    total: data.length,
    high: data.filter(d => d.riskLevel === 'high').length,
    medium: data.filter(d => d.riskLevel === 'medium').length,
    low: data.filter(d => d.riskLevel === 'low').length,
    affectedDevices: data.reduce((sum, d) => sum + d.affectedDevices, 0),
  };

  const getLevelBadge = (level: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      high: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'text-red-400', label: '高风险' },
      medium: { bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'text-yellow-400', label: '中风险' },
      low: { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'text-blue-400', label: '低风险' },
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${config[level]?.bg}`}>{config[level]?.label}</span>;
  };

  const handleToggle = (policy: RiskPolicy) => {
    setData(prev => prev.map(p => p.id === policy.id ? { ...p, status: p.status === 'enabled' ? 'disabled' : 'enabled' } : p));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">策略风险等级评定</h2>
        <p className="text-sm text-gray-400 mt-1">基于策略风险模型自动评定风险等级，配置风险等级规则</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">风险策略总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400/50" />
            <div>
              <p className="text-gray-400 text-xs">高风险</p>
              <p className="text-2xl font-semibold text-red-400 mt-1">{stats.high}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-yellow-400/50" />
            <div>
              <p className="text-gray-400 text-xs">中风险</p>
              <p className="text-2xl font-semibold text-yellow-400 mt-1">{stats.medium}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400/50" />
            <div>
              <p className="text-gray-400 text-xs">低风险</p>
              <p className="text-2xl font-semibold text-blue-400 mt-1">{stats.low}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">受影响设备</p>
          <p className="text-2xl font-semibold text-orange-400 mt-1">{stats.affectedDevices}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="搜索策略名称..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部风险等级</option>
              <option value="high">高风险</option>
              <option value="medium">中风险</option>
              <option value="low">低风险</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增风险规则
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">规则ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">风险等级</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">风险因素</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">评估模型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">受影响设备</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((policy) => (
                <tr key={policy.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-gray-400">{policy.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{policy.policyName}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{policy.policyType}</td>
                  <td className="px-4 py-3">{getLevelBadge(policy.riskLevel)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {policy.riskFactors.slice(0, 2).map((factor, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-[#111827] text-gray-300 rounded">{factor}</span>
                      ))}
                      {policy.riskFactors.length > 2 && <span className="px-2 py-0.5 text-xs text-gray-500">+{policy.riskFactors.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{policy.assessmentModel}</td>
                  <td className="px-4 py-3 text-sm text-orange-400 font-medium">{policy.affectedDevices}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${policy.status === 'enabled' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {policy.status === 'enabled' ? '启用' : '停用'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="查看详情"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleToggle(policy)} className={`p-1.5 hover:rounded transition-colors ${policy.status === 'enabled' ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'}`} title={policy.status === 'enabled' ? '禁用' : '启用'}>
                        <Shield className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="删除"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}

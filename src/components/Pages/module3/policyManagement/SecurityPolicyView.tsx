'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Clock, Plus, Search, Filter } from 'lucide-react';

const mockPolicies = [
  { id: 'pol-001', name: '防火墙规则策略', type: 'firewall', status: 'active', lastUpdated: '2024-01-15', priority: 'high' },
  { id: 'pol-002', name: '访问控制策略', type: 'access', status: 'active', lastUpdated: '2024-01-14', priority: 'medium' },
  { id: 'pol-003', name: '数据加密策略', type: 'encryption', status: 'active', lastUpdated: '2024-01-13', priority: 'high' },
  { id: 'pol-004', name: '入侵检测策略', type: 'ids', status: 'draft', lastUpdated: '2024-01-12', priority: 'medium' },
  { id: 'pol-005', name: '漏洞扫描策略', type: 'scan', status: 'active', lastUpdated: '2024-01-15', priority: 'low' },
];

const getTypeText = (type: string) => {
  switch (type) {
    case 'firewall': return '防火墙规则';
    case 'access': return '访问控制';
    case 'encryption': return '数据加密';
    case 'ids': return '入侵检测';
    case 'scan': return '漏洞扫描';
    default: return '其他';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'low': return 'bg-green-500/20 text-green-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'draft': return 'bg-yellow-500';
    case 'disabled': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export function SecurityPolicyView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(mockPolicies[0]);

  const filteredPolicies = mockPolicies.filter(policy => 
    policy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockPolicies.length,
    active: mockPolicies.filter(p => p.status === 'active').length,
    draft: mockPolicies.filter(p => p.status === 'draft').length,
    disabled: mockPolicies.filter(p => p.status === 'disabled').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">安全策略管理</h1>
          <p className="text-slate-400 mt-1">管理和维护安全策略</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <Plus className="w-4 h-4" />新建策略
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
            <span className="text-xs text-slate-400">已启用</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.active}</div>
        </div>
        <div className="bg-[#20293F] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">草稿</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.draft}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">已禁用</span>
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-400 mt-2">{stats.disabled}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索策略名称..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Filter className="w-3.5 h-3.5" />筛选
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">策略名称</th>
                <th className="text-left px-4 py-2.5">类型</th>
                <th className="text-left px-4 py-2.5">优先级</th>
                <th className="text-left px-4 py-2.5">状态</th>
                <th className="text-left px-4 py-2.5">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map(policy => (
                <tr 
                  key={policy.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedPolicy.id === policy.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedPolicy(policy)}
                >
                  <td className="px-4 py-3 text-white font-medium">{policy.name}</td>
                  <td className="px-4 py-3 text-slate-400">{getTypeText(policy.type)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(policy.priority)}`}>
                      {policy.priority === 'high' ? '高' : policy.priority === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(policy.status)}`} />
                      <span className={`text-xs ${
                        policy.status === 'active' ? 'text-green-400' :
                        policy.status === 'draft' ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {policy.status === 'active' ? '已启用' : policy.status === 'draft' ? '草稿' : '已禁用'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />{policy.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">策略详情</h3>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                <span className="text-white font-medium">{selectedPolicy.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(selectedPolicy.priority)}`}>
                  {selectedPolicy.priority === 'high' ? '高优先级' : selectedPolicy.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">策略ID</p>
                  <p className="text-slate-300 font-mono">{selectedPolicy.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">策略类型</p>
                  <p className="text-slate-300">{getTypeText(selectedPolicy.type)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">当前状态</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedPolicy.status)}`} />
                    <span className={`${
                      selectedPolicy.status === 'active' ? 'text-green-400' :
                      selectedPolicy.status === 'draft' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {selectedPolicy.status === 'active' ? '已启用' : selectedPolicy.status === 'draft' ? '草稿' : '已禁用'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">最后更新时间</p>
                  <p className="text-slate-300">{selectedPolicy.lastUpdated}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  编辑策略
                </button>
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                  {selectedPolicy.status === 'active' ? '禁用策略' : '启用策略'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Lock, User, Search, Filter, Plus } from 'lucide-react';

const mockAccessRules = [
  { id: 'rule-001', dataAsset: '用户数据库', userRole: '管理员', permission: 'full', status: 'active' },
  { id: 'rule-002', dataAsset: '用户数据库', userRole: '运维人员', permission: 'read', status: 'active' },
  { id: 'rule-003', dataAsset: '财务数据', userRole: '管理员', permission: 'full', status: 'active' },
  { id: 'rule-004', dataAsset: '财务数据', userRole: '审计人员', permission: 'read', status: 'active' },
  { id: 'rule-005', dataAsset: '核心代码', userRole: '管理员', permission: 'full', status: 'active' },
];

const getPermissionText = (permission: string) => {
  switch (permission) {
    case 'full': return '完全控制';
    case 'read': return '只读';
    case 'write': return '读写';
    case 'none': return '拒绝访问';
    default: return '未知';
  }
};

const getPermissionColor = (permission: string) => {
  switch (permission) {
    case 'full': return 'bg-red-500/20 text-red-400';
    case 'read': return 'bg-blue-500/20 text-blue-400';
    case 'write': return 'bg-yellow-500/20 text-yellow-400';
    case 'none': return 'bg-gray-500/20 text-gray-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export function DataAccessControl() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = mockAccessRules.filter(rule => 
    rule.dataAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.userRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">数据访问控制</h1>
          <p className="text-slate-400 mt-1">管理数据资产的访问权限</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <Plus className="w-4 h-4" />添加访问规则
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">规则总数</span>
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{mockAccessRules.length}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">活跃规则</span>
            <Lock className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{mockAccessRules.filter(r => r.status === 'active').length}</div>
        </div>
        <div className="bg-[#20293F] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">数据资产数</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">3</div>
        </div>
        <div className="bg-[#20293F] border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">角色数</span>
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">3</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索数据资产或角色..."
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

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">数据资产</th>
              <th className="text-left px-4 py-2.5">用户/角色</th>
              <th className="text-left px-4 py-2.5">权限级别</th>
              <th className="text-left px-4 py-2.5">状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map(rule => (
              <tr key={rule.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                <td className="px-4 py-3 text-white font-medium">{rule.dataAsset}</td>
                <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" />{rule.userRole}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${getPermissionColor(rule.permission)}`}>
                    {getPermissionText(rule.permission)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-green-400">已启用</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {filteredRules.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300" disabled>‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
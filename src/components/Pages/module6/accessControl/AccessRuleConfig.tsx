'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Shield, Lock, Unlock } from 'lucide-react';

interface AccessRule {
  id: string;
  name: string;
  type: 'allow' | 'deny';
  conditions: string;
  priority: number;
  status: 'active' | 'inactive';
}

export function AccessRuleConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const mockRules: AccessRule[] = [
    { id: 'R001', name: '管理员白名单', type: 'allow', conditions: 'IP在192.168.1.0/24且角色为管理员', priority: 1, status: 'active' },
    { id: 'R002', name: '禁止境外访问', type: 'deny', conditions: '地理位置为境外', priority: 2, status: 'active' },
    { id: 'R003', name: 'API限流规则', type: 'deny', conditions: '每分钟调用超过100次', priority: 3, status: 'active' },
    { id: 'R004', name: '运维时段开放', type: 'allow', conditions: '时间在00:00-06:00且角色为运维', priority: 4, status: 'inactive' },
    { id: 'R005', name: '敏感操作保护', type: 'deny', conditions: '非管理员尝试删除操作', priority: 5, status: 'active' },
  ];

  const filteredRules = mockRules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">访问规则配置</h2>
          <p className="text-sm text-gray-400 mt-1">定义细粒度的访问控制规则</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
          <Plus className="w-4 h-4" />
          添加规则
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索规则名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">规则名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">规则类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">匹配条件</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">优先级</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((rule) => (
              <tr key={rule.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3 font-medium text-white">{rule.name}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${rule.type === 'allow' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {rule.type === 'allow' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {rule.type === 'allow' ? '允许' : '拒绝'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 max-w-[300px] truncate">{rule.conditions}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{rule.priority}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    <Shield className="w-3 h-3" />
                    {rule.status === 'active' ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-blue-400">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredRules.length} 条规则</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg w-full max-w-md mx-4">
            <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
              <span className="text-sm font-medium text-white">添加访问规则</span>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">x</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">规则名称</label>
                <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">规则类型</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="allow">允许</option>
                  <option value="deny">拒绝</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">匹配条件</label>
                <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" rows={3} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">优先级</label>
                <input type="number" className="w-full bg-[#111625] border border-[#2A354D] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#354158] text-gray-300 rounded text-sm">取消</button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessRuleConfig;
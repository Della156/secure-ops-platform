'use client';

import { useState } from 'react';
import { Shield, Plus, Search, Filter, Edit3, Trash2, Check } from 'lucide-react';

const mockRoles = [
  { id: 'role-001', name: '管理员', permissions: ['系统设置', '用户管理', '策略管理', '审计日志'], description: '系统最高权限' },
  { id: 'role-002', name: '运维人员', permissions: ['监控查看', '告警处理', '设备管理'], description: '日常运维操作' },
  { id: 'role-003', name: '安全管理员', permissions: ['威胁检测', '策略配置', '合规检查'], description: '安全相关操作' },
  { id: 'role-004', name: '审计人员', permissions: ['日志查看', '报表导出'], description: '审计相关操作' },
];

export function RoleManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(mockRoles[0]);

  const filteredRoles = mockRoles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">角色权限管理</h1>
          <p className="text-slate-400 mt-1">管理系统角色和权限</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <Plus className="w-4 h-4" />新建角色
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">角色总数</span>
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{mockRoles.length}</div>
        </div>
        <div className="bg-[#20293F] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">管理员角色</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">1</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">运维角色</span>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">2</div>
        </div>
        <div className="bg-[#20293F] border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">审计角色</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">1</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索角色名称..."
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
                <th className="text-left px-4 py-2.5">角色名称</th>
                <th className="text-left px-4 py-2.5">权限数量</th>
                <th className="text-left px-4 py-2.5">描述</th>
                <th className="text-right px-4 py-2.5">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => (
                <tr 
                  key={role.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedRole.id === role.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <td className="px-4 py-3 text-white font-medium">{role.name}</td>
                  <td className="px-4 py-3 text-slate-400">{role.permissions.length}</td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{role.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">角色详情</h3>
          {selectedRole && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedRole.name}</p>
                  <span className="text-slate-500 text-xs">{selectedRole.id}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">角色描述</p>
                <p className="text-slate-300 text-sm">{selectedRole.description}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">权限列表</p>
                <div className="space-y-2">
                  {selectedRole.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  编辑角色
                </button>
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                  管理权限
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
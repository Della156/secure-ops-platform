'use client';

import React, { useState } from 'react';
import { Search, Plus, User, Shield, ChevronDown, Check } from 'lucide-react';

interface UserRole {
  id: string;
  username: string;
  roles: string[];
  status: 'active' | 'inactive';
}

export function UserRoleAssignment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);

  const mockUsers: UserRole[] = [
    { id: 'U001', username: 'admin', roles: ['超级管理员', '系统管理员'], status: 'active' },
    { id: 'U002', username: 'user01', roles: ['安全分析师'], status: 'active' },
    { id: 'U003', username: 'user02', roles: ['运维工程师', 'API管理员'], status: 'active' },
    { id: 'U004', username: 'user03', roles: ['审计员'], status: 'inactive' },
    { id: 'U005', username: 'user04', roles: ['普通用户'], status: 'active' },
    { id: 'U006', username: 'user05', roles: ['安全管理员', '运维工程师'], status: 'active' },
  ];

  const availableRoles = ['超级管理员', '系统管理员', '安全管理员', '运维工程师', '安全分析师', 'API管理员', '审计员', '普通用户'];

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">用户角色分配</h2>
          <p className="text-sm text-gray-400 mt-1">管理用户与角色的关联关系</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
          <Plus className="w-4 h-4" />
          批量分配
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索用户名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#111625] flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">用户列表</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center justify-between px-4 py-3 border-t border-[#2A354D] cursor-pointer ${selectedUser?.id === user.id ? 'bg-[#111625]' : 'hover:bg-[#111625]'}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="text-white">{user.username}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#111625] flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">角色分配</span>
            {selectedUser && <span className="ml-auto text-xs text-gray-400">当前用户: {selectedUser.username}</span>}
          </div>
          <div className="p-4">
            {selectedUser ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-3">已分配角色</div>
                {selectedUser.roles.map(role => (
                  <div key={role} className="flex items-center justify-between px-3 py-2 bg-green-500/10 border border-green-500/30 rounded">
                    <span className="text-green-400 text-sm">{role}</span>
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                ))}
                <div className="text-xs text-gray-400 mt-4 mb-3">可分配角色</div>
                {availableRoles
                  .filter(role => !selectedUser.roles.includes(role))
                  .map(role => (
                    <div key={role} className="flex items-center justify-between px-3 py-2 bg-[#111625] border border-[#2A354D] rounded hover:border-blue-500 cursor-pointer">
                      <span className="text-gray-300 text-sm">{role}</span>
                      <Plus className="w-4 h-4 text-gray-500" />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <User className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">请选择一个用户</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRoleAssignment;
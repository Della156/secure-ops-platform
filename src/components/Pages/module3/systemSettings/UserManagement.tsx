'use client';

import { useState } from 'react';
import { User, Plus, Search, Filter, Edit3, Trash2, Shield } from 'lucide-react';

const mockUsers = [
  { id: 'user-001', name: '管理员', username: 'admin', role: 'admin', status: 'active', lastLogin: '2024-01-15 10:30:22' },
  { id: 'user-002', name: '运维人员', username: 'operator', role: 'operator', status: 'active', lastLogin: '2024-01-15 09:15:45' },
  { id: 'user-003', name: '安全管理员', username: 'security', role: 'security', status: 'active', lastLogin: '2024-01-14 16:22:18' },
  { id: 'user-004', name: '审计人员', username: 'auditor', role: 'auditor', status: 'disabled', lastLogin: '2024-01-13 11:45:00' },
];

const getRoleText = (role: string) => {
  switch (role) {
    case 'admin': return '管理员';
    case 'operator': return '运维人员';
    case 'security': return '安全管理员';
    case 'auditor': return '审计人员';
    default: return '普通用户';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'disabled': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    disabled: mockUsers.filter(u => u.status === 'disabled').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">用户管理</h1>
          <p className="text-slate-400 mt-1">管理系统用户和权限</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <Plus className="w-4 h-4" />新建用户
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">用户总数</span>
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">活跃用户</span>
            <User className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.active}</div>
        </div>
        <div className="bg-[#20293F] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">禁用用户</span>
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-400 mt-2">{stats.disabled}</div>
        </div>
        <div className="bg-[#20293F] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">角色数量</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">4</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索用户名称或用户名..."
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
                <th className="text-left px-4 py-2.5">用户名称</th>
                <th className="text-left px-4 py-2.5">用户名</th>
                <th className="text-left px-4 py-2.5">角色</th>
                <th className="text-left px-4 py-2.5">状态</th>
                <th className="text-left px-4 py-2.5">最后登录</th>
                <th className="text-right px-4 py-2.5">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr 
                  key={user.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedUser.id === user.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-400">{user.username}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                      <span className={`text-xs ${user.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                        {user.status === 'active' ? '活跃' : '禁用'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{user.lastLogin}</td>
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
          <h3 className="text-lg font-semibold text-white mb-4">用户详情</h3>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedUser.name}</p>
                  <span className="text-slate-500 text-xs">{selectedUser.username}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">用户ID</p>
                  <p className="text-slate-300 font-mono">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">角色</p>
                  <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {getRoleText(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">状态</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedUser.status)}`} />
                    <span className={`${selectedUser.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                      {selectedUser.status === 'active' ? '活跃' : '禁用'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">最后登录时间</p>
                  <p className="text-slate-300">{selectedUser.lastLogin}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  编辑用户
                </button>
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                  {selectedUser.status === 'active' ? '禁用用户' : '启用用户'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
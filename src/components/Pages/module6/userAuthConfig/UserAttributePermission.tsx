'use client';

import React, { useState } from 'react';
import { Search, Edit2, User, Building2, Tag, Shield, Save } from 'lucide-react';

interface UserAttribute {
  id: string;
  username: string;
  realName: string;
  department: string;
  position: string;
  roles: string[];
  attributes: { key: string; value: string }[];
}

export function UserAttributePermission() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const users: UserAttribute[] = [
    {
      id: 'U-001', username: 'admin', realName: '张三', department: '安全运维中心', position: '经理',
      roles: ['超级管理员'],
      attributes: [
        { key: '邮箱', value: 'admin@example.com' },
        { key: '电话', value: '13800138001' },
        { key: '入职日期', value: '2020-01-01' },
        { key: '级别', value: 'L5' },
      ]
    },
    {
      id: 'U-002', username: 'user01', realName: '李四', department: '安全分析部', position: '威胁分析师',
      roles: ['安全管理员', '普通用户'],
      attributes: [
        { key: '邮箱', value: 'user01@example.com' },
        { key: '电话', value: '13800138002' },
        { key: '入职日期', value: '2021-06-15' },
        { key: '级别', value: 'L3' },
      ]
    },
    {
      id: 'U-003', username: 'user02', realName: '王五', department: '安全运营部', position: '运维工程师',
      roles: ['运维管理员'],
      attributes: [
        { key: '邮箱', value: 'user02@example.com' },
        { key: '电话', value: '13800138003' },
        { key: '入职日期', value: '2022-03-10' },
        { key: '级别', value: 'L4' },
      ]
    },
    {
      id: 'U-004', username: 'user03', realName: '赵六', department: '安全研发部', position: '开发工程师',
      roles: ['普通用户'],
      attributes: [
        { key: '邮箱', value: 'user03@example.com' },
        { key: '电话', value: '13800138004' },
        { key: '入职日期', value: '2023-01-01' },
        { key: '级别', value: 'L2' },
      ]
    },
  ];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUserData = users.find(u => u.id === selectedUser);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">用户属性与权限关联</h2>
          <p className="text-sm text-gray-400 mt-1">实现用户关联组织、角色及信息维护</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-[#20293F] border border-[#2A354D] rounded-lg">
          <div className="px-4 py-3 bg-[#111625] border-b border-[#2A354D]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="p-2">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
                  selectedUser === user.id ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-[#111625]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#111625] flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{user.realName}</div>
                  <div className="text-xs text-gray-500 truncate">{user.username} - {user.department}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          {selectedUserData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#111625] flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{selectedUserData.realName}</h3>
                    <p className="text-sm text-gray-400">{selectedUserData.username} · {selectedUserData.position}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111625] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-400" />
                    组织信息
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">部门</span>
                      <span className="text-sm text-white">{selectedUserData.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">岗位</span>
                      <span className="text-sm text-white">{selectedUserData.position}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111625] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    角色授权
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUserData.roles.map((role, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#111625] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-yellow-400" />
                  扩展属性
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedUserData.attributes.map((attr, i) => (
                    <div key={i} className="bg-[#20293F] rounded p-3">
                      <div className="text-xs text-gray-500">{attr.key}</div>
                      <div className="text-sm text-white mt-1">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#111625] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3">权限范围</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="scope" defaultChecked className="text-blue-600" />
                    <span className="text-sm text-gray-300">全部数据访问权限</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="scope" className="text-blue-600" />
                    <span className="text-sm text-gray-300">仅部门数据访问权限</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="scope" className="text-blue-600" />
                    <span className="text-sm text-gray-300">仅本人数据访问权限</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <User className="w-12 h-12 mb-3 opacity-50" />
              <p>请选择一个用户查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAttributePermission;
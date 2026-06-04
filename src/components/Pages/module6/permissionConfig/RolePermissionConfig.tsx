'use client';

import React, { useState } from 'react';
import { Search, Save, FolderOpen, Settings, Lock, Check, ChevronRight } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
  children?: Permission[];
}

export function RolePermissionConfig() {
  const [selectedRole, setSelectedRole] = useState('安全管理员');
  const [searchTerm, setSearchTerm] = useState('');

  const permissions: Permission[] = [
    {
      id: 'menu', name: '菜单权限', description: '系统菜单访问权限', checked: true,
      children: [
        { id: 'menu-dashboard', name: '控制台', description: '系统控制台', checked: true },
        { id: 'menu-security', name: '安全管理', description: '安全相关菜单', checked: true },
        { id: 'menu-ops', name: '运维管理', description: '运维相关菜单', checked: true },
        { id: 'menu-config', name: '系统配置', description: '系统配置菜单', checked: false },
      ]
    },
    {
      id: 'action', name: '操作权限', description: '功能操作按钮权限', checked: true,
      children: [
        { id: 'action-add', name: '新增', description: '新增数据权限', checked: true },
        { id: 'action-edit', name: '编辑', description: '编辑数据权限', checked: true },
        { id: 'action-delete', name: '删除', description: '删除数据权限', checked: false },
        { id: 'action-export', name: '导出', description: '导出数据权限', checked: true },
      ]
    },
    {
      id: 'data', name: '数据权限', description: '数据访问范围权限', checked: true,
      children: [
        { id: 'data-own', name: '本人数据', description: '仅查看本人数据', checked: true },
        { id: 'data-dept', name: '部门数据', description: '查看部门数据', checked: true },
        { id: 'data-all', name: '全部数据', description: '查看全部数据', checked: false },
      ]
    },
    {
      id: 'system', name: '系统权限', description: '系统管理权限', checked: false,
      children: [
        { id: 'system-user', name: '用户管理', description: '用户账户管理', checked: false },
        { id: 'system-role', name: '角色管理', description: '角色权限管理', checked: false },
        { id: 'system-log', name: '日志管理', description: '系统日志管理', checked: false },
      ]
    },
  ];

  const toggleAll = (parent: Permission) => {
    parent.checked = !parent.checked;
    if (parent.children) {
      parent.children.forEach(child => child.checked = parent.checked);
    }
  };

  const toggleChild = (parent: Permission, child: Permission) => {
    child.checked = !child.checked;
    if (parent.children) {
      parent.checked = parent.children.every(c => c.checked);
    }
  };

  const roles = ['超级管理员', '安全管理员', '运维管理员', '普通用户', '只读用户', '审计员'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">角色权限配置</h2>
          <p className="text-sm text-gray-400 mt-1">实现基于角色的功能菜单与操作按钮权限分配</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索权限..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">选择角色:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">权限分类</h3>
          <div className="space-y-2">
            {permissions.map(p => (
              <div
                key={p.id}
                className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
                  p.checked ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-[#111625] text-gray-300'
                }`}
                onClick={() => toggleAll(p)}
              >
                {p.id === 'menu' && <FolderOpen className="w-4 h-4" />}
                {p.id === 'action' && <Settings className="w-4 h-4" />}
                {p.id === 'data' && <Lock className="w-4 h-4" />}
                {p.id === 'system' && <Settings className="w-4 h-4" />}
                <span className="text-sm">{p.name}</span>
                {p.checked && <Check className="w-4 h-4 ml-auto" />}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="space-y-4">
            {permissions.map(parent => (
              <div key={parent.id} className="bg-[#111625] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={parent.checked}
                      onChange={() => toggleAll(parent)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="font-medium text-white">{parent.name}</span>
                    <span className="text-xs text-gray-500">- {parent.description}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {parent.children?.filter(c => c.checked).length || 0} / {parent.children?.length || 0} 已选
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {parent.children?.map(child => (
                    <div
                      key={child.id}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                        child.checked
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : 'bg-[#20293F] border-transparent hover:border-[#2A354D]'
                      }`}
                      onClick={() => toggleChild(parent, child)}
                    >
                      <input
                        type="checkbox"
                        checked={child.checked}
                        onChange={() => toggleChild(parent, child)}
                        className="w-4 h-4 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{child.name}</div>
                        <div className="text-xs text-gray-500 truncate">{child.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolePermissionConfig;
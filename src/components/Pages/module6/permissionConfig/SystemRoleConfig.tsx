'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Download, User } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface Role {
  id: string;
  name: string;
  code: string;
  status: 'enabled' | 'disabled';
  description: string;
  userCount: number;
  createTime: string;
  updateTime: string;
}

export function SystemRoleConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const roles: Role[] = [
    { id: 'R-001', name: '超级管理员', code: 'super_admin', status: 'enabled', description: '系统最高权限角色', userCount: 2, createTime: '2026-01-01 00:00:00', updateTime: '2026-06-01 10:30:00' },
    { id: 'R-002', name: '安全管理员', code: 'security_admin', status: 'enabled', description: '安全相关权限管理', userCount: 5, createTime: '2026-01-15 09:00:00', updateTime: '2026-05-20 14:20:00' },
    { id: 'R-003', name: '运维管理员', code: 'ops_admin', status: 'enabled', description: '运维相关权限管理', userCount: 8, createTime: '2026-02-01 10:00:00', updateTime: '2026-06-02 09:15:00' },
    { id: 'R-004', name: '普通用户', code: 'normal_user', status: 'enabled', description: '普通操作权限', userCount: 156, createTime: '2026-01-01 00:00:00', updateTime: '2026-06-04 08:00:00' },
    { id: 'R-005', name: '只读用户', code: 'read_only', status: 'disabled', description: '仅查看权限', userCount: 23, createTime: '2026-03-10 16:00:00', updateTime: '2026-04-15 11:30:00' },
    { id: 'R-006', name: '审计员', code: 'auditor', status: 'enabled', description: '审计相关权限', userCount: 3, createTime: '2026-04-01 08:00:00', updateTime: '2026-05-25 15:45:00' },
  ];

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此角色吗？')) {
      console.log('Deleted:', id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">系统角色配置</h2>
          <p className="text-sm text-gray-400 mt-1">实现系统角色的统一配置与状态控制</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            导出
          </button>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            新增角色
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索角色名称或编码..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
            <option>全部状态</option>
            <option>已启用</option>
            <option>已停用</option>
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">角色名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">角色编码</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">描述</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">用户数</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">更新时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{role.name}</div>
                  <div className="text-xs text-gray-500">{role.id}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 font-mono">{role.code}</td>
                <td className="px-4 py-3 text-sm text-gray-300 max-w-[200px] truncate">{role.description}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-sm text-gray-300">
                    <User className="w-3.5 h-3.5" />
                    {role.userCount}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {role.status === 'enabled' ? (
                    <span className="flex items-center gap-1 text-green-400">
                      <ToggleRight className="w-5 h-5" />
                      <span className="text-xs">启用</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500">
                      <ToggleLeft className="w-5 h-5" />
                      <span className="text-xs">停用</span>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{role.updateTime}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredRoles.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增角色">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">角色名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入角色名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">角色编码</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入角色编码（英文）" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={3} placeholder="请输入角色描述" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">状态</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" defaultChecked className="text-blue-600" />
                <span className="text-sm text-gray-300">启用</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" className="text-blue-600" />
                <span className="text-sm text-gray-300">停用</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#20293F] text-gray-300 rounded hover:bg-[#2A354D]">取消</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SystemRoleConfig;
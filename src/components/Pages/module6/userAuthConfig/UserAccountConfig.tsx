'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Download, Mail, Phone, User } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  department: string;
  status: 'enabled' | 'disabled';
  role: string;
  createTime: string;
}

export function UserAccountConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const users: User[] = [
    { id: 'U-001', username: 'admin', realName: '张三', email: 'admin@example.com', phone: '13800138001', department: '安全运维中心', status: 'enabled', role: '超级管理员', createTime: '2026-01-01 00:00:00' },
    { id: 'U-002', username: 'user01', realName: '李四', email: 'user01@example.com', phone: '13800138002', department: '安全分析部', status: 'enabled', role: '安全管理员', createTime: '2026-01-15 09:00:00' },
    { id: 'U-003', username: 'user02', realName: '王五', email: 'user02@example.com', phone: '13800138003', department: '安全运营部', status: 'enabled', role: '运维管理员', createTime: '2026-02-01 10:00:00' },
    { id: 'U-004', username: 'user03', realName: '赵六', email: 'user03@example.com', phone: '13800138004', department: '安全研发部', status: 'disabled', role: '普通用户', createTime: '2026-03-10 16:00:00' },
    { id: 'U-005', username: 'user04', realName: '钱七', email: 'user04@example.com', phone: '13800138005', department: '安全分析部', status: 'enabled', role: '普通用户', createTime: '2026-04-01 08:00:00' },
    { id: 'U-006', username: 'audit01', realName: '孙八', email: 'audit01@example.com', phone: '13800138006', department: '审计部', status: 'enabled', role: '审计员', createTime: '2026-05-15 14:30:00' },
  ];

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">用户账户配置</h2>
          <p className="text-sm text-gray-400 mt-1">实现账户信息维护与状态控制</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            导出
          </button>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            新增用户
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索用户名或姓名..."
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
          <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
            <option>全部部门</option>
            <option>安全运维中心</option>
            <option>安全分析部</option>
            <option>安全运营部</option>
            <option>安全研发部</option>
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">用户名</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">姓名</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">联系方式</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">部门</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">角色</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#111625] flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{user.realName}</td>
                <td className="px-4 py-3">
                  <div className="text-xs">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Mail className="w-3 h-3 text-gray-500" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 mt-0.5">
                      <Phone className="w-3 h-3 text-gray-500" />
                      {user.phone}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{user.department}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  {user.status === 'enabled' ? (
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                      <Edit2 className="w-4 h-4" />
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
          <span className="text-xs text-gray-500">共 {filteredUsers.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增用户">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">用户名</label>
              <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入用户名" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">姓名</label>
              <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入姓名" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">邮箱</label>
              <input type="email" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入邮箱" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">手机号</label>
              <input type="tel" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入手机号" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">部门</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
                <option>安全运维中心</option>
                <option>安全分析部</option>
                <option>安全运营部</option>
                <option>安全研发部</option>
                <option>审计部</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">角色</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
                <option>超级管理员</option>
                <option>安全管理员</option>
                <option>运维管理员</option>
                <option>普通用户</option>
                <option>只读用户</option>
                <option>审计员</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">初始密码</label>
            <input type="password" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入初始密码" />
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

export default UserAccountConfig;
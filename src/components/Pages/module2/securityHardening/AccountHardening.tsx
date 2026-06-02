'use client';

import React, { useState } from 'react';
import { Search, User, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AccountItem {
  id: string;
  username: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  passwordAge: number;
  privileges: string;
}

const mockData: AccountItem[] = [
  { id: 'ACC-001', username: 'admin', role: '管理员', status: 'active', lastLogin: '2026-06-02 10:30:00', passwordAge: 15, privileges: '全部权限' },
  { id: 'ACC-002', username: 'security', role: '安全管理员', status: 'active', lastLogin: '2026-06-02 09:00:00', passwordAge: 30, privileges: '安全管理' },
  { id: 'ACC-003', username: 'operator', role: '操作员', status: 'active', lastLogin: '2026-06-02 08:30:00', passwordAge: 45, privileges: '日常操作' },
  { id: 'ACC-004', username: 'audit', role: '审计员', status: 'inactive', lastLogin: '2026-05-15 10:00:00', passwordAge: 60, privileges: '审计查看' },
  { id: 'ACC-005', username: 'temp_user', role: '临时用户', status: 'locked', lastLogin: '2026-05-01 14:00:00', passwordAge: 31, privileges: '临时访问' },
];

export function AccountHardening() {
  const [data] = useState<AccountItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.username.toLowerCase().includes(searchKeyword.toLowerCase()) || d.role.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    active: data.filter(d => d.status === 'active').length,
    inactive: data.filter(d => d.status === 'inactive').length,
    locked: data.filter(d => d.status === 'locked').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">活跃</span>;
    if (status === 'inactive') return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">非活跃</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">锁定</span>;
  };

  const getPasswordStatus = (age: number) => {
    if (age <= 30) return <span className="text-green-400">正常</span>;
    if (age <= 60) return <span className="text-yellow-400">需更新</span>;
    return <span className="text-red-400">过期</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">账户安全加固</h2>
        <p className="text-sm text-gray-400 mt-1">管理账户安全状态和权限</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">账户总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">活跃</p>
              <p className="text-xl font-semibold text-green-400">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">非活跃</p>
              <p className="text-xl font-semibold text-gray-400">{stats.inactive}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">锁定</p>
              <p className="text-xl font-semibold text-red-400">{stats.locked}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">用户名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">角色</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次登录</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">密码使用天数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">权限</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.role}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.passwordAge}天</span>
                      <span className="text-xs ml-1">{getPasswordStatus(item.passwordAge)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.privileges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Search, User, Key, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Account {
  id: string;
  username: string;
  role: string;
  permissions: string[];
  passwordStatus: 'strong' | 'medium' | 'weak';
  lastChange: string;
  status: 'active' | 'inactive' | 'expired';
}

const mockData: Account[] = [
  { id: 'ACC-001', username: 'admin', role: '超级管理员', permissions: ['ALL'], passwordStatus: 'strong', lastChange: '2026-05-15', status: 'active' },
  { id: 'ACC-002', username: 'dbuser', role: '数据库用户', permissions: ['SELECT', 'INSERT', 'UPDATE'], passwordStatus: 'medium', lastChange: '2026-04-20', status: 'active' },
  { id: 'ACC-003', username: 'readonly', role: '只读用户', permissions: ['SELECT'], passwordStatus: 'weak', lastChange: '2026-03-10', status: 'active' },
  { id: 'ACC-004', username: 'appuser', role: '应用用户', permissions: ['SELECT', 'INSERT'], passwordStatus: 'strong', lastChange: '2026-05-20', status: 'active' },
  { id: 'ACC-005', username: 'testuser', role: '测试用户', permissions: ['SELECT'], passwordStatus: 'weak', lastChange: '2025-12-01', status: 'expired' },
];

export function AccountPermissionCheck() {
  const [data] = useState<Account[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.username.toLowerCase().includes(searchKeyword.toLowerCase()) || d.role.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    strongPassword: data.filter(d => d.passwordStatus === 'strong').length,
    mediumPassword: data.filter(d => d.passwordStatus === 'medium').length,
    weakPassword: data.filter(d => d.passwordStatus === 'weak').length,
    expired: data.filter(d => d.status === 'expired').length,
  };

  const getPasswordBadge = (status: string) => {
    if (status === 'strong') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">强</span>;
    if (status === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">弱</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">活跃</span>;
    if (status === 'inactive') return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">停用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">过期</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">账户权限与口令核查</h2>
        <p className="text-sm text-gray-400 mt-1">检查数据库账户权限配置和口令安全强度</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">账户总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">强密码</p>
              <p className="text-xl font-semibold text-green-400">{stats.strongPassword}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">中强度</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.mediumPassword}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">弱密码</p>
              <p className="text-xl font-semibold text-red-400">{stats.weakPassword}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">过期账户</p>
              <p className="text-xl font-semibold text-red-400">{stats.expired}</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">权限</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">密码强度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次修改</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
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
                  <td className="px-4 py-3 text-sm text-white">{item.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.permissions.map((perm, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs bg-blue-600/20 text-blue-400 rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{getPasswordBadge(item.passwordStatus)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastChange}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors">
                      <Key className="w-3 h-3 inline mr-1" />
                      修改密码
                    </button>
                  </td>
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
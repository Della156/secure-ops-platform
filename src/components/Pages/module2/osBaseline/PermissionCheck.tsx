'use client';

import React, { useState } from 'react';
import { Search, Shield, Lock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface PermissionItem {
  id: string;
  hostname: string;
  ip: string;
  checkItem: string;
  status: 'pass' | 'fail' | 'warning';
  severity: 'high' | 'medium' | 'low';
  details: string;
  affectedResource: string;
  lastCheck: string;
}

const mockData: PermissionItem[] = [
  { id: 'PM-001', hostname: 'server-01', ip: '192.168.2.10', checkItem: 'SELinux状态检查', status: 'pass', severity: 'high', details: 'SELinux已启用并运行在强制模式', affectedResource: '/etc/selinux/config', lastCheck: '2026-06-02 08:00:00' },
  { id: 'PM-002', hostname: 'server-01', ip: '192.168.2.10', checkItem: '文件权限检查', status: 'pass', severity: 'high', details: '关键系统文件权限符合安全要求', affectedResource: '/etc/passwd, /etc/shadow', lastCheck: '2026-06-02 08:00:00' },
  { id: 'PM-003', hostname: 'server-02', ip: '192.168.2.11', checkItem: 'sudoers配置检查', status: 'warning', severity: 'medium', details: '发现1个不必要的sudo权限', affectedResource: '/etc/sudoers', lastCheck: '2026-06-02 08:05:00' },
  { id: 'PM-004', hostname: 'server-03', ip: '192.168.2.12', checkItem: 'root远程登录检查', status: 'fail', severity: 'high', details: 'root账户允许远程SSH登录', affectedResource: '/etc/ssh/sshd_config', lastCheck: '2026-06-02 08:10:00' },
  { id: 'PM-005', hostname: 'server-03', ip: '192.168.2.12', checkItem: '用户组权限检查', status: 'fail', severity: 'high', details: '发现多个用户拥有不适当的组权限', affectedResource: '/etc/group', lastCheck: '2026-06-02 08:10:00' },
];

export function PermissionCheck() {
  const [data] = useState<PermissionItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.hostname.toLowerCase().includes(searchKeyword.toLowerCase()) || d.checkItem.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    pass: data.filter(d => d.status === 'pass').length,
    warning: data.filter(d => d.status === 'warning').length,
    fail: data.filter(d => d.status === 'fail').length,
    highSeverity: data.filter(d => d.severity === 'high').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pass') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">通过</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">高危</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中危</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低危</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">权限与访问策略检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查操作系统的权限配置和访问控制策略</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">检查项总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.pass}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.fail}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">高危项</p>
              <p className="text-xl font-semibold text-red-400">{stats.highSeverity}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">主机名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查项</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">严重程度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">受影响资源</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">详情</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.hostname}</span>
                      <span className="text-xs text-gray-500">({item.ip})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.checkItem}</td>
                  <td className="px-4 py-3">{getSeverityBadge(item.severity)}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.affectedResource}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.details}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastCheck}</td>
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
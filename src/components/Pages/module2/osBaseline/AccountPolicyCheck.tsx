'use client';

import React, { useState } from 'react';
import { Search, User, Key, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AccountPolicy {
  id: string;
  hostname: string;
  ip: string;
  policyType: 'account' | 'password';
  policyName: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  lastCheck: string;
}

const mockData: AccountPolicy[] = [
  { id: 'AP-001', hostname: 'server-01', ip: '192.168.2.10', policyType: 'account', policyName: '账户数量检查', status: 'pass', details: '系统账户数量正常', lastCheck: '2026-06-02 08:00:00' },
  { id: 'AP-002', hostname: 'server-01', ip: '192.168.2.10', policyType: 'password', policyName: '密码复杂度检查', status: 'pass', details: '所有账户密码符合复杂度要求', lastCheck: '2026-06-02 08:00:00' },
  { id: 'AP-003', hostname: 'server-02', ip: '192.168.2.11', policyType: 'password', policyName: '密码过期检查', status: 'warning', details: '2个账户密码即将过期', lastCheck: '2026-06-02 08:05:00' },
  { id: 'AP-004', hostname: 'server-03', ip: '192.168.2.12', policyType: 'account', policyName: '特权账户检查', status: 'fail', details: '发现3个未授权特权账户', lastCheck: '2026-06-02 08:10:00' },
  { id: 'AP-005', hostname: 'server-03', ip: '192.168.2.12', policyType: 'password', policyName: '空密码检查', status: 'fail', details: '发现1个空密码账户', lastCheck: '2026-06-02 08:10:00' },
];

export function AccountPolicyCheck() {
  const [data] = useState<AccountPolicy[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.hostname.toLowerCase().includes(searchKeyword.toLowerCase()) || d.policyName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    pass: data.filter(d => d.status === 'pass').length,
    warning: data.filter(d => d.status === 'warning').length,
    fail: data.filter(d => d.status === 'fail').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pass') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">通过</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  const getPolicyIcon = (type: string) => {
    return type === 'account' ? <User className="w-4 h-4 text-blue-400" /> : <Key className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">账户与口令策略检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查操作系统账户和口令策略的合规性</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">主机名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查项</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">详情</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.hostname}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.ip}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getPolicyIcon(item.policyType)}
                      <span className="text-sm text-gray-400">{item.policyType === 'account' ? '账户' : '口令'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.policyName}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
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
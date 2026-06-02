'use client';

import React, { useState } from 'react';
import { Search, Cpu, AlertTriangle, CheckCircle, XCircle, Settings } from 'lucide-react';

interface KernelParam {
  id: string;
  hostname: string;
  ip: string;
  paramName: string;
  paramValue: string;
  recommendedValue: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  category: 'kernel' | 'network' | 'memory' | 'security';
  lastCheck: string;
}

const mockData: KernelParam[] = [
  { id: 'KP-001', hostname: 'server-01', ip: '192.168.2.10', paramName: 'net.ipv4.ip_forward', paramValue: '0', recommendedValue: '0', status: 'pass', description: '禁用IP转发，符合安全要求', category: 'network', lastCheck: '2026-06-02 08:00:00' },
  { id: 'KP-002', hostname: 'server-01', ip: '192.168.2.10', paramName: 'net.ipv4.tcp_syncookies', paramValue: '1', recommendedValue: '1', status: 'pass', description: '启用SYN Cookies，防止SYN洪水攻击', category: 'network', lastCheck: '2026-06-02 08:00:00' },
  { id: 'KP-003', hostname: 'server-02', ip: '192.168.2.11', paramName: 'kernel.randomize_va_space', paramValue: '1', recommendedValue: '2', status: 'warning', description: '地址空间随机化级别较低', category: 'security', lastCheck: '2026-06-02 08:05:00' },
  { id: 'KP-004', hostname: 'server-03', ip: '192.168.2.12', paramName: 'net.ipv4.icmp_echo_ignore_all', paramValue: '0', recommendedValue: '1', status: 'fail', description: '未禁用ICMP Echo响应', category: 'network', lastCheck: '2026-06-02 08:10:00' },
  { id: 'KP-005', hostname: 'server-03', ip: '192.168.2.12', paramName: 'vm.swappiness', paramValue: '60', recommendedValue: '10', status: 'warning', description: '交换分区使用比例过高', category: 'memory', lastCheck: '2026-06-02 08:10:00' },
];

export function OsKernelCheck() {
  const [data] = useState<KernelParam[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.hostname.toLowerCase().includes(searchKeyword.toLowerCase()) || d.paramName.toLowerCase().includes(searchKeyword.toLowerCase())
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

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      kernel: 'bg-purple-500/20 text-purple-400',
      network: 'bg-blue-500/20 text-blue-400',
      memory: 'bg-green-500/20 text-green-400',
      security: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
      kernel: '内核',
      network: '网络',
      memory: '内存',
      security: '安全',
    };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${colors[category]}`}>{labels[category]}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">内核与系统参数检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查操作系统内核参数和系统配置的安全性</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">参数名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">当前值</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">推荐值</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">分类</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.hostname}</span>
                      <span className="text-xs text-gray-500">({item.ip})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-white">{item.paramName}</td>
                  <td className="px-4 py-3 text-sm font-mono text-white">{item.paramValue}</td>
                  <td className="px-4 py-3 text-sm font-mono text-green-400">{item.recommendedValue}</td>
                  <td className="px-4 py-3">{getCategoryBadge(item.category)}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
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
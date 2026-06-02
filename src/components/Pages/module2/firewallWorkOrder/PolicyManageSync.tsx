'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Shield, GitCompare } from 'lucide-react';

interface PolicyItem {
  id: string;
  name: string;
  localVersion: string;
  remoteVersion: string;
  status: 'synced' | 'pending' | 'conflict';
  lastSync: string;
}

const mockPolicies: PolicyItem[] = [
  { id: 'POL-001', name: 'DMZ访问策略', localVersion: 'v2.1', remoteVersion: 'v2.1', status: 'synced', lastSync: '2026-06-02 10:00:00' },
  { id: 'POL-002', name: '内部访问策略', localVersion: 'v1.5', remoteVersion: 'v1.6', status: 'pending', lastSync: '2026-06-02 09:00:00' },
  { id: 'POL-003', name: '外部访问策略', localVersion: 'v3.0', remoteVersion: 'v2.9', status: 'conflict', lastSync: '2026-06-01 18:00:00' },
];

export function PolicyManageSync() {
  const [policies] = useState(mockPolicies);

  const handleSync = (id: string) => {
    console.log('Syncing policy:', id);
  };

  const handleVerify = (id: string) => {
    console.log('Verifying policy:', id);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略管理数据同步</h2>
        <p className="text-sm text-gray-400 mt-1">与防火墙管理平台同步策略信息，同步策略配置，数据一致性校验</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已同步</p>
              <p className="text-xl font-semibold text-green-400">{policies.filter(p => p.status === 'synced').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">待同步</p>
              <p className="text-xl font-semibold text-blue-400">{policies.filter(p => p.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">冲突</p>
              <p className="text-xl font-semibold text-red-400">{policies.filter(p => p.status === 'conflict').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">策略名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">本地版本</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">远端版本</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">上次同步</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{policy.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{policy.localVersion}</td>
                <td className="px-4 py-4 text-sm text-gray-300">{policy.remoteVersion}</td>
                <td className="px-4 py-4">
                  {policy.status === 'synced' && <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">已同步</span>}
                  {policy.status === 'pending' && <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">待同步</span>}
                  {policy.status === 'conflict' && <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">冲突</span>}
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{policy.lastSync}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleSync(policy.id)}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors"
                      title="同步"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleVerify(policy.id)}
                      className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-colors"
                      title="校验"
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
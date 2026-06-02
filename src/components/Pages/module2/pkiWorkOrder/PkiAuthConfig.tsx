'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, CheckCircle, Send, User } from 'lucide-react';

interface AuthConfig {
  id: string;
  userName: string;
  certType: string;
  status: 'active' | 'inactive';
  issueDate: string;
  expireDate: string;
  permissions: string[];
}

const mockConfigs: AuthConfig[] = [
  { id: 'AUTH-001', userName: '张三', certType: 'SSL证书', status: 'active', issueDate: '2026-01-01', expireDate: '2027-01-01', permissions: ['服务器访问', '数据库访问'] },
  { id: 'AUTH-002', userName: '李四', certType: '客户端证书', status: 'active', issueDate: '2026-02-15', expireDate: '2027-02-15', permissions: ['VPN访问'] },
];

export function PkiAuthConfig() {
  const [configs] = useState(mockConfigs);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">PKI授权配置任务</h2>
        <p className="text-sm text-gray-400 mt-1">按工单要求自动创建PKI账号、分配证书、配置权限，配置结果校验，证书信息推送</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">授权配置列表</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增配置
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {configs.map((config) => (
          <div key={config.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{config.userName}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${config.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {config.status === 'active' ? '启用' : '禁用'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">证书类型</p>
                    <p className="text-gray-300 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-blue-400" />
                      {config.certType}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">颁发日期</p>
                    <p className="text-gray-300">{config.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">到期日期</p>
                    <p className="text-gray-300">{config.expireDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">权限</p>
                    <div className="flex flex-wrap gap-1">
                      {config.permissions.map((perm, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-400">{perm}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-[#2A354D] hover:bg-[#3D4A61] rounded-lg text-gray-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                  <Send className="w-4 h-4" />
                  推送证书
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
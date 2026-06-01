'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Key, Shield, Eye, EyeOff, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthConfig {
  id: string;
  name: string;
  type: 'API_KEY' | 'OAUTH2' | 'BASIC' | 'CERTIFICATE';
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}

const mockData: AuthConfig[] = [
  { id: 'AUTH-001', name: '防火墙API密钥', type: 'API_KEY', status: 'active', createdBy: 'admin', createdAt: '2026-05-20', expiresAt: '2026-11-20' },
  { id: 'AUTH-002', name: 'SIEM系统OAuth', type: 'OAUTH2', status: 'active', createdBy: 'secops', createdAt: '2026-05-18', expiresAt: '2026-08-18' },
  { id: 'AUTH-003', name: '数据库基本认证', type: 'BASIC', status: 'inactive', createdBy: 'dba', createdAt: '2026-05-15' },
  { id: 'AUTH-004', name: 'VPN证书认证', type: 'CERTIFICATE', status: 'active', createdBy: 'admin', createdAt: '2026-05-10', expiresAt: '2027-05-10' },
  { id: 'AUTH-005', name: '威胁情报API', type: 'API_KEY', status: 'active', createdBy: 'analyst', createdAt: '2026-05-08', expiresAt: '2026-11-08' },
];

export function ServiceAuthConfig() {
  const [data, setData] = useState<AuthConfig[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const filteredData = data.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !filterType || item.type === filterType;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchQuery && matchType && matchStatus;
  });

  const getTypeBadge = (type: string) => {
    const styles = {
      API_KEY: 'bg-[#0066FF]/20 text-[#0066FF] border-[#0066FF]/30',
      OAUTH2: 'bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30',
      BASIC: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30',
      CERTIFICATE: 'bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]/30',
    };
    const labels = {
      API_KEY: 'API Key',
      OAUTH2: 'OAuth 2.0',
      BASIC: 'Basic Auth',
      CERTIFICATE: '证书认证',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30',
      inactive: 'bg-[#6B7280]/20 text-[#6B7280] border-[#6B7280]/30',
    };
    const labels = {
      active: '启用',
      inactive: '禁用',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个认证配置吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setData(data.map(item => ({
      ...item,
      status: item.status === 'active' ? 'inactive' : 'active'
    })));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">服务认证配置管理</h1>
        <p className="text-[#9CA3AF]">管理系统与外部服务的认证凭证</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索认证配置名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部类型</option>
              <option value="API_KEY">API Key</option>
              <option value="OAUTH2">OAuth 2.0</option>
              <option value="BASIC">Basic Auth</option>
              <option value="CERTIFICATE">证书认证</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增认证
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">认证名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">认证类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">到期时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(item.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.expiresAt ? (
                    <span className={`${new Date(item.expiresAt) < new Date() ? 'text-[#FF3B30]' : 'text-[#9CA3AF]'}`}>
                      {item.expiresAt}
                    </span>
                  ) : (
                    <span className="text-[#6B7280]">永久</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdBy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleStatus(item.id)} className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      item.status === 'active' 
                        ? 'bg-[#FF3B30]/20 text-[#FF3B30] hover:bg-[#FF3B30]/30' 
                        : 'bg-[#00C853]/20 text-[#00C853] hover:bg-[#00C853]/30'
                    }`}>
                      {item.status === 'active' ? '禁用' : '启用'}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Key className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
            <p className="text-[#6B7280]">暂无认证配置</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">新增认证配置</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">认证名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="输入认证名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">认证类型</label>
                <select className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
                  <option value="API_KEY">API Key</option>
                  <option value="OAUTH2">OAuth 2.0</option>
                  <option value="BASIC">Basic Auth</option>
                  <option value="CERTIFICATE">证书认证</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">密钥/凭证</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] pr-10"
                    placeholder="输入密钥或凭证"
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#F3F4F6]"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">到期时间（可选）</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
                取消
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
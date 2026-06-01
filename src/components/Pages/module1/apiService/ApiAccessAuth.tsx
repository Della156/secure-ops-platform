'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Copy, Key, Lock, Eye, EyeOff, Shield, Globe, X, RefreshCw, Package } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastUsed: string;
  permissions: string[];
  rateLimit: string;
  application: string;
}

interface IpWhitelist {
  id: string;
  ip: string;
  description: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface AuthPolicy {
  id: string;
  name: string;
  description: string;
  apiKeys: string[];
  ipWhitelist: string[];
  allowedApis: string[];
  createdAt: string;
}

const mockApiKeys: ApiKey[] = [
  { id: 'KEY-001', name: 'Web应用访问', key: 'sk_abc123def456', secret: 'sc_xyz789pqr012', status: 'active', createdAt: '2026-05-20 10:30:00', lastUsed: '2026-05-25 14:20:00', permissions: ['read', 'write'], rateLimit: '100/min', application: 'Web应用' },
  { id: 'KEY-002', name: '内部系统集成', key: 'sk_ghi789jkl012', secret: 'sc_mno345stu678', status: 'active', createdAt: '2026-05-21 14:20:00', lastUsed: '2026-05-25 10:15:00', permissions: ['read', 'write', 'admin'], rateLimit: '500/min', application: '内部系统' },
  { id: 'KEY-003', name: '测试环境', key: 'sk_pqr345stu678', secret: 'sc_vwx901yz234', status: 'inactive', createdAt: '2026-05-22 09:15:00', lastUsed: '2026-05-23 16:45:00', permissions: ['read'], rateLimit: '50/min', application: '测试环境' },
];

const mockIpWhitelist: IpWhitelist[] = [
  { id: 'IP-001', ip: '192.168.1.100', description: '办公网络', createdAt: '2026-05-20 10:30:00', status: 'active' },
  { id: 'IP-002', ip: '10.0.0.0/24', description: '服务器网段', createdAt: '2026-05-21 14:20:00', status: 'active' },
  { id: 'IP-003', ip: '172.16.0.50', description: '测试服务器', createdAt: '2026-05-22 09:15:00', status: 'inactive' },
  { id: 'IP-004', ip: '10.10.0.0/16', description: '数据中心', createdAt: '2026-05-23 16:45:00', status: 'active' },
];

const mockPolicies: AuthPolicy[] = [
  { id: 'POL-001', name: 'Web应用策略', description: '允许Web应用访问API', apiKeys: ['KEY-001'], ipWhitelist: ['IP-001'], allowedApis: ['API-001', 'API-002'], createdAt: '2026-05-20 10:30:00' },
  { id: 'POL-002', name: '内部系统策略', description: '允许内部系统访问所有API', apiKeys: ['KEY-002'], ipWhitelist: ['IP-001', 'IP-002'], allowedApis: ['API-001', 'API-002', 'API-003', 'API-004'], createdAt: '2026-05-21 14:20:00' },
];

export function ApiAccessAuth() {
  const [activeTab, setActiveTab] = useState<'api-keys' | 'ip-whitelist' | 'policies'>('api-keys');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [ipWhitelist, setIpWhitelist] = useState<IpWhitelist[]>(mockIpWhitelist);
  const [policies, setPolicies] = useState<AuthPolicy[]>(mockPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [editingIp, setEditingIp] = useState<IpWhitelist | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<AuthPolicy | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showKey, setShowKey] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);

  const filteredApiKeys = apiKeys.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.application.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIpWhitelist = ipWhitelist.filter(item => 
    item.ip.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPolicies = policies.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenKeyModal = (item?: ApiKey) => {
    if (item) {
      setEditingKey(item);
      setFormData(item);
    } else {
      setEditingKey(null);
      setFormData({
        name: '',
        status: 'active',
        permissions: ['read'],
        rateLimit: '100/min',
        application: '',
      });
    }
    setEditingIp(null);
    setEditingPolicy(null);
    setIsModalOpen(true);
  };

  const handleOpenIpModal = (item?: IpWhitelist) => {
    if (item) {
      setEditingIp(item);
      setFormData(item);
    } else {
      setEditingIp(null);
      setFormData({
        ip: '',
        description: '',
        status: 'active',
      });
    }
    setEditingKey(null);
    setEditingPolicy(null);
    setIsModalOpen(true);
  };

  const handleOpenPolicyModal = (item?: AuthPolicy) => {
    if (item) {
      setEditingPolicy(item);
      setFormData(item);
    } else {
      setEditingPolicy(null);
      setFormData({
        name: '',
        description: '',
        apiKeys: [],
        ipWhitelist: [],
        allowedApis: [],
      });
    }
    setEditingKey(null);
    setEditingIp(null);
    setIsModalOpen(true);
  };

  const handleSaveKey = () => {
    if (!formData.name) return;

    if (editingKey) {
      setApiKeys(apiKeys.map(item => item.id === editingKey.id ? { ...item, ...formData } as ApiKey : item));
    } else {
      const newKey: ApiKey = {
        id: `KEY-${String(apiKeys.length + 1).padStart(3, '0')}`,
        name: formData.name,
        key: `sk_${Math.random().toString(36).substring(2, 14)}`,
        secret: `sc_${Math.random().toString(36).substring(2, 14)}`,
        status: formData.status,
        createdAt: new Date().toLocaleString('zh-CN'),
        lastUsed: '-',
        permissions: formData.permissions || [],
        rateLimit: formData.rateLimit || '100/min',
        application: formData.application || '',
      };
      setApiKeys([...apiKeys, newKey]);
    }
    setIsModalOpen(false);
  };

  const handleSaveIp = () => {
    if (!formData.ip) return;

    if (editingIp) {
      setIpWhitelist(ipWhitelist.map(item => item.id === editingIp.id ? { ...item, ...formData } as IpWhitelist : item));
    } else {
      const newIp: IpWhitelist = {
        id: `IP-${String(ipWhitelist.length + 1).padStart(3, '0')}`,
        ip: formData.ip,
        description: formData.description || '',
        status: formData.status,
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setIpWhitelist([...ipWhitelist, newIp]);
    }
    setIsModalOpen(false);
  };

  const handleSavePolicy = () => {
    if (!formData.name) return;

    if (editingPolicy) {
      setPolicies(policies.map(item => item.id === editingPolicy.id ? { ...item, ...formData } as AuthPolicy : item));
    } else {
      const newPolicy: AuthPolicy = {
        id: `POL-${String(policies.length + 1).padStart(3, '0')}`,
        name: formData.name,
        description: formData.description || '',
        apiKeys: formData.apiKeys || [],
        ipWhitelist: formData.ipWhitelist || [],
        allowedApis: formData.allowedApis || [],
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setPolicies([...policies, newPolicy]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    if (confirm('确定要删除这个API Key吗？')) {
      setApiKeys(apiKeys.filter(item => item.id !== id));
    }
  };

  const handleDeleteIp = (id: string) => {
    if (confirm('确定要删除这个IP白名单条目吗？')) {
      setIpWhitelist(ipWhitelist.filter(item => item.id !== id));
    }
  };

  const handleDeletePolicy = (id: string) => {
    if (confirm('确定要删除这个授权策略吗？')) {
      setPolicies(policies.filter(item => item.id !== id));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  const handleRegenerate = (id: string) => {
    if (confirm('确定要重新生成密钥吗？')) {
      setApiKeys(apiKeys.map(item => 
        item.id === id 
          ? { ...item, key: `sk_${Math.random().toString(36).substring(2, 14)}`, secret: `sc_${Math.random().toString(36).substring(2, 14)}`, createdAt: new Date().toLocaleString('zh-CN') }
          : item
      ));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      inactive: 'bg-[#4A5570]/20 text-[#9CA3AF] border-[#4A5570]/30',
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

  const togglePermission = (permission: string) => {
    const current = formData.permissions || [];
    const newPerms = current.includes(permission)
      ? current.filter((p: string) => p !== permission)
      : [...current, permission];
    setFormData({ ...formData, permissions: newPerms });
  };

  const toggleApiKeySelection = (keyId: string) => {
    const current = formData.apiKeys || [];
    const newKeys = current.includes(keyId)
      ? current.filter((k: string) => k !== keyId)
      : [...current, keyId];
    setFormData({ ...formData, apiKeys: newKeys });
  };

  const toggleIpSelection = (ipId: string) => {
    const current = formData.ipWhitelist || [];
    const newIps = current.includes(ipId)
      ? current.filter((i: string) => i !== ipId)
      : [...current, ipId];
    setFormData({ ...formData, ipWhitelist: newIps });
  };

  const toggleApiSelection = (apiId: string) => {
    const current = formData.allowedApis || [];
    const newApis = current.includes(apiId)
      ? current.filter((a: string) => a !== apiId)
      : [...current, apiId];
    setFormData({ ...formData, allowedApis: newApis });
  };

  const availableApis = [
    { id: 'API-001', name: '获取威胁情报' },
    { id: 'API-002', name: '执行安全扫描' },
    { id: 'API-003', name: '获取扫描结果' },
    { id: 'API-004', name: '同步资产数据' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务API访问授权管理</h1>
        <p className="text-[#9CA3AF]">管理API密钥、IP白名单和授权策略配置</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-1 bg-[#181F32] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'api-keys' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              <Key className="w-4 h-4" />
              AppKey/AppSecret
            </button>
            <button
              onClick={() => setActiveTab('ip-whitelist')}
              className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'ip-whitelist' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              <Globe className="w-4 h-4" />
              IP白名单
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'policies' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              <Shield className="w-4 h-4" />
              授权策略
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            <button
              onClick={() => {
                if (activeTab === 'api-keys') handleOpenKeyModal();
                else if (activeTab === 'ip-whitelist') handleOpenIpModal();
                else handleOpenPolicyModal();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'api-keys' ? '新增密钥' : activeTab === 'ip-whitelist' ? '新增IP' : '新增策略'}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'api-keys' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#181F32]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">AppKey</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">AppSecret</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">应用</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">权限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredApiKeys.map((item) => (
                <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-[#9CA3AF] font-mono bg-[#181F32] px-2 py-1 rounded">
                        {showKey === item.id ? item.key : item.key.slice(0, 6) + '******'}
                      </code>
                      <button
                        onClick={() => setShowKey(showKey === item.id ? null : item.id)}
                        className="p-1 text-[#9CA3AF] hover:text-[#D1D5DB]"
                        title={showKey === item.id ? '隐藏' : '显示'}
                      >
                        {showKey === item.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(item.key)}
                        className="p-1 text-[#9CA3AF] hover:text-[#D1D5DB]"
                        title="复制"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-[#9CA3AF] font-mono bg-[#181F32] px-2 py-1 rounded">
                        {showSecret === item.id ? item.secret : item.secret.slice(0, 6) + '******'}
                      </code>
                      <button
                        onClick={() => setShowSecret(showSecret === item.id ? null : item.id)}
                        className="p-1 text-[#9CA3AF] hover:text-[#D1D5DB]"
                        title={showSecret === item.id ? '隐藏' : '显示'}
                      >
                        {showSecret === item.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(item.secret)}
                        className="p-1 text-[#9CA3AF] hover:text-[#D1D5DB]"
                        title="复制"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.application}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {item.permissions.map((perm) => (
                        <span key={perm} className="px-2 py-0.5 text-xs bg-[#0066FF]/20 text-[#0066FF] rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRegenerate(item.id)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#FF9100] hover:bg-[#FF9100]/10 rounded transition-colors"
                        title="重新生成"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenKeyModal(item)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteKey(item.id)}
                        className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApiKeys.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[#6B7280]">暂无API Keys</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ip-whitelist' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#181F32]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">IP地址/网段</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredIpWhitelist.map((item) => (
                <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm text-[#F3F4F6] font-mono bg-[#181F32] px-2 py-1 rounded">{item.ip}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenIpModal(item)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIp(item.id)}
                        className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredIpWhitelist.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[#6B7280]">暂无IP白名单</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="space-y-4">
            {filteredPolicies.map((policy) => (
              <div key={policy.id} className="p-4 bg-[#181F32] rounded-lg border border-[#2A354D]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#0066FF]" />
                      <span className="text-[#F3F4F6] font-medium">{policy.name}</span>
                      <span className="text-xs text-[#6B7280]">{policy.id}</span>
                    </div>
                    <p className="text-sm text-[#9CA3AF] mt-1">{policy.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenPolicyModal(policy)}
                      className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#2A354D] rounded transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
                      className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">关联API密钥</p>
                    <div className="flex flex-wrap gap-1">
                      {policy.apiKeys.map((keyId) => (
                        <span key={keyId} className="px-2 py-0.5 text-xs bg-[#0066FF]/20 text-[#0066FF] rounded">
                          {keyId}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">IP白名单</p>
                    <div className="flex flex-wrap gap-1">
                      {policy.ipWhitelist.map((ipId) => (
                        <span key={ipId} className="px-2 py-0.5 text-xs bg-[#00C853]/20 text-[#00C853] rounded">
                          {ipId}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">允许访问的API</p>
                    <div className="flex flex-wrap gap-1">
                      {policy.allowedApis.map((apiId) => (
                        <span key={apiId} className="px-2 py-0.5 text-xs bg-[#6366F1]/20 text-[#6366F1] rounded">
                          {apiId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[#6B7280]">暂无授权策略</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingKey ? '编辑API密钥' : editingIp ? '编辑IP白名单' : editingPolicy ? '编辑授权策略' : 
                 activeTab === 'api-keys' ? '新增API密钥' : activeTab === 'ip-whitelist' ? '新增IP白名单' : '新增授权策略'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {activeTab === 'api-keys' || editingKey ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">名称</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="输入密钥名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">应用</label>
                    <input
                      type="text"
                      value={formData.application || ''}
                      onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="输入应用名称"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">状态</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      >
                        <option value="active">启用</option>
                        <option value="inactive">禁用</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">限流</label>
                      <input
                        type="text"
                        value={formData.rateLimit || '100/min'}
                        onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                        placeholder="100/min"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">权限</label>
                    <div className="flex gap-4">
                      {['read', 'write', 'admin'].map((perm) => (
                        <label key={perm} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(formData.permissions || []).includes(perm)}
                            onChange={() => togglePermission(perm)}
                            className="rounded border-[#2A354D] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                          />
                          <span className="text-sm text-[#D1D5DB] capitalize">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : activeTab === 'ip-whitelist' || editingIp ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">IP地址/网段</label>
                    <input
                      type="text"
                      value={formData.ip || ''}
                      onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono"
                      placeholder="192.168.1.100 或 192.168.1.0/24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">描述</label>
                    <input
                      type="text"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="输入描述"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">状态</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    >
                      <option value="active">启用</option>
                      <option value="inactive">禁用</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">策略名称</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="输入策略名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">描述</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="输入策略描述"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">关联API密钥</label>
                    <div className="flex flex-wrap gap-2">
                      {apiKeys.map((key) => (
                        <label key={key.id} className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] rounded-lg">
                          <input
                            type="checkbox"
                            checked={(formData.apiKeys || []).includes(key.id)}
                            onChange={() => toggleApiKeySelection(key.id)}
                            className="rounded border-[#3A4560] bg-[#2A354D] text-[#4D94FF] focus:ring-[#0066FF]"
                          />
                          <span className="text-sm text-[#D1D5DB]">{key.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">IP白名单</label>
                    <div className="flex flex-wrap gap-2">
                      {ipWhitelist.map((ip) => (
                        <label key={ip.id} className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] rounded-lg">
                          <input
                            type="checkbox"
                            checked={(formData.ipWhitelist || []).includes(ip.id)}
                            onChange={() => toggleIpSelection(ip.id)}
                            className="rounded border-[#3A4560] bg-[#2A354D] text-[#4D94FF] focus:ring-[#0066FF]"
                          />
                          <span className="text-sm text-[#D1D5DB]">{ip.ip}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">允许访问的API</label>
                    <div className="flex flex-wrap gap-2">
                      {availableApis.map((api) => (
                        <label key={api.id} className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] rounded-lg">
                          <input
                            type="checkbox"
                            checked={(formData.allowedApis || []).includes(api.id)}
                            onChange={() => toggleApiSelection(api.id)}
                            className="rounded border-[#3A4560] bg-[#2A354D] text-[#4D94FF] focus:ring-[#0066FF]"
                          />
                          <span className="text-sm text-[#D1D5DB]">{api.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
                取消
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'api-keys' || editingKey) handleSaveKey();
                  else if (activeTab === 'ip-whitelist' || editingIp) handleSaveIp();
                  else handleSavePolicy();
                }}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Key, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ApiAuth {
  id: string;
  apiName: string;
  authType: 'apiKey' | 'token' | 'oauth2' | 'basic';
  key: string;
  secret: string;
  status: 'active' | 'inactive';
  expiresAt: string;
  createTime: string;
}

export function ApiAuthManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mockData: ApiAuth[] = [
    { id: 'AUTH-001', apiName: '用户数据API', authType: 'apiKey', key: 'sk_abc123...', secret: '******', status: 'active', expiresAt: '2027-06-04 10:30:00', createTime: '2026-01-15 09:00:00' },
    { id: 'AUTH-002', apiName: '资产查询API', authType: 'token', key: 'Bearer token...', secret: '-', status: 'active', expiresAt: '2026-12-31 23:59:59', createTime: '2026-02-20 14:30:00' },
    { id: 'AUTH-003', apiName: '告警推送API', authType: 'oauth2', key: 'client_xxx...', secret: '******', status: 'inactive', expiresAt: '2026-07-01 00:00:00', createTime: '2026-03-10 10:00:00' },
    { id: 'AUTH-004', apiName: '日志查询API', authType: 'apiKey', key: 'sk_def456...', secret: '******', status: 'active', expiresAt: '2027-03-15 16:00:00', createTime: '2026-03-15 16:00:00' },
    { id: 'AUTH-005', apiName: '威胁情报API', authType: 'basic', key: 'admin', secret: '******', status: 'active', expiresAt: '-', createTime: '2026-04-01 08:00:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.apiName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAuthTypeLabel = (type: string) => {
    switch (type) {
      case 'apiKey': return 'API Key';
      case 'token': return 'Token';
      case 'oauth2': return 'OAuth2';
      case 'basic': return 'Basic Auth';
      default: return type;
    }
  };

  const getAuthTypeColor = (type: string) => {
    switch (type) {
      case 'apiKey': return 'bg-blue-500/20 text-blue-400';
      case 'token': return 'bg-green-500/20 text-green-400';
      case 'oauth2': return 'bg-purple-500/20 text-purple-400';
      case 'basic': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">API调用鉴权管理</h2>
          <p className="text-sm text-gray-400 mt-1">管理API访问的鉴权方式和凭证，支持多种认证类型</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增鉴权配置
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索API名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">API名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">认证类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">密钥</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">过期时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{item.apiName}</div>
                  <div className="text-xs text-gray-500">{item.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getAuthTypeColor(item.authType)}`}>
                    {getAuthTypeLabel(item.authType)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300 flex items-center gap-1">
                      <Key className="w-3 h-3" />
                      {item.key}
                    </span>
                    <button 
                      onClick={() => handleCopy(item.key)}
                      className="p-1 hover:bg-[#111625] rounded text-gray-500 hover:text-blue-400"
                      title="复制"
                    >
                      {copiedId === item.key ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {item.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.expiresAt}</td>
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
          <span className="text-xs text-gray-500">共 {filteredData.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增鉴权配置">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">API名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入API名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">认证类型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="apiKey">API Key</option>
              <option value="token">Token</option>
              <option value="oauth2">OAuth2</option>
              <option value="basic">Basic Auth</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">密钥</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入密钥" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">密钥密码</label>
            <input type="password" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入密码" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">过期时间</label>
            <input type="datetime-local" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" />
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

export default ApiAuthManagement;
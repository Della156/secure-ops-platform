'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Test, Save, Shield, ExternalLink, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface IdpConfig {
  id: string;
  name: string;
  type: 'saml' | 'oauth2' | 'ldap' | 'cas';
  status: 'active' | 'inactive';
  endpoint: string;
  provider: string;
  createTime: string;
  updateTime: string;
}

export function IdpIntegrationConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const mockData: IdpConfig[] = [
    { id: 'IDP-001', name: '公司SSO', type: 'saml', status: 'active', endpoint: 'https://sso.company.com/saml', provider: 'Microsoft ADFS', createTime: '2026-01-10 09:00:00', updateTime: '2026-06-04 10:30:00' },
    { id: 'IDP-002', name: '企业微信认证', type: 'oauth2', status: 'active', endpoint: 'https://qyapi.weixin.qq.com/', provider: '企业微信', createTime: '2026-02-15 14:30:00', updateTime: '2026-06-03 09:15:00' },
    { id: 'IDP-003', name: 'AD域认证', type: 'ldap', status: 'inactive', endpoint: 'ldap://ad.company.com:389', provider: 'Active Directory', createTime: '2026-03-01 10:00:00', updateTime: '2026-05-20 16:00:00' },
    { id: 'IDP-004', name: 'CAS单点登录', type: 'cas', status: 'active', endpoint: 'https://cas.company.com/cas', provider: 'Apereo CAS', createTime: '2026-04-20 16:00:00', updateTime: '2026-06-04 08:00:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'saml': return 'SAML 2.0';
      case 'oauth2': return 'OAuth 2.0';
      case 'ldap': return 'LDAP';
      case 'cas': return 'CAS';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'saml': return 'bg-blue-500/20 text-blue-400';
      case 'oauth2': return 'bg-green-500/20 text-green-400';
      case 'ldap': return 'bg-purple-500/20 text-purple-400';
      case 'cas': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">身份认证平台对接配置</h2>
          <p className="text-sm text-gray-400 mt-1">配置与公司级认证平台的对接，支持多种认证协议</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增认证配置
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索认证配置名称..."
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
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">配置名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">认证类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">身份提供商</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">端点地址</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(item.type)}`}>
                    {getTypeLabel(item.type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.provider}</td>
                <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {item.endpoint}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {item.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-green-400" title="测试连接">
                      <Test className="w-4 h-4" />
                    </button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增认证配置">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">配置名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入配置名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">认证类型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="saml">SAML 2.0</option>
              <option value="oauth2">OAuth 2.0</option>
              <option value="ldap">LDAP</option>
              <option value="cas">CAS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">身份提供商</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="如：Microsoft ADFS" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">端点地址</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="认证端点URL" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">配置参数</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm h-32" placeholder="JSON格式的配置参数" />
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

export default IdpIntegrationConfig;
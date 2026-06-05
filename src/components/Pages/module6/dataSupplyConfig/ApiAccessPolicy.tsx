'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, Clock, Globe, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface Policy {
  id: string;
  name: string;
  apiPath: string;
  rateLimit: number;
  unit: 'second' | 'minute' | 'hour';
  ipWhitelist: string[];
  ipBlacklist: string[];
  status: 'enabled' | 'disabled';
  description: string;
}

export function ApiAccessPolicy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const policies: Policy[] = [
    { id: 'AP-001', name: '告警API限流', apiPath: '/api/alerts/*', rateLimit: 100, unit: 'minute', ipWhitelist: ['192.168.1.0/24'], ipBlacklist: [], status: 'enabled', description: '限制告警API每分钟调用次数' },
    { id: 'AP-002', name: '资产API限流', apiPath: '/api/assets/*', rateLimit: 50, unit: 'minute', ipWhitelist: [], ipBlacklist: [], status: 'enabled', description: '限制资产API每分钟调用次数' },
    { id: 'AP-003', name: '威胁情报API', apiPath: '/api/threats/*', rateLimit: 20, unit: 'minute', ipWhitelist: [], ipBlacklist: ['10.0.0.0/8'], status: 'enabled', description: '限制威胁情报API访问' },
    { id: 'AP-004', name: '用户管理API', apiPath: '/api/users/*', rateLimit: 10, unit: 'minute', ipWhitelist: ['192.168.1.100'], ipBlacklist: [], status: 'disabled', description: '用户管理API访问控制' },
  ];

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.apiPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnitLabel = (unit: Policy['unit']) => {
    switch (unit) {
      case 'second': return '每秒';
      case 'minute': return '每分钟';
      case 'hour': return '每小时';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">API访问策略配置</h2>
          <p className="text-sm text-gray-400 mt-1">配置API的访问策略，包括频率限制、IP限制等</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增策略
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索策略名称或API路径..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
            <option>全部状态</option>
            <option>已启用</option>
            <option>已停用</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPolicies.map((policy) => (
          <div key={policy.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">{policy.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${policy.status === 'enabled' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {policy.status === 'enabled' ? '启用' : '停用'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{policy.id}</div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <code className="text-sm text-gray-300 font-mono">{policy.apiPath}</code>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-300">
                  限流: <span className="text-blue-400 font-medium">{policy.rateLimit}</span> {getUnitLabel(policy.unit)}
                </span>
              </div>

              {policy.ipWhitelist.length > 0 && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">IP白名单</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {policy.ipWhitelist.map((ip, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                          {ip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {policy.ipBlacklist.length > 0 && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">IP黑名单</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {policy.ipBlacklist.map((ip, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                          {ip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">{policy.description}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增访问策略">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">策略名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入策略名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">API路径</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm font-mono" placeholder="如：/api/alerts/*" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">频率限制</label>
            <div className="flex items-center gap-3">
              <input type="number" className="flex-1 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="限制数量" />
              <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
                <option value="second">每秒</option>
                <option value="minute">每分钟</option>
                <option value="hour">每小时</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">IP白名单</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={2} placeholder="每行一个IP或网段" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">IP黑名单</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={2} placeholder="每行一个IP或网段" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={2} placeholder="请输入策略描述" />
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

export default ApiAccessPolicy;
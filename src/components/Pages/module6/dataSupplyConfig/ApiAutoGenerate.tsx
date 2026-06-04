'use client';

import React, { useState } from 'react';
import { Plus, Search, Play, FileCode, Eye, Edit2, Trash2, Database, Code, Copy, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive';
  model: string;
  createTime: string;
}

export function ApiAutoGenerate() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const apiEndpoints: ApiEndpoint[] = [
    { id: 'API-001', name: '获取告警列表', path: '/api/alerts', method: 'GET', status: 'active', model: 'Alert', createTime: '2026-01-01 00:00:00' },
    { id: 'API-002', name: '创建告警', path: '/api/alerts', method: 'POST', status: 'active', model: 'Alert', createTime: '2026-01-01 00:00:00' },
    { id: 'API-003', name: '获取单个告警', path: '/api/alerts/{id}', method: 'GET', status: 'active', model: 'Alert', createTime: '2026-01-01 00:00:00' },
    { id: 'API-004', name: '更新告警', path: '/api/alerts/{id}', method: 'PUT', status: 'active', model: 'Alert', createTime: '2026-01-01 00:00:00' },
    { id: 'API-005', name: '删除告警', path: '/api/alerts/{id}', method: 'DELETE', status: 'inactive', model: 'Alert', createTime: '2026-01-01 00:00:00' },
    { id: 'API-006', name: '获取资产列表', path: '/api/assets', method: 'GET', status: 'active', model: 'Asset', createTime: '2026-01-15 10:00:00' },
    { id: 'API-007', name: '创建资产', path: '/api/assets', method: 'POST', status: 'active', model: 'Asset', createTime: '2026-01-15 10:00:00' },
    { id: 'API-008', name: '获取威胁情报', path: '/api/threats', method: 'GET', status: 'active', model: 'Threat', createTime: '2026-02-01 08:00:00' },
  ];

  const models = [
    { name: 'Alert', fields: ['id', 'title', 'level', 'description', 'createTime', 'status'] },
    { name: 'Asset', fields: ['id', 'name', 'type', 'ip', 'status', 'owner'] },
    { name: 'Threat', fields: ['id', 'name', 'level', 'source', 'createTime'] },
    { name: 'User', fields: ['id', 'username', 'realName', 'email', 'status'] },
  ];

  const filteredEndpoints = apiEndpoints.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMethodConfig = (method: ApiEndpoint['method']) => {
    switch (method) {
      case 'GET': return { color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'POST': return { color: 'text-blue-400', bg: 'bg-blue-500/20' };
      case 'PUT': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      case 'DELETE': return { color: 'text-red-400', bg: 'bg-red-500/20' };
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">API自动生成</h2>
          <p className="text-sm text-gray-400 mt-1">基于数据模型自动生成标准RESTful API接口</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          生成API
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索API名称或路径..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
                <option>全部状态</option>
                <option>活跃</option>
                <option>停用</option>
              </select>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">API名称</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">路径</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">方法</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">数据模型</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredEndpoints.map((api) => {
                  const methodConfig = getMethodConfig(api.method);
                  return (
                    <tr key={api.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{api.name}</div>
                        <div className="text-xs text-gray-500">{api.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-gray-300 font-mono">{api.path}</code>
                          <button
                            onClick={() => handleCopy(api.id, api.path)}
                            className="p-1 hover:bg-[#111625] rounded text-gray-500 hover:text-blue-400"
                          >
                            {copiedId === api.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${methodConfig.bg} ${methodConfig.color}`}>
                          {api.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{api.model}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${api.status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
                          {api.status === 'active' ? '活跃' : '停用'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-blue-400">
                            <Play className="w-4 h-4" />
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-green-400" />
              可用数据模型
            </h3>
            <div className="space-y-2">
              {models.map(model => (
                <div key={model.name} className="bg-[#111625] rounded p-3">
                  <div className="text-sm text-white font-medium">{model.name}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {model.fields.map(field => (
                      <span key={field} className="text-xs px-1.5 py-0.5 rounded bg-[#20293F] text-gray-400">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              API统计
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">API总数</span>
                <span className="text-sm text-white">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">活跃API</span>
                <span className="text-sm text-green-400">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">数据模型</span>
                <span className="text-sm text-blue-400">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">今日调用</span>
                <span className="text-sm text-purple-400">1,234</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="生成API接口">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">选择数据模型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              {models.map(model => (
                <option key={model.name} value={model.name}>{model.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">生成类型</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="genType" defaultChecked className="text-blue-600" />
                <span className="text-sm text-gray-300">全部CRUD</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="genType" className="text-blue-600" />
                <span className="text-sm text-gray-300">仅查询(GET)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="genType" className="text-blue-600" />
                <span className="text-sm text-gray-300">自定义</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">API前缀</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm font-mono" defaultValue="/api" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#20293F] text-gray-300 rounded hover:bg-[#2A354D]">取消</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">生成</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ApiAutoGenerate;
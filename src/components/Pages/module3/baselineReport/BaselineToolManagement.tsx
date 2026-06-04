'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Play, Settings, X, Save } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const tools = [
  { id: 'BT-001', name: '主机基线检查工具', type: '自动化工具', callMethod: 'API调用', lastCallTime: '2026-06-03 08:00', status: 'active', apiUrl: 'https://api.example.com/baseline/host', authType: 'API Key', timeout: '30' },
  { id: 'BT-002', name: '网络基线检查工具', type: '脚本工具', callMethod: 'SSH执行', lastCallTime: '2026-06-03 07:30', status: 'active', apiUrl: '-', authType: '密钥认证', timeout: '60' },
  { id: 'BT-003', name: '数据库基线检查工具', type: '自动化工具', callMethod: 'API调用', lastCallTime: '2026-06-02 16:00', status: 'inactive', apiUrl: 'https://api.example.com/baseline/db', authType: 'OAuth2', timeout: '45' },
  { id: 'BT-004', name: '应用基线检查工具', type: '容器工具', callMethod: 'Docker执行', lastCallTime: '2026-06-03 09:00', status: 'active', apiUrl: '-', authType: '证书认证', timeout: '90' },
];

const typeColors = {
  '自动化工具': 'bg-blue-500/20 text-blue-400',
  '脚本工具': 'bg-green-500/20 text-green-400',
  '容器工具': 'bg-purple-500/20 text-purple-400',
};

export function BaselineToolManagement() {
  const [search, setSearch] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingTool, setEditingTool] = useState<typeof tools[0] | null>(null);

  const filteredTools = tools.filter(tool => {
    if (search && !tool.name.includes(search) && !tool.id.includes(search)) return false;
    return true;
  });

  const handleEdit = (tool: typeof tools[0]) => {
    setEditingTool({ ...tool });
    setShowConfigModal(true);
  };

  const handleCreate = () => {
    setEditingTool({
      id: '',
      name: '',
      type: '自动化工具',
      callMethod: 'API调用',
      lastCallTime: '-',
      status: 'inactive',
      apiUrl: '',
      authType: 'API Key',
      timeout: '30',
    });
    setShowConfigModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线工具调用管理" description="管理基线检查工具配置和调用方式"
        actions={[
          <button key="add" onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新增工具
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索工具名称..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">工具ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">工具名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">类型</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">调用方式</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">最后调用时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredTools.map(tool => (
                <tr key={tool.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{tool.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{tool.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${typeColors[tool.type as keyof typeof typeColors]}`}>
                      {tool.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{tool.callMethod}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{tool.lastCallTime}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tool.status === 'active' ? 'completed' : 'failed'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(tool)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                        <Edit className="w-3 h-3" />编辑
                      </button>
                      <button className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                        <Play className="w-3 h-3" />调用
                      </button>
                      <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300">
                        <Eye className="w-3 h-3" />详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfigModal && editingTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">
                {editingTool.id ? '编辑工具配置' : '新增工具配置'}
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">工具名称</label>
                  <input
                    type="text" value={editingTool.name}
                    onChange={e => setEditingTool(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    placeholder="输入工具名称"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">工具类型</label>
                  <select
                    value={editingTool.type}
                    onChange={e => setEditingTool(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  >
                    <option value="自动化工具">自动化工具</option>
                    <option value="脚本工具">脚本工具</option>
                    <option value="容器工具">容器工具</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">API地址</label>
                <input
                  type="text" value={editingTool.apiUrl}
                  onChange={e => setEditingTool(prev => ({ ...prev, apiUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  placeholder="输入API地址"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">认证方式</label>
                  <select
                    value={editingTool.authType}
                    onChange={e => setEditingTool(prev => ({ ...prev, authType: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  >
                    <option value="API Key">API Key</option>
                    <option value="OAuth2">OAuth2</option>
                    <option value="密钥认证">密钥认证</option>
                    <option value="证书认证">证书认证</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">超时设置(秒)</label>
                  <input
                    type="number" value={editingTool.timeout}
                    onChange={e => setEditingTool(prev => ({ ...prev, timeout: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="border-t border-[#2A354D] pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">结果解析配置</span>
                </div>
                <div className="bg-[#111625] rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">字段映射</span>
                    <span className="text-blue-400">配置</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">值转换规则</span>
                    <span className="text-blue-400">配置</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#2A354D]">
              <button onClick={() => setShowConfigModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-md">
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center gap-2">
                <Save className="w-4 h-4" />保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BaselineToolManagement;
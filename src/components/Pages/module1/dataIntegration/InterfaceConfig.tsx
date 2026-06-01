'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, CheckCircle2, AlertCircle, X, ExternalLink, Settings, Database } from 'lucide-react';

interface DataInterface {
  id: string;
  name: string;
  url: string;
  type: 'REST' | 'GraphQL' | 'SOAP' | 'WebSocket';
  authType: 'None' | 'Basic' | 'Bearer' | 'API Key';
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
  params: string;
  mapping: string;
  description: string;
}

const mockData: DataInterface[] = [
  { id: 'IF-001', name: '威胁情报平台接口', url: 'https://ti.example.com/api/v1', type: 'REST', authType: 'Bearer', status: 'connected', createdAt: '2026-05-20 10:30:00', params: '{"timeout": 5000}', mapping: '{"events": "items"}', description: '对接外部威胁情报平台，获取实时威胁数据' },
  { id: 'IF-002', name: '日志分析系统接口', url: 'https://siem.example.com/api/v2', type: 'REST', authType: 'API Key', status: 'connected', createdAt: '2026-05-21 14:20:00', params: '{"retries": 3}', mapping: '{"logs": "data"}', description: '收集和分析安全日志数据' },
  { id: 'IF-003', name: '资产发现服务', url: 'https://asset.example.com/graphql', type: 'GraphQL', authType: 'None', status: 'error', createdAt: '2026-05-22 09:15:00', params: '{}', mapping: '{}', description: '自动发现网络资产信息' },
  { id: 'IF-004', name: '漏洞扫描系统', url: 'https://scan.example.com/api', type: 'REST', authType: 'Basic', status: 'disconnected', createdAt: '2026-05-23 16:45:00', params: '{"verify_ssl": false}', mapping: '{"vulns": "findings"}', description: '漏洞扫描结果数据对接' },
  { id: 'IF-005', name: '防火墙日志接口', url: 'https://fw.example.com/rest', type: 'REST', authType: 'API Key', status: 'connected', createdAt: '2026-05-24 11:00:00', params: '{"timeout": 10000}', mapping: '{"records": "logs"}', description: '防火墙日志采集接口' },
];

export function InterfaceConfig() {
  const [data, setData] = useState<DataInterface[]>(mockData);
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataInterface | null>(null);
  const [formData, setFormData] = useState<Partial<DataInterface>>({
    name: '',
    url: '',
    type: 'REST',
    authType: 'None',
    params: '{}',
    mapping: '{}',
    description: '',
  });

  const filteredData = data.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchType = !filterType || item.type === filterType;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchType && matchStatus;
  });

  const handleOpenModal = (item?: DataInterface) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', url: '', type: 'REST', authType: 'None', params: '{}', mapping: '{}', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.url) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...formData } as DataInterface : item));
    } else {
      const newItem: DataInterface = {
        id: `IF-${String(data.length + 1).padStart(3, '0')}`,
        name: formData.name!,
        url: formData.url!,
        type: formData.type as any,
        authType: formData.authType as any,
        status: 'disconnected',
        createdAt: new Date().toLocaleString('zh-CN'),
        params: formData.params || '{}',
        mapping: formData.mapping || '{}',
        description: formData.description || '',
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个接口配置吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      connected: 'bg-green-500/20 text-green-400 border-green-500/30',
      disconnected: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const icons = {
      connected: <CheckCircle2 className="w-3 h-3" />,
      disconnected: <AlertCircle className="w-3 h-3" />,
      error: <AlertCircle className="w-3 h-3" />,
    };
    const labels = {
      connected: '已连接',
      disconnected: '未连接',
      error: '错误',
    };
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      REST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      GraphQL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      SOAP: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      WebSocket: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${styles[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Settings className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">数据接口配置管理</h1>
            <p className="text-slate-400 text-sm">配置和管理数据对接接口</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索接口名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部类型</option>
              <option value="REST">REST</option>
              <option value="GraphQL">GraphQL</option>
              <option value="SOAP">SOAP</option>
              <option value="WebSocket">WebSocket</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="connected">已连接</option>
              <option value="disconnected">未连接</option>
              <option value="error">错误</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            新增接口
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">接口名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">接口类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">认证方式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">连接状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-sm text-white font-medium">{item.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {item.url}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(item.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.authType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
        </div>

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Database className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">暂无数据</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {editingItem ? '编辑接口' : '新增接口'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">接口名称 *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入接口名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">接口描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="请输入接口描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">接口 URL *</label>
                <input
                  type="text"
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="https://api.example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">接口类型</label>
                  <select
                    value={formData.type || 'REST'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="REST">REST</option>
                    <option value="GraphQL">GraphQL</option>
                    <option value="SOAP">SOAP</option>
                    <option value="WebSocket">WebSocket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">认证方式</label>
                  <select
                    value={formData.authType || 'None'}
                    onChange={(e) => setFormData({ ...formData, authType: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="None">None</option>
                    <option value="Basic">Basic Auth</option>
                    <option value="Bearer">Bearer Token</option>
                    <option value="API Key">API Key</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">连接参数 (JSON)</label>
                <textarea
                  value={formData.params || '{}'}
                  onChange={(e) => setFormData({ ...formData, params: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  placeholder={`{\n  "timeout": 5000\n}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">数据格式映射 (JSON)</label>
                <textarea
                  value={formData.mapping || '{}'}
                  onChange={(e) => setFormData({ ...formData, mapping: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  placeholder={`{\n  "sourceField": "targetField"\n}`}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.url}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Link2, Code, Server, Lock, X, ChevronDown, ChevronUp, FileJson } from 'lucide-react';

interface ApiInterface {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive';
  description: string;
  taskName: string;
  createdAt: string;
  rateLimit: string;
  authType: 'none' | 'api-key' | 'oauth2';
  inputParams: { name: string; type: string; required: boolean }[];
  outputParams: { name: string; type: string; description: string }[];
}

const mockData: ApiInterface[] = [
  { 
    id: 'API-001', 
    name: '获取威胁情报', 
    path: '/api/v1/threat-intel', 
    method: 'GET', 
    status: 'active', 
    description: '获取最新的威胁情报数据', 
    taskName: '威胁情报同步', 
    createdAt: '2026-05-20 10:30:00', 
    rateLimit: '100/min', 
    authType: 'api-key',
    inputParams: [
      { name: 'type', type: 'string', required: false },
      { name: 'limit', type: 'number', required: false },
      { name: 'page', type: 'number', required: false },
    ],
    outputParams: [
      { name: 'data', type: 'array', description: '威胁情报列表' },
      { name: 'total', type: 'number', description: '总数' },
      { name: 'page', type: 'number', description: '当前页' },
    ]
  },
  { 
    id: 'API-002', 
    name: '执行安全扫描', 
    path: '/api/v1/scan', 
    method: 'POST', 
    status: 'active', 
    description: '启动安全扫描任务', 
    taskName: '漏洞扫描', 
    createdAt: '2026-05-21 14:20:00', 
    rateLimit: '50/min', 
    authType: 'oauth2',
    inputParams: [
      { name: 'target', type: 'string', required: true },
      { name: 'scanType', type: 'string', required: false },
      { name: 'depth', type: 'number', required: false },
    ],
    outputParams: [
      { name: 'taskId', type: 'string', description: '任务ID' },
      { name: 'status', type: 'string', description: '状态' },
    ]
  },
  { 
    id: 'API-003', 
    name: '获取扫描结果', 
    path: '/api/v1/scan/:id', 
    method: 'GET', 
    status: 'inactive', 
    description: '获取指定扫描任务的结果', 
    taskName: '漏洞扫描', 
    createdAt: '2026-05-22 09:15:00', 
    rateLimit: '200/min', 
    authType: 'api-key',
    inputParams: [
      { name: 'id', type: 'string', required: true },
    ],
    outputParams: [
      { name: 'result', type: 'object', description: '扫描结果' },
      { name: 'status', type: 'string', description: '状态' },
      { name: 'completedAt', type: 'string', description: '完成时间' },
    ]
  },
  { 
    id: 'API-004', 
    name: '同步资产数据', 
    path: '/api/v1/assets/sync', 
    method: 'POST', 
    status: 'active', 
    description: '同步资产数据到系统', 
    taskName: '资产发现', 
    createdAt: '2026-05-23 16:45:00', 
    rateLimit: '30/min', 
    authType: 'oauth2',
    inputParams: [
      { name: 'force', type: 'boolean', required: false },
      { name: 'source', type: 'string', required: false },
    ],
    outputParams: [
      { name: 'synced', type: 'number', description: '同步数量' },
      { name: 'updated', type: 'number', description: '更新数量' },
      { name: 'errors', type: 'number', description: '错误数量' },
    ]
  },
];

const availableTasks = [
  { name: '威胁情报同步', id: 'task-001' },
  { name: '漏洞扫描', id: 'task-002' },
  { name: '资产发现', id: 'task-003' },
  { name: '日志分析', id: 'task-004' },
  { name: '安全告警', id: 'task-005' },
];

export function ApiInterfaceConfig() {
  const [data, setData] = useState<ApiInterface[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiInterface | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<ApiInterface>>({
    name: '',
    path: '',
    method: 'GET',
    status: 'active',
    description: '',
    taskName: '',
    rateLimit: '100/min',
    authType: 'api-key',
    inputParams: [],
    outputParams: [],
  });

  const filteredData = data.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      item.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    const matchMethod = !filterMethod || item.method === filterMethod;
    return matchSearch && matchStatus && matchMethod;
  });

  const handleOpenModal = (item?: ApiInterface) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        path: '',
        method: 'GET',
        status: 'active',
        description: '',
        taskName: '',
        rateLimit: '100/min',
        authType: 'api-key',
        inputParams: [],
        outputParams: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.path) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...formData } as ApiInterface : item));
    } else {
      const newItem: ApiInterface = {
        id: `API-${String(data.length + 1).padStart(3, '0')}`,
        name: formData.name!,
        path: formData.path!,
        method: formData.method as any,
        status: formData.status as any,
        description: formData.description || '',
        taskName: formData.taskName || '',
        createdAt: new Date().toLocaleString('zh-CN'),
        rateLimit: formData.rateLimit || '100/min',
        authType: formData.authType as any,
        inputParams: formData.inputParams || [],
        outputParams: formData.outputParams || [],
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个API接口配置吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleAddInputParam = () => {
    const params = formData.inputParams || [];
    setFormData({ 
      ...formData, 
      inputParams: [...params, { name: '', type: 'string', required: false }] 
    });
  };

  const handleRemoveInputParam = (index: number) => {
    const params = formData.inputParams || [];
    setFormData({ 
      ...formData, 
      inputParams: params.filter((_, i) => i !== index) 
    });
  };

  const handleUpdateInputParam = (index: number, field: string, value: string | boolean) => {
    const params = formData.inputParams || [];
    const updated = [...params];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, inputParams: updated });
  };

  const handleAddOutputParam = () => {
    const params = formData.outputParams || [];
    setFormData({ 
      ...formData, 
      outputParams: [...params, { name: '', type: 'string', description: '' }] 
    });
  };

  const handleRemoveOutputParam = (index: number) => {
    const params = formData.outputParams || [];
    setFormData({ 
      ...formData, 
      outputParams: params.filter((_, i) => i !== index) 
    });
  };

  const handleUpdateOutputParam = (index: number, field: string, value: string) => {
    const params = formData.outputParams || [];
    const updated = [...params];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, outputParams: updated });
  };

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(row => row !== id) : [...prev, id]);
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      POST: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      PUT: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      DELETE: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[method as keyof typeof colors]}`}>
        {method}
      </span>
    );
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

  const getAuthIcon = (authType: string) => {
    switch (authType) {
      case 'api-key':
        return <Lock className="w-4 h-4" />;
      case 'oauth2':
        return <Lock className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务API接口配置</h1>
        <p className="text-[#9CA3AF]">配置和管理自动化任务API接口</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索API名称或路径..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>

            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部方法</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增API
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider w-8"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">API名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">路径</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">方法</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">认证</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="hover:bg-[#181F32]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="p-1 text-[#9CA3AF] hover:text-[#D1D5DB] transition-colors"
                    >
                      {expandedRows.includes(item.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#F3F4F6] font-medium">{item.name}</div>
                    <div className="text-xs text-[#6B7280]">{item.taskName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs text-[#9CA3AF] font-mono bg-[#181F32] px-2 py-1 rounded">{item.path}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getMethodBadge(item.method)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#9CA3AF]">
                    <div className="flex items-center gap-1">
                      {getAuthIcon(item.authType)}
                      <span className="text-xs ml-1 capitalize">{item.authType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors" title="查看文档">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.includes(item.id) && (
                  <tr key={`${item.id}-details`}>
                    <td colSpan={8} className="px-6 py-4 bg-[#181F32]/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-[#D1D5DB] mb-3 flex items-center gap-2">
                            <FileJson className="w-4 h-4" />
                            输入参数
                          </h4>
                          <div className="bg-[#20293F] rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-[#181F32]">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs text-[#9CA3AF]">参数名</th>
                                  <th className="px-4 py-2 text-left text-xs text-[#9CA3AF]">类型</th>
                                  <th className="px-4 py-2 text-left text-xs text-[#9CA3AF]">必填</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.inputParams.map((param, idx) => (
                                  <tr key={idx} className="border-t border-[#2A354D]">
                                    <td className="px-4 py-2 text-[#D1D5DB]">{param.name}</td>
                                    <td className="px-4 py-2 text-[#9CA3AF]">{param.type}</td>
                                    <td className="px-4 py-2">
                                      <span className={`text-xs px-2 py-0.5 rounded ${param.required ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-[#3A4560]/20 text-[#9CA3AF]'}`}>
                                        {param.required ? '是' : '否'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-[#D1D5DB] mb-3 flex items-center gap-2">
                            <Link2 className="w-4 h-4" />
                            输出参数
                          </h4>
                          <div className="bg-[#20293F] rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-[#181F32]">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs text-[#9CA3AF]">参数名</th>
                                  <th className="px-4 py-2 text-left text-xs text-[#9CA3AF]">类型</th>
                                  <th className="px-4 py-2 text-left text-xs text-[#9CA3AF]">描述</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.outputParams.map((param, idx) => (
                                  <tr key={idx} className="border-t border-[#2A354D]">
                                    <td className="px-4 py-2 text-[#D1D5DB]">{param.name}</td>
                                    <td className="px-4 py-2 text-[#9CA3AF]">{param.type}</td>
                                    <td className="px-4 py-2 text-[#9CA3AF] text-xs">{param.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">暂无API接口配置</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D] sticky top-0 bg-[#20293F]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingItem ? '编辑API接口' : '新增API接口'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">API名称</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    placeholder="输入API名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">关联任务</label>
                  <select
                    value={formData.taskName || ''}
                    onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="">选择任务</option>
                    {availableTasks.map((task) => (
                      <option key={task.id} value={task.name}>{task.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">请求方法</label>
                  <select
                    value={formData.method || 'GET'}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">API路径</label>
                  <input
                    type="text"
                    value={formData.path || ''}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono"
                    placeholder="/api/v1/endpoint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">认证方式</label>
                  <select
                    value={formData.authType || 'api-key'}
                    onChange={(e) => setFormData({ ...formData, authType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="none">无认证</option>
                    <option value="api-key">API Key</option>
                    <option value="oauth2">OAuth 2.0</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">限流配置</label>
                  <input
                    type="text"
                    value={formData.rateLimit || '100/min'}
                    onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    placeholder="100/min"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">描述</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    placeholder="输入API接口描述"
                  />
                </div>
              </div>

              <div className="border-t border-[#2A354D] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-[#D1D5DB] flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    输入参数映射
                  </h4>
                  <button
                    onClick={handleAddInputParam}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-[#0066FF]/20 text-[#0066FF] rounded-lg hover:bg-[#0066FF]/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加参数
                  </button>
                </div>
                <div className="bg-[#181F32] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#2A354D]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF] w-32">参数名</th>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF] w-24">类型</th>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF] w-20">必填</th>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF] w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(formData.inputParams || []).map((param, idx) => (
                        <tr key={idx} className="border-t border-[#2A354D]">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={param.name}
                              onChange={(e) => handleUpdateInputParam(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1 bg-[#20293F] border border-[#3A4560] rounded text-[#F3F4F6] text-sm focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={param.type}
                              onChange={(e) => handleUpdateInputParam(idx, 'type', e.target.value)}
                              className="w-full px-2 py-1 bg-[#20293F] border border-[#3A4560] rounded text-[#F3F4F6] text-sm focus:outline-none"
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                              <option value="array">array</option>
                              <option value="object">object</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={param.required}
                              onChange={(e) => handleUpdateInputParam(idx, 'required', e.target.checked)}
                              className="rounded border-[#3A4560] bg-[#20293F] text-[#4D94FF] focus:ring-[#0066FF]"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleRemoveInputParam(idx)}
                              className="p-1 text-[#FF3B30] hover:text-[#FF6B5A]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-[#2A354D] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-[#D1D5DB] flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    输出参数映射
                  </h4>
                  <button
                    onClick={handleAddOutputParam}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-[#0066FF]/20 text-[#0066FF] rounded-lg hover:bg-[#0066FF]/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加参数
                  </button>
                </div>
                <div className="bg-[#181F32] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#2A354D]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF] w-32">参数名</th>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF] w-24">类型</th>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF]">描述</th>
                        <th className="px-4 py-2 text-left text-xs text-[#9CA3AF] w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(formData.outputParams || []).map((param, idx) => (
                        <tr key={idx} className="border-t border-[#2A354D]">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={param.name}
                              onChange={(e) => handleUpdateOutputParam(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1 bg-[#20293F] border border-[#3A4560] rounded text-[#F3F4F6] text-sm focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={param.type}
                              onChange={(e) => handleUpdateOutputParam(idx, 'type', e.target.value)}
                              className="w-full px-2 py-1 bg-[#20293F] border border-[#3A4560] rounded text-[#F3F4F6] text-sm focus:outline-none"
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                              <option value="array">array</option>
                              <option value="object">object</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={param.description}
                              onChange={(e) => handleUpdateOutputParam(idx, 'description', e.target.value)}
                              className="w-full px-2 py-1 bg-[#20293F] border border-[#3A4560] rounded text-[#F3F4F6] text-sm focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                              placeholder="描述"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleRemoveOutputParam(idx)}
                              className="p-1 text-[#FF3B30] hover:text-[#FF6B5A]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
                保存并发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
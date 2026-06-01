'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Layers, Save } from 'lucide-react';

// 模板数据类型
interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

// 模拟数据
const mockTemplates: Template[] = [
  { id: 'TPL-001', name: 'Web应用安全扫描模板', description: '用于自动扫描Web应用的安全漏洞', tags: ['安全扫描', 'Web应用'], createdAt: '2026-05-15 09:00:00', updatedAt: '2026-05-20 14:30:00', status: 'active' },
  { id: 'TPL-002', name: '数据库备份模板', description: '自动备份MySQL数据库', tags: ['备份', '数据库'], createdAt: '2026-05-16 10:00:00', updatedAt: '2026-05-21 11:00:00', status: 'active' },
  { id: 'TPL-003', name: '网络设备巡检模板', description: '定期巡检网络设备状态', tags: ['巡检', '网络'], createdAt: '2026-05-17 11:00:00', updatedAt: '2026-05-22 09:00:00', status: 'inactive' },
  { id: 'TPL-004', name: '服务器性能监控模板', description: '监控服务器CPU、内存、磁盘使用情况', tags: ['监控', '服务器'], createdAt: '2026-05-18 12:00:00', updatedAt: '2026-05-23 16:00:00', status: 'active' },
];

// 可选流程列表（用于从流程创建模板）
const mockFlows = [
  { id: 'FLOW-001', name: 'Web应用安全扫描流程' },
  { id: 'FLOW-002', name: '数据库自动备份流程' },
  { id: 'FLOW-003', name: '网络设备巡检流程' },
];

export function TemplateCreateSave() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Partial<Template>>({
    name: '',
    description: '',
    tags: [],
    status: 'active',
  });
  const [newTag, setNewTag] = useState('');
  const [selectedFlow, setSelectedFlow] = useState('');

  // 过滤数据
  const filteredTemplates = templates.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchStatus;
  });

  // 打开新增/编辑模态框
  const handleOpenModal = (item?: Template) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', tags: [], status: 'active' });
    }
    setIsModalOpen(true);
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag] });
      setNewTag('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(tag => tag !== tagToRemove) });
  };

  // 保存数据
  const handleSave = () => {
    if (!formData.name) return;

    if (editingItem) {
      // 编辑
      setTemplates(templates.map(item => item.id === editingItem.id ? { ...item, ...formData, updatedAt: new Date().toLocaleString('zh-CN') } as Template : item));
    } else {
      // 新增
      const newItem: Template = {
        id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
        name: formData.name!,
        description: formData.description || '',
        tags: formData.tags || [],
        status: formData.status || 'active',
        createdAt: new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN'),
      };
      setTemplates([...templates, newItem]);
    }
    setIsModalOpen(false);
  };

  // 删除数据
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      setTemplates(templates.filter(item => item.id !== id));
    }
  };

  // 从流程保存为模板
  const handleSaveFromFlow = () => {
    if (!selectedFlow) return;
    const flow = mockFlows.find(f => f.id === selectedFlow);
    if (flow) {
      setFormData({ name: flow.name + ' 模板', description: '', tags: [], status: 'active' });
      setEditingItem(null);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务流程模板创建与保存</h1>
        <p className="text-slate-400">管理任务流程模板，支持从现有流程创建模板</p>
      </div>

      {/* 操作栏 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索模板名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* 状态筛选 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="active">启用</option>
              <option value="inactive">停用</option>
            </select>

            {/* 从流程创建 */}
            <div className="flex gap-2">
              <select
                value={selectedFlow}
                onChange={(e) => setSelectedFlow(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择流程...</option>
                {mockFlows.map(flow => (
                  <option key={flow.id} value={flow.id}>{flow.name}</option>
                ))}
              </select>
              <button
                onClick={handleSaveFromFlow}
                disabled={!selectedFlow}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Layers className="w-4 h-4" />
                从流程创建
              </button>
            </div>
          </div>

          {/* 新增按钮 */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增模板
          </button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">模板ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">模板名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">标签</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">更新时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredTemplates.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate" title={item.description}>
                  {item.description}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-slate-600 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                    {item.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.updatedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
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

        {filteredTemplates.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">暂无数据</p>
          </div>
        )}
      </div>

      {/* 新增/编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {editingItem ? '编辑模板' : '新增模板'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">模板名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入模板名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">模板描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入模板描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入标签后按回车添加"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    添加
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">状态</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">启用</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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

'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, X, Save, Shield, Tag, Settings } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const baselines = [
  { id: 'BASE-001', name: '操作系统安全基线', category: '系统安全', rules: 45, status: 'active', description: 'Linux/Windows操作系统安全配置基线' },
  { id: 'BASE-002', name: '数据库安全基线', category: '数据安全', rules: 32, status: 'active', description: 'MySQL/Oracle数据库安全配置基线' },
  { id: 'BASE-003', name: '网络设备安全基线', category: '网络安全', rules: 28, status: 'active', description: '交换机/路由器安全配置基线' },
  { id: 'BASE-004', name: '应用安全基线', category: '应用安全', rules: 56, status: 'draft', description: 'Web应用安全配置基线' },
];

export function BaselineConfigManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBaseline, setEditingBaseline] = useState<typeof baselines[0] | null>(null);

  const filteredBaselines = baselines.filter(baseline => {
    if (search && !baseline.name.includes(search) && !baseline.id.includes(search)) return false;
    return true;
  });

  const handleEdit = (baseline: typeof baselines[0]) => {
    setEditingBaseline({ ...baseline });
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线配置管理" description="管理和配置安全基线"
        actions={[
          <button key="add" onClick={() => { setEditingBaseline(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建基线
          </button>,
        ]}
      />

      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text" placeholder="搜索基线..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBaselines.map(baseline => (
          <div key={baseline.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{baseline.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${baseline.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {baseline.status === 'active' ? '已启用' : '草稿'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Tag className="w-3 h-3" />{baseline.category}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(baseline)} className="p-1.5 text-gray-400 hover:text-blue-400">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Settings className="w-3 h-3 text-slate-500" />
                <span className="text-slate-400">规则数:</span>
                <span className="text-white">{baseline.rules}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{baseline.description}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg">
                查看规则详情
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">{editingBaseline ? '编辑基线' : '新建基线'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">基线名称</label>
                <input
                  type="text"
                  value={editingBaseline?.name || ''}
                  onChange={e => setEditingBaseline(prev => prev ? { ...prev, name: e.target.value } : { id: '', name: e.target.value, category: '', rules: 0, status: 'draft', description: '' })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                  placeholder="输入基线名称"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">分类</label>
                <select
                  value={editingBaseline?.category || ''}
                  onChange={e => setEditingBaseline(prev => prev ? { ...prev, category: e.target.value } : { id: '', name: '', category: e.target.value, rules: 0, status: 'draft', description: '' })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                >
                  <option value="">选择分类</option>
                  <option value="系统安全">系统安全</option>
                  <option value="数据安全">数据安全</option>
                  <option value="网络安全">网络安全</option>
                  <option value="应用安全">应用安全</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">描述</label>
                <textarea
                  value={editingBaseline?.description || ''}
                  onChange={e => setEditingBaseline(prev => prev ? { ...prev, description: e.target.value } : { id: '', name: '', category: '', rules: 0, status: 'draft', description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none resize-none"
                  rows={3}
                  placeholder="输入基线描述"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg">
                  取消
                </button>
                <button onClick={() => { setShowModal(false); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingBaseline ? '保存修改' : '创建基线'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BaselineConfigManagement;
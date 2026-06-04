'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Tag, X, Save, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const tags = [
  { id: 'TAG-001', name: '生产', color: 'red', description: '生产环境资产', usageCount: 156 },
  { id: 'TAG-002', name: '测试', color: 'yellow', description: '测试环境资产', usageCount: 89 },
  { id: 'TAG-003', name: 'Web', color: 'blue', description: 'Web服务器', usageCount: 67 },
  { id: 'TAG-004', name: '数据库', color: 'green', description: '数据库服务器', usageCount: 45 },
  { id: 'TAG-005', name: 'CDN', color: 'orange', description: 'CDN节点', usageCount: 32 },
  { id: 'TAG-006', name: '云服务', color: 'purple', description: '云服务资产', usageCount: 128 },
];

const colorMap: Record<string, string> = {
  'red': 'bg-red-500',
  'yellow': 'bg-yellow-500',
  'blue': 'bg-blue-500',
  'green': 'bg-green-500',
  'orange': 'bg-orange-500',
  'purple': 'bg-purple-500',
};

export function AssetTagManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<typeof tags[0] | null>(null);

  const filteredTags = tags.filter(tag => {
    if (search && !tag.name.includes(search) && !tag.description.includes(search)) return false;
    return true;
  });

  const handleDelete = (tagId: string) => {
    if (confirm(`确定删除标签 ${tagId} 吗？`)) {
      alert('删除成功');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产标签管理" description="管理资产标签"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" onClick={() => { setEditingTag(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新增标签
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索标签名称..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map(tag => (
          <div key={tag.id} className="bg-[#111625] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${colorMap[tag.color]}`} />
                <div>
                  <h3 className="text-white font-medium">{tag.name}</h3>
                  <p className="text-xs text-slate-400">{tag.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditingTag(tag); setShowModal(true); }} className="text-xs text-blue-400 hover:text-blue-300">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(tag.id)} className="text-xs text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Tag className="w-3 h-3" />
                <span>使用 {tag.usageCount} 次</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">{editingTag ? '编辑标签' : '新增标签'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">标签名称</label>
                <input
                  type="text"
                  value={editingTag?.name || ''}
                  onChange={e => setEditingTag(prev => prev ? { ...prev, name: e.target.value } : { id: '', name: e.target.value, color: 'blue', description: '', usageCount: 0 })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                  placeholder="输入标签名称"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">标签颜色</label>
                <div className="flex gap-2">
                  {Object.entries(colorMap).map(([key, color]) => (
                    <button
                      key={key}
                      onClick={() => setEditingTag(prev => prev ? { ...prev, color: key } : { id: '', name: '', color: key, description: '', usageCount: 0 })}
                      className={`w-8 h-8 rounded-full ${color} ${editingTag?.color === key ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1E2736]' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">标签描述</label>
                <textarea
                  value={editingTag?.description || ''}
                  onChange={e => setEditingTag(prev => prev ? { ...prev, description: e.target.value } : { id: '', name: '', color: 'blue', description: e.target.value, usageCount: 0 })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                  placeholder="输入标签描述"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg">
                  取消
                </button>
                <button onClick={() => { setShowModal(false); alert(editingTag ? '修改成功' : '创建成功'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingTag ? '保存修改' : '创建标签'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetTagManagement;
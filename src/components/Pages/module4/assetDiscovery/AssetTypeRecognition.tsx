'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, Server, Database, Network, Cloud, Smartphone, Laptop, Edit2, Trash2, Tag, X, Save } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const assetTypes = [
  { id: 'TYPE-001', name: '服务器', icon: 'server', description: '物理或虚拟服务器', count: 156, status: 'active' },
  { id: 'TYPE-002', name: '数据库', icon: 'database', description: '关系型/非关系型数据库', count: 45, status: 'active' },
  { id: 'TYPE-003', name: '网络设备', icon: 'network', description: '交换机、路由器、防火墙', count: 89, status: 'active' },
  { id: 'TYPE-004', name: '云服务', icon: 'cloud', description: '云主机、云存储、云数据库', count: 234, status: 'active' },
  { id: 'TYPE-005', name: '终端设备', icon: 'laptop', description: '员工办公电脑', count: 521, status: 'active' },
  { id: 'TYPE-006', name: '移动设备', icon: 'smartphone', description: '手机、平板等移动终端', count: 128, status: 'inactive' },
];

const iconMap: Record<string, React.ReactNode> = {
  server: <Server className="w-6 h-6" />,
  database: <Database className="w-6 h-6" />,
  network: <Network className="w-6 h-6" />,
  cloud: <Cloud className="w-6 h-6" />,
  laptop: <Laptop className="w-6 h-6" />,
  smartphone: <Smartphone className="w-6 h-6" />,
};

const iconColorMap: Record<string, string> = {
  server: 'text-blue-400 bg-blue-500/20',
  database: 'text-green-400 bg-green-500/20',
  network: 'text-purple-400 bg-purple-500/20',
  cloud: 'text-orange-400 bg-orange-500/20',
  laptop: 'text-cyan-400 bg-cyan-500/20',
  smartphone: 'text-pink-400 bg-pink-500/20',
};

export function AssetTypeRecognition() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<typeof assetTypes[0] | null>(null);

  const filteredTypes = assetTypes.filter(type => {
    if (search && !type.name.includes(search) && !type.description.includes(search)) return false;
    return true;
  });

  const handleEdit = (type: typeof assetTypes[0]) => {
    setEditingType({ ...type });
    setShowModal(true);
  };

  const handleDelete = (typeId: string) => {
    if (confirm(`确定删除资产类型 ${typeId} 吗？`)) {
      alert('删除成功');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产类型识别" description="管理和识别资产类型"
        actions={[
          <button key="add" onClick={() => { setEditingType(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新增类型
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索类型名称..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredTypes.map(type => (
            <div key={type.id} className="bg-[#111625] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-lg ${iconColorMap[type.icon]}`}>
                    {iconMap[type.icon]}
                  </span>
                  <div>
                    <h3 className="text-white font-medium">{type.name}</h3>
                    <p className="text-xs text-slate-400">{type.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${type.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {type.status === 'active' ? '启用' : '禁用'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Tag className="w-3 h-3" />
                  <span>包含 {type.count} 个资产</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(type)} className="text-xs text-blue-400 hover:text-blue-300">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(type.id)} className="text-xs text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="text-xs text-gray-400 hover:text-gray-300">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">{editingType ? '编辑资产类型' : '新增资产类型'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">类型名称</label>
                <input
                  type="text"
                  value={editingType?.name || ''}
                  onChange={e => setEditingType(prev => prev ? { ...prev, name: e.target.value } : { id: '', name: e.target.value, icon: 'server', description: '', count: 0, status: 'active' })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                  placeholder="输入类型名称"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">类型图标</label>
                <select
                  value={editingType?.icon || 'server'}
                  onChange={e => setEditingType(prev => prev ? { ...prev, icon: e.target.value } : { id: '', name: '', icon: e.target.value, description: '', count: 0, status: 'active' })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                >
                  {Object.entries(iconMap).map(([key, icon]) => (
                    <option key={key} value={key}>{icon} {key}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">类型描述</label>
                <textarea
                  value={editingType?.description || ''}
                  onChange={e => setEditingType(prev => prev ? { ...prev, description: e.target.value } : { id: '', name: '', icon: 'server', description: e.target.value, count: 0, status: 'active' })}
                  className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                  placeholder="输入类型描述"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg">
                  取消
                </button>
                <button onClick={() => { setShowModal(false); alert(editingType ? '修改成功' : '创建成功'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingType ? '保存修改' : '创建类型'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetTypeRecognition;
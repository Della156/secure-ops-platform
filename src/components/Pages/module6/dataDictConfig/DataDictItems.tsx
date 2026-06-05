'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronDown, ChevronRight, Download, Upload, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface DictItem {
  id: string;
  code: string;
  label: string;
  value: string;
  sortOrder: number;
  status: 'enabled' | 'disabled';
}

interface Category {
  id: string;
  name: string;
  code: string;
  expanded: boolean;
  items: DictItem[];
}

export function DataDictItems() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: 'DC-001', name: '告警级别', code: 'alarm_level', expanded: true,
      items: [
        { id: 'DI-001', code: 'critical', label: '严重', value: '1', sortOrder: 1, status: 'enabled' },
        { id: 'DI-002', code: 'high', label: '高危', value: '2', sortOrder: 2, status: 'enabled' },
        { id: 'DI-003', code: 'medium', label: '中危', value: '3', sortOrder: 3, status: 'enabled' },
        { id: 'DI-004', code: 'low', label: '低危', value: '4', sortOrder: 4, status: 'enabled' },
      ]
    },
    {
      id: 'DC-002', name: '资产类型', code: 'asset_type', expanded: false,
      items: [
        { id: 'DI-005', code: 'server', label: '服务器', value: '1', sortOrder: 1, status: 'enabled' },
        { id: 'DI-006', code: 'network', label: '网络设备', value: '2', sortOrder: 2, status: 'enabled' },
        { id: 'DI-007', code: 'endpoint', label: '终端设备', value: '3', sortOrder: 3, status: 'enabled' },
        { id: 'DI-008', code: 'database', label: '数据库', value: '4', sortOrder: 4, status: 'enabled' },
        { id: 'DI-009', code: 'storage', label: '存储设备', value: '5', sortOrder: 5, status: 'enabled' },
        { id: 'DI-010', code: 'middleware', label: '中间件', value: '6', sortOrder: 6, status: 'enabled' },
        { id: 'DI-011', code: 'application', label: '应用系统', value: '7', sortOrder: 7, status: 'enabled' },
        { id: 'DI-012', code: 'cloud', label: '云资源', value: '8', sortOrder: 8, status: 'enabled' },
      ]
    },
    {
      id: 'DC-003', name: '威胁等级', code: 'threat_level', expanded: false,
      items: [
        { id: 'DI-013', code: 'p0', label: '紧急', value: '0', sortOrder: 1, status: 'enabled' },
        { id: 'DI-014', code: 'p1', label: '高危', value: '1', sortOrder: 2, status: 'enabled' },
        { id: 'DI-015', code: 'p2', label: '中危', value: '2', sortOrder: 3, status: 'enabled' },
        { id: 'DI-016', code: 'p3', label: '低危', value: '3', sortOrder: 4, status: 'enabled' },
        { id: 'DI-017', code: 'p4', label: '信息', value: '4', sortOrder: 5, status: 'enabled' },
      ]
    },
  ];

  const toggleExpand = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) category.expanded = !category.expanded;
  };

  const allItems = categories.flatMap(cat => cat.items);
  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">字典项管理</h2>
          <p className="text-sm text-gray-400 mt-1">管理字典项的具体条目</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            导入
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            导出
          </button>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            新增字典项
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索字典项..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
            <option>全部分类</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="divide-y divide-[#2A354D]">
          {categories.map(category => (
            <div key={category.id}>
              <div
                className="px-4 py-3 bg-[#111625] flex items-center justify-between cursor-pointer hover:bg-[#20293F]"
                onClick={() => toggleExpand(category.id)}
              >
                <div className="flex items-center gap-2">
                  {category.expanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="font-medium text-white">{category.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{category.code}</span>
                  <span className="text-xs text-gray-500">({category.items.length} 项)</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedCategory(category.id); }}
                  className={`text-xs px-2 py-1 rounded ${
                    selectedCategory === category.id ? 'bg-blue-500/20 text-blue-400' : 'bg-[#20293F] text-gray-400 hover:text-blue-400'
                  }`}
                >
                  {selectedCategory === category.id ? '已选中' : '选择'}
                </button>
              </div>
              {category.expanded && (
                <div className="divide-y divide-[#2A354D]">
                  {category.items.map(item => (
                    <div key={item.id} className="px-8 py-3 flex items-center justify-between hover:bg-[#111625]">
                      <div className="flex items-center gap-4">
                        <div className="min-w-[80px]">
                          <div className="text-sm text-white">{item.label}</div>
                          <div className="text-xs text-gray-500 font-mono">{item.code}</div>
                        </div>
                        <div className="text-sm text-gray-400 font-mono">值: {item.value}</div>
                        <div className="text-xs text-gray-500">排序: {item.sortOrder}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${item.status === 'enabled' ? 'text-green-400' : 'text-gray-500'}`}>
                          {item.status === 'enabled' ? '启用' : '停用'}
                        </span>
                        <button className="p-1.5 hover:bg-[#20293F] rounded text-gray-400 hover:text-yellow-400">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-[#20293F] rounded text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增字典项">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">所属分类</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">字典项编码</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm font-mono" placeholder="请输入编码" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">显示标签</label>
              <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入显示标签" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">值</label>
              <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入值" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">排序号</label>
            <input type="number" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入排序号" />
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

export default DataDictItems;
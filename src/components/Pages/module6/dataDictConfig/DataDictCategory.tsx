'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FolderOpen, List, Download, Upload } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface Category {
  id: string;
  name: string;
  code: string;
  itemCount: number;
  status: 'enabled' | 'disabled';
  description: string;
  createTime: string;
}

export function DataDictCategory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const categories: Category[] = [
    { id: 'DC-001', name: '告警级别', code: 'alarm_level', itemCount: 4, status: 'enabled', description: '告警严重级别定义', createTime: '2026-01-01 00:00:00' },
    { id: 'DC-002', name: '资产类型', code: 'asset_type', itemCount: 8, status: 'enabled', description: 'IT资产分类定义', createTime: '2026-01-01 00:00:00' },
    { id: 'DC-003', name: '威胁等级', code: 'threat_level', itemCount: 5, status: 'enabled', description: '威胁情报等级定义', createTime: '2026-01-15 10:00:00' },
    { id: 'DC-004', name: '操作类型', code: 'operation_type', itemCount: 12, status: 'enabled', description: '系统操作类型定义', createTime: '2026-02-01 08:00:00' },
    { id: 'DC-005', name: '部门分类', code: 'dept_category', itemCount: 6, status: 'disabled', description: '组织部门分类', createTime: '2026-03-10 14:30:00' },
    { id: 'DC-006', name: '设备状态', code: 'device_status', itemCount: 5, status: 'enabled', description: '设备运行状态定义', createTime: '2026-04-01 09:00:00' },
  ];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">数据字典分类管理</h2>
          <p className="text-sm text-gray-400 mt-1">管理数据字典的分类体系</p>
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
            新增分类
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索分类名称或编码..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#111625] flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-white">{category.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{category.code}</div>
                </div>
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
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-2">{category.description}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-gray-400">
                    <List className="w-3 h-3" />
                    {category.itemCount} 个字典项
                  </span>
                  <span className={`${category.status === 'enabled' ? 'text-green-400' : 'text-gray-500'}`}>
                    {category.status === 'enabled' ? '启用' : '停用'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{category.createTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增字典分类">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">分类名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入分类名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">分类编码</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm font-mono" placeholder="请输入分类编码（英文）" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={3} placeholder="请输入分类描述" />
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

export default DataDictCategory;
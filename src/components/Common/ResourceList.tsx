'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Tag, FolderOpen, Check } from 'lucide-react';
import type { ResourceType, ResourceItem, ResourceGroup, ResourceTag } from '@/data/module1/resourceMock';
import { getResourceMock, resourceConfig } from '@/data/module1/resourceMock';

interface ResourceListProps {
  resourceType: ResourceType;
}

export function ResourceList({ resourceType }: ResourceListProps) {
  const config = resourceConfig[resourceType as keyof typeof resourceConfig];
  const mock = getResourceMock(resourceType);
  
  const [items, setItems] = useState<ResourceItem[]>(mock.list);
  const [groups, setGroups] = useState<ResourceGroup[]>(mock.groups);
  const [tags, setTags] = useState<ResourceTag[]>(mock.tags);
  const [searchName, setSearchName] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
  const [editingGroup, setEditingGroup] = useState<ResourceGroup | null>(null);
  const [editingTag, setEditingTag] = useState<ResourceTag | null>(null);
  const [formData, setFormData] = useState<Partial<ResourceItem>>({
    name: '',
    ip: '',
    group: '',
    tags: [],
    description: '',
  });
  const [groupFormData, setGroupFormData] = useState<Partial<ResourceGroup>>({ name: '' });
  const [tagFormData, setTagFormData] = useState<Partial<ResourceTag>>({ name: '', color: 'blue' });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [detailItem, setDetailItem] = useState<ResourceItem | null>(null);

  const filteredItems = items.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchGroup = !filterGroup || item.group === filterGroup;
    const matchTag = !filterTag || item.tags.includes(filterTag);
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchGroup && matchTag && matchStatus;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`确定要删除选中的 ${selectedItems.length} 个${config.label}吗？`)) {
      setItems(items.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      warning: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      offline: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      online: '在线',
      warning: '警告',
      offline: '离线',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTagColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-[#0066FF]/20 text-[#0066FF]',
      green: 'bg-[#00C853]/20 text-[#00C853]',
      purple: 'bg-[#6366F1]/20 text-[#6366F1]',
      yellow: 'bg-[#FF9100]/20 text-[#FF9100]',
      cyan: 'bg-[#00BCD4]/20 text-[#00BCD4]',
      orange: 'bg-[#FF6B35]/20 text-[#FF6B35]',
      pink: 'bg-[#FF69B4]/20 text-[#FF69B4]',
      indigo: 'bg-[#4B0082]/20 text-[#9370DB]',
      red: 'bg-[#FF3B30]/20 text-[#FF3B30]',
      gray: 'bg-[#4A5570]/20 text-[#9CA3AF]',
    };
    return colors[color] || 'bg-[#4A5570]/20 text-[#9CA3AF]';
  };

  const handleOpenModal = (item?: ResourceItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', ip: '', group: '', tags: [], description: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenDetail = (item: ResourceItem) => {
    setDetailItem(item);
    setShowDetailDrawer(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.ip) return;
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...item, ...formData } as ResourceItem : item));
    } else {
      const prefix = resourceType === 'device' ? 'DEV' : resourceType === 'host' ? 'HOST' : resourceType === 'system' ? 'SYS' : 'EP';
      const newItem: ResourceItem = {
        id: `${prefix}-${String(items.length + 1).padStart(3, '0')}`,
        name: formData.name!,
        ip: formData.ip!,
        group: formData.group || '',
        tags: formData.tags || [],
        status: 'online',
        createdAt: new Date().toLocaleString('zh-CN'),
        description: formData.description || '',
      };
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(`确定要删除这个${config.label}吗？`)) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSaveGroup = () => {
    if (!groupFormData.name) return;
    if (editingGroup) {
      setGroups(groups.map(item => item.id === editingGroup.id ? { ...item, ...groupFormData } as ResourceGroup : item));
    } else {
      const newGroup: ResourceGroup = {
        id: `group-${groups.length + 1}`,
        name: groupFormData.name!,
        count: 0,
      };
      setGroups([...groups, newGroup]);
    }
    setIsGroupModalOpen(false);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('确定要删除这个分组吗？')) {
      setGroups(groups.filter(item => item.id !== id));
    }
  };

  const handleSaveTag = () => {
    if (!tagFormData.name) return;
    if (editingTag) {
      setTags(tags.map(item => item.id === editingTag.id ? { ...item, ...tagFormData } as ResourceTag : item));
    } else {
      const newTag: ResourceTag = {
        id: `tag-${tags.length + 1}`,
        name: tagFormData.name!,
        color: tagFormData.color || 'blue',
      };
      setTags([...tags, newTag]);
    }
    setIsTagModalOpen(false);
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('确定要删除这个标签吗？')) {
      setTags(tags.filter(item => item.id !== id));
    }
  };

  const statusCounts = {
    total: items.length,
    online: items.filter(i => i.status === 'online').length,
    warning: items.filter(i => i.status === 'warning').length,
    offline: items.filter(i => i.status === 'offline').length,
  };

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">{config.title}列表管理</h1>
          <p className="text-[#9CA3AF]">管理和配置{config.label}资源</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <p className="text-[#9CA3AF] text-sm mb-1">总{config.label}数</p>
            <p className="text-2xl font-bold text-[#F3F4F6]">{statusCounts.total}</p>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <p className="text-[#9CA3AF] text-sm mb-1">在线</p>
            <p className="text-2xl font-bold text-[#00C853]">{statusCounts.online}</p>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <p className="text-[#9CA3AF] text-sm mb-1">警告</p>
            <p className="text-2xl font-bold text-[#FF9100]">{statusCounts.warning}</p>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <p className="text-[#9CA3AF] text-sm mb-1">离线</p>
            <p className="text-2xl font-bold text-[#FF3B30]">{statusCounts.offline}</p>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[#D1D5DB]">已选择 {selectedItems.length} 个{config.label}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
                >
                  取消选择
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-[#FF3B30] hover:bg-[#FF6B5A] text-white rounded-lg transition-colors"
                >
                  批量删除
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder={`搜索${config.label}名称...`}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
                />
              </div>

              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部分组</option>
                {groups.map(group => (
                  <option key={group.id} value={group.name}>{group.name}</option>
                ))}
              </select>

              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部标签</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.name}>{tag.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部状态</option>
                <option value="online">在线</option>
                <option value="warning">警告</option>
                <option value="offline">离线</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setEditingGroup(null); setGroupFormData({ name: '' }); setIsGroupModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                分组管理
              </button>
              <button
                onClick={() => { setEditingTag(null); setTagFormData({ name: '', color: 'blue' }); setIsTagModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                <Tag className="w-4 h-4" />
                标签管理
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                新增{config.label}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#181F32]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{config.label}名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">IP地址</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">分组</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">标签</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors cursor-pointer" onClick={() => handleOpenDetail(item)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => { e.stopPropagation(); toggleSelectItem(item.id); }}
                      className="rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF] border border-blue-500/30">
                      {item.group}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tags.find(t => t.name === tag)?.color || 'blue')}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
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

          {filteredItems.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[#6B7280]">暂无数据</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-[#9CA3AF] text-sm">显示 {filteredItems.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm disabled:opacity-50" disabled>
              上一页
            </button>
            <span className="text-[#9CA3AF] text-sm">1 / 1</span>
            <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm disabled:opacity-50" disabled>
              下一页
            </button>
          </div>
        </div>
      </div>

      {showDetailDrawer && detailItem && (
        <div className="w-96 bg-[#20293F] border-l border-[#2A354D] p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#F3F4F6]">{config.label}详情</h3>
            <button
              onClick={() => setShowDetailDrawer(false)}
              className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">ID</label>
              <p className="text-[#F3F4F6]">{detailItem.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">{config.label}名称</label>
              <p className="text-[#F3F4F6]">{detailItem.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">IP地址</label>
              <p className="text-[#F3F4F6]">{detailItem.ip}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">分组</label>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF]">
                {detailItem.group}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">标签</label>
              <div className="flex flex-wrap gap-1">
                {detailItem.tags.map((tag, idx) => (
                  <span key={idx} className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tags.find(t => t.name === tag)?.color || 'blue')}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">状态</label>
              {getStatusBadge(detailItem.status)}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">创建时间</label>
              <p className="text-[#F3F4F6]">{detailItem.createdAt}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">描述</label>
              <p className="text-[#F3F4F6] text-sm">{detailItem.description}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => { handleOpenModal(detailItem); setShowDetailDrawer(false); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg"
            >
              <Edit className="w-4 h-4" />
              编辑
            </button>
            <button
              onClick={() => { handleDelete(detailItem.id); setShowDetailDrawer(false); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FF3B30] hover:bg-[#FF6B5A] text-white rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingItem ? `编辑${config.label}` : `新增${config.label}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">{config.label}名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder={`请输入${config.label}名称`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">IP地址</label>
                <input
                  type="text"
                  value={formData.ip || ''}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="192.168.1.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">分组</label>
                <select
                  value={formData.group || ''}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="">请选择分组</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.name}>{group.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">标签</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <label key={tag.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={(formData.tags || []).includes(tag.name)}
                        onChange={(e) => {
                          const currentTags = formData.tags || [];
                          const newTags = e.target.checked
                            ? [...currentTags, tag.name]
                            : currentTags.filter(t => t !== tag.name);
                          setFormData({ ...formData, tags: newTags });
                        }}
                        className="rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                      />
                      <span className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder={`请输入${config.label}描述`}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">分组管理</h3>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={groupFormData.name || ''}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="分组名称"
                />
                <button
                  onClick={handleSaveGroup}
                  className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  {editingGroup ? '更新' : '添加'}
                </button>
              </div>
              <div className="space-y-2">
                {groups.map(group => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-[#181F32]/50 rounded-lg">
                    <div>
                      <span className="text-[#F3F4F6]">{group.name}</span>
                      <span className="text-[#6B7280] ml-2 text-sm">({group.count}个{config.label})</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingGroup(group); setGroupFormData(group); }}
                        className="p-1 text-[#9CA3AF] hover:text-[#D1D5DB]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-1 text-[#FF3B30] hover:text-[#FF6B5A]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">标签管理</h3>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagFormData.name || ''}
                  onChange={(e) => setTagFormData({ ...tagFormData, name: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="标签名称"
                />
                <select
                  value={tagFormData.color || 'blue'}
                  onChange={(e) => setTagFormData({ ...tagFormData, color: e.target.value })}
                  className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="blue">蓝色</option>
                  <option value="green">绿色</option>
                  <option value="purple">紫色</option>
                  <option value="yellow">黄色</option>
                  <option value="cyan">青色</option>
                  <option value="orange">橙色</option>
                  <option value="pink">粉色</option>
                  <option value="indigo">靛蓝</option>
                  <option value="red">红色</option>
                  <option value="gray">灰色</option>
                </select>
                <button
                  onClick={handleSaveTag}
                  className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  {editingTag ? '更新' : '添加'}
                </button>
              </div>
              <div className="space-y-2">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center justify-between p-3 bg-[#181F32]/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                      <span className="text-[#F3F4F6]">{tag.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingTag(tag); setTagFormData(tag); }}
                        className="p-1 text-[#9CA3AF] hover:text-[#D1D5DB]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="p-1 text-[#FF3B30] hover:text-[#FF6B5A]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Tag, FolderOpen } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  ip: string;
  group: string;
  tags: string[];
  status: 'online' | 'offline' | 'warning';
  createdAt: string;
  description: string;
}

interface Group {
  id: string;
  name: string;
  count: number;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

const mockDevices: Device[] = [
  { id: 'DEV-001', name: '主防火墙-FW-01', ip: '192.168.1.1', group: '网络安全', tags: ['防火墙', '核心设备'], status: 'online', createdAt: '2026-05-15 10:30:00', description: '总部网络入口防火墙' },
  { id: 'DEV-002', name: '入侵检测系统-IDS-01', ip: '192.168.1.2', group: '网络安全', tags: ['IDS', '监控'], status: 'online', createdAt: '2026-05-16 14:20:00', description: '核心区入侵检测设备' },
  { id: 'DEV-003', name: 'Web应用防火墙-WAF-01', ip: '192.168.1.3', group: '应用安全', tags: ['WAF', 'Web防护'], status: 'warning', createdAt: '2026-05-17 09:15:00', description: 'Web应用防护设备' },
  { id: 'DEV-004', name: '终端安全管理-EDR-01', ip: '192.168.1.4', group: '终端安全', tags: ['EDR', '终端'], status: 'offline', createdAt: '2026-05-18 16:45:00', description: '终端安全管理平台' },
];

const mockGroups: Group[] = [
  { id: 'group-1', name: '网络安全', count: 2 },
  { id: 'group-2', name: '应用安全', count: 1 },
  { id: 'group-3', name: '终端安全', count: 1 },
];

const mockTags: Tag[] = [
  { id: 'tag-1', name: '防火墙', color: 'blue' },
  { id: 'tag-2', name: 'IDS', color: 'green' },
  { id: 'tag-3', name: 'WAF', color: 'purple' },
  { id: 'tag-4', name: '核心设备', color: 'yellow' },
  { id: 'tag-5', name: '监控', color: 'cyan' },
];

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [searchName, setSearchName] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Device | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<Partial<Device>>({
    name: '',
    ip: '',
    group: '',
    tags: [],
    description: '',
  });
  const [groupFormData, setGroupFormData] = useState<Partial<Group>>({ name: '' });
  const [tagFormData, setTagFormData] = useState<Partial<Tag>>({ name: '', color: 'blue' });

  const filteredDevices = devices.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchGroup = !filterGroup || item.group === filterGroup;
    const matchTag = !filterTag || item.tags.includes(filterTag);
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchGroup && matchTag && matchStatus;
  });

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
    const colors = {
      blue: 'bg-[#0066FF]/20 text-[#0066FF]',
      green: 'bg-[#00C853]/20 text-[#00C853]',
      purple: 'bg-[#6366F1]/20 text-[#6366F1]',
      yellow: 'bg-[#FF9100]/20 text-[#FF9100]',
      cyan: 'bg-[#00BCD4]/20 text-[#00BCD4]',
    };
    return colors[color as keyof typeof colors] || 'bg-[#4A5570]/20 text-[#9CA3AF]';
  };

  const handleOpenModal = (item?: Device) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', ip: '', group: '', tags: [], description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.ip) return;
    if (editingItem) {
      setDevices(devices.map(item => item.id === editingItem.id ? { ...item, ...formData } as Device : item));
    } else {
      const newItem: Device = {
        id: `DEV-${String(devices.length + 1).padStart(3, '0')}`,
        name: formData.name,
        ip: formData.ip,
        group: formData.group || '',
        tags: formData.tags || [],
        status: 'online',
        createdAt: new Date().toLocaleString('zh-CN'),
        description: formData.description || '',
      };
      setDevices([...devices, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个设备吗？')) {
      setDevices(devices.filter(item => item.id !== id));
    }
  };

  const handleSaveGroup = () => {
    if (!groupFormData.name) return;
    if (editingGroup) {
      setGroups(groups.map(item => item.id === editingGroup.id ? { ...item, ...groupFormData } as Group : item));
    } else {
      const newGroup: Group = {
        id: `group-${groups.length + 1}`,
        name: groupFormData.name,
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
      setTags(tags.map(item => item.id === editingTag.id ? { ...item, ...tagFormData } as Tag : item));
    } else {
      const newTag: Tag = {
        id: `tag-${tags.length + 1}`,
        name: tagFormData.name,
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">安全设备列表管理</h1>
        <p className="text-[#9CA3AF]">管理和配置安全设备资源</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索设备名称..."
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
              新增设备
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">设备名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">IP地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">分组</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">标签</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredDevices.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
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
            ))}
          </tbody>
        </table>

        {filteredDevices.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">暂无数据</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingItem ? '编辑设备' : '新增设备'}
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
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">设备名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入设备名称"
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
                  placeholder="请输入设备描述"
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
                      <span className="text-[#6B7280] ml-2 text-sm">({group.count}个设备)</span>
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

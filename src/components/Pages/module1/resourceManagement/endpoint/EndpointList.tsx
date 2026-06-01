'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Tag, FolderOpen } from 'lucide-react';

interface Endpoint {
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

const mockEndpoints: Endpoint[] = [
  { id: 'EP-001', name: '终端设备-TAG-001', ip: '192.168.1.101', group: '办公区终端', tags: ['办公', 'Windows'], status: 'online', createdAt: '2026-05-15 10:30:00', description: '行政部门办公终端' },
  { id: 'EP-002', name: '终端设备-TAG-002', ip: '192.168.1.102', group: '研发区终端', tags: ['研发', 'Linux'], status: 'online', createdAt: '2026-05-16 14:20:00', description: '开发人员工作终端' },
  { id: 'EP-003', name: '终端设备-TAG-003', ip: '192.168.1.103', group: '办公区终端', tags: ['办公', 'Windows'], status: 'warning', createdAt: '2026-05-17 09:15:00', description: '财务部门办公终端' },
  { id: 'EP-004', name: '终端设备-TAG-004', ip: '192.168.1.104', group: '访客区终端', tags: ['访客', '临时'], status: 'offline', createdAt: '2026-05-18 16:45:00', description: '访客临时终端' },
];

const mockGroups: Group[] = [
  { id: 'group-1', name: '办公区终端', count: 2 },
  { id: 'group-2', name: '研发区终端', count: 1 },
  { id: 'group-3', name: '访客区终端', count: 1 },
];

const mockTags: Tag[] = [
  { id: 'tag-1', name: '办公', color: 'blue' },
  { id: 'tag-2', name: '研发', color: 'green' },
  { id: 'tag-3', name: 'Windows', color: 'purple' },
  { id: 'tag-4', name: 'Linux', color: 'yellow' },
  { id: 'tag-5', name: '访客', color: 'cyan' },
];

export function EndpointList() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(mockEndpoints);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [searchName, setSearchName] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Endpoint | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<Partial<Endpoint>>({
    name: '',
    ip: '',
    group: '',
    tags: [],
    description: '',
  });
  const [groupFormData, setGroupFormData] = useState<Partial<Group>>({ name: '' });
  const [tagFormData, setTagFormData] = useState<Partial<Tag>>({ name: '', color: 'blue' });

  const filteredEndpoints = endpoints.filter(item => {
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
      blue: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      green: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      purple: 'bg-[#6366F1]/20 text-[#6366F1] border-purple-500/30',
      yellow: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      cyan: 'bg-[#00BCD4]/20 text-[#00BCD4] border-cyan-500/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleOpenModal = (item?: Endpoint) => {
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
      setEndpoints(endpoints.map(e => e.id === editingItem.id ? { ...e, ...formData } as Endpoint : e));
    } else {
      setEndpoints([...endpoints, { ...formData, id: `EP-${String(endpoints.length + 1).padStart(3, '0')}`, status: 'online', createdAt: new Date().toLocaleString() } as Endpoint]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个终端吗？')) {
      setEndpoints(endpoints.filter(e => e.id !== id));
    }
  };

  const handleSaveGroup = () => {
    if (!groupFormData.name) return;
    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...groupFormData } as Group : g));
    } else {
      setGroups([...groups, { ...groupFormData, id: `group-${groups.length + 1}`, count: 0 } as Group]);
    }
    setIsGroupModalOpen(false);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('确定要删除这个分组吗？')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const handleSaveTag = () => {
    if (!tagFormData.name) return;
    if (editingTag) {
      setTags(tags.map(t => t.id === editingTag.id ? { ...t, ...tagFormData } as Tag : t));
    } else {
      setTags([...tags, { ...tagFormData, id: `tag-${tags.length + 1}` } as Tag]);
    }
    setIsTagModalOpen(false);
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('确定要删除这个标签吗？')) {
      setTags(tags.filter(t => t.id !== id));
    }
  };

  const toggleTag = (tagName: string) => {
    const currentTags = formData.tags || [];
    setFormData({
      ...formData,
      tags: currentTags.includes(tagName)
        ? currentTags.filter(t => t !== tagName)
        : [...currentTags, tagName]
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">终端列表管理</h1>
        <p className="text-[#9CA3AF]">管理和监控企业终端设备资源</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                分组
              </h3>
              <button
                onClick={() => { setEditingGroup(null); setGroupFormData({ name: '' }); setIsGroupModalOpen(true); }}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setFilterGroup('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filterGroup ? 'bg-[#0066FF]/20 text-[#0066FF]' : 'text-[#9CA3AF] hover:bg-[#181F32]'}`}
              >
                全部分组
              </button>
              {groups.map(group => (
                <div key={group.id} className="flex items-center justify-between group">
                  <button
                    onClick={() => setFilterGroup(group.name)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${filterGroup === group.name ? 'bg-[#0066FF]/20 text-[#0066FF]' : 'text-[#9CA3AF] hover:bg-[#181F32]'}`}
                  >
                    {group.name}
                    <span className="ml-2 text-xs text-[#6B7280]">({group.count})</span>
                  </button>
                  <div className="hidden group-hover:flex gap-1">
                    <button
                      onClick={() => { setEditingGroup(group); setGroupFormData(group); setIsGroupModalOpen(true); }}
                      className="p-1 text-[#6B7280] hover:text-[#D1D5DB]"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-1 text-[#6B7280] hover:text-[#FF3B30]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
                <Tag className="w-4 h-4" />
                标签
              </h3>
              <button
                onClick={() => { setEditingTag(null); setTagFormData({ name: '', color: 'blue' }); setIsTagModalOpen(true); }}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag('')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${!filterTag ? 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30' : 'bg-[#181F32] text-[#9CA3AF] border-[#2A354D] hover:border-[#3A4560]'}`}
              >
                全部
              </button>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setFilterTag(filterTag === tag.name ? '' : tag.name)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${filterTag === tag.name ? getTagColorClass(tag.color) : 'bg-[#181F32] text-[#9CA3AF] border-[#2A354D] hover:border-[#3A4560]'}`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="搜索终端名称..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
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
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加终端
            </button>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#181F32]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">终端名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">IP地址</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">分组</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">标签</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredEndpoints.map(endpoint => (
                  <tr key={endpoint.id} className="hover:bg-[#181F32]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#F3F4F6]">{endpoint.name}</div>
                      <div className="text-sm text-[#6B7280]">{endpoint.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB] font-mono">{endpoint.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{endpoint.group}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {endpoint.tags.map(tag => {
                          const tagData = tags.find(t => t.name === tag);
                          return (
                            <span key={tag} className={`px-2 py-0.5 rounded-full text-xs border ${tagData ? getTagColorClass(tagData.color) : 'bg-[#2A354D] text-[#D1D5DB] border-[#3A4560]'}`}>
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(endpoint.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{endpoint.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(endpoint)}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(endpoint.id)}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
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
            {filteredEndpoints.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[#6B7280]">暂无符合条件的终端</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">{editingItem ? '编辑终端' : '添加终端'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">终端名称</label>
                <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">IP地址</label>
                <input value={formData.ip || ''} onChange={(e) => setFormData({ ...formData, ip: e.target.value })} className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">分组</label>
                <select value={formData.group || ''} onChange={(e) => setFormData({ ...formData, group: e.target.value })} className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
                  <option value="">请选择分组</option>
                  {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">标签</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${(formData.tags || []).includes(tag.name) ? getTagColorClass(tag.color) : 'bg-[#181F32] text-[#9CA3AF] border-[#2A354D] hover:border-[#3A4560]'}`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">描述</label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">取消</button>
                <button onClick={handleSave} className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">{editingGroup ? '编辑分组' : '添加分组'}</h3>
              <button onClick={() => setIsGroupModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">分组名称</label>
                <input value={groupFormData.name || ''} onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })} className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setIsGroupModalOpen(false)} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">取消</button>
                <button onClick={handleSaveGroup} className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">{editingTag ? '编辑标签' : '添加标签'}</h3>
              <button onClick={() => setIsTagModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">标签名称</label>
                <input value={tagFormData.name || ''} onChange={(e) => setTagFormData({ ...tagFormData, name: e.target.value })} className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">标签颜色</label>
                <select value={tagFormData.color || 'blue'} onChange={(e) => setTagFormData({ ...tagFormData, color: e.target.value })} className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
                  <option value="blue">蓝色</option>
                  <option value="green">绿色</option>
                  <option value="purple">紫色</option>
                  <option value="yellow">黄色</option>
                  <option value="cyan">青色</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setIsTagModalOpen(false)} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">取消</button>
                <button onClick={handleSaveTag} className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
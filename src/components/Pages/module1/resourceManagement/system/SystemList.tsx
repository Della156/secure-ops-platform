'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Tag, FolderOpen } from 'lucide-react';

interface SecuritySystem {
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

const mockSystems: SecuritySystem[] = [
  { id: 'sys-1', name: 'SIEM日志分析平台', ip: '192.168.2.10', group: '分析平台', tags: ['SIEM', '日志分析'], status: 'online', createdAt: '2026-05-15 10:30:00', description: '安全信息和事件管理系统' },
  { id: 'sys-2', name: '威胁情报平台', ip: '192.168.2.11', group: '情报系统', tags: ['威胁情报', 'TIP'], status: 'online', createdAt: '2026-05-16 14:20:00', description: '威胁情报收集和分析平台' },
  { id: 'sys-3', name: '漏洞扫描系统', ip: '192.168.2.12', group: '扫描系统', tags: ['漏洞扫描', '安全评估'], status: 'warning', createdAt: '2026-05-17 09:15:00', description: '自动化漏洞扫描和评估' },
  { id: 'sys-4', name: '用户行为分析', ip: '192.168.2.13', group: '分析平台', tags: ['UBA', '行为分析'], status: 'offline', createdAt: '2026-05-18 16:45:00', description: '用户异常行为检测系统' },
];

const mockGroups: Group[] = [
  { id: 'group-1', name: '分析平台', count: 2 },
  { id: 'group-2', name: '情报系统', count: 1 },
  { id: 'group-3', name: '扫描系统', count: 1 },
];

const mockTags: Tag[] = [
  { id: 'tag-1', name: 'SIEM', color: 'blue' },
  { id: 'tag-2', name: '日志分析', color: 'green' },
  { id: 'tag-3', name: '威胁情报', color: 'purple' },
  { id: 'tag-4', name: '漏洞扫描', color: 'yellow' },
  { id: 'tag-5', name: 'UBA', color: 'cyan' },
];

export function SystemList() {
  const [systems, setSystems] = useState<SecuritySystem[]>(mockSystems);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [searchName, setSearchName] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SecuritySystem | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<Partial<SecuritySystem>>({
    name: '',
    ip: '',
    group: '',
    tags: [],
    description: '',
  });
  const [groupFormData, setGroupFormData] = useState<Partial<Group>>({ name: '' });
  const [tagFormData, setTagFormData] = useState<Partial<Tag>>({ name: '', color: 'blue' });

  const filteredSystems = systems.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchGroup = !filterGroup || item.group === filterGroup;
    const matchTag = !filterTag || item.tags.includes(filterTag);
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchGroup && matchTag && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
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
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      cyan: 'bg-cyan-500/20 text-cyan-400',
    };
    return colors[color as keyof typeof colors] || 'bg-slate-500/20 text-slate-400';
  };

  const handleOpenModal = (item?: SecuritySystem) => {
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
      setSystems(systems.map(item => item.id === editingItem.id ? { ...item, ...formData } as SecuritySystem : item));
    } else {
      const newItem: SecuritySystem = {
        id: `sys-${String(systems.length + 1).padStart(3, '0')}`,
        name: formData.name,
        ip: formData.ip,
        group: formData.group || '',
        tags: formData.tags || [],
        status: 'online',
        createdAt: new Date().toLocaleString('zh-CN'),
        description: formData.description || '',
      };
      setSystems([...systems, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个系统吗？')) {
      setSystems(systems.filter(item => item.id !== id));
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
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">安全系统列表管理</h1>
        <p className="text-slate-400">管理和配置安全系统资源</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索系统名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部分组</option>
              {groups.map(group => (
                <option key={group.id} value={group.name}>{group.name}</option>
              ))}
            </select>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部标签</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              分组管理
            </button>
            <button
              onClick={() => { setEditingTag(null); setTagFormData({ name: '', color: 'blue' }); setIsTagModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <Tag className="w-4 h-4" />
              标签管理
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增系统
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">系统名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">分组</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">标签</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredSystems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">{item.group}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tags.find(t => t.name === tag)?.color || 'blue')}`}>{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors" title="编辑">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSystems.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">暂无数据</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">{editingItem ? '编辑系统' : '新增系统'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">系统名称</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入系统名称" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">IP地址</label>
                <input type="text" value={formData.ip || ''} onChange={(e) => setFormData({ ...formData, ip: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="192.168.1.1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">分组</label>
                <select value={formData.group || ''} onChange={(e) => setFormData({ ...formData, group: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">请选择分组</option>
                  {groups.map(group => <option key={group.id} value={group.name}>{group.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">标签</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <label key={tag.id} className="flex items-center gap-1">
                      <input type="checkbox" checked={(formData.tags || []).includes(tag.name)} onChange={(e) => {
                        const currentTags = formData.tags || [];
                        const newTags = e.target.checked ? [...currentTags, tag.name] : currentTags.filter(t => t !== tag.name);
                        setFormData({ ...formData, tags: newTags });
                      }} className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500" />
                      <span className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">描述</label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入系统描述" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">保存</button>
            </div>
          </div>
        </div>
      )}

      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">分组管理</h3>
              <button onClick={() => setIsGroupModalOpen(false)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <input type="text" value={groupFormData.name || ''} onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })} className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="分组名称" />
                <button onClick={handleSaveGroup} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">{editingGroup ? '更新' : '添加'}</button>
              </div>
              <div className="space-y-2">
                {groups.map(group => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <span className="text-white">{group.name}</span>
                      <span className="text-slate-500 ml-2 text-sm">({group.count}个系统)</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingGroup(group); setGroupFormData(group); }} className="p-1 text-slate-400 hover:text-slate-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteGroup(group.id)} className="p-1 text-red-400 hover:text-red-300">
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">标签管理</h3>
              <button onClick={() => setIsTagModalOpen(false)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <input type="text" value={tagFormData.name || ''} onChange={(e) => setTagFormData({ ...tagFormData, name: e.target.value })} className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="标签名称" />
                <select value={tagFormData.color || 'blue'} onChange={(e) => setTagFormData({ ...tagFormData, color: e.target.value })} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="blue">蓝色</option>
                  <option value="green">绿色</option>
                  <option value="purple">紫色</option>
                  <option value="yellow">黄色</option>
                  <option value="cyan">青色</option>
                </select>
                <button onClick={handleSaveTag} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">{editingTag ? '更新' : '添加'}</button>
              </div>
              <div className="space-y-2">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                      <span className="text-white">{tag.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingTag(tag); setTagFormData(tag); }} className="p-1 text-slate-400 hover:text-slate-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTag(tag.id)} className="p-1 text-red-400 hover:text-red-300">
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

'use client';

import React, { useState } from 'react';
import {
  Star, Search, Plus, X, Edit3, Trash2,
  RefreshCw, Settings, Grid3X3, LayoutDashboard,
  Shield, AlertTriangle, Database, BarChart3,
  FileText, Users, Bell, Settings2
} from 'lucide-react';

interface FavoriteItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  usageCount: number;
}

interface QuickAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut: string;
}

const favoriteItems: FavoriteItem[] = [
  { id: 'f1', name: '安全态势总览', icon: <LayoutDashboard className="w-6 h-6" />, category: '仪表盘', usageCount: 156 },
  { id: 'f2', name: '漏洞扫描', icon: <AlertTriangle className="w-6 h-6" />, category: '安全', usageCount: 89 },
  { id: 'f3', name: '资产风险评估', icon: <Shield className="w-6 h-6" />, category: '资产', usageCount: 78 },
  { id: 'f4', name: '威胁情报', icon: <Database className="w-6 h-6" />, category: '情报', usageCount: 65 },
  { id: 'f5', name: '安全报告', icon: <FileText className="w-6 h-6" />, category: '报告', usageCount: 45 },
];

const quickActions: QuickAction[] = [
  { id: 'q1', name: '新建告警', icon: <AlertTriangle className="w-5 h-5" />, shortcut: 'Ctrl+N' },
  { id: 'q2', name: '搜索日志', icon: <Search className="w-5 h-5" />, shortcut: 'Ctrl+F' },
  { id: 'q3', name: '导出报告', icon: <FileText className="w-5 h-5" />, shortcut: 'Ctrl+E' },
  { id: 'q4', name: '刷新数据', icon: <RefreshCw className="w-5 h-5" />, shortcut: 'F5' },
];

const categories = ['全部', '仪表盘', '安全', '资产', '情报', '报告'];

export function QuickActionsFavorites() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [favorites, setFavorites] = useState(favoriteItems);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredFavorites = favorites.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === '全部' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const addFavorite = () => {
    const newItem: FavoriteItem = {
      id: `f${Date.now()}`,
      name: '新收藏项',
      icon: <Grid3X3 className="w-6 h-6" />,
      category: '其他',
      usageCount: 0,
    };
    setFavorites([...favorites, newItem]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            快捷操作入口与常用功能收藏
          </h2>
          <p className="text-sm text-gray-400 mt-1">管理您的收藏功能和快捷操作</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            添加收藏
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-green-400" />
          快捷操作
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className="bg-[#111625] hover:bg-blue-500/20 border border-[#2A354D] hover:border-blue-500/50 rounded-lg p-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2 group-hover:bg-blue-500/30">
                {action.icon}
              </div>
              <div className="text-sm text-white">{action.name}</div>
              <div className="text-xs text-gray-500 mt-1 font-mono">{action.shortcut}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索收藏..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400">
                  {item.icon}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-[#20293F] rounded">
                    <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button onClick={() => removeFavorite(item.id)} className="p-1 hover:bg-red-500/20 rounded">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-medium text-white">{item.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{item.category}</span>
                <span className="text-xs text-gray-500">使用 {item.usageCount} 次</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredFavorites.length} 个收藏</span>
          <button className="text-xs text-blue-400 hover:text-blue-300">查看全部</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-400" />
            快捷操作设置
          </h3>
          <div className="space-y-3">
            {[
              { label: '启用快捷键', enabled: true },
              { label: '显示快捷提示', enabled: true },
              { label: '自动记录使用频率', enabled: true },
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{setting.label}</span>
                <button className={`w-10 h-5 rounded-full transition-all ${setting.enabled ? 'bg-blue-600' : 'bg-[#2A354D]'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${setting.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            收藏统计
          </h3>
          <div className="space-y-2">
            {[
              { label: '总收藏数', value: favorites.length },
              { label: '本周使用', value: '45次' },
              { label: '最常使用', value: '安全态势总览' },
              { label: '分类数量', value: '6个' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-gray-400">{stat.label}</span>
                <span className="text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickActionsFavorites;
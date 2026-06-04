'use client';

import { useState } from 'react';
import { Folder, Lock, Unlock, Shield } from 'lucide-react';

const mockCategories = [
  { id: 'public', name: '公开数据', count: 15, icon: Unlock, color: 'bg-green-500/20 text-green-400' },
  { id: 'internal', name: '内部数据', count: 28, icon: Folder, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'confidential', name: '机密数据', count: 12, icon: Shield, color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'secret', name: '绝密数据', count: 5, icon: Lock, color: 'bg-red-500/20 text-red-400' },
];

const mockDataByCategory = {
  public: [
    { name: '公开文档', size: '50 MB', updated: '2024-01-15' },
    { name: '产品手册', size: '10 MB', updated: '2024-01-14' },
    { name: '宣传资料', size: '25 MB', updated: '2024-01-13' },
  ],
  internal: [
    { name: '内部报告', size: '100 MB', updated: '2024-01-15' },
    { name: '会议记录', size: '50 MB', updated: '2024-01-14' },
    { name: '流程文档', size: '30 MB', updated: '2024-01-12' },
  ],
  confidential: [
    { name: '财务数据', size: '500 MB', updated: '2024-01-15' },
    { name: '客户信息', size: '1 GB', updated: '2024-01-14' },
    { name: '项目计划', size: '100 MB', updated: '2024-01-13' },
  ],
  secret: [
    { name: '核心代码', size: '2 GB', updated: '2024-01-15' },
    { name: '安全策略', size: '50 MB', updated: '2024-01-14' },
    { name: '应急预案', size: '30 MB', updated: '2024-01-12' },
  ],
};

export function DataClassification() {
  const [selectedCategory, setSelectedCategory] = useState('public');

  const stats = {
    total: mockCategories.reduce((sum, cat) => sum + cat.count, 0),
    public: mockCategories.find(c => c.id === 'public')?.count || 0,
    internal: mockCategories.find(c => c.id === 'internal')?.count || 0,
    confidential: mockCategories.find(c => c.id === 'confidential')?.count || 0,
    secret: mockCategories.find(c => c.id === 'secret')?.count || 0,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">数据分类管理</h1>
          <p className="text-slate-400 mt-1">按安全级别分类管理数据</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">数据总数</span>
            <Folder className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">公开数据</span>
            <Unlock className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.public}</div>
        </div>
        <div className="bg-[#20293F] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">内部数据</span>
            <Folder className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">{stats.internal}</div>
        </div>
        <div className="bg-[#20293F] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">涉密数据</span>
            <Lock className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2">{stats.confidential + stats.secret}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">数据分类</h3>
          <div className="space-y-2">
            {mockCategories.map(category => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedCategory === category.id 
                      ? 'bg-blue-500/20 ring-1 ring-blue-500/40' 
                      : 'bg-[#20293F] hover:bg-[#111625]/50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={`w-10 h-10 rounded-lg ${category.color.split(' ')[0]} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${category.color.split(' ')[1]}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{category.name}</p>
                    <p className="text-slate-500 text-xs">{category.count} 项</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">
            {mockCategories.find(c => c.id === selectedCategory)?.name}列表
          </h3>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#111625] text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-4 py-2.5">数据名称</th>
                  <th className="text-left px-4 py-2.5">大小</th>
                  <th className="text-left px-4 py-2.5">更新时间</th>
                </tr>
              </thead>
              <tbody>
                {mockDataByCategory[selectedCategory as keyof typeof mockDataByCategory].map((item, index) => (
                  <tr key={index} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.size}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
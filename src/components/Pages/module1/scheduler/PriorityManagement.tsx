'use client';

import React, { useState } from 'react';
import { Search, Edit, GripVertical, ArrowUp, ArrowDown, Flag, X } from 'lucide-react';

// 优先级数据类型
interface PriorityItem {
  id: string;
  taskName: string;
  priority: 'high' | 'medium' | 'low';
  queuePosition: number;
  createdAt: string;
}

// 模拟数据
const mockData: PriorityItem[] = [
  { id: 'PRIO-001', taskName: '漏洞紧急修复', priority: 'high', queuePosition: 1, createdAt: '2026-05-20 10:00:00' },
  { id: 'PRIO-002', taskName: '安全审计报告生成', priority: 'high', queuePosition: 2, createdAt: '2026-05-21 14:30:00' },
  { id: 'PRIO-003', taskName: '系统日常扫描', priority: 'medium', queuePosition: 3, createdAt: '2026-05-22 09:15:00' },
  { id: 'PRIO-004', taskName: '日志归档清理', priority: 'medium', queuePosition: 4, createdAt: '2026-05-23 16:45:00' },
  { id: 'PRIO-005', taskName: '数据备份验证', priority: 'low', queuePosition: 5, createdAt: '2026-05-24 11:00:00' },
  { id: 'PRIO-006', taskName: '性能统计分析', priority: 'low', queuePosition: 6, createdAt: '2026-05-25 08:00:00' },
];

export function PriorityManagement() {
  const [data, setData] = useState<PriorityItem[]>(mockData);
  const [searchName, setSearchName] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriorityItem | null>(null);
  const [formData, setFormData] = useState<Partial<PriorityItem>>({
    taskName: '',
    priority: 'medium',
  });

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchName = item.taskName.toLowerCase().includes(searchName.toLowerCase());
    const matchPriority = !filterPriority || item.priority === filterPriority;
    return matchName && matchPriority;
  }).sort((a, b) => a.queuePosition - b.queuePosition);

  // 打开编辑模态框
  const handleOpenModal = (item: PriorityItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  // 保存数据
  const handleSave = () => {
    if (!editingItem || !formData.taskName || !formData.priority) return;

    setData(data.map(item => item.id === editingItem.id ? { ...item, ...formData } as PriorityItem : item));
    setIsModalOpen(false);
  };

  // 上移
  const handleMoveUp = (id: string) => {
    const newData = [...data];
    const index = newData.findIndex(item => item.id === id);
    if (index <= 0) return;

    const current = newData[index];
    const prev = newData[index - 1];

    newData[index] = { ...current, queuePosition: prev.queuePosition };
    newData[index - 1] = { ...prev, queuePosition: current.queuePosition };

    setData(newData);
  };

  // 下移
  const handleMoveDown = (id: string) => {
    const newData = [...data];
    const index = newData.findIndex(item => item.id === id);
    if (index >= newData.length - 1) return;

    const current = newData[index];
    const next = newData[index + 1];

    newData[index] = { ...current, queuePosition: next.queuePosition };
    newData[index + 1] = { ...next, queuePosition: current.queuePosition };

    setData(newData);
  };

  // 获取优先级标签
  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    const labels = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级',
    };
    const icons = {
      high: '🚨',
      medium: '⚠️',
      low: '✅',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
        {icons[priority as keyof typeof icons]}
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务优先级管理</h1>
        <p className="text-slate-400">管理任务执行的优先级和队列顺序</p>
      </div>

      {/* 操作栏 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索任务名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* 优先级筛选 */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>

          {/* 拖拽提示 */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <GripVertical className="w-4 h-4" />
            <span>拖拽调整队列顺序</span>
          </div>
        </div>
      </div>

      {/* 优先级统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { label: '高优先级任务', count: data.filter(d => d.priority === 'high').length, color: 'red' },
          { label: '中优先级任务', count: data.filter(d => d.priority === 'medium').length, color: 'yellow' },
          { label: '低优先级任务', count: data.filter(d => d.priority === 'low').length, color: 'green' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${
                  stat.color === 'red' ? 'text-red-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'
                }`}>{stat.count}</p>
              </div>
              <Flag className={`w-8 h-8 ${
                stat.color === 'red' ? 'text-red-500' :
                stat.color === 'yellow' ? 'text-yellow-500' : 'text-green-500'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {/* 队列列表 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-12">
                排序
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                任务名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                优先级
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                队列位置
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-medium ${
                    item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(item.id)}
                      disabled={index === 0}
                      className={`p-1 rounded transition-colors ${
                        index === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(item.id)}
                      disabled={index === filteredData.length - 1}
                      className={`p-1 rounded transition-colors ${
                        index === filteredData.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.taskName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(item.priority)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  <span className="font-mono text-blue-400">#{item.queuePosition}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                    title="编辑优先级"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">暂无数据</p>
          </div>
        )}
      </div>

      {/* 编辑模态框 */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">编辑优先级</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">任务名称</label>
                <input
                  type="text"
                  value={formData.taskName || ''}
                  onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">优先级</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'high', label: '高优先级', color: 'red', icon: '🚨', desc: '优先执行' },
                    { value: 'medium', label: '中优先级', color: 'yellow', icon: '⚠️', desc: '普通执行' },
                    { value: 'low', label: '低优先级', color: 'green', icon: '✅', desc: '最后执行' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: option.value as any })}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        formData.priority === option.value
                          ? option.color === 'red' ? 'border-red-500 bg-red-500/10' :
                            option.color === 'yellow' ? 'border-yellow-500 bg-yellow-500/10' :
                            'border-green-500 bg-green-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className={`font-medium ${
                        formData.priority === option.value
                          ? option.color === 'red' ? 'text-red-400' :
                            option.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'
                          : 'text-white'
                      }`}>{option.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">队列位置</label>
                <input
                  type="number"
                  value={formData.queuePosition || ''}
                  onChange={(e) => setFormData({ ...formData, queuePosition: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                  max={data.length}
                />
                <p className="text-xs text-slate-500 mt-1.5">当前队列总长度: {data.length}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

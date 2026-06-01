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
      high: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      medium: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      low: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
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
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务优先级管理</h1>
        <p className="text-[#9CA3AF]">管理任务执行的优先级和队列顺序</p>
      </div>

      {/* 操作栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索任务名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>

            {/* 优先级筛选 */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>

          {/* 拖拽提示 */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
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
          <div key={idx} className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${
                  stat.color === 'red' ? 'text-[#FF3B30]' :
                  stat.color === 'yellow' ? 'text-[#FF9100]' : 'text-[#00C853]'
                }`}>{stat.count}</p>
              </div>
              <Flag className={`w-8 h-8 ${
                stat.color === 'red' ? 'text-[#FF3B30]' :
                stat.color === 'yellow' ? 'text-[#FF9100]' : 'text-[#00C853]'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {/* 队列列表 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider w-12">
                排序
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                任务名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                优先级
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                队列位置
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-medium ${
                    item.priority === 'high' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                    item.priority === 'medium' ? 'bg-[#FF9100]/20 text-[#FF9100]' :
                    'bg-[#00C853]/20 text-[#00C853]'
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
                        index === 0 ? 'text-[#374151] cursor-not-allowed' : 'text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#2A354D]'
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(item.id)}
                      disabled={index === filteredData.length - 1}
                      className={`p-1 rounded transition-colors ${
                        index === filteredData.length - 1 ? 'text-[#374151] cursor-not-allowed' : 'text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#2A354D]'
                      }`}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.taskName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(item.priority)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                  <span className="font-mono text-[#0066FF]">#{item.queuePosition}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
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
            <p className="text-[#6B7280]">暂无数据</p>
          </div>
        )}
      </div>

      {/* 编辑模态框 */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">编辑优先级</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务名称</label>
                <input
                  type="text"
                  value={formData.taskName || ''}
                  onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">优先级</label>
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
                          ? option.color === 'red' ? 'border-red-500 bg-[#FF3B30]/10' :
                            option.color === 'yellow' ? 'border-yellow-500 bg-[#FF9100]/10' :
                            'border-green-500 bg-[#00C853]/10'
                          : 'border-[#2A354D] bg-[#181F32] hover:border-[#3A4560]'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className={`font-medium ${
                        formData.priority === option.value
                          ? option.color === 'red' ? 'text-[#FF3B30]' :
                            option.color === 'yellow' ? 'text-[#FF9100]' : 'text-[#00C853]'
                          : 'text-[#F3F4F6]'
                      }`}>{option.label}</div>
                      <div className="text-xs text-[#6B7280] mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">队列位置</label>
                <input
                  type="number"
                  value={formData.queuePosition || ''}
                  onChange={(e) => setFormData({ ...formData, queuePosition: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  min={1}
                  max={data.length}
                />
                <p className="text-xs text-[#6B7280] mt-1.5">当前队列总长度: {data.length}</p>
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
    </div>
  );
}

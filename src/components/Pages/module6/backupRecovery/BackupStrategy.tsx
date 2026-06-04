'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Clock, Play, Pause, Database, HardDrive } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface BackupTask {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  target: string;
  schedule: string;
  lastBackup: string;
  nextBackup: string;
  status: 'running' | 'scheduled' | 'completed' | 'failed';
  retentionDays: number;
  createTime: string;
}

export function BackupStrategy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const mockData: BackupTask[] = [
    { id: 'BK-001', name: '数据库全量备份', type: 'full', target: 'MySQL主库', schedule: '每天 02:00', lastBackup: '2026-06-04 02:00:00', nextBackup: '2026-06-05 02:00:00', status: 'completed', retentionDays: 30, createTime: '2026-01-10 09:00:00' },
    { id: 'BK-002', name: '配置文件备份', type: 'incremental', target: '系统配置', schedule: '每小时', lastBackup: '2026-06-04 10:00:00', nextBackup: '2026-06-04 11:00:00', status: 'scheduled', retentionDays: 7, createTime: '2026-02-15 14:30:00' },
    { id: 'BK-003', name: '日志数据备份', type: 'incremental', target: 'Elasticsearch', schedule: '每30分钟', lastBackup: '2026-06-04 10:30:00', nextBackup: '2026-06-04 11:00:00', status: 'running', retentionDays: 14, createTime: '2026-03-01 10:00:00' },
    { id: 'BK-004', name: '用户数据备份', type: 'differential', target: 'MySQL用户库', schedule: '每天 00:00', lastBackup: '2026-06-04 00:00:00', nextBackup: '2026-06-05 00:00:00', status: 'completed', retentionDays: 15, createTime: '2026-04-20 16:00:00' },
    { id: 'BK-005', name: '威胁情报备份', type: 'full', target: '威胁情报库', schedule: '每周日 03:00', lastBackup: '2026-06-01 03:00:00', nextBackup: '2026-06-08 03:00:00', status: 'scheduled', retentionDays: 90, createTime: '2026-05-05 11:00:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full': return '全量备份';
      case 'incremental': return '增量备份';
      case 'differential': return '差异备份';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-orange-500/20 text-orange-400';
      case 'incremental': return 'bg-blue-500/20 text-blue-400';
      case 'differential': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'running': return '备份中';
      case 'scheduled': return '已调度';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return status;
    }
  };

  const stats = {
    total: mockData.length,
    running: mockData.filter(t => t.status === 'running').length,
    completed: mockData.filter(t => t.status === 'completed').length,
    scheduled: mockData.filter(t => t.status === 'scheduled').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">备份策略制定与任务调度</h2>
          <p className="text-sm text-gray-400 mt-1">制定数据备份策略，配置备份任务调度规则</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增备份任务
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">备份任务数</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">备份中</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">已调度</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.scheduled}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">已完成</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.completed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索备份任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">任务名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">备份类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">目标</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">调度周期</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">保留天数</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(item.type)}`}>
                    {getTypeLabel(item.type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.target}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.schedule}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.retentionDays}天</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredData.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增备份任务">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">任务名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入任务名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">备份类型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="full">全量备份</option>
              <option value="incremental">增量备份</option>
              <option value="differential">差异备份</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">备份目标</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="备份目标" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">调度周期</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="如：每天 02:00" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">保留天数</label>
            <input type="number" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="保留天数" />
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

export default BackupStrategy;
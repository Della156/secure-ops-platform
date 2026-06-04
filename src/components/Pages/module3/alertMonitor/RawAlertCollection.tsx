'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Edit2, Trash2, Play, FileText, Settings, Database, Shield, Server } from 'lucide-react';

interface CollectionTask {
  id: string;
  name: string;
  sourceType: 'SIEM' | 'Firewall' | 'IPS' | 'Other';
  collectionCycle: string;
  lastCollectTime: string;
  recordCount: number;
  status: 'running' | 'stopped' | 'error';
}

const mockTasks: CollectionTask[] = [
  { id: 'COL-001', name: 'SIEM告警采集', sourceType: 'SIEM', collectionCycle: '每分钟', lastCollectTime: '2026-06-03 14:30:00', recordCount: 12580, status: 'running' },
  { id: 'COL-002', name: '防火墙日志采集', sourceType: 'Firewall', collectionCycle: '每5分钟', lastCollectTime: '2026-06-03 14:28:00', recordCount: 8920, status: 'running' },
  { id: 'COL-003', name: 'IPS告警采集', sourceType: 'IPS', collectionCycle: '每2分钟', lastCollectTime: '2026-06-03 14:29:00', recordCount: 6750, status: 'running' },
  { id: 'COL-004', name: 'Syslog采集', sourceType: 'Other', collectionCycle: '每10分钟', lastCollectTime: '2026-06-03 14:25:00', recordCount: 3200, status: 'stopped' },
];

export function RawAlertCollection() {
  const [tasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'SIEM': return <Database className="w-4 h-4" />;
      case 'Firewall': return <Shield className="w-4 h-4" />;
      case 'IPS': return <Server className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'SIEM': return 'text-blue-400';
      case 'Firewall': return 'text-green-400';
      case 'IPS': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-500/20';
      case 'stopped': return 'text-gray-400 bg-gray-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">原始告警采集</h2>
        <p className="text-sm text-gray-400 mt-1">多源设备告警采集、采集策略配置、状态监控</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索任务名称..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增配置
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">采集周期</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后采集时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">采集记录数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={getSourceColor(task.sourceType)}>{getSourceIcon(task.sourceType)}</span>
                    <span className="text-sm text-gray-300">{task.sourceType}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.collectionCycle}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.lastCollectTime}</td>
                <td className="px-4 py-3 text-sm text-white">{task.recordCount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                    {task.status === 'running' ? '运行中' : task.status === 'stopped' ? '已停止' : '错误'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="编辑">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-green-600/20 hover:bg-green-600/30 rounded text-green-400 transition-colors" title="手动采集">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded text-blue-400 transition-colors" title="查看日志">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
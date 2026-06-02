'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Clock, Calendar, Database, Shield } from 'lucide-react';

interface StrategyItem {
  id: string;
  name: string;
  target: string;
  backupType: string;
  cycle: string;
  retention: string;
  status: 'active' | 'inactive';
}

const mockData: StrategyItem[] = [
  { id: 'STR-001', name: '数据库每日全量备份', target: 'prod-db', backupType: '全量备份', cycle: '每天 02:00', retention: '30天', status: 'active' },
  { id: 'STR-002', name: '日志增量备份', target: 'log-server', backupType: '增量备份', cycle: '每小时', retention: '7天', status: 'active' },
  { id: 'STR-003', name: '配置文件备份', target: 'config-server', backupType: '全量备份', cycle: '每周日 03:00', retention: '90天', status: 'active' },
  { id: 'STR-004', name: '代码仓库备份', target: 'git-server', backupType: '全量备份', cycle: '每天 04:00', retention: '180天', status: 'inactive' },
];

export function BackupStrategyConfig() {
  const [data, setData] = useState<StrategyItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredData = data.filter(item =>
    !searchKeyword || 
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.target.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">停用</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">备份策略配置</h2>
        <p className="text-sm text-gray-400 mt-1">备份策略的新增、修改、删除、查询，策略包括备份对象、备份周期、备份方式、保留周期</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索策略名称或目标..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增策略
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份对象</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份方式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份周期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">保留周期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.target}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.backupType}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.cycle}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.retention}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-2 bg-[#2A354D] hover:bg-[#3A456D] rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-[#2A354D] hover:bg-red-600/50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">新增备份策略</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">策略名称</label>
                <input type="text" className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="输入策略名称" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">备份对象</label>
                <input type="text" className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="输入备份对象" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">备份方式</label>
                <select className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>全量备份</option>
                  <option>增量备份</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">备份周期</label>
                <input type="text" className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="如：每天 02:00" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">保留周期</label>
                <input type="text" className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="如：30天" />
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">取消</button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
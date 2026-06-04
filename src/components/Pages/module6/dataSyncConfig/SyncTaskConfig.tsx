'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, ToggleLeft, ToggleRight, Download, Upload, Filter } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface SyncTask {
  id: string;
  name: string;
  source: string;
  target: string;
  status: 'enabled' | 'disabled';
  syncType: 'full' | 'incremental';
  schedule: string;
  lastSync: string;
  nextSync: string;
  creator: string;
  createTime: string;
}

export function SyncTaskConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SyncTask | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const mockData: SyncTask[] = [
    { id: 'ST-001', name: '用户数据同步', source: 'MySQL主库', target: 'Elasticsearch', status: 'enabled', syncType: 'incremental', schedule: '每5分钟', lastSync: '2026-06-04 10:30:00', nextSync: '2026-06-04 10:35:00', creator: 'admin', createTime: '2026-01-15 09:00:00' },
    { id: 'ST-002', name: '资产数据同步', source: 'CMDB系统', target: 'Redis缓存', status: 'enabled', syncType: 'full', schedule: '每天02:00', lastSync: '2026-06-04 02:00:00', nextSync: '2026-06-05 02:00:00', creator: 'admin', createTime: '2026-02-20 14:30:00' },
    { id: 'ST-003', name: '日志数据同步', source: 'Kafka', target: 'ClickHouse', status: 'disabled', syncType: 'incremental', schedule: '实时', lastSync: '2026-06-03 18:45:00', nextSync: '-', creator: 'user01', createTime: '2026-03-10 10:00:00' },
    { id: 'ST-004', name: '告警数据同步', source: 'Prometheus', target: 'MySQL报表库', status: 'enabled', syncType: 'incremental', schedule: '每10分钟', lastSync: '2026-06-04 10:25:00', nextSync: '2026-06-04 10:35:00', creator: 'admin', createTime: '2026-04-01 08:00:00' },
    { id: 'ST-005', name: '威胁情报同步', source: '外部API', target: '本地数据库', status: 'enabled', syncType: 'incremental', schedule: '每小时', lastSync: '2026-06-04 10:00:00', nextSync: '2026-06-04 11:00:00', creator: 'user02', createTime: '2026-05-15 16:30:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || item.status === filterStatus)
  );

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此同步任务吗？')) {
      console.log('Deleted:', id);
    }
  };

  const handleStatusToggle = (id: string) => {
    console.log('Toggle status:', id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">同步任务配置</h2>
          <p className="text-sm text-gray-400 mt-1">配置同步任务的数据源、目标端及字段映射规则</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            导入配置
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            新增配置
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索任务名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="enabled">已启用</option>
              <option value="disabled">已停用</option>
            </select>
          </div>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-2 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">任务名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">数据源 → 目标</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">同步类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">调度周期</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">上次同步</th>
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
                <td className="px-4 py-3 text-sm text-gray-300">
                  <span className="text-blue-400">{item.source}</span>
                  <span className="mx-2 text-gray-500">→</span>
                  <span className="text-green-400">{item.target}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.syncType === 'full' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.syncType === 'full' ? '全量' : '增量'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.schedule}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.lastSync}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleStatusToggle(item.id)}
                    className="flex items-center gap-1"
                  >
                    {item.status === 'enabled' ? (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-500" />
                    )}
                    <span className={`text-xs ${item.status === 'enabled' ? 'text-green-400' : 'text-gray-500'}`}>
                      {item.status === 'enabled' ? '启用' : '停用'}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-blue-400">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400"
                    >
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? '编辑同步任务' : '新增同步任务'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">任务名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入任务名称" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">数据源</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
                <option>MySQL主库</option>
                <option>CMDB系统</option>
                <option>Kafka</option>
                <option>外部API</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">目标端</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
                <option>Elasticsearch</option>
                <option>Redis缓存</option>
                <option>ClickHouse</option>
                <option>MySQL报表库</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">同步类型</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="syncType" defaultChecked className="text-blue-600" />
                <span className="text-sm text-gray-300">全量同步</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="syncType" className="text-blue-600" />
                <span className="text-sm text-gray-300">增量同步</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">调度周期</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="如：每5分钟、每天02:00、实时" />
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

export default SyncTaskConfig;
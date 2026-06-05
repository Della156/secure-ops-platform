'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock, Calendar, RefreshCw, Zap } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface SyncStrategy {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  scheduleType: 'cron' | 'interval' | 'manual';
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export function SyncStrategySchedule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const mockData: SyncStrategy[] = [
    { id: 'SS-001', name: '用户数据全量同步', type: 'full', scheduleType: 'cron', schedule: '0 2 * * *', lastRun: '2026-06-04 02:00:00', nextRun: '2026-06-05 02:00:00', status: 'active', createTime: '2026-01-15 09:00:00' },
    { id: 'SS-002', name: '资产数据增量同步', type: 'incremental', scheduleType: 'interval', schedule: '每5分钟', lastRun: '2026-06-04 10:30:00', nextRun: '2026-06-04 10:35:00', status: 'active', createTime: '2026-02-20 14:30:00' },
    { id: 'SS-003', name: '日志数据实时同步', type: 'incremental', scheduleType: 'interval', schedule: '实时', lastRun: '2026-06-04 10:35:23', nextRun: '-', status: 'active', createTime: '2026-03-10 10:00:00' },
    { id: 'SS-004', name: '告警数据增量同步', type: 'incremental', scheduleType: 'cron', schedule: '*/10 * * * *', lastRun: '2026-06-04 10:30:00', nextRun: '2026-06-04 10:40:00', status: 'active', createTime: '2026-04-01 08:00:00' },
    { id: 'SS-005', name: '威胁情报每日同步', type: 'full', scheduleType: 'cron', schedule: '0 0 * * *', lastRun: '2026-06-04 00:00:00', nextRun: '2026-06-05 00:00:00', status: 'active', createTime: '2026-05-15 16:30:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type: string) => type === 'full' ? '全量同步' : '增量同步';
  const getTypeColor = (type: string) => type === 'full' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400';

  const getScheduleTypeLabel = (type: string) => {
    switch (type) {
      case 'cron': return 'Cron表达式';
      case 'interval': return '时间间隔';
      case 'manual': return '手动触发';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">全量与增量同步策略及定时调度</h2>
          <p className="text-sm text-gray-400 mt-1">配置同步策略类型和定时调度规则</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增策略
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索策略名称..."
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
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">策略名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">同步类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">调度类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">调度规则</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">上次执行</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">下次执行</th>
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
                <td className="px-4 py-3 text-sm text-gray-300">{getScheduleTypeLabel(item.scheduleType)}</td>
                <td className="px-4 py-3 text-sm text-gray-300 flex items-center gap-2">
                  {item.scheduleType === 'cron' ? <Clock className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                  {item.schedule}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.lastRun}</td>
                <td className="px-4 py-3 text-sm text-blue-400">{item.nextRun}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {item.status === 'active' ? '启用' : '停用'}
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增同步策略">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">策略名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入策略名称" />
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
            <label className="block text-sm text-gray-400 mb-1">调度类型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="cron">Cron表达式</option>
              <option value="interval">时间间隔</option>
              <option value="manual">手动触发</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">调度规则</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="如：0 2 * * * 或 每5分钟" />
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

export default SyncStrategySchedule;
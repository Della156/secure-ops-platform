'use client';

import React, { useState } from 'react';
import { Plus, Play, Pause, RotateCcw, Clock, Calendar, Repeat, History, Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface Strategy {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  schedule: string;
  status: 'active' | 'inactive' | 'running';
  lastRun: string;
  nextRun: string;
  lastDuration: string;
  avgDuration: string;
}

export function SyncStrategySchedule() {
  const [showModal, setShowModal] = useState(false);

  const strategies: Strategy[] = [
    { id: 'SS-001', name: '每日全量同步', type: 'full', schedule: '每天 02:00', status: 'active', lastRun: '2026-06-04 02:00:00', nextRun: '2026-06-05 02:00:00', lastDuration: '15m 32s', avgDuration: '14m 45s' },
    { id: 'SS-002', name: '实时增量同步', type: 'incremental', schedule: '实时', status: 'running', lastRun: '-', nextRun: '-', lastDuration: '-', avgDuration: '0.5s' },
    { id: 'SS-003', name: '每小时增量同步', type: 'incremental', schedule: '每小时', status: 'active', lastRun: '2026-06-04 10:00:00', nextRun: '2026-06-04 11:00:00', lastDuration: '2m 15s', avgDuration: '2m 30s' },
    { id: 'SS-004', name: '每周全量同步', type: 'full', schedule: '每周日 01:00', status: 'active', lastRun: '2026-06-01 01:00:00', nextRun: '2026-06-08 01:00:00', lastDuration: '45m 20s', avgDuration: '42m 15s' },
    { id: 'SS-005', name: '每5分钟增量同步', type: 'incremental', schedule: '每5分钟', status: 'active', lastRun: '2026-06-04 10:30:00', nextRun: '2026-06-04 10:35:00', lastDuration: '12s', avgDuration: '15s' },
    { id: 'SS-006', name: '每月全量同步', type: 'full', schedule: '每月1日 00:00', status: 'inactive', lastRun: '2026-06-01 00:00:00', nextRun: '2026-07-01 00:00:00', lastDuration: '2h 15m', avgDuration: '2h 30m' },
  ];

  const historyRecords = [
    { time: '2026-06-04 10:30:00', strategy: '每5分钟增量同步', status: 'success', duration: '12s', count: 156 },
    { time: '2026-06-04 10:00:00', strategy: '每小时增量同步', status: 'success', duration: '2m 15s', count: 2341 },
    { time: '2026-06-04 02:00:00', strategy: '每日全量同步', status: 'success', duration: '15m 32s', count: 2847 },
    { time: '2026-06-04 01:00:00', strategy: '每小时增量同步', status: 'warning', duration: '5m 45s', count: 1892 },
    { time: '2026-06-03 23:00:00', strategy: '每小时增量同步', status: 'success', duration: '2m 08s', count: 2103 },
  ];

  const getStatusConfig = (status: Strategy['status']) => {
    switch (status) {
      case 'active': return { dot: 'bg-green-500', label: '运行中', button: '暂停', icon: <Pause className="w-3.5 h-3.5" /> };
      case 'running': return { dot: 'bg-blue-500 animate-pulse', label: '执行中', button: '停止', icon: <Pause className="w-3.5 h-3.5" /> };
      case 'inactive': return { dot: 'bg-gray-500', label: '已停用', button: '启用', icon: <Play className="w-3.5 h-3.5" /> };
    }
  };

  const executeHistory = [
    { date: '2026-06-04', fullCount: 2, incCount: 48, success: 49, failed: 1 },
    { date: '2026-06-03', fullCount: 2, incCount: 48, success: 50, failed: 0 },
    { date: '2026-06-02', fullCount: 2, incCount: 48, success: 48, failed: 2 },
    { date: '2026-06-01', fullCount: 3, incCount: 48, success: 51, failed: 0 },
    { date: '2026-05-31', fullCount: 2, incCount: 48, success: 49, failed: 1 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">同步策略与调度</h2>
          <p className="text-sm text-gray-400 mt-1">配置全量/增量同步策略、同步周期及定时调度计划</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增策略
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#111625] flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索策略名称..."
                className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option>全部状态</option>
              <option>运行中</option>
              <option>已停用</option>
            </select>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {strategies.map((strategy) => {
              const config = getStatusConfig(strategy.status);
              return (
                <div key={strategy.id} className="px-4 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{strategy.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          strategy.type === 'full' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {strategy.type === 'full' ? '全量' : '增量'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Repeat className="w-3 h-3" />
                          {strategy.schedule}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">上次执行</div>
                      <div className="text-sm text-gray-300">{strategy.lastRun}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">平均耗时</div>
                      <div className="text-sm text-gray-300">{strategy.avgDuration}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        strategy.status === 'active' || strategy.status === 'running' ? 'text-green-400 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'
                      }`}>
                        {config.label}
                      </span>
                      <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-blue-400">
                        {config.icon}
                      </button>
                      <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              最近执行记录
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {historyRecords.map((record, i) => (
                <div key={i} className="bg-[#111625] rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{record.time}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      record.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {record.status === 'success' ? '成功' : '警告'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">{record.strategy}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 flex justify-between">
                    <span>{record.duration}</span>
                    <span>{record.count} 条数据</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              执行统计（近5天）
            </h3>
            <div className="space-y-2">
              {executeHistory.map((day, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{day.date}</span>
                    <span className="text-gray-300">成功 {day.success} | 失败 {day.failed}</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden flex">
                    <div className="bg-blue-500" style={{ width: `${(day.fullCount / (day.fullCount + day.incCount)) * 100}%` }} />
                    <div className="bg-green-500" style={{ width: `${(day.incCount / (day.fullCount + day.incCount)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-blue-500" />
                全量同步
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-green-500" />
                增量同步
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增同步策略">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">策略名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入策略名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">同步类型</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" defaultChecked className="text-blue-600" />
                <span className="text-sm text-gray-300">全量同步</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" className="text-blue-600" />
                <span className="text-sm text-gray-300">增量同步</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">调度周期</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option>实时</option>
              <option>每5分钟</option>
              <option>每10分钟</option>
              <option>每30分钟</option>
              <option>每小时</option>
              <option>每天 02:00</option>
              <option>每周日 01:00</option>
              <option>每月1日 00:00</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={3} placeholder="请输入策略描述" />
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
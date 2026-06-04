'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock, Calendar, Sun, Moon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface TimePolicy {
  id: string;
  name: string;
  type: 'allow' | 'deny';
  startTime: string;
  endTime: string;
  days: string[];
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export function TimeBasedAccessPolicy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const mockData: TimePolicy[] = [
    { id: 'TP-001', name: '工作时间访问', type: 'allow', startTime: '08:00', endTime: '18:00', days: ['周一', '周二', '周三', '周四', '周五'], description: '工作日工作时间允许访问', status: 'active', createTime: '2026-01-10 09:00:00' },
    { id: 'TP-002', name: '周末禁止访问', type: 'deny', startTime: '00:00', endTime: '24:00', days: ['周六', '周日'], description: '周末禁止所有外部访问', status: 'active', createTime: '2026-01-15 14:30:00' },
    { id: 'TP-003', name: '夜间访问限制', type: 'deny', startTime: '22:00', endTime: '06:00', days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], description: '夜间禁止非紧急访问', status: 'active', createTime: '2026-02-01 10:00:00' },
    { id: 'TP-004', name: '午休时间宽松', type: 'allow', startTime: '12:00', endTime: '13:30', days: ['周一', '周二', '周三', '周四', '周五'], description: '午休时间允许内部访问', status: 'inactive', createTime: '2026-03-10 16:00:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const daysOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">基于时间段的访问策略设置</h2>
          <p className="text-sm text-gray-400 mt-1">配置基于时间的访问控制策略，限制特定时间段的访问</p>
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
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">时间范围</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">适用日期</th>
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
                  <span className={`px-2 py-1 rounded text-xs ${item.type === 'allow' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {item.type === 'allow' ? '允许' : '拒绝'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300 flex items-center gap-2">
                  {item.startTime >= '06:00' && item.startTime < '18:00' ? (
                    <Sun className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-400" />
                  )}
                  {item.startTime} - {item.endTime}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.days.map(day => (
                      <span key={day} className="px-2 py-0.5 bg-[#111625] text-gray-400 text-xs rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                </td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增时间策略">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">策略名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入策略名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">策略类型</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="policyType" defaultChecked className="text-blue-600" />
                <span className="text-sm text-gray-300">允许访问</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="policyType" className="text-blue-600" />
                <span className="text-sm text-gray-300">拒绝访问</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">开始时间</label>
              <input type="time" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">结束时间</label>
              <input type="time" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">适用日期</label>
            <div className="flex flex-wrap gap-2">
              {daysOptions.map(day => (
                <label key={day} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111625] rounded cursor-pointer hover:bg-[#20293F]">
                  <input type="checkbox" className="text-blue-600" defaultChecked={day !== '周六' && day !== '周日'} />
                  <span className="text-sm text-gray-300">{day}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm h-20" placeholder="策略描述" />
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

export default TimeBasedAccessPolicy;
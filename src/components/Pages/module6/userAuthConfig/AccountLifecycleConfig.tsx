'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Lock, Unlock, Clock, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface LifecycleRule {
  id: string;
  name: string;
  type: 'lock' | 'unlock' | 'expire' | 'notify';
  condition: string;
  action: string;
  status: 'enabled' | 'disabled';
  createTime: string;
}

export function AccountLifecycleConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const rules: LifecycleRule[] = [
    { id: 'LR-001', name: '登录失败锁定', type: 'lock', condition: '连续5次登录失败', action: '锁定账户15分钟', status: 'enabled', createTime: '2026-01-01 00:00:00' },
    { id: 'LR-002', name: '密码过期提醒', type: 'notify', condition: '密码到期前7天', action: '发送邮件提醒', status: 'enabled', createTime: '2026-01-01 00:00:00' },
    { id: 'LR-003', name: '账户自动解锁', type: 'unlock', condition: '账户锁定超过15分钟', action: '自动解锁账户', status: 'enabled', createTime: '2026-01-01 00:00:00' },
    { id: 'LR-004', name: '长期未登录禁用', type: 'expire', condition: '连续90天未登录', action: '禁用账户', status: 'disabled', createTime: '2026-02-15 10:00:00' },
    { id: 'LR-005', name: '临时账户到期', type: 'expire', condition: '账户创建超过30天', action: '自动删除账户', status: 'enabled', createTime: '2026-03-01 08:00:00' },
    { id: 'LR-006', name: '权限到期提醒', type: 'notify', condition: '权限到期前30天', action: '发送系统消息', status: 'enabled', createTime: '2026-04-10 14:30:00' },
  ];

  const lockedAccounts = [
    { id: 'U-004', username: 'user03', lockTime: '2026-06-04 09:30:00', reason: '连续5次登录失败', unlockTime: '2026-06-04 09:45:00' },
    { id: 'U-007', username: 'temp01', lockTime: '2026-06-04 10:00:00', reason: '管理员手动锁定', unlockTime: '-' },
  ];

  const getTypeConfig = (type: LifecycleRule['type']) => {
    switch (type) {
      case 'lock': return { icon: <Lock className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/20', label: '锁定' };
      case 'unlock': return { icon: <Unlock className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-500/20', label: '解锁' };
      case 'expire': return { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: '过期' };
      case 'notify': return { icon: <AlertCircle className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/20', label: '通知' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">账户生命周期配置</h2>
          <p className="text-sm text-gray-400 mt-1">实现用户账户状态管理与生命周期控制</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增规则
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索规则名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
                <option>全部类型</option>
                <option>锁定</option>
                <option>解锁</option>
                <option>过期</option>
                <option>通知</option>
              </select>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">规则名称</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">规则类型</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">触发条件</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">执行动作</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => {
                  const typeConfig = getTypeConfig(rule.type);
                  return (
                    <tr key={rule.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{rule.name}</div>
                        <div className="text-xs text-gray-500">{rule.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${typeConfig.bg} ${typeConfig.color} flex items-center gap-1`}>
                          {typeConfig.icon}
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{rule.condition}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{rule.action}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${rule.status === 'enabled' ? 'text-green-400' : 'text-gray-500'}`}>
                          {rule.status === 'enabled' ? '启用' : '停用'}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400" />
              当前锁定账户
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {lockedAccounts.map((account) => (
                <div key={account.id} className="bg-[#111625] rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{account.username}</span>
                    <button className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
                      <Unlock className="w-3 h-3" />
                      立即解锁
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">锁定时间: {account.lockTime}</div>
                  <div className="text-xs text-gray-500">原因: {account.reason}</div>
                  {account.unlockTime !== '-' && (
                    <div className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      自动解锁: {account.unlockTime}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              今日执行统计
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">规则执行次数</span>
                <span className="text-sm text-white">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">账户锁定</span>
                <span className="text-sm text-red-400">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">账户解锁</span>
                <span className="text-sm text-green-400">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">发送通知</span>
                <span className="text-sm text-blue-400">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增生命周期规则">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">规则名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入规则名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">规则类型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="lock">锁定账户</option>
              <option value="unlock">解锁账户</option>
              <option value="expire">账户过期</option>
              <option value="notify">发送通知</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">触发条件</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="如：连续5次登录失败" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">执行动作</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="如：锁定账户15分钟" />
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

export default AccountLifecycleConfig;
'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Play, CheckCircle2, Clock, Settings, X } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const pushConfigs = [
  { id: 'PC-001', name: '安全团队日报推送', target: 'ELINK群组-安全运维组', time: '08:00', template: '标准日报模板', enabled: true },
  { id: 'PC-002', name: '管理层日报摘要', target: '人员-张经理', time: '08:30', template: '精简摘要模板', enabled: true },
  { id: 'PC-003', name: '值班人员通知', target: 'ELINK群组-值班群', time: '09:00', template: '标准日报模板', enabled: false },
];

const pushHistory = [
  { id: 'PH-001', time: '2026-06-03 08:00', target: '安全运维组', content: '告警日报_20260603', status: 'success' },
  { id: 'PH-002', time: '2026-06-03 08:30', target: '张经理', content: '告警日报摘要_20260603', status: 'success' },
  { id: 'PH-003', time: '2026-06-03 09:00', target: '值班群', content: '告警日报_20260603', status: 'failed' },
];

const statusConfig = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <X className="w-3 h-3" /> },
};

export function DailyReportPush() {
  const [activeTab, setActiveTab] = useState('config');
  const [search, setSearch] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newConfig, setNewConfig] = useState({ name: '', target: '', time: '08:00', template: '标准日报模板', enabled: true });

  const filteredConfigs = pushConfigs.filter(c => c.name.includes(search) || c.id.includes(search));

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="告警日报自动推送" description="配置和管理告警日报的自动推送"
        actions={[
          <button key="add" onClick={() => setShowConfigModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新增配置
          </button>,
        ]}
      />

      <div className="flex gap-2">
        <button onClick={() => setActiveTab('config')} className={`px-4 py-2 rounded-lg text-sm transition ${activeTab === 'config' ? 'bg-blue-600 text-white' : 'bg-[#20293F] text-slate-400 hover:bg-[#2A354D]'}`}>
          推送配置
        </button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm transition ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-[#20293F] text-slate-400 hover:bg-[#2A354D]'}`}>
          推送记录
        </button>
      </div>

      {activeTab === 'config' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索配置名称..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">配置ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">配置名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送目标</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">模板</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredConfigs.map(config => (
                  <tr key={config.id} className="hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-sm text-blue-400 font-mono">{config.id}</td>
                    <td className="px-4 py-3 text-sm text-white">{config.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{config.target}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{config.time}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{config.template}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${config.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {config.enabled ? '已启用' : '已禁用'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <Play className="w-3 h-3" />推送
                        </button>
                        <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300">
                          <Edit className="w-3 h-3" />编辑
                        </button>
                        <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300">
                          <Eye className="w-3 h-3" />详情
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">记录ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送目标</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送内容</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {pushHistory.map(record => {
                  const sc = statusConfig[record.status as keyof typeof statusConfig];
                  return (
                    <tr key={record.id} className="hover:bg-[#111625]/50">
                      <td className="px-4 py-3 text-sm text-blue-400 font-mono">{record.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{record.time}</td>
                      <td className="px-4 py-3 text-sm text-white">{record.target}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{record.content}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${sc.bg} ${sc.color}`}>
                          {sc.icon}{sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="flex items-center justify-end text-xs text-blue-400 hover:text-blue-300">
                          <Eye className="w-3 h-3" />查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">新增推送配置</h3>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">配置名称</label>
                <input
                  type="text" value={newConfig.name} onChange={e => setNewConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  placeholder="输入配置名称"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">推送目标</label>
                <select
                  value={newConfig.target} onChange={e => setNewConfig(prev => ({ ...prev, target: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                >
                  <option value="">请选择推送目标</option>
                  <option value="ELINK群组-安全运维组">ELINK群组-安全运维组</option>
                  <option value="ELINK群组-值班群">ELINK群组-值班群</option>
                  <option value="人员-张经理">人员-张经理</option>
                  <option value="人员-李主管">人员-李主管</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">推送时间</label>
                  <input
                    type="time" value={newConfig.time} onChange={e => setNewConfig(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">模板选择</label>
                  <select
                    value={newConfig.template} onChange={e => setNewConfig(prev => ({ ...prev, template: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  >
                    <option value="标准日报模板">标准日报模板</option>
                    <option value="精简摘要模板">精简摘要模板</option>
                    <option value="详细分析模板">详细分析模板</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">启用状态</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={newConfig.enabled} onChange={e => setNewConfig(prev => ({ ...prev, enabled: e.target.checked }))} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[#2A354D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#2A354D]">
              <button onClick={() => setShowConfigModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-md">
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyReportPush;

'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, CheckCircle2, X, Play, Route, Target, User } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const traceTasks = [
  { id: 'TI-001', name: 'APT攻击分析-核心网络', attackTimeline: '2026-06-01 08:00 - 10:00', iocCount: 15, hasAttackerProfile: true, status: 'completed' },
  { id: 'TI-002', name: '勒索病毒分析-办公网络', attackTimeline: '2026-06-02 09:00 - 11:00', iocCount: 8, hasAttackerProfile: false, status: 'running' },
  { id: 'TI-003', name: '数据泄露分析-数据库', attackTimeline: '2026-06-02 14:00 - 16:00', iocCount: 12, hasAttackerProfile: true, status: 'pending' },
  { id: 'TI-004', name: '钓鱼攻击分析-邮件', attackTimeline: '2026-06-01 15:00 - 17:00', iocCount: 6, hasAttackerProfile: false, status: 'completed' },
];

const dataSources = [
  { id: 'DS-001', name: '网络流量日志', selected: true },
  { id: 'DS-002', name: '主机安全日志', selected: true },
  { id: 'DS-003', name: '邮件服务器日志', selected: false },
  { id: 'DS-004', name: '终端检测与响应', selected: true },
  { id: 'DS-005', name: '威胁情报库', selected: true },
];

export function TraceResultIntegration() {
  const [search, setSearch] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSources, setSelectedSources] = useState(dataSources);

  const filteredTasks = traceTasks.filter(task => {
    if (search && !task.name.includes(search) && !task.id.includes(search)) return false;
    return true;
  });

  const toggleSource = (id: string) => {
    setSelectedSources(prev => prev.map(s =>
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="溯源分析结果整合" description="整合多源溯源分析结果"
        actions={[
          <button key="preview" onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Eye className="w-4 h-4" /> 预览整合结果
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 选择整合数据源
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" /> 可整合的溯源分析任务
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索任务..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-full"
              />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-[#111625] rounded-lg hover:bg-[#0F1729] cursor-pointer">
                  <div>
                    <div className="text-sm text-white">{task.name}</div>
                    <div className="text-xs text-slate-400">{task.id}</div>
                  </div>
                  <StatusBadge status={task.status} pulse={task.status === 'running'} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" /> 数据来源
            </div>
            <div className="space-y-2">
              {selectedSources.map(source => (
                <label key={source.id} className="flex items-center gap-2 p-2 hover:bg-[#111625] rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={source.selected}
                    onChange={() => toggleSource(source.id)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm text-white">{source.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Route className="w-4 h-4 text-purple-400" /> 攻击时间线
            </div>
            <div className="space-y-3">
              {[
                { time: '08:00', event: '初始入侵检测', level: '高' },
                { time: '08:15', event: '横向移动检测', level: '中' },
                { time: '08:30', event: '权限提升检测', level: '高' },
                { time: '08:45', event: '数据外泄检测', level: '高' },
                { time: '09:00', event: '影响分析完成', level: '低' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                  <div className="text-xs text-slate-400 w-16">{item.time}</div>
                  <div className="flex-1 text-sm text-white">{item.event}</div>
                  <span className={`text-xs px-2 py-1 rounded ${item.level === '高' ? 'bg-red-500/20 text-red-400' : item.level === '中' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-yellow-400" /> IOC 列表 (15)
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { type: 'IP地址', value: '192.168.1.100', risk: '高' },
                  { type: '域名', value: 'malicious.example.com', risk: '高' },
                  { type: 'MD5', value: 'd41d8cd98f00b204e9800998ecf8427e', risk: '高' },
                  { type: 'URL', value: 'http://evil.com/download', risk: '中' },
                ].map((ioc, idx) => (
                  <div key={idx} className="p-2 bg-[#111625] rounded-lg">
                    <div className="text-xs text-slate-400">{ioc.type}</div>
                    <div className="text-sm text-white font-mono truncate">{ioc.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> 攻击者画像
              </div>
              <div className="space-y-2 text-sm text-white">
                <div className="p-2 bg-[#111625] rounded-lg">
                  <div className="text-xs text-slate-400">攻击类型</div>
                  <div>APT 组织攻击</div>
                </div>
                <div className="p-2 bg-[#111625] rounded-lg">
                  <div className="text-xs text-slate-400">攻击手法</div>
                  <div>钓鱼邮件 + 勒索加密</div>
                </div>
                <div className="p-2 bg-[#111625] rounded-lg">
                  <div className="text-xs text-slate-400">目标行业</div>
                  <div>金融 / 科技</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">整合结果预览</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-[#111625] rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">整合摘要</h4>
                <p className="text-sm text-slate-300">
                  已整合 4 个溯源分析任务，包含 15 个IOC，覆盖攻击时间线、攻击路径和攻击者画像。
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg">
                  取消
                </button>
                <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 确认整合
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TraceResultIntegration;

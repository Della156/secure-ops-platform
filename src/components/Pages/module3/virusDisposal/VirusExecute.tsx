'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, PlayCircle,
  Shield, Lock, CheckCircle2, XCircle, Clock, Server
} from 'lucide-react';

interface ExecuteRecord {
  id: string;
  target: string;
  action: 'kill' | 'isolate' | 'repair';
  actionLabel: string;
  executeTime: string;
  result: 'success' | 'failed' | 'running';
  duration?: string;
  message?: string;
}

const records: ExecuteRecord[] = [
  {
    id: 'VE-20260603001',
    target: '终端-0128',
    action: 'kill',
    actionLabel: '查杀病毒',
    executeTime: '2026-06-03 07:30:15',
    result: 'success',
    duration: '2 分 25 秒',
    message: '成功清除 Kinsing 挖矿木马',
  },
  {
    id: 'VE-20260603002',
    target: '终端-0256',
    action: 'isolate',
    actionLabel: '隔离主机',
    executeTime: '2026-06-03 09:15:30',
    result: 'success',
    duration: '15 秒',
    message: '主机已成功隔离',
  },
  {
    id: 'VE-20260603003',
    target: '服务器-045',
    action: 'kill',
    actionLabel: '查杀病毒',
    executeTime: '2026-06-03 09:30:00',
    result: 'running',
    message: '正在执行查杀...',
  },
  {
    id: 'VE-20260602001',
    target: '终端-0101',
    action: 'kill',
    actionLabel: '查杀病毒',
    executeTime: '2026-06-02 14:20:00',
    result: 'success',
    duration: '1 分 30 秒',
    message: '成功清除 Trojan.Agent',
  },
  {
    id: 'VE-20260601001',
    target: '文件服务器',
    action: 'repair',
    actionLabel: '修复系统',
    executeTime: '2026-06-01 16:00:00',
    result: 'failed',
    duration: '5 分钟',
    message: '修复失败，系统文件损坏',
  },
];

const actionConfig = {
  kill: { label: '查杀', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
  isolate: { label: '隔离', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Lock className="w-3 h-3" /> },
  repair: { label: '修复', color: 'text-green-400', bg: 'bg-green-500/20', icon: <Shield className="w-3 h-3" /> },
};

const resultConfig = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
  running: { label: '执行中', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <PlayCircle className="w-3 h-3" /> },
};

export function VirusExecute() {
  const [search, setSearch] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [showExecuteModal, setShowExecuteModal] = useState(false);

  const filtered = records.filter(r => {
    if (search && !r.target.includes(search)) return false;
    return true;
  });

  const stats = {
    success: records.filter(r => r.result === 'success').length,
    failed: records.filter(r => r.result === 'failed').length,
    running: records.filter(r => r.result === 'running').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="成功" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="执行中" value={stats.running} color="#0066FF" icon={<PlayCircle className="w-4 h-4" />} />
        <StatBox label="成功率" value={`${Math.round(stats.success / records.length * 100)}%`} color="#9333EA" icon={<Shield className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">病毒处置执行</h2>
            <p className="text-xs text-slate-500 mt-1">执行病毒查杀、隔离和修复操作</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowExecuteModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <PlayCircle className="w-3.5 h-3.5" />执行处置
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索目标终端/主机..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <h3 className="text-sm font-semibold text-white">处置执行记录 ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111625]">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">任务ID</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">目标终端/主机</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">处置动作</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">执行时间</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">耗时</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">结果</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">反馈</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => {
                const ac = actionConfig[record.action as keyof typeof actionConfig];
                const rc = resultConfig[record.result as keyof typeof resultConfig];
                return (
                  <tr key={record.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-xs text-blue-400 font-mono">{record.id}</td>
                    <td className="px-4 py-3 text-xs text-white">{record.target}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${ac.bg} ${ac.color}`}>
                        {ac.icon}{ac.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{record.executeTime}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{record.duration || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${rc.bg} ${rc.color}`}>
                        {rc.icon}{rc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{record.message}</td>
                    <td className="px-4 py-3">
                      {record.result === 'failed' && (
                        <button className="text-xs text-blue-400 hover:text-blue-300">重试</button>
                      )}
                      {record.result === 'success' && (
                        <button className="text-xs text-green-400 hover:text-green-300">查看详情</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showExecuteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 w-[400px]">
            <h3 className="text-base font-semibold text-white mb-4">执行病毒处置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">目标终端/主机</label>
                <select value={selectedTarget} onChange={e => setSelectedTarget(e.target.value)} className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5">
                  <option value="">请选择目标</option>
                  <option value="终端-001">终端-001</option>
                  <option value="终端-002">终端-002</option>
                  <option value="服务器-001">服务器-001</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">处置动作</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded-md hover:bg-red-500/30">
                    <XCircle className="w-4 h-4 mx-auto mb-1" />查杀
                  </button>
                  <button className="p-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs rounded-md hover:bg-blue-500/30">
                    <Lock className="w-4 h-4 mx-auto mb-1" />隔离
                  </button>
                  <button className="p-2 bg-green-500/20 border border-green-500/30 text-green-400 text-xs rounded-md hover:bg-green-500/30">
                    <Shield className="w-4 h-4 mx-auto mb-1" />修复
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowExecuteModal(false)} className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">取消</button>
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md">执行</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default VirusExecute;

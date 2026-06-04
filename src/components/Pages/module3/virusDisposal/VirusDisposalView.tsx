'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye,
  Activity, CheckCircle2, XCircle, AlertCircle, Clock,
  Server, Zap, TrendingUp, TrendingDown
} from 'lucide-react';

interface VirusTask {
  id: string;
  name: string;
  type: string;
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startTime: string;
  operator: string;
  affectedAssets: number;
}

const tasks: VirusTask[] = [
  {
    id: 'VT-20260603001',
    name: 'Kinsing 挖矿木马处置',
    type: '挖矿木马',
    target: '终端-0128',
    status: 'completed',
    riskLevel: 'high',
    progress: 100,
    startTime: '2026-06-03 07:30:12',
    operator: '系统自动',
    affectedAssets: 1,
  },
  {
    id: 'VT-20260603002',
    name: 'Emotet 恶意软件清除',
    type: '勒索软件',
    target: '终端-0256',
    status: 'running',
    riskLevel: 'critical',
    progress: 65,
    startTime: '2026-06-03 09:15:00',
    operator: '系统自动',
    affectedAssets: 1,
  },
  {
    id: 'VT-20260603003',
    name: 'CryptoLocker 变种检测',
    type: '勒索软件',
    target: '服务器-045',
    status: 'pending',
    riskLevel: 'critical',
    progress: 0,
    startTime: '2026-06-03 09:30:00',
    operator: '系统自动',
    affectedAssets: 1,
  },
  {
    id: 'VT-20260602001',
    name: 'Trojan.Agent 清理',
    type: '木马',
    target: '终端-0101',
    status: 'completed',
    riskLevel: 'medium',
    progress: 100,
    startTime: '2026-06-02 14:20:00',
    operator: '系统自动',
    affectedAssets: 1,
  },
  {
    id: 'VT-20260601001',
    name: 'WannaCry 变种检测',
    type: '勒索软件',
    target: '文件服务器',
    status: 'failed',
    riskLevel: 'critical',
    progress: 30,
    startTime: '2026-06-01 16:00:00',
    operator: '人工处置',
    affectedAssets: 5,
  },
];

const stats = {
  totalTasks: 156,
  virusEvents: 89,
  disposed: 148,
  pending: 8,
  successRate: 94.9,
};

export function VirusDisposalView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = tasks.filter(t => {
    if (search && !t.name.includes(search) && !t.target.includes(search)) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const getStatusConfig = (status: VirusTask['status']) => {
    const config = {
      pending: { label: '待处置', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
      running: { label: '处置中', color: 'text-green-400', bg: 'bg-green-500/20' },
      completed: { label: '已完成', color: 'text-green-500', bg: 'bg-green-500/20' },
      failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
    };
    return config[status];
  };

  const getRiskColor = (risk: VirusTask['riskLevel']) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      critical: 'bg-red-500/20 text-red-400',
    };
    return colors[risk];
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总处置任务" value={stats.totalTasks} color="#0066FF" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="病毒事件" value={stats.virusEvents} color="#EF4444" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="已处置" value={stats.disposed} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="查杀成功率" value={`${stats.successRate}%`} color="#9333EA" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">病毒处置视图</h2>
            <p className="text-xs text-slate-500 mt-1">监控和管理所有病毒处置任务</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建任务
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索任务名称/目标..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="pending">待处置</option>
            <option value="running">处置中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <h3 className="text-sm font-semibold text-white">处置任务列表 ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111625]">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">任务ID</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">病毒名称</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">类型</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">目标</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">风险等级</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">状态</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">进度</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作人</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">影响资产</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => {
                const sc = getStatusConfig(task.status);
                return (
                  <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-xs text-blue-400 font-mono">{task.id}</td>
                    <td className="px-4 py-3 text-xs text-white font-medium">{task.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{task.type}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{task.target}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRiskColor(task.riskLevel)}`}>
                        {task.riskLevel === 'critical' ? '紧急' : task.riskLevel === 'high' ? '高' : task.riskLevel === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-green-500' : task.status === 'running' ? 'bg-blue-500' : 'bg-slate-500'}`} style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{task.operator}</td>
                    <td className="px-4 py-3 text-xs text-orange-400 font-mono">{task.affectedAssets}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Eye className="w-3 h-3" />查看
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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

export default VirusDisposalView;

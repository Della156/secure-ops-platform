'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Filter, Download, Play, Pause, RotateCcw, Eye,
  CheckCircle2, XCircle, AlertCircle, Clock, Activity, Database,
  Server, Calendar, Zap, ChevronRight, Target, TrendingUp,
  AlertTriangle, FileText, Network, Shield
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';

interface BackupDrill {
  id: string;
  name: string;
  type: '全量恢复' | '增量恢复' | '应急恢复' | '应用切换' | '数据库恢复' | '文件恢复';
  scope: '全机房' | '业务系统' | '数据库' | '应用' | '文件';
  status: 'completed' | 'running' | 'scheduled' | 'failed' | 'paused';
  scheduledAt: string;
  startedAt: string;
  completedAt: string | null;
  duration: string;
  rto: number; // 恢复时间目标（分钟）
  rpo: number; // 恢复点目标（分钟）
  successRate: number; // 实际恢复率
  participants: number;
  knowledgeRefs: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

const drills: BackupDrill[] = [
  { id: 'DR-2026-051', name: '核心交易系统全量恢复演练', type: '应用切换', scope: '业务系统', status: 'completed', scheduledAt: '2026-06-01 02:00', startedAt: '2026-06-01 02:00:00', completedAt: '2026-06-01 03:24:15', duration: '1h24m15s', rto: 90, rpo: 5, successRate: 98, participants: 12, knowledgeRefs: ['KB-DR-001', 'KB-DR-003'], riskLevel: 'critical' },
  { id: 'DR-2026-052', name: '数据库故障切换演练', type: '数据库恢复', scope: '数据库', status: 'completed', scheduledAt: '2026-05-28 02:00', startedAt: '2026-05-28 02:00:00', completedAt: '2026-05-28 02:18:42', duration: '18m42s', rto: 30, rpo: 2, successRate: 100, participants: 8, knowledgeRefs: ['KB-DR-002'], riskLevel: 'high' },
  { id: 'DR-2026-053', name: '主数据中心断电应急恢复', type: '应急恢复', scope: '全机房', status: 'completed', scheduledAt: '2026-05-25 03:00', startedAt: '2026-05-25 03:00:00', completedAt: '2026-05-25 04:45:32', duration: '1h45m32s', rto: 120, rpo: 15, successRate: 92, participants: 18, knowledgeRefs: ['KB-DR-001', 'KB-DR-004'], riskLevel: 'critical' },
  { id: 'DR-2026-054', name: '核心应用增量数据恢复', type: '增量恢复', scope: '业务系统', status: 'running', scheduledAt: '2026-06-03 02:00', startedAt: '2026-06-03 02:00:00', completedAt: null, duration: '进行中 24m', rto: 60, rpo: 5, successRate: 0, participants: 6, knowledgeRefs: ['KB-DR-005'], riskLevel: 'high' },
  { id: 'DR-2026-055', name: '财务系统月度备份验证', type: '文件恢复', scope: '文件', status: 'scheduled', scheduledAt: '2026-06-05 02:00', startedAt: '-', completedAt: null, duration: '未开始', rto: 45, rpo: 10, successRate: 0, participants: 5, knowledgeRefs: ['KB-DR-006'], riskLevel: 'medium' },
  { id: 'DR-2026-056', name: 'OA 系统灾备切换演练', type: '应用切换', scope: '应用', status: 'failed', scheduledAt: '2026-05-22 02:00', startedAt: '2026-05-22 02:00:00', completedAt: '2026-05-22 02:35:18', duration: '35m18s', rto: 30, rpo: 5, successRate: 68, participants: 7, knowledgeRefs: ['KB-DR-007'], riskLevel: 'medium' },
  { id: 'DR-2026-057', name: '异地机房数据复制验证', type: '全量恢复', scope: '全机房', status: 'completed', scheduledAt: '2026-05-20 04:00', startedAt: '2026-05-20 04:00:00', completedAt: '2026-05-20 06:32:18', duration: '2h32m18s', rto: 180, rpo: 30, successRate: 96, participants: 15, knowledgeRefs: ['KB-DR-001'], riskLevel: 'critical' },
  { id: 'DR-2026-058', name: '邮件系统容灾演练', type: '应用切换', scope: '应用', status: 'completed', scheduledAt: '2026-05-18 02:00', startedAt: '2026-05-18 02:00:00', completedAt: '2026-05-18 02:24:15', duration: '24m15s', rto: 30, rpo: 5, successRate: 100, participants: 6, knowledgeRefs: ['KB-DR-008'], riskLevel: 'medium' },
  { id: 'DR-2026-059', name: '网站群数据库恢复演练', type: '数据库恢复', scope: '数据库', status: 'paused', scheduledAt: '2026-06-03 03:00', startedAt: '2026-06-03 03:00:00', completedAt: null, duration: '已暂停 12m', rto: 60, rpo: 5, successRate: 0, participants: 4, knowledgeRefs: ['KB-DR-002'], riskLevel: 'high' },
  { id: 'DR-2026-060', name: '全网配置文件恢复演练', type: '文件恢复', scope: '文件', status: 'scheduled', scheduledAt: '2026-06-10 02:00', startedAt: '-', completedAt: null, duration: '未开始', rto: 45, rpo: 10, successRate: 0, participants: 8, knowledgeRefs: ['KB-DR-009'], riskLevel: 'low' },
];

const statusConfig = {
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/40', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  running: { label: '进行中', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40', icon: <Activity className="w-3.5 h-3.5 animate-pulse" /> },
  scheduled: { label: '计划中', color: 'text-cyan-400', bg: 'bg-cyan-500/20 border-cyan-500/40', icon: <Calendar className="w-3.5 h-3.5" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40', icon: <XCircle className="w-3.5 h-3.5" /> },
  paused: { label: '已暂停', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/40', icon: <Pause className="w-3.5 h-3.5" /> },
};

const riskColor: Record<BackupDrill['riskLevel'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
};

const typeIcon: Record<BackupDrill['type'], React.ReactNode> = {
  '全量恢复': <Database className="w-3.5 h-3.5" />,
  '增量恢复': <Activity className="w-3.5 h-3.5" />,
  '应急恢复': <Zap className="w-3.5 h-3.5" />,
  '应用切换': <Network className="w-3.5 h-3.5" />,
  '数据库恢复': <Server className="w-3.5 h-3.5" />,
  '文件恢复': <FileText className="w-3.5 h-3.5" />,
};

const monthlyStats = [
  { name: '5月', scheduled: 18, completed: 15, failed: 2, avgSuccessRate: 92 },
  { name: '6月', scheduled: 12, completed: 6, failed: 1, avgSuccessRate: 95 },
];

const rtoTrend = [
  { name: '01日', rto: 95, target: 90 },
  { name: '05日', rto: 88, target: 90 },
  { name: '10日', rto: 78, target: 90 },
  { name: '15日', rto: 82, target: 90 },
  { name: '20日', rto: 72, target: 90 },
  { name: '25日', rto: 105, target: 90 },
  { name: '30日', rto: 65, target: 90 },
];

export function ScheduledTaskView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [view, setView] = useState<'list' | 'card'>('list');

  const filtered = useMemo(() => {
    return drills.filter(d => {
      if (search && !d.name.includes(search) && !d.id.includes(search)) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (typeFilter !== 'all' && d.type !== typeFilter) return false;
      return true;
    });
  }, [search, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: drills.length,
    completed: drills.filter(d => d.status === 'completed').length,
    running: drills.filter(d => d.status === 'running').length,
    scheduled: drills.filter(d => d.status === 'scheduled').length,
    failed: drills.filter(d => d.status === 'failed').length,
    avgSuccessRate: (drills.filter(d => d.successRate > 0).reduce((s, d) => s + d.successRate, 0) / drills.filter(d => d.successRate > 0).length).toFixed(1),
  }), []);

  return (
    <div className="p-6 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatBox label="演练总数" value={stats.total} color="#0066FF" icon={<Target className="w-4 h-4" />} />
        <StatBox label="已完成" value={stats.completed} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="进行中" value={stats.running} color="#0066FF" icon={<Activity className="w-4 h-4" />} pulse />
        <StatBox label="计划中" value={stats.scheduled} color="#06B6D4" icon={<Calendar className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="平均成功率" value={`${stats.avgSuccessRate}%`} color="#9333EA" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">备份恢复演练视图</h2>
            <p className="text-xs text-slate-500 mt-1">周期性验证业务系统的灾备恢复能力，RTO/RPO 达标率</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建演练
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Calendar className="w-3.5 h-3.5" />演练计划
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索演练"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="completed">已完成</option>
            <option value="running">进行中</option>
            <option value="scheduled">计划中</option>
            <option value="failed">失败</option>
            <option value="paused">已暂停</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="全量恢复">全量恢复</option>
            <option value="增量恢复">增量恢复</option>
            <option value="应急恢复">应急恢复</option>
            <option value="应用切换">应用切换</option>
            <option value="数据库恢复">数据库恢复</option>
            <option value="文件恢复">文件恢复</option>
          </select>
          <div className="flex bg-[#111625] border border-[#2A354D] rounded-md overflow-hidden">
            <button onClick={() => setView('list')} className={`flex-1 py-1.5 text-xs ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>列表</button>
            <button onClick={() => setView('card')} className={`flex-1 py-1.5 text-xs ${view === 'card' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>卡片</button>
          </div>
        </div>
      </div>

      {/* 趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">RTO 实际 vs 目标趋势（30 天）</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={rtoTrend}>
              <defs>
                <linearGradient id="rtoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="rto" stroke="#0066FF" strokeWidth={2} fill="url(#rtoGrad)" name="实际 RTO (分)" />
              <Line type="monotone" dataKey="target" stroke="#EAB308" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="目标" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">演练完成情况</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Bar dataKey="scheduled" fill="#06B6D4" name="计划" />
              <Bar dataKey="completed" fill="#22C55E" name="完成" />
              <Bar dataKey="failed" fill="#EF4444" name="失败" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 演练列表 */}
      {view === 'list' ? (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">演练列表 ({filtered.length})</h3>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[#111625] text-slate-400">
              <tr>
                <th className="text-left px-3 py-2">编号</th>
                <th className="text-left px-3 py-2">演练名称</th>
                <th className="text-left px-3 py-2">类型</th>
                <th className="text-left px-3 py-2">范围</th>
                <th className="text-left px-3 py-2">状态</th>
                <th className="text-left px-3 py-2">风险</th>
                <th className="text-right px-3 py-2">RTO/RPO</th>
                <th className="text-right px-3 py-2">成功率</th>
                <th className="text-left px-3 py-2">计划时间</th>
                <th className="text-left px-3 py-2">耗时</th>
                <th className="text-right px-3 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const sc = statusConfig[d.status as keyof typeof statusConfig];
                return (
                  <tr key={d.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-3 py-2.5 text-blue-400 font-mono">{d.id}</td>
                    <td className="px-3 py-2.5 text-white font-medium max-w-[200px] truncate">{d.name}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        {typeIcon[d.type]}{d.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{d.scope}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 border rounded text-[10px] ${sc.bg} ${sc.color}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] ${riskColor[d.riskLevel]}`}>
                        {d.riskLevel === 'critical' ? '严重' : d.riskLevel === 'high' ? '高' : d.riskLevel === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-300 font-mono">{d.rto}m / {d.rpo}m</td>
                    <td className="px-3 py-2.5 text-right">
                      {d.successRate > 0 ? (
                        <span className={d.successRate >= 95 ? 'text-green-400 font-mono' : d.successRate >= 80 ? 'text-yellow-400 font-mono' : 'text-red-400 font-mono'}>
                          {d.successRate}%
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 font-mono text-[10px]">{d.scheduledAt}</td>
                    <td className="px-3 py-2.5 text-slate-300 font-mono text-[10px]">{d.duration}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 hover:bg-[#2A354D] rounded" title="查看"><Eye className="w-3.5 h-3.5 text-slate-400" /></button>
                        {d.status === 'scheduled' && <button className="p-1 hover:bg-[#2A354D] rounded" title="开始"><Play className="w-3.5 h-3.5 text-green-400" /></button>}
                        {d.status === 'running' && <button className="p-1 hover:bg-[#2A354D] rounded" title="暂停"><Pause className="w-3.5 h-3.5 text-orange-400" /></button>}
                        {d.status === 'paused' && <button className="p-1 hover:bg-[#2A354D] rounded" title="恢复"><Play className="w-3.5 h-3.5 text-green-400" /></button>}
                        {d.status === 'failed' && <button className="p-1 hover:bg-[#2A354D] rounded" title="重试"><RotateCcw className="w-3.5 h-3.5 text-blue-400" /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(d => {
            const sc = statusConfig[d.status as keyof typeof statusConfig];
            return (
              <div key={d.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-400 font-mono">{d.id}</span>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 border rounded text-[10px] ${sc.bg} ${sc.color}`}>
                    {sc.icon}{sc.label}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">{d.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span className="inline-flex items-center gap-1">{typeIcon[d.type]}{d.type}</span>
                  <span>·</span>
                  <span>{d.scope}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-slate-500">RTO</div>
                    <div className="text-slate-200 font-mono">{d.rto}m</div>
                  </div>
                  <div>
                    <div className="text-slate-500">RPO</div>
                    <div className="text-slate-200 font-mono">{d.rpo}m</div>
                  </div>
                  <div>
                    <div className="text-slate-500">成功率</div>
                    <div className={d.successRate >= 95 ? 'text-green-400 font-mono' : d.successRate >= 80 ? 'text-yellow-400 font-mono' : d.successRate > 0 ? 'text-red-400 font-mono' : 'text-slate-500 font-mono'}>{d.successRate > 0 ? `${d.successRate}%` : '-'}</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-[#2A354D] flex items-center justify-between">
                  <span>{d.scheduledAt}</span>
                  <span>{d.participants} 人</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color, icon, pulse }: { label: string; value: any; color: string; icon: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }} className={pulse ? 'animate-pulse' : ''}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default ScheduledTaskView;

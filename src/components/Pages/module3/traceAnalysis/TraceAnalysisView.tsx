'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Target,
  Activity, Clock, Server, Network, Zap, ChevronRight, AlertTriangle,
  CheckCircle2, XCircle, Shield, Cpu, Globe, Database, FileText,
  TrendingUp, PlayCircle, PauseCircle, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface TraceTask {
  id: string;
  alertId: string;
  attackType: 'APT' | '勒索软件' | '数据泄露' | '横向移动' | '挖矿' | '钓鱼';
  startTime: string;
  duration: string;
  sourceIp: string;
  targetAsset: string;
  hopCount: number;
  status: 'analyzing' | 'completed' | 'paused' | 'failed';
  confidence: number;
  attacker: string;
  iocCount: number;
}

const tasks: TraceTask[] = [
  { id: 'TR-2026060301', alertId: 'AL-99821', attackType: 'APT', startTime: '2026-06-03 09:42', duration: '24m', sourceIp: '203.0.113.45', targetAsset: 'core-db-01', hopCount: 6, status: 'analyzing', confidence: 92, attacker: 'APT-29 (Cozy Bear)', iocCount: 18 },
  { id: 'TR-2026060302', alertId: 'AL-99817', attackType: '勒索软件', startTime: '2026-06-03 09:15', duration: '38m', sourceIp: '198.51.100.23', targetAsset: 'file-srv-01', hopCount: 4, status: 'completed', confidence: 96, attacker: 'LockBit 4.0', iocCount: 12 },
  { id: 'TR-2026060303', alertId: 'AL-99815', attackType: '横向移动', startTime: '2026-06-03 08:50', duration: '52m', sourceIp: '10.10.1.45', targetAsset: 'app-cluster', hopCount: 8, status: 'completed', confidence: 88, attacker: '内部威胁-账号 zhang.wei', iocCount: 24 },
  { id: 'TR-2026060304', alertId: 'AL-99812', attackType: '数据泄露', startTime: '2026-06-03 08:20', duration: '1h12m', sourceIp: '10.10.5.30', targetAsset: 'nas-backup-01', hopCount: 5, status: 'completed', confidence: 78, attacker: '未知', iocCount: 9 },
  { id: 'TR-2026060305', alertId: 'AL-99808', attackType: '挖矿', startTime: '2026-06-03 07:30', duration: '2h15m', sourceIp: '192.0.2.100', targetAsset: 'gpu-srv-01', hopCount: 3, status: 'completed', confidence: 100, attacker: 'Kinsing', iocCount: 6 },
  { id: 'TR-2026060306', alertId: 'AL-99805', attackType: 'APT', startTime: '2026-06-03 06:45', duration: '2h45m', sourceIp: '203.0.113.78', targetAsset: 'ad-controller-01', hopCount: 9, status: 'paused', confidence: 65, attacker: 'APT-31 (Zirconium)', iocCount: 32 },
  { id: 'TR-2026060307', alertId: 'AL-99801', attackType: '钓鱼', startTime: '2026-06-03 06:00', duration: '3h12m', sourceIp: '邮件 (钓鱼邮件)', targetAsset: 'user-workstation', hopCount: 2, status: 'completed', confidence: 95, attacker: 'FIN7', iocCount: 8 },
  { id: 'TR-2026060308', alertId: 'AL-99798', attackType: '横向移动', startTime: '2026-06-03 05:30', duration: '1h30m', sourceIp: '10.10.2.18', targetAsset: 'k8s-master', hopCount: 7, status: 'failed', confidence: 45, attacker: '未知', iocCount: 4 },
];

const statusConfig = {
  analyzing: { label: '分析中', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40', icon: <Activity className="w-3.5 h-3.5 animate-pulse" /> },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/40', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  paused: { label: '已暂停', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/40', icon: <PauseCircle className="w-3.5 h-3.5" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40', icon: <XCircle className="w-3.5 h-3.5" /> },
};

const attackTypeColor: Record<TraceTask['attackType'], string> = {
  'APT': '#9333EA',
  '勒索软件': '#EF4444',
  '数据泄露': '#FF6D00',
  '横向移动': '#0066FF',
  '挖矿': '#EAB308',
  '钓鱼': '#06B6D4',
};

const dailyTrend = [
  { day: '05-28', traces: 8, completed: 7, avgHops: 5.2 },
  { day: '05-29', traces: 12, completed: 10, avgHops: 5.8 },
  { day: '05-30', traces: 6, completed: 5, avgHops: 4.5 },
  { day: '05-31', traces: 15, completed: 13, avgHops: 6.1 },
  { day: '06-01', traces: 18, completed: 16, avgHops: 6.8 },
  { day: '06-02', traces: 22, completed: 19, avgHops: 7.2 },
  { day: '06-03', traces: 14, completed: 6, avgHops: 5.5 },
];

const attackTypeDist = [
  { name: 'APT', value: 28, color: '#9333EA' },
  { name: '勒索软件', value: 18, color: '#EF4444' },
  { name: '横向移动', value: 22, color: '#0066FF' },
  { name: '数据泄露', value: 12, color: '#FF6D00' },
  { name: '钓鱼', value: 14, color: '#06B6D4' },
  { name: '挖矿', value: 6, color: '#EAB308' },
];

const topAttackers = [
  { name: 'APT-29 (Cozy Bear)', incidents: 12, severity: 'critical' },
  { name: 'LockBit 4.0', incidents: 8, severity: 'critical' },
  { name: 'APT-31 (Zirconium)', incidents: 6, severity: 'high' },
  { name: 'Kinsing', incidents: 5, severity: 'medium' },
  { name: 'FIN7', incidents: 4, severity: 'high' },
];

export function TraceAnalysisView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = tasks.filter(t => {
    if (search && !t.id.includes(search) && !t.alertId.includes(search) && !t.targetAsset.includes(search)) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (typeFilter !== 'all' && t.attackType !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    analyzing: tasks.filter(t => t.status === 'analyzing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    totalHops: tasks.reduce((s, t) => s + t.hopCount, 0),
    avgConfidence: Math.round(tasks.filter(t => t.confidence > 0).reduce((s, t) => s + t.confidence, 0) / tasks.filter(t => t.confidence > 0).length),
    totalIOC: tasks.reduce((s, t) => s + t.iocCount, 0),
  };

  return (
    <div className="p-6 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatBox label="溯源任务" value={stats.total} color="#0066FF" icon={<Target className="w-4 h-4" />} />
        <StatBox label="分析中" value={stats.analyzing} color="#00C853" icon={<Activity className="w-4 h-4" />} pulse />
        <StatBox label="已完成" value={stats.completed} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="总跳数" value={stats.totalHops} color="#9333EA" icon={<Network className="w-4 h-4" />} />
        <StatBox label="平均置信度" value={`${stats.avgConfidence}%`} color="#EAB308" icon={<TrendingUp className="w-4 h-4" />} />
        <StatBox label="累计 IOC" value={stats.totalIOC} color="#FF6D00" icon={<Zap className="w-4 h-4" />} />
      </div>

      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">溯源分析视图</h2>
            <p className="text-xs text-slate-500 mt-1">告警事件 → 攻击路径还原 → 攻击者画像</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建溯源
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索任务/告警/目标"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="analyzing">分析中</option>
            <option value="completed">已完成</option>
            <option value="paused">已暂停</option>
            <option value="failed">失败</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="APT">APT</option>
            <option value="勒索软件">勒索软件</option>
            <option value="横向移动">横向移动</option>
            <option value="数据泄露">数据泄露</option>
            <option value="挖矿">挖矿</option>
            <option value="钓鱼">钓鱼</option>
          </select>
        </div>
      </div>

      {/* 趋势图 + 攻击类型分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">溯源任务趋势（7 天）</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyTrend}>
              <defs>
                <linearGradient id="traceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="traces" stroke="#0066FF" strokeWidth={2} fill="url(#traceGrad)" name="溯源任务" />
              <Line type="monotone" dataKey="completed" stroke="#00C853" strokeWidth={1.5} dot={false} name="已完成" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">攻击类型分布</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={attackTypeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                {attackTypeDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {attackTypeDist.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded" style={{ background: d.color }} />{d.name}
                </span>
                <span className="text-slate-200 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP 攻击者 + 任务列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">TOP 攻击者</h3>
          <div className="space-y-2">
            {topAttackers.map((a, i) => (
              <div key={a.name} className="flex items-center gap-2 p-2 bg-[#111625] rounded">
                <div className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-semibold">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200 truncate">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.incidents} 次事件</div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  a.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  a.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {a.severity === 'critical' ? '严重' : a.severity === 'high' ? '高' : '中'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">溯源任务列表</h3>
            <span className="text-xs text-slate-500">共 {filtered.length} 个</span>
          </div>
          <div className="max-h-[440px] overflow-y-auto">
            {filtered.map(t => {
              const sc = statusConfig[t.status as keyof typeof statusConfig];
              return (
                <div key={t.id} className="px-4 py-3 border-b border-[#2A354D] hover:bg-[#111625]/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-400 font-mono">{t.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${attackTypeColor[t.attackType]}20`, color: attackTypeColor[t.attackType] }}>
                        {t.attackType}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 border rounded text-[10px] ${sc.bg} ${sc.color}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>置信度 <span className={`${t.confidence >= 90 ? 'text-green-400' : t.confidence >= 70 ? 'text-yellow-400' : 'text-red-400'} font-mono`}>{t.confidence}%</span></span>
                      <span>·</span>
                      <span className="font-mono">{t.hopCount} 跳</span>
                      <span>·</span>
                      <span className="font-mono">{t.iocCount} IOC</span>
                    </div>
                  </div>
                  <div className="text-sm text-white mb-1">
                    <span className="text-slate-400">告警 </span>
                    <span className="font-mono text-blue-300">{t.alertId}</span>
                    <span className="mx-2 text-slate-600">·</span>
                    <span className="text-slate-400">攻击者 </span>
                    <span className="text-red-300">{t.attacker}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-mono bg-[#111625] px-2 py-0.5 rounded">{t.sourceIp}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-300">→</span>
                    <span className="text-slate-300 font-mono bg-[#111625] px-2 py-0.5 rounded">{t.targetAsset}</span>
                    <div className="flex-1" />
                    <span className="text-slate-500">开始 {t.startTime} · 耗时 {t.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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

export default TraceAnalysisView;

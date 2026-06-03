'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Activity,
  Clock, Network, Server, AlertTriangle, ChevronRight, TrendingUp,
  Crosshair, Shield, ArrowRight, Map, Globe
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface LateralEvent {
  id: string;
  time: string;
  sourceIp: string;
  sourceHost: string;
  targetIp: string;
  targetHost: string;
  technique: 'SMB 登录' | 'WMI 远程' | 'RDP' | 'PsExec' | 'SSH 跳转' | 'Pass-the-Hash' | 'Kerberoasting';
  mitre: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'blocked' | 'detected' | 'allowed' | 'investigating';
  user: string;
  protocol: string;
  bytesIn: number;
  bytesOut: number;
  duration: number;
}

const events: LateralEvent[] = [
  { id: 'LM-99821', time: '09:42:18', sourceIp: '10.10.7.31', sourceHost: 'user-ws-2031', targetIp: '10.10.5.20', targetHost: 'file-srv-01', technique: 'SMB 登录', mitre: 'T1021.002', severity: 'critical', status: 'detected', user: 'zhang.wei', protocol: 'SMB', bytesIn: 45820, bytesOut: 124, duration: 12 },
  { id: 'LM-99820', time: '09:41:32', sourceIp: '10.10.5.20', sourceHost: 'file-srv-01', targetIp: '10.10.2.18', targetHost: 'app-srv-01', technique: 'WMI 远程', mitre: 'T1047', severity: 'high', status: 'detected', user: 'admin', protocol: 'WMI', bytesIn: 1240, bytesOut: 89, duration: 8 },
  { id: 'LM-99819', time: '09:38:45', sourceIp: '10.10.2.18', sourceHost: 'app-srv-01', targetIp: '10.10.3.5', targetHost: 'db-master-01', technique: 'Pass-the-Hash', mitre: 'T1550.003', severity: 'critical', status: 'blocked', user: 'svc-app', protocol: 'MSSQL', bytesIn: 0, bytesOut: 0, duration: 2 },
  { id: 'LM-99818', time: '09:32:18', sourceIp: '10.10.7.45', sourceHost: 'user-ws-2045', targetIp: '10.10.4.10', targetHost: 'ad-controller-01', technique: 'Kerberoasting', mitre: 'T1558.003', severity: 'critical', status: 'investigating', user: 'li.na', protocol: 'Kerberos', bytesIn: 85, bytesOut: 2048, duration: 45 },
  { id: 'LM-99817', time: '09:28:12', sourceIp: '10.10.5.20', sourceHost: 'file-srv-01', targetIp: '10.10.2.20', targetHost: 'app-srv-02', technique: 'PsExec', mitre: 'T1569.002', severity: 'high', status: 'detected', user: 'admin', protocol: 'SMB', bytesIn: 320, bytesOut: 64, duration: 18 },
  { id: 'LM-99816', time: '09:24:48', sourceIp: '10.10.7.32', sourceHost: 'user-ws-2032', targetIp: '10.10.5.30', targetHost: 'backup-srv-01', technique: 'RDP', mitre: 'T1021.001', severity: 'high', status: 'allowed', user: 'wang.lei', protocol: 'RDP', bytesIn: 12800, bytesOut: 240, duration: 240 },
  { id: 'LM-99815', time: '09:18:32', sourceIp: '10.10.2.18', sourceHost: 'app-srv-01', targetIp: '10.10.5.20', targetHost: 'file-srv-01', technique: 'SSH 跳转', mitre: 'T1021.004', severity: 'medium', status: 'allowed', user: 'deployer', protocol: 'SSH', bytesIn: 2048, bytesOut: 1024, duration: 35 },
  { id: 'LM-99814', time: '09:12:15', sourceIp: '10.10.7.31', sourceHost: 'user-ws-2031', targetIp: '10.10.7.45', targetHost: 'user-ws-2045', technique: 'SMB 登录', mitre: 'T1021.002', severity: 'medium', status: 'allowed', user: 'zhang.wei', protocol: 'SMB', bytesIn: 458, bytesOut: 12, duration: 4 },
];

const hourlyTrend = [
  { hour: '00:00', events: 4, critical: 0 },
  { hour: '02:00', events: 6, critical: 1 },
  { hour: '04:00', events: 3, critical: 0 },
  { hour: '06:00', events: 8, critical: 2 },
  { hour: '08:00', events: 22, critical: 4 },
  { hour: '10:00', events: 18, critical: 3 },
  { hour: '12:00', events: 12, critical: 1 },
  { hour: '14:00', events: 15, critical: 2 },
];

const techniqueDist = [
  { name: 'SMB 登录', value: 32, color: '#0066FF' },
  { name: 'WMI 远程', value: 18, color: '#9333EA' },
  { name: 'RDP', value: 14, color: '#FF6D00' },
  { name: 'Pass-the-Hash', value: 8, color: '#EF4444' },
  { name: 'PsExec', value: 12, color: '#EAB308' },
  { name: 'Kerberoasting', value: 4, color: '#06B6D4' },
  { name: '其他', value: 12, color: '#94A3B8' },
];

const severityColor: Record<LateralEvent['severity'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
};

const statusConfig = {
  blocked: { label: '已拦截', color: 'text-green-400', bg: 'bg-green-500/20' },
  detected: { label: '已检测', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  allowed: { label: '已放行', color: 'text-slate-400', bg: 'bg-slate-500/20' },
  investigating: { label: '调查中', color: 'text-purple-400', bg: 'bg-purple-500/20' },
};

export function LateralMovementView() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = events.filter(e => {
    if (search && !e.id.includes(search) && !e.sourceIp.includes(search) && !e.targetIp.includes(search) && !e.user.includes(search)) return false;
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: events.length,
    critical: events.filter(e => e.severity === 'critical').length,
    blocked: events.filter(e => e.status === 'blocked').length,
    investigating: events.filter(e => e.status === 'investigating').length,
    uniqueAttackers: new Set(events.map(e => e.sourceIp)).size,
    uniqueTargets: new Set(events.map(e => e.targetIp)).size,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatBox label="横向事件" value={stats.total} color="#0066FF" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="严重事件" value={stats.critical} color="#EF4444" icon={<AlertTriangle className="w-4 h-4" />} />
        <StatBox label="已拦截" value={stats.blocked} color="#22C55E" icon={<Shield className="w-4 h-4" />} />
        <StatBox label="调查中" value={stats.investigating} color="#9333EA" icon={<Eye className="w-4 h-4" />} />
        <StatBox label="攻击源" value={stats.uniqueAttackers} color="#FF6D00" icon={<Crosshair className="w-4 h-4" />} />
        <StatBox label="受影响目标" value={stats.uniqueTargets} color="#EAB308" icon={<Server className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">横向渗透监测视图</h2>
            <p className="text-xs text-slate-500 mt-1">内网横向移动行为实时检测，含 SMB / WMI / RDP / PsExec / Kerberos 等 7 种技术</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建规则
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
              type="text" placeholder="搜索事件/IP/用户"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部严重度</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="blocked">已拦截</option>
            <option value="detected">已检测</option>
            <option value="allowed">已放行</option>
            <option value="investigating">调查中</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">横向事件 24 小时趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyTrend}>
              <defs>
                <linearGradient id="lmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="events" stroke="#0066FF" strokeWidth={2} fill="url(#lmGrad)" name="事件数" />
              <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={1.5} dot={false} name="严重事件" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">攻击技术分布</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={techniqueDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={32}>
                {techniqueDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-0.5 mt-1">
            {techniqueDist.slice(0, 5).map(d => (
              <div key={d.name} className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded" style={{ background: d.color }} />{d.name}
                </span>
                <span className="text-slate-300 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 事件列表 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">横向渗透事件</h3>
          <span className="text-xs text-slate-500">共 {filtered.length} 条</span>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {filtered.map(e => {
            const sc = statusConfig[e.status];
            return (
              <div key={e.id} className="px-4 py-3 border-b border-[#2A354D] hover:bg-[#111625]/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-blue-400 font-mono">{e.id}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{e.mitre}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 border rounded ${
                    e.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                    e.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                  }`}>
                    {e.severity === 'critical' ? '严重' : e.severity === 'high' ? '高' : '中'}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                  <div className="flex-1" />
                  <span className="text-xs text-slate-500 font-mono">{e.time}</span>
                </div>
                <div className="text-sm text-white font-medium mb-1">{e.technique} <span className="text-slate-500 font-normal">· {e.protocol}</span></div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-300 font-mono bg-[#111625] px-2 py-0.5 rounded">{e.sourceHost}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-slate-300 font-mono bg-[#111625] px-2 py-0.5 rounded">{e.targetHost}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">用户 <span className="text-blue-300 font-mono">{e.user}</span></span>
                  <div className="flex-1" />
                  <span className="text-slate-500 text-[10px]">↑ {(e.bytesIn / 1024).toFixed(1)}KB ↓ {(e.bytesOut / 1024).toFixed(1)}KB · {e.duration}s</span>
                </div>
              </div>
            );
          })}
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

export default LateralMovementView;

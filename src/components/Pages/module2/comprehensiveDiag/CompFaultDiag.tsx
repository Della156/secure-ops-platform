'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, Filter, Eye, Play, Pause, CheckCircle2,
  XCircle, Clock, Server, Database, Network, Shield, Cpu, HardDrive,
  Wifi, Activity, AlertCircle, ChevronRight, Layers, Zap, Terminal,
  ArrowRight, GitBranch, Box, FileText, ListTree, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts';

interface DiagNode {
  id: string;
  name: string;
  type: 'server' | 'database' | 'network' | 'storage' | 'middleware' | 'security';
  health: 'healthy' | 'degraded' | 'down' | 'unknown';
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  errorRate: number;
  connections: number;
  status: 'online' | 'offline' | 'maintenance';
}

const nodes: DiagNode[] = [
  { id: 'N-001', name: 'Web-Prod-01', type: 'server', health: 'healthy', cpu: 35, memory: 62, disk: 48, network: 120, responseTime: 120, errorRate: 0.02, connections: 482, status: 'online' },
  { id: 'N-002', name: 'Web-Prod-02', type: 'server', health: 'healthy', cpu: 42, memory: 68, disk: 48, network: 135, responseTime: 115, errorRate: 0.01, connections: 521, status: 'online' },
  { id: 'N-003', name: 'App-Order-01', type: 'server', health: 'degraded', cpu: 88, memory: 92, disk: 65, network: 245, responseTime: 850, errorRate: 4.5, connections: 285, status: 'online' },
  { id: 'N-004', name: 'App-User-01', type: 'server', health: 'degraded', cpu: 78, memory: 85, disk: 62, network: 198, responseTime: 480, errorRate: 2.1, connections: 320, status: 'online' },
  { id: 'N-005', name: 'DB-Oracle-Prod', type: 'database', health: 'degraded', cpu: 72, memory: 88, disk: 78, network: 380, responseTime: 250, errorRate: 0.8, connections: 156, status: 'online' },
  { id: 'N-006', name: 'DB-MySQL-Prod', type: 'database', health: 'healthy', cpu: 45, memory: 68, disk: 55, network: 220, responseTime: 35, errorRate: 0.01, connections: 285, status: 'online' },
  { id: 'N-007', name: 'SW-Core-01', type: 'network', health: 'healthy', cpu: 12, memory: 25, disk: 8, network: 1250, responseTime: 2, errorRate: 0, connections: 1842, status: 'online' },
  { id: 'N-008', name: 'SW-Core-02', type: 'network', health: 'healthy', cpu: 15, memory: 28, disk: 8, network: 1180, responseTime: 2, errorRate: 0, connections: 1756, status: 'online' },
  { id: 'N-009', name: 'Storage-LUN-12', type: 'storage', health: 'degraded', cpu: 65, memory: 75, disk: 92, network: 480, responseTime: 180, errorRate: 0.5, connections: 28, status: 'online' },
  { id: 'N-010', name: 'MQ-ActiveMQ-Prod', type: 'middleware', health: 'degraded', cpu: 78, memory: 82, disk: 45, network: 320, responseTime: 320, errorRate: 1.2, connections: 85, status: 'online' },
  { id: 'N-011', name: 'FW-Edge-01', type: 'security', health: 'healthy', cpu: 22, memory: 45, disk: 28, network: 850, responseTime: 1, errorRate: 0, connections: 4521, status: 'online' },
  { id: 'N-012', name: 'K8s-Master-01', type: 'server', health: 'healthy', cpu: 35, memory: 58, disk: 35, network: 145, responseTime: 8, errorRate: 0, connections: 168, status: 'online' },
];

const healthConfig = {
  healthy: { label: '健康', color: 'text-green-400', bg: 'bg-green-500/20', dot: 'bg-green-500' },
  degraded: { label: '降级', color: 'text-yellow-400', bg: 'bg-yellow-500/20', dot: 'bg-yellow-500' },
  down: { label: '宕机', color: 'text-red-400', bg: 'bg-red-500/20', dot: 'bg-red-500' },
  unknown: { label: '未知', color: 'text-slate-400', bg: 'bg-slate-500/20', dot: 'bg-slate-500' },
};

const typeIcon: Record<DiagNode['type'], React.ComponentType<{ className?: string }>> = {
  server: Server,
  database: Database,
  network: Network,
  storage: HardDrive,
  middleware: Box,
  security: Shield,
};

const typeColor: Record<DiagNode['type'], string> = {
  server: '#0066FF',
  database: '#22C55E',
  network: '#06B6D4',
  storage: '#9333EA',
  middleware: '#FF6D00',
  security: '#EF4444',
};

// 资源趋势
const cpuTrend = [
  { time: '09:00', web: 32, app: 45, db: 48 },
  { time: '10:00', web: 38, app: 62, db: 58 },
  { time: '11:00', web: 45, app: 78, db: 65 },
  { time: '12:00', web: 42, app: 88, db: 72 },
  { time: '13:00', web: 48, app: 85, db: 68 },
];

export function CompFaultDiag() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('N-003');

  const filtered = nodes.filter(n => {
    if (search && !n.name.includes(search) && !n.id.includes(search)) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    if (healthFilter !== 'all' && n.health !== healthFilter) return false;
    return true;
  });

  const selected = selectedId ? nodes.find(n => n.id === selectedId) : null;
  const stats = {
    total: nodes.length,
    healthy: nodes.filter(n => n.health === 'healthy').length,
    degraded: nodes.filter(n => n.health === 'degraded').length,
    down: nodes.filter(n => n.health === 'down').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="节点总数" value={stats.total} color="#0066FF" icon={<Server className="w-4 h-4" />} />
        <StatBox label="健康" value={stats.healthy} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="降级" value={stats.degraded} color="#FF6D00" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="宕机" value={stats.down} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      {/* 趋势 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400" />核心节点 CPU 趋势（5 小时）</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={cpuTrend}>
            <defs>
              <linearGradient id="webGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6D00" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF6D00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Area type="monotone" dataKey="web" stroke="#0066FF" fill="url(#webGrad)" name="Web 层" />
            <Area type="monotone" dataKey="app" stroke="#FF6D00" fill="url(#appGrad)" name="应用层" />
            <Area type="monotone" dataKey="db" stroke="#22C55E" fill="url(#dbGrad)" name="数据库" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">综合故障诊断</h2>
            <p className="text-xs text-slate-500 mt-1">全栈节点健康检查 / 资源监控 / 实时告警 / 自动诊断</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Play className="w-3.5 h-3.5" />开始诊断
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索节点/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="server">服务器</option>
            <option value="database">数据库</option>
            <option value="network">网络</option>
            <option value="storage">存储</option>
            <option value="middleware">中间件</option>
            <option value="security">安全</option>
          </select>
          <select value={healthFilter} onChange={e => setHealthFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="healthy">健康</option>
            <option value="degraded">降级</option>
            <option value="down">宕机</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 节点列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">节点列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(n => {
              const hc = healthConfig[n.health];
              const Icon = typeIcon[n.type];
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === n.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{n.id}</span>
                    <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${typeColor[n.type]}20`, color: typeColor[n.type] }}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${typeColor[n.type]}20`, color: typeColor[n.type] }}>
                      {n.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${hc.bg} ${hc.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${hc.dot}`} />
                      {hc.label}
                    </span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">RT {n.responseTime}ms</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1.5">{n.name}</div>
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div>
                      <div className="text-slate-500">CPU</div>
                      <div className={`font-mono ${n.cpu > 80 ? 'text-red-400' : n.cpu > 60 ? 'text-yellow-400' : 'text-green-400'}`}>{n.cpu}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500">内存</div>
                      <div className={`font-mono ${n.memory > 80 ? 'text-red-400' : n.memory > 60 ? 'text-yellow-400' : 'text-green-400'}`}>{n.memory}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500">磁盘</div>
                      <div className={`font-mono ${n.disk > 80 ? 'text-red-400' : 'text-slate-300'}`}>{n.disk}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500">错误率</div>
                      <div className={`font-mono ${n.errorRate > 1 ? 'text-red-400' : 'text-green-400'}`}>{n.errorRate}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 详情 */}
        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${typeColor[selected.type]}20`, color: typeColor[selected.type] }}>
                  {selected.type}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${healthConfig[selected.health].bg} ${healthConfig[selected.health].color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${healthConfig[selected.health].dot}`} />
                  {healthConfig[selected.health].label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2">资源使用</div>
              <div className="space-y-2">
                <ResourceBar label="CPU" value={selected.cpu} max={100} color="#0066FF" />
                <ResourceBar label="内存" value={selected.memory} max={100} color="#9333EA" />
                <ResourceBar label="磁盘" value={selected.disk} max={100} color="#FF6D00" />
                <ResourceBar label="网络" value={Math.min(selected.network / 15, 100)} max={100} color="#22C55E" unit="Mbps" raw={`${selected.network}`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">响应时间</div>
                <div className={`font-mono ${selected.responseTime > 500 ? 'text-red-400' : selected.responseTime > 200 ? 'text-yellow-400' : 'text-green-400'}`}>{selected.responseTime}ms</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">错误率</div>
                <div className={`font-mono ${selected.errorRate > 1 ? 'text-red-400' : 'text-green-400'}`}>{selected.errorRate}%</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">连接数</div>
                <div className="text-blue-300 font-mono">{selected.connections}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">状态</div>
                <div className="text-green-400">{selected.status === 'online' ? '在线' : selected.status === 'offline' ? '离线' : '维护'}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                <Zap className="w-3 h-3" />立即诊断
              </button>
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Terminal className="w-3 h-3" />SSH
              </button>
            </div>
          </div>
        ) : null}
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

function ResourceBar({ label, value, max, color, unit = '%', raw }: { label: string; value: number; max: number; color: string; unit?: string; raw?: string }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono" style={{ color }}>{raw || `${value.toFixed(0)}${unit}`}</span>
      </div>
      <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default CompFaultDiag;

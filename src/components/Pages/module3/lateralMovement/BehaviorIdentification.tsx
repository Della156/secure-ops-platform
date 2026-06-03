'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, RefreshCw, Activity, Server, Network,
  Shield, AlertCircle, CheckCircle2, Clock, ChevronRight, XCircle,
  Crosshair, Eye, Target, Zap, Database, Key, Cpu, Wifi, ArrowRight,
  TrendingUp, FileText, GitBranch, Layers, User
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

interface Behavior {
  id: string;
  name: string;
  category: '凭据滥用' | '远程执行' | '服务探测' | '数据收集' | '权限提升' | '横向扩散' | '持久化';
  mitre: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  count: number;
  affectedHosts: number;
  firstSeen: string;
  lastSeen: string;
  confidence: number;
  status: 'active' | 'contained' | 'monitored';
  rules: string[];
}

const behaviors: Behavior[] = [
  { id: 'BH-001', name: 'Pass-the-Hash 攻击链', category: '凭据滥用', mitre: 'T1550.003', description: '攻击者使用 NTLM Hash 在多台主机间认证，绕过密码', severity: 'critical', count: 23, affectedHosts: 8, firstSeen: '2026-06-01 03:24', lastSeen: '2026-06-03 09:42', confidence: 95, status: 'active', rules: ['NTLM 不一致', '横向 4624 异常'] },
  { id: 'BH-002', name: 'PsExec 远程执行', category: '远程执行', mitre: 'T1569.002', description: '通过 SMB 在远程主机执行命令，常见于横向扩散', severity: 'high', count: 42, affectedHosts: 12, firstSeen: '2026-06-01 03:18', lastSeen: '2026-06-03 09:38', confidence: 88, status: 'active', rules: ['PsExec 服务安装', 'Admin$ 共享访问'] },
  { id: 'BH-003', name: 'Kerberoasting 攻击', category: '凭据滥用', mitre: 'T1558.003', description: '请求 SPN 票据后离线爆破，攻击域服务账号', severity: 'critical', count: 8, affectedHosts: 3, firstSeen: '2026-06-02 22:15', lastSeen: '2026-06-03 09:32', confidence: 92, status: 'active', rules: ['RC4 票据请求', 'SPN 扫描'] },
  { id: 'BH-004', name: 'WMI 远程命令执行', category: '远程执行', mitre: 'T1047', description: '通过 WMI 在远程主机执行恶意脚本', severity: 'high', count: 31, affectedHosts: 10, firstSeen: '2026-06-01 04:00', lastSeen: '2026-06-03 09:41', confidence: 85, status: 'active', rules: ['WMI 进程创建', '远程脚本执行'] },
  { id: 'BH-005', name: 'SMB 爆破登录', category: '凭据滥用', mitre: 'T1110.001', description: '针对 SMB 服务的暴力破解登录尝试', severity: 'high', count: 1245, affectedHosts: 24, firstSeen: '2026-05-30 01:00', lastSeen: '2026-06-03 09:18', confidence: 99, status: 'contained', rules: ['4625 暴破检测', '源 IP 信誉'] },
  { id: 'BH-006', name: 'DCOM 横向执行', category: '远程执行', mitre: 'T1021.003', description: '通过 DCOM (MMC20.Application) 远程执行', severity: 'high', count: 18, affectedHosts: 5, firstSeen: '2026-06-02 14:22', lastSeen: '2026-06-03 08:50', confidence: 82, status: 'active', rules: ['DCOM 远程实例化'] },
  { id: 'BH-007', name: 'WinRM 远程管理滥用', category: '远程执行', mitre: 'T1021.006', description: '使用 WinRM 进行远程命令执行', severity: 'medium', count: 56, affectedHosts: 14, firstSeen: '2026-05-30 09:00', lastSeen: '2026-06-03 09:30', confidence: 75, status: 'monitored', rules: ['WinRM 会话异常'] },
  { id: 'BH-008', name: '计划任务持久化', category: '持久化', mitre: 'T1053.005', description: '通过远程计划任务实现持久化', severity: 'high', count: 14, affectedHosts: 6, firstSeen: '2026-06-02 03:12', lastSeen: '2026-06-03 09:15', confidence: 88, status: 'active', rules: ['远程任务创建'] },
  { id: 'BH-009', name: '服务安装横向', category: '横向扩散', mitre: 'T1543.003', description: '通过 SMB 在远程主机创建服务', severity: 'high', count: 9, affectedHosts: 4, firstSeen: '2026-06-02 22:48', lastSeen: '2026-06-03 08:30', confidence: 90, status: 'active', rules: ['远程服务创建'] },
  { id: 'BH-010', name: 'NTLM 中继攻击', category: '凭据滥用', mitre: 'T1557', description: '中间人 NTLM 认证中继', severity: 'critical', count: 3, affectedHosts: 2, firstSeen: '2026-06-03 02:18', lastSeen: '2026-06-03 03:45', confidence: 78, status: 'monitored', rules: ['NTLM 类型 2 异常'] },
];

const categoryColor: Record<Behavior['category'], string> = {
  '凭据滥用': '#EF4444',
  '远程执行': '#FF6D00',
  '服务探测': '#EAB308',
  '数据收集': '#9333EA',
  '权限提升': '#EC4899',
  '横向扩散': '#0066FF',
  '持久化': '#06B6D4',
};

const severityColor: Record<Behavior['severity'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
};

const statusConfig = {
  active: { label: '活跃', color: 'text-red-400', bg: 'bg-red-500/20', icon: <Activity className="w-3 h-3 animate-pulse" /> },
  contained: { label: '已遏制', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  monitored: { label: '监控中', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Eye className="w-3 h-3" /> },
};

// 行为检测能力雷达图
const radarData = [
  { capability: '凭据滥用', value: 92 },
  { capability: '远程执行', value: 88 },
  { capability: '服务探测', value: 75 },
  { capability: '数据收集', value: 80 },
  { capability: '权限提升', value: 70 },
  { capability: '横向扩散', value: 95 },
  { capability: '持久化', value: 85 },
];

export function BehaviorIdentification() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('BH-001');

  const filtered = useMemo(() => behaviors.filter(b => {
    if (search && !b.name.includes(search) && !b.mitre.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && b.severity !== severityFilter) return false;
    return true;
  }), [search, categoryFilter, severityFilter]);

  const selected = selectedId ? behaviors.find(b => b.id === selectedId) : null;
  const stats = {
    total: behaviors.length,
    active: behaviors.filter(b => b.status === 'active').length,
    critical: behaviors.filter(b => b.severity === 'critical').length,
    totalHosts: new Set(behaviors.flatMap(b => Array(b.affectedHosts).fill(0))).size,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="行为模式" value={stats.total} color="#0066FF" icon={<Layers className="w-4 h-4" />} />
        <StatBox label="活跃" value={stats.active} color="#EF4444" icon={<Activity className="w-4 h-4" />} pulse />
        <StatBox label="严重" value={stats.critical} color="#FF6D00" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="受影响主机" value={stats.totalHosts} color="#9333EA" icon={<Server className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">横向渗透行为识别</h2>
            <p className="text-xs text-slate-500 mt-1">基于 MITRE ATT&CK + UEBA 引擎的横向移动行为模式识别</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Activity className="w-3.5 h-3.5" />AI 检测
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
              type="text" placeholder="搜索行为/MITRE ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部分类</option>
            <option value="凭据滥用">凭据滥用</option>
            <option value="远程执行">远程执行</option>
            <option value="服务探测">服务探测</option>
            <option value="横向扩散">横向扩散</option>
            <option value="持久化">持久化</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部严重度</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* 行为列表 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">已识别行为模式 ({filtered.length})</h3>
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {filtered.map(b => {
                const sc = statusConfig[b.status];
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === b.id ? 'bg-[#111625]' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-slate-500 font-mono">{b.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{b.mitre}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${categoryColor[b.category]}20`, color: categoryColor[b.category] }}>
                        {b.category}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 border rounded ${
                        b.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                        b.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                      }`}>
                        {b.severity === 'critical' ? '严重' : b.severity === 'high' ? '高' : '中'}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                        {sc.icon}{sc.label}
                      </span>
                      <div className="flex-1" />
                      <span className="text-[10px] text-slate-500">置信度 <span className="text-blue-400 font-mono">{b.confidence}%</span></span>
                    </div>
                    <div className="text-sm text-white font-medium mb-1">{b.name}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{b.description}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                      <span>事件 <span className="text-red-300 font-mono">{b.count}</span> 次</span>
                      <span>·</span>
                      <span>主机 <span className="text-orange-300 font-mono">{b.affectedHosts}</span> 台</span>
                      <span>·</span>
                      <span>首次 {b.firstSeen}</span>
                      <span>·</span>
                      <span>最近 {b.lastSeen}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* 检测能力雷达 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">检测能力雷达</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2A354D" />
                <PolarAngleAxis dataKey="capability" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
                <Radar name="能力" dataKey="value" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {selected && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500 font-mono">{selected.mitre}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${categoryColor[selected.category]}20`, color: categoryColor[selected.category] }}>
                    {selected.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
                <p className="text-xs text-slate-400">{selected.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">事件次数</div>
                  <div className="text-red-300 font-mono text-lg">{selected.count}</div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">影响主机</div>
                  <div className="text-orange-300 font-mono text-lg">{selected.affectedHosts}</div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">置信度</div>
                  <div className="text-blue-300 font-mono text-lg">{selected.confidence}%</div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">状态</div>
                  <div className={`text-lg ${statusConfig[selected.status].color}`}>{statusConfig[selected.status].label}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">关联检测规则</div>
                <div className="flex flex-wrap gap-1">
                  {selected.rules.map(r => (
                    <span key={r} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded">{r}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Eye className="w-3 h-3" />查看事件
                </button>
                <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Zap className="w-3 h-3" />一键遏制
                </button>
              </div>
            </div>
          )}
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

export default BehaviorIdentification;

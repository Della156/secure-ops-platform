'use client';

import React, { useState, useMemo } from 'react';
import {
  Server, Shield, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2,
  XCircle, Clock, Search, Filter, Download, RefreshCw, Play, Eye,
  ChevronRight, Activity, Database, Cpu, HardDrive, Lock, Network,
  FileText, Settings, TrendingUp, Calendar
} from 'lucide-react';

interface OsHost {
  id: string;
  hostname: string;
  ip: string;
  osType: 'Linux' | 'Windows' | 'AIX' | 'Solaris';
  osVersion: string;
  baseline: string;
  complianceRate: number;
  passCount: number;
  failCount: number;
  warnCount: number;
  totalChecks: number;
  status: 'compliant' | 'partial' | 'non-compliant' | 'unchecked';
  lastCheck: string;
  nextCheck: string;
  criticalFailures: number;
}

const osBaseline: OsHost[] = [
  { id: 'OSB-001', hostname: 'web-prod-01', ip: '10.10.1.21', osType: 'Linux', osVersion: 'CentOS 7.9', baseline: 'CIS CentOS Linux 7 Benchmark v3.0.0', complianceRate: 96, passCount: 237, failCount: 4, warnCount: 6, totalChecks: 247, status: 'compliant', lastCheck: '2026-06-03 06:00', nextCheck: '2026-06-04 06:00', criticalFailures: 0 },
  { id: 'OSB-002', hostname: 'web-prod-02', ip: '10.10.1.22', osType: 'Linux', osVersion: 'CentOS 7.9', baseline: 'CIS CentOS Linux 7 Benchmark v3.0.0', complianceRate: 94, passCount: 232, failCount: 8, warnCount: 7, totalChecks: 247, status: 'compliant', lastCheck: '2026-06-03 06:02', nextCheck: '2026-06-04 06:02', criticalFailures: 0 },
  { id: 'OSB-003', hostname: 'app-server-01', ip: '10.10.2.10', osType: 'Linux', osVersion: 'Ubuntu 22.04 LTS', baseline: 'CIS Ubuntu Linux 22.04 Benchmark v1.0.0', complianceRate: 78, passCount: 198, failCount: 32, warnCount: 24, totalChecks: 254, status: 'partial', lastCheck: '2026-06-03 06:05', nextCheck: '2026-06-04 06:05', criticalFailures: 3 },
  { id: 'OSB-004', hostname: 'app-server-02', ip: '10.10.2.11', osType: 'Linux', osVersion: 'Ubuntu 22.04 LTS', baseline: 'CIS Ubuntu Linux 22.04 Benchmark v1.0.0', complianceRate: 75, passCount: 190, failCount: 38, warnCount: 26, totalChecks: 254, status: 'partial', lastCheck: '2026-06-03 06:08', nextCheck: '2026-06-04 06:08', criticalFailures: 4 },
  { id: 'OSB-005', hostname: 'db-master-01', ip: '10.10.3.5', osType: 'Linux', osVersion: 'RHEL 8.5', baseline: 'CIS Red Hat Enterprise Linux 8 Benchmark v2.0.0', complianceRate: 92, passCount: 245, failCount: 12, warnCount: 9, totalChecks: 266, status: 'compliant', lastCheck: '2026-06-03 06:10', nextCheck: '2026-06-04 06:10', criticalFailures: 0 },
  { id: 'OSB-006', hostname: 'db-slave-01', ip: '10.10.3.6', osType: 'Linux', osVersion: 'RHEL 8.5', baseline: 'CIS Red Hat Enterprise Linux 8 Benchmark v2.0.0', complianceRate: 88, passCount: 234, failCount: 18, warnCount: 14, totalChecks: 266, status: 'partial', lastCheck: '2026-06-03 06:12', nextCheck: '2026-06-04 06:12', criticalFailures: 1 },
  { id: 'OSB-007', hostname: 'win-ad-01', ip: '10.10.4.10', osType: 'Windows', osVersion: 'Windows Server 2019', baseline: 'CIS Microsoft Windows Server 2019 Benchmark v1.3.0', complianceRate: 45, passCount: 168, failCount: 132, warnCount: 73, totalChecks: 373, status: 'non-compliant', lastCheck: '2026-06-03 06:15', nextCheck: '2026-06-04 06:15', criticalFailures: 18 },
  { id: 'OSB-008', hostname: 'win-file-01', ip: '10.10.4.20', osType: 'Windows', osVersion: 'Windows Server 2016', baseline: 'CIS Microsoft Windows Server 2016 Benchmark v1.4.0', complianceRate: 52, passCount: 182, failCount: 108, warnCount: 60, totalChecks: 350, status: 'partial', lastCheck: '2026-06-03 06:18', nextCheck: '2026-06-04 06:18', criticalFailures: 9 },
  { id: 'OSB-009', hostname: 'log-server-01', ip: '10.10.5.30', osType: 'Linux', osVersion: 'Debian 11.6', baseline: 'CIS Debian Linux 11 Benchmark v1.0.0', complianceRate: 98, passCount: 238, failCount: 2, warnCount: 3, totalChecks: 243, status: 'compliant', lastCheck: '2026-06-03 06:20', nextCheck: '2026-06-04 06:20', criticalFailures: 0 },
  { id: 'OSB-010', hostname: 'backup-server', ip: '10.10.5.40', osType: 'AIX', osVersion: 'AIX 7.2', baseline: 'CIS IBM AIX 7.2 Benchmark v1.1.0', complianceRate: 35, passCount: 78, failCount: 102, warnCount: 43, totalChecks: 223, status: 'non-compliant', lastCheck: '2026-06-03 05:30', nextCheck: '2026-06-04 05:30', criticalFailures: 22 },
  { id: 'OSB-011', hostname: 'monitor-server', ip: '10.10.6.10', osType: 'Linux', osVersion: 'Rocky Linux 9.2', baseline: 'CIS Rocky Linux 9 Benchmark v1.0.0', complianceRate: 90, passCount: 222, failCount: 12, warnCount: 13, totalChecks: 247, status: 'compliant', lastCheck: '2026-06-03 06:25', nextCheck: '2026-06-04 06:25', criticalFailures: 0 },
  { id: 'OSB-012', hostname: 'devops-runner-01', ip: '10.10.7.5', osType: 'Linux', osVersion: 'Ubuntu 20.04 LTS', baseline: 'CIS Ubuntu Linux 20.04 Benchmark v2.0.1', complianceRate: 68, passCount: 198, failCount: 56, warnCount: 38, totalChecks: 292, status: 'partial', lastCheck: '2026-06-03 05:00', nextCheck: '2026-06-04 05:00', criticalFailures: 6 },
];

const statusConfig = {
  compliant: { label: '合规', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/40', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  partial: { label: '部分合规', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/40', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  'non-compliant': { label: '不合规', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40', icon: <Shield className="w-3.5 h-3.5" /> },
  unchecked: { label: '未检查', color: 'text-slate-400', bg: 'bg-slate-500/20 border-slate-500/40', icon: <Clock className="w-3.5 h-3.5" /> },
};

const osIcon = (os: string) => {
  if (os === 'Linux') return <Server className="w-4 h-4" />;
  if (os === 'Windows') return <Settings className="w-4 h-4" />;
  if (os === 'AIX' || os === 'Solaris') return <HardDrive className="w-4 h-4" />;
  return <Server className="w-4 h-4" />;
};

const checkCategories = [
  { id: 'account', label: '账户与口令', icon: <Lock className="w-4 h-4" />, count: 45, failed: 18 },
  { id: 'permission', label: '权限与访问', icon: <Shield className="w-4 h-4" />, count: 38, failed: 12 },
  { id: 'service', label: '服务与端口', icon: <Network className="w-4 h-4" />, count: 52, failed: 23 },
  { id: 'log', label: '日志与审计', icon: <FileText className="w-4 h-4" />, count: 28, failed: 9 },
  { id: 'patch', label: '补丁与漏洞', icon: <AlertTriangle className="w-4 h-4" />, count: 35, failed: 14 },
  { id: 'kernel', label: '内核与参数', icon: <Cpu className="w-4 h-4" />, count: 49, failed: 21 },
];

export function OsBaselineView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [osFilter, setOsFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return osBaseline.filter(h => {
      if (search && !h.hostname.toLowerCase().includes(search.toLowerCase()) && !h.ip.includes(search)) return false;
      if (statusFilter !== 'all' && h.status !== statusFilter) return false;
      if (osFilter !== 'all' && h.osType !== osFilter) return false;
      return true;
    });
  }, [search, statusFilter, osFilter]);

  const stats = useMemo(() => ({
    total: osBaseline.length,
    compliant: osBaseline.filter(h => h.status === 'compliant').length,
    partial: osBaseline.filter(h => h.status === 'partial').length,
    nonCompliant: osBaseline.filter(h => h.status === 'non-compliant').length,
    avgRate: (osBaseline.reduce((s, h) => s + h.complianceRate, 0) / osBaseline.length).toFixed(1),
    criticalFailures: osBaseline.reduce((s, h) => s + h.criticalFailures, 0),
  }), []);

  const selected = selectedId ? osBaseline.find(h => h.id === selectedId) : null;

  return (
    <div className="p-6 space-y-4">
      {/* KPI 摘要 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard label="主机总数" value={stats.total} color="#0066FF" icon={<Server className="w-4 h-4" />} />
        <StatCard label="合规主机" value={stats.compliant} color="#22C55E" icon={<ShieldCheck className="w-4 h-4" />} />
        <StatCard label="部分合规" value={stats.partial} color="#EAB308" icon={<ShieldAlert className="w-4 h-4" />} />
        <StatCard label="不合规" value={stats.nonCompliant} color="#EF4444" icon={<Shield className="w-4 h-4" />} />
        <StatCard label="平均合规率" value={`${stats.avgRate}%`} color="#9333EA" icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard label="严重失败项" value={stats.criticalFailures} color="#FF6D00" icon={<AlertTriangle className="w-4 h-4" />} />
      </div>

      {/* 头部操作栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">操作系统基线检查视图</h2>
            <p className="text-xs text-slate-500 mt-1">基于 CIS 标准的全网主机操作系统安全基线合规检查</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Play className="w-3.5 h-3.5" />立即基线检查
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Calendar className="w-3.5 h-3.5" />定时设置
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出报告
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索主机名/IP"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="compliant">合规</option>
            <option value="partial">部分合规</option>
            <option value="non-compliant">不合规</option>
          </select>
          <select value={osFilter} onChange={e => setOsFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部系统</option>
            <option value="Linux">Linux</option>
            <option value="Windows">Windows</option>
            <option value="AIX">AIX</option>
            <option value="Solaris">Solaris</option>
          </select>
          <select className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option>全部基线</option>
            <option>CIS CentOS 7 v3.0.0</option>
            <option>CIS Ubuntu 22.04 v1.0.0</option>
            <option>CIS RHEL 8 v2.0.0</option>
            <option>CIS Windows Server 2019 v1.3.0</option>
            <option>CIS AIX 7.2 v1.1.0</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 主机列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">主机基线状态列表</h3>
            <span className="text-xs text-slate-500">共 {filtered.length} 台主机</span>
          </div>
          <div className="max-h-[640px] overflow-y-auto">
            {filtered.map(h => {
              const sc = statusConfig[h.status];
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedId(h.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer ${selectedId === h.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: sc.color.includes('green') ? '#22C55E' : sc.color.includes('yellow') ? '#EAB308' : '#EF4444' }}>
                        {osIcon(h.osType)}
                      </span>
                      <span className="text-sm text-white font-medium">{h.hostname}</span>
                      <span className="text-xs text-slate-500 font-mono">{h.ip}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs ${sc.bg} ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-2 bg-[#111625] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          h.complianceRate >= 90 ? 'bg-green-500' :
                          h.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${h.complianceRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-300 w-10 text-right font-mono">{h.complianceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{h.osType} · {h.osVersion}</span>
                    <span>检查 {h.lastCheck} · 失败 {h.failCount} / 告警 {h.warnCount} {h.criticalFailures > 0 && <span className="text-red-400">· 严重 {h.criticalFailures}</span>}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：基线检查类别 + 详情 */}
        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">基线检查维度</h3>
            <div className="space-y-2">
              {checkCategories.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 p-2 bg-[#111625] rounded hover:bg-[#111625]/70 cursor-pointer">
                  <span className="text-slate-400">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-200">{cat.label}</span>
                      <span className="text-xs text-slate-500 font-mono">{cat.count} 项</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-[#20293F] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(cat.failed / cat.count) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-red-400 font-mono w-6 text-right">{cat.failed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{selected.hostname} 详情</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <Eye className="w-3 h-3" />查看完整报告
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <Field label="基线" value={selected.baseline} />
                <Field label="系统版本" value={`${selected.osType} ${selected.osVersion}`} />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <MiniStat label="通过" value={selected.passCount} color="text-green-400" />
                  <MiniStat label="失败" value={selected.failCount} color="text-red-400" />
                  <MiniStat label="告警" value={selected.warnCount} color="text-yellow-400" />
                </div>
                <div className="pt-2 border-t border-[#2A354D]">
                  <div className="text-slate-500 mb-1">合规率</div>
                  <div className="text-2xl font-semibold text-white">{selected.complianceRate}%</div>
                </div>
                <div className="pt-2 border-t border-[#2A354D] space-y-1 text-[11px]">
                  <div className="flex justify-between"><span className="text-slate-500">下次检查</span><span className="text-slate-300">{selected.nextCheck}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">严重失败</span><span className="text-red-400 font-mono">{selected.criticalFailures}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-slate-500 mb-0.5">{label}</div>
      <div className="text-slate-200 break-all">{value}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#111625] rounded p-1.5 text-center">
      <div className={`text-base font-semibold ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

export default OsBaselineView;

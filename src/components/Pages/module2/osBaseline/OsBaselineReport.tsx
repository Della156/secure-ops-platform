'use client';

import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Printer, Share2, Filter,
  Shield, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2,
  XCircle, TrendingUp, TrendingDown, Server, Activity,
  BarChart3, PieChart as PieIcon, Eye, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';

const reportMeta = {
  reportId: 'RPT-OS-2026060301',
  title: '操作系统基线检查综合报告',
  reportType: '全网主机基线合规',
  period: '2026-05-26 ~ 2026-06-03',
  generatedAt: '2026-06-03 10:30:00',
  generatedBy: '系统自动生成',
  scope: '12 台主机（8 类操作系统）',
  baseline: 'CIS Benchmark v3.0.0 / 等保 2.0 三级',
  totalChecks: 3036,
  totalHosts: 12,
};

const executiveSummary = {
  totalHosts: 12,
  fullyCompliant: 5,
  partiallyCompliant: 5,
  nonCompliant: 2,
  avgComplianceRate: 76.8,
  previousRate: 68.4,
  trend: 8.4,
  criticalIssues: 65,
  highIssues: 132,
  fixedThisWeek: 187,
  newIssues: 24,
};

const complianceByCategory = [
  { category: '账户与口令', rate: 82, issues: 38, total: 212 },
  { category: '权限与访问', rate: 88, issues: 18, total: 150 },
  { category: '服务与端口', rate: 65, issues: 95, total: 271 },
  { category: '日志与审计', rate: 78, issues: 28, total: 127 },
  { category: '补丁与漏洞', rate: 71, issues: 47, total: 162 },
  { category: '内核与参数', rate: 76, issues: 49, total: 204 },
];

const osDistribution = [
  { name: 'Linux', value: 9, color: '#0066FF' },
  { name: 'Windows', value: 2, color: '#9333EA' },
  { name: 'AIX', value: 1, color: '#FF6D00' },
];

const riskDistribution = [
  { name: '严重', value: 65, color: '#EF4444' },
  { name: '高', value: 132, color: '#FF6D00' },
  { name: '中', value: 218, color: '#EAB308' },
  { name: '低', value: 96, color: '#06B6D4' },
  { name: '通过', value: 2525, color: '#22C55E' },
];

const trend30Days = [
  { day: '05-04', rate: 62 },
  { day: '05-07', rate: 64 },
  { day: '05-10', rate: 65 },
  { day: '05-13', rate: 67 },
  { day: '05-16', rate: 68 },
  { day: '05-19', rate: 70 },
  { day: '05-22', rate: 71 },
  { day: '05-25', rate: 73 },
  { day: '05-28', rate: 75 },
  { day: '05-31', rate: 76 },
  { day: '06-03', rate: 77 },
];

const hostReports = [
  { id: 'OSB-001', hostname: 'web-prod-01', os: 'CentOS 7.9', complianceRate: 96, status: 'compliant', pass: 237, fail: 4, warn: 6, lastCheck: '2026-06-03 06:00', criticalIssues: 0 },
  { id: 'OSB-002', hostname: 'web-prod-02', os: 'CentOS 7.9', complianceRate: 94, status: 'compliant', pass: 232, fail: 8, warn: 7, lastCheck: '2026-06-03 06:02', criticalIssues: 0 },
  { id: 'OSB-003', hostname: 'app-server-01', os: 'Ubuntu 22.04', complianceRate: 78, status: 'partial', pass: 198, fail: 32, warn: 24, lastCheck: '2026-06-03 06:05', criticalIssues: 3 },
  { id: 'OSB-004', hostname: 'app-server-02', os: 'Ubuntu 22.04', complianceRate: 75, status: 'partial', pass: 190, fail: 38, warn: 26, lastCheck: '2026-06-03 06:08', criticalIssues: 4 },
  { id: 'OSB-005', hostname: 'db-master-01', os: 'RHEL 8.5', complianceRate: 92, status: 'compliant', pass: 245, fail: 12, warn: 9, lastCheck: '2026-06-03 06:10', criticalIssues: 0 },
  { id: 'OSB-006', hostname: 'db-slave-01', os: 'RHEL 8.5', complianceRate: 88, status: 'partial', pass: 234, fail: 18, warn: 14, lastCheck: '2026-06-03 06:12', criticalIssues: 1 },
  { id: 'OSB-007', hostname: 'win-ad-01', os: 'Windows Server 2019', complianceRate: 45, status: 'non-compliant', pass: 168, fail: 132, warn: 73, lastCheck: '2026-06-03 06:15', criticalIssues: 18 },
  { id: 'OSB-008', hostname: 'win-file-01', os: 'Windows Server 2016', complianceRate: 52, status: 'partial', pass: 182, fail: 108, warn: 60, lastCheck: '2026-06-03 06:18', criticalIssues: 9 },
  { id: 'OSB-009', hostname: 'log-server-01', os: 'Debian 11.6', complianceRate: 98, status: 'compliant', pass: 238, fail: 2, warn: 3, lastCheck: '2026-06-03 06:20', criticalIssues: 0 },
  { id: 'OSB-010', hostname: 'backup-server', os: 'AIX 7.2', complianceRate: 35, status: 'non-compliant', pass: 78, fail: 102, warn: 43, lastCheck: '2026-06-03 05:30', criticalIssues: 22 },
  { id: 'OSB-011', hostname: 'monitor-server', os: 'Rocky Linux 9.2', complianceRate: 90, status: 'compliant', pass: 222, fail: 12, warn: 13, lastCheck: '2026-06-03 06:25', criticalIssues: 0 },
  { id: 'OSB-012', hostname: 'devops-runner-01', os: 'Ubuntu 20.04', complianceRate: 68, status: 'partial', pass: 198, fail: 56, warn: 38, lastCheck: '2026-06-03 05:00', criticalIssues: 6 },
];

const topIssues = [
  { id: 'TI-1', rule: 'SSH PermitRootLogin 设置为 yes', affected: 8, severity: 'high' },
  { id: 'TI-2', rule: 'Docker API 2375 端口无认证暴露', affected: 4, severity: 'critical' },
  { id: 'TI-3', rule: 'MySQL 监听 0.0.0.0', affected: 4, severity: 'critical' },
  { id: 'TI-4', rule: 'Redis 无密码监听 0.0.0.0', affected: 3, severity: 'critical' },
  { id: 'TI-5', rule: 'Windows Server 2019 账户密码策略不达标', affected: 2, severity: 'high' },
  { id: 'TI-6', rule: 'AIX 7.2 系统版本过旧、补丁缺失', affected: 1, severity: 'critical' },
  { id: 'TI-7', rule: 'SMBv1 协议启用', affected: 4, severity: 'high' },
  { id: 'TI-8', rule: 'NTP 服务未配置认证', affected: 7, severity: 'medium' },
];

const recommendations = [
  { priority: 1, title: '立即修复关键高危项', desc: '关闭所有不必要服务的公网暴露（Docker API 2375、MySQL/Redis 监听 0.0.0.0），预计可修复 65 个严重项', owner: '运维团队', dueDate: '2026-06-10' },
  { priority: 2, title: '加固 SSH 服务配置', desc: '全网禁用 root 远程登录、禁用密码认证、配置 fail2ban 防御暴力破解', owner: '运维团队', dueDate: '2026-06-15' },
  { priority: 3, title: 'Windows 域控账户策略整改', desc: 'win-ad-01 配置复杂度 14 位、失败锁定 5 次/15 分钟、最长使用 90 天', owner: '系统管理员', dueDate: '2026-06-20' },
  { priority: 4, title: 'AIX 7.2 系统升级', desc: 'backup-server 系统版本过旧，建议升级到 AIX 7.3 或迁移到 Linux', owner: '系统管理员', dueDate: '2026-07-15' },
  { priority: 5, title: '建立基线持续监控', desc: '对接配置管理数据库 (CMDB)，将基线合规纳入每日健康巡检', owner: '安全团队', dueDate: '2026-06-30' },
];

export function OsBaselineReport() {
  const [tab, setTab] = useState<'summary' | 'hosts' | 'issues' | 'actions'>('summary');

  return (
    <div className="p-6 space-y-4">
      {/* 报告头部 */}
      <div className="bg-gradient-to-r from-[#1a2540] to-[#20293F] border border-[#2A354D] rounded-lg p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h1 className="text-xl font-semibold text-white">{reportMeta.title}</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
              <Info label="报告编号" value={reportMeta.reportId} />
              <Info label="报告周期" value={reportMeta.period} />
              <Info label="检查范围" value={reportMeta.scope} />
              <Info label="生成时间" value={reportMeta.generatedAt} />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              适用基线：<span className="text-blue-400">{reportMeta.baseline}</span> · 检查项总数 <span className="text-slate-300 font-mono">{reportMeta.totalChecks}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />下载 PDF
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Printer className="w-3.5 h-3.5" />打印
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Share2 className="w-3.5 h-3.5" />分享
            </button>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="border-b border-[#2A354D] flex items-center gap-1">
        {([
          { k: 'summary', l: '执行摘要', icon: <Activity className="w-3.5 h-3.5" /> },
          { k: 'hosts', l: '主机清单', icon: <Server className="w-3.5 h-3.5" /> },
          { k: 'issues', l: 'TOP 问题', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
          { k: 'actions', l: '改进建议', icon: <ChevronRight className="w-3.5 h-3.5" /> },
        ] as const).map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-4 py-2 text-sm flex items-center gap-1.5 border-b-2 -mb-px ${tab === t.k ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            {t.icon}{t.l}
          </button>
        ))}
      </div>

      {tab === 'summary' && (
        <>
          {/* 摘要 KPI */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KPI label="合规主机" value={`${executiveSummary.fullyCompliant}/${executiveSummary.totalHosts}`} sub="合规率 42%" color="#22C55E" icon={<ShieldCheck className="w-4 h-4" />} />
            <KPI label="平均合规率" value={`${executiveSummary.avgComplianceRate}%`} sub={`较上期 +${executiveSummary.trend}%`} color="#0066FF" icon={<TrendingUp className="w-4 h-4" />} trend="up" />
            <KPI label="严重问题" value={executiveSummary.criticalIssues} sub="需立即处理" color="#EF4444" icon={<AlertTriangle className="w-4 h-4" />} />
            <KPI label="高危问题" value={executiveSummary.highIssues} sub="需限期处理" color="#FF6D00" icon={<ShieldAlert className="w-4 h-4" />} />
            <KPI label="本周修复" value={executiveSummary.fixedThisWeek} sub="新增 24 项" color="#9333EA" icon={<CheckCircle2 className="w-4 h-4" />} />
          </div>

          {/* 趋势图 + 风险分布 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">合规率 30 天趋势</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trend30Days}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                  <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[50, 100]} />
                  <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
                  <Area type="monotone" dataKey="rate" stroke="#0066FF" strokeWidth={2} fill="url(#trendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">问题严重度分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                    {riskDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {riskDistribution.map(d => (
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

          {/* 分类合规率 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">各类基线合规率</h3>
            <div className="space-y-3">
              {complianceByCategory.map(c => (
                <div key={c.category}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{c.category}</span>
                    <span className="text-slate-400 font-mono">
                      <span className={c.rate >= 85 ? 'text-green-400' : c.rate >= 70 ? 'text-yellow-400' : 'text-red-400'}>{c.rate}%</span>
                      <span className="ml-2">问题 {c.issues}/{c.total}</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#111625] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.rate >= 85 ? 'bg-green-500' : c.rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${c.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'hosts' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">主机基线合规清单</h3>
            <span className="text-xs text-slate-500">{hostReports.length} 台主机</span>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[#111625] text-slate-400">
              <tr>
                <th className="text-left px-3 py-2">主机</th>
                <th className="text-left px-3 py-2">系统</th>
                <th className="text-left px-3 py-2">合规率</th>
                <th className="text-left px-3 py-2">状态</th>
                <th className="text-left px-3 py-2">通过</th>
                <th className="text-left px-3 py-2">失败</th>
                <th className="text-left px-3 py-2">告警</th>
                <th className="text-left px-3 py-2">严重</th>
                <th className="text-left px-3 py-2">最近检查</th>
              </tr>
            </thead>
            <tbody>
              {hostReports.map(h => (
                <tr key={h.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                  <td className="px-3 py-2.5">
                    <div className="text-white">{h.hostname}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{h.id}</div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300">{h.os}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${h.complianceRate >= 90 ? 'bg-green-500' : h.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${h.complianceRate}%` }}
                        />
                      </div>
                      <span className="text-slate-300 font-mono w-10 text-right">{h.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    {h.status === 'compliant' && <span className="inline-flex items-center gap-1 text-green-400"><ShieldCheck className="w-3.5 h-3.5" />合规</span>}
                    {h.status === 'partial' && <span className="inline-flex items-center gap-1 text-yellow-400"><ShieldAlert className="w-3.5 h-3.5" />部分</span>}
                    {h.status === 'non-compliant' && <span className="inline-flex items-center gap-1 text-red-400"><Shield className="w-3.5 h-3.5" />不合规</span>}
                  </td>
                  <td className="px-3 py-2.5 text-green-400 font-mono">{h.pass}</td>
                  <td className="px-3 py-2.5 text-red-400 font-mono">{h.fail}</td>
                  <td className="px-3 py-2.5 text-yellow-400 font-mono">{h.warn}</td>
                  <td className="px-3 py-2.5">
                    {h.criticalIssues > 0 ? <span className="text-red-400 font-mono font-semibold">{h.criticalIssues}</span> : <span className="text-slate-600">0</span>}
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 font-mono text-[10px]">{h.lastCheck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'issues' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">TOP 8 关键问题</h3>
            <p className="text-xs text-slate-500 mt-0.5">按影响主机数排序</p>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[#111625] text-slate-400">
              <tr>
                <th className="text-left px-3 py-2">#</th>
                <th className="text-left px-3 py-2">问题</th>
                <th className="text-left px-3 py-2">影响主机</th>
                <th className="text-left px-3 py-2">风险等级</th>
                <th className="text-right px-3 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {topIssues.map((t, i) => (
                <tr key={t.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                  <td className="px-3 py-2.5 text-slate-500">{i + 1}</td>
                  <td className="px-3 py-2.5 text-slate-200">{t.rule}</td>
                  <td className="px-3 py-2.5 text-slate-300 font-mono">{t.affected} 台</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] ${
                      t.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      t.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    }`}>
                      {t.severity === 'critical' ? '严重' : t.severity === 'high' ? '高' : '中'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 justify-end">
                      <Eye className="w-3 h-3" />查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'actions' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">改进建议</h3>
          <div className="space-y-3">
            {recommendations.map(r => (
              <div key={r.priority} className="bg-[#111625] border border-[#2A354D] rounded p-3 flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold text-sm">
                  P{r.priority}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white mb-1">{r.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed mb-2">{r.desc}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>负责人：<span className="text-slate-300">{r.owner}</span></span>
                    <span>·</span>
                    <span>截止：<span className="text-orange-400">{r.dueDate}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, sub, color, icon, trend }: { label: string; value: any; sub: string; color: string; icon: React.ReactNode; trend?: 'up' | 'down' }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-2xl font-semibold text-white mb-0.5">{value}</div>
      <div className="text-xs text-slate-500 flex items-center gap-1">
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
        {sub}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-slate-500 mb-0.5">{label}</div>
      <div className="text-slate-200">{value}</div>
    </div>
  );
}

export default OsBaselineReport;

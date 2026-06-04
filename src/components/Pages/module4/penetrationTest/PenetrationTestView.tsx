'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Target, Crosshair, Map, Zap, BarChart3, FileText, Activity, Clock, TrendingUp, Award, Eye, Play, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

type ProjectStatus = 'planning' | 'running' | 'completed' | 'failed' | 'paused';
type AttackPhase = 'recon' | 'weaponization' | 'delivery' | 'exploitation' | 'installation' | 'command' | 'actions';
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

interface PentestProject {
  id: string;
  name: string;
  target: string;
  scope: string;
  status: ProjectStatus;
  startTime: string;
  endTime?: string;
  progress: number;
  phase: AttackPhase;
  severity: SeverityLevel;
  findings: number;
  criticalFindings: number;
  tools: string[];
  tester: string;
}

const PROJECTS: PentestProject[] = [
  { id: 'PT-2026-0001', name: 'Q2 核心域红蓝攻防', target: 'DC-PROD-01/02 / 核心交换机', scope: '内网核心', status: 'running', startTime: '2026-06-01', endTime: '2026-06-15', progress: 65, phase: 'exploitation', severity: 'critical', findings: 18, criticalFindings: 5, tools: ['Cobalt Strike', 'Metasploit', 'Burp Suite', 'Nmap'], tester: '红队-张工' },
  { id: 'PT-2026-0002', name: 'Web 应用渗透', target: 'CRM/OA/ERP 8 套', scope: 'DMZ 区', status: 'running', startTime: '2026-06-04', endTime: '2026-06-10', progress: 78, phase: 'actions', severity: 'high', findings: 12, criticalFindings: 3, tools: ['Burp Suite', 'OWASP ZAP', 'SQLMap'], tester: '红队-王工' },
  { id: 'PT-2026-0003', name: '供应链攻击模拟', target: '第三方软件 12 个', scope: '办公终端', status: 'completed', startTime: '2026-05-25', endTime: '2026-06-02', progress: 100, phase: 'actions', severity: 'high', findings: 8, criticalFindings: 2, tools: ['Cobalt Strike', 'Empire'], tester: '红队-陈工' },
  { id: 'PT-2026-0004', name: '无线网络安全测试', target: 'WiFi 18 个 AP', scope: '办公区', status: 'completed', startTime: '2026-05-20', endTime: '2026-05-28', progress: 100, phase: 'actions', severity: 'medium', findings: 5, criticalFindings: 1, tools: ['Aircrack-ng', 'Kismet', 'Wifite'], tester: '红队-李工' },
  { id: 'PT-2026-0005', name: '社会工程学测试', target: '员工 200 人（钓鱼邮件）', scope: '全员', status: 'failed', startTime: '2026-06-02', endTime: '2026-06-04', progress: 32, phase: 'delivery', severity: 'medium', findings: 0, criticalFindings: 0, tools: ['GoPhish', 'SET'], tester: '红队-赵工' },
];

const PHASE_MAP: Record<AttackPhase, { label: string; color: string }> = {
  recon: { label: '侦查', color: 'bg-blue-500/20 text-blue-400' },
  weaponization: { label: '武器化', color: 'bg-cyan-500/20 text-cyan-400' },
  delivery: { label: '投递', color: 'bg-purple-500/20 text-purple-400' },
  exploitation: { label: '利用', color: 'bg-orange-500/20 text-orange-400' },
  installation: { label: '植入', color: 'bg-yellow-500/20 text-yellow-400' },
  command: { label: '指挥', color: 'bg-red-500/20 text-red-400' },
  actions: { label: '行动', color: 'bg-pink-500/20 text-pink-400' },
};

const SEVERITY_MAP: Record<SeverityLevel, { status: any; text: string }> = {
  low: { status: 'success', text: '低' },
  medium: { status: 'info', text: '中' },
  high: { status: 'warning', text: '高' },
  critical: { status: 'failed', text: '严重' },
};

const STATUS_MAP: Record<ProjectStatus, { status: any; text: string }> = {
  planning: { status: 'pending', text: '规划中' },
  running: { status: 'running', text: '进行中' },
  completed: { status: 'success', text: '已完成' },
  failed: { status: 'failed', text: '失败' },
  paused: { status: 'warning', text: '已暂停' },
};

const COLORS = ['#3B82F6', '#06B6D4', '#A855F7', '#F97316', '#EAB308', '#22C55E', '#EF4444', '#EC4899'];

/**
 * 4-10-1 渗透测试视图（业务深度）
 */
export function PenetrationTestView() {
  const stats = useMemo(() => ({
    total: PROJECTS.length,
    running: PROJECTS.filter((p) => p.status === 'running').length,
    completed: PROJECTS.filter((p) => p.status === 'completed').length,
    criticalFindings: PROJECTS.reduce((s, p) => s + p.criticalFindings, 0),
  }), []);

  // 攻击链 7 阶段
  const killChain = [
    { phase: '侦查', value: 100 },
    { phase: '武器化', value: 95 },
    { phase: '投递', value: 88 },
    { phase: '利用', value: 72 },
    { phase: '植入', value: 65 },
    { phase: '指挥', value: 58 },
    { phase: '行动', value: 45 },
  ];

  // 6 维能力雷达
  const capabilityRadar = [
    { dimension: '侦察能力', score: 92 },
    { dimension: '武器化', score: 88 },
    { dimension: '投递能力', score: 85 },
    { dimension: '漏洞利用', score: 90 },
    { dimension: '权限维持', score: 82 },
    { dimension: '数据外泄', score: 78 },
  ];

  // 月度趋势
  const monthlyTrend = [
    { month: '1月', projects: 4, findings: 28 },
    { month: '2月', projects: 3, findings: 22 },
    { month: '3月', projects: 6, findings: 42 },
    { month: '4月', projects: 5, findings: 35 },
    { month: '5月', projects: 7, findings: 48 },
    { month: '6月', projects: 5, findings: 32 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            渗透测试视图
          </h1>
          <p className="text-slate-400 mt-1 text-sm">攻击链 7 阶段 · 6 维能力 · 5 进行中项目 · 实战化红蓝对抗</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Activity className="w-4 h-4 mr-1" />实时监控</Button>
          <Button variant="primary"><Play className="w-4 h-4 mr-1" />新建项目</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="项目总数" value={stats.total} color="text-blue-400" />
        <KPI label="进行中" value={stats.running} color="text-cyan-400" />
        <KPI label="已完成" value={stats.completed} color="text-green-400" />
        <KPI label="严重漏洞" value={stats.criticalFindings} color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3">6 维渗透能力</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={capabilityRadar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#6B7280', fontSize: 10 }} domain={[0, 100]} />
              <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3">攻击链 Kill Chain 完成度</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={killChain} layout="vertical">
              <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis dataKey="phase" type="category" tick={{ fill: '#6B7280', fontSize: 10 }} width={60} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="完成度" radius={[0, 4, 4, 0]}>
                {killChain.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />月度渗透测试趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="pt-trend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="findings" stroke="#3B82F6" fill="url(#pt-trend)" strokeWidth={2} name="发现数" />
            <Area type="monotone" dataKey="projects" stroke="#EF4444" fill="none" strokeWidth={2} name="项目数" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3">渗透测试项目（{PROJECTS.length}）</h3>
        <div className="space-y-2">
          {PROJECTS.map((p) => {
            const Ph = PHASE_MAP[p.phase];
            return (
              <div key={p.id} className="p-3 rounded-lg border border-[#2A354D] bg-[#111625] hover:border-slate-500/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-slate-500">{p.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${Ph.color}`}>阶段: {Ph.label}</span>
                      <StatusBadge status={STATUS_MAP[p.status].status} />
                      <StatusBadge status={SEVERITY_MAP[p.severity].status} />
                    </div>
                    <p className="text-sm text-slate-100">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">目标: {p.target} · 范围: {p.scope}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-500">工具:</span>
                      {p.tools.slice(0, 4).map((t, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-100">{p.findings}</p>
                    <p className="text-[10px] text-slate-500">发现</p>
                  </div>
                  <div className="text-right w-20">
                    <p className={`text-lg font-bold ${p.criticalFindings > 0 ? 'text-red-400' : 'text-green-400'}`}>{p.criticalFindings}</p>
                    <p className="text-[10px] text-slate-500">严重</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-[#0F1729] rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${p.progress >= 80 ? 'bg-green-500' : p.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: p.progress + '%' }} />
                  </div>
                  <span className="text-xs text-slate-300 w-12 text-right">{p.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number | string; color: string }) {
  return <Card><div className="text-xs text-slate-500 mb-1">{label}</div><div className={`text-2xl font-bold ${color}`}>{value}</div></Card>;
}

export default PenetrationTestView;

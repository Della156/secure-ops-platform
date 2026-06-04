'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, Network, AlertCircle, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell, Pie, PieChart, Legend } from 'recharts';

interface LateralHistory {
  id: string;
  taskName: string;
  detectionType: 'smb' | 'pth' | 'lateral' | 'cred';
  target: string;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  pathsFound: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  hasAttackPath: boolean;
  attackerSrc: string;
}

const HISTORY: LateralHistory[] = [
  { id: 'LMH-20260604001', taskName: '核心网络横向渗透检测', detectionType: 'lateral', target: 'DC01 / DC02 / 核心交换机', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 32, pathsFound: 3, riskLevel: 'high', hasAttackPath: true, attackerSrc: 'HOST-FIN-002' },
  { id: 'LMH-20260604002', taskName: '办公网横向渗透检测', detectionType: 'lateral', target: '办公网段 10.20.0.0/16', status: 'completed', startTime: '2026-06-04 08:00:00', duration: 45, pathsFound: 1, riskLevel: 'medium', hasAttackPath: true, attackerSrc: 'HOST-OFC-088' },
  { id: 'LMH-20260604003', taskName: '数据中心横向检测', detectionType: 'lateral', target: 'DC-PROD-01 / DC-PROD-02', status: 'failed', startTime: '2026-06-04 09:15:00', duration: 28, pathsFound: 0, riskLevel: 'high', hasAttackPath: false, attackerSrc: '-' },
  { id: 'LMH-20260604004', taskName: '分支机构横向检测', detectionType: 'lateral', target: 'BJ / SH / GZ 分支', status: 'completed', startTime: '2026-06-04 07:00:00', duration: 38, pathsFound: 0, riskLevel: 'low', hasAttackPath: false, attackerSrc: '-' },
  { id: 'LMH-20260603005', taskName: 'Pass-the-Hash 检测', detectionType: 'pth', target: '全网域账号', status: 'completed', startTime: '2026-06-03 22:00:00', duration: 18, pathsFound: 2, riskLevel: 'high', hasAttackPath: true, attackerSrc: 'DC01' },
  { id: 'LMH-20260603006', taskName: '凭据滥用检测', detectionType: 'cred', target: '800 个域账号', status: 'completed', startTime: '2026-06-03 20:00:00', duration: 25, pathsFound: 5, riskLevel: 'high', hasAttackPath: true, attackerSrc: 'HOST-DEV-022' },
  { id: 'LMH-20260603007', taskName: 'SMB 异常连接', detectionType: 'smb', target: '生产网段', status: 'rolledback', startTime: '2026-06-03 18:00:00', duration: 15, pathsFound: 1, riskLevel: 'medium', hasAttackPath: true, attackerSrc: 'HOST-APP-005' },
  { id: 'LMH-20260602008', taskName: '周末横向渗透巡检', detectionType: 'lateral', target: '全网', status: 'completed', startTime: '2026-06-02 03:00:00', duration: 120, pathsFound: 0, riskLevel: 'low', hasAttackPath: false, attackerSrc: '-' },
  { id: 'LMH-20260602009', taskName: 'APT 攻击路径复现', detectionType: 'lateral', target: 'FIN 网段', status: 'completed', startTime: '2026-06-02 14:00:00', duration: 60, pathsFound: 7, riskLevel: 'critical', hasAttackPath: true, attackerSrc: 'HOST-FIN-002' },
  { id: 'LMH-20260601010', taskName: 'Kerberoasting 检测', detectionType: 'cred', target: '域服务账号', status: 'completed', startTime: '2026-06-01 22:00:00', duration: 35, pathsFound: 3, riskLevel: 'high', hasAttackPath: true, attackerSrc: 'DC01' },
];

const TREND_DATA = [
  { day: '5/29', tasks: 8, paths: 12, blocked: 5 },
  { day: '5/30', tasks: 10, paths: 18, blocked: 8 },
  { day: '5/31', tasks: 12, paths: 15, blocked: 6 },
  { day: '6/1', tasks: 11, paths: 22, blocked: 10 },
  { day: '6/2', tasks: 14, paths: 28, blocked: 12 },
  { day: '6/3', tasks: 15, paths: 25, blocked: 11 },
  { day: '6/4', tasks: 8, paths: 9, blocked: 4 },
];

const TYPE_LABEL: Record<LateralHistory['detectionType'], { label: string; color: string }> = {
  smb: { label: 'SMB 异常', color: 'bg-blue-500/20 text-blue-400' },
  pth: { label: 'Pass-the-Hash', color: 'bg-orange-500/20 text-orange-400' },
  lateral: { label: '横向渗透', color: 'bg-red-500/20 text-red-400' },
  cred: { label: '凭据滥用', color: 'bg-purple-500/20 text-purple-400' },
};

const STATUS_MAP = {
  completed: { status: 'success', text: '已完成' },
  failed: { status: 'failed', text: '失败' },
  rolledback: { status: 'warning', text: '已回滚' },
};

const RISK_MAP = {
  low: { status: 'success', text: '低' },
  medium: { status: 'info', text: '中' },
  high: { status: 'warning', text: '高' },
  critical: { status: 'failed', text: '严重' },
};

const COLUMNS = [
  { key: 'id', title: 'ID', width: '150px', render: (r: LateralHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'taskName', title: '任务', render: (r: LateralHistory) => <div><p className="text-sm text-slate-100">{r.taskName}</p><p className="text-[10px] text-slate-500">{r.target}</p></div> },
  { key: 'type', title: '类型', width: '110px', render: (r: LateralHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.detectionType].color}`}>{TYPE_LABEL[r.detectionType].label}</span> },
  { key: 'paths', title: '路径', width: '70px', render: (r: LateralHistory) => <span className={`text-xs font-medium ${r.pathsFound > 0 ? 'text-red-400' : 'text-slate-500'}`}>{r.pathsFound}</span> },
  { key: 'risk', title: '风险', width: '70px', render: (r: LateralHistory) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'status', title: '状态', width: '80px', render: (r: LateralHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: LateralHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'attacker', title: '攻击源', width: '130px', render: (r: LateralHistory) => <span className="text-xs text-slate-300 font-mono">{r.attackerSrc}</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: LateralHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-2-7 横向渗透监测 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function LateralMovementHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    paths: HISTORY.reduce((s, h) => s + h.pathsFound, 0),
    critical: HISTORY.filter((h) => h.riskLevel === 'critical' || h.riskLevel === 'high').length,
    avgDuration: Math.round(HISTORY.reduce((s, h) => s + h.duration, 0) / HISTORY.length),
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Network className="w-6 h-6 text-blue-400" />
            横向渗透监测任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史检测任务 · 攻击路径回溯 · 凭据滥用追踪</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史任务" value={stats.total} color="text-blue-400" />
        <KPI label="发现路径" value={stats.paths} color="text-red-400" />
        <KPI label="高危任务" value={stats.critical} color="text-orange-400" />
        <KPI label="平均耗时" value={`${stats.avgDuration}m`} color="text-cyan-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日检测趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="lm-paths" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="paths" stroke="#EF4444" fill="url(#lm-paths)" strokeWidth={2} />
            <Line type="monotone" dataKey="blocked" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<LateralHistory>
        searchPlaceholder="搜索 ID / 任务名 / 目标..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'type', label: '类型', options: [
            { value: 'all', label: '全部' },
            { value: 'lateral', label: '横向渗透' },
            { value: 'smb', label: 'SMB 异常' },
            { value: 'pth', label: 'Pass-the-Hash' },
            { value: 'cred', label: '凭据滥用' },
          ]},
        ]}
        filterValues={{ type: typeFilter }}
        onFilterChange={(_, v) => setTypeFilter(v)}
        data={HISTORY}
        columns={COLUMNS}
        rowKey="id"
        detailWidth="max-w-2xl"
        renderDetail={(r) => (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">{r.id}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
              <StatusBadge status={RISK_MAP[r.riskLevel].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.taskName}</h3>
            <p className="text-xs text-slate-500">目标: {r.target}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="检测类型" value={TYPE_LABEL[r.detectionType].label} />
              <Field label="发现路径" value={`${r.pathsFound} 条`} highlight={r.pathsFound > 0} />
              <Field label="攻击源" value={r.attackerSrc} />
              <Field label="耗时" value={`${r.duration} 分钟`} />
              <Field label="开始时间" value={r.startTime} />
              <Field label="是否发现路径" value={r.hasAttackPath ? '是' : '否'} highlight={r.hasAttackPath} />
            </div>

            {r.hasAttackPath && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />攻击路径已发现
                </p>
                <p className="text-sm text-red-200">检测到 {r.pathsFound} 条潜在横向渗透路径，建议立即处置</p>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number | string; color: string }) {
  return <Card><div className="text-xs text-slate-500 mb-1">{label}</div><div className={`text-2xl font-bold ${color}`}>{value}</div></Card>;
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return <div className={`p-2.5 rounded-lg ${highlight ? 'bg-red-500/10' : 'bg-[#111625]'}`}><p className="text-xs text-slate-500">{label}</p><p className={`text-sm mt-0.5 ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p></div>;
}

export default LateralMovementHistory;

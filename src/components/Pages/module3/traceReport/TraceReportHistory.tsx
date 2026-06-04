'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, AlertCircle, Target, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell } from 'recharts';

interface TraceHistory {
  id: string;
  traceName: string;
  attackType: 'ransom' | 'apt' | 'phishing' | 'webshell' | 'supplychain' | 'mining';
  threatActor: string;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  depth: number;
  hostsInvolved: number;
  confidence: number;
  size: number;
}

const HISTORY: TraceHistory[] = [
  { id: 'TRH-20260604001', traceName: 'LockBit 攻击溯源_20260604', attackType: 'ransom', threatActor: 'LockBit v4', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 50, depth: 7, hostsInvolved: 18, confidence: 96, size: 580 },
  { id: 'TRH-20260604002', traceName: 'APT 横向渗透溯源_20260604', attackType: 'apt', threatActor: 'APT-29', status: 'completed', startTime: '2026-06-04 10:00:00', duration: 45, depth: 6, hostsInvolved: 12, confidence: 94, size: 520 },
  { id: 'TRH-20260603003', traceName: '数据外泄溯源_20260603', attackType: 'apt', threatActor: '未知', status: 'completed', startTime: '2026-06-03 14:00:00', duration: 38, depth: 5, hostsInvolved: 8, confidence: 88, size: 420 },
  { id: 'TRH-20260602004', traceName: '挖矿木马感染溯源_20260602', attackType: 'mining', threatActor: 'XMRig', status: 'completed', startTime: '2026-06-02 18:00:00', duration: 22, depth: 4, hostsInvolved: 6, confidence: 92, size: 280 },
  { id: 'TRH-20260601005', traceName: 'WebShell 入侵溯源_20260601', attackType: 'webshell', threatActor: 'B374k', status: 'failed', startTime: '2026-06-01 14:00:00', duration: 28, depth: 0, hostsInvolved: 0, confidence: 0, size: 0 },
  { id: 'TRH-20260531006', traceName: '钓鱼邮件攻击溯源_20260531', attackType: 'phishing', threatActor: 'UNC2523', status: 'completed', startTime: '2026-05-31 10:00:00', duration: 18, depth: 3, hostsInvolved: 4, confidence: 90, size: 240 },
  { id: 'TRH-20260530007', traceName: '供应链攻击溯源_20260530', attackType: 'supplychain', threatActor: 'APT-29', status: 'completed', startTime: '2026-05-30 16:00:00', duration: 30, depth: 8, hostsInvolved: 25, confidence: 95, size: 620 },
  { id: 'TRH-20260529008', traceName: '勒索事件回溯_20260529', attackType: 'ransom', threatActor: 'LockBit v3', status: 'completed', startTime: '2026-05-29 22:00:00', duration: 25, depth: 5, hostsInvolved: 10, confidence: 93, size: 380 },
  { id: 'TRH-20260528009', traceName: 'APT 后门溯源_20260528', attackType: 'apt', threatActor: 'APT-28', status: 'rolledback', startTime: '2026-05-28 14:00:00', duration: 18, depth: 0, hostsInvolved: 0, confidence: 0, size: 0 },
  { id: 'TRH-20260527010', traceName: 'Cobalt Strike 溯源_20260527', attackType: 'apt', threatActor: 'APT-29', status: 'completed', startTime: '2026-05-27 16:00:00', duration: 35, depth: 6, hostsInvolved: 15, confidence: 94, size: 480 },
];

const TREND_DATA = [
  { day: '5/29', traces: 8, depth: 4.2 },
  { day: '5/30', traces: 10, depth: 5.5 },
  { day: '5/31', traces: 6, depth: 3.8 },
  { day: '6/1', traces: 7, depth: 4.5 },
  { day: '6/2', traces: 9, depth: 5.0 },
  { day: '6/3', traces: 12, depth: 6.2 },
  { day: '6/4', traces: 8, depth: 5.8 },
];

const TYPE_LABEL: Record<TraceHistory['attackType'], { label: string; color: string }> = {
  ransom: { label: '勒索', color: 'bg-red-500/20 text-red-400' },
  apt: { label: 'APT', color: 'bg-orange-500/20 text-orange-400' },
  phishing: { label: '钓鱼', color: 'bg-yellow-500/20 text-yellow-400' },
  webshell: { label: 'WebShell', color: 'bg-purple-500/20 text-purple-400' },
  supplychain: { label: '供应链', color: 'bg-cyan-500/20 text-cyan-400' },
  mining: { label: '挖矿', color: 'bg-blue-500/20 text-blue-400' },
};

const STATUS_MAP = {
  completed: { status: 'success', text: '已完成' },
  failed: { status: 'failed', text: '失败' },
  rolledback: { status: 'warning', text: '已回滚' },
};

const COLUMNS = [
  { key: 'id', title: 'ID', width: '150px', render: (r: TraceHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'traceName', title: '溯源任务', render: (r: TraceHistory) => <div><p className="text-sm text-slate-100">{r.traceName}</p><p className="text-[10px] text-slate-500">攻击者: {r.threatActor}</p></div> },
  { key: 'type', title: '类型', width: '80px', render: (r: TraceHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.attackType].color}`}>{TYPE_LABEL[r.attackType].label}</span> },
  { key: 'depth', title: '深度', width: '70px', render: (r: TraceHistory) => <span className="text-xs text-cyan-400">{r.depth} 层</span> },
  { key: 'hosts', title: '主机', width: '70px', render: (r: TraceHistory) => <span className="text-xs text-slate-300">{r.hostsInvolved}</span> },
  { key: 'confidence', title: '置信度', width: '80px', render: (r: TraceHistory) => <span className={`text-xs font-medium ${r.confidence >= 90 ? 'text-green-400' : r.confidence >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{r.confidence}%</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: TraceHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: TraceHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: TraceHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-16-6 溯源报告 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function TraceReportHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    completed: HISTORY.filter((h) => h.status === 'completed').length,
    failed: HISTORY.filter((h) => h.status === 'failed').length,
    avgConfidence: Math.round(HISTORY.filter((h) => h.confidence > 0).reduce((s, h) => s + h.confidence, 0) / HISTORY.filter((h) => h.confidence > 0).length),
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            溯源报告历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史溯源任务 · 6 类攻击 · 攻击链回溯 · 失败归因</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史溯源" value={stats.total} color="text-blue-400" />
        <KPI label="已完成" value={stats.completed} color="text-green-400" />
        <KPI label="失败" value={stats.failed} color="text-red-400" />
        <KPI label="平均置信度" value={stats.avgConfidence + '%'} color="text-cyan-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日溯源趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="tr-tr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="traces" stroke="#3B82F6" fill="url(#tr-tr)" strokeWidth={2} />
            <Line type="monotone" dataKey="depth" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<TraceHistory>
        searchPlaceholder="搜索 ID / 名称 / 攻击者..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '攻击类型', options: [
          { value: 'all', label: '全部' },
          { value: 'ransom', label: '勒索' },
          { value: 'apt', label: 'APT' },
          { value: 'phishing', label: '钓鱼' },
          { value: 'webshell', label: 'WebShell' },
          { value: 'supplychain', label: '供应链' },
          { value: 'mining', label: '挖矿' },
        ]}]}
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
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.attackType].color}`}>{TYPE_LABEL[r.attackType].label}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.traceName}</h3>
            <p className="text-xs text-slate-500">攻击者: {r.threatActor}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="攻击类型" value={TYPE_LABEL[r.attackType].label} />
              <Field label="攻击者" value={r.threatActor} />
              <Field label="攻击深度" value={r.depth + ' 层'} />
              <Field label="涉及主机" value={r.hostsInvolved + ' 台'} />
              <Field label="置信度" value={r.confidence + '%'} />
              <Field label="生成耗时" value={r.duration + ' 分钟'} />
            </div>

            {r.confidence >= 90 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />高置信度溯源
                </p>
                <p className="text-sm text-red-200">建议立即执行 IOC 阻断 + 横向防护</p>
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

function Field({ label, value }: { label: string; value: string }) {
  return <div className="p-2.5 bg-[#111625] rounded-lg"><p className="text-xs text-slate-500">{label}</p><p className="text-sm text-slate-200 mt-0.5 font-mono">{value}</p></div>;
}

export default TraceReportHistory;

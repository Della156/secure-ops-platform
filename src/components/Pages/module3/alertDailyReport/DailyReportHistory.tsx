'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell } from 'recharts';

interface ReportHistory {
  id: string;
  reportName: string;
  period: string;
  totalAlerts: number;
  critical: number;
  status: 'completed' | 'failed' | 'rolledback';
  generateTime: string;
  duration: number;
  subscribers: number;
  channelMix: string;
  size: number;
}

const HISTORY: ReportHistory[] = [
  { id: 'DRH-20260604001', reportName: '告警日报_20260604', period: '2026-06-04', totalAlerts: 325, critical: 12, status: 'completed', generateTime: '2026-06-04 08:00:00', duration: 32, subscribers: 43, channelMix: '邮件+钉钉', size: 384 },
  { id: 'DRH-20260603001', reportName: '告警日报_20260603', period: '2026-06-03', totalAlerts: 412, critical: 18, status: 'completed', generateTime: '2026-06-03 08:00:00', duration: 18, subscribers: 43, channelMix: '邮件+钉钉', size: 512 },
  { id: 'DRH-20260602001', reportName: '告警日报_20260602', period: '2026-06-02', totalAlerts: 358, critical: 15, status: 'completed', generateTime: '2026-06-02 08:00:00', duration: 22, subscribers: 43, channelMix: '邮件+钉钉', size: 432 },
  { id: 'DRH-20260601001', reportName: '告警日报_20260601', period: '2026-06-01', totalAlerts: 295, critical: 8, status: 'failed', generateTime: '2026-06-01 08:00:00', duration: 28, subscribers: 0, channelMix: '-', size: 0 },
  { id: 'DRH-20260531001', reportName: '告警日报_20260531', period: '2026-05-31', totalAlerts: 286, critical: 10, status: 'completed', generateTime: '2026-05-31 08:00:00', duration: 18, subscribers: 43, channelMix: '邮件+钉钉', size: 380 },
  { id: 'DRH-20260530001', reportName: '告警日报_20260530', period: '2026-05-30', totalAlerts: 318, critical: 14, status: 'completed', generateTime: '2026-05-30 08:00:00', duration: 20, subscribers: 43, channelMix: '邮件+钉钉', size: 410 },
  { id: 'DRH-20260529001', reportName: '告警日报_20260529', period: '2026-05-29', totalAlerts: 302, critical: 11, status: 'completed', generateTime: '2026-05-29 08:00:00', duration: 19, subscribers: 43, channelMix: '邮件+钉钉', size: 395 },
  { id: 'DRH-20260528001', reportName: '告警日报_20260528', period: '2026-05-28', totalAlerts: 278, critical: 9, status: 'completed', generateTime: '2026-05-28 08:00:00', duration: 17, subscribers: 43, channelMix: '邮件+钉钉', size: 370 },
  { id: 'DRH-20260527001', reportName: '告警日报_20260527', period: '2026-05-27', totalAlerts: 331, critical: 13, status: 'completed', generateTime: '2026-05-27 08:00:00', duration: 21, subscribers: 43, channelMix: '邮件+钉钉', size: 425 },
  { id: 'DRH-20260526001', reportName: '告警日报_20260526', period: '2026-05-26', totalAlerts: 312, critical: 12, status: 'rolledback', generateTime: '2026-05-26 08:00:00', duration: 18, subscribers: 0, channelMix: '-', size: 0 },
  { id: 'DRH-20260525001', reportName: '告警日报_20260525', period: '2026-05-25', totalAlerts: 295, critical: 10, status: 'completed', generateTime: '2026-05-25 08:00:00', duration: 18, subscribers: 43, channelMix: '邮件+钉钉', size: 385 },
  { id: 'DRH-20260524001', reportName: '告警日报_20260524', period: '2026-05-24', totalAlerts: 268, critical: 7, status: 'completed', generateTime: '2026-05-24 08:00:00', duration: 16, subscribers: 43, channelMix: '邮件+钉钉', size: 360 },
];

const TREND_DATA = [
  { day: '5/29', alerts: 302, critical: 11 },
  { day: '5/30', alerts: 318, critical: 14 },
  { day: '5/31', alerts: 286, critical: 10 },
  { day: '6/1', alerts: 295, critical: 8 },
  { day: '6/2', alerts: 358, critical: 15 },
  { day: '6/3', alerts: 412, critical: 18 },
  { day: '6/4', alerts: 325, critical: 12 },
];

const STATUS_MAP = {
  completed: { status: 'success', text: '已完成' },
  failed: { status: 'failed', text: '失败' },
  rolledback: { status: 'warning', text: '已回滚' },
};

const COLUMNS = [
  { key: 'id', title: 'ID', width: '150px', render: (r: ReportHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'reportName', title: '报告', render: (r: ReportHistory) => <div><p className="text-sm text-slate-100">{r.reportName}</p><p className="text-[10px] text-slate-500">{r.period}</p></div> },
  { key: 'totalAlerts', title: '告警总数', width: '90px', render: (r: ReportHistory) => <span className="text-xs text-slate-300">{r.totalAlerts}</span> },
  { key: 'critical', title: '严重', width: '70px', render: (r: ReportHistory) => <span className={`text-xs ${r.critical > 10 ? 'text-red-400' : 'text-yellow-400'}`}>{r.critical}</span> },
  { key: 'subscribers', title: '订阅', width: '70px', render: (r: ReportHistory) => <span className="text-xs text-slate-300">{r.subscribers || '-'}</span> },
  { key: 'channelMix', title: '推送渠道', width: '100px', render: (r: ReportHistory) => <span className="text-xs text-cyan-400">{r.channelMix}</span> },
  { key: 'size', title: '大小', width: '80px', render: (r: ReportHistory) => <span className="text-xs text-slate-300">{r.size ? r.size + 'KB' : '-'}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: ReportHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: ReportHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'generateTime', title: '生成时间', width: '150px', render: (r: ReportHistory) => <span className="text-xs text-slate-400 font-mono">{r.generateTime}</span> },
];

/**
 * 3-14-6 告警日报 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function DailyReportHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    completed: HISTORY.filter((h) => h.status === 'completed').length,
    failed: HISTORY.filter((h) => h.status === 'failed').length,
    totalAlerts: HISTORY.reduce((s, h) => s + h.totalAlerts, 0),
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            告警日报历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史告警日报 · 自动生成 · 智能推送 · 失败归因</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史日报" value={stats.total} color="text-blue-400" />
        <KPI label="已生成" value={stats.completed} color="text-green-400" />
        <KPI label="失败" value={stats.failed} color="text-red-400" />
        <KPI label="累计告警" value={stats.totalAlerts} color="text-cyan-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日告警日报趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="dr-alert" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="alerts" stroke="#3B82F6" fill="url(#dr-alert)" strokeWidth={2} />
            <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<ReportHistory>
        searchPlaceholder="搜索 ID / 报告名 / 周期..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'status', label: '状态', options: [
          { value: 'all', label: '全部' },
          { value: 'completed', label: '已完成' },
          { value: 'failed', label: '失败' },
          { value: 'rolledback', label: '已回滚' },
        ]}]}
        filterValues={{ status: statusFilter }}
        onFilterChange={(_, v) => setStatusFilter(v)}
        data={HISTORY}
        columns={COLUMNS}
        rowKey="id"
        detailWidth="max-w-2xl"
        renderDetail={(r) => (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">{r.id}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.reportName}</h3>
            <p className="text-xs text-slate-500">报告周期: {r.period}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="告警总数" value={`${r.totalAlerts} 条`} />
              <Field label="严重告警" value={`${r.critical} 条`} highlight={r.critical > 10} />
              <Field label="订阅人数" value={`${r.subscribers} 人`} />
              <Field label="推送渠道" value={r.channelMix} />
              <Field label="报告大小" value={r.size ? r.size + 'KB' : '-'} />
              <Field label="生成耗时" value={`${r.duration} 分钟`} />
            </div>

            {r.critical > 10 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />严重告警较多
                </p>
                <p className="text-sm text-red-200">建议重点关注事件处置</p>
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
  return <div className={`p-2.5 rounded-lg ${highlight ? 'bg-red-500/10' : 'bg-[#111625]'}`}><p className="text-xs text-slate-500">{label}</p><p className={`text-sm mt-0.5 font-mono ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p></div>;
}

export default DailyReportHistory;

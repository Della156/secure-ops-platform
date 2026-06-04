'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, User, AlertCircle, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell, Pie, PieChart, Legend } from 'recharts';

interface AnomalyHistory {
  id: string;
  taskName: string;
  detectionType: 'login' | 'exfiltration' | 'privilege' | 'workhour' | 'download' | 'geolocation';
  target: string;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  anomaliesFound: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  topUser: string;
}

const HISTORY: AnomalyHistory[] = [
  { id: 'ABH-20260604001', taskName: '财务部用户行为建模', detectionType: 'login', target: '财务部 45 人', status: 'completed', startTime: '2026-06-04 10:00:00', duration: 35, anomaliesFound: 2, riskLevel: 'high', topUser: 'zhang.wei@corp' },
  { id: 'ABH-20260604002', taskName: '全网异常登录检测', detectionType: 'login', target: '全网 800 账号', status: 'completed', startTime: '2026-06-04 08:00:00', duration: 25, anomaliesFound: 5, riskLevel: 'medium', topUser: 'li.feng@corp' },
  { id: 'ABH-20260604003', taskName: '研发部数据外泄检测', detectionType: 'exfiltration', target: '研发部 320 人', status: 'failed', startTime: '2026-06-04 09:00:00', duration: 42, anomaliesFound: 0, riskLevel: 'high', topUser: '-' },
  { id: 'ABH-20260604004', taskName: '工作时间外访问', detectionType: 'workhour', target: '全网 800 人', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 18, anomaliesFound: 8, riskLevel: 'low', topUser: 'wang.fang@corp' },
  { id: 'ABH-20260604005', taskName: '特权账号异常使用', detectionType: 'privilege', target: '28 个特权账号', status: 'completed', startTime: '2026-06-04 11:00:00', duration: 12, anomaliesFound: 1, riskLevel: 'critical', topUser: 'admin.domain@corp' },
  { id: 'ABH-20260603006', taskName: '批量文件删除告警', detectionType: 'download', target: '文件服务器', status: 'completed', startTime: '2026-06-03 22:00:00', duration: 8, anomaliesFound: 1, riskLevel: 'high', topUser: 'chen.qiang@corp' },
  { id: 'ABH-20260603007', taskName: '异常地理位置登录', detectionType: 'geolocation', target: '全网账号', status: 'completed', startTime: '2026-06-03 20:00:00', duration: 15, anomaliesFound: 3, riskLevel: 'high', topUser: 'liu.jie@corp' },
  { id: 'ABH-20260602008', taskName: '邮件外发异常', detectionType: 'exfiltration', target: '全网邮箱', status: 'completed', startTime: '2026-06-02 18:00:00', duration: 22, anomaliesFound: 4, riskLevel: 'medium', topUser: 'zhao.min@corp' },
  { id: 'ABH-20260602009', taskName: 'U盘使用异常', detectionType: 'exfiltration', target: '全网终端', status: 'rolledback', startTime: '2026-06-02 14:00:00', duration: 18, anomaliesFound: 2, riskLevel: 'medium', topUser: 'sun.lei@corp' },
  { id: 'ABH-20260601010', taskName: '周末管理员登录', detectionType: 'workhour', target: '域管账号', status: 'completed', startTime: '2026-06-01 22:00:00', duration: 12, anomaliesFound: 1, riskLevel: 'high', topUser: 'admin.backup@corp' },
];

const TREND_DATA = [
  { day: '5/29', tasks: 12, anomalies: 25 },
  { day: '5/30', tasks: 15, anomalies: 32 },
  { day: '5/31', tasks: 18, anomalies: 28 },
  { day: '6/1', tasks: 14, anomalies: 35 },
  { day: '6/2', tasks: 16, anomalies: 42 },
  { day: '6/3', tasks: 18, anomalies: 38 },
  { day: '6/4', tasks: 8, anomalies: 17 },
];

const TYPE_LABEL: Record<AnomalyHistory['detectionType'], { label: string; color: string }> = {
  login: { label: '异常登录', color: 'bg-blue-500/20 text-blue-400' },
  exfiltration: { label: '数据外泄', color: 'bg-red-500/20 text-red-400' },
  privilege: { label: '特权账号', color: 'bg-orange-500/20 text-orange-400' },
  workhour: { label: '工作时间外', color: 'bg-purple-500/20 text-purple-400' },
  download: { label: '异常下载', color: 'bg-cyan-500/20 text-cyan-400' },
  geolocation: { label: '地理位置', color: 'bg-yellow-500/20 text-yellow-400' },
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
  { key: 'id', title: 'ID', width: '150px', render: (r: AnomalyHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'taskName', title: '任务', render: (r: AnomalyHistory) => <div><p className="text-sm text-slate-100">{r.taskName}</p><p className="text-[10px] text-slate-500">{r.target}</p></div> },
  { key: 'type', title: '类型', width: '100px', render: (r: AnomalyHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.detectionType].color}`}>{TYPE_LABEL[r.detectionType].label}</span> },
  { key: 'anomalies', title: '异常数', width: '70px', render: (r: AnomalyHistory) => <span className={`text-xs font-medium ${r.anomaliesFound > 0 ? 'text-red-400' : 'text-slate-500'}`}>{r.anomaliesFound}</span> },
  { key: 'risk', title: '风险', width: '70px', render: (r: AnomalyHistory) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'status', title: '状态', width: '80px', render: (r: AnomalyHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: AnomalyHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'topUser', title: '重点用户', width: '160px', render: (r: AnomalyHistory) => <span className="text-xs text-slate-300 font-mono">{r.topUser}</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: AnomalyHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-3-6 异常行为监测 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function AnomalyBehaviorHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    anomalies: HISTORY.reduce((s, h) => s + h.anomaliesFound, 0),
    critical: HISTORY.filter((h) => h.riskLevel === 'critical' || h.riskLevel === 'high').length,
    avgDuration: Math.round(HISTORY.reduce((s, h) => s + h.duration, 0) / HISTORY.length),
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-400" />
            异常行为监测任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史行为分析任务 · 异常回溯 · 用户画像</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史任务" value={stats.total} color="text-blue-400" />
        <KPI label="异常总数" value={stats.anomalies} color="text-red-400" />
        <KPI label="高危任务" value={stats.critical} color="text-orange-400" />
        <KPI label="平均耗时" value={`${stats.avgDuration}m`} color="text-cyan-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日异常趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="ab-anom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="anomalies" stroke="#EF4444" fill="url(#ab-anom)" strokeWidth={2} />
            <Line type="monotone" dataKey="tasks" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<AnomalyHistory>
        searchPlaceholder="搜索 ID / 任务名 / 目标..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '类型', options: [
          { value: 'all', label: '全部' },
          { value: 'login', label: '异常登录' },
          { value: 'exfiltration', label: '数据外泄' },
          { value: 'privilege', label: '特权账号' },
          { value: 'workhour', label: '工作时间外' },
          { value: 'download', label: '异常下载' },
          { value: 'geolocation', label: '地理位置' },
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
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.detectionType].color}`}>{TYPE_LABEL[r.detectionType].label}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
              <StatusBadge status={RISK_MAP[r.riskLevel].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.taskName}</h3>
            <p className="text-xs text-slate-500">目标: {r.target}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="检测类型" value={TYPE_LABEL[r.detectionType].label} />
              <Field label="异常数" value={`${r.anomaliesFound} 个`} highlight={r.anomaliesFound > 0} />
              <Field label="重点用户" value={r.topUser} />
              <Field label="耗时" value={`${r.duration} 分钟`} />
              <Field label="开始时间" value={r.startTime} />
              <Field label="风险等级" value={RISK_MAP[r.riskLevel].text} />
            </div>

            {r.anomaliesFound > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />发现 {r.anomaliesFound} 个异常
                </p>
                <p className="text-sm text-red-200">建议联系用户核实行为并调整基线</p>
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

export default AnomalyBehaviorHistory;

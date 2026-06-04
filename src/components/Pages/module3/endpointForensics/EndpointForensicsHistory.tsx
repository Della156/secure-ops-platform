'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, AlertCircle, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell, Pie, PieChart, Legend } from 'recharts';

interface EndpointHistory {
  id: string;
  taskName: string;
  forensicsType: 'memory' | 'log' | 'process' | 'network' | 'usb' | 'registry' | 'disk';
  target: string;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  evidenceSize: number; // MB
  artifactsCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  incidentId: string;
}

const HISTORY: EndpointHistory[] = [
  { id: 'EFH-20260604001', taskName: 'HOST-FIN-002 证据采集', forensicsType: 'disk', target: 'HOST-FIN-002 (Windows 11)', status: 'completed', startTime: '2026-06-04 10:00:00', duration: 35, evidenceSize: 4250, artifactsCount: 128, riskLevel: 'high', incidentId: 'INC-20260603001' },
  { id: 'EFH-20260604002', taskName: 'HOST-DEV-022 证据采集', forensicsType: 'disk', target: 'HOST-DEV-022 (Ubuntu 22.04)', status: 'completed', startTime: '2026-06-04 08:00:00', duration: 42, evidenceSize: 2800, artifactsCount: 95, riskLevel: 'high', incidentId: 'INC-20260602002' },
  { id: 'EFH-20260604003', taskName: 'HOST-APP-005 内存取证', forensicsType: 'memory', target: 'HOST-APP-005 (32GB)', status: 'failed', startTime: '2026-06-04 09:30:00', duration: 28, evidenceSize: 0, artifactsCount: 0, riskLevel: 'high', incidentId: 'INC-20260603001' },
  { id: 'EFH-20260604004', taskName: 'HOST-WEB-008 日志检索', forensicsType: 'log', target: 'HOST-WEB-008 (50GB)', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 22, evidenceSize: 1024, artifactsCount: 256, riskLevel: 'high', incidentId: 'INC-20260603001' },
  { id: 'EFH-20260603005', taskName: 'HOST-DEV-022 USB 取证', forensicsType: 'usb', target: 'HOST-DEV-022', status: 'completed', startTime: '2026-06-03 20:00:00', duration: 12, evidenceSize: 256, artifactsCount: 48, riskLevel: 'high', incidentId: 'INC-20260602002' },
  { id: 'EFH-20260603006', taskName: 'HOST-APP-005 注册表取证', forensicsType: 'registry', target: 'HOST-APP-005', status: 'completed', startTime: '2026-06-03 18:00:00', duration: 18, evidenceSize: 512, artifactsCount: 88, riskLevel: 'medium', incidentId: 'INC-20260603001' },
  { id: 'EFH-20260602007', taskName: 'HOST-APP-005 进程取证', forensicsType: 'process', target: 'HOST-APP-005 (可疑进程)', status: 'completed', startTime: '2026-06-02 16:00:00', duration: 25, evidenceSize: 768, artifactsCount: 156, riskLevel: 'critical', incidentId: 'INC-20260602001' },
  { id: 'EFH-20260602008', taskName: 'HOST-FIN-002 网络取证', forensicsType: 'network', target: 'HOST-FIN-002', status: 'rolledback', startTime: '2026-06-02 14:00:00', duration: 18, evidenceSize: 384, artifactsCount: 64, riskLevel: 'high', incidentId: 'INC-20260602001' },
  { id: 'EFH-20260601009', taskName: '全网可疑进程扫描', forensicsType: 'process', target: '全网 800 台终端', status: 'completed', startTime: '2026-06-01 22:00:00', duration: 90, evidenceSize: 4096, artifactsCount: 1024, riskLevel: 'medium', incidentId: '-' },
  { id: 'EFH-20260601010', taskName: '终端合规性检查', forensicsType: 'disk', target: '全网 800 台终端', status: 'completed', startTime: '2026-06-01 03:00:00', duration: 120, evidenceSize: 8192, artifactsCount: 3200, riskLevel: 'low', incidentId: '-' },
];

const TREND_DATA = [
  { day: '5/29', tasks: 12, evidence: 18, artifacts: 4500 },
  { day: '5/30', tasks: 15, evidence: 22, artifacts: 5200 },
  { day: '5/31', tasks: 18, evidence: 25, artifacts: 6100 },
  { day: '6/1', tasks: 16, evidence: 20, artifacts: 5500 },
  { day: '6/2', tasks: 14, evidence: 18, artifacts: 4900 },
  { day: '6/3', tasks: 18, evidence: 24, artifacts: 6300 },
  { day: '6/4', tasks: 8, evidence: 9, artifacts: 2500 },
];

const TYPE_LABEL: Record<EndpointHistory['forensicsType'], { label: string; color: string }> = {
  memory: { label: '内存取证', color: 'bg-purple-500/20 text-purple-400' },
  log: { label: '日志取证', color: 'bg-blue-500/20 text-blue-400' },
  process: { label: '进程取证', color: 'bg-orange-500/20 text-orange-400' },
  network: { label: '网络取证', color: 'bg-cyan-500/20 text-cyan-400' },
  usb: { label: 'USB 取证', color: 'bg-yellow-500/20 text-yellow-400' },
  registry: { label: '注册表', color: 'bg-pink-500/20 text-pink-400' },
  disk: { label: '磁盘取证', color: 'bg-red-500/20 text-red-400' },
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
  { key: 'id', title: 'ID', width: '150px', render: (r: EndpointHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'taskName', title: '任务', render: (r: EndpointHistory) => <div><p className="text-sm text-slate-100">{r.taskName}</p><p className="text-[10px] text-slate-500">{r.target}</p></div> },
  { key: 'type', title: '类型', width: '100px', render: (r: EndpointHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.forensicsType].color}`}>{TYPE_LABEL[r.forensicsType].label}</span> },
  { key: 'evidence', title: '证据', width: '90px', render: (r: EndpointHistory) => <span className={`text-xs ${r.evidenceSize > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>{(r.evidenceSize / 1024).toFixed(1)}GB</span> },
  { key: 'artifacts', title: '制品数', width: '70px', render: (r: EndpointHistory) => <span className="text-xs text-slate-300">{r.artifactsCount}</span> },
  { key: 'risk', title: '风险', width: '70px', render: (r: EndpointHistory) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'status', title: '状态', width: '80px', render: (r: EndpointHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'incident', title: '事件', width: '140px', render: (r: EndpointHistory) => <span className="text-xs text-slate-300 font-mono">{r.incidentId}</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: EndpointHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-11-6 终端取证 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function EndpointForensicsHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    evidence: HISTORY.reduce((s, h) => s + h.evidenceSize, 0),
    artifacts: HISTORY.reduce((s, h) => s + h.artifactsCount, 0),
    critical: HISTORY.filter((h) => h.riskLevel === 'critical' || h.riskLevel === 'high').length,
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            终端取证任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史取证任务 · 证据制品追溯 · 关联事件回溯</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史任务" value={stats.total} color="text-blue-400" />
        <KPI label="证据总量" value={`${(stats.evidence / 1024).toFixed(1)}GB`} color="text-cyan-400" />
        <KPI label="制品总数" value={stats.artifacts} color="text-purple-400" />
        <KPI label="高危任务" value={stats.critical} color="text-red-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日取证趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="ef-evid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="artifacts" stroke="#06B6D4" fill="url(#ef-evid)" strokeWidth={2} />
            <Line type="monotone" dataKey="tasks" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<EndpointHistory>
        searchPlaceholder="搜索 ID / 任务名 / 目标..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '类型', options: [
          { value: 'all', label: '全部' },
          { value: 'memory', label: '内存取证' },
          { value: 'disk', label: '磁盘取证' },
          { value: 'log', label: '日志取证' },
          { value: 'process', label: '进程取证' },
          { value: 'network', label: '网络取证' },
          { value: 'usb', label: 'USB 取证' },
          { value: 'registry', label: '注册表' },
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
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.forensicsType].color}`}>{TYPE_LABEL[r.forensicsType].label}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
              <StatusBadge status={RISK_MAP[r.riskLevel].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.taskName}</h3>
            <p className="text-xs text-slate-500">目标: {r.target}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="取证类型" value={TYPE_LABEL[r.forensicsType].label} />
              <Field label="证据大小" value={`${(r.evidenceSize / 1024).toFixed(2)} GB`} />
              <Field label="制品数" value={`${r.artifactsCount} 个`} />
              <Field label="耗时" value={`${r.duration} 分钟`} />
              <Field label="关联事件" value={r.incidentId} />
              <Field label="开始时间" value={r.startTime} />
            </div>

            {r.status === 'failed' && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />取证失败
                </p>
                <p className="text-sm text-red-200">取证未完成，请检查工具链兼容性或重试</p>
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

export default EndpointForensicsHistory;

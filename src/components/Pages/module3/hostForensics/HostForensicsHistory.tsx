'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, Server, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell, Pie, PieChart, Legend } from 'recharts';

interface HostHistory {
  id: string;
  taskName: string;
  forensicsType: 'disk' | 'log' | 'sample' | 'config' | 'network' | 'autorun' | 'account' | 'memory';
  target: string;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  evidenceSize: number;
  findings: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  incidentId: string;
}

const HISTORY: HostHistory[] = [
  { id: 'HFH-20260604001', taskName: 'HOST-DB-007 证据采集', forensicsType: 'disk', target: 'HOST-DB-007 (Win Server 2019)', status: 'completed', startTime: '2026-06-04 10:00:00', duration: 38, evidenceSize: 12800, findings: 8, riskLevel: 'high', incidentId: 'INC-20260603001' },
  { id: 'HFH-20260604002', taskName: 'HOST-DB 数据同步', forensicsType: 'disk', target: 'HOST-DB-001/002', status: 'completed', startTime: '2026-06-04 08:00:00', duration: 25, evidenceSize: 2560, findings: 0, riskLevel: 'low', incidentId: '-' },
  { id: 'HFH-20260604003', taskName: 'HOST-DB-007 日志检索', forensicsType: 'log', target: 'HOST-DB-007 (50GB)', status: 'failed', startTime: '2026-06-04 09:00:00', duration: 32, evidenceSize: 0, findings: 0, riskLevel: 'high', incidentId: 'INC-20260603001' },
  { id: 'HFH-20260604004', taskName: 'HOST-DB-007 可疑样本分析', forensicsType: 'sample', target: 'HOST-DB-007 (3 文件)', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 18, evidenceSize: 256, findings: 3, riskLevel: 'high', incidentId: 'INC-20260603001' },
  { id: 'HFH-20260603005', taskName: 'HOST-APP-005 启动项分析', forensicsType: 'autorun', target: 'HOST-APP-005', status: 'completed', startTime: '2026-06-03 22:00:00', duration: 12, evidenceSize: 128, findings: 2, riskLevel: 'high', incidentId: 'INC-20260603001' },
  { id: 'HFH-20260603006', taskName: 'HOST-DB-007 账号审计', forensicsType: 'account', target: 'HOST-DB-007', status: 'completed', startTime: '2026-06-03 20:00:00', duration: 18, evidenceSize: 64, findings: 1, riskLevel: 'medium', incidentId: 'INC-20260603001' },
  { id: 'HFH-20260602007', taskName: 'HOST-FIN-002 内存取证', forensicsType: 'memory', target: 'HOST-FIN-002 (32GB)', status: 'completed', startTime: '2026-06-02 16:00:00', duration: 25, evidenceSize: 32768, findings: 12, riskLevel: 'critical', incidentId: 'INC-20260602001' },
  { id: 'HFH-20260602008', taskName: 'HOST-FIN-002 网络取证', forensicsType: 'network', target: 'HOST-FIN-002 (PCAP)', status: 'rolledback', startTime: '2026-06-02 14:00:00', duration: 18, evidenceSize: 4096, findings: 5, riskLevel: 'high', incidentId: 'INC-20260602001' },
  { id: 'HFH-20260601009', taskName: 'WEB 集群配置基线比对', forensicsType: 'config', target: 'HOST-WEB-001~008', status: 'completed', startTime: '2026-06-01 22:00:00', duration: 60, evidenceSize: 512, findings: 8, riskLevel: 'medium', incidentId: '-' },
  { id: 'HFH-20260601010', taskName: '生产主机全量巡检', forensicsType: 'disk', target: '全网 56 台生产主机', status: 'completed', startTime: '2026-06-01 03:00:00', duration: 120, evidenceSize: 32768, findings: 15, riskLevel: 'low', incidentId: '-' },
];

const TREND_DATA = [
  { day: '5/29', tasks: 14, evidence: 32, findings: 28 },
  { day: '5/30', tasks: 18, evidence: 38, findings: 35 },
  { day: '5/31', tasks: 20, evidence: 42, findings: 41 },
  { day: '6/1', tasks: 16, evidence: 35, findings: 32 },
  { day: '6/2', tasks: 14, evidence: 30, findings: 25 },
  { day: '6/3', tasks: 18, evidence: 36, findings: 38 },
  { day: '6/4', tasks: 8, evidence: 16, findings: 11 },
];

const TYPE_LABEL: Record<HostHistory['forensicsType'], { label: string; color: string }> = {
  memory: { label: '内存取证', color: 'bg-purple-500/20 text-purple-400' },
  log: { label: '日志取证', color: 'bg-blue-500/20 text-blue-400' },
  sample: { label: '样本分析', color: 'bg-orange-500/20 text-orange-400' },
  config: { label: '配置基线', color: 'bg-cyan-500/20 text-cyan-400' },
  network: { label: '网络取证', color: 'bg-cyan-500/20 text-cyan-400' },
  autorun: { label: '启动项', color: 'bg-pink-500/20 text-pink-400' },
  account: { label: '账号审计', color: 'bg-yellow-500/20 text-yellow-400' },
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
  { key: 'id', title: 'ID', width: '150px', render: (r: HostHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'taskName', title: '任务', render: (r: HostHistory) => <div><p className="text-sm text-slate-100">{r.taskName}</p><p className="text-[10px] text-slate-500">{r.target}</p></div> },
  { key: 'type', title: '类型', width: '100px', render: (r: HostHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.forensicsType].color}`}>{TYPE_LABEL[r.forensicsType].label}</span> },
  { key: 'evidence', title: '证据', width: '90px', render: (r: HostHistory) => <span className={`text-xs ${r.evidenceSize > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>{(r.evidenceSize / 1024).toFixed(1)}GB</span> },
  { key: 'findings', title: '发现', width: '60px', render: (r: HostHistory) => <span className={`text-xs ${r.findings > 0 ? 'text-red-400' : 'text-slate-500'}`}>{r.findings}</span> },
  { key: 'risk', title: '风险', width: '70px', render: (r: HostHistory) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'status', title: '状态', width: '80px', render: (r: HostHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'incident', title: '事件', width: '140px', render: (r: HostHistory) => <span className="text-xs text-slate-300 font-mono">{r.incidentId}</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: HostHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-12-6 主机取证 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function HostForensicsHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    evidence: HISTORY.reduce((s, h) => s + h.evidenceSize, 0),
    findings: HISTORY.reduce((s, h) => s + h.findings, 0),
    critical: HISTORY.filter((h) => h.riskLevel === 'critical' || h.riskLevel === 'high').length,
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            主机取证任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史取证任务 · 主机证据追溯 · 发现事项回溯</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史任务" value={stats.total} color="text-blue-400" />
        <KPI label="证据总量" value={`${(stats.evidence / 1024).toFixed(1)}GB`} color="text-cyan-400" />
        <KPI label="发现总数" value={stats.findings} color="text-red-400" />
        <KPI label="高危任务" value={stats.critical} color="text-orange-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日取证趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="hf-find" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="findings" stroke="#EF4444" fill="url(#hf-find)" strokeWidth={2} />
            <Line type="monotone" dataKey="tasks" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<HostHistory>
        searchPlaceholder="搜索 ID / 任务名 / 目标..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '类型', options: [
          { value: 'all', label: '全部' },
          { value: 'memory', label: '内存取证' },
          { value: 'disk', label: '磁盘取证' },
          { value: 'log', label: '日志取证' },
          { value: 'sample', label: '样本分析' },
          { value: 'config', label: '配置基线' },
          { value: 'network', label: '网络取证' },
          { value: 'autorun', label: '启动项' },
          { value: 'account', label: '账号审计' },
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
              <Field label="发现数" value={`${r.findings} 个`} highlight={r.findings > 0} />
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

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return <div className={`p-2.5 rounded-lg ${highlight ? 'bg-red-500/10' : 'bg-[#111625]'}`}><p className="text-xs text-slate-500">{label}</p><p className={`text-sm mt-0.5 ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p></div>;
}

export default HostForensicsHistory;

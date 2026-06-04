'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell } from 'recharts';

interface BaselineHistory {
  id: string;
  reportName: string;
  assetType: 'server' | 'database' | 'network' | 'middleware' | 'endpoint' | 'application';
  compliance: number;
  totalChecks: number;
  failed: number;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  framework: '等保2.0' | 'CIS Benchmark' | 'PCI DSS';
  size: number;
}

const HISTORY: BaselineHistory[] = [
  { id: 'BRH-20260604001', reportName: '核心服务器基线_20260604', assetType: 'server', compliance: 92, totalChecks: 156, failed: 12, status: 'completed', startTime: '2026-06-04 08:00:00', duration: 45, framework: 'CIS Benchmark', size: 384 },
  { id: 'BRH-20260604002', reportName: '数据库基线_20260604', assetType: 'database', compliance: 88, totalChecks: 120, failed: 14, status: 'completed', startTime: '2026-06-04 08:00:00', duration: 35, framework: '等保2.0', size: 320 },
  { id: 'BRH-20260603003', reportName: '网络设备基线_20260603', assetType: 'network', compliance: 95, totalChecks: 85, failed: 4, status: 'completed', startTime: '2026-06-03 08:00:00', duration: 28, framework: '等保2.0', size: 280 },
  { id: 'BRH-20260602004', reportName: '中间件基线_20260602', assetType: 'middleware', compliance: 91, totalChecks: 95, failed: 9, status: 'completed', startTime: '2026-06-02 08:00:00', duration: 22, framework: '等保2.0', size: 240 },
  { id: 'BRH-20260601005', reportName: '终端基线_20260601', assetType: 'endpoint', compliance: 78, totalChecks: 240, failed: 53, status: 'failed', startTime: '2026-06-01 08:00:00', duration: 28, framework: 'CIS Benchmark', size: 0 },
  { id: 'BRH-20260531006', reportName: '应用基线_20260531', assetType: 'application', compliance: 89, totalChecks: 78, failed: 9, status: 'completed', startTime: '2026-05-31 08:00:00', duration: 18, framework: '等保2.0', size: 200 },
  { id: 'BRH-20260530007', reportName: '操作系统基线_20260530', assetType: 'server', compliance: 93, totalChecks: 156, failed: 11, status: 'completed', startTime: '2026-05-30 08:00:00', duration: 20, framework: 'CIS Benchmark', size: 380 },
  { id: 'BRH-20260529008', reportName: '容器基线_20260529', assetType: 'middleware', compliance: 87, totalChecks: 65, failed: 8, status: 'completed', startTime: '2026-05-29 08:00:00', duration: 19, framework: 'CIS Benchmark', size: 220 },
  { id: 'BRH-20260528009', reportName: '服务器基线_20260528', assetType: 'server', compliance: 91, totalChecks: 156, failed: 14, status: 'rolledback', startTime: '2026-05-28 08:00:00', duration: 18, framework: '等保2.0', size: 0 },
  { id: 'BRH-20260527010', reportName: '数据库基线_20260527', assetType: 'database', compliance: 86, totalChecks: 120, failed: 17, status: 'completed', startTime: '2026-05-27 08:00:00', duration: 35, framework: '等保2.0', size: 310 },
];

const TREND_DATA = [
  { day: '5/29', compliance: 87, checks: 580 },
  { day: '5/30', compliance: 93, checks: 615 },
  { day: '5/31', compliance: 89, checks: 595 },
  { day: '6/1', compliance: 78, checks: 240 },
  { day: '6/2', compliance: 91, checks: 605 },
  { day: '6/3', compliance: 95, checks: 615 },
  { day: '6/4', compliance: 90, checks: 620 },
];

const ASSET_LABEL: Record<BaselineHistory['assetType'], { label: string; color: string }> = {
  server: { label: '服务器', color: 'bg-blue-500/20 text-blue-400' },
  database: { label: '数据库', color: 'bg-purple-500/20 text-purple-400' },
  network: { label: '网络设备', color: 'bg-cyan-500/20 text-cyan-400' },
  middleware: { label: '中间件', color: 'bg-orange-500/20 text-orange-400' },
  endpoint: { label: '终端', color: 'bg-yellow-500/20 text-yellow-400' },
  application: { label: '应用', color: 'bg-green-500/20 text-green-400' },
};

const FRAMEWORK_LABEL: Record<BaselineHistory['framework'], { label: string; color: string }> = {
  '等保2.0': { label: '等保 2.0', color: 'bg-blue-500/20 text-blue-400' },
  'CIS Benchmark': { label: 'CIS', color: 'bg-cyan-500/20 text-cyan-400' },
  'PCI DSS': { label: 'PCI DSS', color: 'bg-purple-500/20 text-purple-400' },
};

const STATUS_MAP = {
  completed: { status: 'success', text: '已完成' },
  failed: { status: 'failed', text: '失败' },
  rolledback: { status: 'warning', text: '已回滚' },
};

const COLUMNS = [
  { key: 'id', title: 'ID', width: '150px', render: (r: BaselineHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'reportName', title: '报告', render: (r: BaselineHistory) => <div><p className="text-sm text-slate-100">{r.reportName}</p><p className="text-[10px] text-slate-500">{r.framework}</p></div> },
  { key: 'assetType', title: '资产类型', width: '90px', render: (r: BaselineHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${ASSET_LABEL[r.assetType].color}`}>{ASSET_LABEL[r.assetType].label}</span> },
  { key: 'compliance', title: '合规率', width: '90px', render: (r: BaselineHistory) => <span className={`text-xs font-medium ${r.compliance >= 90 ? 'text-green-400' : r.compliance >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{r.compliance}%</span> },
  { key: 'failed', title: '不合规', width: '80px', render: (r: BaselineHistory) => <span className="text-xs text-red-400">{r.failed}</span> },
  { key: 'checks', title: '检查项', width: '80px', render: (r: BaselineHistory) => <span className="text-xs text-slate-300">{r.totalChecks}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: BaselineHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: BaselineHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: BaselineHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-15-6 基线防护报告 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function BaselineReportHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    avgCompliance: Math.round(HISTORY.reduce((s, h) => s + h.compliance, 0) / HISTORY.length),
    totalFailed: HISTORY.reduce((s, h) => s + h.failed, 0),
    frameworks: new Set(HISTORY.map((h) => h.framework)).size,
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            基线防护报告历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史基线检查 · 等保/CIS · 6 类资产 · 合规追溯</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史报告" value={stats.total} color="text-blue-400" />
        <KPI label="平均合规" value={stats.avgCompliance + '%'} color="text-green-400" />
        <KPI label="不合规项" value={stats.totalFailed} color="text-red-400" />
        <KPI label="合规框架" value={stats.frameworks} color="text-cyan-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日合规率趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="br-comp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} domain={[60, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="compliance" stroke="#22C55E" fill="url(#br-comp)" strokeWidth={2} />
            <Line type="monotone" dataKey="checks" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<BaselineHistory>
        searchPlaceholder="搜索 ID / 报告名..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '资产', options: [
          { value: 'all', label: '全部' },
          { value: 'server', label: '服务器' },
          { value: 'database', label: '数据库' },
          { value: 'network', label: '网络设备' },
          { value: 'middleware', label: '中间件' },
          { value: 'endpoint', label: '终端' },
          { value: 'application', label: '应用' },
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
              <span className={`text-xs px-1.5 py-0.5 rounded ${ASSET_LABEL[r.assetType].color}`}>{ASSET_LABEL[r.assetType].label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${FRAMEWORK_LABEL[r.framework].color}`}>{FRAMEWORK_LABEL[r.framework].label}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.reportName}</h3>

            <div className="grid grid-cols-2 gap-2">
              <Field label="资产类型" value={ASSET_LABEL[r.assetType].label} />
              <Field label="合规框架" value={FRAMEWORK_LABEL[r.framework].label} />
              <Field label="合规率" value={r.compliance + '%'} highlight={r.compliance < 85} />
              <Field label="检查项" value={`${r.totalChecks} 个`} />
              <Field label="不合规" value={`${r.failed} 项`} highlight={r.failed > 20} />
              <Field label="生成耗时" value={`${r.duration} 分钟`} />
            </div>

            {r.compliance < 85 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />合规率偏低
                </p>
                <p className="text-sm text-red-200">建议立即整改不合规项</p>
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

export default BaselineReportHistory;

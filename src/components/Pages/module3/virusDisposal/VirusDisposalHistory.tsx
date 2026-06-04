'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, Shield, Activity, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell } from 'recharts';

interface VirusHistory {
  id: string;
  virusName: string;
  virusType: 'trojan' | 'ransom' | 'worm' | 'apt' | 'spyware' | 'miner';
  host: string;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  filesAffected: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'isolated' | 'cleaned' | 'quarantined' | 'deleted';
}

const HISTORY: VirusHistory[] = [
  { id: 'VDH-20260604001', virusName: 'LockBit v4', virusType: 'ransom', host: 'HOST-FIN-007', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 35, filesAffected: 1247, severity: 'critical', action: 'quarantined' },
  { id: 'VDH-20260604002', virusName: 'XMRig', virusType: 'miner', host: 'HOST-DEV-022', status: 'completed', startTime: '2026-06-04 08:00:00', duration: 18, filesAffected: 2, severity: 'medium', action: 'cleaned' },
  { id: 'VDH-20260604003', virusName: 'Cobalt Strike', virusType: 'apt', host: 'HOST-DB-007', status: 'failed', startTime: '2026-06-04 09:15:00', duration: 28, filesAffected: 12, severity: 'critical', action: 'isolated' },
  { id: 'VDH-20260604004', virusName: 'Conficker', virusType: 'worm', host: 'HOST-DEV-013', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 22, filesAffected: 3, severity: 'high', action: 'cleaned' },
  { id: 'VDH-20260603005', virusName: 'Emotet', virusType: 'trojan', host: 'HOST-FIN-002', status: 'completed', startTime: '2026-06-03 22:00:00', duration: 30, filesAffected: 8, severity: 'high', action: 'cleaned' },
  { id: 'VDH-20260603006', virusName: 'AgentTesla', virusType: 'spyware', host: 'HOST-DEV-008', status: 'completed', startTime: '2026-06-03 20:00:00', duration: 18, filesAffected: 5, severity: 'high', action: 'quarantined' },
  { id: 'VDH-20260602007', virusName: 'Mirai', virusType: 'worm', host: 'HOST-DEV-016', status: 'completed', startTime: '2026-06-02 16:00:00', duration: 25, filesAffected: 4, severity: 'high', action: 'cleaned' },
  { id: 'VDH-20260602008', virusName: 'XLoader', virusType: 'trojan', host: 'HOST-DEV-014', status: 'rolledback', startTime: '2026-06-02 14:00:00', duration: 18, filesAffected: 6, severity: 'high', action: 'isolated' },
  { id: 'VDH-20260601009', virusName: 'FormBook', virusType: 'spyware', host: 'HOST-DEV-005', status: 'completed', startTime: '2026-06-01 22:00:00', duration: 12, filesAffected: 2, severity: 'medium', action: 'cleaned' },
  { id: 'VDH-20260601010', virusName: 'WannaCry', virusType: 'worm', host: 'HOST-DEV-011', status: 'completed', startTime: '2026-06-01 03:00:00', duration: 35, filesAffected: 18, severity: 'critical', action: 'deleted' },
];

const TREND_DATA = [
  { day: '5/29', detected: 28, cleaned: 26, failed: 2 },
  { day: '5/30', detected: 32, cleaned: 30, failed: 2 },
  { day: '5/31', detected: 35, cleaned: 33, failed: 2 },
  { day: '6/1', detected: 30, cleaned: 28, failed: 2 },
  { day: '6/2', detected: 38, cleaned: 36, failed: 2 },
  { day: '6/3', detected: 42, cleaned: 39, failed: 3 },
  { day: '6/4', detected: 18, cleaned: 14, failed: 1 },
];

const TYPE_LABEL: Record<VirusHistory['virusType'], { label: string; color: string; icon: any }> = {
  trojan: { label: '木马', color: 'bg-orange-500/20 text-orange-400', icon: Shield },
  ransom: { label: '勒索', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
  worm: { label: '蠕虫', color: 'bg-purple-500/20 text-purple-400', icon: Activity },
  apt: { label: 'APT', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
  spyware: { label: '间谍', color: 'bg-yellow-500/20 text-yellow-400', icon: Shield },
  miner: { label: '挖矿', color: 'bg-blue-500/20 text-blue-400', icon: Activity },
};

const ACTION_LABEL = {
  isolated: { label: '已隔离', status: 'info' as const },
  cleaned: { label: '已清除', status: 'success' as const },
  quarantined: { label: '已隔离', status: 'warning' as const },
  deleted: { label: '已删除', status: 'success' as const },
};

const STATUS_MAP = {
  completed: { status: 'success', text: '已完成' },
  failed: { status: 'failed', text: '失败' },
  rolledback: { status: 'warning', text: '已回滚' },
};

const SEVERITY_MAP = {
  low: { status: 'success', text: '低' },
  medium: { status: 'info', text: '中' },
  high: { status: 'warning', text: '高' },
  critical: { status: 'failed', text: '严重' },
};

const COLUMNS = [
  { key: 'id', title: 'ID', width: '150px', render: (r: VirusHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'virusName', title: '病毒', render: (r: VirusHistory) => <div><p className="text-sm text-slate-100">{r.virusName}</p><p className="text-[10px] text-slate-500">{r.host}</p></div> },
  { key: 'type', title: '类型', width: '80px', render: (r: VirusHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.virusType].color}`}>{TYPE_LABEL[r.virusType].label}</span> },
  { key: 'severity', title: '风险', width: '70px', render: (r: VirusHistory) => <StatusBadge status={SEVERITY_MAP[r.severity].status} /> },
  { key: 'action', title: '处置', width: '80px', render: (r: VirusHistory) => <StatusBadge status={ACTION_LABEL[r.action].status} /> },
  { key: 'files', title: '文件', width: '70px', render: (r: VirusHistory) => <span className="text-xs text-slate-300">{r.filesAffected}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: VirusHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: VirusHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: VirusHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-10-6 病毒处置 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function VirusDisposalHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    completed: HISTORY.filter((h) => h.status === 'completed').length,
    failed: HISTORY.filter((h) => h.status === 'failed').length,
    cleaned: HISTORY.filter((h) => h.action === 'cleaned').length,
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            病毒处置任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史病毒处置 · 6 类病毒 · 4 处置动作</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史处置" value={stats.total} color="text-blue-400" />
        <KPI label="已清除" value={stats.completed} color="text-green-400" />
        <KPI label="失败" value={stats.failed} color="text-red-400" />
        <KPI label="已清理" value={stats.cleaned} color="text-cyan-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日病毒处置趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="vd-det" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="detected" stroke="#3B82F6" fill="url(#vd-det)" strokeWidth={2} />
            <Line type="monotone" dataKey="cleaned" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<VirusHistory>
        searchPlaceholder="搜索 ID / 病毒名 / 主机..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '类型', options: [
          { value: 'all', label: '全部' },
          { value: 'trojan', label: '木马' },
          { value: 'ransom', label: '勒索' },
          { value: 'worm', label: '蠕虫' },
          { value: 'apt', label: 'APT' },
          { value: 'spyware', label: '间谍' },
          { value: 'miner', label: '挖矿' },
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
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.virusType].color}`}>{TYPE_LABEL[r.virusType].label}</span>
              <StatusBadge status={SEVERITY_MAP[r.severity].status} />
              <StatusBadge status={STATUS_MAP[r.status].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.virusName}</h3>
            <p className="text-xs text-slate-500">主机: {r.host}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="病毒类型" value={TYPE_LABEL[r.virusType].label} />
              <Field label="风险等级" value={SEVERITY_MAP[r.severity].text} />
              <Field label="处置动作" value={ACTION_LABEL[r.action].label} />
              <Field label="受影响文件" value={`${r.filesAffected} 个`} />
              <Field label="状态" value={STATUS_MAP[r.status].text} />
              <Field label="耗时" value={`${r.duration} 分钟`} />
            </div>

            {r.severity === 'critical' && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />严重威胁
                </p>
                <p className="text-sm text-red-200">已下发全网 IOC 阻断规则</p>
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

export default VirusDisposalHistory;

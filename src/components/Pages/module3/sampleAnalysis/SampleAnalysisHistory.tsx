'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Activity, Brain, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Cell, Pie, PieChart, Legend } from 'recharts';

interface SampleHistory {
  id: string;
  sampleName: string;
  sampleType: 'PE' | 'ELF' | 'PDF' | 'Office' | 'Script' | 'Archive';
  family: string;
  status: 'completed' | 'failed' | 'rolledback';
  startTime: string;
  duration: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  toolsUsed: number;
  verdict: 'malicious' | 'suspicious' | 'safe' | 'unknown';
}

const HISTORY: SampleHistory[] = [
  { id: 'SAH-20260604001', sampleName: 'APT-29 phishing kit', sampleType: 'Archive', family: 'APT-29', status: 'completed', startTime: '2026-06-04 10:00:00', duration: 32, confidence: 98, riskLevel: 'critical', toolsUsed: 5, verdict: 'malicious' },
  { id: 'SAH-20260604002', sampleName: 'LockBit v4 ransomware', sampleType: 'PE', family: 'LockBit v4', status: 'completed', startTime: '2026-06-04 08:00:00', duration: 45, confidence: 99, riskLevel: 'critical', toolsUsed: 6, verdict: 'malicious' },
  { id: 'SAH-20260604003', sampleName: 'JC-001 汇总报告', sampleType: 'Archive', family: 'APT-29', status: 'failed', startTime: '2026-06-04 09:30:00', duration: 28, confidence: 0, riskLevel: 'high', toolsUsed: 3, verdict: 'unknown' },
  { id: 'SAH-20260604004', sampleName: 'emotet.dll', sampleType: 'PE', family: 'Emotet', status: 'completed', startTime: '2026-06-04 10:30:00', duration: 22, confidence: 92, riskLevel: 'high', toolsUsed: 5, verdict: 'malicious' },
  { id: 'SAH-20260603005', sampleName: 'CVE-2026-1234 exploit', sampleType: 'Script', family: 'CVE-2026-1234', status: 'completed', startTime: '2026-06-03 22:00:00', duration: 12, confidence: 95, riskLevel: 'critical', toolsUsed: 4, verdict: 'malicious' },
  { id: 'SAH-20260603006', sampleName: 'WebShell b374k', sampleType: 'Script', family: 'WebShell-B374k', status: 'completed', startTime: '2026-06-03 20:00:00', duration: 18, confidence: 96, riskLevel: 'critical', toolsUsed: 5, verdict: 'malicious' },
  { id: 'SAH-20260602007', sampleName: 'mirai.elf', sampleType: 'ELF', family: 'Mirai', status: 'completed', startTime: '2026-06-02 16:00:00', duration: 25, confidence: 95, riskLevel: 'high', toolsUsed: 4, verdict: 'malicious' },
  { id: 'SAH-20260602008', sampleName: 'XLoader Android', sampleType: 'Archive', family: 'XLoader', status: 'rolledback', startTime: '2026-06-02 14:00:00', duration: 18, confidence: 88, riskLevel: 'high', toolsUsed: 5, verdict: 'malicious' },
  { id: 'SAH-20260601009', sampleName: 'suspicious_doc.pdf', sampleType: 'PDF', family: '可疑', status: 'completed', startTime: '2026-06-01 22:00:00', duration: 30, confidence: 65, riskLevel: 'medium', toolsUsed: 4, verdict: 'suspicious' },
  { id: 'SAH-20260601010', sampleName: 'office_macro.docm', sampleType: 'Office', family: 'APT-29', status: 'completed', startTime: '2026-06-01 03:00:00', duration: 35, confidence: 94, riskLevel: 'high', toolsUsed: 5, verdict: 'malicious' },
];

const TREND_DATA = [
  { day: '5/29', samples: 28, malicious: 12, suspicious: 5 },
  { day: '5/30', samples: 32, malicious: 15, suspicious: 6 },
  { day: '5/31', samples: 35, malicious: 18, suspicious: 7 },
  { day: '6/1', samples: 30, malicious: 14, suspicious: 5 },
  { day: '6/2', samples: 38, malicious: 20, suspicious: 8 },
  { day: '6/3', samples: 42, malicious: 24, suspicious: 9 },
  { day: '6/4', samples: 18, malicious: 10, suspicious: 3 },
];

const TYPE_LABEL: Record<SampleHistory['sampleType'], { label: string; color: string }> = {
  PE: { label: 'PE', color: 'bg-blue-500/20 text-blue-400' },
  ELF: { label: 'ELF', color: 'bg-purple-500/20 text-purple-400' },
  PDF: { label: 'PDF', color: 'bg-red-500/20 text-red-400' },
  Office: { label: 'Office', color: 'bg-orange-500/20 text-orange-400' },
  Script: { label: 'Script', color: 'bg-yellow-500/20 text-yellow-400' },
  Archive: { label: 'Archive', color: 'bg-cyan-500/20 text-cyan-400' },
};

const VERDICT_MAP: Record<SampleHistory['verdict'], { status: any; text: string; color: string }> = {
  malicious: { status: 'failed', text: '恶意', color: 'text-red-400' },
  suspicious: { status: 'warning', text: '可疑', color: 'text-yellow-400' },
  safe: { status: 'success', text: '安全', color: 'text-green-400' },
  unknown: { status: 'pending', text: '未知', color: 'text-slate-400' },
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
  { key: 'id', title: 'ID', width: '150px', render: (r: SampleHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'sampleName', title: '样本', render: (r: SampleHistory) => <div><p className="text-sm text-slate-100">{r.sampleName}</p><p className="text-[10px] text-slate-500">家族: {r.family}</p></div> },
  { key: 'type', title: '类型', width: '80px', render: (r: SampleHistory) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.sampleType].color}`}>{TYPE_LABEL[r.sampleType].label}</span> },
  { key: 'verdict', title: '结论', width: '80px', render: (r: SampleHistory) => <span className={`text-xs font-medium ${VERDICT_MAP[r.verdict].color}`}>{VERDICT_MAP[r.verdict].text}</span> },
  { key: 'confidence', title: '置信度', width: '80px', render: (r: SampleHistory) => <span className={`text-xs font-medium ${r.confidence >= 90 ? 'text-green-400' : r.confidence >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>{r.confidence}%</span> },
  { key: 'tools', title: '工具', width: '60px', render: (r: SampleHistory) => <span className="text-xs text-slate-300">{r.toolsUsed}</span> },
  { key: 'risk', title: '风险', width: '70px', render: (r: SampleHistory) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'status', title: '状态', width: '80px', render: (r: SampleHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: SampleHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: SampleHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 3-13-6 样本分析 - 任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 */
export function SampleAnalysisHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    malicious: HISTORY.filter((h) => h.verdict === 'malicious').length,
    suspicious: HISTORY.filter((h) => h.verdict === 'suspicious').length,
    avgConfidence: Math.round(HISTORY.reduce((s, h) => s + h.confidence, 0) / HISTORY.length),
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            样本分析任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史样本分析 · 家族聚类 · 置信度回溯</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="历史样本" value={stats.total} color="text-blue-400" />
        <KPI label="恶意样本" value={stats.malicious} color="text-red-400" />
        <KPI label="可疑样本" value={stats.suspicious} color="text-yellow-400" />
        <KPI label="平均置信度" value={`${stats.avgConfidence}%`} color="text-cyan-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日样本分析趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="sa-mal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="malicious" stroke="#EF4444" fill="url(#sa-mal)" strokeWidth={2} />
            <Line type="monotone" dataKey="suspicious" stroke="#EAB308" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="samples" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<SampleHistory>
        searchPlaceholder="搜索 ID / 样本名 / 家族..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '类型', options: [
          { value: 'all', label: '全部' },
          { value: 'PE', label: 'PE' },
          { value: 'ELF', label: 'ELF' },
          { value: 'PDF', label: 'PDF' },
          { value: 'Office', label: 'Office' },
          { value: 'Script', label: 'Script' },
          { value: 'Archive', label: 'Archive' },
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
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.sampleType].color}`}>{TYPE_LABEL[r.sampleType].label}</span>
              <span className={`text-xs font-medium ${VERDICT_MAP[r.verdict].color}`}>{VERDICT_MAP[r.verdict].text}</span>
              <StatusBadge status={RISK_MAP[r.riskLevel].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.sampleName}</h3>
            <p className="text-xs text-slate-500">家族: {r.family}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="样本类型" value={TYPE_LABEL[r.sampleType].label} />
              <Field label="置信度" value={`${r.confidence}%`} />
              <Field label="研判结论" value={VERDICT_MAP[r.verdict].text} />
              <Field label="风险等级" value={RISK_MAP[r.riskLevel].text} />
              <Field label="使用工具" value={`${r.toolsUsed} 个`} />
              <Field label="耗时" value={`${r.duration} 分钟`} />
            </div>

            {r.verdict === 'malicious' && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />恶意样本
                </p>
                <p className="text-sm text-red-200">建议立即下发全网 IOC 阻断规则</p>
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

export default SampleAnalysisHistory;

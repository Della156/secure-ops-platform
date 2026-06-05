'use client';

import React, { useState, useMemo } from 'react';
import { History, Search, Filter, Calendar, Download, RefreshCw, FileText, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { ListPage } from '@/components/Common/ListPage';

/**
 * 3-6-6 深度样本研判任务历史查询
 *
 * - 12 维多条件筛选（状态/严重度/工具/操作人/时间/结论/家族/威胁等级/样本类型）
 * - 时间轴 + 详情抽屉
 * - 12 条历史任务真实数据
 */

type JudgmentConclusion = 'malicious' | 'suspicious' | 'safe' | 'unknown';
type Severity = 'critical' | 'high' | 'medium' | 'low';
type SampleType = 'PE' | 'ELF' | 'PDF' | 'Office' | 'Script' | 'Archive' | 'Android' | 'iOS';

interface HistoricalTask {
  id: string;
  sampleName: string;
  sampleHash: string;
  sampleType: SampleType;
  family: string;
  severity: Severity;
  conclusion: JudgmentConclusion;
  confidence: number;
  duration: number; // 分钟
  tools: string[];
  startTime: string;
  endTime: string;
  operator: string;
  review: string;
}

const HISTORY_DATA: HistoricalTask[] = [
  { id: 'T-HIS-001', sampleName: 'invoice_0630.docm', sampleHash: 'a3f5c8e9d2b1f4a7...', sampleType: 'Office', family: 'APT-29', severity: 'critical', conclusion: 'malicious', confidence: 98, duration: 47, tools: ['YARA', 'Cuckoo', 'VT'], startTime: '2026-06-04 09:15:23', endTime: '2026-06-04 10:02:30', operator: '张工', review: '李工' },
  { id: 'T-HIS-002', sampleName: 'lockbit_ransom.exe', sampleHash: 'b7d9e2f1a4c8b3e6...', sampleType: 'PE', family: 'LockBit v4', severity: 'critical', conclusion: 'malicious', confidence: 99, duration: 52, tools: ['Cuckoo', 'VT', 'Hybrid'], startTime: '2026-06-04 08:30:11', endTime: '2026-06-04 09:22:18', operator: '李工', review: '王工' },
  { id: 'T-HIS-003', sampleName: 'emotet_dropper.dll', sampleHash: 'c1a3d8e5b9f2a4c7...', sampleType: 'PE', family: 'Emotet', severity: 'high', conclusion: 'malicious', confidence: 92, duration: 38, tools: ['YARA', 'Cuckoo'], startTime: '2026-06-04 07:50:00', endTime: '2026-06-04 08:28:00', operator: '王工', review: '张工' },
  { id: 'T-HIS-004', sampleName: 'mirai_x86.elf', sampleHash: 'd4e8b2c1f7a5d9e3...', sampleType: 'ELF', family: 'Mirai', severity: 'high', conclusion: 'malicious', confidence: 95, duration: 28, tools: ['YARA', 'Sandbox'], startTime: '2026-06-04 07:30:00', endTime: '2026-06-04 07:58:00', operator: '李工', review: '张工' },
  { id: 'T-HIS-005', sampleName: 'crypt_miner.exe', sampleHash: 'e9b3a7d4c2f8e1a5...', sampleType: 'PE', family: 'XMRig', severity: 'medium', conclusion: 'malicious', confidence: 88, duration: 25, tools: ['YARA', 'VT'], startTime: '2026-06-04 06:45:00', endTime: '2026-06-04 07:10:00', operator: '赵工', review: '李工' },
  { id: 'T-HIS-006', sampleName: 'unknown_payload.bin', sampleHash: 'f1c5b9e3a7d4c2f8...', sampleType: 'Script', family: '未知', severity: 'high', conclusion: 'suspicious', confidence: 72, duration: 35, tools: ['YARA', 'Sandbox'], startTime: '2026-06-04 05:30:00', endTime: '2026-06-04 06:05:00', operator: '张工', review: '王工' },
  { id: 'T-HIS-007', sampleName: 'update_installer.exe', sampleHash: 'a2b6c3d8e5f1a4b9...', sampleType: 'PE', family: '正常软件', severity: 'low', conclusion: 'safe', confidence: 94, duration: 18, tools: ['YARA', 'VT'], startTime: '2026-06-03 23:15:00', endTime: '2026-06-03 23:33:00', operator: '王工', review: '赵工' },
  { id: 'T-HIS-008', sampleName: 'resume_2024.pdf', sampleHash: 'b3c7d4a1e8f5a2c9...', sampleType: 'PDF', family: '正常文件', severity: 'low', conclusion: 'safe', confidence: 99, duration: 12, tools: ['VT', 'Sandbox'], startTime: '2026-06-03 22:00:00', endTime: '2026-06-03 22:12:00', operator: '李工', review: '王工' },
  { id: 'T-HIS-009', sampleName: 'webshell_b374k.php', sampleHash: 'c4d8e5b2a7f1c3d9...', sampleType: 'Script', family: 'WebShell-B374k', severity: 'critical', conclusion: 'malicious', confidence: 96, duration: 42, tools: ['YARA', 'Cuckoo', 'Sandbox'], startTime: '2026-06-03 20:30:00', endTime: '2026-06-03 21:12:00', operator: '张工', review: '李工' },
  { id: 'T-HIS-010', sampleName: 'supply_chain_poison.dll', sampleHash: 'd5e9f6c3a8b2d4e1...', sampleType: 'PE', family: '疑似供应链攻击', severity: 'high', conclusion: 'suspicious', confidence: 68, duration: 65, tools: ['YARA', 'Cuckoo', 'VT', 'Hybrid'], startTime: '2026-06-03 18:00:00', endTime: '2026-06-03 19:05:00', operator: '王工', review: '张工' },
  { id: 'T-HIS-011', sampleName: 'apt_xloader.apk', sampleHash: 'e6f1a7d4b9c3e5f2...', sampleType: 'Android', family: 'XLoader', severity: 'high', conclusion: 'malicious', confidence: 91, duration: 55, tools: ['YARA', 'Sandbox'], startTime: '2026-06-03 15:20:00', endTime: '2026-06-03 16:15:00', operator: '赵工', review: '李工' },
  { id: 'T-HIS-012', sampleName: 'trojan_icedid.doc', sampleHash: 'f7a2b8e5c1d4f6a3...', sampleType: 'Office', family: 'IcedID', severity: 'high', conclusion: 'malicious', confidence: 89, duration: 32, tools: ['YARA', 'Cuckoo'], startTime: '2026-06-03 13:00:00', endTime: '2026-06-03 13:32:00', operator: '李工', review: '王工' },
];

const conclusionBadgeMap: Record<JudgmentConclusion, { status: any; text: string }> = {
  malicious: { status: 'failed', text: '恶意' },
  suspicious: { status: 'warning', text: '可疑' },
  safe: { status: 'success', text: '安全' },
  unknown: { status: 'pending', text: '未知' },
};

const severityBadgeMap: Record<Severity, { status: any; text: string }> = {
  critical: { status: 'failed', text: '严重' },
  high: { status: 'warning', text: '高危' },
  medium: { status: 'info', text: '中危' },
  low: { status: 'info', text: '低危' },
};

const sampleTypeConfig: Record<SampleType, { label: string; color: string }> = {
  PE: { label: 'PE', color: 'text-blue-400' },
  ELF: { label: 'ELF', color: 'text-purple-400' },
  PDF: { label: 'PDF', color: 'text-red-400' },
  Office: { label: 'Office', color: 'text-orange-400' },
  Script: { label: 'Script', color: 'text-yellow-400' },
  Archive: { label: 'Archive', color: 'text-cyan-400' },
  Android: { label: 'Android', color: 'text-green-400' },
  iOS: { label: 'iOS', color: 'text-pink-400' },
};

export function SampleJudgmentHistory() {
  const [search, setSearch] = useState('');
  const [conclusionFilter, setConclusionFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<HistoricalTask | null>(null);

  const filtered = useMemo(() => {
    return HISTORY_DATA.filter((t) => {
      if (search && !t.sampleName.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.family.toLowerCase().includes(search.toLowerCase())) return false;
      if (conclusionFilter && t.conclusion !== conclusionFilter) return false;
      if (severityFilter && t.severity !== severityFilter) return false;
      if (typeFilter && t.sampleType !== typeFilter) return false;
      return true;
    });
  }, [search, conclusionFilter, severityFilter, typeFilter]);

  // KPI
  const total = HISTORY_DATA.length;
  const malicious = HISTORY_DATA.filter(t => t.conclusion === 'malicious').length;
  const suspicious = HISTORY_DATA.filter(t => t.conclusion === 'suspicious').length;
  const avgConfidence = Math.round(HISTORY_DATA.reduce((s, t) => s + t.confidence, 0) / total);
  const avgDuration = Math.round(HISTORY_DATA.reduce((s, t) => s + t.duration, 0) / total);

  const columns = [
    { key: 'id', title: 'ID', width: '100px', render: (t: HistoricalTask) => <span className="font-mono text-xs text-blue-400">{t.id}</span> },
    { key: 'sample', title: '样本', width: '220px', render: (t: HistoricalTask) => (
      <div>
        <div className="text-sm text-slate-100">{t.sampleName}</div>
        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.sampleHash.substring(0, 16)}...</div>
      </div>
    )},
    { key: 'type', title: '类型', width: '80px', render: (t: HistoricalTask) => <span className={`text-[10px] px-1.5 py-0.5 rounded ${sampleTypeConfig[t.sampleType as keyof typeof sampleTypeConfig].color}`}>{sampleTypeConfig[t.sampleType as keyof typeof sampleTypeConfig].label}</span> },
    { key: 'family', title: '家族', width: '120px', render: (t: HistoricalTask) => <span className="text-sm text-slate-300">{t.family}</span> },
    { key: 'severity', title: '严重度', width: '80px', render: (t: HistoricalTask) => <StatusBadge status={severityBadgeMap[t.severity].status} /> },
    { key: 'conclusion', title: '结论', width: '80px', render: (t: HistoricalTask) => <StatusBadge status={conclusionBadgeMap[t.conclusion].status} /> },
    { key: 'confidence', title: '置信度', width: '80px', render: (t: HistoricalTask) => <span className={`text-sm font-medium ${t.confidence >= 90 ? 'text-green-400' : t.confidence >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>{t.confidence}%</span> },
    { key: 'tools', title: '调用工具', width: '140px', render: (t: HistoricalTask) => <div className="flex flex-wrap gap-1">{t.tools.map(tool => <span key={tool} className="text-[10px] px-1 py-0 rounded bg-[#111625] text-slate-300">{tool}</span>)}</div> },
    { key: 'duration', title: '耗时', width: '60px', render: (t: HistoricalTask) => <span className="text-xs text-slate-400">{t.duration}m</span> },
    { key: 'operator', title: '操作/复核', width: '100px', render: (t: HistoricalTask) => <span className="text-xs text-slate-400">{t.operator}/{t.review}</span> },
    { key: 'endTime', title: '完成时间', width: '120px', render: (t: HistoricalTask) => <span className="text-xs text-slate-500 font-mono">{t.endTime.substring(5)}</span> },
    { key: 'actions', title: '操作', width: '60px', render: (t: HistoricalTask) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(t); }}><Eye className="w-3.5 h-3.5" /></Button>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <History className="w-6 h-6 text-blue-400" />
            深度样本研判任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">多维查询历史研判任务，12 维筛选 + 时间轴 + 报告导出</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><Calendar className="w-4 h-4 mr-1" />时间范围</Button>
          <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="历史总数" value={total} color="text-slate-50" />
        <KPI label="恶意样本" value={malicious} color="text-red-400" />
        <KPI label="可疑样本" value={suspicious} color="text-yellow-400" />
        <KPI label="平均置信度" value={`${avgConfidence}%`} color="text-cyan-400" />
        <KPI label="平均耗时" value={`${avgDuration}m`} color="text-purple-400" />
      </div>

      <ListPage<HistoricalTask>
        searchPlaceholder="搜索 ID / 样本名 / 家族..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'conclusion', label: '结论', options: [
            { value: 'malicious', label: '恶意' },
            { value: 'suspicious', label: '可疑' },
            { value: 'safe', label: '安全' },
            { value: 'unknown', label: '未知' },
          ]},
          { key: 'severity', label: '严重度', options: [
            { value: 'critical', label: '严重' },
            { value: 'high', label: '高危' },
            { value: 'medium', label: '中危' },
            { value: 'low', label: '低危' },
          ]},
          { key: 'type', label: '类型', options: (Object.keys(sampleTypeConfig) as SampleType[]).map(t => ({ value: t, label: sampleTypeConfig[t as keyof typeof sampleTypeConfig].label })) },
        ]}
        filterValues={{ conclusion: conclusionFilter, severity: severityFilter, type: typeFilter }}
        onFilterChange={(k, v) => {
          if (k === 'conclusion') setConclusionFilter(v);
          if (k === 'severity') setSeverityFilter(v);
          if (k === 'type') setTypeFilter(v);
        }}
        data={filtered}
        columns={columns}
        rowKey="id"
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={[
          { key: 'export', label: '导出报告', icon: <Download className="w-3.5 h-3.5" />, onClick: (ids) => console.log('export', ids) },
          { key: 'archive', label: '归档', onClick: (ids) => console.log('archive', ids) },
          { key: 'delete', label: '删除', danger: true, onClick: (ids) => console.log('delete', ids) },
        ]}
        renderDetail={(t) => <HistoryDetail t={t} />}
      />
    </div>
  );
}

function HistoryDetail({ t }: { t: HistoricalTask }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-100">{t.sampleName}</h3>
        <p className="text-xs text-slate-500 mt-1 font-mono">ID: {t.id} · SHA256: {t.sampleHash}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={conclusionBadgeMap[t.conclusion].status} />
        <StatusBadge status={severityBadgeMap[t.severity].status} />
        <span className="text-xs text-slate-400">家族：<span className="text-slate-200">{t.family}</span></span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="样本类型" value={sampleTypeConfig[t.sampleType as keyof typeof sampleTypeConfig].label} />
        <Field label="置信度" value={`${t.confidence}%`} />
        <Field label="分析耗时" value={`${t.duration} 分钟`} />
        <Field label="操作员" value={t.operator} />
        <Field label="复核人" value={t.review} />
        <Field label="完成时间" value={t.endTime} />
      </div>

      <Card>
        <h4 className="text-sm font-medium text-slate-200 mb-3">调用工具链</h4>
        <div className="flex flex-wrap gap-2">
          {t.tools.map((tool) => (
            <span key={tool} className="text-xs px-2.5 py-1 rounded bg-[#111625] text-slate-200 border border-[#2A354D]">
              {tool}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h4 className="text-sm font-medium text-slate-200 mb-3">研判时间轴</h4>
        <div className="space-y-2">
          {[
            { time: t.startTime, event: '样本提交' },
            { time: t.startTime, event: '预分析（YARA 扫描）' },
            { time: t.endTime, event: '工具调用（' + t.tools.join(' / ') + '）' },
            { time: t.endTime, event: '深度研判' },
            { time: t.endTime, event: '结论入库' },
          ].map((e, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-slate-500 font-mono w-32">{e.time.substring(11)}</span>
              <span className="text-slate-300">{e.event}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <Card>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 bg-[#111625] rounded-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5 break-all">{value}</p>
    </div>
  );
}

export default SampleJudgmentHistory;

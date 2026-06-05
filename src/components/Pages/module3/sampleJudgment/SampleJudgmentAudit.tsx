'use client';

import React, { useState, useMemo } from 'react';
import { Shield, CheckCircle, XCircle, Clock, FileText, Search, Download, Eye, AlertTriangle, User, Hash } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { ListPage } from '@/components/Common/ListPage';

/**
 * 3-6-7 深度样本研判任务审计
 *
 * 审计流程：操作 → 复核 → 归档
 * 责任链：操作人/复核人/审批人
 * 证据链：操作截图/数据快照/操作日志
 */

type AuditStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
type AuditConclusion = 'malicious' | 'suspicious' | 'safe' | 'unknown';

interface AuditRecord {
  id: string;
  taskId: string;
  sampleName: string;
  sampleHash: string;
  conclusion: AuditConclusion;
  operator: string;
  reviewer: string;
  approver: string;
  status: AuditStatus;
  submitTime: string;
  reviewTime: string;
  approveTime: string;
  comment: string;
  evidenceCount: number;
  evidenceTypes: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

const AUDIT_DATA: AuditRecord[] = [
  { id: 'AUD-001', taskId: 'T-HIS-001', sampleName: 'invoice_0630.docm', sampleHash: 'a3f5c8e9...', conclusion: 'malicious', operator: '张工', reviewer: '李工', approver: '王经理', status: 'approved', submitTime: '2026-06-04 10:02:30', reviewTime: '2026-06-04 10:45:12', approveTime: '2026-06-04 11:20:00', comment: '已确认 APT-29 家族钓鱼样本，置信度 98%，处置优先级 P0', evidenceCount: 12, evidenceTypes: ['截图', '日志', '样本'], riskLevel: 'critical' },
  { id: 'AUD-002', taskId: 'T-HIS-002', sampleName: 'lockbit_ransom.exe', sampleHash: 'b7d9e2f1...', conclusion: 'malicious', operator: '李工', reviewer: '王工', approver: '王经理', status: 'approved', submitTime: '2026-06-04 09:22:18', reviewTime: '2026-06-04 10:05:30', approveTime: '2026-06-04 10:50:00', comment: 'LockBit v4 变种，需要立即下发全网 IOC 阻断规则', evidenceCount: 18, evidenceTypes: ['截图', '日志', '样本', '网络流量'], riskLevel: 'critical' },
  { id: 'AUD-003', taskId: 'T-HIS-006', sampleName: 'unknown_payload.bin', sampleHash: 'f1c5b9e3...', conclusion: 'suspicious', operator: '张工', reviewer: '王工', approver: '王经理', status: 'reviewing', submitTime: '2026-06-04 06:05:00', reviewTime: '-', approveTime: '-', comment: '可疑样本，等待深度分析结果', evidenceCount: 6, evidenceTypes: ['截图'], riskLevel: 'high' },
  { id: 'AUD-004', taskId: 'T-HIS-007', sampleName: 'update_installer.exe', sampleHash: 'a2b6c3d8...', conclusion: 'safe', operator: '王工', reviewer: '赵工', approver: '王经理', status: 'approved', submitTime: '2026-06-03 23:33:00', reviewTime: '2026-06-04 08:00:00', approveTime: '2026-06-04 09:00:00', comment: '正常软件，已通过白名单验证，列入白名单库', evidenceCount: 8, evidenceTypes: ['截图', '签名验证'], riskLevel: 'low' },
  { id: 'AUD-005', taskId: 'T-HIS-010', sampleName: 'supply_chain_poison.dll', sampleHash: 'd5e9f6c3...', conclusion: 'suspicious', operator: '王工', reviewer: '张工', approver: '王经理', status: 'pending', submitTime: '2026-06-03 19:05:00', reviewTime: '-', approveTime: '-', comment: '供应链攻击可疑，需要更多家族聚类数据', evidenceCount: 4, evidenceTypes: ['截图'], riskLevel: 'high' },
  { id: 'AUD-006', taskId: 'T-HIS-009', sampleName: 'webshell_b374k.php', sampleHash: 'c4d8e5b2...', conclusion: 'malicious', operator: '张工', reviewer: '李工', approver: '王经理', status: 'approved', submitTime: '2026-06-03 21:12:00', reviewTime: '2026-06-03 22:00:00', approveTime: '2026-06-03 22:30:00', comment: 'WebShell 后门，关联到 APT-28 攻击组织', evidenceCount: 15, evidenceTypes: ['截图', '日志', '样本', '网络流量'], riskLevel: 'critical' },
  { id: 'AUD-007', taskId: 'T-HIS-011', sampleName: 'apt_xloader.apk', sampleHash: 'e6f1a7d4...', conclusion: 'malicious', operator: '赵工', reviewer: '李工', approver: '王经理', status: 'approved', submitTime: '2026-06-03 16:15:00', reviewTime: '2026-06-03 17:00:00', approveTime: '2026-06-03 17:45:00', comment: 'XLoader Android 木马，需加入移动威胁库', evidenceCount: 10, evidenceTypes: ['截图', '样本'], riskLevel: 'high' },
  { id: 'AUD-008', taskId: 'T-HIS-008', sampleName: 'resume_2024.pdf', sampleHash: 'b3c7d4a1...', conclusion: 'safe', operator: '李工', reviewer: '王工', approver: '王经理', status: 'rejected', submitTime: '2026-06-03 22:12:00', reviewTime: '2026-06-04 08:30:00', approveTime: '2026-06-04 09:15:00', comment: '安全判定置信度不足，建议加入可疑名单继续观察', evidenceCount: 5, evidenceTypes: ['截图'], riskLevel: 'low' },
  { id: 'AUD-009', taskId: 'T-HIS-004', sampleName: 'mirai_x86.elf', sampleHash: 'd4e8b2c1...', conclusion: 'malicious', operator: '李工', reviewer: '张工', approver: '王经理', status: 'archived', submitTime: '2026-06-04 07:58:00', reviewTime: '2026-06-04 08:20:00', approveTime: '2026-06-04 08:50:00', comment: 'Mirai 僵尸网络样本，已归档至历史库', evidenceCount: 9, evidenceTypes: ['截图', '日志'], riskLevel: 'high' },
  { id: 'AUD-010', taskId: 'T-HIS-005', sampleName: 'crypt_miner.exe', sampleHash: 'e9b3a7d4...', conclusion: 'malicious', operator: '赵工', reviewer: '李工', approver: '王经理', status: 'pending', submitTime: '2026-06-04 07:10:00', reviewTime: '-', approveTime: '-', comment: '挖矿木马，等待复核', evidenceCount: 7, evidenceTypes: ['截图', '日志'], riskLevel: 'medium' },
];

const statusBadgeMap: Record<AuditStatus, { status: any; text: string }> = {
  pending: { status: 'pending', text: '待复核' },
  reviewing: { status: 'running', text: '复核中' },
  approved: { status: 'success', text: '已通过' },
  rejected: { status: 'failed', text: '已驳回' },
  archived: { status: 'info', text: '已归档' },
};

const conclusionBadgeMap: Record<AuditConclusion, { status: any; text: string }> = {
  malicious: { status: 'failed', text: '恶意' },
  suspicious: { status: 'warning', text: '可疑' },
  safe: { status: 'success', text: '安全' },
  unknown: { status: 'pending', text: '未知' },
};

const riskBadgeMap: Record<'critical' | 'high' | 'medium' | 'low', { status: any; text: string }> = {
  critical: { status: 'failed', text: '严重' },
  high: { status: 'warning', text: '高危' },
  medium: { status: 'info', text: '中危' },
  low: { status: 'info', text: '低危' },
};

export function SampleJudgmentAudit() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [conclusionFilter, setConclusionFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<AuditRecord | null>(null);

  const filtered = useMemo(() => {
    return AUDIT_DATA.filter((a) => {
      if (search && !a.id.toLowerCase().includes(search.toLowerCase()) && !a.sampleName.toLowerCase().includes(search.toLowerCase()) && !a.operator.includes(search)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (conclusionFilter && a.conclusion !== conclusionFilter) return false;
      return true;
    });
  }, [search, statusFilter, conclusionFilter]);

  // KPI
  const total = AUDIT_DATA.length;
  const pending = AUDIT_DATA.filter(a => a.status === 'pending').length;
  const reviewing = AUDIT_DATA.filter(a => a.status === 'reviewing').length;
  const approved = AUDIT_DATA.filter(a => a.status === 'approved').length;
  const rejected = AUDIT_DATA.filter(a => a.status === 'rejected').length;

  const columns = [
    { key: 'id', title: '审计 ID', width: '100px', render: (a: AuditRecord) => <span className="font-mono text-xs text-blue-400">{a.id}</span> },
    { key: 'task', title: '关联任务', width: '120px', render: (a: AuditRecord) => <span className="font-mono text-xs text-slate-300">{a.taskId}</span> },
    { key: 'sample', title: '样本', width: '180px', render: (a: AuditRecord) => (
      <div>
        <div className="text-sm text-slate-100">{a.sampleName}</div>
        <div className="text-[10px] text-slate-500 font-mono">{a.sampleHash}...</div>
      </div>
    )},
    { key: 'conclusion', title: '结论', width: '80px', render: (a: AuditRecord) => <StatusBadge status={conclusionBadgeMap[a.conclusion].status} /> },
    { key: 'risk', title: '风险', width: '70px', render: (a: AuditRecord) => <StatusBadge status={riskBadgeMap[a.riskLevel].status} /> },
    { key: 'operator', title: '操作人', width: '80px', render: (a: AuditRecord) => <span className="text-xs text-slate-300 flex items-center gap-1"><User className="w-3 h-3" />{a.operator}</span> },
    { key: 'reviewer', title: '复核人', width: '80px', render: (a: AuditRecord) => <span className="text-xs text-slate-300">{a.reviewer}</span> },
    { key: 'approver', title: '审批人', width: '90px', render: (a: AuditRecord) => <span className="text-xs text-slate-300">{a.approver}</span> },
    { key: 'status', title: '状态', width: '90px', render: (a: AuditRecord) => <StatusBadge status={statusBadgeMap[a.status].status} /> },
    { key: 'evidence', title: '证据', width: '60px', render: (a: AuditRecord) => <span className="text-sm text-cyan-400">{a.evidenceCount}</span> },
    { key: 'submitTime', title: '提交时间', width: '120px', render: (a: AuditRecord) => <span className="text-xs text-slate-500 font-mono">{a.submitTime.substring(5)}</span> },
    { key: 'actions', title: '操作', width: '60px', render: (a: AuditRecord) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(a); }}><Eye className="w-3.5 h-3.5" /></Button>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            深度样本研判任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">审计 + 复核 + 归档全流程，记录责任链与证据链</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出审计</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="审计总数" value={total} color="text-slate-50" icon={FileText} />
        <KPI label="待复核" value={pending} color="text-yellow-400" icon={Clock} />
        <KPI label="复核中" value={reviewing} color="text-blue-400" icon={Eye} />
        <KPI label="已通过" value={approved} color="text-green-400" icon={CheckCircle} />
        <KPI label="已驳回" value={rejected} color="text-red-400" icon={XCircle} />
      </div>

      <ListPage<AuditRecord>
        searchPlaceholder="搜索 ID / 样本名 / 操作人..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'status', label: '状态', options: (Object.keys(statusBadgeMap) as AuditStatus[]).map(s => ({ value: s, label: statusBadgeMap[s].text })) },
          { key: 'conclusion', label: '结论', options: [
            { value: 'malicious', label: '恶意' },
            { value: 'suspicious', label: '可疑' },
            { value: 'safe', label: '安全' },
            { value: 'unknown', label: '未知' },
          ]},
        ]}
        filterValues={{ status: statusFilter, conclusion: conclusionFilter }}
        onFilterChange={(k, v) => {
          if (k === 'status') setStatusFilter(v);
          if (k === 'conclusion') setConclusionFilter(v);
        }}
        data={filtered}
        columns={columns}
        rowKey="id"
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={[
          { key: 'approve', label: '批量通过', icon: <CheckCircle className="w-3.5 h-3.5" />, onClick: (ids) => console.log('approve', ids) },
          { key: 'reject', label: '批量驳回', icon: <XCircle className="w-3.5 h-3.5" />, danger: true, onClick: (ids) => console.log('reject', ids) },
          { key: 'archive', label: '批量归档', onClick: (ids) => console.log('archive', ids) },
        ]}
        renderDetail={(a) => <AuditDetail a={a} />}
      />
    </div>
  );
}

function AuditDetail({ a }: { a: AuditRecord }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-100">{a.sampleName}</h3>
        <p className="text-xs text-slate-500 mt-1 font-mono">审计 ID: {a.id} · 任务: {a.taskId} · SHA256: {a.sampleHash}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={statusBadgeMap[a.status].status} />
        <StatusBadge status={conclusionBadgeMap[a.conclusion].status} />
        <StatusBadge status={riskBadgeMap[a.riskLevel].status} />
      </div>

      <p className="text-sm text-slate-300 bg-[#111625] p-3 rounded-lg border-l-2 border-blue-500">
        💬 {a.comment}
      </p>

      <Card>
        <h4 className="text-sm font-medium text-slate-200 mb-3">责任链</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 w-16">操作人</span>
            <span className="text-slate-100">{a.operator}</span>
            <span className="text-xs text-slate-500 ml-2">{a.submitTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 w-16">复核人</span>
            <span className="text-slate-100">{a.reviewer}</span>
            <span className="text-xs text-slate-500 ml-2">{a.reviewTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-slate-400 w-16">审批人</span>
            <span className="text-slate-100">{a.approver}</span>
            <span className="text-xs text-slate-500 ml-2">{a.approveTime}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-400" />证据链
          <span className="text-[10px] text-slate-500">（{a.evidenceCount} 项）</span>
        </h4>
        <div className="space-y-2">
          {a.evidenceTypes.map((type, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-[#111625] rounded">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-sm text-slate-300 flex-1">{type} #{idx + 1}</span>
              <Button variant="ghost" size="sm">下载</Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-2 pt-3 border-t border-[#2A354D]">
        <Button variant="secondary">导出报告</Button>
        {a.status === 'pending' && (
          <>
            <Button variant="danger">驳回</Button>
            <Button variant="primary">通过</Button>
          </>
        )}
      </div>
    </div>
  );
}

function KPI({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </Card>
  );
}

export default SampleJudgmentAudit;

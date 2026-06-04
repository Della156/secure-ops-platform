'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, Shield, Activity, User, FileText, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface VirusAudit {
  id: string;
  virusId: string;
  virusName: string;
  host: string;
  auditType: 'detection' | 'isolation' | 'cleanup' | 'rollback';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
  operator: string;
  operatorIp: string;
  reviewer?: string;
  approver?: string;
  auditTime: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  finding: string;
  evidenceChain: string[];
}

const AUDITS: VirusAudit[] = [
  { id: 'VDA-2026-501', virusId: 'VDH-20260604001', virusName: 'LockBit v4', host: 'HOST-FIN-007', auditType: 'isolation', status: 'reviewing', operator: '安全-张工', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-06-04 11:30:00', riskLevel: 'critical', finding: '勒索病毒隔离，等待高级分析师复核处置方案', evidenceChain: ['EDR 告警', '样本分析', 'C2 通信', 'YARA 匹配', '家族聚类'] },
  { id: 'VDA-2026-500', virusId: 'VDH-20260603005', virusName: 'Emotet', host: 'HOST-FIN-002', auditType: 'cleanup', status: 'approved', operator: '安全-陈工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 23:00:00', riskLevel: 'high', finding: '木马已完全清除，系统恢复', evidenceChain: ['文件扫描', '注册表', '进程检查', '网络流量'] },
  { id: 'VDA-2026-499', virusId: 'VDH-20260603006', virusName: 'AgentTesla', host: 'HOST-DEV-008', auditType: 'detection', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 21:00:00', riskLevel: 'high', finding: '间谍软件检测确认，特征匹配', evidenceChain: ['进程行为', '网络流量', '文件 hash'] },
  { id: 'VDA-2026-498', virusId: 'VDH-20260602008', virusName: 'XLoader', host: 'HOST-DEV-014', auditType: 'rollback', status: 'rejected', operator: '安全-张工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 15:00:00', riskLevel: 'high', finding: '回滚原因：重复样本，已存在处置记录', evidenceChain: ['样本 hash 重复'] },
  { id: 'VDA-2026-497', virusId: 'VDH-20260601010', virusName: 'WannaCry', host: 'HOST-DEV-011', auditType: 'cleanup', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-06-01 04:00:00', riskLevel: 'critical', finding: '蠕虫已清除，系统补丁已安装', evidenceChain: ['补丁检查', '文件清理', '系统恢复'] },
  { id: 'VDA-2026-496', virusId: 'VDH-20260604003', virusName: 'Cobalt Strike', host: 'HOST-DB-007', auditType: 'detection', status: 'pending', operator: '安全-陈工', operatorIp: '10.20.30.45', auditTime: '2026-06-04 10:00:00', riskLevel: 'critical', finding: 'APT 后门检测，待复核处置方案', evidenceChain: ['EDR 告警'] },
  { id: 'VDA-2026-495', virusId: 'VDH-20260601009', virusName: 'FormBook', host: 'HOST-DEV-005', auditType: 'cleanup', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-01 23:00:00', riskLevel: 'medium', finding: '间谍软件已清理', evidenceChain: ['进程清理', '注册表', '网络流量'] },
];

const TYPE_LABEL: Record<VirusAudit['auditType'], { label: string; color: string }> = {
  detection: { label: '检测审计', color: 'bg-blue-500/20 text-blue-400' },
  isolation: { label: '隔离审计', color: 'bg-orange-500/20 text-orange-400' },
  cleanup: { label: '清除审计', color: 'bg-green-500/20 text-green-400' },
  rollback: { label: '回滚审计', color: 'bg-red-500/20 text-red-400' },
};

const STATUS_MAP = {
  pending: { status: 'pending', text: '待复核' },
  reviewing: { status: 'running', text: '复核中' },
  approved: { status: 'success', text: '已通过' },
  rejected: { status: 'failed', text: '已驳回' },
  archived: { status: 'info', text: '已归档' },
};

const RISK_MAP = {
  low: { status: 'success', text: '低' },
  medium: { status: 'info', text: '中' },
  high: { status: 'warning', text: '高' },
  critical: { status: 'failed', text: '严重' },
};

const COLUMNS = [
  { key: 'id', title: '审计 ID', width: '130px', render: (r: VirusAudit) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'virusName', title: '病毒/主机', render: (r: VirusAudit) => <div><p className="text-sm text-slate-100">{r.virusName}</p><p className="text-[10px] text-slate-500">{r.host} · {r.virusId}</p></div> },
  { key: 'type', title: '类型', width: '90px', render: (r: VirusAudit) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: VirusAudit) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'risk', title: '风险', width: '70px', render: (r: VirusAudit) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'operator', title: '操作人', width: '100px', render: (r: VirusAudit) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: VirusAudit) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 3-10-7 病毒处置 - 任务审计
 *
 * 100% 复用 ListPage 共享组件
 */
export function VirusDisposalAudit() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => ({
    total: AUDITS.length,
    pending: AUDITS.filter((a) => a.status === 'pending').length,
    reviewing: AUDITS.filter((a) => a.status === 'reviewing').length,
    approved: AUDITS.filter((a) => a.status === 'approved').length,
    rejected: AUDITS.filter((a) => a.status === 'rejected').length,
  }), []);

  const statusPie = [
    { name: '待复核', value: stats.pending, color: '#6B7280' },
    { name: '复核中', value: stats.reviewing, color: '#3B82F6' },
    { name: '已通过', value: stats.approved, color: '#22C55E' },
    { name: '已驳回', value: stats.rejected, color: '#EF4444' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            病毒处置任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">检测/隔离/清除/回滚审计 · 责任链完整追溯</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出审计</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="审计总数" value={stats.total} color="text-blue-400" />
        <KPI label="待复核" value={stats.pending} color="text-slate-400" />
        <KPI label="复核中" value={stats.reviewing} color="text-blue-400" />
        <KPI label="已通过" value={stats.approved} color="text-green-400" />
        <KPI label="已驳回" value={stats.rejected} color="text-red-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3">审计状态分布</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2} label={({ name, value }: any) => `${name} ${value}`}>
              {statusPie.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<VirusAudit>
        searchPlaceholder="搜索 ID / 病毒名 / 操作人..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'status', label: '状态', options: [
          { value: 'all', label: '全部' },
          { value: 'pending', label: '待复核' },
          { value: 'reviewing', label: '复核中' },
          { value: 'approved', label: '已通过' },
          { value: 'rejected', label: '已驳回' },
          { value: 'archived', label: '已归档' },
        ]}]}
        filterValues={{ status: statusFilter }}
        onFilterChange={(_, v) => setStatusFilter(v)}
        data={AUDITS}
        columns={COLUMNS}
        rowKey="id"
        detailWidth="max-w-2xl"
        renderDetail={(r) => (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">{r.id}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
              <StatusBadge status={RISK_MAP[r.riskLevel].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.virusName}</h3>
            <p className="text-xs text-slate-500">主机: {r.host} · {r.virusId}</p>

            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-400 mb-1">审计发现</p>
              <p className="text-sm text-slate-200">{r.finding}</p>
            </div>

            <Card>
              <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />责任链
              </h4>
              <div className="space-y-2">
                <ChainStep role="操作人" name={r.operator} detail={`IP: ${r.operatorIp}`} color="bg-blue-500" />
                <ChainStep role="复核人" name={r.reviewer || '未指派'} detail="已审核" color="bg-purple-500" />
                <ChainStep role="审批人" name={r.approver || '未指派'} detail={r.approver ? '已审批' : '待审批'} color="bg-cyan-500" />
              </div>
            </Card>

            <Card>
              <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />证据链（{r.evidenceChain.length} 项）
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {r.evidenceChain.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-[#111625] rounded text-xs">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span className="text-slate-300">{e}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Field label="审计时间" value={r.auditTime} />
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

function ChainStep({ role, name, detail, color }: { role: string; name: string; detail: string; color: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-[#111625] rounded">
      <div className={`w-1 h-8 rounded-full ${color}`} />
      <div className="flex-1">
        <p className="text-xs text-slate-500">{role}</p>
        <p className="text-sm text-slate-200">{name}</p>
      </div>
      <p className="text-[10px] text-slate-500">{detail}</p>
    </div>
  );
}

export default VirusDisposalAudit;

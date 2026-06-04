'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, Target, User, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface TraceAudit {
  id: string;
  traceId: string;
  traceName: string;
  auditType: 'analysis' | 'evidence' | 'attribution' | 'rollback';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
  operator: string;
  operatorIp: string;
  reviewer?: string;
  approver?: string;
  auditTime: string;
  confidence: number;
  depth: number;
  finding: string;
  evidenceChain: string[];
}

const AUDITS: TraceAudit[] = [
  { id: 'TRA-2026-201', traceId: 'TRH-20260604001', traceName: 'LockBit 攻击溯源', auditType: 'attribution', status: 'reviewing', operator: '安全-王工', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-06-04 11:30:00', confidence: 96, depth: 7, finding: '攻击者归因：LockBit v4，置信度 96%，待高级分析师复核', evidenceChain: ['样本分析', 'C2 通信', 'TTP 匹配', '家族聚类', '威胁情报'] },
  { id: 'TRA-2026-200', traceId: 'TRH-20260603003', traceName: '数据外泄溯源', auditType: 'evidence', status: 'approved', operator: '安全-陈工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 16:00:00', confidence: 88, depth: 5, finding: '证据链完整，已成功定位外泄通道', evidenceChain: ['DLP 告警', '网络流量', '主机日志', '数据库审计'] },
  { id: 'TRA-2026-199', traceId: 'TRH-20260601005', traceName: 'WebShell 入侵溯源', auditType: 'rollback', status: 'rejected', operator: '安全-张工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-01 16:00:00', confidence: 0, depth: 0, finding: '回滚原因：取证数据缺失，已重新发起补充取证', evidenceChain: ['失败日志'] },
  { id: 'TRA-2026-198', traceId: 'TRH-20260602004', traceName: '挖矿木马感染溯源', auditType: 'analysis', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 19:00:00', confidence: 92, depth: 4, finding: '挖矿木马分析完成，XMRig 家族确认', evidenceChain: ['进程分析', '网络流量', '样本分析'] },
  { id: 'TRA-2026-197', traceId: 'TRH-20260530007', traceName: '供应链攻击溯源', auditType: 'attribution', status: 'approved', operator: '安全-王工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-05-30 18:00:00', confidence: 95, depth: 8, finding: '攻击者归因：APT-29，供应链入侵点已定位', evidenceChain: ['样本分析', 'TTP 匹配', 'IOC 关联', '家族聚类', '威胁情报', '时间线'] },
  { id: 'TRA-2026-196', traceId: 'TRH-20260528009', traceName: 'APT 后门溯源', auditType: 'rollback', status: 'rejected', operator: '安全-陈工', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-05-28 16:00:00', confidence: 0, depth: 0, finding: '回滚原因：数据冲突，已重生成', evidenceChain: ['冲突记录'] },
  { id: 'TRA-2026-195', traceId: 'TRH-20260527010', traceName: 'Cobalt Strike 溯源', auditType: 'evidence', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-05-27 18:00:00', confidence: 94, depth: 6, finding: '证据链已归档 30 天', evidenceChain: ['C2 通信', '样本分析', 'TTP 匹配'] },
];

const TYPE_LABEL: Record<TraceAudit['auditType'], { label: string; color: string }> = {
  analysis: { label: '分析审计', color: 'bg-blue-500/20 text-blue-400' },
  evidence: { label: '证据审计', color: 'bg-green-500/20 text-green-400' },
  attribution: { label: '归因审计', color: 'bg-purple-500/20 text-purple-400' },
  rollback: { label: '回滚审计', color: 'bg-red-500/20 text-red-400' },
};

const STATUS_MAP = {
  pending: { status: 'pending', text: '待复核' },
  reviewing: { status: 'running', text: '复核中' },
  approved: { status: 'success', text: '已通过' },
  rejected: { status: 'failed', text: '已驳回' },
  archived: { status: 'info', text: '已归档' },
};

const COLUMNS = [
  { key: 'id', title: '审计 ID', width: '130px', render: (r: TraceAudit) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'traceName', title: '溯源任务', render: (r: TraceAudit) => <div><p className="text-sm text-slate-100">{r.traceName}</p><p className="text-[10px] text-slate-500">{r.traceId}</p></div> },
  { key: 'type', title: '类型', width: '90px', render: (r: TraceAudit) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: TraceAudit) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'confidence', title: '置信度', width: '80px', render: (r: TraceAudit) => <span className={`text-xs ${r.confidence >= 90 ? 'text-green-400' : r.confidence >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{r.confidence}%</span> },
  { key: 'depth', title: '深度', width: '70px', render: (r: TraceAudit) => <span className="text-xs text-cyan-400">{r.depth} 层</span> },
  { key: 'operator', title: '操作人', width: '100px', render: (r: TraceAudit) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: TraceAudit) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 3-16-7 溯源报告 - 任务审计
 *
 * 100% 复用 ListPage 共享组件
 */
export function TraceReportAudit() {
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
            <Target className="w-6 h-6 text-blue-400" />
            溯源报告任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">分析/证据/归因/回滚审计 · 责任链完整追溯</p>
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

      <ListPage<TraceAudit>
        searchPlaceholder="搜索 ID / 溯源名 / 操作人..."
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
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.traceName}</h3>
            <p className="text-xs text-slate-500">{r.traceId}</p>

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
                <Activity className="w-3.5 h-3.5" />证据链（{r.evidenceChain.length} 项）
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {r.evidenceChain.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-[#111625] rounded text-xs">
                    <CheckCircle className="w-3 h-3 text-cyan-400" />
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

export default TraceReportAudit;

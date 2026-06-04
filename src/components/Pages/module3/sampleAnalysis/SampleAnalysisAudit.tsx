'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, Shield, Activity, User, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SampleAudit {
  id: string;
  sampleId: string;
  sampleName: string;
  auditType: 'verdict' | 'family' | 'iocs' | 'compliance';
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

const AUDITS: SampleAudit[] = [
  { id: 'SAA-2026-601', sampleId: 'SAH-20260604001', sampleName: 'APT-29 phishing kit', auditType: 'verdict', status: 'reviewing', operator: '安全-张工', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-06-04 11:30:00', riskLevel: 'critical', finding: '研判结论：恶意，等待高级分析师复核', evidenceChain: ['YARA 匹配', 'VT 检测', 'Cuckoo 沙箱报告', 'Hybrid Analysis', '家族聚类'] },
  { id: 'SAA-2026-600', sampleId: 'SAH-20260604002', sampleName: 'LockBit v4 ransomware', auditType: 'verdict', status: 'approved', operator: '安全-陈工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-04 09:00:00', riskLevel: 'critical', finding: '恶意样本确认，已加入 IOC 库', evidenceChain: ['多引擎检测', 'Cuckoo 行为', '网络流量', '勒索通信'] },
  { id: 'SAA-2026-599', sampleId: 'SAH-20260603005', sampleName: 'CVE-2026-1234 exploit', auditType: 'iocs', status: 'approved', operator: '安全-王工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 23:00:00', riskLevel: 'critical', finding: 'IOC 已提取并下发', evidenceChain: ['文件 hash', 'C2 IP', 'C2 域名', 'YARA 规则'] },
  { id: 'SAA-2026-598', sampleId: 'SAH-20260603006', sampleName: 'WebShell b374k', auditType: 'family', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 21:00:00', riskLevel: 'high', finding: '家族归属：WebShell-B374k，置信度 96%', evidenceChain: ['代码相似度', '行为特征', '家族聚类'] },
  { id: 'SAA-2026-597', sampleId: 'SAH-20260602008', sampleName: 'XLoader Android', auditType: 'compliance', status: 'rejected', operator: '安全-张工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 15:00:00', riskLevel: 'high', finding: '回滚原因：重复样本，已有研判结论', evidenceChain: ['样本 hash 重复'] },
  { id: 'SAA-2026-596', sampleId: 'SAH-20260601009', sampleName: 'suspicious_doc.pdf', auditType: 'verdict', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-06-01 23:00:00', riskLevel: 'medium', finding: '可疑样本，已加入待观察名单', evidenceChain: ['PDF 结构', 'JS 代码', 'URL 检查'] },
  { id: 'SAA-2026-595', sampleId: 'SAH-20260604003', sampleName: 'JC-001 汇总报告', auditType: 'family', status: 'pending', operator: '安全-陈工', operatorIp: '10.20.30.45', auditTime: '2026-06-04 10:00:00', riskLevel: 'high', finding: '工具调用失败，等待重试', evidenceChain: ['失败日志'] },
];

const TYPE_LABEL: Record<SampleAudit['auditType'], { label: string; color: string }> = {
  verdict: { label: '结论审计', color: 'bg-red-500/20 text-red-400' },
  family: { label: '家族审计', color: 'bg-orange-500/20 text-orange-400' },
  iocs: { label: 'IOC 审计', color: 'bg-blue-500/20 text-blue-400' },
  compliance: { label: '合规审计', color: 'bg-purple-500/20 text-purple-400' },
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
  { key: 'id', title: '审计 ID', width: '130px', render: (r: SampleAudit) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'sampleName', title: '样本', render: (r: SampleAudit) => <div><p className="text-sm text-slate-100">{r.sampleName}</p><p className="text-[10px] text-slate-500">{r.sampleId}</p></div> },
  { key: 'type', title: '类型', width: '90px', render: (r: SampleAudit) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: SampleAudit) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'risk', title: '风险', width: '70px', render: (r: SampleAudit) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'operator', title: '操作人', width: '100px', render: (r: SampleAudit) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: SampleAudit) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 3-13-7 样本分析 - 任务审计
 *
 * 100% 复用 ListPage 共享组件
 */
export function SampleAnalysisAudit() {
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
            样本分析任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">结论/家族/IOC/合规审计 · 责任链完整追溯</p>
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

      <ListPage<SampleAudit>
        searchPlaceholder="搜索 ID / 样本名 / 操作人..."
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
            <h3 className="text-base font-semibold text-slate-100">{r.sampleName}</h3>
            <p className="text-xs text-slate-500">{r.sampleId}</p>

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

export default SampleAnalysisAudit;

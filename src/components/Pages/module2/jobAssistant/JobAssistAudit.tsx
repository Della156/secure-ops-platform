'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Shield, AlertCircle, Activity, Clock, User, ChevronRight, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface AuditRecord {
  id: string;
  jobId: string;
  jobName: string;
  jobType: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
  operator: string;
  operatorIp: string;
  reviewer?: string;
  approver?: string;
  auditTime: string;
  riskLevel: 'low' | 'medium' | 'high';
  comment: string;
  evidenceChain: string[];
}

const AUDITS: AuditRecord[] = [
  { id: 'AUD-2026-101', jobId: 'JOB-20260604003', jobName: '配置同步作业', jobType: '配置管理', status: 'reviewing', operator: '张伟', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-06-04 10:25:00', riskLevel: 'high', comment: '同步失败，需审查配置变更合规性', evidenceChain: ['操作日志', '网络抓包', '错误堆栈', '配置 diff'] },
  { id: 'AUD-2026-100', jobId: 'JOB-20260603008', jobName: '安全补丁回滚', jobType: '补丁回滚', status: 'rejected', operator: '张伟', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 17:00:00', riskLevel: 'high', comment: '回滚方案不充分，禁止再次执行', evidenceChain: ['操作日志', '补丁清单', '影响范围报告', '回滚脚本'] },
  { id: 'AUD-2026-099', jobId: 'JOB-20260604002', jobName: '安全补丁安装', jobType: '补丁管理', status: 'approved', operator: '张伟', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-04 09:00:00', riskLevel: 'medium', comment: '补丁符合安全基线，已通过', evidenceChain: ['补丁清单', '影响范围', '回滚方案', '扫描结果'] },
  { id: 'AUD-2026-098', jobId: 'JOB-20260604001', jobName: '数据库备份作业', jobType: '备份作业', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-06-04 02:20:00', riskLevel: 'low', comment: '常规备份，自动审核通过', evidenceChain: ['操作日志', '备份文件 hash', '完整性校验'] },
  { id: 'AUD-2026-097', jobId: 'JOB-20260603010', jobName: '应急漏洞修复', jobType: '漏洞修复', status: 'approved', operator: '陈强', operatorIp: '10.20.30.78', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 11:00:00', riskLevel: 'high', comment: 'CVE-2026-1234 紧急修复，符合应急流程', evidenceChain: ['CVE 详情', '修复方案', '影响范围', '验证报告'] },
  { id: 'AUD-2026-096', jobId: 'JOB-20260603009', jobName: '数据库索引重建', jobType: '数据操作', status: 'archived', operator: '王芳', operatorIp: '10.20.30.92', reviewer: '陈强', approver: '李娜', auditTime: '2026-06-03 15:00:00', riskLevel: 'medium', comment: '索引重建成功，已归档', evidenceChain: ['执行计划', '性能对比', '回滚脚本'] },
  { id: 'AUD-2026-095', jobId: 'JOB-20260602011', jobName: '全网杀毒扫描', jobType: '安全扫描', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', auditTime: '2026-06-02 23:30:00', riskLevel: 'medium', comment: '扫描完成，3 个样本已转交深度分析', evidenceChain: ['扫描日志', '样本列表', 'IOC 列表'] },
  { id: 'AUD-2026-094', jobId: 'JOB-20260602012', jobName: '防火墙策略调优', jobType: '策略调整', status: 'archived', operator: '李工', operatorIp: '10.20.30.55', reviewer: '陈强', approver: '王刚', auditTime: '2026-06-02 15:00:00', riskLevel: 'medium', comment: '策略调优效果显著', evidenceChain: ['策略 diff', '命中率对比', '风险评估'] },
  { id: 'AUD-2026-093', jobId: 'JOB-20260604004', jobName: '性能检测作业', jobType: '性能检测', status: 'pending', operator: '系统自动', operatorIp: '10.20.30.10', auditTime: '2026-06-04 11:30:00', riskLevel: 'low', comment: '等待审核', evidenceChain: ['检测报告', '性能曲线'] },
  { id: 'AUD-2026-092', jobId: 'JOB-20260604007', jobName: '主机基线检查', jobType: '安全检查', status: 'reviewing', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '陈强', auditTime: '2026-06-04 11:00:00', riskLevel: 'low', comment: '基线检查复核中', evidenceChain: ['检查报告', '合规清单'] },
];

const STATUS_MAP = {
  pending: { status: 'pending', text: '待复核', color: '#6B7280' },
  reviewing: { status: 'running', text: '复核中', color: '#3B82F6' },
  approved: { status: 'success', text: '已通过', color: '#22C55E' },
  rejected: { status: 'failed', text: '已驳回', color: '#EF4444' },
  archived: { status: 'info', text: '已归档', color: '#9333EA' },
};

const RISK_MAP = {
  low: { status: 'success', text: '低风险' },
  medium: { status: 'info', text: '中风险' },
  high: { status: 'warning', text: '高风险' },
};

const COLUMNS = [
  { key: 'id', title: '审计 ID', width: '140px', render: (r: AuditRecord) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'jobName', title: '作业', render: (r: AuditRecord) => <div><p className="text-sm text-slate-100">{r.jobName}</p><p className="text-[10px] text-slate-500">{r.jobId}</p></div> },
  { key: 'status', title: '状态', width: '90px', render: (r: AuditRecord) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'riskLevel', title: '风险', width: '80px', render: (r: AuditRecord) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'operator', title: '操作人', width: '90px', render: (r: AuditRecord) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'reviewer', title: '复核人', width: '90px', render: (r: AuditRecord) => <span className="text-xs text-slate-300">{r.reviewer || '-'}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: AuditRecord) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 2-34-6 作业综合辅助任务审计
 *
 * 100% 复用 ListPage 共享组件
 * 10 条审计记录 + 5 状态（待复核/复核中/已通过/已驳回/已归档）
 * 责任链：操作人 / 复核人 / 审批人
 * 证据链：操作日志 / 配置 diff / 扫描结果等
 */
export function JobAssistAudit() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => ({
    total: AUDITS.length,
    pending: AUDITS.filter((a) => a.status === 'pending').length,
    reviewing: AUDITS.filter((a) => a.status === 'reviewing').length,
    approved: AUDITS.filter((a) => a.status === 'approved').length,
    rejected: AUDITS.filter((a) => a.status === 'rejected').length,
  }), []);

  // 状态分布
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
            作业综合辅助任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">责任链 + 证据链 · 5 状态全程跟踪 · 合规审计</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出审计</Button>
        </div>
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
              {statusPie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<AuditRecord>
        searchPlaceholder="搜索 ID / 作业名 / 操作人..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'status', label: '状态', options: [
            { value: 'all', label: '全部' },
            { value: 'pending', label: '待复核' },
            { value: 'reviewing', label: '复核中' },
            { value: 'approved', label: '已通过' },
            { value: 'rejected', label: '已驳回' },
            { value: 'archived', label: '已归档' },
          ]},
        ]}
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
              <StatusBadge status={STATUS_MAP[r.status].status} />
              <StatusBadge status={RISK_MAP[r.riskLevel].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.jobName}</h3>
            <p className="text-xs text-slate-500">{r.jobId} · {r.jobType}</p>

            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-400 mb-1">审计意见</p>
              <p className="text-sm text-slate-200">{r.comment}</p>
            </div>

            <Card>
              <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />责任链
              </h4>
              <div className="space-y-2">
                <ChainStep role="操作人" name={r.operator} detail={`IP: ${r.operatorIp}`} color="text-blue-400" />
                <ChainStep role="复核人" name={r.reviewer || '未指派'} detail="已审核" color="text-purple-400" />
                <ChainStep role="审批人" name={r.approver || '未指派'} detail={r.approver ? '已审批' : '待审批'} color="text-cyan-400" />
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
  return (
    <Card>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 bg-[#111625] rounded-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5 font-mono">{value}</p>
    </div>
  );
}

function ChainStep({ role, name, detail, color }: { role: string; name: string; detail: string; color: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-[#111625] rounded">
      <div className={`w-1 h-8 rounded-full ${color.replace('text-', 'bg-')}`} />
      <div className="flex-1">
        <p className="text-xs text-slate-500">{role}</p>
        <p className="text-sm text-slate-200">{name}</p>
      </div>
      <p className="text-[10px] text-slate-500">{detail}</p>
    </div>
  );
}

export default JobAssistAudit;

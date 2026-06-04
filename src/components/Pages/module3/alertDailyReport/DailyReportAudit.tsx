'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, User, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportAudit {
  id: string;
  reportId: string;
  reportName: string;
  auditType: 'generation' | 'push' | 'subscription' | 'content';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
  operator: string;
  operatorIp: string;
  reviewer?: string;
  approver?: string;
  auditTime: string;
  alertsCovered: number;
  subscribers: number;
  finding: string;
  evidenceChain: string[];
}

const AUDITS: ReportAudit[] = [
  { id: 'DRA-2026-401', reportId: 'DRH-20260604001', reportName: '告警日报_20260604', auditType: 'generation', status: 'reviewing', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-06-04 09:00:00', alertsCovered: 325, subscribers: 43, finding: '日报生成内容复核，重点检查严重告警部分', evidenceChain: ['告警源', '分类统计', '趋势分析', '严重事件'] },
  { id: 'DRA-2026-400', reportId: 'DRH-20260603001', reportName: '告警日报_20260603', auditType: 'push', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 09:00:00', alertsCovered: 412, subscribers: 43, finding: '推送记录审计：邮件送达率 100%，钉钉送达率 100%', evidenceChain: ['SMTP 日志', '钉钉 API', '送达回执'] },
  { id: 'DRA-2026-399', reportId: 'DRH-20260601001', reportName: '告警日报_20260601', auditType: 'generation', status: 'rejected', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-01 09:30:00', alertsCovered: 295, subscribers: 0, finding: '生成失败原因：EDR 数据源同步超时，部分告警未生成。回滚后重新生成', evidenceChain: ['失败日志', '数据源', '重试记录'] },
  { id: 'DRA-2026-398', reportId: 'DRH-20260602001', reportName: '告警日报_20260602', auditType: 'content', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 09:00:00', alertsCovered: 358, subscribers: 43, finding: '内容审核通过：告警分类合理，重点事件突出', evidenceChain: ['告警分类', '重点事件', '趋势图'] },
  { id: 'DRA-2026-397', reportId: 'DRH-20260531001', reportName: '告警日报_20260531', auditType: 'push', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-05-31 09:00:00', alertsCovered: 286, subscribers: 43, finding: '推送成功，所有收件人正常接收', evidenceChain: ['SMTP 日志', '送达回执'] },
  { id: 'DRA-2026-396', reportId: 'DRH-20260530001', reportName: '告警日报_20260530', auditType: 'subscription', status: 'approved', operator: '安全-陈工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-05-30 10:00:00', alertsCovered: 318, subscribers: 43, finding: '订阅审计：43 人订阅，新增加 2 人订阅', evidenceChain: ['订阅列表', '变更记录'] },
  { id: 'DRA-2026-395', reportId: 'DRH-20260529001', reportName: '告警日报_20260529', auditType: 'generation', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-05-29 09:00:00', alertsCovered: 302, subscribers: 43, finding: '日报归档：已超过 30 天', evidenceChain: ['归档记录'] },
];

const TYPE_LABEL: Record<ReportAudit['auditType'], { label: string; color: string }> = {
  generation: { label: '生成审计', color: 'bg-blue-500/20 text-blue-400' },
  push: { label: '推送审计', color: 'bg-cyan-500/20 text-cyan-400' },
  subscription: { label: '订阅审计', color: 'bg-purple-500/20 text-purple-400' },
  content: { label: '内容审计', color: 'bg-green-500/20 text-green-400' },
};

const STATUS_MAP = {
  pending: { status: 'pending', text: '待复核' },
  reviewing: { status: 'running', text: '复核中' },
  approved: { status: 'success', text: '已通过' },
  rejected: { status: 'failed', text: '已驳回' },
  archived: { status: 'info', text: '已归档' },
};

const COLUMNS = [
  { key: 'id', title: '审计 ID', width: '130px', render: (r: ReportAudit) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'reportName', title: '报告', render: (r: ReportAudit) => <div><p className="text-sm text-slate-100">{r.reportName}</p><p className="text-[10px] text-slate-500">{r.reportId}</p></div> },
  { key: 'type', title: '类型', width: '90px', render: (r: ReportAudit) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: ReportAudit) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'alerts', title: '告警', width: '80px', render: (r: ReportAudit) => <span className="text-xs text-slate-300">{r.alertsCovered}</span> },
  { key: 'subs', title: '订阅', width: '70px', render: (r: ReportAudit) => <span className="text-xs text-slate-300">{r.subscribers}</span> },
  { key: 'operator', title: '操作人', width: '100px', render: (r: ReportAudit) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: ReportAudit) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 3-14-7 告警日报 - 任务审计
 *
 * 100% 复用 ListPage 共享组件
 */
export function DailyReportAudit() {
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
            <FileText className="w-6 h-6 text-blue-400" />
            告警日报任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">生成/推送/订阅/内容审计 · 责任链完整追溯</p>
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

      <ListPage<ReportAudit>
        searchPlaceholder="搜索 ID / 报告名 / 操作人..."
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
            <h3 className="text-base font-semibold text-slate-100">{r.reportName}</h3>
            <p className="text-xs text-slate-500">{r.reportId}</p>

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

export default DailyReportAudit;

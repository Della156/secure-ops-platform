'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, Shield, User, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface BaselineAudit {
  id: string;
  reportId: string;
  reportName: string;
  auditType: 'check' | 'remediation' | 'compliance' | 'rollback';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
  operator: string;
  operatorIp: string;
  reviewer?: string;
  approver?: string;
  auditTime: string;
  compliance: number;
  failed: number;
  finding: string;
  evidenceChain: string[];
}

const AUDITS: BaselineAudit[] = [
  { id: 'BRA-2026-301', reportId: 'BRH-20260604001', reportName: '核心服务器基线_20260604', auditType: 'check', status: 'reviewing', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-06-04 09:00:00', compliance: 92, failed: 12, finding: '12 项不合规，复核整改方案', evidenceChain: ['基线扫描', '合规对比', '整改建议', '优先级'] },
  { id: 'BRA-2026-300', reportId: 'BRH-20260603003', reportName: '网络设备基线_20260603', auditType: 'compliance', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 09:00:00', compliance: 95, failed: 4, finding: '4 项不合规均为低危，已加入整改计划', evidenceChain: ['设备配置', '基线对比', '风险评估'] },
  { id: 'BRA-2026-299', reportId: 'BRH-20260601005', reportName: '终端基线_20260601', auditType: 'rollback', status: 'rejected', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-01 10:00:00', compliance: 78, failed: 53, finding: '扫描失败，部分终端未覆盖。已重新生成补扫报告', evidenceChain: ['失败日志', '终端列表', '重试记录'] },
  { id: 'BRA-2026-298', reportId: 'BRH-20260602004', reportName: '中间件基线_20260602', auditType: 'remediation', status: 'approved', operator: '安全-张工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 14:00:00', compliance: 91, failed: 9, finding: '9 项整改完成，重检通过', evidenceChain: ['整改前', '整改后', '复检报告'] },
  { id: 'BRA-2026-297', reportId: 'BRH-20260530007', reportName: '操作系统基线_20260530', auditType: 'check', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-05-30 10:00:00', compliance: 93, failed: 11, finding: '11 项不合规，整改方案已制定', evidenceChain: ['基线扫描', '合规对比', '优先级'] },
  { id: 'BRA-2026-296', reportId: 'BRH-20260528009', reportName: '服务器基线_20260528', auditType: 'rollback', status: 'rejected', operator: '安全-陈工', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-05-28 11:00:00', compliance: 91, failed: 14, finding: '回滚原因：数据冲突，已重生成', evidenceChain: ['冲突记录'] },
  { id: 'BRA-2026-295', reportId: 'BRH-20260531006', reportName: '应用基线_20260531', auditType: 'check', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-05-31 09:00:00', compliance: 89, failed: 9, finding: '应用基线检查完成，已归档', evidenceChain: ['基线扫描', '应用配置'] },
];

const TYPE_LABEL: Record<BaselineAudit['auditType'], { label: string; color: string }> = {
  check: { label: '检查审计', color: 'bg-blue-500/20 text-blue-400' },
  remediation: { label: '整改审计', color: 'bg-green-500/20 text-green-400' },
  compliance: { label: '合规审计', color: 'bg-purple-500/20 text-purple-400' },
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
  { key: 'id', title: '审计 ID', width: '130px', render: (r: BaselineAudit) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'reportName', title: '报告', render: (r: BaselineAudit) => <div><p className="text-sm text-slate-100">{r.reportName}</p><p className="text-[10px] text-slate-500">{r.reportId}</p></div> },
  { key: 'type', title: '类型', width: '90px', render: (r: BaselineAudit) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: BaselineAudit) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'compliance', title: '合规率', width: '90px', render: (r: BaselineAudit) => <span className={`text-xs ${r.compliance >= 90 ? 'text-green-400' : r.compliance >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{r.compliance}%</span> },
  { key: 'failed', title: '不合规', width: '80px', render: (r: BaselineAudit) => <span className="text-xs text-red-400">{r.failed}</span> },
  { key: 'operator', title: '操作人', width: '100px', render: (r: BaselineAudit) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: BaselineAudit) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 3-15-7 基线防护报告 - 任务审计
 *
 * 100% 复用 ListPage 共享组件
 */
export function BaselineReportAudit() {
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
            基线防护报告任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">检查/整改/合规/回滚审计 · 责任链完整追溯</p>
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

      <ListPage<BaselineAudit>
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

export default BaselineReportAudit;

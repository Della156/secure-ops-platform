'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, Shield, Activity, User, FileText, ChevronRight, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LateralAudit {
  id: string;
  taskId: string;
  taskName: string;
  auditType: 'path' | 'credential' | 'compliance' | 'replay';
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

const AUDITS: LateralAudit[] = [
  { id: 'LMA-2026-201', taskId: 'LMH-20260604001', taskName: '核心网络横向渗透检测', auditType: 'path', status: 'reviewing', operator: '张伟', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-06-04 11:30:00', riskLevel: 'high', finding: '发现 3 条横向渗透路径，需立即阻断', evidenceChain: ['攻击路径图', '网络流量日志', '凭据使用记录', 'EDR 检测报告'] },
  { id: 'LMA-2026-200', taskId: 'LMH-20260603005', taskName: 'Pass-the-Hash 检测', auditType: 'credential', status: 'approved', operator: '张伟', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 23:00:00', riskLevel: 'high', finding: '2 个域账号存在 PTH 攻击痕迹，已重置密码', evidenceChain: ['Kerberos 日志', 'LSASS 内存取证', '网络认证日志'] },
  { id: 'LMA-2026-199', taskId: 'LMH-20260603006', taskName: '凭据滥用检测', auditType: 'credential', status: 'approved', operator: '张伟', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 21:00:00', riskLevel: 'high', finding: '5 个域账号存在异常登录，已通知用户修改', evidenceChain: ['登录日志', '异常 IP 列表', '账号活动画像'] },
  { id: 'LMA-2026-198', taskId: 'LMH-20260602009', taskName: 'APT 攻击路径复现', auditType: 'replay', status: 'approved', operator: '陈强', operatorIp: '10.20.30.78', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 16:00:00', riskLevel: 'critical', finding: 'APT-29 攻击路径已完整复现，影响 7 个节点', evidenceChain: ['攻击时间轴', 'TTP 映射', 'IOC 列表', '影响评估', '修复方案'] },
  { id: 'LMA-2026-197', taskId: 'LMH-20260601010', taskName: 'Kerberoasting 检测', auditType: 'credential', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-06-01 23:00:00', riskLevel: 'high', finding: '3 个服务账号密码强度不足，已更新', evidenceChain: ['SPN 列表', '加密票据分析', '密码强度报告'] },
  { id: 'LMA-2026-196', taskId: 'LMH-20260603007', taskName: 'SMB 异常连接', auditType: 'path', status: 'rejected', operator: '张伟', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 19:00:00', riskLevel: 'medium', finding: '误报：业务系统正常 SMB 通信', evidenceChain: ['SMB 会话日志', '业务系统配置'] },
  { id: 'LMA-2026-195', taskId: 'LMH-20260604003', taskName: '数据中心横向检测', auditType: 'compliance', status: 'pending', operator: '系统自动', operatorIp: '10.20.30.10', auditTime: '2026-06-04 10:00:00', riskLevel: 'high', finding: 'EDR 失联导致扫描中断，等待现场处置', evidenceChain: ['EDR 状态报告'] },
];

const TYPE_LABEL: Record<LateralAudit['auditType'], { label: string; color: string }> = {
  path: { label: '路径审计', color: 'bg-red-500/20 text-red-400' },
  credential: { label: '凭据审计', color: 'bg-purple-500/20 text-purple-400' },
  compliance: { label: '合规审计', color: 'bg-blue-500/20 text-blue-400' },
  replay: { label: '复现审计', color: 'bg-orange-500/20 text-orange-400' },
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
  { key: 'id', title: '审计 ID', width: '130px', render: (r: LateralAudit) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'taskName', title: '任务', render: (r: LateralAudit) => <div><p className="text-sm text-slate-100">{r.taskName}</p><p className="text-[10px] text-slate-500">{r.taskId}</p></div> },
  { key: 'type', title: '类型', width: '90px', render: (r: LateralAudit) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: LateralAudit) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'risk', title: '风险', width: '70px', render: (r: LateralAudit) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'operator', title: '操作人', width: '90px', render: (r: LateralAudit) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: LateralAudit) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 3-2-8 横向渗透监测 - 任务审计
 *
 * 100% 复用 ListPage 共享组件
 */
export function LateralMovementAudit() {
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
            横向渗透监测任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">责任链 + 证据链 · 路径/凭据/合规/复现审计</p>
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

      <ListPage<LateralAudit>
        searchPlaceholder="搜索 ID / 任务名 / 操作人..."
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
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
              <StatusBadge status={RISK_MAP[r.riskLevel].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.taskName}</h3>
            <p className="text-xs text-slate-500">{r.taskId}</p>

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

export default LateralMovementAudit;

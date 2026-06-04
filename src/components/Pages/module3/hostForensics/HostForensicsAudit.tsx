'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, Shield, Activity, User, FileText, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface HostAudit {
  id: string;
  taskId: string;
  taskName: string;
  auditType: 'evidence' | 'chain' | 'compliance' | 'access';
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

const AUDITS: HostAudit[] = [
  { id: 'HFA-2026-501', taskId: 'HFH-20260604001', taskName: 'HOST-DB-007 证据采集', auditType: 'evidence', status: 'reviewing', operator: '取证-李工', operatorIp: '10.20.30.45', reviewer: '李娜', auditTime: '2026-06-04 11:30:00', riskLevel: 'high', finding: '证据完整性校验通过，等待司法复核', evidenceChain: ['磁盘镜像 hash', 'MD5/SHA256 校验', '取证工具日志', '操作员审计'] },
  { id: 'HFA-2026-500', taskId: 'HFH-20260602007', taskName: 'HOST-FIN-002 内存取证', auditType: 'chain', status: 'approved', operator: '取证-王工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 18:00:00', riskLevel: 'critical', finding: '内存取证完整，已提取 12 个关键发现', evidenceChain: ['内存镜像', '进程列表', '网络连接', 'DLL 列表', '注册表键值'] },
  { id: 'HFA-2026-499', taskId: 'HFH-20260603005', taskName: 'HOST-APP-005 启动项分析', auditType: 'evidence', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-03 23:00:00', riskLevel: 'high', finding: '启动项中发现 2 个可疑项', evidenceChain: ['Autoruns 报告', '注册表项', '计划任务'] },
  { id: 'HFA-2026-498', taskId: 'HFH-20260603006', taskName: 'HOST-DB-007 账号审计', auditType: 'access', status: 'archived', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', auditTime: '2026-06-03 21:00:00', riskLevel: 'medium', finding: '1 个本地账号长期未使用，已禁用', evidenceChain: ['账号列表', '最后登录时间', '权限清单'] },
  { id: 'HFA-2026-497', taskId: 'HFH-20260602008', taskName: 'HOST-FIN-002 网络取证', auditType: 'compliance', status: 'rejected', operator: '取证-张工', operatorIp: '10.20.30.45', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 15:00:00', riskLevel: 'high', finding: 'PCAP 采集不完整，已重做', evidenceChain: ['PCAP 文件'] },
  { id: 'HFA-2026-496', taskId: 'HFH-20260601009', taskName: 'WEB 集群配置基线', auditType: 'compliance', status: 'approved', operator: '系统自动', operatorIp: '10.20.30.10', reviewer: '李娜', approver: '王刚', auditTime: '2026-06-02 00:00:00', riskLevel: 'medium', finding: '基线比对发现 8 项偏离，已下发修复工单', evidenceChain: ['基线配置', '实际配置 diff', '修复建议'] },
  { id: 'HFA-2026-495', taskId: 'HFH-20260604003', taskName: 'HOST-DB-007 日志检索', auditType: 'evidence', status: 'pending', operator: '取证-陈工', operatorIp: '10.20.30.45', auditTime: '2026-06-04 10:00:00', riskLevel: 'high', finding: '日志索引失败，等待磁盘扩容后重试', evidenceChain: ['失败日志'] },
];

const TYPE_LABEL: Record<HostAudit['auditType'], { label: string; color: string }> = {
  evidence: { label: '证据审计', color: 'bg-red-500/20 text-red-400' },
  chain: { label: '证据链', color: 'bg-orange-500/20 text-orange-400' },
  compliance: { label: '合规审计', color: 'bg-blue-500/20 text-blue-400' },
  access: { label: '访问审计', color: 'bg-purple-500/20 text-purple-400' },
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
  { key: 'id', title: '审计 ID', width: '130px', render: (r: HostAudit) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'taskName', title: '取证任务', render: (r: HostAudit) => <div><p className="text-sm text-slate-100">{r.taskName}</p><p className="text-[10px] text-slate-500">{r.taskId}</p></div> },
  { key: 'type', title: '类型', width: '90px', render: (r: HostAudit) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_LABEL[r.auditType].color}`}>{TYPE_LABEL[r.auditType].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: HostAudit) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'risk', title: '风险', width: '70px', render: (r: HostAudit) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'operator', title: '操作人', width: '100px', render: (r: HostAudit) => <span className="text-xs text-slate-300">{r.operator}</span> },
  { key: 'auditTime', title: '审计时间', width: '150px', render: (r: HostAudit) => <span className="text-xs text-slate-400 font-mono">{r.auditTime}</span> },
];

/**
 * 3-12-7 主机取证 - 任务审计
 *
 * 100% 复用 ListPage 共享组件
 */
export function HostForensicsAudit() {
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
            主机取证任务审计
          </h1>
          <p className="text-slate-400 mt-1 text-sm">证据链 / 合规 / 访问审计 · 责任链完整追溯</p>
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

      <ListPage<HostAudit>
        searchPlaceholder="搜索 ID / 任务名 / 操作人..."
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

export default HostForensicsAudit;

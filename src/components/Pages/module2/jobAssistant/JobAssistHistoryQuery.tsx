'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Clock, User, ChevronRight, Activity, Calendar, Target, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AssistHistory {
  id: string;
  jobName: string;
  jobType: string;
  target: string;
  status: 'success' | 'failed' | 'rolledback';
  startTime: string;
  duration: number; // 分钟
  result: string;
  riskLevel: 'low' | 'medium' | 'high';
  assignee: string;
  hasIssue: boolean;
  issueCount: number;
  qualityScore: number;
}

const HISTORY: AssistHistory[] = [
  { id: 'JAH-20260604001', jobName: '数据库全量备份', jobType: '备份作业', target: '生产主库 MySQL 8.0', status: 'success', startTime: '2026-06-04 02:00:00', duration: 15, result: '备份成功 · 2.5GB', riskLevel: 'low', assignee: '系统自动', hasIssue: false, issueCount: 0, qualityScore: 100 },
  { id: 'JAH-20260604002', jobName: '安全补丁安装', jobType: '补丁管理', target: 'Web 服务器集群', status: 'success', startTime: '2026-06-04 09:30:00', duration: 32, result: '安装完成 12/12 节点', riskLevel: 'medium', assignee: '系统自动', hasIssue: false, issueCount: 0, qualityScore: 95 },
  { id: 'JAH-20260604003', jobName: '配置同步作业', jobType: '配置管理', target: '配置服务器', status: 'failed', startTime: '2026-06-04 10:00:00', duration: 8, result: '同步失败：CS-03 网络超时', riskLevel: 'high', assignee: '系统自动', hasIssue: true, issueCount: 1, qualityScore: 60 },
  { id: 'JAH-20260604004', jobName: '性能检测作业', jobType: '性能检测', target: '应用服务器集群', status: 'success', startTime: '2026-06-04 11:00:00', duration: 5, result: 'CPU/内存/磁盘均正常', riskLevel: 'low', assignee: '系统自动', hasIssue: false, issueCount: 0, qualityScore: 92 },
  { id: 'JAH-20260603005', jobName: '日志清理作业', jobType: '清理作业', target: '日志服务器', status: 'success', startTime: '2026-06-04 01:00:00', duration: 8, result: '释放 5.2GB 空间', riskLevel: 'low', assignee: '系统自动', hasIssue: false, issueCount: 0, qualityScore: 100 },
  { id: 'JAH-20260603006', jobName: '数据归档作业', jobType: '数据归档', target: '历史数据库', status: 'success', startTime: '2026-06-04 03:00:00', duration: 45, result: '归档 12GB 数据', riskLevel: 'low', assignee: '系统自动', hasIssue: false, issueCount: 0, qualityScore: 94 },
  { id: 'JAH-20260603007', jobName: '主机基线检查', jobType: '安全检查', target: '生产环境 56 台', status: 'success', startTime: '2026-06-03 23:00:00', duration: 25, result: '合规率 98.2%', riskLevel: 'low', assignee: '系统自动', hasIssue: false, issueCount: 0, qualityScore: 88 },
  { id: 'JAH-20260603008', jobName: '安全补丁回滚', jobType: '补丁回滚', target: 'HOST-WEB-008', status: 'failed', startTime: '2026-06-03 16:00:00', duration: 18, result: '回滚失败：服务依赖冲突', riskLevel: 'high', assignee: '运维-张工', hasIssue: true, issueCount: 2, qualityScore: 45 },
  { id: 'JAH-20260603009', jobName: '数据库索引重建', jobType: '数据操作', target: '订单库 MySQL', status: 'success', startTime: '2026-06-03 14:00:00', duration: 12, result: '索引重建完成', riskLevel: 'medium', assignee: 'DBA-王工', hasIssue: false, issueCount: 0, qualityScore: 90 },
  { id: 'JAH-20260603010', jobName: '应急漏洞修复', jobType: '漏洞修复', target: 'CVE-2026-1234', status: 'rolledback', startTime: '2026-06-03 10:00:00', duration: 28, result: '补丁冲突，已回滚', riskLevel: 'high', assignee: '安全-陈工', hasIssue: true, issueCount: 1, qualityScore: 65 },
  { id: 'JAH-20260602011', jobName: '全网杀毒扫描', jobType: '安全扫描', target: '全网终端 800 台', status: 'success', startTime: '2026-06-02 22:00:00', duration: 90, result: '发现 3 个可疑样本', riskLevel: 'medium', assignee: '系统自动', hasIssue: false, issueCount: 0, qualityScore: 85 },
  { id: 'JAH-20260602012', jobName: '防火墙策略调优', jobType: '策略调整', target: '防火墙 FW-EDGE-01', status: 'success', startTime: '2026-06-02 14:00:00', duration: 22, result: '调优完成，命中率 +8%', riskLevel: 'medium', assignee: '运维-李工', hasIssue: false, issueCount: 0, qualityScore: 92 },
];

const TREND_DATA = [
  { day: '5/29', total: 32, success: 28, failed: 3, rolledback: 1 },
  { day: '5/30', total: 28, success: 25, failed: 2, rolledback: 1 },
  { day: '5/31', total: 35, success: 30, failed: 4, rolledback: 1 },
  { day: '6/1', total: 30, success: 28, failed: 1, rolledback: 1 },
  { day: '6/2', total: 38, success: 35, failed: 2, rolledback: 1 },
  { day: '6/3', total: 42, success: 38, failed: 3, rolledback: 1 },
  { day: '6/4', total: 12, success: 10, failed: 2, rolledback: 0 },
];

const STATUS_MAP = {
  success: { status: 'success', text: '成功', color: 'text-green-400' },
  failed: { status: 'failed', text: '失败', color: 'text-red-400' },
  rolledback: { status: 'warning', text: '已回滚', color: 'text-orange-400' },
};

const RISK_MAP = {
  low: { status: 'success', text: '低风险' },
  medium: { status: 'info', text: '中风险' },
  high: { status: 'warning', text: '高风险' },
};

const COLUMNS = [
  { key: 'id', title: 'ID', width: '160px', render: (r: AssistHistory) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'jobName', title: '作业名称', render: (r: AssistHistory) => <span className="text-sm text-slate-100">{r.jobName}</span> },
  { key: 'jobType', title: '类型', width: '90px', render: (r: AssistHistory) => <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{r.jobType}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: AssistHistory) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'riskLevel', title: '风险', width: '80px', render: (r: AssistHistory) => <StatusBadge status={RISK_MAP[r.riskLevel].status} /> },
  { key: 'duration', title: '耗时', width: '70px', render: (r: AssistHistory) => <span className="text-xs text-slate-300">{r.duration}m</span> },
  { key: 'qualityScore', title: '质量', width: '80px', render: (r: AssistHistory) => <span className={`text-xs font-medium ${r.qualityScore >= 90 ? 'text-green-400' : r.qualityScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{r.qualityScore}分</span> },
  { key: 'issueCount', title: '问题', width: '60px', render: (r: AssistHistory) => r.hasIssue ? <span className="text-xs text-red-400">{r.issueCount}</span> : <span className="text-xs text-slate-500">0</span> },
  { key: 'assignee', title: '执行人', width: '90px', render: (r: AssistHistory) => <span className="text-xs text-slate-300">{r.assignee}</span> },
  { key: 'startTime', title: '开始时间', width: '150px', render: (r: AssistHistory) => <span className="text-xs text-slate-400 font-mono">{r.startTime}</span> },
];

/**
 * 2-34-5 作业综合辅助任务历史查询
 *
 * 100% 复用 ListPage 共享组件
 * 12 条历史任务真实数据
 * 5 KPI：总数 / 成功 / 失败 / 平均耗时 / 质量分
 */
export function JobAssistHistoryQuery() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => ({
    total: HISTORY.length,
    success: HISTORY.filter((h) => h.status === 'success').length,
    failed: HISTORY.filter((h) => h.status === 'failed').length,
    avgDuration: Math.round(HISTORY.reduce((s, h) => s + h.duration, 0) / HISTORY.length),
    avgQuality: Math.round(HISTORY.reduce((s, h) => s + h.qualityScore, 0) / HISTORY.length),
  }), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            作业综合辅助任务历史查询
          </h1>
          <p className="text-slate-400 mt-1 text-sm">历史作业查询 · 多维筛选 · 质量回溯 · 问题分析</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="历史任务" value={stats.total} color="text-blue-400" />
        <KPI label="成功" value={stats.success} color="text-green-400" />
        <KPI label="失败" value={stats.failed} color="text-red-400" />
        <KPI label="平均耗时" value={`${stats.avgDuration}m`} color="text-cyan-400" />
        <KPI label="平均质量" value={`${stats.avgQuality}分`} color="text-purple-400" />
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />7 日历史趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="hs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="success" stroke="#22C55E" fill="url(#hs)" strokeWidth={2} />
            <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="rolledback" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <ListPage<AssistHistory>
        searchPlaceholder="搜索 ID / 作业名称 / 目标..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'jobType', label: '类型', options: [
            { value: 'all', label: '全部类型' },
            { value: '备份作业', label: '备份' },
            { value: '补丁管理', label: '补丁' },
            { value: '配置管理', label: '配置' },
            { value: '性能检测', label: '性能' },
            { value: '安全检查', label: '安全' },
          ]},
          { key: 'status', label: '状态', options: [
            { value: 'all', label: '全部状态' },
            { value: 'success', label: '成功' },
            { value: 'failed', label: '失败' },
            { value: 'rolledback', label: '已回滚' },
          ]},
        ]}
        filterValues={{ jobType: typeFilter, status: statusFilter }}
        onFilterChange={(k, v) => {
          if (k === 'jobType') setTypeFilter(v);
          if (k === 'status') setStatusFilter(v);
        }}
        data={HISTORY}
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

            <div className="grid grid-cols-2 gap-2">
              <Field label="类型" value={r.jobType} />
              <Field label="目标" value={r.target} />
              <Field label="执行人" value={r.assignee} />
              <Field label="开始时间" value={r.startTime} />
              <Field label="耗时" value={`${r.duration} 分钟`} />
              <Field label="质量分" value={`${r.qualityScore} 分`} highlight={r.qualityScore < 70} />
            </div>

            <div className={`p-3 rounded-lg ${r.status === 'failed' ? 'bg-red-500/10 border border-red-500/30' : 'bg-[#111625]'}`}>
              <p className="text-xs text-slate-500 mb-1">执行结果</p>
              <p className={`text-sm ${r.status === 'failed' ? 'text-red-300' : 'text-slate-200'}`}>{r.result}</p>
            </div>

            {r.hasIssue && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-orange-400 mb-1">问题分析</p>
                <p className="text-sm text-orange-200">检测到 {r.issueCount} 个问题，需要关注：</p>
                <ul className="mt-1.5 space-y-1 text-xs text-orange-200">
                  <li>· {r.status === 'failed' ? '执行失败原因已记录，请联系运维人员' : '回滚后状态未完全恢复'}</li>
                  <li>· 建议在下次执行前加强预检</li>
                </ul>
              </div>
            )}
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

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-2.5 rounded-lg ${highlight ? 'bg-red-500/10' : 'bg-[#111625]'}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm mt-0.5 ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p>
    </div>
  );
}

export default JobAssistHistoryQuery;

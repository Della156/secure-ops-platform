'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Edit, CheckCircle2,
  XCircle, Clock, User, Calendar, Shield, AlertCircle, ChevronRight,
  TrendingUp, Award, FileText, ListTree, BarChart3, Activity, Target
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface AuditJob {
  id: string;
  jobName: string;
  jobType: '日常维护' | '安全加固' | '漏洞修复' | '应急处置' | '配置变更' | '数据操作';
  applicant: string;
  applicantDept: string;
  submittedAt: string;
  status: 'pending' | 'auto_auditing' | 'reviewing' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  autoAuditResult?: 'pass' | 'warn' | 'fail';
  autoAuditScore?: number;
  reviewer?: string;
  approver?: string;
  duration?: string;
  result?: 'success' | 'failed' | 'partial';
  complianceChecks: number; // 合规检查数
  compliancePassed: number;
}

const jobs: AuditJob[] = [
  { id: 'JA-99831', jobName: '生产防火墙策略变更申请', jobType: '配置变更', applicant: '李娜', applicantDept: '网络部', submittedAt: '2026-06-03 11:25:00', status: 'reviewing', riskLevel: 'high', riskScore: 78, autoAuditResult: 'warn', autoAuditScore: 72, reviewer: '张伟', complianceChecks: 12, compliancePassed: 10 },
  { id: 'JA-99830', jobName: 'Oracle 数据库表结构变更', jobType: '数据操作', applicant: '王芳', applicantDept: 'DBA', submittedAt: '2026-06-03 10:48:18', status: 'approved', riskLevel: 'critical', riskScore: 92, autoAuditResult: 'pass', autoAuditScore: 88, reviewer: '陈磊', approver: 'CISO', complianceChecks: 18, compliancePassed: 18 },
  { id: 'JA-99829', jobName: 'Web 集群安全补丁批量安装', jobType: '漏洞修复', applicant: '陈磊', applicantDept: '运维部', submittedAt: '2026-06-03 09:32:00', status: 'executing', riskLevel: 'high', riskScore: 82, autoAuditResult: 'pass', autoAuditScore: 86, reviewer: '李娜', approver: '王芳', duration: '00:25:00', complianceChecks: 15, compliancePassed: 14 },
  { id: 'JA-99828', jobName: 'AD 域账号权限批量调整', jobType: '配置变更', applicant: '刘洋', applicantDept: '系统部', submittedAt: '2026-06-03 08:15:00', status: 'completed', riskLevel: 'medium', riskScore: 65, autoAuditResult: 'pass', autoAuditScore: 92, reviewer: '张伟', approver: '陈磊', duration: '00:18:00', result: 'success', complianceChecks: 10, compliancePassed: 10 },
  { id: 'JA-99827', jobName: '生产数据库慢 SQL 优化', jobType: '日常维护', applicant: '王芳', applicantDept: 'DBA', submittedAt: '2026-06-02 22:48:00', status: 'rejected', riskLevel: 'medium', riskScore: 58, autoAuditResult: 'fail', autoAuditScore: 45, reviewer: '陈磊', complianceChecks: 8, compliancePassed: 5 },
  { id: 'JA-99826', jobName: 'APT 应急处置（隔离+取证）', jobType: '应急处置', applicant: '张伟', applicantDept: '安全部', submittedAt: '2026-06-02 18:30:00', status: 'completed', riskLevel: 'critical', riskScore: 96, autoAuditResult: 'pass', autoAuditScore: 95, reviewer: 'CISO', approver: 'CIO', duration: '01:30:00', result: 'success', complianceChecks: 20, compliancePassed: 20 },
  { id: 'JA-99825', jobName: 'Redis 集群重启', jobType: '日常维护', applicant: '陈磊', applicantDept: '运维部', submittedAt: '2026-06-02 16:15:00', status: 'pending', riskLevel: 'low', riskScore: 32, complianceChecks: 5, compliancePassed: 0 },
  { id: 'JA-99824', jobName: '主机操作系统安全加固', jobType: '安全加固', applicant: '刘洋', applicantDept: '系统部', submittedAt: '2026-06-02 14:00:00', status: 'failed', riskLevel: 'high', riskScore: 75, autoAuditResult: 'warn', autoAuditScore: 68, reviewer: '张伟', approver: '王芳', duration: '02:00:00', result: 'failed', complianceChecks: 14, compliancePassed: 9 },
];

const statusConfig = {
  pending: { label: '待审核', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  auto_auditing: { label: '自动审核中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  reviewing: { label: '人工审核', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  approved: { label: '已批准', color: 'text-green-400', bg: 'bg-green-500/20' },
  rejected: { label: '已驳回', color: 'text-red-400', bg: 'bg-red-500/20' },
  executing: { label: '执行中', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const riskColor: Record<AuditJob['riskLevel'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const typeColor: Record<AuditJob['jobType'], string> = {
  日常维护: '#0066FF',
  安全加固: '#9333EA',
  漏洞修复: '#FF6D00',
  应急处置: '#EF4444',
  配置变更: '#EAB308',
  数据操作: '#22C55E',
};

const autoResultConfig = {
  pass: { label: '通过', color: 'text-green-400', bg: 'bg-green-500/20' },
  warn: { label: '警告', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  fail: { label: '不通过', color: 'text-red-400', bg: 'bg-red-500/20' },
};

// 月度统计
const monthlyData = [
  { month: '1月', submitted: 45, approved: 38, rejected: 4 },
  { month: '2月', submitted: 52, approved: 45, rejected: 5 },
  { month: '3月', submitted: 48, approved: 42, rejected: 3 },
  { month: '4月', submitted: 56, approved: 49, rejected: 4 },
  { month: '5月', submitted: 62, approved: 55, rejected: 5 },
  { month: '6月', submitted: 38, approved: 33, rejected: 2 },
];

export function JobAuditView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('JA-99831');

  const filtered = jobs.filter(j => {
    if (search && !j.jobName.includes(search) && !j.id.includes(search)) return false;
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (typeFilter !== 'all' && j.jobType !== typeFilter) return false;
    return true;
  });

  const selected = selectedId ? jobs.find(j => j.id === selectedId) : null;
  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending' || j.status === 'auto_auditing' || j.status === 'reviewing').length,
    approved: jobs.filter(j => j.status === 'approved' || j.status === 'completed').length,
    rejected: jobs.filter(j => j.status === 'rejected' || j.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="审核任务" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="待审核" value={stats.pending} color="#FF6D00" icon={<Clock className="w-4 h-4" />} />
        <StatBox label="已批准" value={stats.approved} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="已驳回" value={stats.rejected} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">月度审核趋势</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Bar dataKey="approved" stackId="a" fill="#22C55E" name="已批准" />
            <Bar dataKey="rejected" stackId="a" fill="#EF4444" name="已驳回" />
            <Bar dataKey="submitted" stackId="b" fill="#0066FF" fillOpacity={0.3} name="提交数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">作业审核视图</h2>
            <p className="text-xs text-slate-500 mt-1">6 类作业申请 — 自动审核 + 人工审核 + 合规检查</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />提交申请
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索作业/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="pending">待审核</option>
            <option value="auto_auditing">自动审核中</option>
            <option value="reviewing">人工审核</option>
            <option value="approved">已批准</option>
            <option value="rejected">已驳回</option>
            <option value="executing">执行中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="日常维护">日常维护</option>
            <option value="安全加固">安全加固</option>
            <option value="漏洞修复">漏洞修复</option>
            <option value="应急处置">应急处置</option>
            <option value="配置变更">配置变更</option>
            <option value="数据操作">数据操作</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">审核任务 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(j => {
              const sc = statusConfig[j.status];
              return (
                <div
                  key={j.id}
                  onClick={() => setSelectedId(j.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === j.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{j.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${typeColor[j.jobType]}20`, color: typeColor[j.jobType] }}>{j.jobType}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[j.riskLevel]}`}>{j.riskLevel === 'critical' ? '严重' : j.riskLevel === 'high' ? '高' : j.riskLevel === 'medium' ? '中' : '低'}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    {j.autoAuditResult && <span className={`text-[10px] px-1.5 py-0.5 rounded ${autoResultConfig[j.autoAuditResult].bg} ${autoResultConfig[j.autoAuditResult].color}`}>AI {autoResultConfig[j.autoAuditResult].label}</span>}
                    <div className="flex-1" />
                    <span className={`text-[10px] font-mono ${j.riskScore >= 80 ? 'text-red-400' : j.riskScore >= 60 ? 'text-orange-400' : 'text-green-400'}`}>风险 {j.riskScore}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{j.jobName}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{j.applicant} · {j.applicantDept}</span>
                    <span>·</span>
                    <span>{j.submittedAt}</span>
                    <span>·</span>
                    <span>合规 <span className={j.compliancePassed === j.complianceChecks ? 'text-green-300' : 'text-orange-300'}>{j.compliancePassed}/{j.complianceChecks}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${typeColor[selected.jobType]}20`, color: typeColor[selected.jobType] }}>{selected.jobType}</span>
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[selected.riskLevel]}`}>{selected.riskLevel === 'critical' ? '严重' : selected.riskLevel === 'high' ? '高' : selected.riskLevel === 'medium' ? '中' : '低'}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.jobName}</h3>
            </div>

            {/* 风险评分 */}
            <div className="bg-gradient-to-r from-blue-500/10 to-red-500/10 border border-blue-500/30 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">风险评分</span>
                <span className={`text-2xl font-bold ${selected.riskScore >= 80 ? 'text-red-400' : selected.riskScore >= 60 ? 'text-orange-400' : 'text-green-400'}`}>{selected.riskScore}</span>
              </div>
              <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selected.riskScore >= 80 ? 'bg-red-500' : selected.riskScore >= 60 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${selected.riskScore}%` }} />
              </div>
            </div>

            {/* AI 自动审核 */}
            {selected.autoAuditResult && (
              <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300">AI 自动审核</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${autoResultConfig[selected.autoAuditResult].bg} ${autoResultConfig[selected.autoAuditResult].color}`}>{autoResultConfig[selected.autoAuditResult].label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#20293F] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${selected.autoAuditScore! >= 80 ? 'bg-green-500' : selected.autoAuditScore! >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${selected.autoAuditScore}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-200">{selected.autoAuditScore}分</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">申请人</div>
                <div className="text-yellow-300">{selected.applicant}</div>
                <div className="text-[10px] text-slate-500">{selected.applicantDept}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">提交时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.submittedAt}</div>
              </div>
              {selected.reviewer && (
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">审核人</div>
                  <div className="text-blue-300">{selected.reviewer}</div>
                </div>
              )}
              {selected.approver && (
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">批准人</div>
                  <div className="text-green-300">{selected.approver}</div>
                </div>
              )}
            </div>

            {/* 合规检查 */}
            <div>
              <div className="text-xs text-slate-500 mb-1.5">合规检查</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${selected.compliancePassed === selected.complianceChecks ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${(selected.compliancePassed / selected.complianceChecks) * 100}%` }} />
                </div>
                <span className="text-xs text-white font-mono">{selected.compliancePassed}/{selected.complianceChecks}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {(selected.status === 'pending' || selected.status === 'reviewing') ? (
                <>
                  <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />批准
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                    <XCircle className="w-3 h-3" />驳回
                  </button>
                </>
              ) : (
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Eye className="w-3 h-3" />查看详情
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default JobAuditView;

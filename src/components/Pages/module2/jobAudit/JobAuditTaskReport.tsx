'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, Filter, Eye, Calendar, User, CheckCircle2, XCircle, AlertCircle, FileText, BarChart3, Award, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface AuditReport {
  id: string; name: string; jobType: string; taskNo: string;
  submittedAt: string; completedAt: string; duration: string;
  result: 'approved' | 'rejected' | 'auto-approved' | 'auto-rejected';
  applicant: string; reviewer: string; approver?: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number; aiScore: number; compliancePassed: number; complianceTotal: number;
  improvements: number; score: number; // 0-100 综合评分
}

const reports: AuditReport[] = [
  { id: 'JAR-99832', name: '生产防火墙策略变更审核报告', jobType: '配置变更', taskNo: 'JA-99831', submittedAt: '2026-06-03 11:25:00', completedAt: '2026-06-03 12:00:00', duration: '35min', result: 'approved', applicant: '李娜', reviewer: '张伟', approver: 'CISO', riskLevel: 'high', riskScore: 78, aiScore: 72, compliancePassed: 10, complianceTotal: 12, improvements: 2, score: 85 },
  { id: 'JAR-99831', name: 'Oracle 表结构变更审核报告', jobType: '数据操作', taskNo: 'JA-99830', submittedAt: '2026-06-03 10:48:18', completedAt: '2026-06-03 11:12:00', duration: '24min', result: 'auto-approved', applicant: '王芳', reviewer: 'AI 自动', approver: 'CISO', riskLevel: 'critical', riskScore: 92, aiScore: 88, compliancePassed: 18, complianceTotal: 18, improvements: 1, score: 92 },
  { id: 'JAR-99830', name: 'Web 集群补丁安装审核报告', jobType: '漏洞修复', taskNo: 'JA-99829', submittedAt: '2026-06-03 09:32:00', completedAt: '2026-06-03 10:15:00', duration: '43min', result: 'approved', applicant: '陈磊', reviewer: '李娜', approver: '运维总监', riskLevel: 'high', riskScore: 82, aiScore: 86, compliancePassed: 14, complianceTotal: 15, improvements: 3, score: 78 },
  { id: 'JAR-99829', name: 'AD 域账号权限调整审核报告', jobType: '配置变更', taskNo: 'JA-99828', submittedAt: '2026-06-03 08:15:00', completedAt: '2026-06-03 08:33:00', duration: '18min', result: 'auto-approved', applicant: '刘洋', reviewer: 'AI 自动', approver: '部门经理', riskLevel: 'medium', riskScore: 65, aiScore: 92, compliancePassed: 10, complianceTotal: 10, improvements: 1, score: 95 },
  { id: 'JAR-99828', name: '生产慢 SQL 优化审核报告', jobType: '日常维护', taskNo: 'JA-99827', submittedAt: '2026-06-02 22:48:00', completedAt: '2026-06-02 23:20:00', duration: '32min', result: 'rejected', applicant: '王芳', reviewer: '陈磊', riskLevel: 'medium', riskScore: 58, aiScore: 45, compliancePassed: 5, complianceTotal: 8, improvements: 3, score: 52 },
  { id: 'JAR-99827', name: 'APT 应急处置审核报告', jobType: '应急处置', taskNo: 'JA-99826', submittedAt: '2026-06-02 18:30:00', completedAt: '2026-06-02 18:38:00', duration: '8min', result: 'auto-approved', applicant: '张伟', reviewer: 'AI 紧急', approver: 'CIO+CISO', riskLevel: 'critical', riskScore: 96, aiScore: 95, compliancePassed: 20, complianceTotal: 20, improvements: 0, score: 98 },
  { id: 'JAR-99826', name: '防火墙会话表扩容审核报告', jobType: '安全加固', taskNo: 'JA-99824', submittedAt: '2026-06-02 16:30:00', completedAt: '2026-06-02 17:15:00', duration: '45min', result: 'approved', applicant: '李娜', reviewer: '张伟', approver: '运维总监', riskLevel: 'medium', riskScore: 62, aiScore: 78, compliancePassed: 8, complianceTotal: 8, improvements: 1, score: 82 },
];

const resultConfig = {
  'approved': { label: '已批准', color: 'text-green-400', bg: 'bg-green-500/20' },
  'rejected': { label: '已驳回', color: 'text-red-400', bg: 'bg-red-500/20' },
  'auto-approved': { label: 'AI 自动批准', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'auto-rejected': { label: 'AI 自动驳回', color: 'text-orange-400', bg: 'bg-orange-500/20' },
};

const jobTypeColor: Record<string, string> = {
  '配置变更': '#EAB308', '数据操作': '#22C55E', '漏洞修复': '#FF6D00',
  '应急处置': '#EF4444', '日常维护': '#0066FF', '安全加固': '#9333EA',
};

const riskColor: Record<AuditReport['riskLevel'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const monthlyTrend = [
  { month: '1月', count: 45, avgScore: 78, mttr: 35 },
  { month: '2月', count: 52, avgScore: 80, mttr: 32 },
  { month: '3月', count: 48, avgScore: 83, mttr: 28 },
  { month: '4月', count: 56, avgScore: 85, mttr: 25 },
  { month: '5月', count: 62, avgScore: 87, mttr: 22 },
  { month: '6月', count: 38, avgScore: 89, mttr: 20 },
];

const qualityRadar = [
  { dim: '完整性', value: 92 },
  { dim: '准确性', value: 88 },
  { dim: '可操作性', value: 85 },
  { dim: '时效性', value: 90 },
  { dim: '合规性', value: 95 },
  { dim: '可解释性', value: 82 },
];

export function JobAuditTaskReport() {
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('JAR-99832');

  const filtered = reports.filter(r => {
    if (search && !r.name.includes(search) && !r.id.includes(search)) return false;
    if (resultFilter !== 'all' && r.result !== resultFilter) return false;
    if (typeFilter !== 'all' && r.jobType !== typeFilter) return false;
    return true;
  });

  const selected = selectedId ? reports.find(r => r.id === selectedId) : null;
  const stats = {
    total: reports.length,
    approved: reports.filter(r => r.result === 'approved' || r.result === 'auto-approved').length,
    rejected: reports.filter(r => r.result === 'rejected' || r.result === 'auto-rejected').length,
    avgScore: (reports.reduce((s, r) => s + r.score, 0) / reports.length).toFixed(1),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="报告总数" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="已批准" value={stats.approved} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="已驳回" value={stats.rejected} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="平均评分" value={stats.avgScore} color="#FF6D00" icon={<Award className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">月度审核报告趋势</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[60, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Line yAxisId="left" type="monotone" dataKey="avgScore" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} name="平均评分" />
              <Line yAxisId="right" type="monotone" dataKey="mttr" stroke="#FF6D00" strokeWidth={2} dot={{ fill: '#FF6D00' }} name="MTTR(min)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">报告质量维度</h3>
          <ResponsiveContainer width="100%" height={150}>
            <RadarChart data={qualityRadar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dim" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">作业审核任务报告</h2>
            <p className="text-xs text-slate-500 mt-1">审核报告，含 AI 评分、综合评分、合规检查、改进项</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md"><RefreshCw className="w-3.5 h-3.5" />刷新</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"><Download className="w-3.5 h-3.5" />导出</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="搜索报告/ID" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none" />
          </div>
          <select value={resultFilter} onChange={e => setResultFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="approved">已批准</option><option value="rejected">已驳回</option>
            <option value="auto-approved">AI 自动批准</option><option value="auto-rejected">AI 自动驳回</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="日常维护">日常维护</option><option value="安全加固">安全加固</option>
            <option value="漏洞修复">漏洞修复</option><option value="应急处置">应急处置</option>
            <option value="配置变更">配置变更</option><option value="数据操作">数据操作</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]"><h3 className="text-sm font-semibold text-white">报告列表 ({filtered.length})</h3></div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(r => {
              const rc = resultConfig[r.result];
              return (
                <div key={r.id} onClick={() => setSelectedId(r.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{r.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${jobTypeColor[r.jobType] || '#0066FF'}20`, color: jobTypeColor[r.jobType] || '#0066FF' }}>{r.jobType}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[r.riskLevel]}`}>{r.riskLevel === 'critical' ? '严重' : r.riskLevel === 'high' ? '高' : r.riskLevel === 'medium' ? '中' : '低'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${rc.bg} ${rc.color}`}>{rc.label}</span>
                    <div className="flex-1" />
                    <span className={`text-[10px] font-mono ${r.score >= 90 ? 'text-green-400' : r.score >= 75 ? 'text-orange-400' : 'text-red-400'}`}>{r.score}分</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{r.name}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{r.applicant} · {r.reviewer}</span>
                    <span>·</span>
                    <span>AI <span className="text-blue-300 font-mono">{r.aiScore}</span></span>
                    <span>·</span>
                    <span>合规 <span className={r.compliancePassed === r.complianceTotal ? 'text-green-300' : 'text-orange-300'}>{r.compliancePassed}/{r.complianceTotal}</span></span>
                    <span>·</span>
                    <span>改进 {r.improvements}</span>
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
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${jobTypeColor[selected.jobType] || '#0066FF'}20`, color: jobTypeColor[selected.jobType] || '#0066FF' }}>{selected.jobType}</span>
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[selected.riskLevel]}`}>{selected.riskLevel === 'critical' ? '严重' : selected.riskLevel === 'high' ? '高' : selected.riskLevel === 'medium' ? '中' : '低'}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded p-3 text-center">
              <div className="text-[10px] text-slate-400 mb-1">综合评分</div>
              <div className={`text-3xl font-bold ${selected.score >= 90 ? 'text-green-400' : selected.score >= 75 ? 'text-orange-400' : 'text-red-400'}`}>{selected.score}</div>
              <div className="w-full h-1.5 bg-[#111625] rounded-full overflow-hidden mt-1.5">
                <div className={`h-full rounded-full ${selected.score >= 90 ? 'bg-green-500' : selected.score >= 75 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${selected.score}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">提交</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.submittedAt}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">完成</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.completedAt}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">审核耗时</div>
                <div className="text-blue-300 font-mono">{selected.duration}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">AI 评分</div>
                <div className="text-purple-300 font-mono">{selected.aiScore}分</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">申请人</div>
                <div className="text-yellow-300">{selected.applicant}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">审核人</div>
                <div className="text-blue-300">{selected.reviewer}</div>
              </div>
              {selected.approver && (
                <div className="bg-[#111625] rounded p-2 col-span-2">
                  <div className="text-slate-500 mb-0.5">批准人</div>
                  <div className="text-green-300">{selected.approver}</div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">合规检查</span>
                <span className={`font-mono ${selected.compliancePassed === selected.complianceTotal ? 'text-green-400' : 'text-yellow-400'}`}>{selected.compliancePassed}/{selected.complianceTotal}</span>
              </div>
              <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selected.compliancePassed === selected.complianceTotal ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${(selected.compliancePassed / selected.complianceTotal) * 100}%` }} />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5"><Eye className="w-3 h-3" />查看报告</button>
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5"><Download className="w-3 h-3" />下载</button>
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

export default JobAuditTaskReport;

'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, Filter, Eye, Calendar, User, CheckCircle2, XCircle, AlertCircle, FileText, BarChart3, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface HistoryRecord {
  id: string; jobName: string; jobType: string; submittedAt: string; completedAt: string;
  duration: string; result: 'approved' | 'rejected' | 'auto-approved' | 'auto-rejected';
  applicant: string; reviewer: string; approver?: string; riskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number; aiScore: number; compliancePassed: number; complianceTotal: number;
}

const records: HistoryRecord[] = [
  { id: 'JAH-99832', jobName: '生产防火墙策略变更', jobType: '配置变更', submittedAt: '2026-06-03 11:25:00', completedAt: '2026-06-03 12:00:00', duration: '35min', result: 'approved', applicant: '李娜', reviewer: '张伟', approver: 'CISO', riskLevel: 'high', riskScore: 78, aiScore: 72, compliancePassed: 10, complianceTotal: 12 },
  { id: 'JAH-99831', jobName: 'Oracle 表结构变更', jobType: '数据操作', submittedAt: '2026-06-03 10:48:18', completedAt: '2026-06-03 11:12:00', duration: '24min', result: 'auto-approved', applicant: '王芳', reviewer: 'AI 自动', approver: 'CISO', riskLevel: 'critical', riskScore: 92, aiScore: 88, compliancePassed: 18, complianceTotal: 18 },
  { id: 'JAH-99830', jobName: 'Web 集群补丁安装', jobType: '漏洞修复', submittedAt: '2026-06-03 09:32:00', completedAt: '2026-06-03 10:15:00', duration: '43min', result: 'approved', applicant: '陈磊', reviewer: '李娜', approver: '运维总监', riskLevel: 'high', riskScore: 82, aiScore: 86, compliancePassed: 14, complianceTotal: 15 },
  { id: 'JAH-99829', jobName: 'AD 域账号权限调整', jobType: '配置变更', submittedAt: '2026-06-03 08:15:00', completedAt: '2026-06-03 08:33:00', duration: '18min', result: 'auto-approved', applicant: '刘洋', reviewer: 'AI 自动', approver: '部门经理', riskLevel: 'medium', riskScore: 65, aiScore: 92, compliancePassed: 10, complianceTotal: 10 },
  { id: 'JAH-99828', jobName: '生产慢 SQL 优化', jobType: '日常维护', submittedAt: '2026-06-02 22:48:00', completedAt: '2026-06-02 23:20:00', duration: '32min', result: 'rejected', applicant: '王芳', reviewer: '陈磊', riskLevel: 'medium', riskScore: 58, aiScore: 45, compliancePassed: 5, complianceTotal: 8 },
  { id: 'JAH-99827', jobName: 'APT 应急处置', jobType: '应急处置', submittedAt: '2026-06-02 18:30:00', completedAt: '2026-06-02 18:38:00', duration: '8min', result: 'auto-approved', applicant: '张伟', reviewer: 'AI 紧急', approver: 'CIO+CISO', riskLevel: 'critical', riskScore: 96, aiScore: 95, compliancePassed: 20, complianceTotal: 20 },
  { id: 'JAH-99826', jobName: '防火墙会话表扩容', jobType: '安全加固', submittedAt: '2026-06-02 16:30:00', completedAt: '2026-06-02 17:15:00', duration: '45min', result: 'approved', applicant: '李娜', reviewer: '张伟', approver: '运维总监', riskLevel: 'medium', riskScore: 62, aiScore: 78, compliancePassed: 8, complianceTotal: 8 },
  { id: 'JAH-99825', jobName: 'K8s Pod 内存调整', jobType: '日常维护', submittedAt: '2026-06-01 14:00:00', completedAt: '2026-06-01 14:25:00', duration: '25min', result: 'auto-approved', applicant: '陈磊', reviewer: 'AI 自动', approver: '部门经理', riskLevel: 'low', riskScore: 32, aiScore: 95, compliancePassed: 5, complianceTotal: 5 },
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

const riskColor: Record<HistoryRecord['riskLevel'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const monthlyData = [
  { month: '1月', count: 45, approved: 38, rejected: 4, auto: 18 },
  { month: '2月', count: 52, approved: 45, rejected: 5, auto: 22 },
  { month: '3月', count: 48, approved: 42, rejected: 3, auto: 25 },
  { month: '4月', count: 56, approved: 49, rejected: 4, auto: 30 },
  { month: '5月', count: 62, approved: 55, rejected: 5, auto: 35 },
  { month: '6月', count: 38, approved: 33, rejected: 2, auto: 22 },
];

const typeDist = [
  { name: '日常维护', value: 38, color: '#0066FF' },
  { name: '安全加固', value: 18, color: '#9333EA' },
  { name: '漏洞修复', value: 28, color: '#FF6D00' },
  { name: '应急处置', value: 12, color: '#EF4444' },
  { name: '配置变更', value: 32, color: '#EAB308' },
  { name: '数据操作', value: 14, color: '#22C55E' },
];

export function JobAuditHistoryQuery() {
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedId, setSelectedId] = useState<string | null>('JAH-99832');

  const filtered = records.filter(r => {
    if (search && !r.jobName.includes(search) && !r.id.includes(search)) return false;
    if (resultFilter !== 'all' && r.result !== resultFilter) return false;
    if (typeFilter !== 'all' && r.jobType !== typeFilter) return false;
    return true;
  });

  const selected = selectedId ? records.find(r => r.id === selectedId) : null;
  const stats = {
    total: records.length,
    approved: records.filter(r => r.result === 'approved' || r.result === 'auto-approved').length,
    rejected: records.filter(r => r.result === 'rejected' || r.result === 'auto-rejected').length,
    autoRate: ((records.filter(r => r.result.startsWith('auto-')).length / records.length) * 100).toFixed(0),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="历史记录" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="已批准" value={stats.approved} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="已驳回" value={stats.rejected} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="AI 自动化率" value={`${stats.autoRate}%`} color="#9333EA" icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">月度审核统计</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Bar dataKey="approved" stackId="a" fill="#22C55E" name="已批准" />
              <Bar dataKey="rejected" stackId="a" fill="#EF4444" name="已驳回" />
              <Bar dataKey="auto" stackId="b" fill="#0066FF" fillOpacity={0.4} name="AI 自动化" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">作业类型分布</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={typeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45}>
                {typeDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {typeDist.map(d => (
              <div key={d.name} className="flex items-center gap-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded" style={{ background: d.color }} />
                <span className="text-slate-400 flex-1">{d.name}</span>
                <span className="text-slate-300 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">作业审核任务历史查询</h2>
            <p className="text-xs text-slate-500 mt-1">历史审核记录查询、复盘、合规分析</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
              <option value="24h">最近 24 小时</option>
              <option value="7d">最近 7 天</option>
              <option value="30d">最近 30 天</option>
              <option value="all">全部</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md"><RefreshCw className="w-3.5 h-3.5" />刷新</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"><Download className="w-3.5 h-3.5" />导出</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="搜索记录/ID" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none" />
          </div>
          <select value={resultFilter} onChange={e => setResultFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="approved">已批准</option>
            <option value="rejected">已驳回</option>
            <option value="auto-approved">AI 自动批准</option>
            <option value="auto-rejected">AI 自动驳回</option>
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
          <div className="px-4 py-3 border-b border-[#2A354D]"><h3 className="text-sm font-semibold text-white">历史记录 ({filtered.length})</h3></div>
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
                    <span className="text-[10px] text-slate-500 font-mono">{r.duration}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{r.jobName}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{r.applicant} · 审核 {r.reviewer}</span>
                    <span>·</span>
                    <span>AI <span className="text-blue-300 font-mono">{r.aiScore}分</span></span>
                    <span>·</span>
                    <span>合规 <span className={r.compliancePassed === r.complianceTotal ? 'text-green-300' : 'text-orange-300'}>{r.compliancePassed}/{r.complianceTotal}</span></span>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${resultConfig[selected.result].bg} ${resultConfig[selected.result].color}`}>{resultConfig[selected.result].label}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.jobName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">提交时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.submittedAt}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">完成时间</div>
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

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5"><Eye className="w-3 h-3" />查看完整记录</button>
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

export default JobAuditHistoryQuery;

'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, Filter, Eye, Calendar, User, CheckCircle2, XCircle, AlertCircle, FileText, BarChart3, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface HistoryRecord {
  id: string; jobName: string; jobType: string; submittedAt: string; completedAt: string;
  duration: string; result: 'success' | 'partial' | 'failed'; qualityScore: number; grade: string;
  applicant: string; aiSuggestions: number; appliedSuggestions: number; improvement: number;
  confidence: number;
}

const records: HistoryRecord[] = [
  { id: 'JAH-99832', jobName: '生产防火墙策略变更辅助', jobType: '配置变更', submittedAt: '2026-06-03 11:25:00', completedAt: '2026-06-03 12:00:00', duration: '35min', result: 'success', qualityScore: 88, grade: 'A', applicant: '李娜', aiSuggestions: 8, appliedSuggestions: 0, improvement: 15, confidence: 92 },
  { id: 'JAH-99831', jobName: 'Oracle 表结构变更辅助', jobType: '数据操作', submittedAt: '2026-06-03 10:48:18', completedAt: '2026-06-03 11:12:00', duration: '24min', result: 'success', qualityScore: 92, grade: 'A+', applicant: '王芳', aiSuggestions: 12, appliedSuggestions: 0, improvement: 8, confidence: 95 },
  { id: 'JAH-99830', jobName: 'Web 集群补丁安装辅助', jobType: '漏洞修复', submittedAt: '2026-06-03 09:32:00', completedAt: '2026-06-03 10:15:00', duration: '43min', result: 'success', qualityScore: 82, grade: 'B+', applicant: '陈磊', aiSuggestions: 10, appliedSuggestions: 8, improvement: 22, confidence: 86 },
  { id: 'JAH-99829', jobName: 'AD 域账号权限调整辅助', jobType: '配置变更', submittedAt: '2026-06-03 08:15:00', completedAt: '2026-06-03 08:33:00', duration: '18min', result: 'success', qualityScore: 90, grade: 'A', applicant: '刘洋', aiSuggestions: 6, appliedSuggestions: 6, improvement: 12, confidence: 93 },
  { id: 'JAH-99828', jobName: '生产慢 SQL 优化辅助', jobType: '日常维护', submittedAt: '2026-06-02 22:48:00', completedAt: '2026-06-02 23:20:00', duration: '32min', result: 'failed', qualityScore: 42, grade: 'D', applicant: '王芳', aiSuggestions: 8, appliedSuggestions: 0, improvement: 0, confidence: 65 },
  { id: 'JAH-99827', jobName: 'APT 应急处置辅助', jobType: '应急处置', submittedAt: '2026-06-02 18:30:00', completedAt: '2026-06-02 18:38:00', duration: '8min', result: 'success', qualityScore: 96, grade: 'A+', applicant: '张伟', aiSuggestions: 15, appliedSuggestions: 14, improvement: 5, confidence: 98 },
  { id: 'JAH-99826', jobName: '防火墙会话表扩容辅助', jobType: '安全加固', submittedAt: '2026-06-02 16:30:00', completedAt: '2026-06-02 17:15:00', duration: '45min', result: 'success', qualityScore: 82, grade: 'B+', applicant: '李娜', aiSuggestions: 8, appliedSuggestions: 5, improvement: 15, confidence: 82 },
  { id: 'JAH-99825', jobName: 'K8s Pod 内存调整辅助', jobType: '日常维护', submittedAt: '2026-06-01 14:00:00', completedAt: '2026-06-01 14:25:00', duration: '25min', result: 'success', qualityScore: 90, grade: 'A', applicant: '陈磊', aiSuggestions: 5, appliedSuggestions: 5, improvement: 10, confidence: 95 },
];

const resultConfig = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20' },
  partial: { label: '部分', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const jobTypeColor: Record<string, string> = {
  '配置变更': '#EAB308', '数据操作': '#22C55E', '漏洞修复': '#FF6D00',
  '应急处置': '#EF4444', '日常维护': '#0066FF', '安全加固': '#9333EA',
};

const monthlyData = [
  { month: '1月', count: 32, avgQuality: 75, improvement: 8 },
  { month: '2月', count: 38, avgQuality: 78, improvement: 12 },
  { month: '3月', count: 42, avgQuality: 80, improvement: 14 },
  { month: '4月', count: 48, avgQuality: 83, improvement: 16 },
  { month: '5月', count: 56, avgQuality: 86, improvement: 18 },
  { month: '6月', count: 32, avgQuality: 88, improvement: 20 },
];

const typeDist = [
  { name: '日常维护', value: 38, color: '#0066FF' },
  { name: '配置变更', value: 42, color: '#EAB308' },
  { name: '漏洞修复', value: 28, color: '#FF6D00' },
  { name: '应急处置', value: 12, color: '#EF4444' },
  { name: '数据操作', value: 18, color: '#22C55E' },
  { name: '安全加固', value: 8, color: '#9333EA' },
];

export function JobAssistantHistoryQuery() {
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
    total: records.length, success: records.filter(r => r.result === 'success').length,
    failed: records.filter(r => r.result === 'failed').length,
    avgImprovement: (records.filter(r => r.improvement > 0).reduce((s, r) => s + r.improvement, 0) / Math.max(1, records.filter(r => r.improvement > 0).length)).toFixed(0),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="历史记录" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="成功" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="平均改进" value={`${stats.avgImprovement}%`} color="#FF6D00" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">月度辅助统计</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Line yAxisId="left" type="monotone" dataKey="count" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} name="任务数" />
              <Line yAxisId="right" type="monotone" dataKey="avgQuality" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E' }} name="平均质量" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">类型分布</h3>
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
            <h2 className="text-lg font-semibold text-white">作业综合辅助任务历史查询</h2>
            <p className="text-xs text-slate-500 mt-1">历史辅助任务查询、复盘、改进分析</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
              <option value="24h">最近 24 小时</option><option value="7d">最近 7 天</option>
              <option value="30d">最近 30 天</option><option value="all">全部</option>
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
            <option value="success">成功</option><option value="partial">部分</option><option value="failed">失败</option>
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
          <div className="px-4 py-3 border-b border-[#2A354D]"><h3 className="text-sm font-semibold text-white">历史记录 ({filtered.length})</h3></div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(r => {
              const rc = resultConfig[r.result as keyof typeof resultConfig];
              return (
                <div key={r.id} onClick={() => setSelectedId(r.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{r.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${jobTypeColor[r.jobType] || '#0066FF'}20`, color: jobTypeColor[r.jobType] || '#0066FF' }}>{r.jobType}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${rc.bg} ${rc.color}`}>{rc.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{r.grade}</span>
                    <div className="flex-1" />
                    {r.improvement > 0 && <span className="text-[10px] text-green-300">↑{r.improvement}%</span>}
                  </div>
                  <div className="text-sm text-white font-medium mb-1.5">{r.jobName}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{r.applicant}</span>
                    <span>·</span>
                    <span>AI <span className="text-blue-300 font-mono">{r.aiSuggestions}</span></span>
                    <span>·</span>
                    <span>采纳 <span className="text-green-300 font-mono">{r.appliedSuggestions}</span></span>
                    <span>·</span>
                    <span>置信度 <span className="text-purple-300 font-mono">{r.confidence}%</span></span>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${resultConfig[selected.result as keyof typeof resultConfig].bg} ${resultConfig[selected.result as keyof typeof resultConfig].color}`}>{resultConfig[selected.result as keyof typeof resultConfig].label}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.jobName}</h3>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/30 rounded p-3 text-center">
              <div className="text-[10px] text-slate-400 mb-1">质量评分</div>
              <div className={`text-3xl font-bold ${selected.qualityScore >= 90 ? 'text-green-400' : selected.qualityScore >= 70 ? 'text-orange-400' : 'text-red-400'}`}>{selected.qualityScore}</div>
              <div className="text-[10px] text-slate-500 mt-1">等级 {selected.grade}</div>
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
                <div className="text-slate-500 mb-0.5">耗时</div>
                <div className="text-blue-300 font-mono">{selected.duration}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">申请人</div>
                <div className="text-yellow-300">{selected.applicant}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-[#111625] rounded p-1.5">
                <div className="text-[9px] text-slate-500">AI 建议</div>
                <div className="text-base font-bold text-purple-300">{selected.aiSuggestions}</div>
              </div>
              <div className="bg-[#111625] rounded p-1.5">
                <div className="text-[9px] text-slate-500">已采纳</div>
                <div className="text-base font-bold text-green-300">{selected.appliedSuggestions}</div>
              </div>
              <div className="bg-[#111625] rounded p-1.5">
                <div className="text-[9px] text-slate-500">改进</div>
                <div className="text-base font-bold text-blue-300">↑{selected.improvement}%</div>
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
              <Eye className="w-3 h-3" />查看完整记录
            </button>
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

export default JobAssistantHistoryQuery;

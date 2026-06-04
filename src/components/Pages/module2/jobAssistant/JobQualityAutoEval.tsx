'use client';

import React, { useState } from 'react';
import { Search, Plus, Download, RefreshCw, Filter, Eye, Edit, CheckCircle2, XCircle, Award, Star, TrendingUp, Activity, BarChart3, Brain, Target, Sparkles, AlertCircle, User, Clock, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface QualityEval {
  id: string; jobName: string; jobType: string; applicant: string; dept: string;
  submittedAt: string; totalScore: number; grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  dimensions: { name: string; score: number; weight: number }[];
  aiConfidence: number; improvement: number; // 相比上次
  status: 'evaluated' | 'in_progress' | 'pending';
  suggestions: number; applied: number;
}

const evals: QualityEval[] = [
  { id: 'QE-99832', jobName: '生产防火墙策略变更', jobType: '配置变更', applicant: '李娜', dept: '网络部', submittedAt: '2026-06-03 11:25:00', totalScore: 88, grade: 'A', dimensions: [
    { name: '文档完整性', score: 90, weight: 20 },
    { name: '操作规范性', score: 85, weight: 25 },
    { name: '回滚方案', score: 92, weight: 20 },
    { name: '风险评估', score: 80, weight: 15 },
    { name: '合规检查', score: 95, weight: 10 },
    { name: '效率', score: 85, weight: 10 },
  ], aiConfidence: 92, improvement: 15, status: 'evaluated', suggestions: 8, applied: 0 },
  { id: 'QE-99831', jobName: 'Oracle 表结构变更', jobType: '数据操作', applicant: '王芳', dept: 'DBA', submittedAt: '2026-06-03 10:48:18', totalScore: 92, grade: 'A+', dimensions: [
    { name: '文档完整性', score: 95, weight: 20 },
    { name: '操作规范性', score: 90, weight: 25 },
    { name: '回滚方案', score: 95, weight: 20 },
    { name: '风险评估', score: 88, weight: 15 },
    { name: '合规检查', score: 95, weight: 10 },
    { name: '效率', score: 90, weight: 10 },
  ], aiConfidence: 95, improvement: 8, status: 'evaluated', suggestions: 12, applied: 0 },
  { id: 'QE-99830', jobName: 'Web 集群补丁安装', jobType: '漏洞修复', applicant: '陈磊', dept: '运维部', submittedAt: '2026-06-03 09:32:00', totalScore: 82, grade: 'B+', dimensions: [
    { name: '文档完整性', score: 85, weight: 20 },
    { name: '操作规范性', score: 80, weight: 25 },
    { name: '回滚方案', score: 78, weight: 20 },
    { name: '风险评估', score: 85, weight: 15 },
    { name: '合规检查', score: 88, weight: 10 },
    { name: '效率', score: 90, weight: 10 },
  ], aiConfidence: 86, improvement: 22, status: 'evaluated', suggestions: 10, applied: 8 },
  { id: 'QE-99829', jobName: 'AD 域账号权限调整', jobType: '配置变更', applicant: '刘洋', dept: '系统部', submittedAt: '2026-06-03 08:15:00', totalScore: 90, grade: 'A', dimensions: [
    { name: '文档完整性', score: 92, weight: 20 },
    { name: '操作规范性', score: 90, weight: 25 },
    { name: '回滚方案', score: 88, weight: 20 },
    { name: '风险评估', score: 92, weight: 15 },
    { name: '合规检查', score: 90, weight: 10 },
    { name: '效率', score: 88, weight: 10 },
  ], aiConfidence: 93, improvement: 12, status: 'evaluated', suggestions: 6, applied: 6 },
  { id: 'QE-99828', jobName: 'APT 应急处置', jobType: '应急处置', applicant: '张伟', dept: '安全部', submittedAt: '2026-06-02 18:30:00', totalScore: 96, grade: 'A+', dimensions: [
    { name: '文档完整性', score: 98, weight: 20 },
    { name: '操作规范性', score: 95, weight: 25 },
    { name: '回滚方案', score: 95, weight: 20 },
    { name: '风险评估', score: 98, weight: 15 },
    { name: '合规检查', score: 95, weight: 10 },
    { name: '效率', score: 95, weight: 10 },
  ], aiConfidence: 98, improvement: 5, status: 'evaluated', suggestions: 15, applied: 14 },
  { id: 'QE-99827', jobName: '生产慢 SQL 优化', jobType: '日常维护', applicant: '王芳', dept: 'DBA', submittedAt: '2026-06-02 22:48:00', totalScore: 52, grade: 'D', dimensions: [
    { name: '文档完整性', score: 60, weight: 20 },
    { name: '操作规范性', score: 40, weight: 25 },
    { name: '回滚方案', score: 45, weight: 20 },
    { name: '风险评估', score: 55, weight: 15 },
    { name: '合规检查', score: 65, weight: 10 },
    { name: '效率', score: 50, weight: 10 },
  ], aiConfidence: 65, improvement: 0, status: 'evaluated', suggestions: 8, applied: 0 },
];

const gradeColor: Record<QualityEval['grade'], string> = {
  'A+': 'bg-green-500/20 text-green-400 border-green-500/40',
  'A': 'bg-green-500/20 text-green-400 border-green-500/40',
  'B+': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'B': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  'C': 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  'D': 'bg-red-500/20 text-red-400 border-red-500/40',
};

const jobTypeColor: Record<string, string> = {
  '配置变更': '#EAB308', '数据操作': '#22C55E', '漏洞修复': '#FF6D00',
  '应急处置': '#EF4444', '日常维护': '#0066FF', '安全加固': '#9333EA',
};

const gradeDist = [
  { name: 'A+', count: 8, color: '#22C55E' },
  { name: 'A', count: 22, color: '#22C55E' },
  { name: 'B+', count: 28, color: '#0066FF' },
  { name: 'B', count: 18, color: '#EAB308' },
  { name: 'C', count: 6, color: '#FF6D00' },
  { name: 'D', count: 2, color: '#EF4444' },
];

const trend = [
  { day: '05-28', avgScore: 78 },
  { day: '05-29', avgScore: 80 },
  { day: '05-30', avgScore: 82 },
  { day: '05-31', avgScore: 84 },
  { day: '06-01', avgScore: 85 },
  { day: '06-02', avgScore: 87 },
  { day: '06-03', avgScore: 88 },
];

export function JobQualityAutoEval() {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('QE-99832');

  const filtered = evals.filter(e => {
    if (search && !e.jobName.includes(search) && !e.id.includes(search)) return false;
    if (gradeFilter !== 'all' && e.grade !== gradeFilter) return false;
    if (typeFilter !== 'all' && e.jobType !== typeFilter) return false;
    return true;
  });

  const selected = selectedId ? evals.find(e => e.id === selectedId) : null;
  const stats = {
    total: evals.length,
    excellent: evals.filter(e => e.grade === 'A+' || e.grade === 'A').length,
    poor: evals.filter(e => e.grade === 'C' || e.grade === 'D').length,
    avgScore: (evals.reduce((s, e) => s + e.totalScore, 0) / evals.length).toFixed(1),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="评价任务" value={stats.total} color="#0066FF" icon={<Award className="w-4 h-4" />} />
        <StatBox label="优秀(A/A+)" value={stats.excellent} color="#22C55E" icon={<Star className="w-4 h-4" />} />
        <StatBox label="较差(C/D)" value={stats.poor} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="平均评分" value={stats.avgScore} color="#FF6D00" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">质量评分趋势（7 天）</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Line type="monotone" dataKey="avgScore" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E' }} name="平均分" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">等级分布</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {gradeDist.map(g => (
              <div key={g.name} className="bg-[#111625] rounded p-2 text-center border" style={{ borderColor: `${g.color}40` }}>
                <div className="text-lg font-bold" style={{ color: g.color }}>{g.count}</div>
                <div className="text-[10px] text-slate-400">{g.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">作业质量自动评价</h2>
        <p className="text-xs text-slate-500 mb-3">AI 6 维评分 · 自动评级 · 改进建议</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="搜索作业/ID" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none" />
          </div>
          <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部等级</option>
            <option value="A+">A+</option><option value="A">A</option><option value="B+">B+</option>
            <option value="B">B</option><option value="C">C</option><option value="D">D</option>
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
          <div className="px-4 py-3 border-b border-[#2A354D]"><h3 className="text-sm font-semibold text-white">评价任务 ({filtered.length})</h3></div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(e => (
              <div key={e.id} onClick={() => setSelectedId(e.id)}
                className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === e.id ? 'bg-[#111625]' : ''}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-blue-400 font-mono">{e.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${jobTypeColor[e.jobType] || '#0066FF'}20`, color: jobTypeColor[e.jobType] || '#0066FF' }}>{e.jobType}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 border rounded ${gradeColor[e.grade]}`}>{e.grade}</span>
                  <div className="flex-1" />
                  {e.improvement > 0 && <span className="text-[10px] text-green-300">↑{e.improvement}</span>}
                </div>
                <div className="text-sm text-white font-medium mb-1.5">{e.jobName}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span><User className="w-2.5 h-2.5 inline mr-0.5" />{e.applicant} · {e.dept}</span>
                  <span>·</span>
                  <span>建议 <span className="text-purple-300">{e.suggestions}</span></span>
                  {e.applied > 0 && <><span>·</span><span className="text-green-300">已采纳 {e.applied}</span></>}
                </div>
                <div className="mt-1.5 h-1 bg-[#111625] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${e.totalScore >= 90 ? 'bg-green-500' : e.totalScore >= 75 ? 'bg-blue-500' : e.totalScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${e.totalScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${gradeColor[selected.grade]}`}>{selected.grade}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.jobName}</h3>
            </div>

            {/* 总分 */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded p-3 text-center">
              <div className="text-[10px] text-slate-400 mb-1">综合评分</div>
              <div className={`text-3xl font-bold ${selected.totalScore >= 90 ? 'text-green-400' : selected.totalScore >= 75 ? 'text-blue-400' : selected.totalScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{selected.totalScore}</div>
              <div className="w-full h-1.5 bg-[#111625] rounded-full overflow-hidden mt-1.5">
                <div className={`h-full rounded-full ${selected.totalScore >= 90 ? 'bg-green-500' : selected.totalScore >= 75 ? 'bg-blue-500' : selected.totalScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${selected.totalScore}%` }} />
              </div>
            </div>

            {/* 6 维评分 */}
            <div>
              <h4 className="text-xs text-slate-500 mb-2">6 维评分</h4>
              <div className="space-y-1.5">
                {selected.dimensions.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300">{d.name}</span>
                      <span className="font-mono" style={{ color: d.score >= 90 ? '#22C55E' : d.score >= 75 ? '#3B82F6' : d.score >= 60 ? '#EAB308' : '#EF4444' }}>{d.score}</span>
                    </div>
                    <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.score >= 90 ? '#22C55E' : d.score >= 75 ? '#3B82F6' : d.score >= 60 ? '#EAB308' : '#EF4444' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">AI 置信度</div>
                <div className="text-blue-300 font-mono">{selected.aiConfidence}%</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">改进建议</div>
                <div className="text-purple-300 font-mono">{selected.suggestions} 条</div>
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3" />查看详细评价
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

export default JobQualityAutoEval;

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Edit2, Trash2, Eye, Save, X, Plus, Award, TrendingUp, Target, Sparkles,
  CheckCircle2, AlertCircle, Star, Brain, Zap, Activity, BarChart3, RefreshCw,
  ChevronRight, FileText, Clock, Settings,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/Common/StatusBadge';

/**
 * 2-34-2 作业质量自动评价（6 维评分 + AI 评估）
 *
 * 8 大模块：
 *  1. 4 KPI（规则数 / 优 / 良 / 差 + 平均分）
 *  2. 6 维评分雷达（基于当前选中任务）
 *  3. 评分规则配置
 *  4. 评价结果列表
 *  5. 评价趋势（折线图）
 *  6. 等级分布（饼图）
 *  7. AI 改进建议
 *  8. 评价详情面板
 */

type Grade = 'excellent' | 'good' | 'poor';
type Metric = 'duration' | 'issues' | 'compliance' | 'risk' | 'efficiency' | 'completeness';

interface QualityRule {
  id: string;
  name: string;
  metric: Metric;
  metricLabel: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  threshold: number;
  score: number;
  weight: number; // 权重 %
  enabled: boolean;
  createTime: string;
  updateTime: string;
}

interface EvalResult {
  id: string;
  jobName: string;
  jobId: string;
  jobType: string;
  applicant: string;
  dept: string;
  submittedAt: string;
  dimensions: { name: string; score: number; weight: number }[];
  totalScore: number;
  grade: Grade;
  aiConfidence: number;
  improvement: number; // 相比上次
  suggestions: number;
  applied: number;
  status: 'evaluated' | 'in_progress' | 'pending';
}

const METRIC_CONFIG: Record<Metric, { label: string; color: string }> = {
  duration: { label: '作业耗时', color: 'text-blue-400' },
  issues: { label: '问题数量', color: 'text-orange-400' },
  compliance: { label: '合规性', color: 'text-green-400' },
  risk: { label: '风险控制', color: 'text-red-400' },
  efficiency: { label: '执行效率', color: 'text-cyan-400' },
  completeness: { label: '文档完整', color: 'text-purple-400' },
};

const DEFAULT_RULES: QualityRule[] = [
  { id: 'RULE-001', name: '耗时评分规则', metric: 'duration', metricLabel: '作业耗时', operator: '<', threshold: 30, score: 35, weight: 20, enabled: true, createTime: '2026-06-01 10:00:00', updateTime: '2026-06-01 10:00:00' },
  { id: 'RULE-002', name: '问题数量规则', metric: 'issues', metricLabel: '问题数量', operator: '<', threshold: 5, score: 30, weight: 15, enabled: true, createTime: '2026-06-01 10:00:00', updateTime: '2026-06-02 14:00:00' },
  { id: 'RULE-003', name: '合规性规则', metric: 'compliance', metricLabel: '合规性', operator: '>=', threshold: 95, score: 35, weight: 20, enabled: true, createTime: '2026-06-01 10:00:00', updateTime: '2026-06-01 10:00:00' },
  { id: 'RULE-004', name: '风险控制规则', metric: 'risk', metricLabel: '风险控制', operator: '<=', threshold: 3, score: 30, weight: 15, enabled: true, createTime: '2026-06-02 09:00:00', updateTime: '2026-06-02 09:00:00' },
  { id: 'RULE-005', name: '执行效率规则', metric: 'efficiency', metricLabel: '执行效率', operator: '>=', threshold: 85, score: 30, weight: 15, enabled: true, createTime: '2026-06-02 09:30:00', updateTime: '2026-06-03 11:00:00' },
  { id: 'RULE-006', name: '文档完整规则', metric: 'completeness', metricLabel: '文档完整', operator: '>=', threshold: 90, score: 30, weight: 15, enabled: true, createTime: '2026-06-03 10:00:00', updateTime: '2026-06-03 10:00:00' },
];

const EVAL_RESULTS: EvalResult[] = [
  { id: 'QE-99832', jobName: '生产防火墙策略变更', jobId: 'JOB-20260604001', jobType: '配置变更', applicant: '李娜', dept: '网络部', submittedAt: '2026-06-04 11:25:00', dimensions: [
    { name: '作业耗时', score: 90, weight: 20 }, { name: '问题数量', score: 85, weight: 15 }, { name: '合规性', score: 92, weight: 20 },
    { name: '风险控制', score: 80, weight: 15 }, { name: '执行效率', score: 95, weight: 15 }, { name: '文档完整', score: 88, weight: 15 },
  ], totalScore: 88, grade: 'good', aiConfidence: 92, improvement: 15, suggestions: 8, applied: 6, status: 'evaluated' },
  { id: 'QE-99831', jobName: 'Oracle 表结构变更', jobId: 'JOB-20260604002', jobType: '数据操作', applicant: '王芳', dept: 'DBA', submittedAt: '2026-06-04 10:48:18', dimensions: [
    { name: '作业耗时', score: 95, weight: 20 }, { name: '问题数量', score: 92, weight: 15 }, { name: '合规性', score: 98, weight: 20 },
    { name: '风险控制', score: 90, weight: 15 }, { name: '执行效率', score: 88, weight: 15 }, { name: '文档完整', score: 90, weight: 15 },
  ], totalScore: 92, grade: 'excellent', aiConfidence: 96, improvement: 8, suggestions: 5, applied: 5, status: 'evaluated' },
  { id: 'QE-99830', jobName: '安全补丁批量安装', jobId: 'JOB-20260604003', jobType: '补丁管理', applicant: '张伟', dept: '运维部', submittedAt: '2026-06-04 09:30:00', dimensions: [
    { name: '作业耗时', score: 60, weight: 20 }, { name: '问题数量', score: 50, weight: 15 }, { name: '合规性', score: 70, weight: 20 },
    { name: '风险控制', score: 55, weight: 15 }, { name: '执行效率', score: 65, weight: 15 }, { name: '文档完整', score: 62, weight: 15 },
  ], totalScore: 60, grade: 'poor', aiConfidence: 88, improvement: -10, suggestions: 12, applied: 0, status: 'evaluated' },
  { id: 'QE-99829', jobName: '数据库备份', jobId: 'JOB-20260604004', jobType: '备份作业', applicant: '系统自动', dept: '-', submittedAt: '2026-06-04 02:00:00', dimensions: [
    { name: '作业耗时', score: 100, weight: 20 }, { name: '问题数量', score: 100, weight: 15 }, { name: '合规性', score: 100, weight: 20 },
    { name: '风险控制', score: 100, weight: 15 }, { name: '执行效率', score: 100, weight: 15 }, { name: '文档完整', score: 100, weight: 15 },
  ], totalScore: 100, grade: 'excellent', aiConfidence: 99, improvement: 0, suggestions: 0, applied: 0, status: 'evaluated' },
  { id: 'QE-99828', jobName: '主机基线检查', jobId: 'JOB-20260604005', jobType: '安全检查', applicant: '陈强', dept: '安全部', submittedAt: '2026-06-03 22:00:00', dimensions: [
    { name: '作业耗时', score: 85, weight: 20 }, { name: '问题数量', score: 88, weight: 15 }, { name: '合规性', score: 90, weight: 20 },
    { name: '风险控制', score: 82, weight: 15 }, { name: '执行效率', score: 78, weight: 15 }, { name: '文档完整', score: 80, weight: 15 },
  ], totalScore: 84, grade: 'good', aiConfidence: 90, improvement: 5, suggestions: 7, applied: 4, status: 'in_progress' },
  { id: 'QE-99827', jobName: '日志归档作业', jobId: 'JOB-20260604006', jobType: '数据归档', applicant: '系统自动', dept: '-', submittedAt: '2026-06-04 03:00:00', dimensions: [
    { name: '作业耗时', score: 95, weight: 20 }, { name: '问题数量', score: 98, weight: 15 }, { name: '合规性', score: 92, weight: 20 },
    { name: '风险控制', score: 90, weight: 15 }, { name: '执行效率', score: 96, weight: 15 }, { name: '文档完整', score: 94, weight: 15 },
  ], totalScore: 94, grade: 'excellent', aiConfidence: 97, improvement: 2, suggestions: 3, applied: 3, status: 'evaluated' },
];

const TREND_DATA = [
  { day: '5/29', avgScore: 82, evaluations: 18 },
  { day: '5/30', avgScore: 85, evaluations: 22 },
  { day: '5/31', avgScore: 81, evaluations: 25 },
  { day: '6/1', avgScore: 86, evaluations: 28 },
  { day: '6/2', avgScore: 88, evaluations: 32 },
  { day: '6/3', avgScore: 87, evaluations: 30 },
  { day: '6/4', avgScore: 89, evaluations: 24 },
];

const GRADE_BADGE: Record<Grade, { status: any; text: string; color: string; bg: string }> = {
  excellent: { status: 'success', text: '优', color: 'text-green-400', bg: 'bg-green-500/20' },
  good: { status: 'info', text: '良', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  poor: { status: 'failed', text: '差', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const STATUS_BADGE: Record<EvalResult['status'], { status: any; text: string }> = {
  evaluated: { status: 'success', text: '已评价' },
  in_progress: { status: 'running', text: '评价中' },
  pending: { status: 'pending', text: '待评价' },
};

const AI_SUGGESTIONS = [
  { id: 'S-001', text: '作业耗时偏高（22 分钟），建议拆分步骤并行执行', severity: 'medium', dimension: '作业耗时' },
  { id: 'S-002', text: '回滚方案文档可补充更多边界场景描述', severity: 'low', dimension: '文档完整' },
  { id: 'S-003', text: '建议在变更前增加依赖服务健康检查步骤', severity: 'high', dimension: '风险控制' },
  { id: 'S-004', text: '操作员资质等级满足要求，建议加强审批流程记录', severity: 'low', dimension: '合规性' },
];

export function JobQualityEval() {
  const [search, setSearch] = useState('');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<QualityRule | null>(null);
  const [selectedEval, setSelectedEval] = useState<EvalResult | null>(EVAL_RESULTS[0]);

  const stats = useMemo(() => {
    return {
      excellent: EVAL_RESULTS.filter((r) => r.grade === 'excellent').length,
      good: EVAL_RESULTS.filter((r) => r.grade === 'good').length,
      poor: EVAL_RESULTS.filter((r) => r.grade === 'poor').length,
      avgScore: Math.round(EVAL_RESULTS.reduce((s, r) => s + r.totalScore, 0) / EVAL_RESULTS.length),
      totalRules: DEFAULT_RULES.filter((r) => r.enabled).length,
    };
  }, []);

  // 6 维评分雷达数据
  const radarData = useMemo(() => {
    if (!selectedEval) return [];
    return selectedEval.dimensions.map((d) => ({ dimension: d.name, score: d.score }));
  }, [selectedEval]);

  const filteredRules = useMemo(() => {
    return DEFAULT_RULES.filter((r) => r.name.includes(search) || r.metricLabel.includes(search));
  }, [search]);

  const filteredEvals = useMemo(() => {
    return EVAL_RESULTS.filter((r) => r.jobName.includes(search) || r.applicant.includes(search));
  }, [search]);

  // 等级分布
  const gradePie = [
    { name: '优', value: stats.excellent, color: '#22C55E' },
    { name: '良', value: stats.good, color: '#3B82F6' },
    { name: '差', value: stats.poor, color: '#EF4444' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            作业质量自动评价
          </h1>
          <p className="text-slate-400 mt-1 text-sm">6 维 AI 加权评分 · 自动评级 A+/A/B/C · 改进建议</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><RefreshCw className="w-4 h-4 mr-1" />重新评价</Button>
          <Button variant="primary" onClick={() => { setEditingRule(null); setShowRuleModal(true); }}>
            <Plus className="w-4 h-4 mr-1" />新增规则
          </Button>
        </div>
      </div>

      {/* 5 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="启用规则" value={stats.totalRules} color="text-blue-400" icon={Settings} sub="权重 100%" />
        <KPI label="优秀" value={stats.excellent} color="text-green-400" icon={Award} sub="90+ 分" />
        <KPI label="良好" value={stats.good} color="text-cyan-400" icon={CheckCircle2} sub="75-89 分" />
        <KPI label="较差" value={stats.poor} color="text-red-400" icon={AlertCircle} sub="< 75 分" />
        <KPI label="平均分" value={stats.avgScore} color="text-purple-400" icon={Target} sub="AI 置信度 92%" />
      </div>

      {/* 6 维评分雷达 + AI 改进建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />6 维评分（{selectedEval?.jobName || '-'}）
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
          {selectedEval && (
            <div className="mt-3 p-2.5 bg-[#111625] rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">综合评分</p>
                  <p className={`text-2xl font-bold ${selectedEval.totalScore >= 90 ? 'text-green-400' : selectedEval.totalScore >= 75 ? 'text-blue-400' : 'text-red-400'}`}>
                    {selectedEval.totalScore} <span className="text-xs text-slate-500">/ 100</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">AI 置信度</p>
                  <p className="text-lg font-semibold text-cyan-400">{selectedEval.aiConfidence}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">较上次</p>
                  <p className={`text-lg font-semibold ${selectedEval.improvement > 0 ? 'text-green-400' : selectedEval.improvement < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {selectedEval.improvement > 0 ? '+' : ''}{selectedEval.improvement}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />AI 改进建议
            <span className="text-[10px] text-slate-500">（基于本次评价）</span>
          </h3>
          <div className="space-y-2 max-h-[340px] overflow-y-auto">
            {AI_SUGGESTIONS.map((s) => {
              const severityColor = s.severity === 'high' ? 'border-l-red-500 bg-red-500/10' :
                                    s.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-500/10' :
                                    'border-l-blue-500 bg-blue-500/10';
              const severityText = s.severity === 'high' ? 'text-red-400' :
                                   s.severity === 'medium' ? 'text-yellow-400' :
                                   'text-blue-400';
              return (
                <div key={s.id} className={`p-2.5 rounded border-l-2 ${severityColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium ${severityText}`}>{s.severity.toUpperCase()}</span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-[10px] text-slate-400">{s.dimension}</span>
                  </div>
                  <p className="text-xs text-slate-200">{s.text}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 评分规则配置 + 评价结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />评分规则配置
            <span className="text-[10px] text-slate-500">（{filteredRules.length} 启用）</span>
          </h3>
          <div className="space-y-2 max-h-[360px] overflow-y-auto">
            {filteredRules.map((r) => {
              const Mc = METRIC_CONFIG[r.metric];
              return (
                <div key={r.id} className="p-2.5 bg-[#111625] rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{r.id}</span>
                      <span className="text-sm text-slate-100 font-medium">{r.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.enabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {r.enabled ? '启用' : '禁用'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span className={Mc.color}>{r.metricLabel}</span>
                    <span>{r.operator} {r.threshold}</span>
                    <span>·</span>
                    <span>得分 {r.score} 分</span>
                    <span>·</span>
                    <span>权重 {r.weight}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingRule(r); setShowRuleModal(true); }}>
                      <Edit2 className="w-3 h-3 mr-1" />编辑
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3 mr-1" />删除
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />质量评价结果
            <span className="text-[10px] text-slate-500">（{filteredEvals.length} 条）</span>
          </h3>
          <div className="space-y-2 max-h-[360px] overflow-y-auto">
            {filteredEvals.map((r) => {
              const gc = GRADE_BADGE[r.grade];
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedEval(r)}
                  className={`p-2.5 rounded-lg cursor-pointer ${
                    selectedEval?.id === r.id ? 'bg-[#0066FF]/15 border border-[#0066FF]/50' : 'bg-[#111625] hover:bg-[#1A2236]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{r.id}</span>
                      <span className="text-sm text-slate-100 font-medium">{r.jobName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${gc.bg} ${gc.color}`}>
                        {gc.text}
                      </span>
                      <StatusBadge status={STATUS_BADGE[r.status].status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>类型: {r.jobType}</span>
                    <span>·</span>
                    <span>申请人: {r.applicant}</span>
                    <span>·</span>
                    <span>AI 置信度: {r.aiConfidence}%</span>
                  </div>
                  <div className="mt-1.5 h-1 bg-[#0A0E1A] rounded-full overflow-hidden">
                    <div className={`h-full ${r.totalScore >= 90 ? 'bg-green-500' : r.totalScore >= 75 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${r.totalScore}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 评价趋势 + 等级分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />7 日评价趋势
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={TREND_DATA}>
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="平均分" />
              <Line type="monotone" dataKey="evaluations" stroke="#A855F7" strokeWidth={2} dot={{ r: 3 }} name="评价数" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />等级分布
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={gradePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={2} label={({ name, value }: any) => `${name} ${value}`}>
                {gradePie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 规则编辑 Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowRuleModal(false); setEditingRule(null); }}>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-5 w-[480px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-100">{editingRule ? '编辑评分规则' : '新增评分规则'}</h3>
              <Button variant="ghost" size="sm" onClick={() => { setShowRuleModal(false); setEditingRule(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">规则名称</label>
                <Input defaultValue={editingRule?.name} placeholder="输入规则名称" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">评价指标</label>
                  <select defaultValue={editingRule?.metric} className="w-full px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                    {Object.entries(METRIC_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">比较运算符</label>
                  <select defaultValue={editingRule?.operator} className="w-full px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value="=">{'='}</option>
                    <option value=">=">{'>='}</option>
                    <option value="<=">{'<='}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">阈值</label>
                  <Input type="number" defaultValue={editingRule?.threshold} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">得分</label>
                  <Input type="number" defaultValue={editingRule?.score} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">权重 (%)</label>
                  <Input type="number" defaultValue={editingRule?.weight} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={editingRule?.enabled ?? true} className="rounded" id="rule-enabled" />
                <label htmlFor="rule-enabled" className="text-xs text-slate-400">启用规则</label>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="secondary" className="flex-1" onClick={() => { setShowRuleModal(false); setEditingRule(null); }}>取消</Button>
              <Button variant="primary" className="flex-1" onClick={() => { setShowRuleModal(false); setEditingRule(null); }}>
                <Save className="w-3.5 h-3.5 mr-1" />保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub }: { label: string; value: number | string; color: string; icon: any; sub?: string }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

export default JobQualityEval;

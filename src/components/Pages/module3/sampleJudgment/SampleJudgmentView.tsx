'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, Brain, BarChart3, Clock, TrendingUp, AlertTriangle, CheckCircle2, XCircle,
  Search, Filter, RefreshCw, Download, Database, FileText, Eye, Layers, PieChart as PieIcon,
  Zap, Target, Award, ArrowUpRight, ArrowDownRight, ChevronRight,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';

/**
 * 3-6-1 深度样本研判视图（业务驾驶舱）
 *
 * 8 大模块：
 *  1. 6 KPI（今日/恶意/待研判/完成/准确率/耗时）
 *  2. 实时研判队列（滚动动画）
 *  3. 研判趋势（24h 折线图）
 *  4. 高危样本 Top 10
 *  5. 渠道分布（饼图）
 *  6. 研判结论分布（饼图）
 *  7. 工具调用分布（柱状图）
 *  8. 待办任务（4 个待办）
 */

interface QueueItem {
  id: string;
  sampleName: string;
  family: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  waitTime: number;
  assignee: string;
  phase: 'pre' | 'tool' | 'deep' | 'final';
}

const INITIAL_QUEUE: QueueItem[] = [
  { id: 'Q-001', sampleName: 'phishing_kit.zip', family: 'APT-29', severity: 'critical', waitTime: 2, assignee: '张工', phase: 'pre' },
  { id: 'Q-002', sampleName: 'crypt32.dll', family: '可疑', severity: 'high', waitTime: 5, assignee: '李工', phase: 'tool' },
  { id: 'Q-003', sampleName: 'invoice_malware.docm', family: 'IcedID', severity: 'high', waitTime: 8, assignee: '王工', phase: 'deep' },
  { id: 'Q-004', sampleName: 'mirai_variant.elf', family: 'Mirai', severity: 'medium', waitTime: 12, assignee: '赵工', phase: 'final' },
  { id: 'Q-005', sampleName: 'dropper_x64.exe', family: '未知', severity: 'critical', waitTime: 15, assignee: '待分配', phase: 'pre' },
];

const TREND_DATA = [
  { time: '00:00', judgments: 28, malicious: 12, suspicious: 8 },
  { time: '04:00', judgments: 15, malicious: 6, suspicious: 4 },
  { time: '08:00', judgments: 42, malicious: 18, suspicious: 12 },
  { time: '12:00', judgments: 78, malicious: 32, suspicious: 22 },
  { time: '16:00', judgments: 95, malicious: 42, suspicious: 25 },
  { time: '20:00', judgments: 56, malicious: 22, suspicious: 18 },
  { time: '24:00', judgments: 38, malicious: 15, suspicious: 10 },
];

const CHANNEL_DATA = [
  { name: '邮件采集', value: 235, color: '#3B82F6' },
  { name: 'Web 下载', value: 89, color: '#A855F7' },
  { name: 'EDR 上报', value: 1235, color: '#10B981' },
  { name: '邮件网关', value: 570, color: '#06B6D4' },
  { name: '沙箱产出', value: 23, color: '#F97316' },
  { name: '蜜罐捕获', value: 81, color: '#EF4444' },
  { name: '人工上报', value: 12, color: '#EAB308' },
];

const CONCLUSION_DATA = [
  { name: '恶意', value: 68, color: '#EF4444' },
  { name: '可疑', value: 18, color: '#F59E0B' },
  { name: '安全', value: 12, color: '#10B981' },
  { name: '未知', value: 2, color: '#6B7280' },
];

const TOOL_USAGE_DATA = [
  { tool: 'YARA', count: 234, success: 99 },
  { tool: 'Cuckoo', count: 198, success: 95 },
  { tool: 'VirusTotal', count: 256, success: 100 },
  { tool: 'Hybrid', count: 67, success: 98 },
  { tool: '静态分析', count: 312, success: 99 },
  { tool: '沙箱', count: 145, success: 88 },
];

const TOP_RISK_SAMPLES = [
  { rank: 1, name: 'APT-29 phishing kit', hash: 'a3f5c8e9...', family: 'APT-29', severity: 'critical', confidence: 98 },
  { rank: 2, name: 'LockBit v4 ransomware', hash: 'b7d9e2f1...', family: 'LockBit v4', severity: 'critical', confidence: 99 },
  { rank: 3, name: 'Emotet dropper', hash: 'c1a3d8e5...', family: 'Emotet', severity: 'high', confidence: 92 },
  { rank: 4, name: 'WebShell b374k', hash: 'c4d8e5b2...', family: 'WebShell-B374k', severity: 'critical', confidence: 96 },
  { rank: 5, name: 'XLoader Android', hash: 'e6f1a7d4...', family: 'XLoader', severity: 'high', confidence: 91 },
  { rank: 6, name: 'IcedID trojan', hash: 'f7a2b8e5...', family: 'IcedID', severity: 'high', confidence: 89 },
  { rank: 7, name: 'Mirai botnet', hash: 'd4e8b2c1...', family: 'Mirai', severity: 'high', confidence: 95 },
  { rank: 8, name: 'XMRig miner', hash: 'e9b3a7d4...', family: 'XMRig', severity: 'medium', confidence: 88 },
];

const TODO_ITEMS = [
  { id: 'TD-1', title: '复核 "invoice_0630.docm" 研判结论', priority: 'urgent', dueIn: '2h', type: 'review' },
  { id: 'TD-2', title: '处理失败任务 T-JDG-003 沙箱崩溃', priority: 'high', dueIn: '4h', type: 'fix' },
  { id: 'TD-3', title: '审批 3 份专项报告（RPT-2026-004）', priority: 'medium', dueIn: '8h', type: 'approve' },
  { id: 'TD-4', title: '认领 Q-005 待分配样本', priority: 'urgent', dueIn: '1h', type: 'assign' },
];

const SEVERITY_MAP = {
  critical: { status: 'failed', text: '严重' },
  high: { status: 'warning', text: '高危' },
  medium: { status: 'info', text: '中危' },
  low: { status: 'info', text: '低危' },
};

const PHASE_MAP = {
  pre: { label: '预分析', color: 'text-blue-400' },
  tool: { label: '工具调用', color: 'text-purple-400' },
  deep: { label: '深度研判', color: 'text-orange-400' },
  final: { label: '结论生成', color: 'text-green-400' },
};

export function SampleJudgmentView() {
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [trendData, setTrendData] = useState(TREND_DATA);

  // 实时推进队列 + 趋势
  useEffect(() => {
    const timer = setInterval(() => {
      setQueue((prev) => {
        if (prev.length === 0) return INITIAL_QUEUE;
        return prev.slice(1).concat({
          ...INITIAL_QUEUE[Math.floor(Math.random() * INITIAL_QUEUE.length)],
          id: 'Q-' + String(Date.now()).slice(-3),
          waitTime: 0,
        });
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // KPI
  const todayJudgments = 352;
  const maliciousCount = 142;
  const pendingCount = queue.length;
  const completedCount = 256;
  const accuracy = 94.2;
  const avgDuration = 38;

  // 雷达数据：5 维研判能力
  const radarData = [
    { dimension: '静态分析', score: 95 },
    { dimension: '动态行为', score: 88 },
    { dimension: '网络流量', score: 92 },
    { dimension: '文件操作', score: 90 },
    { dimension: '进程行为', score: 87 },
    { dimension: '威胁情报', score: 96 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            深度样本研判视图
          </h1>
          <p className="text-slate-400 mt-1 text-sm">业务驾驶舱 · 全链路态势感知 · 今日研判 352 个 · 准确率 94.2%</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><RefreshCw className="w-4 h-4 mr-1" />刷新</Button>
          <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
        </div>
      </div>

      {/* 6 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label="今日研判" value={todayJudgments} color="text-blue-400" icon={Activity} sub="+12% 同比" trend="up" />
        <KPI label="恶意样本" value={maliciousCount} color="text-red-400" icon={AlertTriangle} sub="占总数 40.3%" />
        <KPI label="待研判" value={pendingCount} color="text-yellow-400" icon={Clock} sub="实时队列" />
        <KPI label="已完成" value={completedCount} color="text-green-400" icon={CheckCircle2} sub="完成率 72.7%" />
        <KPI label="准确率" value={`${accuracy}%`} color="text-cyan-400" icon={Target} sub="AI 决策" trend="up" />
        <KPI label="平均耗时" value={`${avgDuration}m`} color="text-purple-400" icon={Zap} sub="较昨日 -3m" trend="down" />
      </div>

      {/* 实时队列 + 研判趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />实时研判队列
            <span className="text-[10px] text-slate-500">（每 4 秒更新）</span>
          </h3>
          <div className="space-y-2 max-h-[260px] overflow-hidden">
            {queue.slice(0, 5).map((q) => {
              const phase = PHASE_MAP[q.phase];
              return (
                <div key={q.id} className="flex items-center gap-2 p-2.5 bg-[#111625] rounded-lg border-l-2 border-blue-500/30">
                  <span className="font-mono text-[10px] text-slate-500 w-12">{q.id}</span>
                  <span className="text-sm text-slate-100 flex-1 truncate">{q.sampleName}</span>
                  <StatusBadge status={SEVERITY_MAP[q.severity].status} />
                  <span className={`text-[10px] ${phase.color}`}>{phase.label}</span>
                  <span className="text-[10px] text-slate-500 w-12 text-right">等{q.waitTime}m</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />24h 研判趋势
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="judgments" stroke="#3B82F6" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="malicious" stroke="#EF4444" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 高危样本 Top 8 + 渠道分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />高危样本 Top 8
          </h3>
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {TOP_RISK_SAMPLES.map((s) => (
              <div key={s.rank} className="flex items-center gap-2 p-2 bg-[#111625] rounded hover:bg-[#1A2236]">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                  s.rank === 1 ? 'bg-red-500/30 text-red-400' :
                  s.rank === 2 ? 'bg-orange-500/30 text-orange-400' :
                  s.rank === 3 ? 'bg-yellow-500/30 text-yellow-400' :
                  'bg-slate-700 text-slate-300'
                }`}>{s.rank}</span>
                <span className="text-sm text-slate-100 flex-1 truncate">{s.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{s.hash.substring(0, 12)}</span>
                <StatusBadge status={SEVERITY_MAP[s.severity].status} />
                <span className={`text-xs font-medium ${
                  s.confidence >= 95 ? 'text-green-400' :
                  s.confidence >= 90 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>{s.confidence}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-400" />渠道分布
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={CHANNEL_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2}>
                {CHANNEL_DATA.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 研判结论 + 工具调用分布 + 能力雷达 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />研判结论分布
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CONCLUSION_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {CONCLUSION_DATA.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />工具调用分布
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOOL_USAGE_DATA}>
              <XAxis dataKey="tool" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />5 维研判能力
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 待办任务 */}
      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />待办任务
          <span className="text-[10px] text-slate-500">（分配给我 · 4 项）</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TODO_ITEMS.map((t) => (
            <div key={t.id} className="flex items-center gap-2 p-3 bg-[#111625] rounded-lg">
              <div className={`w-1.5 h-12 rounded-full ${
                t.priority === 'urgent' ? 'bg-red-500' :
                t.priority === 'high' ? 'bg-orange-500' :
                'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-slate-100">{t.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">ID: {t.id} · 类型: {t.type}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${
                  t.priority === 'urgent' ? 'text-red-400' :
                  t.priority === 'high' ? 'text-orange-400' :
                  'text-yellow-400'
                }`}>{t.priority.toUpperCase()}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">截止: {t.dueIn}</p>
              </div>
              <Button variant="ghost" size="sm">处理</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub, trend }: { label: string; value: number | string; color: string; icon: any; sub?: string; trend?: 'up' | 'down' }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
        {trend && (
          <span className={`text-[10px] flex items-center gap-0.5 ml-auto ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

export default SampleJudgmentView;

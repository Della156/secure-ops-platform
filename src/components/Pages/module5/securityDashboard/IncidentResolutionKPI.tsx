'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, Target,
  Activity, Zap, Award, Users, Timer, BarChart3, RefreshCw,
  Download, Maximize2, Filter, ChevronRight, ArrowUp, ArrowDown
} from 'lucide-react';

/**
 * 5.3-3 安全处置效率与闭环率核心指标
 *
 * KPI 大屏：
 * - 4 大核心 KPI：MTTD/MTTR/闭环率/升级率
 * - 团队处置效率对比（横向柱状图）
 * - 闭环率趋势
 * - TOP 10 慢响应事件
 */

interface TeamMetric {
  team: string;
  members: number;
  totalIncidents: number;
  resolved: number;
  avgMTTD: number;     // 分钟
  avgMTTR: number;     // 分钟
  closeRate: number;   // 0-1
  escalationRate: number;
}

interface SlowIncident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  openTime: string;
  assignedTeam: string;
  assignee: string;
  ageHours: number;
  status: 'investigating' | 'mitigating' | 'waiting_response' | 'escalated';
}

interface CloseRatePoint {
  date: string;
  rate: number;
  target: number;
}

// ========== Mock Data ==========
const mockTeamMetrics: TeamMetric[] = [
  { team: 'SOC 一线', members: 12, totalIncidents: 1245, resolved: 1189, avgMTTD: 8, avgMTTR: 35, closeRate: 0.955, escalationRate: 0.045 },
  { team: 'SOC 二线', members: 8, totalIncidents: 567, resolved: 552, avgMTTD: 5, avgMTTR: 62, closeRate: 0.974, escalationRate: 0.026 },
  { team: '应急响应', members: 6, totalIncidents: 89, resolved: 86, avgMTTD: 2, avgMTTR: 124, closeRate: 0.966, escalationRate: 0.034 },
  { team: '威胁分析', members: 5, totalIncidents: 234, resolved: 228, avgMTTD: 18, avgMTTR: 89, closeRate: 0.974, escalationRate: 0.026 },
  { team: '安全运营', members: 10, totalIncidents: 678, resolved: 645, avgMTTD: 12, avgMTTR: 56, closeRate: 0.951, escalationRate: 0.049 },
  { team: '合规审计', members: 4, totalIncidents: 156, resolved: 148, avgMTTD: 24, avgMTTR: 168, closeRate: 0.949, escalationRate: 0.051 },
];

const mockSlowIncidents: SlowIncident[] = [
  { id: 'INC-4521', title: 'APT 攻击溯源分析', severity: 'critical', openTime: '2026-05-28 09:15', assignedTeam: '应急响应', assignee: '张工', ageHours: 123, status: 'investigating' },
  { id: 'INC-4502', title: '核心数据库异常访问排查', severity: 'high', openTime: '2026-05-29 14:30', assignedTeam: 'SOC 二线', assignee: '李工', ageHours: 99, status: 'mitigating' },
  { id: 'INC-4488', title: '员工终端恶意软件处置', severity: 'high', openTime: '2026-05-30 11:20', assignedTeam: 'SOC 一线', assignee: '王工', ageHours: 78, status: 'waiting_response' },
  { id: 'INC-4470', title: 'DLP 告警确认', severity: 'medium', openTime: '2026-05-30 16:45', assignedTeam: '合规审计', assignee: '赵工', ageHours: 73, status: 'investigating' },
  { id: 'INC-4455', title: 'Web 漏洞修复', severity: 'medium', openTime: '2026-05-31 08:30', assignedTeam: '安全运营', assignee: '钱工', ageHours: 57, status: 'escalated' },
  { id: 'INC-4440', title: '基线不合规资产确认', severity: 'low', openTime: '2026-05-31 13:20', assignedTeam: '合规审计', assignee: '孙工', ageHours: 52, status: 'investigating' },
  { id: 'INC-4421', title: '弱口令批量修复', severity: 'high', openTime: '2026-06-01 09:00', assignedTeam: 'SOC 一线', assignee: '周工', ageHours: 32, status: 'mitigating' },
  { id: 'INC-4408', title: '日志源接入调试', severity: 'low', openTime: '2026-06-01 11:30', assignedTeam: '威胁分析', assignee: '吴工', ageHours: 30, status: 'waiting_response' },
];

const generateCloseRate = (days: number = 30): CloseRatePoint[] => {
  const points: CloseRatePoint[] = [];
  const baseDate = new Date('2026-06-02');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const noise = Math.sin(i * 0.4) * 0.02;
    points.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      rate: Math.max(0.85, Math.min(0.99, 0.95 + noise + (i * 0.0005))),
      target: 0.95,
    });
  }
  return points;
};

const severityColors: Record<SlowIncident['severity'], { bg: string; text: string }> = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

const statusLabels: Record<SlowIncident['status'], string> = {
  investigating: '调查中',
  mitigating: '处置中',
  waiting_response: '等待响应',
  escalated: '已升级',
};

// ========== 组件 ==========
function KPICard({
  title,
  value,
  unit,
  change,
  trend,
  target,
  description,
  icon,
  color,
  format = 'number',
}: {
  title: string;
  value: number;
  unit: string;
  change: number;  // 同比百分比
  trend: 'good' | 'bad';  // 趋势是好还是坏（取决于指标含义）
  target?: { value: number; met: boolean };
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red';
  format?: 'number' | 'percent' | 'duration';
}) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-500/0 border-blue-500/30',
    green: 'from-green-500/20 to-green-500/0 border-green-500/30',
    orange: 'from-orange-500/20 to-orange-500/0 border-orange-500/30',
    red: 'from-red-500/20 to-red-500/0 border-red-500/30',
  };

  const iconColorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
  };

  const isGood = (trend === 'good');
  const trendColor = isGood ? 'text-green-400' : 'text-red-400';
  const trendIcon = change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;

  const displayValue = format === 'percent' ? `${(value * 100).toFixed(1)}%` :
                       format === 'duration' ? `${value}` : value.toLocaleString();

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} bg-[#20293F] border rounded-lg p-4 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-current opacity-5 -mr-12 -mt-12" />
      <div className="flex items-start justify-between mb-2">
        <span className={`p-1.5 rounded bg-[#111625]/60 ${iconColorMap[color]}`}>{icon}</span>
        <div className={`flex items-center gap-0.5 text-xs ${trendColor}`}>
          {trendIcon}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{displayValue}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      <div className="text-[10px] text-gray-500 mt-1">{description}</div>
      {target && (
        <div className="mt-2 pt-2 border-t border-[#2A354D] flex items-center justify-between text-[10px]">
          <span className="text-gray-500">目标: {format === 'percent' ? `${(target.value * 100).toFixed(0)}%` : target.value}{unit}</span>
          <span className={target.met ? 'text-green-400' : 'text-red-400'}>
            {target.met ? '✓ 已达成' : '✗ 未达成'}
          </span>
        </div>
      )}
    </div>
  );
}

function TeamComparison({ teams }: { teams: TeamMetric[] }) {
  // 按 closeRate 排序
  const sorted = [...teams].sort((a, b) => b.closeRate - a.closeRate);
  const maxRate = Math.max(...teams.map(t => t.closeRate));

  return (
    <div className="space-y-3">
      {sorted.map((t, i) => {
        const isTop = i === 0;
        return (
          <div key={t.team} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isTop ? 'text-yellow-400' : 'text-gray-500'} w-5`}>
                  {isTop && <Award className="w-3.5 h-3.5 inline mr-0.5" />}
                  #{i + 1}
                </span>
                <span className="text-sm text-white">{t.team}</span>
                <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                  <Users className="w-2.5 h-2.5" />
                  {t.members} 人
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">
                  <span className="text-white font-medium">{(t.closeRate * 100).toFixed(1)}%</span>
                </span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-500">MTTD {t.avgMTTD}min</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-500">MTTR {t.avgMTTR}min</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-[#111625] rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all ${
                    isTop
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                      : t.closeRate >= 0.95
                      ? 'bg-gradient-to-r from-green-600 to-green-400'
                      : t.closeRate >= 0.90
                      ? 'bg-gradient-to-r from-blue-600 to-blue-400'
                      : 'bg-gradient-to-r from-orange-600 to-orange-400'
                  }`}
                  style={{ width: `${(t.closeRate / maxRate) * 100}%` }}
                />
                {/* 目标线 */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-500/60"
                  style={{ left: `${(0.95 / maxRate) * 100}%` }}
                  title="目标 95%"
                />
              </div>
              <span className="text-[10px] text-gray-500 w-12 text-right">
                {t.resolved}/{t.totalIncidents}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CloseRateTrend({ data }: { data: CloseRatePoint[] }) {
  const w = 800;
  const h = 200;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const minR = 0.85;
  const maxR = 1.0;
  const xStep = (w - padL - padR) / (data.length - 1);
  const yScale = (v: number) => padT + (h - padT - padB) * (1 - (v - minR) / (maxR - minR));

  const ratePath = data.map((d, i) => {
    const x = padL + i * xStep;
    const y = yScale(d.rate);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  const targetY = yScale(0.95);

  // 计算达成率（实际 >= 目标的占比）
  const achievedDays = data.filter(d => d.rate >= 0.95).length;
  const achievedRate = (achievedDays / data.length * 100).toFixed(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            实际闭环率
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            目标 95%
          </span>
        </div>
        <span className="text-gray-500">
          近 30 天达成: <span className="text-green-400 font-semibold">{achievedDays}/{data.length}</span> 天 ({achievedRate}%)
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Y 轴标签 */}
        {[0.85, 0.90, 0.95, 1.0].map((v, i) => (
          <g key={i}>
            <line x1={padL} y1={yScale(v)} x2={w - padR} y2={yScale(v)} stroke="rgba(255,255,255,0.05)" />
            <text x={padL - 8} y={yScale(v) + 4} fill="#64748B" fontSize="10" textAnchor="end">
              {(v * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        {/* 目标线 */}
        <line x1={padL} y1={targetY} x2={w - padR} y2={targetY} stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" />
        {/* 实际折线 */}
        <path d={ratePath + ` L ${padL + (data.length - 1) * xStep},${h - padB} L ${padL},${h - padB} Z`} fill="url(#rateGrad)" />
        <path d={ratePath} fill="none" stroke="#3B82F6" strokeWidth="2" />
        {/* 节点 */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={padL + i * xStep}
            cy={yScale(d.rate)}
            r={d.rate >= 0.95 ? 3 : 2}
            fill={d.rate >= 0.95 ? '#10B981' : '#F59E0B'}
          />
        ))}
        {/* X 轴 */}
        {data.filter((_, i) => i % 5 === 0).map((d, i) => {
          const idx = data.findIndex(x => x.date === d.date);
          return (
            <text key={i} x={padL + idx * xStep} y={h - padB + 18} fill="#64748B" fontSize="10" textAnchor="middle">
              {d.date}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ========== 主组件 ==========
export function IncidentResolutionKPI() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [closeRateData] = useState(() => generateCloseRate(30));

  // 计算聚合指标
  const totalIncidents = useMemo(() =>
    mockTeamMetrics.reduce((acc, t) => acc + t.totalIncidents, 0), []);
  const totalResolved = useMemo(() =>
    mockTeamMetrics.reduce((acc, t) => acc + t.resolved, 0), []);
  const overallCloseRate = totalResolved / totalIncidents;
  const avgMTTD = useMemo(() =>
    Math.round(mockTeamMetrics.reduce((acc, t) => acc + t.avgMTTD, 0) / mockTeamMetrics.length), []);
  const avgMTTR = useMemo(() =>
    Math.round(mockTeamMetrics.reduce((acc, t) => acc + t.avgMTTR, 0) / mockTeamMetrics.length), []);
  const avgEscalationRate = useMemo(() =>
    mockTeamMetrics.reduce((acc, t) => acc + t.escalationRate, 0) / mockTeamMetrics.length, []);

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            安全处置效率与闭环率核心指标
          </h2>
          <span className="text-xs text-gray-500">
            数据范围: 近 {timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90} 天
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-[#2A354D] rounded overflow-hidden">
            {(['7d', '30d', '90d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 text-xs ${
                  timeRange === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#111625] text-gray-400 hover:bg-[#20293F]'
                }`}
              >
                {t === '7d' ? '7 天' : t === '30d' ? '30 天' : '90 天'}
              </button>
            ))}
          </div>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            筛选
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            全屏
          </button>
        </div>
      </div>

      {/* 4 大核心 KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          title="MTTD（平均检测时间）"
          value={avgMTTD}
          unit="分钟"
          change={-12.5}
          trend="good"  // 检测时间越短越好
          target={{ value: 10, met: avgMTTD <= 10 }}
          description="从告警发生到识别为安全事件"
          icon={<Activity className="w-4 h-4" />}
          color="blue"
          format="duration"
        />
        <KPICard
          title="MTTR（平均响应时间）"
          value={avgMTTR}
          unit="分钟"
          change={-8.2}
          trend="good"  // 响应时间越短越好
          target={{ value: 60, met: avgMTTR <= 60 }}
          description="从识别到完成处置的时间"
          icon={<Zap className="w-4 h-4" />}
          color="green"
          format="duration"
        />
        <KPICard
          title="闭环率"
          value={overallCloseRate}
          unit=""
          change={+1.8}
          trend="good"  // 闭环率越高越好
          target={{ value: 0.95, met: overallCloseRate >= 0.95 }}
          description={`已闭环 ${totalResolved.toLocaleString()} / 总计 ${totalIncidents.toLocaleString()}`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          color="orange"
          format="percent"
        />
        <KPICard
          title="升级率"
          value={avgEscalationRate}
          unit=""
          change={-3.2}
          trend="good"  // 升级率越低越好
          target={{ value: 0.05, met: avgEscalationRate <= 0.05 }}
          description="需要上级介入的事件比例"
          icon={<AlertCircle className="w-4 h-4" />}
          color="red"
          format="percent"
        />
      </div>

      {/* 趋势图 + 团队对比 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              闭环率趋势
            </h3>
          </div>
          <CloseRateTrend data={closeRateData} />
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              团队处置效率排名
            </h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
              全部团队 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <TeamComparison teams={mockTeamMetrics} />
        </div>
      </div>

      {/* TOP 慢响应事件 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Timer className="w-4 h-4 text-orange-400" />
            TOP 慢响应事件（按持续时间）
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>阈值: 24h</span>
            <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {mockSlowIncidents.length} 个超期
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-[#2A354D]">
                <th className="text-left py-2 px-2 font-medium">工单 ID</th>
                <th className="text-left py-2 px-2 font-medium">标题</th>
                <th className="text-center py-2 px-2 font-medium">严重程度</th>
                <th className="text-left py-2 px-2 font-medium">责任团队</th>
                <th className="text-left py-2 px-2 font-medium">处理人</th>
                <th className="text-center py-2 px-2 font-medium">开单时间</th>
                <th className="text-center py-2 px-2 font-medium">持续时间</th>
                <th className="text-center py-2 px-2 font-medium">状态</th>
                <th className="text-center py-2 px-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockSlowIncidents.map(inc => {
                const sc = severityColors[inc.severity];
                return (
                  <tr key={inc.id} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                    <td className="py-2 px-2 font-mono text-xs text-blue-400">{inc.id}</td>
                    <td className="py-2 px-2 text-white max-w-xs truncate" title={inc.title}>{inc.title}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.text} font-medium`}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-gray-300">{inc.assignedTeam}</td>
                    <td className="py-2 px-2 text-gray-300">{inc.assignee}</td>
                    <td className="py-2 px-2 text-center text-gray-500 text-xs">{inc.openTime}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={inc.ageHours > 72 ? 'text-red-400' : inc.ageHours > 48 ? 'text-orange-400' : 'text-yellow-400'}>
                        {inc.ageHours}h
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111625] text-gray-400">
                        {statusLabels[inc.status]}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">详情</button>
                      <button className="text-xs text-orange-400 hover:text-orange-300">催办</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IncidentResolutionKPI;

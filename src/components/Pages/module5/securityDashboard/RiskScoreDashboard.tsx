'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, TrendingUp, TrendingDown, Activity, AlertCircle,
  Bug, CheckCircle2, Target, Layers, RefreshCw, Download,
  Maximize2, Filter, Clock, Zap, AlertTriangle, Server,
  Database, Cloud, Wifi, ArrowUpRight, ArrowDownRight,
  Eye, ChevronRight, Sparkles, BarChart3
} from 'lucide-react';

/**
 * 5.3-1 网络安全风险综合评分大屏
 *
 * 综合 5 维评分仪表盘：
 * - 资产健康度 (30%) - 资产在线率、版本合规度
 * - 告警风险 (25%) - 高危/紧急告警数
 * - 漏洞风险 (20%) - 未修复高危漏洞数
 * - 合规风险 (15%) - 基线合规率
 * - 覆盖风险 (10%) - 安全产品部署覆盖率
 *
 * 综合评分 = Σ(维度分 × 权重)
 * 评分越低 = 风险越高
 */

interface DimensionScore {
  id: string;
  name: string;
  score: number;     // 0-100
  weight: number;    // 0-1
  trend: number;     // 同比变化
  icon: React.ReactNode;
  color: string;
  description: string;
  details: { label: string; value: string; status: 'good' | 'warn' | 'bad' }[];
}

interface TrendPoint {
  date: string;
  score: number;
  asset: number;
  alert: number;
  vuln: number;
  compliance: number;
  coverage: number;
}

interface HighRiskAsset {
  id: string;
  name: string;
  type: string;
  riskScore: number;
  issues: string[];
  location: string;
}

// ========== Mock 数据生成 ==========
const generateDimensions = (): DimensionScore[] => [
  {
    id: 'asset',
    name: '资产健康度',
    score: 78,
    weight: 0.30,
    trend: +2.3,
    icon: <Server className="w-5 h-5" />,
    color: 'blue',
    description: '反映在网资产的运行状态与版本合规度',
    details: [
      { label: '在线资产', value: '1,247 / 1,302', status: 'good' },
      { label: '离线资产', value: '23 台', status: 'warn' },
      { label: '版本过期', value: '32 台', status: 'bad' },
    ],
  },
  {
    id: 'alert',
    name: '告警风险',
    score: 65,
    weight: 0.25,
    trend: -5.2,
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'orange',
    description: '反映当前活跃告警的严重程度与频次',
    details: [
      { label: '高危告警', value: '17 条', status: 'bad' },
      { label: '中危告警', value: '84 条', status: 'warn' },
      { label: '今日新增', value: '156 条', status: 'warn' },
    ],
  },
  {
    id: 'vuln',
    name: '漏洞风险',
    score: 58,
    weight: 0.20,
    trend: +1.8,
    icon: <Bug className="w-5 h-5" />,
    color: 'red',
    description: '反映未修复漏洞的数量与危害等级',
    details: [
      { label: '高危漏洞', value: '32 个', status: 'bad' },
      { label: '中危漏洞', value: '128 个', status: 'warn' },
      { label: '已修复', value: '567 个', status: 'good' },
    ],
  },
  {
    id: 'compliance',
    name: '合规风险',
    score: 82,
    weight: 0.15,
    trend: +0.5,
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'green',
    description: '反映基线检查的合规率',
    details: [
      { label: '基线合规', value: '82.3%', status: 'good' },
      { label: '不合规项', value: '218 项', status: 'warn' },
      { label: '复测通过', value: '1,012 项', status: 'good' },
    ],
  },
  {
    id: 'coverage',
    name: '覆盖风险',
    score: 74,
    weight: 0.10,
    trend: -1.2,
    icon: <Target className="w-5 h-5" />,
    color: 'purple',
    description: '反映安全产品的部署覆盖率',
    details: [
      { label: '防病毒', value: '96.5%', status: 'good' },
      { label: '终端管控', value: '88.2%', status: 'good' },
      { label: 'DLP 部署', value: '62.1%', status: 'warn' },
    ],
  },
];

const generateTrend = (days: number = 30): TrendPoint[] => {
  const points: TrendPoint[] = [];
  const baseDate = new Date('2026-06-02');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const noise = Math.sin(i * 0.3) * 3;
    points.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      score: Math.round(72 + noise + (days - i) * 0.1),
      asset: 78 + Math.round(noise * 0.5),
      alert: 65 - Math.round(noise * 0.8),
      vuln: 58 + Math.round(noise * 0.6),
      compliance: 82 + Math.round(noise * 0.2),
      coverage: 74 - Math.round(noise * 0.3),
    });
  }
  return points;
};

const mockHighRiskAssets: HighRiskAsset[] = [
  {
    id: 'AST-0042',
    name: '核心数据库-DB-MASTER',
    type: '数据库服务器',
    riskScore: 92,
    issues: ['高危漏洞×3', '版本过期', '基线不合规'],
    location: '北京·亦庄',
  },
  {
    id: 'AST-0118',
    name: '边界防火墙-FW-EDGE-01',
    type: '防火墙',
    riskScore: 88,
    issues: ['策略过期', '高危告警×2'],
    location: '上海·张江',
  },
  {
    id: 'AST-0203',
    name: '应用服务器-WEB-APP-12',
    type: '应用服务器',
    riskScore: 85,
    issues: ['DLP 未部署', '高危漏洞×2'],
    location: '深圳·南山',
  },
  {
    id: 'AST-0456',
    name: '核心交换机-CORE-SW-02',
    type: '交换机',
    riskScore: 79,
    issues: ['固件版本过低', '配置漂移'],
    location: '北京·海淀',
  },
  {
    id: 'AST-0789',
    name: 'Web 应用防火墙-WAF-03',
    type: 'WAF',
    riskScore: 76,
    issues: ['规则过期', '告警阈值未调优'],
    location: '广州·天河',
  },
];

// ========== 组件 ==========
function ScoreRing({ score, weight, color = 'blue', size = 200 }: {
  score: number;
  weight: number;
  color?: string;
  size?: number;
}) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const colorMap: Record<string, string> = {
    blue: '#3B82F6',
    orange: '#F59E0B',
    red: '#EF4444',
    green: '#10B981',
    purple: '#8B5CF6',
  };
  const stroke = colorMap[color] || colorMap.blue;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-white">{score}</div>
        <div className="text-xs text-gray-400 mt-1">/ 100</div>
        <div className="text-xs text-gray-500 mt-2">权重 {(weight * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color = '#3B82F6' }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

function DimensionCard({ dim }: { dim: DimensionScore }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 hover:border-opacity-80 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded bg-${dim.color}-500/20 text-${dim.color}-400`}>
            {dim.icon}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{dim.name}</div>
            <div className="text-xs text-gray-500">权重 {(dim.weight * 100).toFixed(0)}%</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{dim.score}</div>
          <div className={`text-xs flex items-center gap-0.5 ${dim.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {dim.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(dim.trend).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-400 leading-relaxed">{dim.description}</p>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#2A354D] space-y-1.5">
          {dim.details.map((d, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-gray-400">{d.label}</span>
              <span className={
                d.status === 'good' ? 'text-green-400' :
                d.status === 'warn' ? 'text-yellow-400' : 'text-red-400'
              }>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full text-xs text-blue-400 hover:text-blue-300 transition-colors"
      >
        {expanded ? '收起详情' : '查看详情'}
      </button>
    </div>
  );
}

function TrendChart({ data }: { data: TrendPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const w = 800;
  const h = 240;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const allScores = data.map(d => d.score);
  const minS = Math.min(...allScores) - 5;
  const maxS = Math.max(...allScores) + 5;

  const xStep = (w - padL - padR) / (data.length - 1);
  const yScale = (v: number) => padT + (h - padT - padB) * (1 - (v - minS) / (maxS - minS));

  const path = data.map((d, i) => {
    const x = padL + i * xStep;
    const y = yScale(d.score);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  const areaPath = path + ` L ${padL + (data.length - 1) * xStep},${h - padB} L ${padL},${h - padB} Z`;

  // 网格
  const yGrid = [0, 0.25, 0.5, 0.75, 1].map(p => minS + (maxS - minS) * (1 - p));

  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 网格线 */}
        {yGrid.map((v, i) => (
          <g key={i}>
            <line x1={padL} y1={yScale(v)} x2={w - padR} y2={yScale(v)} stroke="rgba(255,255,255,0.05)" />
            <text x={padL - 8} y={yScale(v) + 4} fill="#64748B" fontSize="11" textAnchor="end">{v.toFixed(0)}</text>
          </g>
        ))}
        {/* 区域 */}
        <path d={areaPath} fill="url(#scoreGrad)" />
        {/* 折线 */}
        <path d={path} fill="none" stroke="#3B82F6" strokeWidth="2.5" />
        {/* 节点 */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={padL + i * xStep}
            cy={yScale(d.score)}
            r={hovered === i ? 5 : 2.5}
            fill="#3B82F6"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          />
        ))}
        {/* X 轴标签 */}
        {data.filter((_, i) => i % 5 === 0 || i === data.length - 1).map((d, i) => {
          const idx = data.findIndex(x => x.date === d.date);
          return (
            <text key={i} x={padL + idx * xStep} y={h - padB + 18} fill="#64748B" fontSize="11" textAnchor="middle">
              {d.date}
            </text>
          );
        })}
      </svg>
      {hovered !== null && (
        <div
          className="absolute bg-[#111625] border border-[#2A354D] rounded px-3 py-2 text-xs pointer-events-none"
          style={{
            left: `${((padL + hovered * xStep) / w) * 100}%`,
            top: '0',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="text-gray-400">{data[hovered].date}</div>
          <div className="text-white font-semibold">综合评分: {data[hovered].score}</div>
          <div className="grid grid-cols-5 gap-2 mt-1 text-[10px]">
            <div className="text-blue-400">资产 {data[hovered].asset}</div>
            <div className="text-orange-400">告警 {data[hovered].alert}</div>
            <div className="text-red-400">漏洞 {data[hovered].vuln}</div>
            <div className="text-green-400">合规 {data[hovered].compliance}</div>
            <div className="text-purple-400">覆盖 {data[hovered].coverage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== 主组件 ==========
export function RiskScoreDashboard() {
  const [dimensions] = useState<DimensionScore[]>(generateDimensions);
  const [trend] = useState<TrendPoint[]>(generateTrend(30));
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 计算综合评分
  const totalScore = useMemo(() => {
    return Math.round(
      dimensions.reduce((acc, d) => acc + d.score * d.weight, 0)
    );
  }, [dimensions]);

  // 评分等级
  const scoreLevel = useMemo(() => {
    if (totalScore >= 80) return { label: '低风险', color: 'green', bg: 'bg-green-500/10', text: 'text-green-400' };
    if (totalScore >= 60) return { label: '中风险', color: 'yellow', bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
    if (totalScore >= 40) return { label: '高风险', color: 'orange', bg: 'bg-orange-500/10', text: 'text-orange-400' };
    return { label: '极高风险', color: 'red', bg: 'bg-red-500/10', text: 'text-red-400' };
  }, [totalScore]);

  // 自动刷新
  useEffect(() => {
    const t = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            网络安全风险综合评分
          </h2>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${scoreLevel.bg} ${scoreLevel.text} border border-current/30`}>
            {scoreLevel.label}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastUpdate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 更新
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-3 py-1.5"
          >
            <option value="7d">近 7 天</option>
            <option value="30d">近 30 天</option>
            <option value="90d">近 90 天</option>
          </select>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            筛选
          </button>
          <button
            onClick={handleRefresh}
            className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            全屏
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* 综合评分主仪表 + 5 维评分 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 主评分 */}
        <div className="lg:col-span-1 bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-4 text-center">综合风险评分（满分 100）</div>
          <div className="flex justify-center">
            <ScoreRing score={totalScore} weight={1} color={scoreLevel.color === 'green' ? 'green' : scoreLevel.color === 'yellow' ? 'orange' : 'red'} size={220} />
          </div>
          <div className="mt-4 text-center text-sm text-gray-300">
            较昨日 <span className={trend[trend.length - 1].score > trend[trend.length - 2].score ? 'text-green-400' : 'text-red-400'}>
              {trend[trend.length - 1].score > trend[trend.length - 2].score ? '↑' : '↓'}
              {Math.abs(trend[trend.length - 1].score - trend[trend.length - 2].score)} 分
            </span>
          </div>
        </div>

        {/* 5 维评分 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {dimensions.map(dim => (
            <DimensionCard key={dim.id} dim={dim} />
          ))}
        </div>
      </div>

      {/* 趋势图 + 高风险资产 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 趋势图 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              综合评分趋势
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                综合评分
              </span>
            </div>
          </div>
          <TrendChart data={trend} />
        </div>

        {/* TOP 5 高风险资产 */}
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              TOP 5 高风险资产
            </h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {mockHighRiskAssets.map((a, i) => (
              <div key={a.id} className="bg-[#111625] rounded p-3 hover:bg-[#20293F]/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">#{i + 1}</span>
                      <span className="text-sm text-white font-medium truncate">{a.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.type} · {a.location}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {a.issues.map((iss, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          {iss}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-lg font-bold text-red-400">{a.riskScore}</div>
                    <div className="text-[10px] text-gray-500">风险分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 关键指标快览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '活跃告警', value: '257', change: '-12', color: 'orange', icon: <AlertCircle className="w-4 h-4" /> },
          { label: '未修复高危漏洞', value: '32', change: '+3', color: 'red', icon: <Bug className="w-4 h-4" /> },
          { label: '基线合规率', value: '82.3%', change: '+0.5%', color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: '安全产品覆盖', value: '74.1%', change: '-1.2%', color: 'purple', icon: <Target className="w-4 h-4" /> },
        ].map((s, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span className={`text-${s.color}-400`}>{s.icon}</span>
              {s.label}
            </div>
            <div className="text-2xl font-bold text-white mt-2">{s.value}</div>
            <div className={`text-xs mt-1 ${s.change.startsWith('-') || s.change.startsWith('+') && !s.change.endsWith('高') ? 'text-gray-500' : 'text-green-400'}`}>
              较昨日 {s.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RiskScoreDashboard;

'use client';

import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus, RefreshCw, Activity, Target, Layers, Shield, Wifi, BarChart3 } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';
import { useMounted } from '@/hooks/useMounted';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface RiskScoreCenterProps {
  open: boolean;
  onClose: () => void;
}

const DIMENSION_ICONS: Record<string, any> = {
  asset: Target,
  alert: Activity,
  vuln: Shield,
  compliance: Layers,
  coverage: Wifi,
};

const DIMENSION_COLORS: Record<string, string> = {
  asset: '#3B82F6',
  alert: '#EF4444',
  vuln: '#F97316',
  compliance: '#A855F7',
  coverage: '#22C55E',
};

/**
 * 风险评分中心（5 维 + 趋势 + 智能体贡献）
 * - 完整 UI（替代 TopHeader 占位）
 * - 5 维雷达图 + 30 日趋势 + 智能体贡献列表
 * - 与事件总线集成：完成业务事件可触发评分重算
 */
export function RiskScoreCenter({ open, onClose }: RiskScoreCenterProps) {
  const { riskSnapshot, riskHistory, isCalculatingRisk, recalculateRiskScore, dispatchBusEvent } = useSystem();
  const mounted = useMounted();

  if (!open) return null;

  const levelColor =
    riskSnapshot?.level === 'critical'
      ? 'text-red-400'
      : riskSnapshot?.level === 'high'
      ? 'text-orange-400'
      : riskSnapshot?.level === 'medium'
      ? 'text-yellow-400'
      : riskSnapshot?.level === 'low'
      ? 'text-blue-400'
      : 'text-green-400';

  // 30 日历史（模拟数据叠加真实 history）
  const fullTrend = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const base = 30 + Math.sin(i / 4) * 10 + Math.random() * 8;
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      score: Math.round(base),
    };
  });

  const radarData = riskSnapshot?.dimensions.map((d) => ({
    dimension: d.name,
    score: d.score,
  })) || [];

  const delta = riskSnapshot?.delta;
  const DeltaIcon = delta?.trend === 'up' ? TrendingUp : delta?.trend === 'down' ? TrendingDown : Minus;
  const deltaColor = delta?.trend === 'up' ? 'text-red-400' : delta?.trend === 'down' ? 'text-green-400' : 'text-app-text-muted';

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-[900px] max-w-[96vw] max-h-[88vh] bg-app-bg-card border border-app-border-base rounded-xl flex flex-col theme-transition"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-app-border-base">
          <div>
            <h2 className="text-lg font-semibold text-app-text-primary">风险评分中心</h2>
            <p className="text-[10px] text-app-text-muted mt-0.5">
              5 维动态评分 · 自动重算 · 智能体协同
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => recalculateRiskScore('manual')}
              disabled={isCalculatingRisk}
              className="flex items-center gap-1.5 px-3 h-8 bg-app-bg-surface border border-app-border-base rounded-md text-xs text-app-text-primary hover:border-app-text-secondary transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isCalculatingRisk ? 'animate-spin' : ''}`} />
              重新计算
            </button>
            <button
              onClick={() => {
                // 演示：派发一个 agent.completed 事件，触发评分变化
                dispatchBusEvent({
                  type: 'agent.completed',
                  source: 'agent',
                  payload: { agentId: 'demo-agent', result: { alertCount: 3, vulnsFixed: 2 } },
                } as any);
                setTimeout(() => recalculateRiskScore('event'), 200);
              }}
              className="flex items-center gap-1.5 px-3 h-8 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-md text-xs hover:bg-cyan-500/30 transition-colors"
            >
              <Activity className="w-3 h-3" />
              模拟智能体
            </button>
            <button onClick={onClose} className="p-1 rounded hover:bg-app-bg-surface">
              <X className="w-4 h-4 text-app-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 总分卡片 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 p-5 bg-app-bg-deep border border-app-border-base rounded-xl">
              <p className="text-xs text-app-text-muted">当前总分</p>
              <div className="flex items-end gap-2 mt-1">
                <span className={`text-5xl font-bold ${levelColor}`}>{riskSnapshot?.totalScore ?? 0}</span>
                <span className="text-sm text-app-text-muted pb-2">/ 100</span>
              </div>
              {mounted && delta && (
                <div className={`flex items-center gap-1 mt-2 text-xs ${deltaColor}`}>
                  <DeltaIcon className="w-3 h-3" />
                  {delta.score > 0 ? '+' : ''}{delta.score} vs 上次
                </div>
              )}
              <p className={`text-sm font-medium mt-3 ${levelColor}`}>
                {riskSnapshot?.levelLabel ?? '计算中...'}
              </p>
            </div>
            <div className="col-span-2 p-5 bg-app-bg-deep border border-app-border-base rounded-xl">
              <h3 className="text-sm font-medium text-app-text-primary mb-3 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />5 维评分
              </h3>
              <div className="space-y-2.5">
                {(riskSnapshot?.dimensions || []).map((d) => {
                  const Icon = DIMENSION_ICONS[d.key] || Activity;
                  const color = DIMENSION_COLORS[d.key] || '#3B82F6';
                  return (
                    <div key={d.key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3 h-3" style={{ color }} />
                          <span className="text-xs text-app-text-primary">{d.name}</span>
                          <span className="text-[10px] text-app-text-muted">({d.source})</span>
                        </div>
                        <span className="text-xs font-mono text-app-text-primary">{d.score}/100</span>
                      </div>
                      <div className="h-1.5 bg-app-bg-card rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: d.score + '%', background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 趋势 + 雷达 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-app-bg-deep border border-app-border-base rounded-xl">
              <h3 className="text-sm font-medium text-app-text-primary mb-3">30 日趋势</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={fullTrend}>
                  <defs>
                    <linearGradient id="risk-trend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} interval={5} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="url(#risk-trend)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-app-bg-deep border border-app-border-base rounded-xl">
              <h3 className="text-sm font-medium text-app-text-primary mb-3">5 维覆盖</h3>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2A354D" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <PolarRadiusAxis tick={{ fill: '#6B7280', fontSize: 9 }} domain={[0, 100]} />
                    <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-app-text-muted">计算中...</div>
              )}
            </div>
          </div>

          {/* 智能体贡献 */}
          {riskSnapshot?.agentContributions && riskSnapshot.agentContributions.length > 0 && (
            <div className="p-4 bg-app-bg-deep border border-app-border-base rounded-xl">
              <h3 className="text-sm font-medium text-app-text-primary mb-3 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-purple-400" />智能体贡献（{riskSnapshot.agentContributions.length} 个）
              </h3>
              <div className="space-y-2">
                {riskSnapshot.agentContributions.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-app-bg-card rounded">
                    <div className="w-1.5 h-8 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-xs text-app-text-primary">{a.agentName}</p>
                      <p className="text-[10px] text-app-text-muted">影响维度: {a.dimension}</p>
                    </div>
                    <span className={`text-xs font-mono ${a.impact > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {a.impact > 0 ? '+' : ''}{a.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 最近计算历史 */}
          <div className="p-4 bg-app-bg-deep border border-app-border-base rounded-xl">
            <h3 className="text-sm font-medium text-app-text-primary mb-3">最近计算历史</h3>
            <div className="space-y-1.5">
              {(riskHistory.snapshots || []).slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-app-text-muted font-mono w-44">{new Date(s.timestamp).toLocaleString('zh-CN', { hour12: false })}</span>
                  <span className="px-1.5 py-0.5 rounded bg-app-bg-card text-app-text-secondary text-[10px]">{s.trigger}</span>
                  <span className="text-app-text-primary ml-auto font-mono">{s.score}/100 · {s.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskScoreCenter;

'use client';

import { useSystem } from '@/contexts/SystemContext';
import { RefreshCw, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { getDimensionContributions } from '@/services/riskEngine';

export function RiskScoreCard() {
  const {
    riskSnapshot,
    isCalculatingRisk,
    recalculateRiskScore,
  } = useSystem();

  if (!riskSnapshot) {
    return (
      <div className="px-4 py-3">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="text-center text-slate-400 text-sm py-4">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            正在计算风险评分...
          </div>
        </div>
      </div>
    );
  }

  const { totalScore, level, levelLabel, dimensions, delta, calculatedAt, trigger } = riskSnapshot;
  const contributions = getDimensionContributions(riskSnapshot);

  // 颜色配置
  const colorMap: Record<string, { bg: string; text: string; bar: string; ring: string }> = {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', bar: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
    green: { bg: 'bg-green-500', text: 'text-green-400', bar: 'bg-green-500', ring: 'ring-green-500/30' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', bar: 'bg-yellow-500', ring: 'ring-yellow-500/30' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-400', bar: 'bg-orange-500', ring: 'ring-orange-500/30' },
    red: { bg: 'bg-red-500', text: 'text-red-400', bar: 'bg-red-500', ring: 'ring-red-500/30' },
  };

  // 根据分数获取颜色
  const getColorByScore = (score: number) => {
    if (score <= 20) return colorMap.emerald;
    if (score <= 40) return colorMap.green;
    if (score <= 60) return colorMap.yellow;
    if (score <= 80) return colorMap.orange;
    return colorMap.red;
  };

  const colors = getColorByScore(totalScore);
  const DeltaIcon = delta?.trend === 'up' ? TrendingUp : delta?.trend === 'down' ? TrendingDown : Minus;

  // 触发器标签
  const triggerLabels: Record<string, string> = {
    initial: '初始计算',
    manual: '手动触发',
    scheduled: '定时计算',
    event: '事件触发',
  };

  return (
    <div className="px-4 py-3">
      <div className={`bg-slate-800/50 rounded-lg p-4 border border-slate-700 ring-1 ${colors.ring}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider">系统风险评分</span>
          <div className="flex items-center gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} text-white`}>
              {levelLabel}
            </span>
            <button
              onClick={() => recalculateRiskScore('manual')}
              disabled={isCalculatingRisk}
              className="p-1 rounded hover:bg-slate-700 transition-colors disabled:opacity-50"
              title="重新计算"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isCalculatingRisk ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-4xl font-bold ${colors.text}`}>{totalScore}</span>
          <span className="text-slate-500 text-sm">/ 100</span>
          {delta && (
            <span className={`text-xs flex items-center gap-0.5 ml-2 ${
              delta.trend === 'up' ? 'text-red-400' :
              delta.trend === 'down' ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              <DeltaIcon className="w-3 h-3" />
              {delta.score > 0 ? '+' : ''}{delta.score}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
            style={{ width: `${totalScore}%` }}
          />
        </div>

        {/* Dimensions Breakdown */}
        <div className="space-y-1.5 mb-3">
          {contributions.map((c) => {
            const dimColor = getColorByScore(c.score);
            return (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 w-16 truncate">{c.name}</span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dimColor.bar} transition-all duration-500`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
                <span className={`${dimColor.text} w-7 text-right tabular-nums`}>
                  {c.score}
                </span>
                <span className="text-slate-500 w-8 text-right tabular-nums">
                  ×{c.weight}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-slate-700 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>触发: {triggerLabels[trigger]}</span>
            <span>权重: 资产30% · 告警25% · 漏洞20% · 合规15% · 覆盖10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
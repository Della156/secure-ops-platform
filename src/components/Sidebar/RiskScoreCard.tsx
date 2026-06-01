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
        <div className="bg-[#181F32]/50 rounded-lg p-4 border border-[#2A354D]">
          <div className="text-center text-[#9CA3AF] text-sm py-4">
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
    emerald: { bg: 'bg-[#00C853]', text: 'text-[#00C853]', bar: 'bg-[#00C853]', ring: 'ring-emerald-500/30' },
    green: { bg: 'bg-[#00C853]', text: 'text-[#00C853]', bar: 'bg-[#00C853]', ring: 'ring-green-500/30' },
    yellow: { bg: 'bg-[#FF9100]', text: 'text-[#FF9100]', bar: 'bg-[#FF9100]', ring: 'ring-yellow-500/30' },
    orange: { bg: 'bg-[#FF9100]', text: 'text-[#FF9100]', bar: 'bg-[#FF9100]', ring: 'ring-orange-500/30' },
    red: { bg: 'bg-[#FF3B30]', text: 'text-[#FF3B30]', bar: 'bg-[#FF3B30]', ring: 'ring-red-500/30' },
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
      <div className={`bg-[#181F32]/50 rounded-lg p-4 border border-[#2A354D] ring-1 ${colors.ring}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#9CA3AF] uppercase tracking-wider">系统风险评分</span>
          <div className="flex items-center gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} text-[#F3F4F6]`}>
              {levelLabel}
            </span>
            <button
              onClick={() => recalculateRiskScore('manual')}
              disabled={isCalculatingRisk}
              className="p-1 rounded hover:bg-[#2A354D] transition-colors disabled:opacity-50"
              title="重新计算"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#9CA3AF] ${isCalculatingRisk ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-4xl font-bold ${colors.text}`}>{totalScore}</span>
          <span className="text-[#6B7280] text-sm">/ 100</span>
          {delta && (
            <span className={`text-xs flex items-center gap-0.5 ml-2 ${
              delta.trend === 'up' ? 'text-[#FF3B30]' :
              delta.trend === 'down' ? 'text-[#00C853]' : 'text-[#9CA3AF]'
            }`}>
              <DeltaIcon className="w-3 h-3" />
              {delta.score > 0 ? '+' : ''}{delta.score}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[#2A354D] rounded-full overflow-hidden mb-3">
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
                <span className="text-[#9CA3AF] w-16 truncate">{c.name}</span>
                <div className="flex-1 h-1.5 bg-[#2A354D] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dimColor.bar} transition-all duration-500`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
                <span className={`${dimColor.text} w-7 text-right tabular-nums`}>
                  {c.score}
                </span>
                <span className="text-[#6B7280] w-8 text-right tabular-nums">
                  ×{c.weight}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-[#2A354D] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>触发: {triggerLabels[trigger]}</span>
            <span>权重: 资产30% · 告警25% · 漏洞20% · 合规15% · 覆盖10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
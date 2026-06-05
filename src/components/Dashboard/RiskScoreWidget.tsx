'use client';

import React from 'react';
import { Gauge } from 'lucide-react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';

const radar = [
  { dimension: '资产', score: 78 },
  { dimension: '告警', score: 65 },
  { dimension: '漏洞', score: 82 },
  { dimension: '合规', score: 70 },
  { dimension: '覆盖', score: 88 },
];

const trend30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 45 + Math.sin(i / 4) * 12 + Math.random() * 6;
  return {
    day: `${d.getMonth() + 1}/${d.getDate()}`,
    score: Math.round(base),
  };
});

/**
 * 风险评分仪表盘 Widget
 * 5 维雷达 + 30 日趋势
 */
export function RiskScoreWidget() {
  const total = 73;
  const level: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  const colorMap: Record<string, string> = { critical: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#22C55E' };
  const color = colorMap[level];
  const labelMap: Record<string, string> = { critical: '高风险', high: '中风险', medium: '中风险', low: '低风险' };
  const label = labelMap[level];

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5 text-orange-400" />风险评分仪表盘
        </h3>
        <span className="text-[10px] text-slate-500">5 维 · 30 日</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-center mb-2">
            <p className="text-4xl font-bold" style={{ color }}>{total}</p>
            <p className="text-[10px] text-slate-500">{label} / 100</p>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <RadarChart data={radar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 9 }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              <Radar dataKey="score" stroke="#F97316" fill="#F97316" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-2">30 日趋势</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={trend30}>
              <defs>
                <linearGradient id="risk-w" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#F97316" fill="url(#risk-w)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RiskScoreWidget;

'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

const INITIAL = [
  { time: '17:00', critical: 12, high: 28, medium: 45, low: 89 },
  { time: '17:05', critical: 18, high: 32, medium: 52, low: 95 },
  { time: '17:10', critical: 15, high: 35, medium: 48, low: 102 },
  { time: '17:15', critical: 22, high: 38, medium: 55, low: 108 },
  { time: '17:20', critical: 19, high: 42, medium: 50, low: 115 },
  { time: '17:25', critical: 25, high: 45, medium: 58, low: 120 },
  { time: '17:30', critical: 21, high: 40, medium: 62, low: 118 },
  { time: '17:35', critical: 28, high: 48, medium: 65, low: 125 },
  { time: '17:40', critical: 32, high: 52, medium: 68, low: 130 },
  { time: '17:45', critical: 35, high: 55, medium: 72, low: 135 },
];

/**
 * 实时威胁态势 Widget（首页大屏）
 * 5 分钟滚动：4 级告警数
 */
export function RealtimeThreatWidget() {
  const [data, setData] = useState(INITIAL);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = {
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
          critical: Math.max(5, last.critical + Math.floor(Math.random() * 6 - 2)),
          high: Math.max(10, last.high + Math.floor(Math.random() * 8 - 3)),
          medium: Math.max(20, last.medium + Math.floor(Math.random() * 10 - 4)),
          low: Math.max(40, last.low + Math.floor(Math.random() * 12 - 5)),
        };
        return [...prev.slice(1), next];
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const total = data[data.length - 1];
  const trend = data.length > 1 ? (total.critical + total.high) - (data[data.length - 2].critical + data[data.length - 2].high) : 0;

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-red-400" />实时威胁态势
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <Zap className="w-2.5 h-2.5 text-yellow-400" />
          {now.toLocaleTimeString('zh-CN', { hour12: false })} · 5 分钟滚动
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: '严重', value: total.critical, color: '#EF4444' },
          { label: '高', value: total.high, color: '#F97316' },
          { label: '中', value: total.medium, color: '#EAB308' },
          { label: '低', value: total.low, color: '#22C55E' },
        ].map((s, i) => (
          <div key={i} className="p-2 bg-[#111625] rounded">
            <p className="text-[10px] text-slate-500">{s.label}</p>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rt-critical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rt-high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 10 }} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
          <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="critical" stroke="#EF4444" fill="url(#rt-critical)" strokeWidth={2} />
          <Area type="monotone" dataKey="high" stroke="#F97316" fill="url(#rt-high)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-between mt-2 text-[10px]">
        <span className="text-slate-500">当前 严重+高 告警</span>
        <span className={`font-mono font-bold ${trend > 0 ? 'text-red-400' : trend < 0 ? 'text-green-400' : 'text-slate-500'}`}>
          {total.critical + total.high} ({trend > 0 ? '+' : ''}{trend})
        </span>
      </div>
    </div>
  );
}

export default RealtimeThreatWidget;

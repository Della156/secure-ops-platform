'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ChevronRight, Clock, TrendingUp, Zap, Users, AlertCircle, CheckCircle2, XCircle, Play } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';
import { useMounted } from '@/hooks/useMounted';
import type { BusinessEvent } from '@/types/eventBus';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

export interface KpiItem {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  delta?: number;
  color: string;
  icon?: any;
}

export interface FlowStep {
  key: string;
  label: string;
  count: number;
  status: 'completed' | 'active' | 'pending' | 'failed';
  /** 跳转到的菜单 ID */
  linkMenuId?: string;
}

export interface ModuleWorkbenchProps {
  /** 模块 ID (menu-1, menu-2 ...) */
  moduleId: string;
  /** 模块标题 */
  title: string;
  /** 副标题 */
  subtitle: string;
  /** 4 个 KPI */
  kpis: KpiItem[];
  /** 业务流（5 步骤） */
  flow: FlowStep[];
  /** 最近 7 日趋势数据 */
  trend: Array<{ day: string; value: number }>;
  /** 推荐快捷入口（点击跳转到对应模块子页） */
  quickEntries: Array<{ label: string; menuId: string; icon?: any; desc?: string }>;
  /** 主题色（dashboard 各模块辨识度） */
  accentColor: string;
}

/**
 * 6 模块统一工作台
 * - 4 KPI + 业务流（5 步） + 7 日趋势 + 快捷入口 + 实时事件流
 * - 业务流步骤可点击跳转
 * - 实时显示事件总线最近 8 条
 */
export function ModuleWorkbench({
  moduleId,
  title,
  subtitle,
  kpis,
  flow,
  trend,
  quickEntries,
  accentColor,
}: ModuleWorkbenchProps) {
  const { setActiveMenu, getEventHistory, highPriorityTodos } = useSystem();
  const [tick, setTick] = useState(0);
  const mounted = useMounted();

  // 每 3 秒刷新一次"实时事件流"模拟
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => setTick((v) => v + 1), 3000);
    return () => clearInterval(t);
  }, [mounted]);

  // 实时事件流
  const recentEvents = useMemo(() => {
    void tick;
    return getEventHistory({ limit: 8 });
  }, [tick, getEventHistory]);

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <div className="w-1.5 h-7 rounded-full" style={{ background: accentColor }} />
            {title}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>
        </div>
      </div>

      {/* 4 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon || Activity;
          return (
            <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{k.label}</span>
                <Icon className="w-3.5 h-3.5" style={{ color: k.color }} />
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</span>
                {k.unit && <span className="text-xs text-slate-500 pb-1">{k.unit}</span>}
              </div>
              {k.delta !== undefined && (
                <div className={`text-[10px] mt-1 flex items-center gap-0.5 ${
                  k.trend === 'up' ? 'text-green-400' : k.trend === 'down' ? 'text-red-400' : 'text-slate-500'
                }`}>
                  {k.trend === 'up' ? '↑' : k.trend === 'down' ? '↓' : '·'} {k.delta > 0 ? '+' : ''}{k.delta} vs 昨日
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 业务流 + 趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* 业务流（5 步） */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" style={{ color: accentColor }} />业务流
          </h3>
          <div className="flex items-center justify-between gap-1">
            {flow.map((step, i) => {
              const isLast = i === flow.length - 1;
              const statusColor =
                step.status === 'completed' ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                step.status === 'active' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 animate-pulse' :
                step.status === 'failed' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                'bg-slate-500/10 border-slate-500/30 text-slate-400';
              return (
                <React.Fragment key={step.key}>
                  <button
                    onClick={() => step.linkMenuId && setActiveMenu(step.linkMenuId)}
                    disabled={!step.linkMenuId}
                    className={`flex-1 min-w-0 p-2.5 rounded-lg border ${statusColor} ${
                      step.linkMenuId ? 'cursor-pointer hover:border-opacity-60' : 'cursor-default'
                    } transition-colors text-center`}
                  >
                    <p className="text-[10px] text-slate-500">步骤 {i + 1}</p>
                    <p className="text-xs font-medium mt-1 truncate">{step.label}</p>
                    <p className="text-sm font-bold mt-1.5">{step.count}</p>
                  </button>
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 7 日趋势 */}
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />7 日趋势
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id={`mwb-${moduleId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke={accentColor} fill={`url(#mwb-${moduleId})`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 快捷入口 + 实时事件流 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />快捷入口
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickEntries.map((e, i) => {
              const Icon = e.icon || ChevronRight;
              return (
                <button
                  key={i}
                  onClick={() => setActiveMenu(e.menuId)}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-[#111625] border border-[#2A354D] hover:border-slate-500/30 transition-colors text-left"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-100 truncate">{e.label}</p>
                    {e.desc && <p className="text-[10px] text-slate-500 truncate mt-0.5">{e.desc}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-purple-400" />实时事件流
            <span className="text-[10px] text-slate-500 font-mono ml-auto">最近 {recentEvents.length} 条</span>
          </h3>
          {recentEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Clock className="w-6 h-6 mx-auto mb-1 opacity-50" />
              <p>暂无事件</p>
              <p className="text-[10px] text-slate-600 mt-1">完成待办 / 触发智能体可产生事件</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[180px] overflow-y-auto">
              {recentEvents.map((ev: BusinessEvent) => (
                <div key={ev.id} className="flex items-start gap-2 p-1.5 rounded bg-[#111625] text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    ev.type.includes('completed') || ev.type.includes('fixed') ? 'bg-green-400' :
                    ev.type.includes('failed') ? 'bg-red-400' :
                    ev.type.includes('created') || ev.type.includes('detected') || ev.type.includes('started') ? 'bg-blue-400' :
                    'bg-cyan-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 truncate">{ev.type}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{new Date(ev.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 高优待办（来自 context 共享） */}
      {highPriorityTodos.length > 0 && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            当前高优待办（{highPriorityTodos.length} 项 · 影响 {moduleId}）
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {highPriorityTodos.slice(0, 3).map((t) => (
              <div key={t.id} className="p-2.5 bg-[#111625] rounded-lg">
                <p className="text-xs text-slate-100 line-clamp-2">{t.title}</p>
                <p className="text-[10px] text-slate-500 mt-1">{t.source} · {t.severity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleWorkbench;

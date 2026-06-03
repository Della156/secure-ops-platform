'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Download, Calendar, TrendingUp, Activity, Clock, CheckCircle2,
  XCircle, AlertCircle, Zap, Server, Target
} from 'lucide-react';

const COLORS = ['#0066FF', '#00C853', '#FF6D00', '#9333EA', '#EAB308', '#06B6D4'];

const dailyData = [
  { name: '06-03', total: 78, success: 67, failed: 8, partial: 3 },
  { name: '06-02', total: 92, success: 84, failed: 6, partial: 2 },
  { name: '06-01', total: 86, success: 78, failed: 5, partial: 3 },
  { name: '05-31', total: 105, success: 96, failed: 7, partial: 2 },
  { name: '05-30', total: 88, success: 80, failed: 5, partial: 3 },
  { name: '05-29', total: 112, success: 103, failed: 6, partial: 3 },
  { name: '05-28', total: 96, success: 88, failed: 4, partial: 4 },
];

const weeklyData = [
  { name: '第22周', total: 580, success: 528, failed: 38, partial: 14 },
  { name: '第21周', total: 612, success: 558, failed: 42, partial: 12 },
  { name: '第20周', total: 595, success: 545, failed: 36, partial: 14 },
  { name: '第19周', total: 568, success: 515, failed: 41, partial: 12 },
  { name: '第18周', total: 624, success: 572, failed: 39, partial: 13 },
];

const monthlyData = [
  { name: '1月', total: 2450, success: 2248, failed: 152, partial: 50 },
  { name: '2月', total: 2280, success: 2092, failed: 142, partial: 46 },
  { name: '3月', total: 2680, success: 2458, failed: 168, partial: 54 },
  { name: '4月', total: 2520, success: 2314, failed: 152, partial: 54 },
  { name: '5月', total: 2740, success: 2518, failed: 162, partial: 60 },
  { name: '6月', total: 880, success: 808, failed: 52, partial: 20 },
];

const trendData = [
  { name: '06-03 06:00', success: 95, target: 98 },
  { name: '07:00', success: 96, target: 98 },
  { name: '08:00', success: 92, target: 98 },
  { name: '09:00', success: 97, target: 98 },
  { name: '10:00', success: 98, target: 98 },
  { name: '11:00', success: 94, target: 98 },
  { name: '12:00', success: 96, target: 98 },
  { name: '13:00', success: 98, target: 98 },
  { name: '14:00', success: 97, target: 98 },
];

const durationData = [
  { range: '< 1分钟', count: 124, pct: 32 },
  { range: '1-5分钟', count: 86, pct: 22 },
  { range: '5-15分钟', count: 67, pct: 17 },
  { range: '15-60分钟', count: 52, pct: 13 },
  { range: '1-4小时', count: 38, pct: 10 },
  { range: '> 4小时', count: 23, pct: 6 },
];

const typeData = [
  { name: '安全扫描', value: 156, color: '#0066FF' },
  { name: '基线检查', value: 128, color: '#00C853' },
  { name: '漏洞修复', value: 86, color: '#FF6D00' },
  { name: '资产发现', value: 72, color: '#9333EA' },
  { name: '日志分析', value: 45, color: '#EAB308' },
  { name: '其他', value: 28, color: '#06B6D4' },
];

const topTasks = [
  { name: '夜间日志聚合分析', count: 30, successRate: 100, avgTime: '1h24m' },
  { name: '核心服务器基线检查', count: 28, successRate: 96.4, avgTime: '17m' },
  { name: '新接入终端发现', count: 25, successRate: 92, avgTime: '8m' },
  { name: '主机补丁批量分发', count: 22, successRate: 86, avgTime: '1h45m' },
  { name: '数据库配置定期备份', count: 21, successRate: 100, avgTime: '9m' },
];

const topFailed = [
  { name: '高危漏洞 CVE-2024-3094 修复', failed: 3, total: 5 },
  { name: '边界防火墙策略同步', failed: 3, total: 4 },
  { name: '主机补丁批量分发', failed: 3, total: 22 },
  { name: 'Web 资产漏洞扫描', failed: 2, total: 18 },
  { name: '暂停的渗透测试', failed: 2, total: 8 },
];

export function TaskRunStatistics() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const data = period === 'day' ? dailyData : period === 'week' ? weeklyData : monthlyData;

  const totals = useMemo(() => {
    const total = data.reduce((s, d) => s + d.total, 0);
    const success = data.reduce((s, d) => s + d.success, 0);
    const failed = data.reduce((s, d) => s + d.failed, 0);
    const partial = data.reduce((s, d) => s + d.partial, 0);
    return { total, success, failed, partial, successRate: ((success / total) * 100).toFixed(1) };
  }, [data]);

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">任务运行统计分析</h2>
            <p className="text-xs text-slate-500 mt-1">任务执行情况的多维度统计分析</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-[#111625] border border-[#2A354D] rounded-md overflow-hidden">
              {(['day', 'week', 'month'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs ${period === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {p === 'day' ? '按日' : p === 'week' ? '按周' : '按月'}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Calendar className="w-3.5 h-3.5" />自定义
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出报表
            </button>
          </div>
        </div>
      </div>

      {/* 4 个 KPI 卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="任务执行总数" value={totals.total} sub="本期累计" color="#0066FF" icon={<Server className="w-4 h-4" />} trend="+12.5%" />
        <KPI label="成功数" value={totals.success} sub="完成归档" color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} trend="+8.3%" />
        <KPI label="成功率" value={`${totals.successRate}%`} sub="较上期" color="#00C853" icon={<TrendingUp className="w-4 h-4" />} trend="+1.2%" />
        <KPI label="失败数" value={totals.failed} sub="需关注" color="#EF4444" icon={<XCircle className="w-4 h-4" />} trend="-3.4%" />
      </div>

      {/* 主图表：执行次数 + 成功率趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">任务执行情况</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded" />总数</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-500 rounded" />成功</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded" />失败</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#2A354D' }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#2A354D' }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} labelStyle={{ color: '#94A3B8' }} />
              <Bar dataKey="success" fill="#00C853" stackId="a" />
              <Bar dataKey="partial" fill="#EAB308" stackId="a" />
              <Bar dataKey="failed" fill="#EF4444" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">任务类型分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                {typeData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {typeData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded" style={{ background: d.color }} />{d.name}
                </span>
                <span className="text-slate-200 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 成功率趋势 + 耗时分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">今日成功率趋势</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C853" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: '#2A354D' }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[85, 100]} axisLine={{ stroke: '#2A354D' }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="success" stroke="#00C853" strokeWidth={2} fill="url(#successGrad)" />
              <Line type="monotone" dataKey="target" stroke="#EAB308" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">任务耗时分布</h3>
          <div className="space-y-2.5 mt-3">
            {durationData.map(d => (
              <div key={d.range}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{d.range}</span>
                  <span className="text-slate-400 font-mono">{d.count} 次 · {d.pct}%</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${d.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 高频/高失败 表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">TOP 5 高频任务</h3>
          <table className="w-full text-xs">
            <thead className="text-slate-500 text-[10px]">
              <tr>
                <th className="text-left py-1.5">#</th>
                <th className="text-left py-1.5">任务名称</th>
                <th className="text-right py-1.5">执行次数</th>
                <th className="text-right py-1.5">成功率</th>
                <th className="text-right py-1.5">平均耗时</th>
              </tr>
            </thead>
            <tbody>
              {topTasks.map((t, i) => (
                <tr key={i} className="border-t border-[#2A354D]">
                  <td className="py-2 text-slate-500">{i + 1}</td>
                  <td className="py-2 text-slate-200">{t.name}</td>
                  <td className="py-2 text-right text-slate-300 font-mono">{t.count}</td>
                  <td className="py-2 text-right">
                    <span className={t.successRate >= 95 ? 'text-green-400' : t.successRate >= 90 ? 'text-yellow-400' : 'text-red-400'}>{t.successRate}%</span>
                  </td>
                  <td className="py-2 text-right text-slate-400 font-mono">{t.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">TOP 5 高失败任务</h3>
          <table className="w-full text-xs">
            <thead className="text-slate-500 text-[10px]">
              <tr>
                <th className="text-left py-1.5">#</th>
                <th className="text-left py-1.5">任务名称</th>
                <th className="text-right py-1.5">失败/总</th>
                <th className="text-right py-1.5">失败率</th>
              </tr>
            </thead>
            <tbody>
              {topFailed.map((t, i) => {
                const rate = ((t.failed / t.total) * 100).toFixed(0);
                return (
                  <tr key={i} className="border-t border-[#2A354D]">
                    <td className="py-2 text-slate-500">{i + 1}</td>
                    <td className="py-2 text-slate-200">{t.name}</td>
                    <td className="py-2 text-right text-slate-300 font-mono">
                      <span className="text-red-400">{t.failed}</span> / {t.total}
                    </td>
                    <td className="py-2 text-right">
                      <span className={Number(rate) >= 50 ? 'text-red-400' : Number(rate) >= 25 ? 'text-orange-400' : 'text-yellow-400'}>{rate}%</span>
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

function KPI({ label, value, sub, color, icon, trend }: { label: string; value: any; sub: string; color: string; icon: React.ReactNode; trend?: string }) {
  const isUp = trend?.startsWith('+');
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-white">{value}</div>
        {trend && (
          <span className={`text-xs ${isUp ? 'text-green-400' : 'text-red-400'}`}>{trend}</span>
        )}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

export default TaskRunStatistics;

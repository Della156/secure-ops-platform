'use client';

import React from 'react';
import { CheckCircle2, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const kpiData = [
  { name: '已处置', value: 156, color: '#22C55E' },
  { name: '处置中', value: 23, color: '#F97316' },
  { name: '待处置', value: 8, color: '#EF4444' },
];

const trend = [
  { day: '周一', handled: 32, created: 38 },
  { day: '周二', handled: 28, created: 35 },
  { day: '周三', handled: 42, created: 40 },
  { day: '周四', handled: 35, created: 32 },
  { day: '周五', handled: 48, created: 45 },
  { day: '周六', handled: 18, created: 22 },
  { day: '周日', handled: 12, created: 15 },
];

/**
 * 事件解决 KPI Widget
 * 处置状态 + 7 日处理 vs 产生
 */
export function IncidentKPIWidget() {
  const total = kpiData.reduce((s, d) => s + d.value, 0);
  const handled = kpiData[0].value;
  const rate = Math.round((handled / total) * 100);

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />事件解决 KPI
        </h3>
        <span className="text-[10px] text-slate-500">本月 187 件</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-slate-500">事件处置率</p>
          <p className="text-2xl font-bold text-green-400">{rate}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{handled} / {total}</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={kpiData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={2}>
                {kpiData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-2">7 日处理 vs 产生</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={trend}>
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="created" fill="#EF4444" name="产生" radius={[3, 3, 0, 0]} />
              <Bar dataKey="handled" fill="#22C55E" name="已处理" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default IncidentKPIWidget;

'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, RadialBarChart, RadialBar, Legend } from 'recharts';

const compliance = [
  { name: '已合规', value: 2547, color: '#22C55E' },
  { name: '部分合规', value: 218, color: '#EAB308' },
  { name: '不合规', value: 82, color: '#EF4444' },
];

const assets = [
  { name: '服务器', total: 856, compliant: 832, color: '#3B82F6' },
  { name: '网络设备', total: 412, compliant: 392, color: '#06B6D4' },
  { name: '安全设备', total: 186, compliant: 178, color: '#A855F7' },
  { name: '终端', total: 1393, compliant: 1145, color: '#F97316' },
];

/**
 * 资产合规状态 Widget
 * 合规分布 + 4 类资产合规率
 */
export function AssetComplianceWidget() {
  const total = compliance.reduce((s, d) => s + d.value, 0);
  const compliant = compliance[0].value;
  const rate = Math.round((compliant / total) * 1000) / 10;

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />资产合规状态
        </h3>
        <span className="text-[10px] text-slate-500">共 {total} 项资产</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-slate-500">合规率</p>
          <p className="text-2xl font-bold text-cyan-400">{rate}%</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={compliance} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} label={({ name, value }: any) => `${name} ${value}`}>
                {compliance.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-2">4 类资产合规</p>
          <div className="space-y-2.5">
            {assets.map((a) => {
              const r = Math.round((a.compliant / a.total) * 100);
              return (
                <div key={a.name}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-slate-300">{a.name}</span>
                    <span className="text-[10px] font-mono" style={{ color: a.color }}>{r}%</span>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: r + '%', background: a.color }} />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">{a.compliant} / {a.total}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetComplianceWidget;

'use client';

import React, { useState } from 'react';
import { Download, RefreshCw, FileText, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const reportData = {
  period: '2026-06-01 至 2026-06-03',
  totalTasks: 45,
  successRate: 93.3,
  avgTime: '2.8 分钟',
  virusTypes: [
    { name: '挖矿木马', count: 15, color: '#FF6D00' },
    { name: '勒索软件', count: 12, color: '#EF4444' },
    { name: '木马', count: 10, color: '#EAB308' },
    { name: '蠕虫', count: 5, color: '#22C55E' },
    { name: '其他', count: 3, color: '#9333EA' },
  ],
  infectionTop: [
    { name: '办公终端区', count: 18 },
    { name: 'Web 服务器', count: 12 },
    { name: '数据库服务器', count: 8 },
    { name: '文件服务器', count: 5 },
    { name: '测试环境', count: 2 },
  ],
  dailyTrend: [
    { date: '06-01', count: 12 },
    { date: '06-02', count: 18 },
    { date: '06-03', count: 15 },
  ],
};

export function VirusReport() {
  const [period, setPeriod] = useState('7d');

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">病毒处置任务报告</h2>
            <p className="text-xs text-slate-500 mt-1">包含病毒类型分布、感染TOP N、查杀成功率、处置时效分析</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={period} onChange={e => setPeriod(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
              <option value="1d">过去 1 天</option>
              <option value="7d">过去 7 天</option>
              <option value="30d">过去 30 天</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />下载报告
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总处置任务" value={reportData.totalTasks} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="查杀成功率" value={`${reportData.successRate}%`} color="#22C55E" icon={<TrendingUp className="w-4 h-4" />} />
        <StatBox label="平均处置时间" value={reportData.avgTime} color="#9333EA" icon={<TrendingDown className="w-4 h-4" />} />
        <StatBox label="病毒类型" value={reportData.virusTypes.length} color="#FF6D00" icon={<AlertCircle className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">病毒类型分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={reportData.virusTypes}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {reportData.virusTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">感染热点 TOP 5</h3>
          <div className="space-y-2">
            {reportData.infectionTop.map((item, index) => (
              <div key={index} className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{item.name}</span>
                  <span className="text-xs font-mono text-blue-400">{item.count}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.count / reportData.infectionTop[0].count) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">每日处置趋势</h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={reportData.dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Bar dataKey="count" fill="#0066FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">报告摘要</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>在 <span className="text-blue-400">{reportData.period}</span> 期间，系统共处置 <span className="text-blue-400 font-semibold">{reportData.totalTasks}</span> 次病毒事件。</p>
          <p>主要威胁类型为 <span className="text-orange-400">挖矿木马</span>、<span className="text-red-400">勒索软件</span> 和 <span className="text-yellow-400">普通木马</span>。</p>
          <p>查杀成功率达到 <span className="text-green-400 font-semibold">{reportData.successRate}%</span>，平均处置时间为 <span className="text-purple-400 font-semibold">{reportData.avgTime}</span>。</p>
          <p>需要重点关注 <span className="text-red-400">办公终端区</span> 和 <span className="text-orange-400">Web 服务器</span> 的病毒防护。</p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default VirusReport;

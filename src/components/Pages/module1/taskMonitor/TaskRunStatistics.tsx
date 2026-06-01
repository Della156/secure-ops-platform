'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar } from 'lucide-react';

const dailyData = [
  { name: '06-01', total: 45, success: 38, failed: 7 },
  { name: '05-31', total: 52, success: 48, failed: 4 },
  { name: '05-30', total: 48, success: 42, failed: 6 },
  { name: '05-29', total: 60, success: 55, failed: 5 },
  { name: '05-28', total: 42, success: 38, failed: 4 },
  { name: '05-27', total: 50, success: 45, failed: 5 },
  { name: '05-26', total: 47, success: 43, failed: 4 },
];

const weeklyData = [
  { name: '第22周', total: 310, success: 280, failed: 30 },
  { name: '第21周', total: 295, success: 268, failed: 27 },
  { name: '第20周', total: 320, success: 295, failed: 25 },
  { name: '第19周', total: 285, success: 260, failed: 25 },
];

const monthlyData = [
  { name: '1月', total: 1250, success: 1120, failed: 130 },
  { name: '2月', total: 1180, success: 1080, failed: 100 },
  { name: '3月', total: 1320, success: 1200, failed: 120 },
  { name: '4月', total: 1280, success: 1160, failed: 120 },
  { name: '5月', total: 1350, success: 1230, failed: 120 },
  { name: '6月', total: 450, success: 410, failed: 40 },
];

const durationData = [
  { name: '0-5min', count: 28 },
  { name: '5-15min', count: 45 },
  { name: '15-30min', count: 32 },
  { name: '30-60min', count: 18 },
  { name: '60min+', count: 12 },
];

const pieData = [
  { name: '成功', value: 38, color: '#22c55e' },
  { name: '失败', value: 7, color: '#ef4444' },
];

export function TaskRunStatistics() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

  const currentData = period === 'day' ? dailyData : period === 'week' ? weeklyData : monthlyData;

  const handleExport = () => {
    alert('正在导出统计报表...');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务运行统计分析</h1>
        <p className="text-slate-400">分析和展示任务执行的统计数据和趋势</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setPeriod('day')}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  period === 'day' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                日
              </button>
              <button
                onClick={() => setPeriod('week')}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  period === 'week' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                周
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  period === 'month' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                月
              </button>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-1">总执行次数</div>
          <div className="text-3xl font-bold text-white">45</div>
          <div className="text-green-400 text-sm mt-1">↑ 12% vs 昨日</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-1">成功次数</div>
          <div className="text-3xl font-bold text-green-400">38</div>
          <div className="text-slate-500 text-sm mt-1">成功率 84.4%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-1">失败次数</div>
          <div className="text-3xl font-bold text-red-400">7</div>
          <div className="text-red-400 text-sm mt-1">↓ 8% vs 昨日</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-1">平均耗时</div>
          <div className="text-3xl font-bold text-blue-400">18min</div>
          <div className="text-slate-500 text-sm mt-1">中位数 12min</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">执行次数趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="total" name="总执行" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="失败" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">成功率趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData.map(d => ({
              ...d,
              rate: Math.round((d.success / d.total) * 100)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[70, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Line type="monotone" dataKey="rate" name="成功率(%)" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">执行耗时分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="任务数" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">执行结果分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

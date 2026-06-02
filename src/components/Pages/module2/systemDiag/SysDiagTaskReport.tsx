'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart2, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const taskData = [
  { date: '05-28', total: 18, success: 15, failed: 3 },
  { date: '05-29', total: 22, success: 20, failed: 2 },
  { date: '05-30', total: 15, success: 13, failed: 2 },
  { date: '05-31', total: 25, success: 22, failed: 3 },
  { date: '06-01', total: 20, success: 18, failed: 2 },
  { date: '06-02', total: 16, success: 15, failed: 1 },
];

const faultTypeData = [
  { name: '服务异常', value: 35 },
  { name: '进程问题', value: 25 },
  { name: '资源不足', value: 20 },
  { name: '网络故障', value: 15 },
  { name: '其他', value: 5 },
];

const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#6B7280'];

export function SysDiagTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    total: taskData.reduce((sum, d) => sum + d.total, 0),
    success: taskData.reduce((sum, d) => sum + d.success, 0),
    failed: taskData.reduce((sum, d) => sum + d.failed, 0),
    successRate: Math.round((taskData.reduce((sum, d) => sum + d.success, 0) / taskData.reduce((sum, d) => sum + d.total, 0)) * 100),
  };

  const handleExport = () => {
    const data = taskData.map(d => ({
      '日期': d.date,
      '总任务数': d.total,
      '成功': d.success,
      '失败': d.failed,
      '成功率': `${Math.round((d.success / d.total) * 100)}%`
    }));
    const csv = [Object.keys(data[0]).join(','), ...data.map(d => Object.values(d).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-diag-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统故障诊断任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内诊断任务统计分析、故障类型分布统计、报告导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
              />
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">诊断任务总数</p>
              <p className="text-xl font-semibold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功诊断</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">诊断失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">成功率</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">诊断任务趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Line type="monotone" dataKey="total" name="总任务" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="success" name="成功" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="failed" name="失败" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">故障类型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={faultTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {faultTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">诊断任务统计明细</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">总任务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">成功</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">失败</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">成功率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {taskData.map((item) => (
                <tr key={item.date} className="hover:bg-[#2A354D]/30">
                  <td className="px-4 py-3 text-sm text-gray-300">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.total}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.success}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.failed}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 bg-[#111827] rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-green-500" 
                          style={{ width: `${(item.success / item.total) * 100}%` }} 
                        />
                      </div>
                      <span className="text-sm text-gray-400">{Math.round((item.success / item.total) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
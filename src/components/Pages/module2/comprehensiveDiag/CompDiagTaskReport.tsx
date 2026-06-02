'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart2, FileText, TrendingUp, AlertTriangle, CheckCircle, PieChart, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';

const taskData = [
  { date: '05-27', total: 12, success: 10, failed: 2, warning: 0 },
  { date: '05-28', total: 18, success: 15, failed: 2, warning: 1 },
  { date: '05-29', total: 22, success: 20, failed: 1, warning: 1 },
  { date: '05-30', total: 15, success: 13, failed: 1, warning: 1 },
  { date: '05-31', total: 25, success: 22, failed: 2, warning: 1 },
  { date: '06-01', total: 20, success: 18, failed: 1, warning: 1 },
  { date: '06-02', total: 16, success: 14, failed: 1, warning: 1 },
];

const faultTypeData = [
  { name: '网络故障', value: 35, color: '#06b6d4' },
  { name: '服务器异常', value: 28, color: '#3b82f6' },
  { name: '数据库问题', value: 20, color: '#10b981' },
  { name: '安全告警', value: 12, color: '#8b5cf6' },
  { name: '存储性能', value: 5, color: '#f59e0b' },
];

const rootCauseData = [
  { name: '配置错误', value: 30 },
  { name: '资源不足', value: 25 },
  { name: '软件缺陷', value: 20 },
  { name: '网络问题', value: 15 },
  { name: '人为操作', value: 10 },
];

const ROOT_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export function CompDiagTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-05-27', end: '2026-06-02' });

  const stats = {
    total: taskData.reduce((sum, d) => sum + d.total, 0),
    success: taskData.reduce((sum, d) => sum + d.success, 0),
    failed: taskData.reduce((sum, d) => sum + d.failed, 0),
    warning: taskData.reduce((sum, d) => sum + d.warning, 0),
    successRate: Math.round((taskData.reduce((sum, d) => sum + d.success, 0) / taskData.reduce((sum, d) => sum + d.total, 0)) * 100),
  };

  const handleExport = () => {
    const data = taskData.map(d => ({
      '日期': d.date,
      '总任务数': d.total,
      '成功': d.success,
      '失败': d.failed,
      '警告': d.warning,
      '成功率': `${Math.round((d.success / d.total) * 100)}%`
    }));
    const csv = [Object.keys(data[0]).join(','), ...data.map(d => Object.values(d).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-diag-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">综合故障诊断任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">任务统计分析、故障类型分布、根因分析统计、报告导出</p>
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
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              导出报告
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A455D] text-gray-300 rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              生成PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-xs">诊断任务总数</p>
          </div>
          <p className="text-2xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-xs">成功诊断</p>
          </div>
          <p className="text-2xl font-semibold text-green-400">{stats.success}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-xs">警告</p>
          </div>
          <p className="text-2xl font-semibold text-yellow-400">{stats.warning}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-gray-400 text-xs">诊断失败</p>
          </div>
          <p className="text-2xl font-semibold text-red-400">{stats.failed}</p>
        </div>
        <div className="bg-[#1E2736] border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <p className="text-gray-400 text-xs">成功率</p>
          </div>
          <p className="text-2xl font-semibold text-cyan-400">{stats.successRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-300">诊断任务趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" name="总任务" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="success" name="成功" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="failed" name="失败" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-medium text-gray-300">故障类型分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RePieChart>
              <Pie
                data={faultTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {faultTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-medium text-gray-300">根因分析统计</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RePieChart>
              <Pie
                data={rootCauseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {rootCauseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ROOT_COLORS[index % ROOT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">关键指标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">平均诊断时间</span>
                <span className="text-sm text-white font-medium">18.5 分钟</span>
              </div>
              <div className="w-full bg-[#111827] rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">根因识别准确率</span>
                <span className="text-sm text-white font-medium">92.3%</span>
              </div>
              <div className="w-full bg-[#111827] rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">问题修复率</span>
                <span className="text-sm text-white font-medium">87.6%</span>
              </div>
              <div className="w-full bg-[#111827] rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">重复故障发生率</span>
                <span className="text-sm text-white font-medium">5.2%</span>
              </div>
              <div className="w-full bg-[#111827] rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">诊断任务统计明细</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">总任务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">成功</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">警告</th>
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
                  <td className="px-4 py-3 text-sm text-yellow-400">{item.warning}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.failed}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 bg-[#111827] rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500" 
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

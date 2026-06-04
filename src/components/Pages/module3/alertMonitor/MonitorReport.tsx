'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const reportData = {
  summary: {
    totalAlerts: 12580,
    processedAlerts: 11245,
    pendingAlerts: 1335,
    successRate: 89.3,
  },
  hourlyData: [
    { hour: '00:00', count: 320 },
    { hour: '04:00', count: 180 },
    { hour: '08:00', count: 560 },
    { hour: '12:00', count: 720 },
    { hour: '16:00', count: 890 },
    { hour: '20:00', count: 650 },
    { hour: '24:00', count: 420 },
  ],
  alertTypeData: [
    { name: '攻击', value: 3520, fill: '#EF4444' },
    { name: '异常', value: 4680, fill: '#F59E0B' },
    { name: '警告', value: 2890, fill: '#3B82F6' },
    { name: '信息', value: 1490, fill: '#22C55E' },
  ],
  dailyData: [
    { day: '周一', alerts: 1850, processed: 1680 },
    { day: '周二', alerts: 2100, processed: 1950 },
    { day: '周三', alerts: 1680, processed: 1520 },
    { day: '周四', alerts: 2450, processed: 2280 },
    { day: '周五', alerts: 1920, processed: 1780 },
    { day: '周六', alerts: 1280, processed: 1150 },
    { day: '周日', alerts: 1300, processed: 1185 },
  ],
};

export function MonitorReport() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">告警辅助监测任务报告</h2>
            <p className="text-sm text-gray-400 mt-1">监测任务统计报告、告警趋势分析、数据导出</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
            >
              <option value="day">今日</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出报告
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-gray-400 text-sm">总告警数</span>
          </div>
          <p className="text-2xl font-semibold text-white">{reportData.summary.totalAlerts.toLocaleString()}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">已处理告警数</span>
          </div>
          <p className="text-2xl font-semibold text-green-400">{reportData.summary.processedAlerts.toLocaleString()}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">待处理告警数</span>
          </div>
          <p className="text-2xl font-semibold text-yellow-400">{reportData.summary.pendingAlerts.toLocaleString()}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">处理成功率</span>
          </div>
          <p className="text-2xl font-semibold text-blue-400">{reportData.summary.successRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            24小时告警趋势
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                <XAxis dataKey="hour" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">告警类型分布</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reportData.alertTypeData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {reportData.alertTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-green-400" />
          每日告警统计
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip />
              <Bar dataKey="alerts" fill="#3B82F6" name="告警数" />
              <Bar dataKey="processed" fill="#22C55E" name="已处理" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
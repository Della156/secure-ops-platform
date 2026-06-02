'use client';

import React, { useState } from 'react';
import { Download, Calendar, Shield, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const taskData = [
  { date: '05-28', ssl: 10, client: 8, codeSign: 3, total: 21 },
  { date: '05-29', ssl: 12, client: 10, codeSign: 5, total: 27 },
  { date: '05-30', ssl: 8, client: 6, codeSign: 2, total: 16 },
  { date: '05-31', ssl: 15, client: 12, codeSign: 4, total: 31 },
  { date: '06-01', ssl: 14, client: 11, codeSign: 6, total: 31 },
  { date: '06-02', ssl: 11, client: 9, codeSign: 3, total: 23 },
];

export function PkiTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalIssued: taskData.reduce((sum, d) => sum + d.total, 0),
    sslCount: taskData.reduce((sum, d) => sum + d.ssl, 0),
    clientCount: taskData.reduce((sum, d) => sum + d.client, 0),
    codeSignCount: taskData.reduce((sum, d) => sum + d.codeSign, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">PKI工单任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内工单任务统计分析（证书发放量、类型）、报告导出</p>
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
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
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
              <p className="text-gray-400 text-xs">证书发放总量</p>
              <p className="text-xl font-semibold text-white">{stats.totalIssued}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">SSL证书</p>
              <p className="text-xl font-semibold text-green-400">{stats.sslCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">客户端证书</p>
              <p className="text-xl font-semibold text-blue-400">{stats.clientCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">代码签名证书</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.codeSignCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">证书发放统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="ssl" name="SSL证书" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="client" name="客户端证书" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="codeSign" name="代码签名" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">发放趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Line type="monotone" dataKey="total" name="发放总量" stroke="#6B7280" strokeWidth={2} />
              <Line type="monotone" dataKey="ssl" name="SSL证书" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="client" name="客户端证书" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
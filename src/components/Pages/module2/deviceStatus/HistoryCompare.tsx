'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Calendar, Download, ArrowRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface CompareData {
  id: string;
  deviceName: string;
  ip: string;
  type: string;
  currentPeriod: {
    score: number;
    normalCount: number;
    abnormalCount: number;
    offlineCount: number;
    checkTime: string;
  };
  previousPeriod: {
    score: number;
    normalCount: number;
    abnormalCount: number;
    offlineCount: number;
  };
  trend: 'up' | 'down' | 'stable';
  changeRate: string;
}

const mockData: CompareData[] = [
  { id: 'DEV-001', deviceName: '核心交换机-CORE-01', ip: '192.168.1.1', type: '交换机', currentPeriod: { score: 92, normalCount: 45, abnormalCount: 3, offlineCount: 0, checkTime: '2026-06-01' }, previousPeriod: { score: 90, normalCount: 43, abnormalCount: 5, offlineCount: 0 }, trend: 'up', changeRate: '+2.2%' },
  { id: 'DEV-002', deviceName: '边界防火墙-FW-01', ip: '192.168.1.254', type: '防火墙', currentPeriod: { score: 88, normalCount: 38, abnormalCount: 2, offlineCount: 0, checkTime: '2026-06-01' }, previousPeriod: { score: 85, normalCount: 36, abnormalCount: 4, offlineCount: 0 }, trend: 'up', changeRate: '+3.5%' },
  { id: 'DEV-003', deviceName: '入侵检测系统-IDS-01', ip: '192.168.1.10', type: 'IDS', currentPeriod: { score: 65, normalCount: 28, abnormalCount: 8, offlineCount: 0, checkTime: '2026-06-01' }, previousPeriod: { score: 73, normalCount: 32, abnormalCount: 4, offlineCount: 0 }, trend: 'down', changeRate: '-11.0%' },
  { id: 'DEV-004', deviceName: 'Web应用防火墙-WAF-01', ip: '192.168.1.20', type: 'WAF', currentPeriod: { score: 95, normalCount: 42, abnormalCount: 1, offlineCount: 0, checkTime: '2026-06-01' }, previousPeriod: { score: 93, normalCount: 40, abnormalCount: 3, offlineCount: 0 }, trend: 'up', changeRate: '+2.2%' },
  { id: 'DEV-005', deviceName: '负载均衡器-LB-01', ip: '192.168.1.30', type: '负载均衡', currentPeriod: { score: 30, normalCount: 8, abnormalCount: 0, offlineCount: 5, checkTime: '2026-06-01' }, previousPeriod: { score: 50, normalCount: 12, abnormalCount: 1, offlineCount: 2 }, trend: 'down', changeRate: '-40.0%' },
  { id: 'DEV-006', deviceName: '数据库服务器-DB-01', ip: '192.168.2.10', type: '服务器', currentPeriod: { score: 72, normalCount: 35, abnormalCount: 5, offlineCount: 0, checkTime: '2026-06-01' }, previousPeriod: { score: 73, normalCount: 36, abnormalCount: 4, offlineCount: 0 }, trend: 'stable', changeRate: '-1.4%' },
  { id: 'DEV-007', deviceName: '应用服务器-APP-01', ip: '192.168.2.20', type: '服务器', currentPeriod: { score: 58, normalCount: 25, abnormalCount: 7, offlineCount: 0, checkTime: '2026-06-01' }, previousPeriod: { score: 70, normalCount: 30, abnormalCount: 2, offlineCount: 0 }, trend: 'down', changeRate: '-17.1%' },
  { id: 'DEV-008', deviceName: '路由器-RT-01', ip: '192.168.0.1', type: '路由器', currentPeriod: { score: 90, normalCount: 40, abnormalCount: 2, offlineCount: 0, checkTime: '2026-06-01' }, previousPeriod: { score: 89, normalCount: 39, abnormalCount: 3, offlineCount: 0 }, trend: 'up', changeRate: '+1.1%' },
];

const chartData = mockData.map(d => ({
  name: d.deviceName.replace(/-.*/, ''),
  previous: d.previousPeriod.score,
  current: d.currentPeriod.score,
  change: d.currentPeriod.score - d.previousPeriod.score,
}));

export function HistoryCompare() {
  const [data] = useState<CompareData[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [compareType, setCompareType] = useState('week');
  const [selectedDevice, setSelectedDevice] = useState<CompareData | null>(null);

  const filteredData = data.filter(d =>
    !searchKeyword || d.deviceName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.ip.includes(searchKeyword)
  );

  const stats = {
    totalDevices: data.length,
    improved: data.filter(d => d.trend === 'up').length,
    declined: data.filter(d => d.trend === 'down').length,
    stable: data.filter(d => d.trend === 'stable').length,
    avgScoreChange: (data.reduce((sum, d) => sum + (d.currentPeriod.score - d.previousPeriod.score), 0) / data.length).toFixed(1),
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const compareTypeLabels: Record<string, string> = { week: '环比上周', month: '环比上月', year: '环比去年同期' };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">历史检查数据环比分析</h2>
        <p className="text-sm text-gray-400 mt-1">与上周/上月/去年同期检查数据进行对比分析，可视化展示对比结果</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">设备总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalDevices}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">环比改善</p>
              <p className="text-xl font-semibold text-green-400">{stats.improved}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">环比下降</p>
              <p className="text-xl font-semibold text-red-400">{stats.declined}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Minus className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">基本持平</p>
              <p className="text-xl font-semibold text-gray-400">{stats.stable}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均评分变化</p>
          <p className={`text-2xl font-semibold mt-1 ${parseFloat(stats.avgScoreChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {parseFloat(stats.avgScoreChange) >= 0 ? '+' : ''}{stats.avgScoreChange}
          </p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索设备名称/IP..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={compareType}
                onChange={(e) => setCompareType(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">环比上周</option>
                <option value="month">环比上月</option>
                <option value="year">环比去年同期</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出对比报告
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">健康度趋势对比</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis type="number" domain={[0, 100]} stroke="#6B7280" />
            <YAxis type="category" dataKey="name" stroke="#6B7280" width={80} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="previous" name="上期评分" fill="#6B7280" radius={[0, 4, 4, 0]} />
            <Bar dataKey="current" name="本期评分" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上期评分</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">本期评分</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变化</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态变化</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((device) => (
                <tr key={device.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#60A5FA] cursor-pointer hover:underline">{device.deviceName}</div>
                    <div className="text-xs text-gray-500">{device.ip}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{device.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-semibold ${getScoreColor(device.previousPeriod.score)}`}>{device.previousPeriod.score}</span>
                      <div className="text-xs text-gray-500 ml-2">
                        <div>正常 {device.previousPeriod.normalCount}</div>
                        <div>异常 {device.previousPeriod.abnormalCount}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-semibold ${getScoreColor(device.currentPeriod.score)}`}>{device.currentPeriod.score}</span>
                      <div className="text-xs text-gray-500 ml-2">
                        <div>正常 {device.currentPeriod.normalCount}</div>
                        <div>异常 {device.currentPeriod.abnormalCount}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(device.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(device.trend)}`}>{device.changeRate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${device.previousPeriod.score >= 70 ? 'bg-green-500/20 text-green-400' : device.previousPeriod.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {device.previousPeriod.score >= 90 ? '优秀' : device.previousPeriod.score >= 70 ? '良好' : device.previousPeriod.score >= 50 ? '一般' : '较差'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span className={`px-2 py-0.5 text-xs rounded-full ${device.currentPeriod.score >= 90 ? 'bg-green-500/20 text-green-400' : device.currentPeriod.score >= 70 ? 'bg-blue-500/20 text-blue-400' : device.currentPeriod.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {device.currentPeriod.score >= 90 ? '优秀' : device.currentPeriod.score >= 70 ? '良好' : device.currentPeriod.score >= 50 ? '一般' : '较差'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedDevice(device)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                      title="查看详情"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      {selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-[700px] max-w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">{selectedDevice.deviceName} - 环比分析详情</h3>
              <button onClick={() => setSelectedDevice(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="h-48 bg-[#111827] rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>详细趋势图表</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111827] rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">上期数据 ({compareTypeLabels[compareType]})</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">健康度评分</span>
                    <span className={`font-semibold ${getScoreColor(selectedDevice.previousPeriod.score)}`}>{selectedDevice.previousPeriod.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">正常设备</span>
                    <span className="text-green-400">{selectedDevice.previousPeriod.normalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">异常设备</span>
                    <span className="text-red-400">{selectedDevice.previousPeriod.abnormalCount}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#111827] rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">本期数据 (当前)</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">健康度评分</span>
                    <span className={`font-semibold ${getScoreColor(selectedDevice.currentPeriod.score)}`}>{selectedDevice.currentPeriod.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">正常设备</span>
                    <span className="text-green-400">{selectedDevice.currentPeriod.normalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">异常设备</span>
                    <span className="text-red-400">{selectedDevice.currentPeriod.abnormalCount}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">环比变化</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(selectedDevice.trend)}
                  <span className={`text-lg font-semibold ${getTrendColor(selectedDevice.trend)}`}>{selectedDevice.changeRate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

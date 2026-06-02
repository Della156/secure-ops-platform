'use client';

import React, { useState } from 'react';
import { Search, Download, TrendingUp, TrendingDown, Minus, Settings, Eye, Activity } from 'lucide-react';

interface DeviceHealthScore {
  id: string;
  name: string;
  ip: string;
  type: string;
  healthScore: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  lastCheckTime: string;
  factors: {
    cpuScore: number;
    memoryScore: number;
    diskScore: number;
    networkScore: number;
    serviceScore: number;
  };
}

const mockData: DeviceHealthScore[] = [
  { id: 'DEV-001', name: '核心交换机-CORE-01', ip: '192.168.1.1', type: '交换机', healthScore: 92, trend: 'stable', trendValue: '0%', lastCheckTime: '2026-06-01 10:30:00', factors: { cpuScore: 95, memoryScore: 90, diskScore: 88, networkScore: 94, serviceScore: 93 } },
  { id: 'DEV-002', name: '边界防火墙-FW-01', ip: '192.168.1.254', type: '防火墙', healthScore: 88, trend: 'up', trendValue: '+3%', lastCheckTime: '2026-06-01 10:28:00', factors: { cpuScore: 85, memoryScore: 88, diskScore: 90, networkScore: 92, serviceScore: 85 } },
  { id: 'DEV-003', name: '入侵检测系统-IDS-01', ip: '192.168.1.10', type: 'IDS', healthScore: 65, trend: 'down', trendValue: '-8%', lastCheckTime: '2026-06-01 10:25:00', factors: { cpuScore: 55, memoryScore: 60, diskScore: 75, networkScore: 70, serviceScore: 65 } },
  { id: 'DEV-004', name: 'Web应用防火墙-WAF-01', ip: '192.168.1.20', type: 'WAF', healthScore: 95, trend: 'up', trendValue: '+2%', lastCheckTime: '2026-06-01 10:26:00', factors: { cpuScore: 98, memoryScore: 95, diskScore: 92, networkScore: 96, serviceScore: 94 } },
  { id: 'DEV-005', name: '负载均衡器-LB-01', ip: '192.168.1.30', type: '负载均衡', healthScore: 30, trend: 'down', trendValue: '-20%', lastCheckTime: '2026-06-01 09:00:00', factors: { cpuScore: 0, memoryScore: 0, diskScore: 0, networkScore: 0, serviceScore: 0 } },
  { id: 'DEV-006', name: '数据库服务器-DB-01', ip: '192.168.2.10', type: '服务器', healthScore: 72, trend: 'stable', trendValue: '-1%', lastCheckTime: '2026-06-01 10:29:00', factors: { cpuScore: 70, memoryScore: 65, diskScore: 80, networkScore: 78, serviceScore: 75 } },
  { id: 'DEV-007', name: '应用服务器-APP-01', ip: '192.168.2.20', type: '服务器', healthScore: 58, trend: 'down', trendValue: '-12%', lastCheckTime: '2026-06-01 10:20:00', factors: { cpuScore: 50, memoryScore: 55, diskScore: 68, networkScore: 60, serviceScore: 58 } },
  { id: 'DEV-008', name: '路由器-RT-01', ip: '192.168.0.1', type: '路由器', healthScore: 90, trend: 'stable', trendValue: '+1%', lastCheckTime: '2026-06-01 10:27:00', factors: { cpuScore: 92, memoryScore: 88, diskScore: 90, networkScore: 91, serviceScore: 89 } },
];

export function HealthAnalysis() {
  const [data] = useState<DeviceHealthScore[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<DeviceHealthScore | null>(null);

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.ip.includes(searchKeyword)
  );

  const stats = {
    avgScore: Math.round(data.reduce((sum, d) => sum + d.healthScore, 0) / data.length),
    excellent: data.filter(d => d.healthScore >= 90).length,
    good: data.filter(d => d.healthScore >= 70 && d.healthScore < 90).length,
    warning: data.filter(d => d.healthScore >= 50 && d.healthScore < 70).length,
    critical: data.filter(d => d.healthScore < 50).length,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-green-500', text: 'text-green-400', label: '优秀' };
    if (score >= 70) return { bg: 'bg-blue-500', text: 'text-blue-400', label: '良好' };
    if (score >= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: '一般' };
    return { bg: 'bg-red-500', text: 'text-red-400', label: '较差' };
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const handleViewDetail = (device: DeviceHealthScore) => {
    setSelectedDevice(device);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">健康度自动分析</h2>
        <p className="text-sm text-gray-400 mt-1">基于检查结果的设备健康度评分模型，展示健康度趋势和评分详情</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均健康度</p>
          <p className={`text-2xl font-semibold mt-1 ${getScoreColor(stats.avgScore).text}`}>{stats.avgScore}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">优秀 (≥90)</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.excellent}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">良好 (70-89)</p>
          <p className="text-2xl font-semibold text-blue-400 mt-1">{stats.good}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">一般 (50-69)</p>
          <p className="text-2xl font-semibold text-yellow-400 mt-1">{stats.warning}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">较差 (&lt;50)</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">{stats.critical}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
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
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#2A354D] text-white rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              评分模型配置
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出报告
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">健康度评分</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">趋势</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">评级</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((device) => {
                const scoreConfig = getScoreColor(device.healthScore);
                return (
                  <tr key={device.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{device.name}</td>
                    <td className="px-4 py-3 text-sm text-white">{device.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{device.ip}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#111827] rounded-full h-2">
                          <div className={`h-2 rounded-full ${scoreConfig.bg}`} style={{ width: `${device.healthScore}%` }} />
                        </div>
                        <span className={`text-sm font-medium ${scoreConfig.text}`}>{device.healthScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(device.trend)}
                        <span className={`text-sm ${device.trend === 'up' ? 'text-green-400' : device.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                          {device.trendValue}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${scoreConfig.bg}/20 ${scoreConfig.text}`}>
                        {scoreConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{device.lastCheckTime}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewDetail(device)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看详情">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="健康度趋势">
                          <Activity className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      {selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-[600px] max-w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">{selectedDevice.name} - 健康度评分详情</h3>
              <button onClick={() => setSelectedDevice(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">综合健康度</span>
                <span className={`text-3xl font-bold ${getScoreColor(selectedDevice.healthScore).text}`}>{selectedDevice.healthScore}</span>
              </div>
              <div className="w-full bg-[#111827] rounded-full h-4">
                <div className={`h-4 rounded-full ${getScoreColor(selectedDevice.healthScore).bg}`} style={{ width: `${selectedDevice.healthScore}%` }} />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-medium">分项评分</h4>
              {Object.entries(selectedDevice.factors).map(([key, value]) => {
                const labels: Record<string, string> = { cpuScore: 'CPU评分', memoryScore: '内存评分', diskScore: '磁盘评分', networkScore: '网络评分', serviceScore: '服务评分' };
                const factorConfig = getScoreColor(value);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-sm">{labels[key]}</span>
                      <span className={`text-sm ${factorConfig.text}`}>{value}</span>
                    </div>
                    <div className="w-full bg-[#111827] rounded-full h-2">
                      <div className={`h-2 rounded-full ${factorConfig.bg}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-[#2A354D]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">设备IP:</span>
                  <span className="text-white ml-2">{selectedDevice.ip}</span>
                </div>
                <div>
                  <span className="text-gray-400">设备类型:</span>
                  <span className="text-white ml-2">{selectedDevice.type}</span>
                </div>
                <div>
                  <span className="text-gray-400">最后检查:</span>
                  <span className="text-white ml-2">{selectedDevice.lastCheckTime}</span>
                </div>
                <div>
                  <span className="text-gray-400">趋势变化:</span>
                  <span className={`ml-2 ${selectedDevice.trend === 'up' ? 'text-green-400' : selectedDevice.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                    {selectedDevice.trendValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

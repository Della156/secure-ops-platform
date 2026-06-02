'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Star, Activity, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ServiceScore {
  id: string;
  serviceName: string;
  healthScore: number;
  availability: number;
  responseTime: number;
  throughput: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
}

const mockData: ServiceScore[] = [
  { id: 'HS-001', serviceName: '用户登录服务', healthScore: 95, availability: 99.9, responseTime: 120, throughput: 1500, trend: 'up', trendValue: '+2.5%' },
  { id: 'HS-002', serviceName: '数据查询服务', healthScore: 92, availability: 99.8, responseTime: 245, throughput: 2300, trend: 'stable', trendValue: '+0.5%' },
  { id: 'HS-003', serviceName: 'API网关服务', healthScore: 78, availability: 99.5, responseTime: 450, throughput: 5000, trend: 'down', trendValue: '-3.2%' },
  { id: 'HS-004', serviceName: '消息队列服务', healthScore: 45, availability: 98.0, responseTime: 1200, throughput: 800, trend: 'down', trendValue: '-8.1%' },
  { id: 'HS-005', serviceName: '缓存服务', healthScore: 98, availability: 100, responseTime: 15, throughput: 8000, trend: 'up', trendValue: '+1.8%' },
];

const chartData = mockData.map(d => ({
  name: d.serviceName.replace(/服务$/, ''),
  score: d.healthScore,
}));

export function HealthScore() {
  const [data] = useState<ServiceScore[]>(mockData);

  const stats = {
    totalServices: data.length,
    avgScore: Math.round(data.reduce((sum, d) => sum + d.healthScore, 0) / data.length),
    avgAvailability: (data.reduce((sum, d) => sum + d.availability, 0) / data.length).toFixed(1),
    avgResponseTime: Math.round(data.reduce((sum, d) => sum + d.responseTime, 0) / data.length),
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { label: '优秀', color: 'bg-green-500/20 text-green-400' };
    if (score >= 70) return { label: '良好', color: 'bg-yellow-500/20 text-yellow-400' };
    if (score >= 50) return { label: '一般', color: 'bg-orange-500/20 text-orange-400' };
    return { label: '较差', color: 'bg-red-500/20 text-red-400' };
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">业务健康度综合评分</h2>
        <p className="text-sm text-gray-400 mt-1">综合评估各业务服务的健康状况，生成健康度评分报告</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">服务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalServices}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均健康度</p>
          <p className={`text-2xl font-semibold mt-1 ${stats.avgScore >= 90 ? 'text-green-400' : stats.avgScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{stats.avgScore}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均可用性</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.avgAvailability}%</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均响应时间</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.avgResponseTime}ms</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">健康度分布</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }} />
            <Bar dataKey="score" name="健康度" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">服务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">健康度评分</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">等级</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">可用性</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">响应时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">吞吐量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">趋势</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const level = getScoreLevel(item.healthScore);
                return (
                  <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white">{item.serviceName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#111827] rounded-full h-2">
                          <div className={`h-2 rounded-full ${item.healthScore >= 90 ? 'bg-green-500' : item.healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.healthScore}%` }} />
                        </div>
                        <span className={`text-lg font-semibold ${getScoreColor(item.healthScore)}`}>{item.healthScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full ${level.color}`}>{level.label}</span></td>
                    <td className="px-4 py-3 text-sm text-green-400">{item.availability}%</td>
                    <td className="px-4 py-3 text-sm text-white">{item.responseTime}ms</td>
                    <td className="px-4 py-3 text-sm text-white">{item.throughput}/s</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>{item.trendValue}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
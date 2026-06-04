'use client';

import React, { useState } from 'react';
import { TrendingUp, Clock, Users, Cpu, AlertTriangle, Flame } from 'lucide-react';

interface Hotspot {
  rank: number;
  apiName: string;
  calls: number;
  avgLatency: number;
  peakTime: string;
  users: number;
  status: 'hot' | 'warm' | 'normal';
}

export function ApiHotspotAnalysis() {
  const [viewMode, setViewMode] = useState<'hotspot' | 'trend'>('hotspot');

  const mockHotspots: Hotspot[] = [
    { rank: 1, apiName: '用户登录API', calls: 25680, avgLatency: 15, peakTime: '09:00-10:00', users: 1250, status: 'hot' },
    { rank: 2, apiName: '资产查询API', calls: 18930, avgLatency: 45, peakTime: '14:00-15:00', users: 890, status: 'hot' },
    { rank: 3, apiName: '告警列表API', calls: 15420, avgLatency: 32, peakTime: '11:00-12:00', users: 670, status: 'hot' },
    { rank: 4, apiName: '威胁情报API', calls: 12350, avgLatency: 89, peakTime: '16:00-17:00', users: 450, status: 'warm' },
    { rank: 5, apiName: '日志查询API', calls: 9870, avgLatency: 156, peakTime: '10:00-11:00', users: 320, status: 'warm' },
    { rank: 6, apiName: '报表生成API', calls: 6540, avgLatency: 234, peakTime: '17:00-18:00', users: 280, status: 'normal' },
    { rank: 7, apiName: '用户数据API', calls: 5430, avgLatency: 23, peakTime: '08:00-09:00', users: 210, status: 'normal' },
    { rank: 8, apiName: '配置管理API', calls: 4320, avgLatency: 45, peakTime: '15:00-16:00', users: 180, status: 'normal' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500/20 text-red-400';
      case 'warm': return 'bg-orange-500/20 text-orange-400';
      case 'normal': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hot': return '热门';
      case 'warm': return '较热';
      case 'normal': return '正常';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">API热点分析与调用趋势</h2>
          <p className="text-sm text-gray-400 mt-1">分析API调用热点，识别高频接口，优化系统性能</p>
        </div>
        <div className="flex items-center gap-1 bg-[#20293F] rounded-lg p-1">
          <button
            onClick={() => setViewMode('hotspot')}
            className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'hotspot' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-[#2A354D]'
            }`}
          >
            <Flame className="w-4 h-4" />
            热点排行
          </button>
          <button
            onClick={() => setViewMode('trend')}
            className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'trend' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-[#2A354D]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            调用趋势
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">热门API数</span>
          </div>
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-xs text-gray-400 mt-1">占比 37.5%</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">活跃用户</span>
          </div>
          <div className="text-2xl font-bold text-white">2,890</div>
          <div className="text-xs text-green-400 mt-1">+15.2% 较昨日</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">峰值时段</span>
          </div>
          <div className="text-2xl font-bold text-white">09:00-10:00</div>
          <div className="text-xs text-gray-400 mt-1">今日峰值</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">最高QPS</span>
          </div>
          <div className="text-2xl font-bold text-white">1,256</div>
          <div className="text-xs text-gray-400 mt-1">用户登录API</div>
        </div>
      </div>

      {viewMode === 'hotspot' ? (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">排名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">API名称</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">调用次数</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">平均延迟</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">峰值时段</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">活跃用户</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">热度</th>
              </tr>
            </thead>
            <tbody>
              {mockHotspots.map((item) => (
                <tr key={item.rank} className="border-t border-[#2A354D] hover:bg-[#111625]">
                  <td className="px-4 py-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      item.rank === 1 ? 'bg-yellow-500 text-black' :
                      item.rank === 2 ? 'bg-gray-400 text-black' :
                      item.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-[#2A354D] text-gray-300'
                    }`}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{item.apiName}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.calls.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.avgLatency}ms</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.peakTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.users.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">7日调用趋势</span>
          </div>
          <div className="flex items-end justify-between h-40 gap-2">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, idx) => {
              const heights = [45, 52, 68, 48, 72, 35, 28];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: `${heights[idx]}%`, minHeight: '8px' }} />
                  <span className="text-xs text-gray-500">{day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2A354D]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-xs text-gray-400">调用次数</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">单位：千次</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiHotspotAnalysis;
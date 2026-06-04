'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Shield, Target, Zap } from 'lucide-react';

const mockThreatTrend = [
  { hour: '08:00', count: 45 },
  { hour: '09:00', count: 62 },
  { hour: '10:00', count: 89 },
  { hour: '11:00', count: 78 },
  { hour: '12:00', count: 56 },
  { hour: '13:00', count: 42 },
  { hour: '14:00', count: 73 },
  { hour: '15:00', count: 95 },
];

const mockTopThreats = [
  { type: 'DDoS攻击', count: 156, trend: '+12%', severity: 'high' },
  { type: '恶意软件', count: 89, trend: '-8%', severity: 'high' },
  { type: 'SQL注入', count: 67, trend: '+5%', severity: 'medium' },
  { type: '钓鱼攻击', count: 45, trend: '+18%', severity: 'medium' },
  { type: '弱口令攻击', count: 32, trend: '-15%', severity: 'low' },
];

const maxCount = Math.max(...mockThreatTrend.map(t => t.count));

export function ThreatSituationDashboard() {
  const [selectedThreat, setSelectedThreat] = useState(mockTopThreats[0]);

  const stats = {
    threatLevel: '中等',
    threatCount: 58,
    attackSource: 12,
    affectedAssets: 8,
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">威胁态势大屏</h1>
          <p className="text-slate-400 mt-1">实时展示威胁态势，掌握安全动态</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-lg">
            <Activity className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">威胁等级: {stats.threatLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">活跃威胁</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.threatCount}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400">+18%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">攻击来源</span>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.attackSource}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-orange-400">+5%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">受影响资产</span>
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.affectedAssets}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">-12%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">威胁情报</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">28</div>
          <div className="text-xs text-purple-400 mt-1">今日更新</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111625] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">威胁趋势</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {mockThreatTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <span className="text-slate-500 text-xs mb-2">{item.count}</span>
                <div 
                  className="w-full bg-gradient-to-t from-red-600 to-orange-400 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-slate-500 text-xs mt-2">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111625] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">威胁类型排行</h3>
          <div className="space-y-4">
            {mockTopThreats.map((threat, index) => (
              <div 
                key={threat.type}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedThreat.type === threat.type ? 'bg-blue-500/20 ring-1 ring-blue-500/40' : 'hover:bg-[#20293F]'
                }`}
                onClick={() => setSelectedThreat(threat)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-orange-600 text-white' : 'bg-[#2A354D] text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{threat.type}</span>
                    <span className={`text-xs flex items-center ${
                      threat.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {threat.trend.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {threat.trend}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      threat.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {threat.severity === 'high' ? '高危' : threat.severity === 'medium' ? '中危' : '低危'}
                    </span>
                    <span className="text-slate-500 text-xs">{threat.count} 次</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import {
  Search, User, MapPin, Clock, Cpu, FileText, Activity, Shield,
  ChevronRight, Download, RefreshCw, Filter, ChevronDown, ChevronUp,
  TrendingUp, AlertCircle, CheckCircle2, Database, Network, Eye,
  Layers, Brain, Target, Calendar, Award, BarChart3, PieChart as PieIcon
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, AreaChart, Area
} from 'recharts';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  dept: string;
  role: string;
  riskScore: number;
  trustLevel: 'high' | 'medium' | 'low';
  totalEvents: number;
  anomalies: number;
  joinedAt: string;
  lastActive: string;
  // 6 维画像数据
  dimensions: {
    login: { score: number; baseline: number };
    workTime: { score: number; baseline: number };
    accessScope: { score: number; baseline: number };
    dataVolume: { score: number; baseline: number };
    commandPattern: { score: number; baseline: number };
    networkBehavior: { score: number; baseline: number };
  };
}

const users: UserProfile[] = [
  {
    id: 'U-001', username: 'zhang.wei', fullName: '张伟', dept: '财务部', role: '财务经理',
    riskScore: 96, trustLevel: 'low', totalEvents: 12485, anomalies: 8, joinedAt: '2018-03-15', lastActive: '2026-06-03 02:18:42',
    dimensions: {
      login: { score: 35, baseline: 90 },
      workTime: { score: 25, baseline: 85 },
      accessScope: { score: 78, baseline: 80 },
      dataVolume: { score: 5, baseline: 70 },
      commandPattern: { score: 88, baseline: 90 },
      networkBehavior: { score: 32, baseline: 85 },
    },
  },
  {
    id: 'U-002', username: 'wang.fang', fullName: '王芳', dept: '研发部', role: '高级工程师',
    riskScore: 82, trustLevel: 'low', totalEvents: 28532, anomalies: 4, joinedAt: '2019-08-20', lastActive: '2026-06-03 06:42:18',
    dimensions: {
      login: { score: 45, baseline: 92 },
      workTime: { score: 75, baseline: 88 },
      accessScope: { score: 85, baseline: 90 },
      dataVolume: { score: 88, baseline: 90 },
      commandPattern: { score: 92, baseline: 90 },
      networkBehavior: { score: 40, baseline: 85 },
    },
  },
  {
    id: 'U-003', username: 'li.na', fullName: '李娜', dept: 'HR 部', role: 'HR 主管',
    riskScore: 78, trustLevel: 'low', totalEvents: 8421, anomalies: 3, joinedAt: '2017-05-10', lastActive: '2026-06-03 09:18:32',
    dimensions: {
      login: { score: 90, baseline: 92 },
      workTime: { score: 40, baseline: 85 },
      accessScope: { score: 55, baseline: 80 },
      dataVolume: { score: 88, baseline: 88 },
      commandPattern: { score: 90, baseline: 90 },
      networkBehavior: { score: 85, baseline: 85 },
    },
  },
  {
    id: 'U-004', username: 'chen.lei', fullName: '陈磊', dept: '研发部', role: '架构师',
    riskScore: 80, trustLevel: 'low', totalEvents: 42185, anomalies: 2, joinedAt: '2015-11-01', lastActive: '2026-06-03 05:12:48',
    dimensions: {
      login: { score: 92, baseline: 92 },
      workTime: { score: 88, baseline: 88 },
      accessScope: { score: 90, baseline: 90 },
      dataVolume: { score: 85, baseline: 85 },
      commandPattern: { score: 35, baseline: 90 },
      networkBehavior: { score: 90, baseline: 88 },
    },
  },
  {
    id: 'U-005', username: 'liu.yang', fullName: '刘洋', dept: '销售部', role: '销售总监',
    riskScore: 28, trustLevel: 'high', totalEvents: 15234, anomalies: 0, joinedAt: '2016-02-20', lastActive: '2026-06-03 18:30:00',
    dimensions: {
      login: { score: 95, baseline: 95 },
      workTime: { score: 90, baseline: 92 },
      accessScope: { score: 88, baseline: 88 },
      dataVolume: { score: 92, baseline: 90 },
      commandPattern: { score: 95, baseline: 95 },
      networkBehavior: { score: 92, baseline: 90 },
    },
  },
];

const dimensionLabels: Record<string, string> = {
  login: '登录行为',
  workTime: '工作时间',
  accessScope: '访问范围',
  dataVolume: '数据流量',
  commandPattern: '命令模式',
  networkBehavior: '网络行为',
};

// 30 天活动热力图数据 (简化为日趋势)
const activityTrend = [
  { day: '05-04', events: 124, anomalies: 0 },
  { day: '05-08', events: 156, anomalies: 1 },
  { day: '05-12', events: 89, anomalies: 0 },
  { day: '05-16', events: 178, anomalies: 0 },
  { day: '05-20', events: 245, anomalies: 0 },
  { day: '05-24', events: 312, anomalies: 1 },
  { day: '05-28', events: 198, anomalies: 0 },
  { day: '06-01', events: 425, anomalies: 2 },
  { day: '06-03', events: 568, anomalies: 3 },
];

export function UserProfileBuilder() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>('U-001');

  const filtered = users.filter(u => u.username.includes(search) || u.fullName.includes(search) || u.dept.includes(search));
  const selected = selectedId ? users.find(u => u.id === selectedId) : null;

  // 准备雷达图数据
  const radarData = selected ? Object.entries(selected.dimensions).map(([key, val]) => ({
    dimension: dimensionLabels[key],
    actual: val.score,
    baseline: val.baseline,
  })) : [];

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">用户画像构建</h2>
            <p className="text-xs text-slate-500 mt-1">UEBA 用户行为基线 · 6 维度画像 · 自动检测偏离</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Brain className="w-3.5 h-3.5" />AI 重建画像
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索用户/姓名/部门"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 用户列表 */}
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">用户列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[640px] overflow-y-auto">
            {filtered.map(u => (
              <div
                key={u.id}
                onClick={() => setSelectedId(u.id)}
                className={`px-3 py-2.5 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === u.id ? 'bg-[#111625]' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    u.trustLevel === 'high' ? 'bg-green-500/20 text-green-400' :
                    u.trustLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {u.fullName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{u.fullName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{u.username} · {u.dept}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-base font-semibold ${u.riskScore >= 80 ? 'text-red-400' : u.riskScore >= 50 ? 'text-orange-400' : 'text-green-400'}`}>
                      {u.riskScore}
                    </div>
                    <div className="text-[9px] text-slate-500">风险</div>
                  </div>
                </div>
                {u.anomalies > 0 && (
                  <div className="mt-1.5 text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />{u.anomalies} 个异常
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 画像详情 */}
        {selected ? (
          <>
            <div className="lg:col-span-3 space-y-4">
              {/* 用户头部 */}
              <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-semibold ${
                      selected.trustLevel === 'high' ? 'bg-green-500/20 text-green-400' :
                      selected.trustLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {selected.fullName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selected.fullName}</h2>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-mono">{selected.username}</span>
                        <span>·</span>
                        <span>{selected.dept}</span>
                        <span>·</span>
                        <span>{selected.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-0.5">综合风险评分</div>
                    <div className={`text-4xl font-bold ${selected.riskScore >= 80 ? 'text-red-400' : selected.riskScore >= 50 ? 'text-orange-400' : 'text-green-400'}`}>
                      {selected.riskScore}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${
                      selected.trustLevel === 'high' ? 'text-green-400' :
                      selected.trustLevel === 'medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      信任度：{selected.trustLevel === 'high' ? '高' : selected.trustLevel === 'medium' ? '中' : '低'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                  <div className="bg-[#111625] rounded p-2">
                    <div className="text-slate-500 mb-0.5">总事件数</div>
                    <div className="text-slate-200 font-mono">{selected.totalEvents.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#111625] rounded p-2">
                    <div className="text-slate-500 mb-0.5">异常数</div>
                    <div className="text-red-400 font-mono">{selected.anomalies}</div>
                  </div>
                  <div className="bg-[#111625] rounded p-2">
                    <div className="text-slate-500 mb-0.5">入职日期</div>
                    <div className="text-slate-200 font-mono text-[10px]">{selected.joinedAt}</div>
                  </div>
                  <div className="bg-[#111625] rounded p-2">
                    <div className="text-slate-500 mb-0.5">最后活跃</div>
                    <div className="text-slate-200 font-mono text-[10px]">{selected.lastActive}</div>
                  </div>
                </div>
              </div>

              {/* 6 维画像雷达图 + 详情 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">6 维行为画像雷达</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2A354D" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                      <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
                      <Radar name="实际" dataKey="actual" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
                      <Radar name="基线" dataKey="baseline" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1} strokeDasharray="4 4" />
                      <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">6 维偏离详情</h3>
                  <div className="space-y-2.5">
                    {Object.entries(selected.dimensions).map(([key, val]) => {
                      const deviation = Math.abs(val.score - val.baseline);
                      const deviationPct = val.baseline > 0 ? ((deviation / val.baseline) * 100).toFixed(0) : 0;
                      const status = val.score >= val.baseline * 0.9 ? 'normal' : val.score >= val.baseline * 0.5 ? 'warn' : 'critical';
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300">{dimensionLabels[key]}</span>
                            <span className="font-mono text-[10px]">
                              <span className={status === 'normal' ? 'text-green-400' : status === 'warn' ? 'text-yellow-400' : 'text-red-400'}>
                                {val.score}
                              </span>
                              <span className="text-slate-600"> / </span>
                              <span className="text-slate-400">{val.baseline}</span>
                              {status !== 'normal' && (
                                <span className="text-red-400 ml-1">↓{deviationPct}%</span>
                              )}
                            </span>
                          </div>
                          <div className="relative h-2 bg-[#111625] rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-slate-500/30 rounded-full"
                              style={{ width: `${val.baseline}%` }}
                            />
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full ${
                                status === 'normal' ? 'bg-green-500' : status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${val.score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 活动趋势 */}
              <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">30 天活动趋势</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={activityTrend}>
                    <defs>
                      <linearGradient id="userActGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                    <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
                    <Area type="monotone" dataKey="events" stroke="#0066FF" strokeWidth={2} fill="url(#userActGrad)" name="事件" />
                    <Line type="monotone" dataKey="anomalies" stroke="#EF4444" strokeWidth={1.5} dot={{ fill: '#EF4444' }} name="异常" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-3 bg-[#20293F] border border-[#2A354D] rounded-lg p-8 text-center text-slate-500 text-sm">
            <User className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            选择一个用户查看画像
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfileBuilder;

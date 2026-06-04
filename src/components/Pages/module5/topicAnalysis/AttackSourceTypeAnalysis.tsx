'use client';

import React, { useState, useMemo } from 'react';
import {
  Crosshair, Globe, BarChart2, PieChart, Search, Filter,
  Download, RefreshCw, Clock, MapPin, AlertTriangle,
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown
} from 'lucide-react';

interface AttackSource {
  id: string;
  ip: string;
  country: string;
  region: string;
  attackCount: number;
  attackTypes: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  lastSeen: string;
  status: 'active' | 'blocked' | 'monitored';
}

interface AttackType {
  type: string;
  count: number;
  percentage: number;
  trend: number;
  color: string;
}

const mockAttackSources: AttackSource[] = [
  { id: 'AS-001', ip: '203.156.89.42', country: '俄罗斯', region: '莫斯科', attackCount: 4823, attackTypes: ['SQL注入', '暴力破解'], riskLevel: 'critical', lastSeen: '12秒前', status: 'active' },
  { id: 'AS-002', ip: '185.220.101.45', country: '德国', region: '柏林', attackCount: 3502, attackTypes: ['CC攻击', 'DDoS'], riskLevel: 'high', lastSeen: '1分钟前', status: 'active' },
  { id: 'AS-003', ip: '45.79.123.18', country: '美国', region: '亚特兰大', attackCount: 2891, attackTypes: ['SSH爆破'], riskLevel: 'high', lastSeen: '2分钟前', status: 'blocked' },
  { id: 'AS-004', ip: '103.224.182.15', country: '中国', region: '香港', attackCount: 2156, attackTypes: ['DDoS', 'SYN Flood'], riskLevel: 'high', lastSeen: '5分钟前', status: 'monitored' },
  { id: 'AS-005', ip: '198.51.100.78', country: '巴西', region: '圣保罗', attackCount: 1823, attackTypes: ['盲注'], riskLevel: 'medium', lastSeen: '8分钟前', status: 'active' },
];

const mockAttackTypes: AttackType[] = [
  { type: 'SQL注入', count: 1245, percentage: 35, trend: +12, color: '#EF4444' },
  { type: '暴力破解', count: 892, percentage: 25, trend: -8, color: '#F59E0B' },
  { type: 'DDoS', count: 678, percentage: 19, trend: +5, color: '#3B82F6' },
  { type: 'XSS', count: 456, percentage: 13, trend: -3, color: '#8B5CF6' },
  { type: 'CC攻击', count: 289, percentage: 8, trend: +2, color: '#EC4899' },
];

function RiskLevelBadge({ level }: { level: AttackSource['riskLevel'] }) {
  const config = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', label: '严重' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: '高' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '低' },
  };
  const { bg, text, label } = config[level];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: AttackSource['status'] }) {
  const config = {
    active: { bg: 'bg-red-500/10', text: 'text-red-400', label: '活跃' },
    blocked: { bg: 'bg-green-500/10', text: 'text-green-400', label: '已阻断' },
    monitored: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '监控中' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

function DonutChart({ data }: { data: AttackType[] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0);
  let currentAngle = 0;
  const size = 140;
  const radius = 50;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {data.map((item, i) => {
        const angle = (item.count / total) * 360;
        const startAngle = (currentAngle * Math.PI) / 180;
        const endAngle = ((currentAngle + angle) * Math.PI) / 180;
        currentAngle += angle;

        const x1 = size / 2 + radius * Math.cos(startAngle);
        const y1 = size / 2 + radius * Math.sin(startAngle);
        const x2 = size / 2 + radius * Math.cos(endAngle);
        const y2 = size / 2 + radius * Math.sin(endAngle);
        const largeArc = angle > 180 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={item.color}
            opacity={0.8}
          />
        );
      })}
      <circle cx={size / 2} cy={size / 2} r={25} fill="#0F172A" />
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        {total.toLocaleString()}
      </text>
      <text x={size / 2} y={size / 2 + 10} textAnchor="middle" fill="#64748B" fontSize="8">
        攻击总数
      </text>
    </svg>
  );
}

export function AttackSourceTypeAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredSources = useMemo(() => {
    return mockAttackSources.filter(source => {
      const matchSearch = source.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.region.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = riskFilter === 'all' || source.riskLevel === riskFilter;
      return matchSearch && matchRisk;
    });
  }, [searchTerm, riskFilter]);

  const stats = useMemo(() => {
    const total = mockAttackTypes.reduce((acc, d) => acc + d.count, 0);
    const critical = mockAttackSources.filter(s => s.riskLevel === 'critical').length;
    const active = mockAttackSources.filter(s => s.status === 'active').length;
    const blocked = mockAttackSources.filter(s => s.status === 'blocked').length;
    return { total, critical, active, blocked };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-red-400" />
            攻击来源与类型分布分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">分析攻击来源地域分布和攻击类型统计</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '攻击总数', value: stats.total.toLocaleString(), icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
          { label: '严重威胁源', value: stats.critical, icon: <Crosshair className="w-4 h-4" />, color: 'orange' },
          { label: '活跃攻击源', value: stats.active, icon: <TrendingUp className="w-4 h-4" />, color: 'yellow' },
          { label: '已阻断', value: stats.blocked, icon: <TrendingDown className="w-4 h-4" />, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            攻击类型分布
          </h3>
          <div className="flex justify-center">
            <DonutChart data={mockAttackTypes} />
          </div>
          <div className="mt-3 space-y-2">
            {mockAttackTypes.map((type, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-gray-400">{type.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white">{type.count}</span>
                  {type.trend > 0 ? (
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2A354D]">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                攻击源列表
              </h3>
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索IP或地区..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
                >
                  <option value="all">全部级别</option>
                  <option value="critical">严重</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">攻击源IP</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">地理位置</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">攻击次数</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">攻击类型</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-400">风险等级</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-400">状态</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">最近活动</th>
                </tr>
              </thead>
              <tbody>
                {filteredSources.map((source) => (
                  <tr key={source.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                    <td className="px-4 py-3">
                      <span className="text-sm text-white font-mono">{source.ip}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {source.country} · {source.region}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-red-400 font-mono">{source.attackCount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {source.attackTypes.map((type, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RiskLevelBadge level={source.riskLevel} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={source.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-gray-500 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {source.lastSeen}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
            <span className="text-xs text-gray-500">共 {filteredSources.length} 条记录</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
              <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
              <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-yellow-400" />
            攻击类型趋势
          </h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {mockAttackTypes.map((type, i) => {
              const maxCount = Math.max(...mockAttackTypes.map(t => t.count));
              const height = (type.count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t transition-all"
                    style={{ height: `${height}%`, minHeight: '8px', backgroundColor: type.color, opacity: 0.7 }}
                  />
                  <span className="text-[10px] text-gray-500 mt-2 text-center">{type.type}</span>
                  <span className="text-xs text-white font-medium">{type.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-400" />
            攻击来源国家分布
          </h3>
          <div className="space-y-2">
            {[
              { country: '俄罗斯', count: 4823, pct: 35 },
              { country: '德国', count: 3502, pct: 25 },
              { country: '美国', count: 2891, pct: 21 },
              { country: '中国', count: 2156, pct: 16 },
              { country: '巴西', count: 1823, pct: 13 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.country}</span>
                  <span className="text-white">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttackSourceTypeAnalysis;
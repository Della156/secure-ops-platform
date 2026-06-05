'use client';

import React, { useState, useMemo } from 'react';
import {
  Shield, Search, Filter, Download, RefreshCw,
  AlertTriangle, CheckCircle2, Server, Database,
  Network, Lock, Zap, TrendingUp, TrendingDown,
  ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'server' | 'database' | 'network' | 'application';
  ip: string;
  location: string;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  vulnerabilities: number;
  lastScan: string;
  status: 'active' | 'warning' | 'critical';
}

interface RiskStat {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const mockAssets: Asset[] = [
  { id: 'AST-001', name: 'WEB-APP-01', type: 'application', ip: '192.168.1.101', location: '北京数据中心', riskScore: 85, riskLevel: 'critical', vulnerabilities: 12, lastScan: '2小时前', status: 'critical' },
  { id: 'AST-002', name: 'DB-MASTER-01', type: 'database', ip: '192.168.1.102', location: '北京数据中心', riskScore: 72, riskLevel: 'high', vulnerabilities: 8, lastScan: '5小时前', status: 'warning' },
  { id: 'AST-003', name: 'FW-EDGE-01', type: 'network', ip: '192.168.1.1', location: '上海数据中心', riskScore: 45, riskLevel: 'medium', vulnerabilities: 4, lastScan: '1天前', status: 'active' },
  { id: 'AST-004', name: 'API-GW-01', type: 'application', ip: '192.168.1.103', location: '广州数据中心', riskScore: 68, riskLevel: 'high', vulnerabilities: 6, lastScan: '3小时前', status: 'warning' },
  { id: 'AST-005', name: 'CACHE-REDIS-01', type: 'database', ip: '192.168.1.104', location: '北京数据中心', riskScore: 28, riskLevel: 'low', vulnerabilities: 2, lastScan: '2天前', status: 'active' },
  { id: 'AST-006', name: 'LOG-SVR-01', type: 'server', ip: '192.168.1.105', location: '深圳数据中心', riskScore: 55, riskLevel: 'medium', vulnerabilities: 5, lastScan: '12小时前', status: 'active' },
];

const riskDistribution = [
  { level: '严重', count: 1, percentage: 17, color: '#EF4444' },
  { level: '高', count: 2, percentage: 33, color: '#F59E0B' },
  { level: '中', count: 2, percentage: 33, color: '#EAB308' },
  { level: '低', count: 1, percentage: 17, color: '#22C55E' },
];

const assetTypeStats = [
  { type: '应用服务器', count: 2, percentage: 33 },
  { type: '数据库', count: 2, percentage: 33 },
  { type: '网络设备', count: 1, percentage: 17 },
  { type: '服务器', count: 1, percentage: 17 },
];

function RiskLevelBadge({ level }: { level: Asset['riskLevel'] }) {
  const config = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', label: '严重' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: '高' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中' },
    low: { bg: 'bg-green-500/10', text: 'text-green-400', label: '低' },
  };
  const { bg, text, label } = config[level];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function TypeIcon({ type }: { type: Asset['type'] }) {
  const icons = {
    server: <Server className="w-4 h-4 text-blue-400" />,
    database: <Database className="w-4 h-4 text-purple-400" />,
    network: <Network className="w-4 h-4 text-green-400" />,
    application: <Lock className="w-4 h-4 text-yellow-400" />,
  };
  return icons[type];
}

function StatusIndicator({ status }: { status: Asset['status'] }) {
  const config = {
    active: <div className="w-2 h-2 rounded-full bg-green-500" />,
    warning: <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />,
    critical: <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />,
  };
  return config[status];
}

function RiskScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#EF4444' : score >= 50 ? '#F59E0B' : score >= 30 ? '#EAB308' : '#22C55E';

  return (
    <svg width="80" height="80" className="transform -rotate-90">
      <circle cx="40" cy="40" r="35" fill="none" stroke="#111625" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r="35"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-500"
      />
      <text x="40" y="45" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        {score}
      </text>
      <text x="40" y="55" textAnchor="middle" fill="#64748B" fontSize="8">风险分</text>
    </svg>
  );
}

export function AssetRiskProfile() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredAssets = useMemo(() => {
    return mockAssets.filter(asset => {
      const matchSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = riskFilter === 'all' || asset.riskLevel === riskFilter;
      return matchSearch && matchRisk;
    });
  }, [searchTerm, riskFilter]);

  const stats = useMemo(() => {
    const total = mockAssets.length;
    const critical = mockAssets.filter(a => a.riskLevel === 'critical').length;
    const high = mockAssets.filter(a => a.riskLevel === 'high').length;
    const avgScore = Math.round(mockAssets.reduce((acc, a) => acc + a.riskScore, 0) / total);
    return { total, critical, high, avgScore };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            资产脆弱性与风险画像分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">分析资产脆弱性分布，生成风险画像，支持风险评估与处置</p>
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
          { label: '资产总数', value: stats.total, change: 0, icon: <Server className="w-4 h-4" />, color: 'blue' },
          { label: '严重风险资产', value: stats.critical, change: +2, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
          { label: '高风险资产', value: stats.high, change: -1, icon: <Zap className="w-4 h-4" />, color: 'orange' },
          { label: '平均风险分', value: stats.avgScore, change: +3, icon: <TrendingUp className="w-4 h-4" />, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <span className={`text-${stat.color}-400`}>{stat.icon}</span>
                {stat.label}
              </div>
              <div className={`text-xs flex items-center gap-0.5 ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            风险等级分布
          </h3>
          <div className="flex justify-center mb-4">
            <svg width="140" height="140" className="transform -rotate-90">
              {(() => {
                let acc = 0;
                return riskDistribution.map((item, i) => {
                  const angle = (item.percentage / 100) * 360;
                  const startAngle = acc;
                  const endAngle = acc + angle;
                  acc = endAngle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 70 + 50 * Math.cos(startRad);
                  const y1 = 70 + 50 * Math.sin(startRad);
                  const x2 = 70 + 50 * Math.cos(endRad);
                  const y2 = 70 + 50 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;
                  return (
                    <g key={i}>
                      <path
                        d={`M 70 70 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        opacity={0.7}
                      />
                    </g>
                  );
                });
              })()}
              <circle cx="70" cy="70" r="25" fill="#0F172A" />
              <text x="70" y="68" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {stats.total}
              </text>
              <text x="70" y="82" textAnchor="middle" fill="#64748B" fontSize="8">资产</text>
            </svg>
          </div>
          <div className="space-y-2">
            {riskDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.level}</span>
                </div>
                <span className="text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            资产类型分布
          </h3>
          <div className="space-y-3">
            {assetTypeStats.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.type}</span>
                  <span className="text-white">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#2A354D]">
            <h4 className="text-xs text-gray-400 mb-3">风险评分区间</h4>
            <div className="relative h-6 bg-[#111625] rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 right-[60%] bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="absolute inset-y-0 left-[40%] right-[30%] bg-yellow-500" />
              <div className="absolute inset-y-0 left-[70%] right-0 bg-green-500" />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-[10px] text-white">0</span>
                <span className="text-[10px] text-white">50</span>
                <span className="text-[10px] text-white">100</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-500">
              <span>高危</span>
              <span>中危</span>
              <span>低危</span>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            风险最高资产
          </h3>
          {mockAssets.slice(0, 3).map((asset, i) => (
            <div key={asset.id} className={`p-3 rounded-lg ${i === 0 ? 'bg-red-500/10' : 'bg-[#111625]'} mb-2`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {i === 0 && <span className="text-red-400 font-bold">TOP 1</span>}
                  <TypeIcon type={asset.type} />
                  <span className="text-sm text-white">{asset.name}</span>
                </div>
                <RiskLevelBadge level={asset.riskLevel} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">{asset.ip}</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold" style={{ color: asset.riskScore >= 70 ? '#EF4444' : asset.riskScore >= 50 ? '#F59E0B' : '#22C55E' }}>
                    {asset.riskScore}
                  </span>
                  <span className="text-xs text-gray-500">分</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索资产名称、IP地址或位置..."
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
                <option value="all">全部风险等级</option>
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
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">资产名称</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">类型</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">IP地址</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">位置</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-400">风险评分</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-400">风险等级</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">漏洞数</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">状态</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={asset.status} />
                      <span className="text-sm text-white">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon type={asset.type} />
                      <span className="text-xs text-gray-400">
                        {asset.type === 'server' ? '服务器' :
                         asset.type === 'database' ? '数据库' :
                         asset.type === 'network' ? '网络设备' : '应用'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{asset.ip}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{asset.location}</td>
                  <td className="px-4 py-3 text-center">
                    <RiskScoreRing score={asset.riskScore} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <RiskLevelBadge level={asset.riskLevel} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${asset.vulnerabilities > 5 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {asset.vulnerabilities}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-gray-500">{asset.lastScan}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 justify-center">
                      详情 <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredAssets.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetRiskProfile;
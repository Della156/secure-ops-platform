'use client';

import React, { useState, useMemo } from 'react';
import {
  Shield, AlertTriangle, Bug, TrendingUp, TrendingDown, CheckCircle2,
  Activity, Target, Clock, RefreshCw, Download, Maximize2, Filter,
  Server, Database, Globe, Layers, ChevronRight, X, Sparkles,
  ArrowUpRight, ArrowDownRight, Eye, BarChart3, Zap, ShieldAlert
} from 'lucide-react';

/**
 * 4.6-1 漏洞管理视图
 *
 * 漏洞管理总览仪表盘：
 * - 漏洞总数 / 未修复 / 已修复 / 高危占比等核心 KPI
 * - 按等级 / 按资产类型 / 按时间趋势 3 个图表
 * - TOP 高危漏洞 / 部门漏洞分布
 */

type VulnLevel = 'critical' | 'high' | 'medium' | 'low';

interface KpiCard {
  label: string;
  value: string | number;
  trend: number;
  color: string;
  icon: React.ReactNode;
  sub?: string;
}

const kpis: KpiCard[] = [
  { label: '总漏洞数', value: 1247, trend: -8.3, color: 'blue', icon: <Bug className="w-4 h-4" />, sub: '本周新增 89' },
  { label: '未修复漏洞', value: 423, trend: -12.1, color: 'red', icon: <AlertTriangle className="w-4 h-4" />, sub: '高危 87' },
  { label: '高危漏洞', value: 187, trend: -15.6, color: 'orange', icon: <ShieldAlert className="w-4 h-4" />, sub: '占比 15.0%' },
  { label: '本月已修复', value: 312, trend: 18.4, color: 'green', icon: <CheckCircle2 className="w-4 h-4" />, sub: '环比提升' },
  { label: 'MTTR 修复', value: '6.8d', trend: -1.2, color: 'purple', icon: <Clock className="w-4 h-4" />, sub: '较上月 -1.2d' },
  { label: '复测通过率', value: '94.5%', trend: 2.1, color: 'cyan', icon: <Target className="w-4 h-4" />, sub: '目标 95%' },
];

// 漏洞等级分布
const levelDistribution = [
  { level: 'critical' as VulnLevel, label: '严重', count: 23, color: '#DC2626' },
  { level: 'high' as VulnLevel, label: '高危', count: 164, color: '#EA580C' },
  { level: 'medium' as VulnLevel, label: '中危', count: 386, color: '#F59E0B' },
  { level: 'low' as VulnLevel, label: '低危', count: 674, color: '#3B82F6' },
];

// 资产类型分布
const assetTypeDistribution = [
  { type: '服务器', total: 487, fixed: 312, color: '#3B82F6' },
  { type: '数据库', total: 234, fixed: 178, color: '#8B5CF6' },
  { type: '网络设备', total: 198, fixed: 145, color: '#10B981' },
  { type: '云资源', total: 215, fixed: 89, color: '#EC4899' },
  { type: '终端', total: 113, fixed: 78, color: '#06B6D4' },
];

// 部门漏洞分布
const deptDistribution = [
  { dept: '研发部', count: 287, severity: 'high' as VulnLevel },
  { dept: '运维部', count: 198, severity: 'medium' as VulnLevel },
  { dept: '数据部', count: 156, severity: 'high' as VulnLevel },
  { dept: '业务部', count: 124, severity: 'low' as VulnLevel },
  { dept: '财务部', count: 87, severity: 'medium' as VulnLevel },
  { dept: '测试部', count: 76, severity: 'low' as VulnLevel },
];

// TOP 高危漏洞
interface TopVuln {
  cve: string;
  name: string;
  cvss: number;
  level: VulnLevel;
  affected: number;
  published: string;
  exploitInWild: boolean;
  patchAvailable: boolean;
}
const topVulns: TopVuln[] = [
  { cve: 'CVE-2024-3094', name: 'XZ Utils 后门漏洞', cvss: 10.0, level: 'critical', affected: 23, published: '2024-03-29', exploitInWild: true, patchAvailable: true },
  { cve: 'CVE-2024-21412', name: 'Microsoft Outlook RCE', cvss: 9.8, level: 'critical', affected: 45, published: '2024-02-13', exploitInWild: true, patchAvailable: true },
  { cve: 'CVE-2024-23897', name: 'Jenkins 任意文件读取', cvss: 9.8, level: 'critical', affected: 12, published: '2024-01-24', exploitInWild: false, patchAvailable: true },
  { cve: 'CVE-2024-21626', name: 'runc 容器逃逸', cvss: 8.6, level: 'high', affected: 56, published: '2024-01-31', exploitInWild: true, patchAvailable: true },
  { cve: 'CVE-2023-50164', name: 'Apache Struts 文件上传', cvss: 9.8, level: 'critical', affected: 8, published: '2023-12-07', exploitInWild: false, patchAvailable: true },
  { cve: 'CVE-2023-46805', name: 'Ivanti Connect Secure 认证绕过', cvss: 8.2, level: 'high', affected: 3, published: '2024-01-10', exploitInWild: true, patchAvailable: true },
  { cve: 'CVE-2023-44487', name: 'HTTP/2 Rapid Reset DoS', cvss: 7.5, level: 'high', affected: 89, published: '2023-10-10', exploitInWild: true, patchAvailable: true },
];

const severityColors = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

// ========== 组件 ==========
function LevelDonut() {
  const total = levelDistribution.reduce((acc, l) => acc + l.count, 0);
  const radius = 60;
  const cx = 80, cy = 80;
  const strokeWidth = 22;
  let offset = 0;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-4">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        {levelDistribution.map((l, i) => {
          const dash = (l.count / total) * circumference;
          const seg = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={l.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += dash;
          return seg;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">{total.toLocaleString()}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#94A3B8" fontSize="10">总漏洞</text>
      </svg>
      <div className="flex-1 space-y-1.5">
        {levelDistribution.map(l => (
          <div key={l.level} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
              <span className="text-gray-300">{l.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{l.count}</span>
              <span className="text-gray-500 text-[10px]">({(l.count / total * 100).toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart() {
  // 30 天趋势
  const data = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(2026, 4, 4 + i);
      const day = date.getDate();
      return {
        date: `${day}日`,
        new: Math.floor(40 + Math.random() * 30),
        fixed: Math.floor(30 + Math.random() * 40),
      };
    });
  }, []);

  const max = Math.max(...data.map(d => Math.max(d.new, d.fixed)));

  return (
    <div>
      <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> 新增</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> 修复</span>
      </div>
      <svg viewBox="0 0 600 140" className="w-full h-32">
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line key={i} x1="0" y1={p * 120 + 10} x2="600" y2={p * 120 + 10} stroke="rgba(255,255,255,0.05)" />
        ))}
        {/* 新增面积 */}
        <path
          d={`M 0,130 ${data.map((d, i) => `L ${(i / (data.length - 1)) * 600},${130 - (d.new / max) * 120}`).join(' ')} L 600,130 Z`}
          fill="url(#redGrad)"
          opacity="0.3"
        />
        <polyline
          points={data.map((d, i) => `${(i / (data.length - 1)) * 600},${130 - (d.new / max) * 120}`).join(' ')}
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
        />
        {/* 修复折线 */}
        <polyline
          points={data.map((d, i) => `${(i / (data.length - 1)) * 600},${130 - (d.fixed / max) * 120}`).join(' ')}
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="redGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 9, 19, 29].map(i => (
          <text key={i} x={(i / (data.length - 1)) * 600} y="138" textAnchor="middle" fill="#64748B" fontSize="8">
            {data[i].date}
          </text>
        ))}
      </svg>
    </div>
  );
}

function DeptList() {
  const maxCount = Math.max(...deptDistribution.map(d => d.count));
  return (
    <div className="space-y-2">
      {deptDistribution.map(d => (
        <div key={d.dept}>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="text-gray-300">{d.dept}</span>
            <span className="text-white font-medium">{d.count}</span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                d.severity === 'high' ? 'bg-orange-500' : d.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(d.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ========== 主组件 ==========
export function VulnManageOverview() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            漏洞管理视图
          </h2>
          <span className="text-xs text-gray-500">
            扫描时间: 2026-06-02 · 共 1247 个漏洞
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm rounded px-2 py-1.5"
          >
            <option value="7d">近 7 天</option>
            <option value="30d">近 30 天</option>
            <option value="90d">近 90 天</option>
          </select>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            筛选
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            全屏
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded bg-${k.color}-500/10 text-${k.color}-400`}>{k.icon}</div>
              <div className={`text-[10px] flex items-center gap-0.5 ${
                k.trend > 0 ? 'text-green-400' : k.trend < 0 ? 'text-red-400' : 'text-gray-500'
              }`}>
                {k.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : k.trend < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
                {Math.abs(k.trend)}%
              </div>
            </div>
            <div className="text-xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* 等级分布 + 趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Bug className="w-4 h-4 text-red-400" />
            漏洞等级分布
          </h3>
          <LevelDonut />
        </div>

        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            漏洞新增 vs 修复趋势（30 天）
          </h3>
          <TrendChart />
        </div>
      </div>

      {/* 资产类型分布 + 部门分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            资产类型漏洞分布
          </h3>
          <div className="space-y-2">
            {assetTypeDistribution.map(a => {
              const fixRate = (a.fixed / a.total * 100).toFixed(0);
              return (
                <div key={a.type} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-gray-300">{a.type}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-[#111625] rounded relative overflow-hidden flex">
                      <div
                        className="h-full flex items-center justify-end px-2 text-[10px] text-white"
                        style={{ width: `${(a.fixed / a.total) * 100}%`, backgroundColor: `${a.color}cc` }}
                      >
                        {a.fixed}
                      </div>
                      <div
                        className="h-full flex items-center justify-start px-2 text-[10px] text-gray-300"
                        style={{ width: `${((a.total - a.fixed) / a.total) * 100}%`, backgroundColor: `${a.color}30` }}
                      >
                        {a.total - a.fixed}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-[10px]">
                    <span className={Number(fixRate) >= 70 ? 'text-green-400' : 'text-yellow-400'}>{fixRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            部门漏洞分布
          </h3>
          <DeptList />
        </div>
      </div>

      {/* TOP 高危漏洞 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            TOP 高危漏洞（CVE）
          </h3>
          <button className="text-xs text-blue-400 hover:text-blue-300">查看全部 →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-[#2A354D]">
                <th className="text-left py-2 px-2 font-medium">CVE 编号</th>
                <th className="text-left py-2 px-2 font-medium">漏洞名称</th>
                <th className="text-center py-2 px-2 font-medium">CVSS</th>
                <th className="text-center py-2 px-2 font-medium">等级</th>
                <th className="text-center py-2 px-2 font-medium">影响资产</th>
                <th className="text-center py-2 px-2 font-medium">野外利用</th>
                <th className="text-center py-2 px-2 font-medium">补丁</th>
                <th className="text-center py-2 px-2 font-medium">披露日期</th>
                <th className="text-center py-2 px-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {topVulns.map(v => (
                <tr key={v.cve} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                  <td className="py-2 px-2 font-mono text-xs text-blue-400">{v.cve}</td>
                  <td className="py-2 px-2 text-white max-w-xs truncate" title={v.name}>{v.name}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={`font-bold ${v.cvss >= 9.0 ? 'text-red-400' : 'text-orange-400'}`}>{v.cvss.toFixed(1)}</span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${severityColors[v.level as keyof typeof severityColors]}`}>
                      {v.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="text-orange-400 font-medium">{v.affected}</span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    {v.exploitInWild ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">在野</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">无</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {v.patchAvailable ? (
                      <span className="text-green-400 text-[10px]">✓ 有</span>
                    ) : (
                      <span className="text-gray-500 text-[10px]">✗ 无</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-gray-500 text-xs">{v.published}</td>
                  <td className="py-2 px-2 text-center">
                    <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">详情</button>
                    <button className="text-xs text-green-400 hover:text-green-300">整改</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VulnManageOverview;

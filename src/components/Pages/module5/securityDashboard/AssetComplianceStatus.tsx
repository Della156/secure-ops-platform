'use client';

import React, { useState, useMemo } from 'react';
import {
  Server, Database, Cloud, Wifi, Shield, CheckCircle2, XCircle,
  AlertTriangle, TrendingUp, BarChart3, PieChart as PieIcon, Layers,
  Maximize2, Download, Filter, RefreshCw, ChevronRight, Target,
  Building, Cpu, HardDrive, Network
} from 'lucide-react';

/**
 * 5.3-4 资产合规状态与覆盖率统计
 *
 * 资产管理大屏：
 * - 资产总数 + 类型分布（饼图）
 * - 合规率仪表盘（多个环形图）
 * - 未合规资产 TOP 10
 * - 覆盖率矩阵：等保 2.0 / GDPR / ISO 27001
 */

interface AssetType {
  type: string;
  icon: React.ReactNode;
  total: number;
  online: number;
  compliant: number;
  color: string;
}

interface ComplianceStandard {
  id: string;
  name: string;
  shortName: string;
  total: number;
  compliant: number;
  coverage: number;  // 0-1
  items: { name: string; met: number; total: number }[];
  color: string;
}

interface NonCompliantAsset {
  id: string;
  name: string;
  type: string;
  owner: string;
  department: string;
  issues: { standard: string; count: number }[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  lastCheck: string;
}

// ========== Mock Data ==========
const assetTypes: AssetType[] = [
  { type: '服务器', icon: <Server className="w-4 h-4" />, total: 342, online: 332, compliant: 298, color: '#3B82F6' },
  { type: '数据库', icon: <Database className="w-4 h-4" />, total: 128, online: 124, compliant: 115, color: '#8B5CF6' },
  { type: '网络设备', icon: <Network className="w-4 h-4" />, total: 256, online: 252, compliant: 231, color: '#10B981' },
  { type: '安全设备', icon: <Shield className="w-4 h-4" />, total: 89, online: 88, compliant: 86, color: '#F59E0B' },
  { type: '云资源', icon: <Cloud className="w-4 h-4" />, total: 423, online: 418, compliant: 358, color: '#EC4899' },
  { type: '终端', icon: <Cpu className="w-4 h-4" />, total: 64, online: 56, compliant: 47, color: '#06B6D4' },
];

const standards: ComplianceStandard[] = [
  {
    id: 'iso27001',
    name: 'ISO/IEC 27001:2022',
    shortName: 'ISO 27001',
    total: 1302,
    compliant: 1072,
    coverage: 0.823,
    color: '#3B82F6',
    items: [
      { name: 'A.5 组织控制', met: 28, total: 32 },
      { name: 'A.6 人员控制', met: 14, total: 16 },
      { name: 'A.7 物理控制', met: 11, total: 14 },
      { name: 'A.8 技术控制', met: 32, total: 38 },
      { name: 'A.9 访问控制', met: 18, total: 21 },
      { name: 'A.10 密码学', met: 7, total: 9 },
    ],
  },
  {
    id: 'djcp',
    name: '等保 2.0 三级',
    shortName: '等保 2.0',
    total: 1302,
    compliant: 1108,
    coverage: 0.851,
    color: '#10B981',
    items: [
      { name: '安全通信网络', met: 18, total: 21 },
      { name: '安全区域边界', met: 22, total: 25 },
      { name: '安全计算环境', met: 32, total: 36 },
      { name: '安全管理中心', met: 15, total: 17 },
      { name: '安全管理制度', met: 28, total: 30 },
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR (通用数据保护条例)',
    shortName: 'GDPR',
    total: 1302,
    compliant: 1018,
    coverage: 0.782,
    color: '#8B5CF6',
    items: [
      { name: '数据处理合法性', met: 12, total: 14 },
      { name: '数据主体权利', met: 8, total: 12 },
      { name: '数据保护影响评估', met: 6, total: 10 },
      { name: '数据泄露通知', met: 5, total: 8 },
    ],
  },
  {
    id: 'pci',
    name: 'PCI DSS 4.0',
    shortName: 'PCI DSS',
    total: 287,  // 只针对支付相关资产
    compliant: 245,
    coverage: 0.854,
    color: '#F59E0B',
    items: [
      { name: '网络安全', met: 18, total: 22 },
      { name: '访问控制', met: 12, total: 14 },
      { name: '数据保护', met: 9, total: 11 },
    ],
  },
];

const nonCompliantAssets: NonCompliantAsset[] = [
  { id: 'AST-0042', name: '核心数据库-DB-MASTER', type: '数据库', owner: '张伟', department: '数据部', issues: [{ standard: '等保 2.0', count: 5 }, { standard: 'ISO 27001', count: 3 }], riskLevel: 'critical', lastCheck: '2026-06-01' },
  { id: 'AST-0043', name: '核心数据库-DB-SLAVE-01', type: '数据库', owner: '张伟', department: '数据部', issues: [{ standard: '等保 2.0', count: 4 }, { standard: 'ISO 27001', count: 2 }], riskLevel: 'high', lastCheck: '2026-06-01' },
  { id: 'AST-0123', name: '应用服务器-APP-12', type: '服务器', owner: '李娜', department: '研发部', issues: [{ standard: 'ISO 27001', count: 6 }, { standard: 'GDPR', count: 2 }], riskLevel: 'high', lastCheck: '2026-05-31' },
  { id: 'AST-0124', name: '应用服务器-APP-13', type: '服务器', owner: '李娜', department: '研发部', issues: [{ standard: 'ISO 27001', count: 5 }], riskLevel: 'medium', lastCheck: '2026-05-31' },
  { id: 'AST-0234', name: '边界防火墙-FW-EDGE-02', type: '网络设备', owner: '王强', department: '运维部', issues: [{ standard: '等保 2.0', count: 3 }], riskLevel: 'high', lastCheck: '2026-05-30' },
  { id: 'AST-0345', name: '云服务器-CLOUD-DEV-08', type: '云资源', owner: '赵敏', department: '测试部', issues: [{ standard: 'ISO 27001', count: 4 }, { standard: 'PCI DSS', count: 2 }], riskLevel: 'medium', lastCheck: '2026-05-30' },
  { id: 'AST-0456', name: '核心交换机-CORE-SW-03', type: '网络设备', owner: '王强', department: '运维部', issues: [{ standard: '等保 2.0', count: 2 }], riskLevel: 'medium', lastCheck: '2026-05-29' },
  { id: 'AST-0567', name: '员工终端-PC-FINANCE-23', type: '终端', owner: '钱七', department: '财务部', issues: [{ standard: 'ISO 27001', count: 3 }, { standard: 'GDPR', count: 4 }], riskLevel: 'high', lastCheck: '2026-05-29' },
  { id: 'AST-0678', name: '应用服务器-APP-WEB-09', type: '服务器', owner: '孙八', department: '业务部', issues: [{ standard: '等保 2.0', count: 2 }], riskLevel: 'low', lastCheck: '2026-05-28' },
  { id: 'AST-0789', name: '数据库-DB-ANALYTICS-01', type: '数据库', owner: '周九', department: '数据部', issues: [{ standard: 'GDPR', count: 3 }], riskLevel: 'medium', lastCheck: '2026-05-28' },
];

const riskColors = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

// ========== 组件 ==========
function AssetTypeDistribution() {
  const total = assetTypes.reduce((acc, a) => acc + a.total, 0);

  // 简单 SVG 饼图
  const radius = 70;
  const cx = 90;
  const cy = 90;
  let startAngle = -Math.PI / 2;

  const segments = assetTypes.map(a => {
    const pct = a.total / total;
    const angle = pct * Math.PI * 2;
    const endAngle = startAngle + angle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const path = `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;

    const result = { ...a, path, pct };
    startAngle = endAngle;
    return result;
  });

  return (
    <div className="flex items-center gap-4">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#111625" strokeWidth="1" />
        ))}
        <circle cx={cx} cy={cy} r="35" fill="#111625" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{total.toLocaleString()}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#94A3B8" fontSize="10">总资产</text>
      </svg>
      <div className="flex-1 space-y-1.5">
        {segments.map(s => (
          <div key={s.type} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="text-gray-300">{s.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{s.total}</span>
              <span className="text-gray-500 text-[10px]">({(s.pct * 100).toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssetTypeCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {assetTypes.map(a => {
        const onlineRate = (a.online / a.total * 100).toFixed(1);
        const complianceRate = (a.compliant / a.total * 100).toFixed(1);
        return (
          <div key={a.type} className="bg-[#111625] rounded-lg p-3 border border-[#2A354D]">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded" style={{ backgroundColor: `${a.color}20`, color: a.color }}>
                {a.icon}
              </div>
              <div className="text-sm text-white">{a.type}</div>
            </div>
            <div className="text-2xl font-bold text-white">{a.total}</div>
            <div className="mt-2 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-500">在线率</span>
                <span className={Number(onlineRate) >= 95 ? 'text-green-400' : 'text-yellow-400'}>{onlineRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">合规率</span>
                <span className={Number(complianceRate) >= 85 ? 'text-green-400' : 'text-yellow-400'}>{complianceRate}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StandardCard({ std }: { std: ComplianceStandard }) {
  const [expanded, setExpanded] = useState(false);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - std.coverage);

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-white">{std.shortName}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">{std.name}</div>
        </div>
        <div
          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
          style={{
            backgroundColor: `${std.color}20`,
            color: std.color,
          }}
        >
          {(std.coverage * 100).toFixed(1)}%
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <svg width="120" height="120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={std.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-white">{(std.coverage * 100).toFixed(0)}%</div>
            <div className="text-[10px] text-gray-500">覆盖</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">合规项</div>
          <div className="text-xl font-bold text-white">
            {std.compliant} <span className="text-sm text-gray-500">/ {std.total}</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-500">
            不合规: <span className="text-red-400">{std.total - std.compliant}</span> 项
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#2A354D] space-y-1.5">
          {std.items.map((item, i) => {
            const itemPct = item.met / item.total;
            return (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-gray-400">{item.name}</span>
                  <span className="text-gray-500">{item.met}/{item.total}</span>
                </div>
                <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${itemPct * 100}%`, backgroundColor: std.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full text-xs text-blue-400 hover:text-blue-300"
      >
        {expanded ? '收起详情' : `查看 ${std.items.length} 个子项`}
      </button>
    </div>
  );
}

function CoverageMatrix() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {standards.map(s => (
        <StandardCard key={s.id} std={s} />
      ))}
    </div>
  );
}

// ========== 主组件 ==========
export function AssetComplianceStatus() {
  const totalAssets = assetTypes.reduce((acc, a) => acc + a.total, 0);
  const totalOnline = assetTypes.reduce((acc, a) => acc + a.online, 0);
  const totalCompliant = assetTypes.reduce((acc, a) => acc + a.compliant, 0);
  const overallOnlineRate = (totalOnline / totalAssets * 100).toFixed(1);
  const overallComplianceRate = (totalCompliant / totalAssets * 100).toFixed(1);

  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredAssets = useMemo(() => {
    if (filterRisk === 'all') return nonCompliantAssets;
    return nonCompliantAssets.filter(a => a.riskLevel === filterRisk);
  }, [filterRisk]);

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            资产合规状态与覆盖率统计
          </h2>
          <span className="text-xs text-gray-500">
            扫描时间: 2026-06-02 16:00 · 1302 个资产
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            筛选
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            重新扫描
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            全屏
          </button>
        </div>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '资产总数', value: totalAssets.toLocaleString(), sub: '6 种类型', icon: <Server className="w-4 h-4" />, color: 'blue' },
          { label: '在线资产', value: totalOnline.toLocaleString(), sub: `在线率 ${overallOnlineRate}%`, icon: <Wifi className="w-4 h-4" />, color: 'green' },
          { label: '合规资产', value: totalCompliant.toLocaleString(), sub: `合规率 ${overallComplianceRate}%`, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
          { label: '未合规资产', value: (totalAssets - totalCompliant).toLocaleString(), sub: '需要整改', icon: <XCircle className="w-4 h-4" />, color: 'red' },
        ].map((s, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className={`text-${s.color}-400`}>{s.icon}</div>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* 资产类型分布 + 详情卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-400" />
            资产类型分布
          </h3>
          <AssetTypeDistribution />
        </div>

        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            各类型资产健康度
          </h3>
          <AssetTypeCards />
        </div>
      </div>

      {/* 合规标准矩阵 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            合规标准覆盖率矩阵
          </h3>
          <span className="text-xs text-gray-500">4 个标准 · 145 个控制项</span>
        </div>
        <CoverageMatrix />
      </div>

      {/* 未合规资产 TOP 10 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            TOP 10 未合规资产
          </h3>
          <div className="flex border border-[#2A354D] rounded overflow-hidden">
            {[
              { v: 'all', l: '全部' },
              { v: 'critical', l: '严重' },
              { v: 'high', l: '高' },
              { v: 'medium', l: '中' },
              { v: 'low', l: '低' },
            ].map(f => (
              <button
                key={f.v}
                onClick={() => setFilterRisk(f.v)}
                className={`px-2.5 py-1 text-xs ${
                  filterRisk === f.v
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#111625] text-gray-400 hover:bg-[#20293F]'
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-[#2A354D]">
                <th className="text-left py-2 px-2 font-medium">资产 ID</th>
                <th className="text-left py-2 px-2 font-medium">资产名称</th>
                <th className="text-left py-2 px-2 font-medium">类型</th>
                <th className="text-left py-2 px-2 font-medium">负责人</th>
                <th className="text-left py-2 px-2 font-medium">部门</th>
                <th className="text-center py-2 px-2 font-medium">不合规项</th>
                <th className="text-center py-2 px-2 font-medium">风险等级</th>
                <th className="text-center py-2 px-2 font-medium">最近扫描</th>
                <th className="text-center py-2 px-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                  <td className="py-2 px-2 font-mono text-xs text-blue-400">{asset.id}</td>
                  <td className="py-2 px-2 text-white max-w-xs truncate" title={asset.name}>{asset.name}</td>
                  <td className="py-2 px-2 text-gray-300">{asset.type}</td>
                  <td className="py-2 px-2 text-gray-300">{asset.owner}</td>
                  <td className="py-2 px-2 text-gray-400 text-xs">{asset.department}</td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex flex-col gap-0.5 items-center">
                      {asset.issues.map((iss, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {iss.standard} ×{iss.count}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${riskColors[asset.riskLevel]}`}>
                      {asset.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center text-gray-500 text-xs">{asset.lastCheck}</td>
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

export default AssetComplianceStatus;

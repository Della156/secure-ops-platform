'use client';

import React, { useState, useMemo } from 'react';
import {
  Bug, Search, Filter, Download, RefreshCw,
  Clock, AlertTriangle, CheckCircle2, XCircle,
  ArrowRight, TrendingUp, TrendingDown,
  Calendar, Tag, User, FileText,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronRight
} from 'lucide-react';

interface Vulnerability {
  id: string;
  name: string;
  cveId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'discovered' | 'confirmed' | 'patched' | 'verified' | 'closed';
  discoveredAt: string;
  targetAsset: string;
  cvss: number;
  assignee: string;
  daysOpen: number;
  progress: number;
}

interface LifecycleStage {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

const mockVulnerabilities: Vulnerability[] = [
  { id: 'VULN-001', name: 'Apache Log4j 远程代码执行漏洞', cveId: 'CVE-2021-44228', severity: 'critical', status: 'confirmed', discoveredAt: '2026-05-20', targetAsset: 'WEB-APP-01', cvss: 10.0, assignee: '张工', daysOpen: 14, progress: 30 },
  { id: 'VULN-002', name: 'Windows Print Spooler 权限提升漏洞', cveId: 'CVE-2021-34527', severity: 'critical', status: 'patched', discoveredAt: '2026-05-15', targetAsset: 'WIN-SVR-01', cvss: 8.8, assignee: '李工', daysOpen: 19, progress: 80 },
  { id: 'VULN-003', name: 'OpenSSL 拒绝服务漏洞', cveId: 'CVE-2022-0778', severity: 'high', status: 'discovered', discoveredAt: '2026-06-01', targetAsset: 'API-GW-01', cvss: 7.5, assignee: '王工', daysOpen: 1, progress: 10 },
  { id: 'VULN-004', name: 'MySQL 未授权访问漏洞', cveId: 'CVE-2021-21234', severity: 'high', status: 'verified', discoveredAt: '2026-05-10', targetAsset: 'DB-MASTER-01', cvss: 7.2, assignee: '赵工', daysOpen: 24, progress: 90 },
  { id: 'VULN-005', name: 'Nginx 路径穿越漏洞', cveId: 'CVE-2021-23017', severity: 'medium', status: 'closed', discoveredAt: '2026-04-25', targetAsset: 'FW-EDGE-01', cvss: 6.4, assignee: '张工', daysOpen: 38, progress: 100 },
  { id: 'VULN-006', name: 'Redis 未授权访问漏洞', cveId: 'CVE-2022-0543', severity: 'medium', status: 'confirmed', discoveredAt: '2026-05-28', targetAsset: 'CACHE-REDIS-01', cvss: 6.0, assignee: '李工', daysOpen: 5, progress: 20 },
];

const lifecycleStages: LifecycleStage[] = [
  { stage: '发现', count: 1, percentage: 17, color: '#3B82F6' },
  { stage: '确认', count: 2, percentage: 33, color: '#F59E0B' },
  { stage: '修复中', count: 2, percentage: 33, color: '#EF4444' },
  { stage: '验证', count: 1, percentage: 17, color: '#8B5CF6' },
];

const severityStats = [
  { severity: '严重', count: 2, percentage: 33, color: '#EF4444' },
  { severity: '高', count: 2, percentage: 33, color: '#F59E0B' },
  { severity: '中', count: 2, percentage: 33, color: '#EAB308' },
  { severity: '低', count: 0, percentage: 0, color: '#22C55E' },
];

function SeverityBadge({ severity }: { severity: Vulnerability['severity'] }) {
  const config = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', label: '严重', cvss: '>=9.0' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: '高', cvss: '7.0-8.9' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中', cvss: '4.0-6.9' },
    low: { bg: 'bg-green-500/10', text: 'text-green-400', label: '低', cvss: '<4.0' },
  };
  const { bg, text, label } = config[severity];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: Vulnerability['status'] }) {
  const config = {
    discovered: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '已发现' },
    confirmed: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '已确认' },
    patched: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: '修复中' },
    verified: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: '验证中' },
    closed: { bg: 'bg-green-500/10', text: 'text-green-400', label: '已关闭' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

function LifecycleTimeline() {
  const stages = [
    { id: 1, name: '发现', description: '漏洞被检测系统发现', count: 1 },
    { id: 2, name: '确认', description: '安全团队确认漏洞真实性', count: 2 },
    { id: 3, name: '修复', description: '开发团队修复漏洞', count: 2 },
    { id: 4, name: '验证', description: '验证修复效果', count: 1 },
    { id: 5, name: '关闭', description: '漏洞关闭归档', count: 1 },
  ];

  return (
    <div className="flex items-center justify-between">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              stage.count > 0 ? 'bg-blue-500/20' : 'bg-[#111625]'
            }`}>
              {stage.count > 0 ? (
                <span className="text-blue-400 font-bold">{stage.count}</span>
              ) : (
                <span className="text-gray-600">{stage.id}</span>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-2 text-center w-16">{stage.name}</span>
          </div>
          {i < stages.length - 1 && (
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500/50 to-[#2A354D] mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}

export function VulnLifecycleAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);

  const filteredVulns = useMemo(() => {
    return mockVulnerabilities.filter(vuln => {
      const matchSearch = vuln.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vuln.cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vuln.targetAsset.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || vuln.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = mockVulnerabilities.length;
    const critical = mockVulnerabilities.filter(v => v.severity === 'critical').length;
    const avgDays = Math.round(mockVulnerabilities.reduce((acc, v) => acc + v.daysOpen, 0) / total);
    const resolved = mockVulnerabilities.filter(v => v.status === 'closed').length;
    return { total, critical, avgDays, resolved };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-orange-400" />
            漏洞生命周期分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">追踪漏洞从发现到修复的完整生命周期，分析处置效率</p>
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
          { label: '漏洞总数', value: stats.total, change: +3, icon: <Bug className="w-4 h-4" />, color: 'orange' },
          { label: '严重漏洞', value: stats.critical, change: 0, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
          { label: '平均处置天数', value: `${stats.avgDays}天`, change: -2, icon: <Clock className="w-4 h-4" />, color: 'blue' },
          { label: '已关闭', value: stats.resolved, change: +1, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <span className={`text-${stat.color}-400`}>{stat.icon}</span>
                {stat.label}
              </div>
              <div className={`text-xs flex items-center gap-0.5 ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.change)}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          漏洞生命周期时间线
        </h3>
        <LifecycleTimeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-400" />
            生命周期阶段分布
          </h3>
          <div className="space-y-2">
            {lifecycleStages.map((stage, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{stage.stage}</span>
                  <span className="text-white">{stage.count} ({stage.percentage}%)</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${stage.percentage}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            严重级别分布
          </h3>
          <div className="flex justify-center">
            <svg width="140" height="140" className="transform -rotate-90">
              {severityStats.reduce((acc, item, i) => {
                const angle = (item.percentage / 100) * 360;
                const startAngle = acc;
                const endAngle = acc + angle;
                acc += angle;

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
              }, 0)}
              <circle cx="70" cy="70" r="25" fill="#0F172A" />
              <text x="70" y="68" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {stats.total}
              </text>
              <text x="70" y="82" textAnchor="middle" fill="#64748B" fontSize="8">漏洞</text>
            </svg>
          </div>
          <div className="mt-4 space-y-2">
            {severityStats.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.severity}</span>
                </div>
                <span className="text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索漏洞名称、CVE编号或目标资产..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="all">全部状态</option>
                <option value="discovered">已发现</option>
                <option value="confirmed">已确认</option>
                <option value="patched">修复中</option>
                <option value="verified">验证中</option>
                <option value="closed">已关闭</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredVulns.map((vuln) => (
            <div key={vuln.id}>
              <div className="p-4 hover:bg-[#111625] cursor-pointer" onClick={() => setExpandedVuln(expandedVuln === vuln.id ? null : vuln.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      vuln.severity === 'critical' ? 'bg-red-500/20' :
                      vuln.severity === 'high' ? 'bg-orange-500/20' :
                      vuln.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                    }`}>
                      <Bug className={`w-5 h-5 ${
                        vuln.severity === 'critical' ? 'text-red-400' :
                        vuln.severity === 'high' ? 'text-orange-400' :
                        vuln.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{vuln.name}</span>
                        <span className="text-xs text-gray-500 font-mono">{vuln.cveId}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <SeverityBadge severity={vuln.severity} />
                        <StatusBadge status={vuln.status} />
                        <span className="text-xs text-gray-500">CVSS: {vuln.cvss}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">修复进度</span>
                          <span className="text-white">{vuln.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              vuln.progress >= 80 ? 'bg-green-500' :
                              vuln.progress >= 50 ? 'bg-yellow-500' :
                              vuln.progress >= 20 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${vuln.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <span className="text-xs text-gray-500">已开放 {vuln.daysOpen} 天</span>
                    </div>
                    {expandedVuln === vuln.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {expandedVuln === vuln.id && (
                <div className="bg-[#111625] px-4 py-3 border-t border-[#2A354D]">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">目标资产</span>
                      <div className="text-white mt-1">{vuln.targetAsset}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">发现时间</span>
                      <div className="text-white mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {vuln.discoveredAt}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">处理人</span>
                      <div className="text-white mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {vuln.assignee}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">CVSS评分</span>
                      <div className={`text-lg mt-1 font-bold ${
                        vuln.cvss >= 9 ? 'text-red-400' :
                        vuln.cvss >= 7 ? 'text-orange-400' :
                        vuln.cvss >= 4 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {vuln.cvss}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      查看详情
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-[#20293F] hover:bg-[#2A354D] text-gray-300 rounded">
                      关联修复工单
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-[#20293F] hover:bg-[#2A354D] text-gray-300 rounded">
                      添加备注
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredVulns.length} 条记录</span>
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

export default VulnLifecycleAnalysis;
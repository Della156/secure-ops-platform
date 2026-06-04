'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Layers, Network, Activity, AlertTriangle, Brain, User, Clock, FileText, Server, Globe, TrendingUp, BarChart3, Eye, Target, Database } from 'lucide-react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line } from 'recharts';

type DimensionCategory = 'network' | 'host' | 'user' | 'threat' | 'asset' | 'compliance';

interface DimensionSource {
  id: string;
  category: DimensionCategory;
  name: string;
  icon: any;
  totalEvents: number;
  anomalies: number;
  coverage: number;
  lastSync: string;
  status: 'active' | 'syncing' | 'stale' | 'failed';
  dataType: string;
  description: string;
}

const SOURCES: DimensionSource[] = [
  { id: 'NET-001', category: 'network', name: '网络流量镜像', icon: Network, totalEvents: 1847291, anomalies: 142, coverage: 98, lastSync: '2 分钟前', status: 'active', dataType: 'NetFlow + DPI', description: '核心交换机 + 边界防火墙流量' },
  { id: 'NET-002', category: 'network', name: 'DNS 解析日志', icon: Globe, totalEvents: 928475, anomalies: 38, coverage: 95, lastSync: '1 分钟前', status: 'active', dataType: 'DNS Query', description: '内部 DNS + 公共 DNS' },
  { id: 'HOST-001', category: 'host', name: 'EDR Agent', icon: Server, totalEvents: 482361, anomalies: 67, coverage: 100, lastSync: '30 秒前', status: 'active', dataType: '进程/文件/注册表', description: '5,200 个终端 + 850 台服务器' },
  { id: 'HOST-002', category: 'host', name: 'HIDS 日志', icon: Activity, totalEvents: 238429, anomalies: 25, coverage: 92, lastSync: '3 分钟前', status: 'active', dataType: '主机行为', description: '核心服务器 120 台' },
  { id: 'USER-001', category: 'user', name: 'IAM 登录日志', icon: User, totalEvents: 152483, anomalies: 12, coverage: 100, lastSync: '1 分钟前', status: 'active', dataType: 'SSO/AD/LDAP', description: '全员账号 8,500' },
  { id: 'USER-002', category: 'user', name: 'DLP 数据外发', icon: FileText, totalEvents: 28291, anomalies: 8, coverage: 78, lastSync: '5 分钟前', status: 'active', dataType: '邮件/IM/上传', description: '敏感数据外发检测' },
  { id: 'THREAT-001', category: 'threat', name: '威胁情报', icon: Target, totalEvents: 182938, anomalies: 95, coverage: 100, lastSync: '1 分钟前', status: 'active', dataType: 'IOC 匹配', description: 'MISP + 微步 + VT + ThreatBook' },
  { id: 'THREAT-002', category: 'threat', name: 'EDR 告警', icon: AlertTriangle, totalEvents: 58291, anomalies: 78, coverage: 96, lastSync: '2 分钟前', status: 'active', dataType: '高危告警', description: 'APT/勒索/挖矿' },
  { id: 'ASSET-001', category: 'asset', name: 'CMDB 资产库', icon: Database, totalEvents: 18283, anomalies: 3, coverage: 100, lastSync: '10 分钟前', status: 'active', dataType: '资产元数据', description: '12,500 资产/服务/应用' },
  { id: 'ASSET-002', category: 'asset', name: '漏洞扫描结果', icon: Eye, totalEvents: 4218, anomalies: 12, coverage: 85, lastSync: '30 分钟前', status: 'stale', dataType: 'Nessus/AWVS', description: '12 类资产' },
  { id: 'COMPL-001', category: 'compliance', name: '等保合规检查', icon: BarChart3, totalEvents: 1823, anomalies: 0, coverage: 90, lastSync: '2 小时前', status: 'syncing', dataType: '等保 2.0', description: '三级 + 二级系统' },
  { id: 'COMPL-002', category: 'compliance', name: '基线合规扫描', icon: Layers, totalEvents: 4291, anomalies: 1, coverage: 88, lastSync: '15 分钟前', status: 'active', dataType: 'CIS Benchmark', description: '操作系统 + 数据库' },
];

const CATEGORY_MAP: Record<DimensionCategory, { label: string; color: string; bg: string; icon: any }> = {
  network: { label: '网络维度', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Network },
  host: { label: '主机维度', color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: Server },
  user: { label: '用户维度', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: User },
  threat: { label: '威胁维度', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
  asset: { label: '资产维度', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: Database },
  compliance: { label: '合规维度', color: 'text-green-400', bg: 'bg-green-500/20', icon: BarChart3 },
};

const STATUS_MAP = {
  active: { status: 'success' as const, text: '活跃' },
  syncing: { status: 'running' as const, text: '同步中' },
  stale: { status: 'warning' as const, text: '需更新' },
  failed: { status: 'failed' as const, text: '失败' },
};

/**
 * 3-3-3 多维度信息整合
 *
 * 业务深度：6 维度（网络/主机/用户/威胁/资产/合规）数据源整合
 * 关键：覆盖率、异常统计、状态、实时同步
 */
export function MultiDimensionIntegration() {
  const [selectedCategory, setSelectedCategory] = useState<DimensionCategory | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<DimensionSource | null>(SOURCES[0]);

  // 6 维度覆盖率雷达图
  const coverageRadar = (['network', 'host', 'user', 'threat', 'asset', 'compliance'] as DimensionCategory[]).map((cat) => {
    const items = SOURCES.filter((s) => s.category === cat);
    return {
      dimension: CATEGORY_MAP[cat].label,
      coverage: Math.round(items.reduce((s, i) => s + i.coverage, 0) / items.length),
      anomalies: items.reduce((s, i) => s + i.anomalies, 0),
    };
  });

  // 类别异常分布
  const anomalyByCategory = (['network', 'host', 'user', 'threat', 'asset', 'compliance'] as DimensionCategory[]).map((cat) => ({
    name: CATEGORY_MAP[cat].label,
    value: SOURCES.filter((s) => s.category === cat).reduce((s, i) => s + i.anomalies, 0),
  }));

  const COLORS = ['#3B82F6', '#06B6D4', '#A855F7', '#EF4444', '#F97316', '#22C55E'];

  // 筛选
  const filteredSources = selectedCategory === 'all' ? SOURCES : SOURCES.filter((s) => s.category === selectedCategory);

  // KPI
  const totalEvents = SOURCES.reduce((s, i) => s + i.totalEvents, 0);
  const totalAnomalies = SOURCES.reduce((s, i) => s + i.anomalies, 0);
  const avgCoverage = Math.round(SOURCES.reduce((s, i) => s + i.coverage, 0) / SOURCES.length);
  const activeSources = SOURCES.filter((s) => s.status === 'active').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            多维度信息整合
          </h1>
          <p className="text-slate-400 mt-1 text-sm">6 维度 · 12 数据源 · 跨域异常关联 · AI 综合分析</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Activity className="w-4 h-4 mr-1" />实时同步</Button>
          <Button variant="primary"><Brain className="w-4 h-4 mr-1" />AI 整合分析</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="数据源" value={SOURCES.length} color="text-blue-400" hint={`${activeSources} 活跃`} />
        <KPI label="总事件量" value={(totalEvents / 1e6).toFixed(2) + 'M'} color="text-cyan-400" />
        <KPI label="异常事件" value={totalAnomalies} color="text-red-400" hint="需处置" />
        <KPI label="平均覆盖率" value={avgCoverage + '%'} color="text-green-400" />
      </div>

      {/* 6 维度覆盖 + 异常分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3">6 维度覆盖 + 异常</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={coverageRadar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#6B7280', fontSize: 10 }} domain={[0, 100]} />
              <Radar dataKey="coverage" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} name="覆盖率" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3">异常事件分布（6 维度）</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={anomalyByCategory}>
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="异常数" radius={[4, 4, 0, 0]}>
                {anomalyByCategory.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 类别筛选 */}
      <div className="flex flex-wrap gap-2">
        <CategoryBtn label="全部" active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} count={SOURCES.length} />
        {(Object.keys(CATEGORY_MAP) as DimensionCategory[]).map((cat) => (
          <CategoryBtn
            key={cat}
            label={CATEGORY_MAP[cat].label}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            count={SOURCES.filter((s) => s.category === cat).length}
            color={CATEGORY_MAP[cat].color}
          />
        ))}
      </div>

      {/* 数据源列表 + 详情双栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-slate-200 mb-3">数据源列表（{filteredSources.length}）</h3>
          <div className="space-y-2">
            {filteredSources.map((s) => {
              const Cm = CATEGORY_MAP[s.category];
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSource?.id === s.id ? 'border-blue-500/50 bg-blue-500/5' : 'border-[#2A354D] bg-[#111625] hover:border-slate-500/30'
                  }`}
                  onClick={() => setSelectedSource(s)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${Cm.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${Cm.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-100">{s.name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${Cm.bg} ${Cm.color}`}>{Cm.label}</span>
                        <StatusBadge status={STATUS_MAP[s.status].status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-100">{s.anomalies}</p>
                      <p className="text-[10px] text-slate-500">异常</p>
                    </div>
                    <div className="text-right w-20">
                      <p className={`text-sm font-medium ${s.coverage >= 95 ? 'text-green-400' : s.coverage >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {s.coverage}%
                      </p>
                      <p className="text-[10px] text-slate-500">覆盖</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {selectedSource && (
          <Card>
            <h3 className="text-sm font-medium text-slate-200 mb-3">{selectedSource.name}</h3>
            <div className="space-y-2">
              <Field label="数据源 ID" value={selectedSource.id} />
              <Field label="所属维度" value={CATEGORY_MAP[selectedSource.category].label} />
              <Field label="数据类型" value={selectedSource.dataType} />
              <Field label="状态" value={STATUS_MAP[selectedSource.status].text} />
              <Field label="最后同步" value={selectedSource.lastSync} />
              <Field label="总事件数" value={selectedSource.totalEvents.toLocaleString()} />
              <Field label="异常事件" value={selectedSource.anomalies.toString()} highlight={selectedSource.anomalies > 50} />
              <Field label="覆盖率" value={selectedSource.coverage + '%'} />
              <Field label="描述" value={selectedSource.description} />
            </div>
            <div className="mt-3 pt-3 border-t border-[#2A354D]">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm"><Eye className="w-3 h-3 mr-1" />查看</Button>
                <Button variant="primary" size="sm"><Brain className="w-3 h-3 mr-1" />分析</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function KPI({ label, value, color, hint }: { label: string; value: number | string; color: string; hint?: string }) {
  return (
    <Card>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {hint && <div className="text-[10px] text-slate-500 mt-0.5">{hint}</div>}
    </Card>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-2 rounded-lg ${highlight ? 'bg-red-500/10' : 'bg-[#111625]'}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm mt-0.5 font-mono ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p>
    </div>
  );
}

function CategoryBtn({ label, active, onClick, count, color }: { label: string; active: boolean; onClick: () => void; count: number; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs transition-colors ${
        active ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' : 'bg-[#111625] text-slate-300 border border-[#2A354D] hover:border-slate-500/30'
      }`}
    >
      {label} <span className={`ml-1 ${active ? 'text-blue-400' : color || 'text-slate-500'}`}>({count})</span>
    </button>
  );
}

export default MultiDimensionIntegration;

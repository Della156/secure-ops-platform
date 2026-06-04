'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, Filter, Eye, AlertTriangle, Shield,
  Target, TrendingUp, Activity, BarChart3, Zap, Server, Database,
  Network, Lock, CheckCircle2, XCircle, ChevronRight, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface RiskFactor {
  id: string;
  name: string;
  category: '资产' | '操作' | '时间' | '人员' | '影响';
  weight: number;
  score: number; // 0-100
  description: string;
}

interface RiskJob {
  id: string;
  jobName: string;
  totalScore: number;
  level: 'critical' | 'high' | 'medium' | 'low';
  factors: RiskFactor[];
  approvedBy: string;
}

const jobs: RiskJob[] = [
  {
    id: 'JA-99830',
    jobName: 'Oracle 数据库表结构变更',
    totalScore: 92,
    level: 'critical',
    factors: [
      { id: 'F1', name: '目标资产等级', category: '资产', weight: 25, score: 95, description: '生产数据库核心表' },
      { id: 'F2', name: '操作类型', category: '操作', weight: 20, score: 90, description: 'DDL 变更，影响范围大' },
      { id: 'F3', name: '业务影响', category: '影响', weight: 20, score: 92, description: '影响 80% 业务' },
      { id: 'F4', name: '执行时段', category: '时间', weight: 10, score: 85, description: '工作日 10:00' },
      { id: 'F5', name: '人员资质', category: '人员', weight: 15, score: 90, description: '高级 DBA + 双人审批' },
      { id: 'F6', name: '回滚方案', category: '操作', weight: 10, score: 95, description: '闪回 + 备份双方案' },
    ],
    approvedBy: 'CISO + DBA 主管',
  },
  {
    id: 'JA-99829',
    jobName: 'Web 集群安全补丁批量安装',
    totalScore: 82,
    level: 'high',
    factors: [
      { id: 'F1', name: '目标资产等级', category: '资产', weight: 25, score: 85, description: '生产 Web 集群' },
      { id: 'F2', name: '操作类型', category: '操作', weight: 20, score: 85, description: '补丁安装，灰度发布' },
      { id: 'F3', name: '业务影响', category: '影响', weight: 20, score: 80, description: '灰度 10% 流量' },
      { id: 'F4', name: '执行时段', category: '时间', weight: 10, score: 70, description: '工作日' },
      { id: 'F5', name: '人员资质', category: '人员', weight: 15, score: 88, description: '运维工程师' },
      { id: 'F6', name: '回滚方案', category: '操作', weight: 10, score: 78, description: '回滚脚本' },
    ],
    approvedBy: '运维总监',
  },
  {
    id: 'JA-99828',
    jobName: 'AD 域账号权限批量调整',
    totalScore: 65,
    level: 'medium',
    factors: [
      { id: 'F1', name: '目标资产等级', category: '资产', weight: 25, score: 70, description: 'AD 域控' },
      { id: 'F2', name: '操作类型', category: '操作', weight: 20, score: 65, description: '权限调整' },
      { id: 'F3', name: '业务影响', category: '影响', weight: 20, score: 60, description: '影响登录' },
      { id: 'F4', name: '执行时段', category: '时间', weight: 10, score: 60, description: '工作时间' },
      { id: 'F5', name: '人员资质', category: '人员', weight: 15, score: 70, description: '系统工程师' },
      { id: 'F6', name: '回滚方案', category: '操作', weight: 10, score: 60, description: 'AD 备份' },
    ],
    approvedBy: '部门经理',
  },
];

const levelColor: Record<RiskJob['level'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const categoryColor: Record<RiskFactor['category'], string> = {
  资产: '#0066FF',
  操作: '#FF6D00',
  时间: '#9333EA',
  人员: '#22C55E',
  影响: '#EF4444',
};

const levelDist = [
  { name: '低', count: 38, color: '#22C55E' },
  { name: '中', count: 56, color: '#EAB308' },
  { name: '高', count: 35, color: '#FF6D00' },
  { name: '严重', count: 13, color: '#EF4444' },
];

export function JobRiskLevelAssess() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>('JA-99830');

  const selected = selectedId ? jobs.find(j => j.id === selectedId) : null;
  const radarData = selected?.factors.map(f => ({
    factor: f.name,
    actual: f.score,
    baseline: 50,
  })) || [];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="风险评估" value={142} color="#0066FF" icon={<Shield className="w-4 h-4" />} />
        <StatBox label="严重" value={13} color="#EF4444" icon={<AlertTriangle className="w-4 h-4" />} />
        <StatBox label="高" value={35} color="#FF6D00" icon={<TrendingUp className="w-4 h-4" />} />
        <StatBox label="中/低" value={94} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
      </div>

      {/* 等级分布 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">风险等级分布</h3>
        <div className="grid grid-cols-4 gap-2">
          {levelDist.map(l => (
            <div key={l.name} className="bg-[#111625] rounded p-3 text-center border" style={{ borderColor: `${l.color}40` }}>
              <div className="text-2xl font-bold" style={{ color: l.color }}>{l.count}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{l.name}风险</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">作业风险等级判定</h2>
            <p className="text-xs text-slate-500 mt-1">6 维风险因子加权评分 — 自动判定 L1/L2/L3/L4 风险等级</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">作业列表</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {jobs.map(j => (
              <div
                key={j.id}
                onClick={() => setSelectedId(j.id)}
                className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === j.id ? 'bg-[#111625]' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-blue-400 font-mono">{j.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 border rounded ${levelColor[j.level]}`}>{j.level === 'critical' ? '严重' : j.level === 'high' ? '高' : j.level === 'medium' ? '中' : '低'}</span>
                  <div className="flex-1" />
                  <span className={`text-base font-bold ${j.totalScore >= 80 ? 'text-red-400' : j.totalScore >= 60 ? 'text-orange-400' : 'text-green-400'}`}>{j.totalScore}</span>
                </div>
                <div className="text-sm text-white font-medium">{j.jobName}</div>
              </div>
            ))}
          </div>
        </div>

        {selected ? (
          <>
            {/* 评分详情 */}
            <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 border rounded ${levelColor[selected.level]}`}>{selected.level === 'critical' ? '严重风险' : selected.level === 'high' ? '高风险' : selected.level === 'medium' ? '中风险' : '低风险'}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{selected.jobName}</h3>
              </div>

              {/* 总分 */}
              <div className="bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-red-500/30 rounded p-3 text-center">
                <div className="text-[10px] text-slate-400 mb-1">综合风险评分</div>
                <div className={`text-4xl font-bold ${selected.totalScore >= 80 ? 'text-red-400' : selected.totalScore >= 60 ? 'text-orange-400' : 'text-green-400'}`}>{selected.totalScore}</div>
                <div className="w-full h-1.5 bg-[#111625] rounded-full overflow-hidden mt-2">
                  <div className={`h-full rounded-full ${selected.totalScore >= 80 ? 'bg-red-500' : selected.totalScore >= 60 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${selected.totalScore}%` }} />
                </div>
                <div className="text-[10px] text-slate-400 mt-2">需要 <span className="text-yellow-300 font-medium">{selected.approvedBy}</span> 审批</div>
              </div>

              {/* 雷达图 */}
              <div>
                <h4 className="text-xs text-slate-500 mb-2">6 维风险因子雷达</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2A354D" />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                    <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
                    <Radar name="评分" dataKey="actual" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* 因子详情 */}
              <div>
                <h4 className="text-xs text-slate-500 mb-2">风险因子详情</h4>
                <div className="space-y-1.5">
                  {selected.factors.map(f => {
                    const contribution = (f.weight * f.score) / 100;
                    return (
                      <div key={f.id} className="bg-[#111625] rounded p-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[f.category]}20`, color: categoryColor[f.category] }}>{f.category}</span>
                            <span className="text-slate-200">{f.name}</span>
                            <span className="text-[10px] text-slate-500">权重 {f.weight}%</span>
                          </div>
                          <span className="font-mono text-blue-300">{f.score}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mb-1">{f.description}</div>
                        <div className="h-1 bg-[#20293F] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${f.score}%`, background: f.score >= 80 ? '#EF4444' : f.score >= 60 ? '#FF6D00' : '#22C55E' }} />
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">贡献: <span className="text-yellow-300">+{contribution.toFixed(1)}</span> 分</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default JobRiskLevelAssess;

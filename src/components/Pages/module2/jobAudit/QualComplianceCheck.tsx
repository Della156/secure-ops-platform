'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, CheckCircle2, XCircle,
  Shield, Award, FileText, User, Calendar, AlertCircle, ChevronRight,
  BarChart3, Activity, BookOpen, Clock, ListTree, Star, Lock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface ComplianceCheck {
  id: string;
  category: '等保 2.0' | 'ISO 27001' | 'GDPR' | 'PCI DSS' | '行业规范' | '内部规范';
  standard: string;
  clause: string;
  description: string;
  status: 'pass' | 'warn' | 'fail' | 'pending';
  evidence: string;
  lastChecked: string;
  nextCheck: string;
  responsible: string;
  relatedJobs: number;
  passRate: number;
}

const checks: ComplianceCheck[] = [
  { id: 'CC-001', category: '等保 2.0', standard: 'GB/T 22239-2019', clause: '8.1.4.2 访问控制', description: '应授予管理用户所需的最小权限，实现管理用户的权限分离', status: 'pass', evidence: 'RBAC 策略已实施，最小权限验证通过', lastChecked: '2026-06-01', nextCheck: '2026-07-01', responsible: '安全部', relatedJobs: 56, passRate: 96 },
  { id: 'CC-002', category: '等保 2.0', standard: 'GB/T 22239-2019', clause: '8.1.5.1 安全审计', description: '应启用安全审计功能，审计覆盖到每个用户', status: 'pass', evidence: '审计日志完整保留 180 天，覆盖所有用户', lastChecked: '2026-06-01', nextCheck: '2026-07-01', responsible: '安全部', relatedJobs: 142, passRate: 100 },
  { id: 'CC-003', category: '等保 2.0', standard: 'GB/T 22239-2019', clause: '8.1.4.3 访问控制', description: '应授予不同账户不同的访问权限，并分离操作员与审计员角色', status: 'warn', evidence: '部分岗位未严格分离操作员与审计员', lastChecked: '2026-06-01', nextCheck: '2026-07-01', responsible: 'HR + 安全部', relatedJobs: 28, passRate: 78 },
  { id: 'CC-004', category: 'ISO 27001', standard: 'A.9.2.1 用户注册与注销', description: '应有正式的用户注册和注销流程', status: 'pass', evidence: '账号生命周期管理流程已文档化', lastChecked: '2026-05-15', nextCheck: '2026-08-15', responsible: 'HR + IT', relatedJobs: 86, passRate: 94 },
  { id: 'CC-005', category: 'ISO 27001', standard: 'A.12.1.2 变更管理', description: '应控制信息的变更', status: 'warn', evidence: '紧急变更流程需补充', lastChecked: '2026-05-20', nextCheck: '2026-08-20', responsible: '运维部', relatedJobs: 142, passRate: 88 },
  { id: 'CC-006', category: 'ISO 27001', standard: 'A.16.1.2 事件报告', description: '应通过适当的管理渠道及时报告安全事件', status: 'pass', evidence: '事件响应流程 30 分钟内报告', lastChecked: '2026-05-25', nextCheck: '2026-08-25', responsible: '安全部', relatedJobs: 12, passRate: 100 },
  { id: 'CC-007', category: 'GDPR', standard: 'Article 32', clause: '安全处理义务', description: '实施适当的技术和组织措施确保数据安全', status: 'pass', evidence: '数据加密、访问控制、审计日志完备', lastChecked: '2026-05-10', nextCheck: '2026-08-10', responsible: 'DPO + 法务', relatedJobs: 42, passRate: 95 },
  { id: 'CC-008', category: 'PCI DSS', standard: 'v4.0 Requirement 7', clause: '按业务需要限制访问', status: 'fail', evidence: '部分账号权限过大，待整改', lastChecked: '2026-06-02', nextCheck: '2026-07-02', responsible: '安全部 + DBA', relatedJobs: 18, passRate: 62 },
  { id: 'CC-009', category: '行业规范', standard: 'JR/T 0068-2020', clause: '网络安全等级保护', description: '金融行业网络安全规范', status: 'pass', evidence: '符合 JR/T 0068-2020 三级要求', lastChecked: '2026-05-30', nextCheck: '2026-11-30', responsible: '安全部', relatedJobs: 142, passRate: 92 },
  { id: 'CC-010', category: '内部规范', standard: '内部 SOP-Q4', clause: '生产变更流程', description: '生产环境变更必须经过 3 级审批', status: 'pass', evidence: '审批流程已实施，平均审批时长 4.2 小时', lastChecked: '2026-06-01', nextCheck: '2026-09-01', responsible: '运维部', relatedJobs: 142, passRate: 96 },
];

const categoryColor: Record<ComplianceCheck['category'], string> = {
  '等保 2.0': '#0066FF',
  'ISO 27001': '#9333EA',
  'GDPR': '#22C55E',
  'PCI DSS': '#FF6D00',
  '行业规范': '#06B6D4',
  '内部规范': '#EAB308',
};

const statusConfig = {
  pass: { label: '符合', color: 'text-green-400', bg: 'bg-green-500/20' },
  warn: { label: '部分符合', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  fail: { label: '不符合', color: 'text-red-400', bg: 'bg-red-500/20' },
  pending: { label: '待检查', color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

// 合规趋势
const complianceTrend = [
  { month: '1月', pass: 88, warn: 8, fail: 4 },
  { month: '2月', pass: 90, warn: 7, fail: 3 },
  { month: '3月', pass: 92, warn: 6, fail: 2 },
  { month: '4月', pass: 93, warn: 5, fail: 2 },
  { month: '5月', pass: 94, warn: 4, fail: 2 },
  { month: '6月', pass: 96, warn: 3, fail: 1 },
];

export function QualComplianceCheck() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('CC-001');

  const filtered = checks.filter(c => {
    if (search && !c.standard.includes(search) && !c.clause.includes(search)) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const selected = selectedId ? checks.find(c => c.id === selectedId) : null;
  const stats = {
    total: checks.length,
    pass: checks.filter(c => c.status === 'pass').length,
    warn: checks.filter(c => c.status === 'warn').length,
    fail: checks.filter(c => c.status === 'fail').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="合规检查" value={stats.total} color="#0066FF" icon={<Shield className="w-4 h-4" />} />
        <StatBox label="符合" value={stats.pass} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="部分符合" value={stats.warn} color="#FF6D00" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="不符合" value={stats.fail} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">合规趋势（6 月）</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={complianceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Bar dataKey="pass" stackId="a" fill="#22C55E" name="符合" />
            <Bar dataKey="warn" stackId="a" fill="#FF6D00" name="部分符合" />
            <Bar dataKey="fail" stackId="a" fill="#EF4444" name="不符合" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">作业资质合规审核</h2>
            <p className="text-xs text-slate-500 mt-1">等保 2.0 / ISO 27001 / GDPR / PCI DSS / 行业 / 内部 — 6 大类合规标准</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新增检查
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索标准/条款"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部标准</option>
            <option value="等保 2.0">等保 2.0</option>
            <option value="ISO 27001">ISO 27001</option>
            <option value="GDPR">GDPR</option>
            <option value="PCI DSS">PCI DSS</option>
            <option value="行业规范">行业规范</option>
            <option value="内部规范">内部规范</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="pass">符合</option>
            <option value="warn">部分符合</option>
            <option value="fail">不符合</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">合规检查项 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(c => {
              const sc = statusConfig[c.status];
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === c.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{c.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[c.category]}20`, color: categoryColor[c.category] }}>{c.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">关联 {c.relatedJobs} 作业</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{c.standard} · {c.clause}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mb-1.5">{c.description}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>上次 <span className="text-slate-300">{c.lastChecked}</span></span>
                    <span>·</span>
                    <span>下次 <span className="text-blue-300">{c.nextCheck}</span></span>
                    <span>·</span>
                    <span>通过率 <span className="text-green-300 font-mono">{c.passRate}%</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[selected.category]}20`, color: categoryColor[selected.category] }}>{selected.category}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>{statusConfig[selected.status].label}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.standard}</h3>
              <div className="text-[10px] text-blue-300 font-mono mb-1">{selected.clause}</div>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>

            <div className="bg-[#111625] border border-green-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">证据 / 实施情况</div>
              <div className="text-xs text-green-300">{selected.evidence}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">上次检查</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.lastChecked}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">下次检查</div>
                <div className="text-blue-300 font-mono text-[10px]">{selected.nextCheck}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">负责部门</div>
                <div className="text-yellow-300">{selected.responsible}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">关联作业</div>
                <div className="text-blue-300 font-mono">{selected.relatedJobs}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">通过率</span>
                <span className={`font-mono ${selected.passRate >= 90 ? 'text-green-400' : selected.passRate >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{selected.passRate}%</span>
              </div>
              <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selected.passRate >= 90 ? 'bg-green-500' : selected.passRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${selected.passRate}%` }} />
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
              <FileText className="w-3 h-3" />查看详细报告
            </button>
          </div>
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

export default QualComplianceCheck;

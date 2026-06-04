'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Edit, CheckCircle2,
  XCircle, Clock, User, Shield, AlertCircle, Activity, Zap, Brain,
  FileText, ListTree, BarChart3, Settings, Play, Award, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface AuditRule {
  id: string;
  name: string;
  category: '资质检查' | '风险评估' | '合规验证' | '影响分析' | '历史记录';
  description: string;
  weight: number; // 0-100
  enabled: boolean;
  matchedJobs: number; // 30 天匹配数
  passRate: number;
  threshold: string;
  lastTriggered: string;
}

const rules: AuditRule[] = [
  { id: 'AR-001', name: '申请人资质验证', category: '资质检查', description: '验证申请人是否具备该类型作业的资质认证', weight: 20, enabled: true, matchedJobs: 142, passRate: 92, threshold: '具备相应资质证书', lastTriggered: '5 分钟前' },
  { id: 'AR-002', name: '目标资产风险等级', category: '风险评估', description: '检查目标资产的风险等级（核心 / 重要 / 一般）', weight: 15, enabled: true, matchedJobs: 142, passRate: 88, threshold: '核心资产需 CISO 审批', lastTriggered: '5 分钟前' },
  { id: 'AR-003', name: '作业时间窗口', category: '风险评估', description: '作业是否在批准的时间窗口内执行', weight: 10, enabled: true, matchedJobs: 142, passRate: 95, threshold: '仅工作日 22:00-06:00', lastTriggered: '1 小时前' },
  { id: 'AR-004', name: '等保合规检查', category: '合规验证', description: '是否符合等保 2.0 三级要求', weight: 18, enabled: true, matchedJobs: 142, passRate: 85, threshold: '等保三级', lastTriggered: '2 小时前' },
  { id: 'AR-005', name: '操作回滚方案', category: '影响分析', description: '作业是否提供完整回滚方案', weight: 12, enabled: true, matchedJobs: 142, passRate: 78, threshold: '必须有可执行回滚脚本', lastTriggered: '30 分钟前' },
  { id: 'AR-006', name: '业务影响范围', category: '影响分析', description: '评估对在线业务的影响范围', weight: 10, enabled: true, matchedJobs: 142, passRate: 90, threshold: '影响 < 30% 业务', lastTriggered: '10 分钟前' },
  { id: 'AR-007', name: '历史作业记录', category: '历史记录', description: '申请人近 30 天作业成功率', weight: 8, enabled: true, matchedJobs: 142, passRate: 94, threshold: '成功率 ≥ 90%', lastTriggered: '1 小时前' },
  { id: 'AR-008', name: '敏感操作检测', category: '合规验证', description: '检测作业中是否包含敏感操作', weight: 7, enabled: true, matchedJobs: 142, passRate: 82, threshold: '无明文密码、无 DROP TABLE', lastTriggered: '2 小时前' },
];

const categoryColor: Record<AuditRule['category'], string> = {
  资质检查: '#0066FF',
  风险评估: '#FF6D00',
  合规验证: '#9333EA',
  影响分析: '#22C55E',
  历史记录: '#EAB308',
};

// 待审核列表
const pendingAudits = [
  { id: 'JA-99831', name: '生产防火墙策略变更', applicant: '李娜', risk: 78, aiScore: 72, checks: '10/12 通过', issue: '核心资产需 CISO 审批（当前部门经理）', status: 'warn' },
  { id: 'JA-99830', name: 'Oracle 数据库表结构变更', applicant: '王芳', risk: 92, aiScore: 88, checks: '18/18 通过', issue: '', status: 'pass' },
  { id: 'JA-99829', name: 'Web 集群安全补丁批量安装', applicant: '陈磊', risk: 82, aiScore: 86, checks: '14/15 通过', issue: '回滚方案不完整', status: 'warn' },
  { id: 'JA-99827', name: '生产数据库慢 SQL 优化', applicant: '王芳', risk: 58, aiScore: 45, checks: '5/8 通过', issue: '包含 DROP INDEX 风险操作；历史作业成功率 65%', status: 'fail' },
  { id: 'JA-99825', name: 'Redis 集群重启', applicant: '陈磊', risk: 32, aiScore: 0, checks: '审核中...', issue: '', status: 'pending' },
];

// 趋势
const trend = [
  { time: '08:00', audited: 5, autoPass: 4, autoFail: 1 },
  { time: '10:00', audited: 12, autoPass: 9, autoFail: 2 },
  { time: '12:00', audited: 8, autoPass: 7, autoFail: 0 },
  { time: '14:00', audited: 15, autoPass: 12, autoFail: 2 },
  { time: '16:00', audited: 18, autoPass: 14, autoFail: 3 },
];

// AI 能力雷达
const aiRadar = [
  { dim: '速度', value: 95 },
  { dim: '准确性', value: 88 },
  { dim: '覆盖率', value: 92 },
  { dim: '可解释性', value: 78 },
  { dim: '学习能力', value: 85 },
  { dim: '风险识别', value: 90 },
];

export function AutoJobAudit() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = rules.filter(r => {
    if (search && !r.name.includes(search)) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="审核规则" value={rules.length} color="#0066FF" icon={<Settings className="w-4 h-4" />} />
        <StatBox label="启用" value={rules.filter(r => r.enabled).length} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="平均通过率" value="87%" color="#FF6D00" icon={<Award className="w-4 h-4" />} />
        <StatBox label="30 天审核" value={142} color="#9333EA" icon={<FileText className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">审核趋势</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Bar dataKey="autoPass" stackId="a" fill="#22C55E" name="自动通过" />
              <Bar dataKey="autoFail" stackId="a" fill="#EF4444" name="自动拒绝" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">AI 审核能力</h3>
          <ResponsiveContainer width="100%" height={150}>
            <RadarChart data={aiRadar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dim" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#9333EA" fill="#9333EA" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">作业申请自动审核</h2>
            <p className="text-xs text-slate-500 mt-1">8 大类规则 — AI 自动审核 + 风险评分 + 合规检查</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新增规则
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md">
              <Brain className="w-3.5 h-3.5" />AI 训练
            </button>
          </div>
        </div>
      </div>

      {/* 规则列表 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">审核规则 ({rules.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rules.map(r => (
            <div key={r.id} className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-slate-500 font-mono">{r.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[r.category]}20`, color: categoryColor[r.category] }}>{r.category}</span>
                    <span className="text-[10px] text-blue-300 font-mono">权重 {r.weight}%</span>
                  </div>
                  <div className="text-sm text-white font-medium">{r.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{r.description}</div>
                </div>
                <div className="text-right">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={r.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#2A354D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mb-1.5">
                <span className="text-slate-400">阈值: </span>
                <span className="text-yellow-300">{r.threshold}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <div className="text-slate-500">匹配</div>
                  <div className="text-blue-300 font-mono">{r.matchedJobs}</div>
                </div>
                <div>
                  <div className="text-slate-500">通过率</div>
                  <div className="text-green-300 font-mono">{r.passRate}%</div>
                </div>
                <div>
                  <div className="text-slate-500">最后触发</div>
                  <div className="text-slate-300 text-[10px]">{r.lastTriggered}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 待审核任务 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <h3 className="text-sm font-semibold text-white">最近自动审核任务</h3>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {pendingAudits.map(p => {
            const statusCfg = p.status === 'pass' ? { color: 'text-green-400', bg: 'bg-green-500/20', label: '通过' }
              : p.status === 'warn' ? { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: '警告' }
              : p.status === 'fail' ? { color: 'text-red-400', bg: 'bg-red-500/20', label: '拒绝' }
              : { color: 'text-blue-400', bg: 'bg-blue-500/20', label: '审核中' };
            return (
              <div key={p.id} className="px-4 py-3 border-b border-[#2A354D] hover:bg-[#111625]/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-blue-400 font-mono">{p.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusCfg.bg} ${statusCfg.color}`}>AI {statusCfg.label}</span>
                  <span className={`text-[10px] font-mono ${p.aiScore >= 80 ? 'text-green-400' : p.aiScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{p.aiScore}分</span>
                  <div className="flex-1" />
                  <span className="text-[10px] text-slate-500">{p.checks}</span>
                </div>
                <div className="text-sm text-white font-medium mb-1">{p.name}</div>
                {p.issue && <div className="text-[10px] text-orange-300">⚠ {p.issue}</div>}
              </div>
            );
          })}
        </div>
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

export default AutoJobAudit;

'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, Filter, Eye, FileText, Calendar,
  User, Server, Database, Network, Shield, TrendingUp, BarChart3,
  CheckCircle2, XCircle, Clock, ChevronRight, Award, Target,
  BookOpen, AlertCircle, Activity, Zap, ListTree
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface DrillTaskReport {
  id: string;
  drillName: string;
  drillType: '全链路' | '单系统' | '数据库' | '应用' | '网络';
  taskNo: string;
  scheduledTime: string;
  completedTime: string;
  duration: string;
  status: 'success' | 'partial' | 'failed' | 'running';
  target: string;
  owner: string;
  rpoActual: string; // 实际 RPO
  rpoTarget: string; // 目标 RPO
  rtoActual: string; // 实际 RTO
  rtoTarget: string; // 目标 RTO
  stepsTotal: number;
  stepsSuccess: number;
  stepsFailed: number;
  dataVolume: string; // 数据量
  loss: string; // 数据丢失
  switchover: string; // 切换模式
  score: number; // 评分 0-100
  improvements: number; // 改进项数
  riskLevel: 'low' | 'medium' | 'high';
}

const reports: DrillTaskReport[] = [
  { id: 'TR-2026060301', drillName: '金融核心系统全链路灾备切换', drillType: '全链路', taskNo: 'DT-99821', scheduledTime: '2026-06-03 09:00:00', completedTime: '2026-06-03 10:35:00', duration: '01:35:00', status: 'success', target: 'fin-core-cluster', owner: '张伟', rpoActual: '0s', rpoTarget: '≤30s', rtoActual: '8min 12s', rtoTarget: '≤15min', stepsTotal: 18, stepsSuccess: 18, stepsFailed: 0, dataVolume: '2.3TB', loss: '0B', switchover: '手动确认 + 自动', score: 96, improvements: 2, riskLevel: 'low' },
  { id: 'TR-2026060201', drillName: 'Oracle RPO/RTO 演练', drillType: '数据库', taskNo: 'DT-99820', scheduledTime: '2026-06-02 14:00:00', completedTime: '2026-06-02 16:12:00', duration: '02:12:00', status: 'partial', target: 'oracle-prod', owner: '王芳', rpoActual: '0s', rpoTarget: '≤60s', rtoActual: '42min', rtoTarget: '≤30min', stepsTotal: 24, stepsSuccess: 22, stepsFailed: 2, dataVolume: '458GB', loss: '2.1MB', switchover: '全自动', score: 78, improvements: 5, riskLevel: 'medium' },
  { id: 'TR-2026060202', drillName: '防火墙故障切换演练', drillType: '单系统', taskNo: 'DT-99819', scheduledTime: '2026-06-02 10:30:00', completedTime: '2026-06-02 10:48:00', duration: '00:18:00', status: 'success', target: 'fw-core-01/02', owner: '李娜', rpoActual: '0s', rpoTarget: '≤10s', rtoActual: '15s', rtoTarget: '≤30s', stepsTotal: 8, stepsSuccess: 8, stepsFailed: 0, dataVolume: '会话级', loss: '0B', switchover: 'BGP 触发', score: 98, improvements: 1, riskLevel: 'low' },
  { id: 'TR-2026060101', drillName: '域控制器 AD 容灾演练', drillType: '单系统', taskNo: 'DT-99818', scheduledTime: '2026-06-01 09:00:00', completedTime: '2026-06-01 09:42:00', duration: '00:42:00', status: 'success', target: 'dc-01/dc-02', owner: '刘洋', rpoActual: '0s', rpoTarget: '≤60s', rtoActual: '12min', rtoTarget: '≤20min', stepsTotal: 16, stepsSuccess: 16, stepsFailed: 0, dataVolume: 'AD DB 2GB', loss: '0B', switchover: '手动 + 自动复制', score: 92, improvements: 2, riskLevel: 'low' },
  { id: 'TR-2026060102', drillName: '邮件系统异地灾备切换', drillType: '应用', taskNo: 'DT-99817', scheduledTime: '2026-06-01 22:00:00', completedTime: '2026-06-01 22:25:00', duration: '00:25:00', status: 'failed', target: 'mail-prod', owner: '陈磊', rpoActual: '15min', rpoTarget: '≤30min', rtoActual: '超时', rtoTarget: '≤45min', stepsTotal: 12, stepsSuccess: 5, stepsFailed: 7, dataVolume: '邮件库 1.2TB', loss: '850 封邮件', switchover: '全自动', score: 35, improvements: 8, riskLevel: 'high' },
  { id: 'TR-2026053101', drillName: '核心交换机 HA 切换演练', drillType: '网络', taskNo: 'DT-99816', scheduledTime: '2026-05-31 16:00:00', completedTime: '2026-05-31 16:18:00', duration: '00:18:00', status: 'success', target: 'sw-core-01/02', owner: '李娜', rpoActual: '<1s', rpoTarget: '≤5s', rtoActual: '8s', rtoTarget: '≤30s', stepsTotal: 10, stepsSuccess: 10, stepsFailed: 0, dataVolume: '配置 + 会话', loss: '0B', switchover: 'VRRP', score: 95, improvements: 1, riskLevel: 'low' },
  { id: 'TR-2026053001', drillName: '财务系统月度数据恢复演练', drillType: '应用', taskNo: 'DT-99815', scheduledTime: '2026-05-30 02:00:00', completedTime: '2026-05-30 04:25:00', duration: '02:25:00', status: 'partial', target: 'finance-db', owner: '王芳', rpoActual: '0s', rpoTarget: '≤60s', rtoActual: '38min', rtoTarget: '≤30min', stepsTotal: 14, stepsSuccess: 11, stepsFailed: 0, dataVolume: '420GB', loss: '0B', switchover: '手动', score: 82, improvements: 3, riskLevel: 'medium' },
];

const statusConfig = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20' },
  partial: { label: '部分成功', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
  running: { label: '进行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

const riskColor: Record<DrillTaskReport['riskLevel'], string> = {
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  high: 'bg-red-500/20 text-red-400 border-red-500/40',
};

// 评分分布
const scoreDistribution = [
  { range: '90-100', count: 8, color: '#22C55E' },
  { range: '80-89', count: 12, color: '#0066FF' },
  { range: '70-79', count: 6, color: '#FF6D00' },
  { range: '60-69', count: 3, color: '#EAB308' },
  { range: '<60', count: 2, color: '#EF4444' },
];

// 月度趋势
const monthlyTrend = [
  { month: '1月', avgScore: 78, success: 11, total: 12 },
  { month: '2月', avgScore: 82, success: 14, total: 15 },
  { month: '3月', avgScore: 85, success: 16, total: 18 },
  { month: '4月', avgScore: 87, success: 21, total: 22 },
  { month: '5月', avgScore: 89, success: 25, total: 28 },
  { month: '6月', avgScore: 90, success: 8, total: 8 },
];

export function DrillTaskReport() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('TR-2026060301');

  const filtered = reports.filter(r => {
    if (search && !r.drillName.includes(search) && !r.id.includes(search)) return false;
    if (typeFilter !== 'all' && r.drillType !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const selected = selectedId ? reports.find(r => r.id === selectedId) : null;
  const stats = {
    total: reports.length,
    success: reports.filter(r => r.status === 'success').length,
    failed: reports.filter(r => r.status === 'failed').length,
    avgScore: (reports.reduce((s, r) => s + r.score, 0) / reports.length).toFixed(1),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="报告总数" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="成功率" value={Math.round((stats.success / stats.total) * 100) + '%'} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="平均评分" value={stats.avgScore} color="#FF6D00" icon={<Award className="w-4 h-4" />} />
      </div>

      {/* 趋势 + 分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">演练评分趋势（6 月）</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Line type="monotone" dataKey="avgScore" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} name="平均评分" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">评分分布</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="range" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Bar dataKey="count" name="演练数">
                {scoreDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">备份恢复演练任务报告</h2>
            <p className="text-xs text-slate-500 mt-1">演练任务执行报告，含 RPO/RTO 实测 + 评分 + 改进项</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />批量导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索演练/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="全链路">全链路</option>
            <option value="单系统">单系统</option>
            <option value="数据库">数据库</option>
            <option value="应用">应用</option>
            <option value="网络">网络</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="success">成功</option>
            <option value="partial">部分成功</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>

      {/* 报告列表 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D]">
          <h3 className="text-sm font-semibold text-white">报告列表 ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A354D] text-slate-400">
                <th className="text-left px-3 py-2 font-medium">报告ID</th>
                <th className="text-left px-3 py-2 font-medium">演练名称</th>
                <th className="text-left px-3 py-2 font-medium">类型</th>
                <th className="text-left px-3 py-2 font-medium">状态</th>
                <th className="text-left px-3 py-2 font-medium">RPO</th>
                <th className="text-left px-3 py-2 font-medium">RTO</th>
                <th className="text-left px-3 py-2 font-medium">步骤</th>
                <th className="text-left px-3 py-2 font-medium">风险</th>
                <th className="text-left px-3 py-2 font-medium">评分</th>
                <th className="text-left px-3 py-2 font-medium">改进</th>
                <th className="text-left px-3 py-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const sc = statusConfig[r.status as keyof typeof statusConfig];
                const rpoOk = parseInt(r.rpoActual) <= parseInt(r.rpoTarget.replace(/[^\d]/g, '')) || r.rpoActual === '0s' || r.rpoActual === '<1s';
                const rtoOk = r.rtoActual !== '超时' && (parseInt(r.rtoActual) <= parseInt(r.rtoTarget.replace(/[^\d]/g, '')) || r.rtoActual === '8s' || r.rtoActual === '15s' || r.rtoActual === '12min');
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}
                  >
                    <td className="px-3 py-2 text-blue-400 font-mono">{r.id}</td>
                    <td className="px-3 py-2 text-white">{r.drillName}</td>
                    <td className="px-3 py-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{r.drillType}</span></td>
                    <td className="px-3 py-2"><span className={`text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                    <td className="px-3 py-2">
                      <span className={rpoOk ? 'text-green-400' : 'text-red-400'}>{r.rpoActual}</span>
                      <span className="text-slate-500 ml-1 text-[10px]">/ {r.rpoTarget}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={rtoOk ? 'text-green-400' : 'text-red-400'}>{r.rtoActual}</span>
                      <span className="text-slate-500 ml-1 text-[10px]">/ {r.rtoTarget}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-green-400">{r.stepsSuccess}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-300">{r.stepsTotal}</span>
                      {r.stepsFailed > 0 && <span className="text-red-400 ml-1">(-{r.stepsFailed})</span>}
                    </td>
                    <td className="px-3 py-2"><span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[r.riskLevel]}`}>{r.riskLevel === 'low' ? '低' : r.riskLevel === 'medium' ? '中' : '高'}</span></td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${r.score >= 90 ? 'bg-green-500' : r.score >= 70 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${r.score}%` }} />
                        </div>
                        <span className={`font-mono ${r.score >= 90 ? 'text-green-400' : r.score >= 70 ? 'text-orange-400' : 'text-red-400'}`}>{r.score}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center text-slate-300">{r.improvements}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-[#2A354D] rounded" title="查看" onClick={(e) => e.stopPropagation()}><Eye className="w-3 h-3 text-blue-400" /></button>
                        <button className="p-1 hover:bg-[#2A354D] rounded" title="下载" onClick={(e) => e.stopPropagation()}><Download className="w-3 h-3 text-green-400" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

export default DrillTaskReport;

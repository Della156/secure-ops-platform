'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Download, RefreshCw, Eye, FileText,
  Clock, User, CheckCircle2, XCircle, AlertCircle, PlayCircle, ChevronRight,
  Activity, TrendingUp, Database, Server, Shield, Cpu, Calendar, BarChart3,
  Award, Target, Sparkles, ArrowUpRight, ArrowDownRight, Layers, Zap, AlertTriangle,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/Common/StatusBadge';

/**
 * 2-34-1 作业综合辅助视图（业务驾驶舱）
 *
 * 8 大模块：
 *  1. 5 KPI（总任务 / 今日完成 / 失败率 / 平均耗时 / SLA 达成率）
 *  2. 6 维作业能力雷达
 *  3. 任务状态分布（饼图）
 *  4. 7 日趋势（折线图 + 成功/失败）
 *  5. 作业类型分布（柱状图）
 *  6. 实时任务列表
 *  7. 高危任务 Top 6
 *  8. 今日完成进度
 */

interface AssistTask {
  id: string;
  name: string;
  target: string;
  type: 'backup' | 'patch' | 'cleanup' | 'sync' | 'detect' | 'archive';
  status: 'success' | 'failed' | 'running' | 'pending' | 'abnormal';
  result: string;
  checkTime: string;
  duration: number; // 分钟
  assignee: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  process?: string[];
  errorStep?: string;
}

const INITIAL_TASKS: AssistTask[] = [
  { id: 'JOB-20260604001', name: '数据库备份作业', target: '生产主库 - MySQL 8.0', type: 'backup', status: 'success', result: '备份成功，文件大小 2.5GB', checkTime: '2026-06-04 02:00:00', duration: 15, assignee: '系统自动', risk: 'low', process: ['开始备份', '压缩数据', '上传至备份服务器', '验证完整性', '完成'] },
  { id: 'JOB-20260604002', name: '安全补丁安装', target: 'Web 服务器集群 (12 台)', type: 'patch', status: 'running', result: '正在安装补丁 8/15...', checkTime: '2026-06-04 09:30:00', duration: 12, assignee: '系统自动', risk: 'medium', process: ['下载补丁包', '分发至节点', '安装中 8/15'] },
  { id: 'JOB-20260604003', name: '配置同步作业', target: '配置服务器', type: 'sync', status: 'failed', result: '同步失败：节点 CS-03 网络超时', checkTime: '2026-06-04 10:00:00', duration: 3, assignee: '系统自动', risk: 'high', errorStep: '网络握手阶段' },
  { id: 'JOB-20260604004', name: '性能检测作业', target: '应用服务器集群', type: 'detect', status: 'abnormal', result: 'CPU 使用率异常：HOST-APP-005 达 95%', checkTime: '2026-06-04 11:00:00', duration: 5, assignee: '系统自动', risk: 'high' },
  { id: 'JOB-20260604005', name: '日志清理作业', target: '日志服务器', type: 'cleanup', status: 'success', result: '清理完成，释放空间 5.2GB', checkTime: '2026-06-04 01:00:00', duration: 8, assignee: '系统自动', risk: 'low' },
  { id: 'JOB-20260604006', name: '数据归档作业', target: '历史数据库', type: 'archive', status: 'success', result: '归档成功，归档数据 12GB', checkTime: '2026-06-04 03:00:00', duration: 45, assignee: '系统自动', risk: 'low' },
  { id: 'JOB-20260603007', name: '基线检查作业', target: '生产环境 56 台主机', type: 'detect', status: 'success', result: '基线合规率 98.2%', checkTime: '2026-06-03 23:00:00', duration: 25, assignee: '系统自动', risk: 'low' },
  { id: 'JOB-20260603008', name: '安全补丁回滚', target: 'HOST-WEB-008', type: 'patch', status: 'failed', result: '回滚失败：服务依赖冲突', checkTime: '2026-06-03 16:00:00', duration: 18, assignee: '运维-张工', risk: 'critical', errorStep: '服务恢复阶段' },
];

const TYPE_CONFIG: Record<AssistTask['type'], { label: string; color: string; icon: any }> = {
  backup: { label: '备份', color: 'text-blue-400 bg-blue-500/10', icon: Database },
  patch: { label: '补丁', color: 'text-orange-400 bg-orange-500/10', icon: Shield },
  cleanup: { label: '清理', color: 'text-cyan-400 bg-cyan-500/10', icon: FileText },
  sync: { label: '同步', color: 'text-purple-400 bg-purple-500/10', icon: Server },
  detect: { label: '检测', color: 'text-green-400 bg-green-500/10', icon: Activity },
  archive: { label: '归档', color: 'text-yellow-400 bg-yellow-500/10', icon: Layers },
};

const STATUS_BADGE: Record<AssistTask['status'], { status: any; text: string; color: string }> = {
  success: { status: 'success', text: '成功', color: '#22C55E' },
  failed: { status: 'failed', text: '失败', color: '#EF4444' },
  running: { status: 'running', text: '运行中', color: '#3B82F6' },
  pending: { status: 'pending', text: '待执行', color: '#6B7280' },
  abnormal: { status: 'warning', text: '异常', color: '#EAB308' },
};

const RISK_BADGE: Record<AssistTask['risk'], { status: any; text: string }> = {
  low: { status: 'success', text: '低风险' },
  medium: { status: 'info', text: '中风险' },
  high: { status: 'warning', text: '高风险' },
  critical: { status: 'failed', text: '严重' },
};

const TREND_DATA = [
  { day: '5/29', success: 28, failed: 2, abnormal: 1 },
  { day: '5/30', success: 32, failed: 1, abnormal: 0 },
  { day: '5/31', success: 35, failed: 3, abnormal: 2 },
  { day: '6/1', success: 30, failed: 2, abnormal: 1 },
  { day: '6/2', success: 38, failed: 1, abnormal: 0 },
  { day: '6/3', success: 42, failed: 4, abnormal: 2 },
  { day: '6/4', success: 28, failed: 2, abnormal: 1 },
];

const CAPABILITY_RADAR = [
  { dimension: '耗时控制', score: 92 },
  { dimension: '成功率', score: 95 },
  { dimension: '资源利用', score: 88 },
  { dimension: '错误恢复', score: 90 },
  { dimension: '并发能力', score: 85 },
  { dimension: '可观测性', score: 93 },
];

export function JobAssistantView() {
  const [tasks, setTasks] = useState<AssistTask[]>(INITIAL_TASKS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('JOB-20260604001');

  // 实时推进
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) => prev.map((t) => {
        if (t.status !== 'running') return t;
        const newDuration = t.duration + 0.1;
        if (newDuration > 20 && t.id === 'JOB-20260604002') {
          return { ...t, status: 'success' as const, duration: Math.round(newDuration), result: '安装完成 15/15 节点' };
        }
        return { ...t, duration: Math.round(newDuration * 10) / 10 };
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 过滤
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.name.includes(search) && !t.target.includes(search)) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      return true;
    });
  }, [tasks, search, statusFilter, typeFilter]);

  // 统计
  const stats = {
    total: tasks.length,
    success: tasks.filter((t) => t.status === 'success').length,
    failed: tasks.filter((t) => t.status === 'failed').length,
    running: tasks.filter((t) => t.status === 'running').length,
    abnormal: tasks.filter((t) => t.status === 'abnormal').length,
    todayDone: 28,
    todayTotal: 32,
    avgDuration: 14.2,
    slaRate: 96.5,
  };

  // 状态分布
  const statusPie = [
    { name: '成功', value: stats.success, color: '#22C55E' },
    { name: '失败', value: stats.failed, color: '#EF4444' },
    { name: '运行中', value: stats.running, color: '#3B82F6' },
    { name: '异常', value: stats.abnormal, color: '#EAB308' },
  ];

  // 作业类型分布
  const typeBar = [
    { type: '备份', count: 12 },
    { type: '补丁', count: 18 },
    { type: '清理', count: 8 },
    { type: '同步', count: 6 },
    { type: '检测', count: 15 },
    { type: '归档', count: 4 },
  ];

  const selected = selectedId ? tasks.find((t) => t.id === selectedId) : null;
  const highRiskTasks = tasks.filter((t) => t.risk === 'high' || t.risk === 'critical').slice(0, 6);
  const todayProgress = Math.round((stats.todayDone / stats.todayTotal) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            作业综合辅助视图
          </h1>
          <p className="text-slate-400 mt-1 text-sm">业务驾驶舱 · 辅助任务执行全链路 · 今日完成 28/32 · SLA 达成 96.5%</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><RefreshCw className="w-4 h-4 mr-1" />刷新</Button>
          <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
        </div>
      </div>

      {/* 5 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="总任务" value={stats.total} color="text-blue-400" icon={Activity} sub="覆盖 6 类作业" />
        <KPI label="今日完成" value={`${stats.todayDone}/${stats.todayTotal}`} color="text-green-400" icon={CheckCircle2} sub={`完成率 ${todayProgress}%`} trend="up" />
        <KPI label="失败率" value={`${Math.round((stats.failed / stats.total) * 100)}%`} color="text-red-400" icon={XCircle} sub={`${stats.failed} 个失败`} trend="down" />
        <KPI label="平均耗时" value={`${stats.avgDuration}m`} color="text-cyan-400" icon={Clock} sub="较昨日 -1.2m" trend="down" />
        <KPI label="SLA 达成率" value={`${stats.slaRate}%`} color="text-purple-400" icon={Target} sub="2 个超时" trend="up" />
      </div>

      {/* 6 维能力雷达 + 状态分布 + 今日进度 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />6 维作业能力
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={CAPABILITY_RADAR}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />任务状态分布
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={2}>
                {statusPie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />今日完成进度
          </h3>
          <div className="space-y-3 mt-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">作业完成度</span>
                <span className="text-sm font-semibold text-cyan-400">{stats.todayDone}/{stats.todayTotal}</span>
              </div>
              <div className="h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${todayProgress}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">成功率</span>
                <span className="text-sm font-semibold text-green-400">{Math.round((stats.success / stats.total) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${(stats.success / stats.total) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">SLA 达成</span>
                <span className="text-sm font-semibold text-purple-400">{stats.slaRate}%</span>
              </div>
              <div className="h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${stats.slaRate}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-[#2A354D] grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-blue-400">{stats.success}</p>
                <p className="text-[10px] text-slate-500">已完成</p>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-400">{stats.running}</p>
                <p className="text-[10px] text-slate-500">进行中</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 7 日趋势 + 作业类型分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />7 日作业趋势
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="gSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="success" stroke="#22C55E" fill="url(#gSuccess)" strokeWidth={2} />
              <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="abnormal" stroke="#EAB308" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />作业类型分布
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typeBar}>
              <XAxis dataKey="type" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#A855F7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 任务列表 + 详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <Input className="pl-8" placeholder="搜索任务/目标..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                <option value="all">全部状态</option>
                <option value="success">成功</option>
                <option value="failed">失败</option>
                <option value="running">运行中</option>
                <option value="abnormal">异常</option>
                <option value="pending">待执行</option>
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                <option value="all">全部类型</option>
                <option value="backup">备份</option>
                <option value="patch">补丁</option>
                <option value="cleanup">清理</option>
                <option value="sync">同步</option>
                <option value="detect">检测</option>
                <option value="archive">归档</option>
              </select>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-slate-200 mb-3">任务列表 ({filtered.length})</h3>
            <div className="space-y-2 max-h-[440px] overflow-y-auto">
              {filtered.map((t) => {
                const Td = TYPE_CONFIG[t.type];
                const TIcon = Td.icon;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border-l-2 ${
                      selectedId === t.id ? 'bg-[#0066FF]/10 border-l-[#0066FF]' : 'bg-[#111625] border-l-transparent hover:border-l-[#2A354D]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] text-slate-500">{t.id}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${Td.color}`}>
                        <TIcon className="w-3 h-3" />{Td.label}
                      </span>
                      <StatusBadge status={STATUS_BADGE[t.status].status} />
                      <StatusBadge status={RISK_BADGE[t.risk].status} />
                    </div>
                    <p className="text-sm text-slate-100 mb-1">{t.name}</p>
                    <p className="text-xs text-slate-400 mb-1.5">{t.result}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{t.assignee}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.checkTime}</span>
                      <span>·</span>
                      <span>耗时: {t.duration}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          {selected && (
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] text-slate-500">{selected.id}</span>
                <StatusBadge status={STATUS_BADGE[selected.status].status} />
                <StatusBadge status={RISK_BADGE[selected.risk].status} />
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">{selected.name}</h3>
              <p className="text-xs text-slate-500 mb-3">目标: {selected.target}</p>

              <div className="space-y-2">
                <Field label="执行结果" value={selected.result} highlight={selected.status === 'failed' || selected.status === 'abnormal'} />
                {selected.errorStep && <Field label="失败阶段" value={selected.errorStep} highlight />}
                <div className="grid grid-cols-2 gap-2">
                  <Field label="负责人" value={selected.assignee} />
                  <Field label="耗时" value={`${selected.duration}m`} />
                </div>
              </div>

              {selected.process && (
                <div className="mt-3 p-2.5 bg-[#111625] rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">处理过程</p>
                  <div className="space-y-1.5">
                    {selected.process.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-slate-200">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <Button variant="primary" size="sm" className="flex-1">
                  <Eye className="w-3.5 h-3.5 mr-1" />查看详情
                </Button>
                {selected.status === 'failed' && (
                  <Button variant="primary" size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />重试
                  </Button>
                )}
              </div>
            </Card>
          )}

          {highRiskTasks.length > 0 && (
            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />高危任务 Top {highRiskTasks.length}
              </h3>
              <div className="space-y-1.5">
                {highRiskTasks.map((t) => (
                  <div key={t.id} onClick={() => setSelectedId(t.id)} className="flex items-center gap-2 p-2 bg-[#111625] rounded cursor-pointer hover:bg-[#1A2236]">
                    <AlertTriangle className={`w-3.5 h-3.5 ${t.risk === 'critical' ? 'text-red-500' : 'text-orange-400'}`} />
                    <span className="text-sm text-slate-200 flex-1 truncate">{t.name}</span>
                    <StatusBadge status={STATUS_BADGE[t.status].status} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub, trend }: { label: string; value: number | string; color: string; icon: any; sub?: string; trend?: 'up' | 'down' }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
        {trend && (
          <span className={`text-[10px] flex items-center gap-0.5 ml-auto ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-2.5 rounded-lg ${highlight ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#111625]'}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm mt-0.5 break-all ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p>
    </div>
  );
}

export default JobAssistantView;

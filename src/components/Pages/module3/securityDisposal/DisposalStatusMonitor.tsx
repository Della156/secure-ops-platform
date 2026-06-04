'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Eye, RefreshCw, PlayCircle,
  PauseCircle, Clock, Activity, CheckCircle2,
  XCircle, AlertCircle, Server, Lock,
  Shield, Zap, ArrowRight, MoreVertical
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface DisposalTask {
  id: string;
  name: string;
  caseId: string;
  status: 'pending' | 'running' | 'awaiting_approval' | 'paused' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  startTime: string;
  estimatedTime?: string;
  endTime?: string;
  progress: number;
  targetAsset: string;
  operator: string;
  approver?: string;
  actions: { name: string; status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'; duration?: string }[];
}

const tasks: DisposalTask[] = [
  {
    id: 'TSK-20260603001',
    name: 'CVE-2024-3094 XZ Utils 后门处置',
    caseId: 'SD-20260603001',
    status: 'running',
    priority: 'critical',
    currentStep: '推送补丁',
    totalSteps: 6,
    completedSteps: 3,
    startTime: '2026-06-03 09:45:18',
    estimatedTime: '2 分钟',
    progress: 50,
    targetAsset: '服务器集群（23 台）',
    operator: '系统自动',
    actions: [
      { name: '隔离受影响主机', status: 'success', duration: '12s' },
      { name: '收集证据', status: 'success', duration: '45s' },
      { name: '推送补丁', status: 'running', duration: '1m 24s' },
      { name: '重启服务', status: 'pending' },
      { name: '验证修复', status: 'pending' },
      { name: '通知业务方', status: 'pending' },
    ],
  },
  {
    id: 'TSK-20260603002',
    name: 'DDoS 攻击流量清洗',
    caseId: 'SD-20260603006',
    status: 'running',
    priority: 'high',
    currentStep: '清洗中心引流',
    totalSteps: 4,
    completedSteps: 1,
    startTime: '2026-06-03 09:38:00',
    estimatedTime: '5 分钟',
    progress: 25,
    targetAsset: '边界防火墙',
    operator: '系统自动',
    actions: [
      { name: '流量牵引', status: 'success', duration: '4s' },
      { name: '清洗中心引流', status: 'running', duration: '3m' },
      { name: '黑名单更新', status: 'pending' },
      { name: '回注流量', status: 'pending' },
    ],
  },
  {
    id: 'TSK-20260603003',
    name: '横向移动账号冻结',
    caseId: 'SD-20260603003',
    status: 'awaiting_approval',
    priority: 'high',
    currentStep: '等待审批',
    totalSteps: 4,
    completedSteps: 2,
    startTime: '2026-06-03 09:18:42',
    progress: 50,
    targetAsset: '域账号 - zhang.wei',
    operator: 'AI 推荐',
    approver: '李工',
    actions: [
      { name: '检测异常', status: 'success', duration: '5s' },
      { name: '建议处置动作', status: 'success', duration: '2s' },
      { name: '审批', status: 'running' },
      { name: '冻结账号', status: 'pending' },
      { name: '强制注销会话', status: 'pending' },
    ],
  },
  {
    id: 'TSK-20260602001',
    name: '挖矿木马处置 (Kinsing)',
    caseId: 'SD-20260603002',
    status: 'completed',
    priority: 'high',
    currentStep: '完成',
    totalSteps: 6,
    completedSteps: 6,
    startTime: '2026-06-03 07:30:12',
    endTime: '2026-06-03 07:32:40',
    progress: 100,
    targetAsset: '终端-0128',
    operator: '系统自动',
    actions: [
      { name: '隔离挖矿主机', status: 'success', duration: '8s' },
      { name: '杀进程', status: 'success', duration: '3s' },
      { name: '清除持久化', status: 'success', duration: '18s' },
      { name: '杀挖矿文件', status: 'success', duration: '12s' },
      { name: '系统加固', status: 'success', duration: '32s' },
      { name: '恢复业务', status: 'success', duration: '15s' },
    ],
  },
  {
    id: 'TSK-20260602002',
    name: '钓鱼邮件批量删除',
    caseId: 'SD-20260602001',
    status: 'completed',
    priority: 'medium',
    currentStep: '完成',
    totalSteps: 4,
    completedSteps: 4,
    startTime: '2026-06-02 06:00:00',
    endTime: '2026-06-02 06:08:23',
    progress: 100,
    targetAsset: '邮件服务器',
    operator: '系统自动',
    actions: [
      { name: '从所有邮箱删除', status: 'success', duration: '2m 18s' },
      { name: '重置点击用户密码', status: 'success', duration: '1m 45s' },
      { name: '扫描终端落地的附件', status: 'success', duration: '3m 12s' },
      { name: '推送告警', status: 'success', duration: '8s' },
    ],
  },
];

const statusConfig: Record<DisposalTask['status'], { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: '待执行', color: 'text-slate-400', bg: 'bg-slate-500/20', icon: <Clock className="w-4 h-4" /> },
  running: { label: '执行中', color: 'text-green-400', bg: 'bg-green-500/20', icon: <Activity className="w-4 h-4" /> },
  awaiting_approval: { label: '待审批', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <Clock className="w-4 h-4" /> },
  paused: { label: '已暂停', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: <PauseCircle className="w-4 h-4" /> },
  completed: { label: '已完成', color: 'text-green-500', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-4 h-4" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-4 h-4" /> },
  cancelled: { label: '已取消', color: 'text-slate-500', bg: 'bg-slate-500/20', icon: <XCircle className="w-4 h-4" /> },
};

const priorityColor: Record<DisposalTask['priority'], string> = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

const progressData = [
  { time: '09:40', running: 3, pending: 2, completed: 1 },
  { time: '09:42', running: 2, pending: 3, completed: 2 },
  { time: '09:44', running: 3, pending: 2, completed: 3 },
  { time: '09:46', running: 2, pending: 3, completed: 4 },
  { time: '09:48', running: 3, pending: 2, completed: 5 },
];

export function DisposalStatusMonitor() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('TSK-20260603001');

  const filtered = tasks.filter(t => {
    if (search && !t.name.includes(search) && !t.targetAsset.includes(search) && !t.id.includes(search)) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const selected = selectedId ? tasks.find(t => t.id === selectedId) : null;
  const stats = {
    running: tasks.filter(t => t.status === 'running').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    awaiting_approval: tasks.filter(t => t.status === 'awaiting_approval').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="执行中" value={stats.running} color="#22C55E" icon={<Activity className="w-4 h-4" />} pulse />
        <StatBox label="待执行" value={stats.pending} color="#94A3B8" icon={<Clock className="w-4 h-4" />} />
        <StatBox label="待审批" value={stats.awaiting_approval} color="#EAB308" icon={<Clock className="w-4 h-4" />} />
        <StatBox label="已完成" value={stats.completed} color="#0066FF" icon={<CheckCircle2 className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">任务执行趋势（30分钟）</h3>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Line type="monotone" dataKey="running" stroke="#22C55E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pending" stroke="#94A3B8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="completed" stroke="#0066FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">安全处置任务状态监控</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center justify-between bg-[#111625] rounded p-2">
              <span className="text-slate-500">总体成功率</span>
              <span className="text-green-400 font-mono">94%</span>
            </div>
            <div className="flex items-center justify-between bg-[#111625] rounded p-2">
              <span className="text-slate-500">平均处置时间</span>
              <span className="text-blue-400 font-mono">3.2 分钟</span>
            </div>
            <div className="flex items-center justify-between bg-[#111625] rounded p-2">
              <span className="text-slate-500">自动化处置占比</span>
              <span className="text-cyan-400 font-mono">78%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text" placeholder="搜索任务/资产..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md focus:border-blue-500 outline-none"
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md">
              <option value="all">全部状态</option>
              <option value="pending">待执行</option>
              <option value="running">执行中</option>
              <option value="awaiting_approval">待审批</option>
              <option value="paused">已暂停</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">任务列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(t => {
              const sc = statusConfig[t.status];
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === t.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{t.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColor[t.priority]}`}>
                      {t.priority === 'critical' ? '紧急' : t.priority === 'high' ? '高' : t.priority === 'medium' ? '中' : '低'}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{t.name}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><Server className="w-3 h-3" />{t.targetAsset}</span>
                    <span>·</span>
                    <span>当前：{t.currentStep}</span>
                    <span>·</span>
                    <span>{t.completedSteps}/{t.totalSteps} 步</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${t.progress === 100 ? 'bg-green-500' : t.status === 'running' ? 'bg-blue-500' : t.status === 'failed' ? 'bg-red-500' : 'bg-slate-500'}`}
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-mono w-10 text-right">{t.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3 max-h-[600px] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColor[selected.priority]}`}>
                  {selected.priority === 'critical' ? '紧急' : selected.priority === 'high' ? '高' : selected.priority === 'medium' ? '中' : '低'}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                  {statusConfig[selected.status].icon}{statusConfig[selected.status].label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
              <p className="text-xs text-slate-400">关联案例：{selected.caseId}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">目标资产</div>
                <div className="text-slate-200">{selected.targetAsset}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">操作人</div>
                <div className="text-slate-200">{selected.operator}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">预计耗时</div>
                <div className="text-slate-200 font-mono">{selected.estimatedTime || '-'}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">执行进度</span>
                <span className="text-xs text-white font-mono">{selected.completedSteps}/{selected.totalSteps} 步</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${selected.progress === 100 ? 'bg-green-500' : selected.status === 'running' ? 'bg-blue-500' : selected.status === 'failed' ? 'bg-red-500' : 'bg-slate-500'}`}
                  style={{ width: `${selected.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">当前步骤：{selected.currentStep}</p>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">动作链</div>
              <div className="space-y-1.5">
                {selected.actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-[#111625] rounded">
                    {a.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> :
                     a.status === 'running' ? <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> :
                     a.status === 'failed' ? <XCircle className="w-3.5 h-3.5 text-red-400" /> :
                     <Clock className="w-3.5 h-3.5 text-slate-500" />}
                    <span className={`text-xs flex-1 ${a.status === 'success' ? 'text-slate-300' : a.status === 'running' ? 'text-blue-300' : 'text-slate-500'}`}>
                      {a.name}
                    </span>
                    {a.duration && <span className="text-[10px] text-slate-500 font-mono">{a.duration}</span>}
                  </div>
                ))}
              </div>
            </div>

            {selected.status === 'awaiting_approval' && (
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md">
                  批准执行
                </button>
                <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
                  驳回
                </button>
              </div>
            )}
            {selected.status === 'paused' && (
              <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1">
                <PlayCircle className="w-3.5 h-3.5" />继续执行
              </button>
            )}
            {selected.status === 'running' && (
              <button className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md flex items-center justify-center gap-1">
                <PauseCircle className="w-3.5 h-3.5" />暂停任务
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon, pulse }: { label: string; value: any; color: string; icon: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }} className={pulse ? 'animate-pulse' : ''}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default DisposalStatusMonitor;

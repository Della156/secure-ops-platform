'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Download, RefreshCw, Play, Pause, Square, RotateCcw,
  Activity, Clock, CheckCircle2, XCircle, AlertCircle, Loader2,
  Cpu, Layers, BarChart3, Zap, FileText, Eye,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { DetailDrawer } from '@/components/Common/ListPage';
import type { LucideIcon } from 'lucide-react';

/**
 * 4.6-9 漏洞管理任务状态监控
 *
 * 5 任务类型（扫描/整改/复测/评估/同步）× 6 状态（排队/运行/暂停/完成/失败/取消）
 * - 实时进度（setInterval 模拟）
 * - 任务控制（暂停/继续/停止/重试，状态真实切换）
 * - 详情抽屉（阶段时间轴 + 失败归因 + 实时日志）
 */

type TaskType = 'scan' | 'rectify' | 'retest' | 'assess' | 'sync';
type TaskStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

interface Task {
  id: string;
  type: TaskType;
  name: string;
  target: string;
  status: TaskStatus;
  progress: number;
  startTime: string;
  duration: string;
  throughput: number;
  totalItems: number;
  processedItems: number;
  errors: number;
  warnings: number;
  executor: string;
  cpu: number;
  memory: number;
  failureReason?: string;
  logs: string[];
}

const INITIAL_TASKS: Task[] = [
  { id: 'T-9001', type: 'scan', name: '核心域主机漏洞扫描', target: '10.1.0.0/16 (87 个 IP)', status: 'running', progress: 67, startTime: '2026-06-02 14:00', duration: '52 分钟', throughput: 23, totalItems: 87, processedItems: 58, errors: 0, warnings: 2, executor: 'Nessus-01', cpu: 78, memory: 65, logs: ['[14:00:00] 任务启动', '[14:05:23] 连接 Nessus-01 成功', '[14:10:45] 开始扫描 10.1.0.0/16', '[14:42:11] 已处理 58/87 个 IP'] },
  { id: 'T-9002', type: 'rectify', name: '批量补丁部署', target: '20 台服务器', status: 'running', progress: 45, startTime: '2026-06-02 13:30', duration: '1h 22m', throughput: 1.5, totalItems: 20, processedItems: 9, errors: 1, warnings: 3, executor: 'Ansible', cpu: 45, memory: 38, logs: ['[13:30:00] 任务启动', '[13:32:10] 连接 Ansible 控制节点', '[13:35:20] 开始推送补丁包'] },
  { id: 'T-9003', type: 'retest', name: '批量复测扫描', target: '15 个漏洞', status: 'running', progress: 33, startTime: '2026-06-02 14:20', duration: '12 分钟', throughput: 0.8, totalItems: 15, processedItems: 5, errors: 0, warnings: 0, executor: 'Nessus-02', cpu: 56, memory: 42, logs: ['[14:20:00] 复测任务启动', '[14:25:00] 已复测 5 个漏洞'] },
  { id: 'T-9004', type: 'assess', name: 'WebLogic 风险评估', target: 'CVE-2023-21839', status: 'running', progress: 12, startTime: '2026-06-02 14:50', duration: '2 分钟', throughput: 0, totalItems: 1, processedItems: 0, errors: 0, warnings: 0, executor: 'Risk-Engine', cpu: 23, memory: 18, logs: ['[14:50:00] 风险评估启动', '[14:51:30] 加载 CVE 库'] },
  { id: 'T-9005', type: 'sync', name: 'NVD 漏洞库同步', target: '全量', status: 'queued', progress: 0, startTime: '待执行 16:00', duration: '-', throughput: 0, totalItems: 234567, processedItems: 0, errors: 0, warnings: 0, executor: 'NVD-API', cpu: 0, memory: 0, logs: [] },
  { id: 'T-9006', type: 'rectify', name: 'WordPress 插件升级', target: 'WEB-CMS-01', status: 'paused', progress: 60, startTime: '2026-06-02 12:00', duration: '已暂停 1h 5m', throughput: 0, totalItems: 1, processedItems: 0, errors: 0, warnings: 1, executor: '手动', cpu: 0, memory: 0, logs: ['[12:00:00] 升级任务启动', '[12:15:00] 备份完成', '[12:30:00] 用户手动暂停'] },
  { id: 'T-9007', type: 'scan', name: '数据库弱口令专项', target: '10.1.30.0/24', status: 'failed', progress: 32, startTime: '2026-06-02 11:00', duration: '失败于 18 分钟', throughput: 0, totalItems: 24, processedItems: 8, errors: 1, warnings: 0, executor: 'SQLmap', cpu: 0, memory: 0, failureReason: '扫描器响应超时（>30s）：目标 10.1.30.12 防火墙阻断', logs: ['[11:00:00] 任务启动', '[11:18:23] 扫描 10.1.30.12 超时'] },
  { id: 'T-9008', type: 'retest', name: 'CVE-2024-3094 复测', target: '23 台主机', status: 'completed', progress: 100, startTime: '2026-06-02 10:00', duration: '15 分钟', throughput: 1.5, totalItems: 23, processedItems: 23, errors: 0, warnings: 0, executor: 'Nessus-01', cpu: 0, memory: 0, logs: ['[10:00:00] 复测启动', '[10:15:00] 复测完成：23/23 通过'] },
];

const typeConfig: Record<TaskType, { label: string; color: string; icon: LucideIcon }> = {
  scan: { label: '扫描', color: 'text-blue-400 bg-blue-500/10', icon: Zap },
  rectify: { label: '整改', color: 'text-green-400 bg-green-500/10', icon: Activity },
  retest: { label: '复测', color: 'text-purple-400 bg-purple-500/10', icon: CheckCircle2 },
  assess: { label: '评估', color: 'text-orange-400 bg-orange-500/10', icon: BarChart3 },
  sync: { label: '同步', color: 'text-cyan-400 bg-cyan-500/10', icon: RefreshCw },
};

const statusBadgeMap: Record<TaskStatus, { status: any; text: string }> = {
  queued: { status: 'pending', text: '排队' },
  running: { status: 'running', text: '运行中' },
  paused: { status: 'warning', text: '已暂停' },
  completed: { status: 'success', text: '已完成' },
  failed: { status: 'failed', text: '失败' },
  cancelled: { status: 'info', text: '已取消' },
};

const statusTabs: { key: TaskStatus | 'all'; label: string; count?: (t: Task[]) => number }[] = [
  { key: 'all', label: '全部' },
  { key: 'running', label: '运行中' },
  { key: 'paused', label: '已暂停' },
  { key: 'queued', label: '排队中' },
  { key: 'failed', label: '失败' },
  { key: 'completed', label: '已完成' },
];

export function VulnTaskMonitor() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 实时模拟：每 3 秒推进 running 任务进度
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) => prev.map((t) => {
        if (t.status !== 'running') return t;
        const newProgress = Math.min(100, t.progress + 1);
        const newProcessed = Math.floor((newProgress / 100) * t.totalItems);
        if (newProgress >= 100) {
          return { ...t, status: 'completed' as TaskStatus, progress: 100, processedItems: t.totalItems, duration: t.duration + ' (已完成)' };
        }
        return { ...t, progress: newProgress, processedItems: newProcessed };
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 任务控制
  const handlePause = (id: string) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: 'paused' as TaskStatus, throughput: 0 } : t));
  const handleResume = (id: string) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: 'running' as TaskStatus } : t));
  const handleStop = (id: string) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: 'cancelled' as TaskStatus, throughput: 0, cpu: 0, memory: 0 } : t));
  const handleRetry = (id: string) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: 'running' as TaskStatus, progress: 0, processedItems: 0, errors: 0, failureReason: undefined } : t));

  // 过滤
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (activeTab !== 'all' && t.status !== activeTab) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (search && !t.name.includes(search) && !t.id.includes(search)) return false;
      return true;
    });
  }, [tasks, activeTab, typeFilter, search]);

  // KPI
  const total = tasks.length;
  const running = tasks.filter((t) => t.status === 'running').length;
  const queued = tasks.filter((t) => t.status === 'queued').length;
  const failed = tasks.filter((t) => t.status === 'failed').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  // 按类型统计（运行中）
  const typeStats = useMemo(() => {
    const m: Record<string, number> = { scan: 0, rectify: 0, retest: 0, assess: 0, sync: 0 };
    tasks.filter((t) => t.status === 'running').forEach((t) => { m[t.type]++; });
    return m;
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            漏洞管理任务状态监控
          </h1>
          <p className="text-slate-400 mt-1 text-sm">实时监控所有漏洞相关任务的执行状态，{running} 个运行中 · {queued} 个排队中</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1" />刷新
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5 mr-1" />导出
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="总任务" value={total} color="text-slate-50" icon={Layers} />
        <KPI label="运行中" value={running} color="text-blue-400" icon={Activity} sub="实时执行" />
        <KPI label="排队中" value={queued} color="text-gray-400" icon={Clock} />
        <KPI label="已失败" value={failed} color="text-red-400" icon={XCircle} sub="需处理" />
        <KPI label="已完成" value={completed} color="text-green-400" icon={CheckCircle2} />
      </div>

      {/* 类型分布 */}
      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3">运行中任务类型分布</h3>
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(typeConfig) as TaskType[]).map((t) => {
            const cfg = typeConfig[t as keyof typeof typeConfig];
            const Icon = cfg.icon;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? 'all' : t)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  typeFilter === t ? 'bg-[#0066FF]/20 border border-[#0066FF]/50' : 'bg-[#111625] border border-transparent hover:border-[#2A354D]'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-7 h-7 rounded ${cfg.color} mb-1`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className={`text-2xl font-bold ${cfg.color.split(' ')[0]}`}>{typeStats[t]}</div>
                <div className="text-xs text-slate-500">{cfg.label}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 状态 Tab */}
      <div className="border-b border-[#2A354D] flex items-center gap-1 overflow-x-auto">
        {statusTabs.map((t) => {
          const count = t.key === 'all' ? tasks.length : tasks.filter((x) => x.status === t.key).length;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive ? 'border-[#0066FF] text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-[#111625] text-slate-400">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 搜索 + 筛选 */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="搜索任务名 / ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex border border-[#2A354D] rounded overflow-hidden">
            {[
              { v: 'all', l: '全部类型' },
              ...(Object.keys(typeConfig) as TaskType[]).map((t) => ({ v: t, l: typeConfig[t as keyof typeof typeConfig].label })),
            ].map((f) => (
              <button
                key={f.v}
                onClick={() => setTypeFilter(f.v)}
                className={`px-3 py-1.5 text-xs ${typeFilter === f.v ? 'bg-[#0066FF] text-white' : 'bg-[#111625] text-slate-400 hover:bg-[#1A2236]'}`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 任务列表 */}
      <div className="space-y-3">
        {filtered.map((t) => {
          const tc = typeConfig[t.type as keyof typeof typeConfig];
          const TypeIcon = tc.icon;
          const sb = statusBadgeMap[t.status];
          return (
            <Card key={t.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tc.color}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{t.id}</span>
                      <span className="text-sm font-semibold text-slate-100">{t.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${tc.color}`}>{tc.label}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      目标: <span className="text-slate-200 font-mono text-[11px]">{t.target}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={sb.status} />
              </div>

              {t.status === 'running' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>进度 {t.processedItems}/{t.totalItems}</span>
                    <span>{t.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
              )}

              {t.failureReason && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-red-300">失败原因</p>
                      <p className="text-xs text-slate-300 mt-0.5">{t.failureReason}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs mb-3">
                <Field label="开始" value={t.startTime} />
                <Field label="耗时" value={t.duration} />
                <Field label="速率" value={t.throughput > 0 ? `${t.throughput} 个/分` : '-'} />
                <Field label="CPU / 内存" value={`${t.cpu}% / ${t.memory}%`} />
                <Field label="执行器" value={t.executor} />
                <Field
                  label="错误 / 警告"
                  value={
                    <>
                      <span className={t.errors > 0 ? 'text-red-400' : 'text-slate-500'}>{t.errors}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className={t.warnings > 0 ? 'text-yellow-400' : 'text-slate-500'}>{t.warnings}</span>
                    </>
                  }
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#2A354D]">
                {t.status === 'running' && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handlePause(t.id)}>
                      <Pause className="w-3.5 h-3.5 mr-1" />暂停
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleStop(t.id)}>
                      <Square className="w-3.5 h-3.5 mr-1" />停止
                    </Button>
                  </>
                )}
                {t.status === 'paused' && (
                  <Button variant="ghost" size="sm" onClick={() => handleResume(t.id)}>
                    <Play className="w-3.5 h-3.5 mr-1" />继续
                  </Button>
                )}
                {t.status === 'failed' && (
                  <Button variant="ghost" size="sm" onClick={() => handleRetry(t.id)}>
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />重试
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <FileText className="w-3.5 h-3.5 mr-1" />查看日志
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTask(t)}>
                  <Eye className="w-3.5 h-3.5 mr-1" />详情
                </Button>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card>
            <p className="text-center text-slate-500 py-8">无任务</p>
          </Card>
        )}
      </div>

      {/* 详情抽屉 */}
      <DetailDrawer
        open={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        title={selectedTask ? `${selectedTask.id} 任务详情` : ''}
        width="max-w-2xl"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100">{selectedTask.name}</h3>
              <p className="text-xs text-slate-500 mt-1">目标: {selectedTask.target} · 执行器: {selectedTask.executor}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="任务类型" value={typeConfig[selectedTask.type as keyof typeof typeConfig].label} />
              <Field label="状态" value={statusBadgeMap[selectedTask.status].text} />
              <Field label="开始时间" value={selectedTask.startTime} />
              <Field label="耗时" value={selectedTask.duration} />
              <Field label="处理进度" value={`${selectedTask.processedItems} / ${selectedTask.totalItems} (${selectedTask.progress}%)`} />
              <Field label="处理速率" value={selectedTask.throughput > 0 ? `${selectedTask.throughput} 个/分` : '-'} />
            </div>

            {selectedTask.failureReason && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm font-medium text-red-300 mb-1">失败归因</p>
                <p className="text-xs text-slate-300">{selectedTask.failureReason}</p>
                <p className="text-xs text-yellow-300 mt-2">💡 建议：检查目标防火墙规则后重试</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-slate-200 mb-2">实时日志</h4>
              <div className="rounded-lg bg-[#0A0E1A] border border-[#2A354D] p-3 max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed">
                {selectedTask.logs.length > 0 ? (
                  selectedTask.logs.map((log, idx) => (
                    <div key={idx} className="text-slate-300">
                      <span className="text-slate-600">[{idx + 1}]</span> {log}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-center py-4">暂无日志</div>
                )}
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub }: { label: string; value: number; color: string; icon: LucideIcon; sub?: string }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-2.5 bg-[#111625] rounded-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5 break-all">{value}</p>
    </div>
  );
}

export default VulnTaskMonitor;

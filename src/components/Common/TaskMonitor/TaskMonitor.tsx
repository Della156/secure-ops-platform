'use client';

import React, { useState } from 'react';
import { Search, Activity, CheckCircle2, XCircle, RotateCcw, Clock, BarChart3, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PhaseTimeline } from './PhaseTimeline';
import { SLAIndicator } from './SLAIndicator';
import { FailureAnalysis } from './FailureAnalysis';
import { LiveLogStream } from './LiveLogStream';
import type { TaskItem, TaskStatus } from './types';

interface TaskMonitorProps {
  title: string;
  subtitle: string;
  tasks: TaskItem[];
  onTaskAction?: (action: string, taskId: string) => void;
}

const STATUS_TABS: { key: TaskStatus | 'all'; label: string; icon: any }[] = [
  { key: 'all', label: '全部', icon: BarChart3 },
  { key: 'processing', label: '进行中', icon: Activity },
  { key: 'pending', label: '排队', icon: Clock },
  { key: 'failed', label: '失败', icon: XCircle },
  { key: 'completed', label: '已完成', icon: CheckCircle2 },
  { key: 'rolledback', label: '已回滚', icon: RotateCcw },
];

const statusBadgeMap: Record<TaskStatus, { status: any; text: string }> = {
  pending: { status: 'pending', text: '待处理' },
  processing: { status: 'running', text: '处理中' },
  failed: { status: 'failed', text: '失败' },
  completed: { status: 'success', text: '已完成' },
  rolledback: { status: 'warning', text: '已回滚' },
  paused: { status: 'info', text: '已暂停' },
};

const priorityBadgeMap: Record<string, { status: any; text: string }> = {
  urgent: { status: 'failed', text: '紧急' },
  high: { status: 'warning', text: '高' },
  medium: { status: 'info', text: '中' },
  low: { status: 'info', text: '低' },
};

/**
 * TaskMonitor 任务监控主组件
 *
 * 5 状态 Tab + KPI + 任务列表 + 详情面板（阶段时间轴 + 失败归因 + 实时日志）
 */
export function TaskMonitor({ title, subtitle, tasks, onTaskAction }: TaskMonitorProps) {
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // KPI 统计
  const stats = {
    total: tasks.length,
    processing: tasks.filter((t) => t.status === 'processing').length,
    failed: tasks.filter((t) => t.status === 'failed').length,
    slaBreached: tasks.filter((t) => t.slaStatus === 'breached').length,
  };
  const slaRate = stats.total > 0
    ? ((stats.total - stats.slaBreached) / stats.total * 100).toFixed(1)
    : '100.0';

  // 过滤
  const filtered = tasks.filter((t) => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
        <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="总任务" value={stats.total} color="text-blue-400" />
        <KPI label="进行中" value={stats.processing} color="text-yellow-400" />
        <KPI label="失败" value={stats.failed} color="text-red-400" />
        <KPI label="SLA 达成率" value={`${slaRate}%`} color="text-green-400" />
      </div>

      {/* 状态 Tab */}
      <div className="border-b border-[#2A354D] flex items-center gap-1 overflow-x-auto">
        {STATUS_TABS.map((t) => {
          const Icon = t.icon;
          const count = t.key === 'all' ? stats.total : tasks.filter((x) => x.status === t.key).length;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-[#0066FF] text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#111625] text-slate-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 搜索 */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="搜索任务 ID 或标题..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="primary" size="sm">
            <FileText className="w-4 h-4 mr-1" />新建任务
          </Button>
        </div>
      </Card>

      {/* 任务列表 */}
      <div className="space-y-2">
        {filtered.map((task) => {
          const sb = statusBadgeMap[task.status];
          const pb = priorityBadgeMap[task.priority];
          return (
            <Card
              key={task.id}
              hover
              onClick={() => setSelectedTask(task)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-blue-400">{task.id}</span>
                    <span className="text-sm font-medium text-slate-100 truncate">{task.title}</span>
                    <StatusBadge status={pb.status} />
                    <StatusBadge status={sb.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {task.target && <span>目标: {task.target}</span>}
                    <span>处理人: {task.assignee}</span>
                    <span>耗时: {task.duration}m</span>
                  </div>
                </div>
                <SLAIndicator
                  status={task.slaStatus}
                  remainingMinutes={Math.max(0, 240 - task.duration)}
                  totalMinutes={240}
                />
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

      {/* 详情面板 */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full max-w-2xl h-full bg-[#111625] border-l border-[#2A354D] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-slate-50">{selectedTask.id} 任务详情</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>✕</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h4 className="text-base font-semibold text-slate-100">{selectedTask.title}</h4>
                <p className="text-xs text-slate-500 mt-1">目标: {selectedTask.target} · 处理人: {selectedTask.assignee}</p>
              </div>

              <Card>
                <h5 className="text-xs font-medium text-slate-400 mb-3">阶段进度</h5>
                <PhaseTimeline
                  currentPhase={selectedTask.phase}
                  failed={selectedTask.status === 'failed'}
                />
              </Card>

              {selectedTask.failureReason && (
                <FailureAnalysis
                  reason={selectedTask.failureReason}
                  suggestion="建议检查网络连通性后重试，或联系系统管理员介入"
                  onRetry={() => onTaskAction?.('retry', selectedTask.id)}
                />
              )}

              <Card>
                <h5 className="text-xs font-medium text-slate-400 mb-2">SLA 监控</h5>
                <SLAIndicator
                  status={selectedTask.slaStatus}
                  remainingMinutes={Math.max(0, 240 - selectedTask.duration)}
                  totalMinutes={240}
                />
              </Card>

              <LiveLogStream
                logs={[
                  `[${selectedTask.startTime}] 任务开始执行`,
                  `[${selectedTask.startTime}] 连接目标设备 ${selectedTask.target}...`,
                  `[${selectedTask.startTime}] 设备连接成功`,
                  `[${selectedTask.startTime}] 备份当前配置...`,
                  `[${selectedTask.startTime}] 正在下发新策略...`,
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <Card>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </Card>
  );
}

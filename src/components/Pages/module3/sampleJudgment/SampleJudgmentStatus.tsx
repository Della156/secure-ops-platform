'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Activity, RefreshCw, Download, Filter, BarChart3, Brain, GitBranch, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TaskMonitor, type TaskItem } from '@/components/Common/TaskMonitor';

/**
 * 3-6-5 深度样本研判任务状态监控
 *
 * 5 阶段：样本提交 → 预分析 → 工具调用 → 深度研判 → 结论入库
 * - TaskMonitor 共享组件复用
 * - 8 个研判任务（T-JDG-001 ~ T-JDG-008）
 * - 真实失败归因 + 实时日志
 */

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'T-JDG-001',
    title: 'APT-29 钓鱼样本深度研判',
    target: 'SHA256: a3f5c8e9...',
    status: 'processing',
    phase: 'verifying',
    progress: 75,
    priority: 'urgent',
    slaStatus: 'warning',
    assignee: '分析员-张工',
    startTime: '2026-06-04 09:15:23',
    duration: 47,
  },
  {
    id: 'T-JDG-002',
    title: '勒索软件 LockBit v4 家族研判',
    target: 'SHA256: b7d9e2f1...',
    status: 'processing',
    phase: 'dispatching',
    progress: 50,
    priority: 'urgent',
    slaStatus: 'normal',
    assignee: '分析员-李工',
    startTime: '2026-06-04 09:30:00',
    duration: 32,
  },
  {
    id: 'T-JDG-003',
    title: '银行木马 Emotet 变种研判',
    target: 'SHA256: c1a3d8e5...',
    status: 'failed',
    phase: 'done',
    progress: 60,
    priority: 'high',
    slaStatus: 'breached',
    assignee: '分析员-王工',
    startTime: '2026-06-04 08:45:11',
    duration: 35,
    failureReason: '动态沙箱 Cuckoo 在调用 WinHttpSendRequest 时崩溃，错误码 0xC0000005（访问违例）。样本触发反调试 API，3 次连续绕过检测后沙箱主动放弃。',
  },
  {
    id: 'T-JDG-004',
    title: '银狐木马家族聚类分析',
    target: 'SHA256: d4e8b2c1...',
    status: 'completed',
    phase: 'done',
    progress: 100,
    priority: 'high',
    slaStatus: 'normal',
    assignee: '分析员-张工',
    startTime: '2026-06-04 08:00:00',
    duration: 52,
  },
  {
    id: 'T-JDG-005',
    title: '挖矿木马 XMRig 研判',
    target: 'SHA256: e9b3a7d4...',
    status: 'processing',
    phase: 'reviewing',
    progress: 25,
    priority: 'medium',
    slaStatus: 'normal',
    assignee: '分析员-赵工',
    startTime: '2026-06-04 09:45:00',
    duration: 15,
  },
  {
    id: 'T-JDG-006',
    title: 'WebShell 后门研判（PHP）',
    target: 'SHA256: f1c5b9e3...',
    status: 'pending',
    phase: 'submitted',
    progress: 0,
    priority: 'high',
    slaStatus: 'normal',
    assignee: '待分配',
    startTime: '-',
    duration: 0,
  },
  {
    id: 'T-JDG-007',
    title: 'Mirai 僵尸网络样本研判',
    target: 'SHA256: a2b6c3d8...',
    status: 'completed',
    phase: 'done',
    progress: 100,
    priority: 'medium',
    slaStatus: 'normal',
    assignee: '分析员-李工',
    startTime: '2026-06-04 07:30:00',
    duration: 28,
  },
  {
    id: 'T-JDG-008',
    title: '供应链攻击可疑文件研判',
    target: 'SHA256: b3c7d4a1...',
    status: 'processing',
    phase: 'dispatching',
    progress: 40,
    priority: 'urgent',
    slaStatus: 'warning',
    assignee: '分析员-王工',
    startTime: '2026-06-04 09:20:00',
    duration: 40,
  },
];

export function SampleJudgmentStatus() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  // 实时模拟 processing 任务进度
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) => prev.map((t) => {
        if (t.status !== 'processing') return t;
        const newProgress = Math.min(100, t.progress + 2);
        let newPhase = t.phase;
        if (newProgress >= 100) newPhase = 'done';
        else if (newProgress >= 75) newPhase = 'verifying';
        else if (newProgress >= 50) newPhase = 'dispatching';
        else if (newProgress >= 25) newPhase = 'reviewing';
        return { ...t, progress: newProgress, phase: newPhase, duration: t.duration + 0.5 };
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            深度样本研判任务状态监控
          </h1>
          <p className="text-slate-400 mt-1 text-sm">实时监控 5 阶段研判流程，处理中 {tasks.filter(t => t.status === 'processing').length} 个 · 失败 {tasks.filter(t => t.status === 'failed').length} 个</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><RefreshCw className="w-4 h-4 mr-1" />刷新</Button>
          <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出</Button>
        </div>
      </div>

      <TaskMonitor
        title="研判任务监控"
        subtitle="8 个研判任务 · 5 阶段流程"
        tasks={tasks}
        onTaskAction={(action, taskId) => console.log(action, taskId)}
      />
    </div>
  );
}

export default SampleJudgmentStatus;

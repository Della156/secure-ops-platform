'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'TR-20260604001', title: '溯源分析 - LockBit 攻击事件', target: '溯源 ID: TRC-2026-0604-001', status: 'processing', phase: 'verifying', progress: 68, priority: 'urgent', slaStatus: 'normal', assignee: '安全-王工', startTime: '10:30:00', duration: 50 },
  { id: 'TR-20260604002', title: '溯源分析 - APT 横向渗透', target: '溯源 ID: TRC-2026-0604-002', status: 'processing', phase: 'reviewing', progress: 55, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '10:00:00', duration: 45 },
  { id: 'TR-20260603003', title: '溯源分析 - 数据外泄事件', target: '溯源 ID: TRC-2026-0603-003', status: 'completed', phase: 'done', progress: 100, priority: 'urgent', slaStatus: 'normal', assignee: '安全-陈工', startTime: '2026-06-03 14:00:00', duration: 38 },
  { id: 'TR-20260602004', title: '溯源分析 - 挖矿木马感染', target: '溯源 ID: TRC-2026-0602-004', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-06-02 18:00:00', duration: 22 },
  { id: 'TR-20260601005', title: '溯源分析 - WebShell 入侵', target: '溯源 ID: TRC-2026-0601-005', status: 'failed', phase: 'reviewing', progress: 32, priority: 'high', slaStatus: 'breached', assignee: '安全-张工', startTime: '2026-06-01 14:00:00', duration: 28, failureReason: '取证数据缺失，关键主机日志未采集。已自动尝试补充采集并重试。' },
  { id: 'TR-20260531006', title: '溯源分析 - 钓鱼邮件攻击', target: '溯源 ID: TRC-2026-0531-006', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-31 10:00:00', duration: 18 },
  { id: 'TR-20260530007', title: '溯源分析 - 供应链攻击', target: '溯源 ID: TRC-2026-0530-007', status: 'completed', phase: 'done', progress: 100, priority: 'urgent', slaStatus: 'normal', assignee: '安全-王工', startTime: '2026-05-30 16:00:00', duration: 30 },
  { id: 'TR-20260529008', title: '溯源分析 - 勒索事件回溯', target: '溯源 ID: TRC-2026-0529-008', status: 'completed', phase: 'done', progress: 100, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-29 22:00:00', duration: 25 },
];

/**
 * 3-16-5 溯源报告 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function TraceReportStatus() {
  return (
    <TaskMonitor
      title="溯源报告任务状态监控"
      subtitle="APT 溯源 · 攻击链回溯 · 取证整合 · 报告自动生成 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default TraceReportStatus;

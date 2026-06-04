'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'DR-20260604001', title: '告警日报_20260604 生成', target: '昨日告警 325 条', status: 'processing', phase: 'verifying', progress: 78, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 32 },
  { id: 'DR-20260604002', title: '告警日报推送 邮件/钉钉', target: '邮件 28 收件人 / 钉钉 15 群', status: 'processing', phase: 'reviewing', progress: 65, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 25 },
  { id: 'DR-20260603003', title: '告警日报_20260603', target: '昨日告警 412 条', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-06-03 08:00:00', duration: 18 },
  { id: 'DR-20260602004', title: '告警日报_20260602', target: '昨日告警 358 条', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-06-02 08:00:00', duration: 22 },
  { id: 'DR-20260601005', title: '告警日报_20260601', target: '昨日告警 295 条', status: 'failed', phase: 'reviewing', progress: 32, priority: 'urgent', slaStatus: 'breached', assignee: '系统自动', startTime: '2026-06-01 08:00:00', duration: 28, failureReason: 'EDR 告警数据源同步超时 5 分钟，部分数据未生成。已自动重试 2 次。' },
  { id: 'DR-20260531006', title: '告警日报_20260531', target: '昨日告警 286 条', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-31 08:00:00', duration: 18 },
  { id: 'DR-20260530007', title: '告警日报_20260530', target: '昨日告警 318 条', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-30 08:00:00', duration: 20 },
  { id: 'DR-20260529008', title: '告警日报_20260529', target: '昨日告警 302 条', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-29 08:00:00', duration: 19 },
];

/**
 * 3-14-5 告警日报 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function DailyReportStatus() {
  return (
    <TaskMonitor
      title="告警日报任务状态监控"
      subtitle="告警日报自动生成 · 智能推送 · 邮件/钉钉/企微/Web/短信 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default DailyReportStatus;

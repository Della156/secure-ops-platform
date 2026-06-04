'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'VD-20260604001', title: '病毒处置 - 勒索软件 LockBit', target: 'HOST-FIN-007 / LockBit v4', status: 'processing', phase: 'verifying', progress: 68, priority: 'urgent', slaStatus: 'normal', assignee: '安全-张工', startTime: '10:30:00', duration: 35 },
  { id: 'VD-20260604002', title: '病毒处置 - 挖矿木马', target: 'HOST-DEV-022 / XMRig', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 18 },
  { id: 'VD-20260604003', title: '病毒处置 - APT 后门', target: 'HOST-DB-007 / Cobalt Strike', status: 'failed', phase: 'reviewing', progress: 42, priority: 'urgent', slaStatus: 'breached', assignee: '安全-陈工', startTime: '09:15:00', duration: 28, failureReason: 'EDR Agent 在 HOST-DB-007 上失联，扫描中断。已自动重试 3 次均失败。需运维人员现场检查 EDR 状态。' },
  { id: 'VD-20260604004', title: '病毒处置 - 蠕虫', target: 'HOST-DEV-013 / Conficker', status: 'processing', phase: 'reviewing', progress: 78, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '10:30:00', duration: 22 },
  { id: 'VD-20260604005', title: '病毒处置 - 木马', target: 'HOST-FIN-002 / Emotet', status: 'processing', phase: 'dispatching', progress: 55, priority: 'medium', slaStatus: 'warning', assignee: '系统自动', startTime: '11:00:00', duration: 15 },
  { id: 'VD-20260604006', title: '病毒处置 - 远控', target: 'HOST-DEV-008 / AgentTesla', status: 'pending', phase: 'submitted', progress: 0, priority: 'high', slaStatus: 'normal', assignee: '安全-王工', startTime: '14:00:00', duration: 0 },
  { id: 'VD-20260603007', title: '病毒处置 - 间谍软件', target: 'HOST-DEV-005 / FormBook', status: 'completed', phase: 'done', progress: 100, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '22:00:00', duration: 12 },
  { id: 'VD-20260603008', title: '病毒处置 - 蠕虫变种', target: 'HOST-DEV-011 / WannaCry', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '20:00:00', duration: 18 },
];

/**
 * 3-10-5 病毒处置 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function VirusDisposalStatus() {
  return (
    <TaskMonitor
      title="病毒处置任务状态监控"
      subtitle="病毒实时检测 · 自动隔离 · 清除验证 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default VirusDisposalStatus;

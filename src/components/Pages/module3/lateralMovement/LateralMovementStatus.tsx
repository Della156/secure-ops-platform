'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'LM-20260604001', title: '横向渗透检测 - 核心网络域', target: 'DC01 / DC02 / 核心交换机', status: 'processing', phase: 'verifying', progress: 68, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '10:30:00', duration: 32 },
  { id: 'LM-20260604002', title: '横向渗透检测 - 办公网络', target: '办公网段 10.20.0.0/16', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 45 },
  { id: 'LM-20260604003', title: '横向渗透检测 - 数据中心', target: 'DC-PROD-01 / DC-PROD-02', status: 'failed', phase: 'reviewing', progress: 42, priority: 'urgent', slaStatus: 'breached', assignee: '系统自动', startTime: '09:15:00', duration: 28, failureReason: 'EDR Agent 在 HOST-DB-007 上失联，扫描中断。已自动重试 3 次均失败。需运维人员现场检查 EDR 状态。' },
  { id: 'LM-20260604004', title: '横向渗透检测 - 分支机构', target: 'BJ / SH / GZ 分支', status: 'completed', phase: 'done', progress: 100, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '07:00:00', duration: 38 },
  { id: 'LM-20260604005', title: '攻击路径复现 - APT-29', target: 'HOST-FIN-002 → DC01', status: 'processing', phase: 'dispatching', progress: 35, priority: 'urgent', slaStatus: 'normal', assignee: '安全-张工', startTime: '11:00:00', duration: 15 },
  { id: 'LM-20260604006', title: '凭据滥用检测', target: '全网 800 个域账号', status: 'processing', phase: 'reviewing', progress: 78, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '10:00:00', duration: 25 },
  { id: 'LM-20260604007', title: 'SMB 异常连接检测', target: '生产网段', status: 'pending', phase: 'submitted', progress: 0, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '14:00:00', duration: 0 },
  { id: 'LM-20260604008', title: 'Pass-the-Hash 检测', target: '域控 DC01', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '06:00:00', duration: 18 },
];

/**
 * 3-2-6 横向渗透监测 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function LateralMovementStatus() {
  return (
    <TaskMonitor
      title="横向渗透监测任务状态监控"
      subtitle="横向渗透检测任务实时监控 · 攻击路径复现 · 阶段进度 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default LateralMovementStatus;

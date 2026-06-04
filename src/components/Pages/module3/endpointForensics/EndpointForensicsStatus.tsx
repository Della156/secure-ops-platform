'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'EF-20260604001', title: '终端证据采集 - HOST-FIN-002', target: 'HOST-FIN-002 (Windows 11)', status: 'processing', phase: 'verifying', progress: 68, priority: 'urgent', slaStatus: 'normal', assignee: '取证-张工', startTime: '10:00:00', duration: 35 },
  { id: 'EF-20260604002', title: '终端证据采集 - HOST-DEV-022', target: 'HOST-DEV-022 (Ubuntu 22.04)', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '取证-李工', startTime: '08:00:00', duration: 42 },
  { id: 'EF-20260604003', title: '终端内存取证', target: 'HOST-APP-005 (内存 32GB)', status: 'failed', phase: 'reviewing', progress: 45, priority: 'urgent', slaStatus: 'breached', assignee: '取证-王工', startTime: '09:30:00', duration: 28, failureReason: 'WinPMEM 驱动签名校验失败，目标主机启用了 Secure Boot 严格模式。已切换到 LiME 内存采集工具。' },
  { id: 'EF-20260604004', title: '终端日志自动检索', target: 'HOST-WEB-008 (日志 50GB)', status: 'processing', phase: 'reviewing', progress: 78, priority: 'high', slaStatus: 'normal', assignee: '取证-陈工', startTime: '10:30:00', duration: 22 },
  { id: 'EF-20260604005', title: '终端进程取证', target: 'HOST-DB-007 (可疑进程分析)', status: 'processing', phase: 'dispatching', progress: 55, priority: 'urgent', slaStatus: 'warning', assignee: '取证-张工', startTime: '11:00:00', duration: 15 },
  { id: 'EF-20260604006', title: '终端网络连接取证', target: 'HOST-FIN-002 (网络会话分析)', status: 'pending', phase: 'submitted', progress: 0, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '14:00:00', duration: 0 },
  { id: 'EF-20260603007', title: '终端 USB 使用记录取证', target: 'HOST-DEV-022 (USB 历史)', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '20:00:00', duration: 12 },
  { id: 'EF-20260603008', title: '终端注册表取证', target: 'HOST-APP-005 (注册表 hive)', status: 'completed', phase: 'done', progress: 100, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '18:00:00', duration: 18 },
];

/**
 * 3-11-5 终端取证 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function EndpointForensicsStatus() {
  return (
    <TaskMonitor
      title="终端取证任务状态监控"
      subtitle="终端证据采集实时监控 · 内存/日志/进程/网络取证 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default EndpointForensicsStatus;

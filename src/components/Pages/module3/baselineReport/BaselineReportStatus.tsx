'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'BR-20260604001', title: '基线检查 - 核心服务器', target: 'SERVER-FIN-001/002/003 (8 台)', status: 'processing', phase: 'verifying', progress: 68, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 45 },
  { id: 'BR-20260604002', title: '基线检查 - 数据库', target: 'DB-ORA-001/002 (4 套)', status: 'processing', phase: 'reviewing', progress: 55, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 35 },
  { id: 'BR-20260603003', title: '基线检查 - 网络设备', target: '核心交换机 + 防火墙 12 台', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-06-03 08:00:00', duration: 28 },
  { id: 'BR-20260602004', title: '基线检查 - 中间件', target: 'WebLogic/Tomcat/Redis 18 套', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-06-02 08:00:00', duration: 22 },
  { id: 'BR-20260601005', title: '基线检查 - 终端', target: 'HOST-DEV-* 5,200 台', status: 'failed', phase: 'reviewing', progress: 32, priority: 'high', slaStatus: 'breached', assignee: '系统自动', startTime: '2026-06-01 08:00:00', duration: 28, failureReason: '部分终端 EDR Agent 失联，扫描中断。已自动重试 3 次均失败。需运维人员现场检查。' },
  { id: 'BR-20260531006', title: '基线检查 - 应用', target: 'CRM/ERP/OA 8 套', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-31 08:00:00', duration: 18 },
  { id: 'BR-20260530007', title: '基线检查 - 操作系统', target: 'Linux/Windows 共 850 台', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-30 08:00:00', duration: 20 },
  { id: 'BR-20260529008', title: '基线检查 - 容器', target: 'K8s 集群 3 个 (120 Pod)', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '2026-05-29 08:00:00', duration: 19 },
];

/**
 * 3-15-5 基线防护报告 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function BaselineReportStatus() {
  return (
    <TaskMonitor
      title="基线防护报告任务状态监控"
      subtitle="等保/CIS 基线 · 多资产类型自动扫描 · 报告生成 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default BaselineReportStatus;

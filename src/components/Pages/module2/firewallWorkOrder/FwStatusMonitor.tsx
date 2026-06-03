'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  {
    id: 'FW-WO-001', title: '新增 Web 服务访问策略', target: '防火墙 FW-EDGE-01',
    status: 'processing', phase: 'verifying', progress: 65, priority: 'urgent',
    slaStatus: 'normal', assignee: '张三', startTime: '09:00:00', duration: 45,
  },
  {
    id: 'FW-WO-002', title: '删除过期 VPN 策略', target: '防火墙 FW-DMZ-02',
    status: 'processing', phase: 'dispatching', progress: 30, priority: 'high',
    slaStatus: 'normal', assignee: '李四', startTime: '09:15:00', duration: 30,
  },
  {
    id: 'FW-WO-003', title: '修改内部访问端口范围', target: '防火墙 FW-INTERNAL-01',
    status: 'pending', phase: 'submitted', progress: 0, priority: 'medium',
    slaStatus: 'normal', assignee: '王五', startTime: '10:00:00', duration: 0,
  },
  {
    id: 'FW-WO-004', title: '数据库访问策略加固', target: '防火墙 FW-DB-01',
    status: 'failed', phase: 'dispatching', progress: 50, priority: 'urgent',
    slaStatus: 'breached', assignee: '赵六', startTime: '08:30:00', duration: 120,
    failureReason: '网络超时：无法连接到防火墙 FW-DB-01 (Connection timeout after 30s)',
  },
  {
    id: 'FW-WO-005', title: 'API 网关 IP 白名单更新', target: '防火墙 FW-API-01',
    status: 'completed', phase: 'done', progress: 100, priority: 'high',
    slaStatus: 'normal', assignee: '钱七', startTime: '08:00:00', duration: 25,
  },
  {
    id: 'FW-WO-006', title: '办公网访问策略调整', target: '防火墙 FW-OFFICE-01',
    status: 'completed', phase: 'done', progress: 100, priority: 'low',
    slaStatus: 'normal', assignee: '孙八', startTime: '07:30:00', duration: 15,
  },
  {
    id: 'FW-WO-007', title: '修复 SSH 端口开放', target: '防火墙 FW-MGMT-01',
    status: 'rolledback', phase: 'verifying', progress: 70, priority: 'high',
    slaStatus: 'warning', assignee: '周九', startTime: '06:00:00', duration: 180,
    failureReason: '策略冲突：与现有 22 端口策略重叠，已自动回滚',
  },
  {
    id: 'FW-WO-008', title: '高危端口批量关闭', target: '防火墙 FW-ALL',
    status: 'pending', phase: 'reviewing', progress: 0, priority: 'medium',
    slaStatus: 'normal', assignee: '吴十', startTime: '11:00:00', duration: 0,
  },
];

export function FwStatusMonitor() {
  return (
    <TaskMonitor
      title="防火墙策略工单任务状态监控"
      subtitle="工单处理状态的实时监控，阶段进度跟踪、失败归因、SLA 监控、批量操作"
      tasks={MOCK_TASKS}
    />
  );
}

export default FwStatusMonitor;

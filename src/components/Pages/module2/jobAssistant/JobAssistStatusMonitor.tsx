'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'JAS-20260604001', title: '数据库备份作业', target: '生产主库 MySQL 8.0', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '02:00:00', duration: 15 },
  { id: 'JAS-20260604002', title: '安全补丁安装', target: 'Web 服务器集群 (12 台)', status: 'processing', phase: 'dispatching', progress: 53, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '09:30:00', duration: 12 },
  { id: 'JAS-20260604003', title: '配置同步作业', target: '配置服务器集群', status: 'failed', phase: 'reviewing', progress: 35, priority: 'urgent', slaStatus: 'breached', assignee: '运维-张工', startTime: '10:00:00', duration: 8, failureReason: '节点 CS-03 网络握手超时，重试 3 次均失败。可能原因：防火墙 ACL 拦截 / 路由不可达 / 证书过期。已自动通知网络团队介入。' },
  { id: 'JAS-20260604004', title: '性能检测作业', target: '应用服务器集群', status: 'completed', phase: 'done', progress: 100, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '11:00:00', duration: 5 },
  { id: 'JAS-20260604005', title: '日志清理作业', target: '日志服务器', status: 'completed', phase: 'done', progress: 100, priority: 'low', slaStatus: 'normal', assignee: '系统自动', startTime: '01:00:00', duration: 8 },
  { id: 'JAS-20260604006', title: '数据归档作业', target: '历史数据库', status: 'completed', phase: 'done', progress: 100, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '03:00:00', duration: 45 },
  { id: 'JAS-20260604007', title: '主机基线检查', target: '生产环境 56 台主机', status: 'processing', phase: 'verifying', progress: 78, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '10:30:00', duration: 22 },
  { id: 'JAS-20260604008', title: '安全补丁回滚', target: 'HOST-WEB-008', status: 'failed', phase: 'reviewing', progress: 60, priority: 'urgent', slaStatus: 'breached', assignee: '运维-李工', startTime: '11:15:00', duration: 18, failureReason: '回滚失败：服务依赖冲突。补丁 KB5034441 涉及 wuauserv 服务版本不兼容，HOST-WEB-008 仍处于重启中。已自动回退到 03/15 快照。' },
  { id: 'JAS-20260604009', title: '数据库索引重建', target: '订单库 MySQL', status: 'pending', phase: 'submitted', progress: 0, priority: 'medium', slaStatus: 'normal', assignee: 'DBA-王工', startTime: '14:00:00', duration: 0 },
  { id: 'JAS-20260604010', title: '应急漏洞修复', target: 'CVE-2026-1234', status: 'processing', phase: 'dispatching', progress: 42, priority: 'urgent', slaStatus: 'warning', assignee: '安全-陈工', startTime: '10:45:00', duration: 28 },
];

/**
 * 2-34-4 作业综合辅助任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 * 5 阶段：提交 → 复核 → 派发 → 验证 → 完成
 * 6 状态：待处理 / 处理中 / 失败 / 已完成 / 已回滚
 */
export function JobAssistStatusMonitor() {
  return (
    <TaskMonitor
      title="作业综合辅助任务状态监控"
      subtitle="辅助作业执行全链路状态实时监控 · 阶段进度 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default JobAssistStatusMonitor;

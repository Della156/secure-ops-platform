'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'AB-20260604001', title: '用户行为基线建模 - 财务部', target: '财务部 45 人', status: 'processing', phase: 'verifying', progress: 62, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '10:00:00', duration: 35 },
  { id: 'AB-20260604002', title: '异常登录检测', target: '全网 800 个域账号', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 25 },
  { id: 'AB-20260604003', title: '数据外泄检测 - 研发部', target: '研发部 320 人', status: 'failed', phase: 'reviewing', progress: 38, priority: 'urgent', slaStatus: 'breached', assignee: '系统自动', startTime: '09:00:00', duration: 42, failureReason: 'DLP Agent 在 8 台开发机上未运行，无法采集数据外泄事件。已自动通知桌面运维组补装。' },
  { id: 'AB-20260604004', title: '工作时间外访问检测', target: '全网 800 人', status: 'processing', phase: 'reviewing', progress: 78, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '10:30:00', duration: 18 },
  { id: 'AB-20260604005', title: '特权账号异常使用检测', target: '域管/SA 等 28 个特权账号', status: 'processing', phase: 'dispatching', progress: 55, priority: 'urgent', slaStatus: 'warning', assignee: '系统自动', startTime: '11:00:00', duration: 12 },
  { id: 'AB-20260604006', title: '异常下载行为检测', target: '文件服务器', status: 'pending', phase: 'submitted', progress: 0, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '14:00:00', duration: 0 },
  { id: 'AB-20260603007', title: '批量文件删除告警', target: '文件服务器集群', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '22:00:00', duration: 8 },
  { id: 'AB-20260603008', title: '异常地理位置登录', target: '全网账号', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '20:00:00', duration: 15 },
];

/**
 * 3-3-5 异常行为监测 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function AnomalyBehaviorStatus() {
  return (
    <TaskMonitor
      title="异常行为监测任务状态监控"
      subtitle="用户行为基线 · 异常登录 · 数据外泄 · 特权账号监控 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default AnomalyBehaviorStatus;

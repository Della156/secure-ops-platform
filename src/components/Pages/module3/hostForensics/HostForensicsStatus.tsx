'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'HF-20260604001', title: '主机证据采集 - HOST-DB-007', target: 'HOST-DB-007 (Windows Server 2019)', status: 'processing', phase: 'verifying', progress: 72, priority: 'urgent', slaStatus: 'normal', assignee: '取证-李工', startTime: '10:00:00', duration: 38 },
  { id: 'HF-20260604002', title: '主机数据同步', target: 'HOST-DB-001 / DB-002', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 25 },
  { id: 'HF-20260604003', title: '主机日志自动检索', target: 'HOST-DB-007 (50GB 日志)', status: 'failed', phase: 'reviewing', progress: 45, priority: 'urgent', slaStatus: 'breached', assignee: '取证-陈工', startTime: '09:00:00', duration: 32, failureReason: '日志索引损坏，Elasticsearch 集群节点 ES-02 磁盘满。已通知运维扩容磁盘。' },
  { id: 'HF-20260604004', title: '主机可疑样本分析', target: 'HOST-DB-007 (3 个可疑文件)', status: 'processing', phase: 'reviewing', progress: 65, priority: 'high', slaStatus: 'normal', assignee: '取证-王工', startTime: '10:30:00', duration: 18 },
  { id: 'HF-20260604005', title: '主机配置基线比对', target: 'HOST-WEB-001 ~ 008', status: 'processing', phase: 'dispatching', progress: 48, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '11:00:00', duration: 12 },
  { id: 'HF-20260604006', title: '主机网络流量取证', target: 'HOST-FIN-002 (PCAP)', status: 'pending', phase: 'submitted', progress: 0, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '14:00:00', duration: 0 },
  { id: 'HF-20260603007', title: '主机启动项分析', target: 'HOST-APP-005 (Autoruns)', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '22:00:00', duration: 12 },
  { id: 'HF-20260603008', title: '主机账号审计', target: 'HOST-DB-007 (本地账号)', status: 'completed', phase: 'done', progress: 100, priority: 'medium', slaStatus: 'normal', assignee: '系统自动', startTime: '20:00:00', duration: 18 },
];

/**
 * 3-12-5 主机取证 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function HostForensicsStatus() {
  return (
    <TaskMonitor
      title="主机取证任务状态监控"
      subtitle="主机证据采集实时监控 · 日志/样本/配置取证 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default HostForensicsStatus;

'use client';

import React from 'react';
import { TaskMonitor } from '@/components/Common/TaskMonitor';
import type { TaskItem } from '@/components/Common/TaskMonitor/types';

const MOCK_TASKS: TaskItem[] = [
  { id: 'SA-20260604001', title: '样本深度分析 - APT-29 phishing', target: 'phishing_kit.zip (2.5MB)', status: 'processing', phase: 'verifying', progress: 68, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '10:00:00', duration: 32 },
  { id: 'SA-20260604002', title: '样本工具调用 - LockBit', target: 'lockbit_ransom.exe (12MB)', status: 'completed', phase: 'done', progress: 100, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '08:00:00', duration: 45 },
  { id: 'SA-20260604003', title: '样本分析结果汇总', target: 'JC-001 完整报告', status: 'failed', phase: 'reviewing', progress: 42, priority: 'high', slaStatus: 'breached', assignee: '安全-陈工', startTime: '09:30:00', duration: 28, failureReason: 'YARA 规则匹配异常，规则库同步失败。已自动重试并切换到备用规则集。' },
  { id: 'SA-20260604004', title: '样本多工具联动分析', target: 'emotet.dll (850KB)', status: 'processing', phase: 'reviewing', progress: 78, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '10:30:00', duration: 22 },
  { id: 'SA-20260604005', title: '可疑样本快速筛查', target: 'mirai.elf (1.2MB)', status: 'processing', phase: 'dispatching', progress: 55, priority: 'medium', slaStatus: 'warning', assignee: '系统自动', startTime: '11:00:00', duration: 15 },
  { id: 'SA-20260604006', title: '样本家族聚类', target: 'APT-29 家族样本 12 个', status: 'pending', phase: 'submitted', progress: 0, priority: 'high', slaStatus: 'normal', assignee: '安全-王工', startTime: '14:00:00', duration: 0 },
  { id: 'SA-20260603007', title: '样本 IOC 提取', target: 'CVE-2026-1234 样本', status: 'completed', phase: 'done', progress: 100, priority: 'urgent', slaStatus: 'normal', assignee: '系统自动', startTime: '22:00:00', duration: 12 },
  { id: 'SA-20260603008', title: '样本威胁评级', target: 'WebShell b374k', status: 'completed', phase: 'done', progress: 100, priority: 'high', slaStatus: 'normal', assignee: '系统自动', startTime: '20:00:00', duration: 18 },
];

/**
 * 3-13-5 样本分析 - 任务状态监控
 *
 * 100% 复用 TaskMonitor 共享组件
 */
export function SampleAnalysisStatus() {
  return (
    <TaskMonitor
      title="样本分析任务状态监控"
      subtitle="样本深度分析实时监控 · 工具调用 · 结果汇总 · 失败归因 · SLA 监控"
      tasks={MOCK_TASKS}
    />
  );
}

export default SampleAnalysisStatus;

/**
 * TaskMonitor 任务监控组件 - 类型定义
 *
 * 用于菜单 2-24-8 防火墙策略工单任务状态监控
 */

export type TaskStatus = 'pending' | 'processing' | 'failed' | 'completed' | 'rolledback';

export type TaskPhase = 'submitted' | 'reviewing' | 'dispatching' | 'verifying' | 'done';

export interface TaskItem {
  id: string;
  title: string;
  target?: string;
  status: TaskStatus;
  phase: TaskPhase;
  progress: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  slaStatus: 'normal' | 'warning' | 'breached';
  assignee: string;
  startTime: string;
  duration: number; // 分钟
  failureReason?: string;
}

export interface PhaseConfig {
  key: TaskPhase;
  label: string;
  description: string;
}

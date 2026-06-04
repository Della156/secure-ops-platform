/**
 * 事件总线类型定义
 * 跨页面业务流程闭环的事件源
 */

// ─── 通用事件载荷 ──────────────────────────────────────────────
export interface EventBase {
  /** 事件 ID（UUID） */
  id: string;
  /** 事件时间 */
  timestamp: string;
  /** 触发源（用户/系统/智能体） */
  source: 'user' | 'system' | 'agent';
  /** 关联业务 ID（如告警 ID、工单 ID） */
  bizId?: string;
}

// ─── 业务事件类型 ──────────────────────────────────────────────
// 告警生命周期
export interface AlertCreatedEvent extends EventBase {
  type: 'alert.created';
  payload: { alertId: string; level: 'critical' | 'high' | 'medium' | 'low'; title: string; source: string };
}
export interface AlertTriagedEvent extends EventBase {
  type: 'alert.triaged';
  payload: { alertId: string; conclusion: 'true_positive' | 'false_positive'; confidence: number };
}
export interface AlertHandledEvent extends EventBase {
  type: 'alert.handled';
  payload: { alertId: string; action: string; operator: string };
}

// 任务生命周期
export interface TaskStartedEvent extends EventBase {
  type: 'task.started';
  payload: { taskId: string; taskName: string; trigger: string };
}
export interface TaskCompletedEvent extends EventBase {
  type: 'task.completed';
  payload: { taskId: string; duration: number; result: 'success' | 'failed' };
}
export interface TaskFailedEvent extends EventBase {
  type: 'task.failed';
  payload: { taskId: string; reason: string; retryable: boolean };
}

// 漏洞生命周期
export interface VulnDetectedEvent extends EventBase {
  type: 'vuln.detected';
  payload: { vulnId: string; severity: string; cve: string; affectedAsset: string };
}
export interface VulnFixedEvent extends EventBase {
  type: 'vuln.fixed';
  payload: { vulnId: string; method: string; operator: string };
}

// 报告生命周期
export interface ReportGeneratedEvent extends EventBase {
  type: 'report.generated';
  payload: { reportId: string; type: string; findings: number };
}
export interface ReportPushedEvent extends EventBase {
  type: 'report.pushed';
  payload: { reportId: string; channels: string[]; recipients: number };
}

// 待办生命周期
export interface TodoCreatedEvent extends EventBase {
  type: 'todo.created';
  payload: { todoId: string; title: string; priority: 'critical' | 'high' | 'medium'; module: string; linkMenuId?: string };
}
export interface TodoCompletedEvent extends EventBase {
  type: 'todo.completed';
  payload: { todoId: string; result: string };
}

// 智能体协作
export interface AgentDispatchedEvent extends EventBase {
  type: 'agent.dispatched';
  payload: { agentId: string; taskId: string; module: string };
}
export interface AgentCompletedEvent extends EventBase {
  type: 'agent.completed';
  payload: { agentId: string; result: Record<string, any> };
}

// 联合类型
export type BusinessEvent =
  | AlertCreatedEvent
  | AlertTriagedEvent
  | AlertHandledEvent
  | TaskStartedEvent
  | TaskCompletedEvent
  | TaskFailedEvent
  | VulnDetectedEvent
  | VulnFixedEvent
  | ReportGeneratedEvent
  | ReportPushedEvent
  | TodoCreatedEvent
  | TodoCompletedEvent
  | AgentDispatchedEvent
  | AgentCompletedEvent;

export type EventType = BusinessEvent['type'];

/** 事件订阅者签名 */
export type EventHandler<T extends BusinessEvent = BusinessEvent> = (event: T) => void;

/** 事件总线状态 */
export interface EventBusState {
  /** 最近 100 条事件（按时间倒序） */
  history: BusinessEvent[];
  /** 订阅者映射 */
  listeners: Map<EventType, Set<EventHandler>>;
}

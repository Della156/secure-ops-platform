/**
 * FlowOrchestrator 共享组件类型定义
 *
 * 用于统一系统中所有"流程编排/场景编排/规则编排"页面的设计模式。
 *
 * 关键设计原则：
 * - 节点库/画布/配置面板三栏布局
 * - 节点支持拖拽 + SVG 连线（含条件分支）
 * - 节点状态徽章（pending/running/success/failed）
 * - 业务配置通过 renderNodeConfig prop 注入
 */

import type { ReactNode } from 'react';

/** 节点运行状态 */
export type NodeStatus = 'pending' | 'running' | 'success' | 'failed';

/** 边条件类型 */
export type EdgeCondition = 'success' | 'failure' | 'always';

/** 节点定义（通用） */
export interface FlowNode {
  id: string;
  type: string;
  label: string;
  description?: string;
  x: number;
  y: number;
  status?: NodeStatus;
  duration?: string;
  /** 业务自定义字段（任意 key-value） */
  [key: string]: any;
}

/** 边定义（连接两个节点） */
export interface FlowEdge {
  id?: string;
  from: string;
  to: string;
  label?: string;
  condition?: EdgeCondition;
}

/** 节点类型配置（节点库卡片 + 画布渲染） */
export interface NodeTypeConfig {
  type: string;
  label: string;
  color: string;
  icon: ReactNode;
  description?: string;
  defaultData?: Record<string, any>;
}

/** 场景定义（多场景切换，可选） */
export interface FlowScenario {
  id: string;
  name: string;
  description?: string;
  status?: string;
  updatedAt?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/** 节点状态 → 样式映射 */
export const statusToStyle: Record<NodeStatus, { bg: string; text: string; icon: string; label: string }> = {
  pending: { bg: 'bg-slate-700/50', text: 'text-slate-500', icon: '○', label: '待执行' },
  running: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '◐', label: '运行中' },
  success: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '●', label: '已完成' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: '✕', label: '失败' },
};

/** 边条件 → 颜色映射 */
export const conditionToColor: Record<EdgeCondition, string> = {
  success: '#22C55E',
  failure: '#EF4444',
  always: '#94A3B8',
};

/** 边条件 → 中文标签 */
export const conditionToLabel: Record<EdgeCondition, string> = {
  success: '成功',
  failure: '失败',
  always: '始终',
};

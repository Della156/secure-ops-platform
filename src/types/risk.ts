/**
 * 风险评分引擎 - 类型定义
 * 基于多维度数据动态计算系统风险评分
 */

export interface RiskDimension {
  /** 维度唯一标识 */
  key: string;
  /** 维度名称 */
  name: string;
  /** 当前分数 (0-100) */
  score: number;
  /** 权重 (0-1) */
  weight: number;
  /** 数据来源 */
  source: string;
  /** 最后更新时间 */
  updatedAt: string;
  /** 详情指标 */
  metrics: RiskMetric[];
}

export interface RiskMetric {
  /** 指标名称 */
  name: string;
  /** 指标当前值 */
  value: number | string;
  /** 指标阈值/参考值 */
  threshold?: number | string;
  /** 指标单位 */
  unit?: string;
  /** 趋势：上升/下降/稳定 */
  trend: 'up' | 'down' | 'stable';
  /** 对评分的影响 (-100 to 100) */
  impact: number;
}

export interface RiskScoreSnapshot {
  /** 总分 (0-100) */
  totalScore: number;
  /** 风险等级 */
  level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  /** 风险等级描述 */
  levelLabel: string;
  /** 计算时间 */
  calculatedAt: string;
  /** 触发原因 */
  trigger: 'manual' | 'scheduled' | 'event' | 'initial';
  /** 维度明细 */
  dimensions: RiskDimension[];
  /** 与上次对比 */
  delta?: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    mainChanges: string[];
  };
  /** 智能体贡献 */
  agentContributions: AgentContribution[];
}

export interface AgentContribution {
  agentId: string;
  agentName: string;
  /** 影响的维度 */
  dimension: string;
  /** 智能体上报的原始数据 */
  rawData: Record<string, any>;
  /** 对最终评分的影响值 */
  impact: number;
}

export interface RiskScoreHistory {
  snapshots: Array<{
    score: number;
    timestamp: string;
    trigger: string;
    level: string;
  }>;
}
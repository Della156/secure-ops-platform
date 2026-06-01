/**
 * 风险评分计算引擎
 *
 * 公式：总分 = Σ (维度分数 × 维度权重)
 * 总分越高 = 风险越高（0=完全安全，100=极高风险）
 */

import {
  RiskScoreSnapshot,
  RiskDimension,
  AgentContribution,
} from '@/types/risk';
import {
  getAssetRiskData,
  getAlertTrendData,
  getVulnerabilityData,
  getComplianceData,
  getCoverageData,
} from './riskDataSource';

export type RiskTrigger = 'manual' | 'scheduled' | 'event' | 'initial';

/**
 * 主计算函数
 */
export function calculateRiskScore(
  trigger: RiskTrigger = 'initial',
  previousScore?: number
): RiskScoreSnapshot {
  // 1. 收集所有维度的数据
  const dataSources = [
    getAssetRiskData(),
    getAlertTrendData(),
    getVulnerabilityData(),
    getComplianceData(),
    getCoverageData(),
  ];

  const dimensions: RiskDimension[] = dataSources.map((d) => d.dimension);
  const allContributions: AgentContribution[] = dataSources.flatMap(
    (d) => d.contributions
  );

  // 2. 加权计算总分
  // 总分 = Σ (维度分数 × 维度权重)
  const totalScore = Math.round(
    dimensions.reduce((sum, dim) => sum + dim.score * dim.weight, 0)
  );

  // 3. 确定风险等级
  const levelInfo = getRiskLevel(totalScore);

  // 4. 计算与上次的差异
  let delta: RiskScoreSnapshot['delta'];
  if (previousScore !== undefined && previousScore !== totalScore) {
    const scoreDiff = totalScore - previousScore;
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(scoreDiff) >= 2) {
      trend = scoreDiff > 0 ? 'up' : 'down';
    }

    // 找出主要变化维度
    const mainChanges: string[] = [];
    dimensions.forEach((dim) => {
      // 简化：列出所有高分维度作为主要关注点
      if (dim.score >= 60) {
        mainChanges.push(`${dim.name}风险较高(${dim.score}分)`);
      }
    });

    delta = {
      score: scoreDiff,
      trend,
      mainChanges,
    };
  }

  return {
    totalScore,
    level: levelInfo.level,
    levelLabel: levelInfo.label,
    calculatedAt: new Date().toISOString(),
    trigger,
    dimensions,
    delta,
    agentContributions: allContributions,
  };
}

/**
 * 获取风险等级
 */
export function getRiskLevel(score: number): {
  level: RiskScoreSnapshot['level'];
  label: string;
  color: string;
  description: string;
} {
  if (score <= 20) {
    return {
      level: 'safe',
      label: '安全',
      color: 'emerald',
      description: '系统处于安全状态',
    };
  }
  if (score <= 40) {
    return {
      level: 'low',
      label: '低风险',
      color: 'green',
      description: '存在少量风险，建议关注',
    };
  }
  if (score <= 60) {
    return {
      level: 'medium',
      label: '中风险',
      color: 'yellow',
      description: '存在明显风险，需要处置',
    };
  }
  if (score <= 80) {
    return {
      level: 'high',
      label: '高风险',
      color: 'orange',
      description: '存在严重风险，需立即处理',
    };
  }
  return {
    level: 'critical',
    label: '极高风险',
    color: 'red',
    description: '系统处于危险状态，需紧急响应',
  };
}

/**
 * 计算单维度贡献度
 */
export function getDimensionContributions(snapshot: RiskScoreSnapshot) {
  return snapshot.dimensions.map((dim) => ({
    name: dim.name,
    score: dim.score,
    weight: dim.weight,
    contribution: Math.round(dim.score * dim.weight * 10) / 10, // 对总分的实际贡献
    percentage: Math.round((dim.score * dim.weight / snapshot.totalScore) * 100),
  }));
}

/**
 * 计算智能体贡献度
 */
export function getTopContributors(snapshot: RiskScoreSnapshot, limit = 5) {
  return [...snapshot.agentContributions]
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, limit);
}
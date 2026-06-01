/**
 * 风险评分数据源 - 模拟智能体上报数据
 * 实际生产环境会通过 API/WebSocket 从智能体获取
 */

import { RiskDimension, AgentContribution } from '@/types/risk';

/**
 * 维度1: 资产风险 (30%)
 * 数据来源: 资产管理智能体（资产发现、核对、确认）
 */
export function getAssetRiskData(): {
  dimension: RiskDimension;
  contributions: AgentContribution[];
} {
  // 模拟数据 - 实际从资产管理智能体获取
  const totalAssets = 1248;
  const highRiskAssets = 87;
  const mediumRiskAssets = 156;
  const unclassifiedAssets = 23;

  // 计算资产风险分 (0-100, 越高越危险)
  const highRiskRatio = (highRiskAssets / totalAssets) * 100;
  const mediumRiskRatio = (mediumRiskAssets / totalAssets) * 100;
  const unclassifiedRatio = (unclassifiedAssets / totalAssets) * 100;

  const score = Math.min(100, Math.round(
    highRiskRatio * 2 + mediumRiskRatio * 0.5 + unclassifiedRatio * 1.5
  ));

  return {
    dimension: {
      key: 'asset',
      name: '资产风险',
      score,
      weight: 0.30,
      source: '资产管理智能体',
      updatedAt: new Date().toISOString(),
      metrics: [
        {
          name: '高风险资产',
          value: highRiskAssets,
          threshold: 50,
          unit: '个',
          trend: 'up',
          impact: 25,
        },
        {
          name: '中风险资产',
          value: mediumRiskAssets,
          threshold: 100,
          unit: '个',
          trend: 'stable',
          impact: 8,
        },
        {
          name: '未分类资产',
          value: unclassifiedAssets,
          threshold: 10,
          unit: '个',
          trend: 'down',
          impact: 3,
        },
        {
          name: '资产总数',
          value: totalAssets,
          unit: '个',
          trend: 'stable',
          impact: 0,
        },
      ],
    },
    contributions: [
      {
        agentId: 'asset-discovery',
        agentName: '资产发现智能体',
        dimension: 'asset',
        rawData: { totalAssets, highRiskAssets, mediumRiskAssets },
        impact: 15,
      },
      {
        agentId: 'asset-confirm',
        agentName: '资产确认智能体',
        dimension: 'asset',
        rawData: { unclassifiedAssets },
        impact: 3,
      },
    ],
  };
}

/**
 * 维度2: 告警趋势 (25%)
 * 数据来源: 监测智能体（告警监测、横向渗透、异常行为）
 */
export function getAlertTrendData(): {
  dimension: RiskDimension;
  contributions: AgentContribution[];
} {
  // 模拟近24小时告警数据
  const last24hAlerts = 342;
  const previous24hAlerts = 287;
  const criticalAlerts = 12;
  const highAlerts = 45;
  const unresolvedAlerts = 78;

  const alertGrowth = ((last24hAlerts - previous24hAlerts) / previous24hAlerts) * 100;

  // 评分逻辑：告警数量、增长率、未处置告警
  const baseScore = Math.min(60, (last24hAlerts / 500) * 60);
  const growthScore = alertGrowth > 20 ? 20 : alertGrowth > 10 ? 10 : 0;
  const unresolvedScore = (unresolvedAlerts / last24hAlerts) * 20;

  const score = Math.min(100, Math.round(baseScore + growthScore + unresolvedScore));

  return {
    dimension: {
      key: 'alert',
      name: '告警趋势',
      score,
      weight: 0.25,
      source: '监测智能体',
      updatedAt: new Date().toISOString(),
      metrics: [
        {
          name: '24h告警总数',
          value: last24hAlerts,
          threshold: 200,
          unit: '条',
          trend: alertGrowth > 10 ? 'up' : 'down',
          impact: 25,
        },
        {
          name: '紧急告警',
          value: criticalAlerts,
          threshold: 5,
          unit: '条',
          trend: 'up',
          impact: 15,
        },
        {
          name: '未处置告警',
          value: unresolvedAlerts,
          threshold: 30,
          unit: '条',
          trend: 'stable',
          impact: 12,
        },
        {
          name: '告警增长率',
          value: alertGrowth.toFixed(1),
          threshold: 10,
          unit: '%',
          trend: alertGrowth > 0 ? 'up' : 'down',
          impact: 10,
        },
      ],
    },
    contributions: [
      {
        agentId: 'alert-monitor',
        agentName: '告警辅助监测智能体',
        dimension: 'alert',
        rawData: { last24hAlerts, criticalAlerts, alertGrowth },
        impact: 28,
      },
      {
        agentId: 'lateral-monitor',
        agentName: '横向渗透监测智能体',
        dimension: 'alert',
        rawData: { detectedAnomalies: 15 },
        impact: 12,
      },
    ],
  };
}

/**
 * 维度3: 漏洞情况 (20%)
 * 数据来源: 漏洞管理智能体、补丁管理智能体
 */
export function getVulnerabilityData(): {
  dimension: RiskDimension;
  contributions: AgentContribution[];
} {
  const totalVulns = 156;
  const criticalVulns = 8;
  const highVulns = 23;
  const patchableVulns = 142;
  const avgPatchDays = 18;

  // 评分逻辑：高危漏洞数量、补丁时效
  const criticalScore = (criticalVulns / 5) * 30; // 每5个紧急漏洞30分
  const highScore = (highVulns / 20) * 20; // 每20个高危漏洞20分
  const patchDelayScore = avgPatchDays > 15 ? 15 : 0;

  const score = Math.min(100, Math.round(criticalScore + highScore + patchDelayScore));

  return {
    dimension: {
      key: 'vulnerability',
      name: '漏洞情况',
      score,
      weight: 0.20,
      source: '漏洞管理智能体',
      updatedAt: new Date().toISOString(),
      metrics: [
        {
          name: '紧急漏洞',
          value: criticalVulns,
          threshold: 3,
          unit: '个',
          trend: 'down',
          impact: 20,
        },
        {
          name: '高危漏洞',
          value: highVulns,
          threshold: 15,
          unit: '个',
          trend: 'stable',
          impact: 15,
        },
        {
          name: '可修复漏洞',
          value: patchableVulns,
          threshold: totalVulns * 0.95,
          unit: '个',
          trend: 'up',
          impact: 5,
        },
        {
          name: '平均修复时长',
          value: avgPatchDays,
          threshold: 7,
          unit: '天',
          trend: 'down',
          impact: 10,
        },
      ],
    },
    contributions: [
      {
        agentId: 'vuln-management',
        agentName: '漏洞管理智能体',
        dimension: 'vulnerability',
        rawData: { totalVulns, criticalVulns, highVulns },
        impact: 35,
      },
      {
        agentId: 'patch-management',
        agentName: '补丁管理智能体',
        dimension: 'vulnerability',
        rawData: { avgPatchDays },
        impact: 10,
      },
    ],
  };
}

/**
 * 维度4: 合规情况 (15%)
 * 数据来源: 基线管理智能体、基线检查智能体
 */
export function getComplianceData(): {
  dimension: RiskDimension;
  contributions: AgentContribution[];
} {
  const totalChecks = 48;
  const passedChecks = 39;
  const failedChecks = 9;

  const complianceRate = (passedChecks / totalChecks) * 100;
  // 合规率越低分越高（违规越严重）
  const score = Math.round(100 - complianceRate);

  return {
    dimension: {
      key: 'compliance',
      name: '合规情况',
      score,
      weight: 0.15,
      source: '基线管理智能体',
      updatedAt: new Date().toISOString(),
      metrics: [
        {
          name: '基线合规率',
          value: complianceRate.toFixed(1),
          threshold: 95,
          unit: '%',
          trend: 'up',
          impact: 15,
        },
        {
          name: '不合规项',
          value: failedChecks,
          threshold: 3,
          unit: '项',
          trend: 'down',
          impact: 12,
        },
        {
          name: '检查项总数',
          value: totalChecks,
          unit: '项',
          trend: 'stable',
          impact: 0,
        },
      ],
    },
    contributions: [
      {
        agentId: 'baseline-os',
        agentName: '操作系统基线检查智能体',
        dimension: 'compliance',
        rawData: { passed: 12, failed: 3 },
        impact: 8,
      },
      {
        agentId: 'baseline-db',
        agentName: '数据库基线检查智能体',
        dimension: 'compliance',
        rawData: { passed: 8, failed: 2 },
        impact: 5,
      },
      {
        agentId: 'baseline-mgmt',
        agentName: '基线管理智能体',
        dimension: 'compliance',
        rawData: { totalChecks, passedChecks },
        impact: 6,
      },
    ],
  };
}

/**
 * 维度5: 防护覆盖率 (10%)
 * 数据来源: 主机合规管理智能体、终端合规管理智能体
 */
export function getCoverageData(): {
  dimension: RiskDimension;
  contributions: AgentContribution[];
} {
  const totalHosts = 856;
  const protectedHosts = 798;
  const totalEndpoints = 2340;
  const protectedEndpoints = 2156;

  const hostCoverage = (protectedHosts / totalHosts) * 100;
  const endpointCoverage = (protectedEndpoints / totalEndpoints) * 100;
  const avgCoverage = (hostCoverage + endpointCoverage) / 2;

  // 覆盖率越低分越高
  const score = Math.round(100 - avgCoverage);

  return {
    dimension: {
      key: 'coverage',
      name: '防护覆盖率',
      score,
      weight: 0.10,
      source: '合规管理智能体',
      updatedAt: new Date().toISOString(),
      metrics: [
        {
          name: '主机防护率',
          value: hostCoverage.toFixed(1),
          threshold: 99,
          unit: '%',
          trend: 'up',
          impact: 5,
        },
        {
          name: '终端防护率',
          value: endpointCoverage.toFixed(1),
          threshold: 99,
          unit: '%',
          trend: 'up',
          impact: 4,
        },
        {
          name: '未防护主机',
          value: totalHosts - protectedHosts,
          unit: '台',
          trend: 'down',
          impact: 3,
        },
      ],
    },
    contributions: [
      {
        agentId: 'host-compliance',
        agentName: '主机合规管理智能体',
        dimension: 'coverage',
        rawData: { totalHosts, protectedHosts },
        impact: 5,
      },
      {
        agentId: 'endpoint-compliance',
        agentName: '终端合规管理智能体',
        dimension: 'coverage',
        rawData: { totalEndpoints, protectedEndpoints },
        impact: 4,
      },
    ],
  };
}
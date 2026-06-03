'use client';

import React from 'react';
import { PolicyEditor } from '@/components/Common/PolicyEditor';
import type { PolicyItem, PolicyConfig } from '@/components/Common/PolicyEditor/types';

const MOCK_POLICIES: PolicyItem[] = [
  {
    id: 'POL-B-001', name: '等保2.0三级-账号口令策略', type: '操作系统',
    status: 'enabled', priority: 'critical', description: '基于等保2.0三级要求的账号与口令策略检查',
    createdAt: '2026-01-15', updatedAt: '2026-05-25', checkItems: 87, affectedAssets: 124,
  },
  {
    id: 'POL-B-002', name: 'CIS Ubuntu 22.04 基线', type: '操作系统',
    status: 'enabled', priority: 'high', description: 'CIS Benchmark Ubuntu 22.04 安全基线',
    createdAt: '2026-02-20', updatedAt: '2026-05-20', checkItems: 254, affectedAssets: 48,
  },
  {
    id: 'POL-B-003', name: 'MySQL 8.0 加固', type: '数据库',
    status: 'enabled', priority: 'high', description: 'MySQL 8.0 数据库安全配置基线',
    createdAt: '2026-03-10', updatedAt: '2026-05-18', checkItems: 65, affectedAssets: 23,
  },
  {
    id: 'POL-B-004', name: 'Nginx Web 加固', type: '中间件',
    status: 'enabled', priority: 'medium', description: 'Nginx Web 服务器安全加固策略',
    createdAt: '2026-03-25', updatedAt: '2026-05-15', checkItems: 42, affectedAssets: 35,
  },
  {
    id: 'POL-B-005', name: '防火墙默认配置', type: '安全设备',
    status: 'enabled', priority: 'critical', description: '防火墙默认安全配置基线',
    createdAt: '2026-04-01', updatedAt: '2026-05-10', checkItems: 56, affectedAssets: 12,
  },
  {
    id: 'POL-B-006', name: 'Windows Server 2019 加固', type: '操作系统',
    status: 'draft', priority: 'high', description: 'Windows Server 2019 CIS Benchmark',
    createdAt: '2026-05-01', updatedAt: '2026-05-22', checkItems: 298, affectedAssets: 18,
  },
  {
    id: 'POL-B-007', name: 'Redis 7 安全配置', type: '数据库',
    status: 'enabled', priority: 'medium', description: 'Redis 7 缓存安全加固',
    createdAt: '2026-04-15', updatedAt: '2026-05-08', checkItems: 38, affectedAssets: 26,
  },
  {
    id: 'POL-B-008', name: 'Docker 容器基线', type: '应用',
    status: 'disabled', priority: 'medium', description: 'Docker 容器安全基线检查',
    createdAt: '2026-04-20', updatedAt: '2026-05-05', checkItems: 52, affectedAssets: 41,
  },
];

const config: PolicyConfig = {
  templateSources: ['等保2.0', 'CIS Benchmark', 'ISO 27001', 'NIST', '自定义'],
  complianceFrameworks: ['等保2.0', 'CIS', 'ISO 27001'],
  approvalLevels: 3,
  riskDimensions: ['检查项数', '适用资产数', '变更影响', '修复紧迫度'],
  extraFields: [],
  typeOptions: [
    { value: '操作系统', label: '操作系统' },
    { value: '数据库', label: '数据库' },
    { value: '中间件', label: '中间件' },
    { value: '安全设备', label: '安全设备' },
    { value: '应用', label: '应用' },
  ],
};

export function HardeningStrategyConfig() {
  return (
    <PolicyEditor
      policyType="baseline"
      config={config}
      policies={MOCK_POLICIES}
    />
  );
}

export default HardeningStrategyConfig;

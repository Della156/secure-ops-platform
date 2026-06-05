'use client';

import React from 'react';
import { PolicyEditor } from '@/components/Common/PolicyEditor';
import type { PolicyItem, PolicyConfig } from '@/components/Common/PolicyEditor/types';

const MOCK_POLICIES: PolicyItem[] = [
  {
    id: 'RULE-001', name: '僵尸账号检测', type: '账号审计',
    status: 'enabled', priority: 'high', description: '检测 90 天未登录的账号',
    createdAt: '2026-01-15', updatedAt: '2026-05-20', logSource: '账号管理系统', cycle: '每天',
    alertLevel: 'warning', falsePositiveRate: 0.02, grayTest: '100%',
  },
  {
    id: 'RULE-002', name: '权限滥用检测', type: '权限审计',
    status: 'enabled', priority: 'critical', description: '检测异常权限使用行为（如非工作时间敏感操作）',
    createdAt: '2026-02-10', updatedAt: '2026-05-22', logSource: '权限系统 + 行为日志', cycle: '实时',
    alertLevel: 'failed', falsePositiveRate: 0.05, grayTest: '50%',
  },
  {
    id: 'RULE-003', name: '特权账号审计', type: '账号审计',
    status: 'enabled', priority: 'critical', description: '审计特权账号（root/admin）使用情况',
    createdAt: '2026-01-20', updatedAt: '2026-05-18', logSource: '操作系统审计', cycle: '实时',
    alertLevel: 'failed', falsePositiveRate: 0.01, grayTest: '100%',
  },
  {
    id: 'RULE-004', name: '敏感数据访问审计', type: '数据审计',
    status: 'enabled', priority: 'high', description: '审计个人隐私数据、机密数据的访问行为',
    createdAt: '2026-02-25', updatedAt: '2026-05-15', logSource: '数据库审计', cycle: '实时',
    alertLevel: 'warning', falsePositiveRate: 0.08, grayTest: '25%',
  },
  {
    id: 'RULE-005', name: '配置变更审计', type: '配置审计',
    status: 'enabled', priority: 'medium', description: '审计网络设备、安全设备的配置变更',
    createdAt: '2026-03-05', updatedAt: '2026-05-10', logSource: 'syslog + 配置备份', cycle: '实时',
    alertLevel: 'warning', falsePositiveRate: 0.03, grayTest: '100%',
  },
  {
    id: 'RULE-006', name: '权限继承检测', type: '权限审计',
    status: 'enabled', priority: 'medium', description: '检测不合理的权限继承链',
    createdAt: '2026-03-15', updatedAt: '2026-05-08', logSource: 'AD/LDAP', cycle: '每周',
    alertLevel: 'info', falsePositiveRate: 0.04, grayTest: '100%',
  },
  {
    id: 'RULE-007', name: '登录失败检测', type: '账号审计',
    status: 'enabled', priority: 'medium', description: '检测连续登录失败（密码爆破）',
    createdAt: '2026-04-01', updatedAt: '2026-05-05', logSource: '认证日志', cycle: '实时',
    alertLevel: 'warning', falsePositiveRate: 0.10, grayTest: '100%',
  },
  {
    id: 'RULE-008', name: '数据导出审计', type: '数据审计',
    status: 'draft', priority: 'high', description: '审计大批量数据导出行为（数据防泄漏）',
    createdAt: '2026-04-20', updatedAt: '2026-05-22', logSource: 'DLP 系统', cycle: '实时',
    alertLevel: 'failed', falsePositiveRate: 0.15, grayTest: '0%',
  },
];

const config: PolicyConfig = {
  templateSources: ['等保2.0', 'SOX', 'GDPR', 'PCI-DSS', '自定义'],
  complianceFrameworks: ['等保2.0', 'SOX', 'GDPR', 'PCI-DSS'],
  approvalLevels: 2,
  riskDimensions: ['操作敏感度', '数据敏感度', '异常度', '影响范围'],
  extraFields: [],
  typeOptions: [
    { value: '账号审计', label: '账号审计' },
    { value: '权限审计', label: '权限审计' },
    { value: '数据审计', label: '数据审计' },
    { value: '配置审计', label: '配置审计' },
    { value: '操作审计', label: '操作审计' },
  ],
};

export function AuditRuleConfig() {
  return (
    <PolicyEditor
      policyType="audit"
      config={config} policies={MOCK_POLICIES}
    />
  );
}

export default AuditRuleConfig;

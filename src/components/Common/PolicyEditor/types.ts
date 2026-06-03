/**
 * PolicyEditor 策略编辑器 - 类型定义
 *
 * 3 个策略类页面共享: HardeningStrategyConfig / VulnStrategyConfig / AuditRuleConfig
 */

import type { ReactNode } from 'react';

export type PolicyType = 'baseline' | 'vuln' | 'audit';

export interface PolicyItem {
  id: string;
  name: string;
  type: string;
  status: 'enabled' | 'disabled' | 'draft';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description?: string;
  createdAt: string;
  updatedAt: string;
  /** 业务自定义字段 */
  [key: string]: any;
}

export interface PolicyTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  itemCount: number;
  source: string;
  isCustom: boolean;
}

export interface ComplianceMappingItem {
  /** 合规框架名称 */
  framework: string;
  /** 条款编号 */
  clause: string;
  /** 条款名称 */
  clauseName: string;
  /** 覆盖率 0-1 */
  coverage: number;
  /** 关联的策略数 */
  policyCount: number;
}

export interface ApprovalLevel {
  level: number;
  name: string;
  approver: string;
  required: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PolicyVersion {
  version: string;
  releasedAt: string;
  releasedBy: string;
  changeCount: number;
  isCurrent: boolean;
  notes: string;
}

export interface PolicyConfig {
  /** 模板库来源（baseline: 等保/CIS；vuln: CVE/CNVD；audit: 审计规则）*/
  templateSources: string[];
  /** 合规框架（等保/CIS/SOX/GDPR 等）*/
  complianceFrameworks: string[];
  /** 审批层级（1-3）*/
  approvalLevels: number;
  /** 风险评估维度 */
  riskDimensions: string[];
  /** 业务扩展字段 */
  extraFields: ExtraField[];
  /** 策略类型标签 */
  typeOptions: { value: string; label: string }[];
}

export interface ExtraField {
  key: string;
  label: string;
  type: 'number' | 'text' | 'select';
  options?: { value: string; label: string }[];
}

export interface PolicyEditorProps {
  policyType: PolicyType;
  config: PolicyConfig;
  policies?: PolicyItem[];
  onPolicyChange?: (policies: PolicyItem[]) => void;
}

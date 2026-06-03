'use client';

import React from 'react';
import { PolicyEditor } from '@/components/Common/PolicyEditor';
import type { PolicyItem, PolicyConfig } from '@/components/Common/PolicyEditor/types';

const MOCK_POLICIES: PolicyItem[] = [
  {
    id: 'POL-V-001', name: 'CVE-2024-38063 Windows TCP/IP 远程代码执行', type: 'RCE 漏洞',
    status: 'enabled', priority: 'critical', description: 'Windows TCP/IP 远程代码执行漏洞（CVSS 9.8）',
    createdAt: '2026-04-20', updatedAt: '2026-05-25', cvss: 9.8, affectedAssets: 86,
    cveList: 'CVE-2024-38063', fixWindow: '24h', patchStatus: '已发布', canaryRate: '25%',
  },
  {
    id: 'POL-V-002', name: 'CVE-2024-3094 XZ Utils 后门', type: '供应链漏洞',
    status: 'enabled', priority: 'critical', description: 'XZ Utils 5.6.0/5.6.1 后门漏洞（CVSS 10.0）',
    createdAt: '2026-04-15', updatedAt: '2026-05-22', cvss: 10.0, affectedAssets: 12,
    cveList: 'CVE-2024-3094', fixWindow: '24h', patchStatus: '已发布', canaryRate: '100%',
  },
  {
    id: 'POL-V-003', name: 'CNVD-2024-1234 Apache Log4j2 漏洞', type: 'RCE 漏洞',
    status: 'enabled', priority: 'high', description: 'Apache Log4j2 JNDI 注入漏洞',
    createdAt: '2026-03-10', updatedAt: '2026-05-20', cvss: 9.0, affectedAssets: 45,
    cveList: 'CVE-2021-44228', fixWindow: '7d', patchStatus: '已发布', canaryRate: '100%',
  },
  {
    id: 'POL-V-004', name: 'OpenSSL 拒绝服务漏洞', type: '拒绝服务',
    status: 'enabled', priority: 'medium', description: 'OpenSSL 3.0+ 拒绝服务漏洞',
    createdAt: '2026-04-25', updatedAt: '2026-05-18', cvss: 7.5, affectedAssets: 28,
    cveList: 'CVE-2024-2511', fixWindow: '30d', patchStatus: '已发布', canaryRate: '50%',
  },
  {
    id: 'POL-V-005', name: 'Linux 内核提权漏洞', type: '提权漏洞',
    status: 'draft', priority: 'high', description: 'Linux Kernel 本地提权漏洞',
    createdAt: '2026-05-01', updatedAt: '2026-05-15', cvss: 7.8, affectedAssets: 56,
    cveList: 'CVE-2024-1086', fixWindow: '7d', patchStatus: '未发布', canaryRate: '5%',
  },
  {
    id: 'POL-V-006', name: 'Nginx 缓冲区溢出', type: '内存破坏',
    status: 'enabled', priority: 'medium', description: 'Nginx HTTP/2 缓冲区溢出',
    createdAt: '2026-04-12', updatedAt: '2026-05-10', cvss: 7.1, affectedAssets: 18,
    cveList: 'CVE-2024-31079', fixWindow: '30d', patchStatus: '已发布', canaryRate: '100%',
  },
  {
    id: 'POL-V-007', name: 'PostgreSQL 信息泄露', type: '信息泄露',
    status: 'disabled', priority: 'low', description: 'PostgreSQL pg_dump 信息泄露',
    createdAt: '2026-04-05', updatedAt: '2026-05-05', cvss: 4.5, affectedAssets: 8,
    cveList: 'CVE-2024-4317', fixWindow: '90d', patchStatus: '已发布', canaryRate: '100%',
  },
];

const config: PolicyConfig = {
  templateSources: ['CVE', 'NVD', 'CNVD', '内部漏洞库', '自定义'],
  complianceFrameworks: ['等保2.0', 'PCI-DSS'],
  approvalLevels: 3,
  riskDimensions: ['CVSS 评分', '业务重要性', '资产暴露面', '修复紧迫度'],
  extraFields: [],
  typeOptions: [
    { value: 'RCE 漏洞', label: 'RCE 漏洞' },
    { value: '提权漏洞', label: '提权漏洞' },
    { value: '供应链漏洞', label: '供应链漏洞' },
    { value: '拒绝服务', label: '拒绝服务' },
    { value: '信息泄露', label: '信息泄露' },
    { value: '内存破坏', label: '内存破坏' },
  ],
};

export function VulnStrategyConfig() {
  return (
    <PolicyEditor
      policyType="vuln"
      config={config}
      policies={MOCK_POLICIES}
    />
  );
}

export default VulnStrategyConfig;

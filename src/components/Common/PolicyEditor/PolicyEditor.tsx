'use client';

import React, { useState } from 'react';
import { BookOpen, Shield, GitBranch, History as HistoryIcon, FileText } from 'lucide-react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { TemplateLibrary } from './TemplateLibrary';
import { ComplianceMapping } from './ComplianceMapping';
import { ApprovalConfig } from './ApprovalConfig';
import { VersionHistory } from './VersionHistory';
import type { PolicyEditorProps, PolicyItem, PolicyTemplate, ComplianceMappingItem as Mapping, ApprovalLevel, PolicyVersion } from './types';

const TABS = [
  { key: 'policies', label: '策略列表', icon: FileText },
  { key: 'templates', label: '模板库', icon: BookOpen },
  { key: 'compliance', label: '合规映射', icon: Shield },
  { key: 'approval', label: '审批配置', icon: GitBranch },
  { key: 'versions', label: '版本历史', icon: HistoryIcon },
] as const;

type TabKey = typeof TABS[number]['key'];

/**
 * PolicyEditor 策略编辑器主组件
 *
 * 5 Tab: 策略列表 / 模板库 / 合规映射 / 审批配置 / 版本历史
 */
export function PolicyEditor({
  policyType,
  config,
  policies = [],
}: PolicyEditorProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('policies');

  return (
    <div className="space-y-4">
      {/* 标题区 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-50">{getPolicyTitle(policyType)}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {getPolicySubtitle(policyType)}
        </p>
      </div>

      {/* Tab 切换 */}
      <div className="border-b border-[#2A354D] flex items-center gap-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                isActive
                  ? 'border-[#0066FF] text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 内容 */}
      {activeTab === 'policies' && (
        <PolicyListTab policies={policies} config={config} />
      )}

      {activeTab === 'templates' && (
        <TemplateLibrary
          sources={config.templateSources}
          templates={getMockTemplates(policyType)}
        />
      )}

      {activeTab === 'compliance' && (
        <ComplianceMapping
          frameworks={config.complianceFrameworks}
          mappings={getMockMappings(policyType)}
        />
      )}

      {activeTab === 'approval' && (
        <ApprovalConfig levels={getMockApprovalLevels(config.approvalLevels)} />
      )}

      {activeTab === 'versions' && (
        <VersionHistory versions={getMockVersions()} />
      )}
    </div>
  );
}

// Tab 1: 策略列表（用 ListPage 包装）
function PolicyListTab({ policies, config }: { policies: PolicyItem[]; config: PolicyEditorProps['config'] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = policies.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || p.type === typeFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchPriority = !priorityFilter || p.priority === priorityFilter;
    return matchSearch && matchType && matchStatus && matchPriority;
  });

  const columns = [
    { key: 'id', title: '策略ID', width: '100px' },
    { key: 'name', title: '策略名称' },
    { key: 'type', title: '类型', width: '120px' },
    {
      key: 'priority', title: '优先级', width: '90px',
      render: (p: PolicyItem) => {
        const map: any = { critical: 'failed', high: 'warning', medium: 'info', low: 'info' };
        const text: any = { critical: '极高', high: '高', medium: '中', low: '低' };
        return <StatusBadge status={map[p.priority]} />;
      },
    },
    {
      key: 'status', title: '状态', width: '90px',
      render: (p: PolicyItem) => {
        const map: any = { enabled: 'success', disabled: 'info', draft: 'pending' };
        const text: any = { enabled: '已启用', disabled: '已停用', draft: '草稿' };
        return <StatusBadge status={map[p.status]} />;
      },
    },
    { key: 'updatedAt', title: '最近更新', width: '150px' },
  ];

  return (
    <ListPage<PolicyItem>
      searchPlaceholder="搜索策略名称..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={[
        { key: 'type', label: '类型', options: config.typeOptions, width: 'w-40' },
        {
          key: 'status', label: '状态',
          options: [
            { value: 'enabled', label: '已启用' },
            { value: 'disabled', label: '已停用' },
            { value: 'draft', label: '草稿' },
          ],
        },
        {
          key: 'priority', label: '优先级',
          options: [
            { value: 'critical', label: '极高' },
            { value: 'high', label: '高' },
            { value: 'medium', label: '中' },
            { value: 'low', label: '低' },
          ],
        },
      ]}
      filterValues={{ type: typeFilter, status: statusFilter, priority: priorityFilter }}
      onFilterChange={(k, v) => {
        if (k === 'type') setTypeFilter(v);
        if (k === 'status') setStatusFilter(v);
        if (k === 'priority') setPriorityFilter(v);
      }}
      data={filtered}
      columns={columns}
      rowKey="id"
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      bulkActions={[
        { key: 'enable', label: '批量启用', onClick: (ids) => console.log('enable', ids) },
        { key: 'disable', label: '批量停用', onClick: (ids) => console.log('disable', ids) },
        { key: 'export', label: '导出', onClick: (ids) => console.log('export', ids) },
        { key: 'delete', label: '删除', danger: true, onClick: (ids) => console.log('delete', ids) },
      ]}
      renderDetail={(p) => (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">{p.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{p.id}</p>
          </div>
          <p className="text-sm text-slate-400">{p.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="类型" value={p.type} />
            <Field label="优先级" value={p.priority} />
            <Field label="状态" value={p.status} />
            <Field label="创建时间" value={p.createdAt} />
            <Field label="更新时间" value={p.updatedAt} />
          </div>

          {Object.entries(p).filter(([k]) =>
            !['id', 'name', 'type', 'status', 'priority', 'description', 'createdAt', 'updatedAt'].includes(k)
          ).map(([k, v]) => (
            <Field key={k} label={k} value={String(v)} />
          ))}
        </div>
      )}
    />
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 bg-[#111625] rounded-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5">{value}</p>
    </div>
  );
}

function getPolicyTitle(type: 'baseline' | 'vuln' | 'audit') {
  const map = {
    baseline: '安全基线加固策略制定',
    vuln: '安全漏洞加固策略制定',
    audit: '审计规则与策略配置',
  };
  return map[type];
}

function getPolicySubtitle(type: 'baseline' | 'vuln' | 'audit') {
  const map = {
    baseline: '管理安全基线加固策略（等保/CIS/ISO 等合规框架）',
    vuln: '管理安全漏洞加固策略（CVE/CNVD 漏洞库与风险评分）',
    audit: '管理审计规则与策略（账号/操作/数据/配置审计）',
  };
  return map[type];
}

function getMockTemplates(type: 'baseline' | 'vuln' | 'audit'): PolicyTemplate[] {
  if (type === 'baseline') {
    return [
      { id: 'T-001', name: '等保2.0三级-操作系统', category: '操作系统', description: '基于等保2.0三级要求的操作系统基线检查模板', itemCount: 87, source: '等保2.0', isCustom: false },
      { id: 'T-002', name: 'CIS Ubuntu 22.04', category: '操作系统', description: 'CIS Benchmark Ubuntu 22.04 基线', itemCount: 254, source: 'CIS', isCustom: false },
      { id: 'T-003', name: 'CIS Windows Server 2019', category: '操作系统', description: 'CIS Benchmark Windows Server 2019', itemCount: 298, source: 'CIS', isCustom: false },
      { id: 'T-004', name: 'MySQL 8.0 基线', category: '数据库', description: 'MySQL 8.0 安全配置基线', itemCount: 65, source: 'MySQL 官方', isCustom: false },
      { id: 'T-005', name: 'Nginx 加固', category: '中间件', description: 'Nginx Web 服务器安全加固', itemCount: 42, source: 'Nginx 官方', isCustom: false },
      { id: 'T-006', name: '内部核心系统加固', category: '应用', description: '公司内部核心业务系统加固', itemCount: 128, source: '自定义', isCustom: true },
    ];
  }
  if (type === 'vuln') {
    return [
      { id: 'T-V001', name: 'CVE 2024 高危漏洞', category: '高危漏洞', description: '2024 年发布的 CVE 高危漏洞加固策略', itemCount: 32, source: 'CVE', isCustom: false },
      { id: 'T-V002', name: 'CNVD 金融行业', category: '行业漏洞', description: '金融行业 CNVD 漏洞库加固策略', itemCount: 18, source: 'CNVD', isCustom: false },
      { id: 'T-V003', name: 'Windows 远程代码执行', category: 'RCE 漏洞', description: 'Windows 远程代码执行漏洞统一加固', itemCount: 24, source: '内部', isCustom: true },
    ];
  }
  return [
    { id: 'T-A001', name: '等保账号审计', category: '账号审计', description: '等保2.0账号审计规则', itemCount: 45, source: '等保2.0', isCustom: false },
    { id: 'T-A002', name: 'SOX 操作审计', category: '操作审计', description: 'SOX 合规操作审计规则', itemCount: 32, source: 'SOX', isCustom: false },
    { id: 'T-A003', name: 'GDPR 数据访问', category: '数据审计', description: 'GDPR 数据访问审计规则', itemCount: 28, source: 'GDPR', isCustom: false },
  ];
}

function getMockMappings(type: 'baseline' | 'vuln' | 'audit'): Mapping[] {
  if (type === 'baseline') {
    return [
      { framework: '等保2.0', clause: '8.1.4.1', clauseName: '身份鉴别', coverage: 0.95, policyCount: 5 },
      { framework: '等保2.0', clause: '8.1.4.2', clauseName: '访问控制', coverage: 0.88, policyCount: 8 },
      { framework: '等保2.0', clause: '8.1.4.3', clauseName: '安全审计', coverage: 0.65, policyCount: 3 },
      { framework: '等保2.0', clause: '8.1.5.1', clauseName: '入侵防范', coverage: 0.42, policyCount: 2 },
      { framework: 'CIS', clause: '1.1', clauseName: '文件系统配置', coverage: 0.78, policyCount: 6 },
      { framework: 'CIS', clause: '1.4', clauseName: '引导配置', coverage: 0.55, policyCount: 4 },
    ];
  }
  return [];
}

function getMockApprovalLevels(count: number): ApprovalLevel[] {
  const presets: ApprovalLevel[] = [
    { level: 1, name: '初审', approver: '安全工程师', required: true, status: 'approved' },
    { level: 2, name: '复核', approver: '安全主管', required: true, status: 'pending' },
    { level: 3, name: '发布', approver: '安全总监', required: false, status: 'pending' },
  ];
  return presets.slice(0, count);
}

function getMockVersions(): PolicyVersion[] {
  return [
    { version: 'v2.0', releasedAt: '2026-05-25 14:30', releasedBy: '张三', changeCount: 12, isCurrent: true, notes: '新增账户锁定阈值 + 日志保留时长；移除 telnet 协议' },
    { version: 'v1.5', releasedAt: '2026-04-10 10:00', releasedBy: '李四', changeCount: 6, isCurrent: false, notes: '优化密码复杂度规则' },
    { version: 'v1.0', releasedAt: '2026-01-15 09:00', releasedBy: '王五', changeCount: 87, isCurrent: false, notes: '首版基线策略发布' },
  ];
}

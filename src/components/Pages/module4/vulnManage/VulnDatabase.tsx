'use client';

import React, { useState, useMemo } from 'react';
import {
  Database, Plus, RefreshCw, Download, Search, Tag, Globe,
  Shield, AlertTriangle, Bug, Layers, Zap, TrendingUp, FileText,
  Check, X, ChevronRight, ExternalLink, Calendar, Filter, Eye,
  Edit3, Trash2, Activity,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { ListPage } from '@/components/Common/ListPage';

/**
 * 4.6-7 漏洞库维护
 *
 * CVE/NVD/CNVD/CNNVD 漏洞库 + 自定义规则
 * - 4 源同步（NVD/CNVD/CNNVD/Custom）
 * - 多条件搜索/筛选
 * - 详情抽屉（漏洞描述/CVSS/影响/修复/引用）
 * - 批量启用/停用
 */

type SyncStatus = 'synced' | 'syncing' | 'pending' | 'failed';
type VulnLevel = 'critical' | 'high' | 'medium' | 'low';
type VulnSource = 'NVD' | 'CNVD' | 'CNNVD' | 'Custom';

interface VulnEntry {
  id: string;
  cve?: string;
  cnvd?: string;
  cnnvd?: string;
  name: string;
  level: VulnLevel;
  cvss: number;
  vendor: string;
  product: string;
  category: string;
  tags: string[];
  source: VulnSource;
  publishDate: string;
  updateDate: string;
  references: number;
  exploitAvailable: boolean;
  patchAvailable: boolean;
  enabled: boolean;
  description: string;
}

const INITIAL_ENTRIES: VulnEntry[] = [
  { id: 'VE-001', cve: 'CVE-2024-3094', cnvd: 'CNVD-2024-12345', name: 'XZ Utils 后门漏洞', level: 'critical', cvss: 10.0, vendor: 'XZ Utils Project', product: 'liblzma', category: '供应链', tags: ['供应链', '后门', 'SSH', 'Linux'], source: 'NVD', publishDate: '2024-03-29', updateDate: '2024-04-02', references: 23, exploitAvailable: true, patchAvailable: true, enabled: true, description: 'XZ Utils 5.6.0/5.6.1 版本中发现恶意后门代码，可导致 SSH 服务被远程控制' },
  { id: 'VE-002', cve: 'CVE-2024-21412', name: 'Microsoft Outlook RCE', level: 'critical', cvss: 9.8, vendor: 'Microsoft', product: 'Outlook', category: '应用漏洞', tags: ['RCE', '邮件', 'Windows'], source: 'NVD', publishDate: '2024-02-13', updateDate: '2024-03-01', references: 18, exploitAvailable: true, patchAvailable: true, enabled: true, description: 'Microsoft Outlook 存在远程代码执行漏洞，攻击者可通过构造邮件触发' },
  { id: 'VE-003', cve: 'CVE-2024-23897', name: 'Jenkins 任意文件读取', level: 'critical', cvss: 9.8, vendor: 'Jenkins', product: 'Jenkins CI', category: '中间件', tags: ['文件读取', 'CI/CD'], source: 'NVD', publishDate: '2024-01-24', updateDate: '2024-02-15', references: 12, exploitAvailable: false, patchAvailable: true, enabled: true, description: 'Jenkins CLI 任意文件读取漏洞，攻击者可读取服务器任意文件' },
  { id: 'VE-004', cve: 'CVE-2024-21626', name: 'runc 容器逃逸', level: 'high', cvss: 8.6, vendor: 'Open Container Initiative', product: 'runc', category: '容器安全', tags: ['容器逃逸', 'Docker'], source: 'NVD', publishDate: '2024-01-31', updateDate: '2024-02-28', references: 9, exploitAvailable: true, patchAvailable: true, enabled: true, description: 'runc 容器逃逸漏洞，攻击者可获取宿主主机权限' },
  { id: 'VE-005', cnvd: 'CNVD-2024-09876', name: '某 OA 系统 SQL 注入', level: 'high', cvss: 8.1, vendor: '国内厂商', product: 'OA System', category: 'Web 应用', tags: ['SQL注入', 'OA', '国产化'], source: 'CNVD', publishDate: '2024-04-12', updateDate: '2024-04-20', references: 5, exploitAvailable: false, patchAvailable: true, enabled: true, description: '某 OA 系统存在 SQL 注入漏洞，可获取数据库敏感数据' },
  { id: 'VE-006', cnnvd: 'CNNVD-202403-1234', name: 'Apache Struts 文件上传', level: 'critical', cvss: 9.8, vendor: 'Apache', product: 'Struts 2', category: '中间件', tags: ['文件上传', 'RCE'], source: 'CNNVD', publishDate: '2023-12-07', updateDate: '2024-01-10', references: 14, exploitAvailable: false, patchAvailable: true, enabled: true, description: 'Apache Struts 2 文件上传漏洞，可导致远程代码执行' },
  { id: 'VE-007', cve: 'CVE-2023-44487', name: 'HTTP/2 Rapid Reset DoS', level: 'high', cvss: 7.5, vendor: 'HTTP/2 Protocol', product: 'HTTP/2', category: '协议漏洞', tags: ['DoS', 'HTTP2', '协议'], source: 'NVD', publishDate: '2023-10-10', updateDate: '2023-11-15', references: 28, exploitAvailable: true, patchAvailable: true, enabled: true, description: 'HTTP/2 协议层拒绝服务漏洞，可低成本发起大规模 DDoS 攻击' },
  { id: 'VE-008', name: '弱口令检测规则集', level: 'medium', cvss: 0, vendor: '自定义', product: '-', category: '配置缺陷', tags: ['弱口令', '配置', '基线'], source: 'Custom', publishDate: '2023-01-01', updateDate: '2026-05-01', references: 0, exploitAvailable: false, patchAvailable: false, enabled: true, description: '企业内部弱口令检测规则集，覆盖 200+ 常见弱密码模式' },
  { id: 'VE-009', cve: 'CVE-2024-1086', name: 'Linux 内核提权漏洞', level: 'high', cvss: 7.8, vendor: 'Linux', product: 'Kernel', category: '操作系统', tags: ['内核', '提权', 'Linux'], source: 'NVD', publishDate: '2024-01-31', updateDate: '2024-02-10', references: 16, exploitAvailable: true, patchAvailable: true, enabled: true, description: 'Linux Kernel 5.14-6.6 提权漏洞，本地用户可获取 root 权限' },
  { id: 'VE-010', name: '未授权访问检测规则', level: 'high', cvss: 0, vendor: '自定义', product: '-', category: '配置缺陷', tags: ['未授权', 'Redis', 'MongoDB'], source: 'Custom', publishDate: '2023-06-01', updateDate: '2026-05-15', references: 0, exploitAvailable: false, patchAvailable: false, enabled: true, description: 'Redis/MongoDB/Elasticsearch 等未授权访问检测规则' },
  { id: 'VE-011', cve: 'CVE-2024-21762', name: 'FortiOS SSL VPN RCE', level: 'critical', cvss: 9.6, vendor: 'Fortinet', product: 'FortiOS', category: '网络设备', tags: ['SSL VPN', 'RCE', 'Fortinet'], source: 'NVD', publishDate: '2024-02-08', updateDate: '2024-03-12', references: 21, exploitAvailable: true, patchAvailable: true, enabled: false, description: 'FortiOS SSL VPN 越界写入漏洞，可导致远程代码执行' },
  { id: 'VE-012', cve: 'CVE-2023-50164', name: 'Apache Struts RCE', level: 'critical', cvss: 9.8, vendor: 'Apache', product: 'Struts 2', category: '中间件', tags: ['RCE', '文件上传', 'Struts'], source: 'NVD', publishDate: '2023-12-07', updateDate: '2024-01-15', references: 12, exploitAvailable: true, patchAvailable: true, enabled: true, description: 'Apache Struts 2 路径遍历导致远程代码执行' },
];

const levelBadgeMap: Record<VulnLevel, { status: any; text: string }> = {
  critical: { status: 'failed', text: '严重' },
  high: { status: 'warning', text: '高危' },
  medium: { status: 'info', text: '中危' },
  low: { status: 'info', text: '低危' },
};

const sourceConfig: Record<VulnSource, { label: string; color: string }> = {
  NVD: { label: 'NVD', color: 'text-blue-400 bg-blue-500/10' },
  CNVD: { label: 'CNVD', color: 'text-red-400 bg-red-500/10' },
  CNNVD: { label: 'CNNVD', color: 'text-purple-400 bg-purple-500/10' },
  Custom: { label: '自定义', color: 'text-cyan-400 bg-cyan-500/10' },
};

interface SyncTask {
  id: string;
  source: VulnSource;
  status: SyncStatus;
  lastSync: string;
  nextSync: string;
  totalCount: number;
  newCount: number;
  enabled: boolean;
}

const INITIAL_SYNC_TASKS: SyncTask[] = [
  { id: 'SYNC-001', source: 'NVD', status: 'synced', lastSync: '2026-06-02 16:00', nextSync: '2026-06-03 04:00', totalCount: 234567, newCount: 122, enabled: true },
  { id: 'SYNC-002', source: 'CNVD', status: 'syncing', lastSync: '2026-06-02 12:00', nextSync: '2026-06-02 18:00', totalCount: 89543, newCount: 38, enabled: true },
  { id: 'SYNC-003', source: 'CNNVD', status: 'synced', lastSync: '2026-06-02 08:00', nextSync: '2026-06-03 08:00', totalCount: 63777, newCount: 45, enabled: true },
  { id: 'SYNC-004', source: 'Custom', status: 'pending', lastSync: '2026-05-30 10:00', nextSync: '手动触发', totalCount: 256, newCount: 0, enabled: true },
];

const syncStatusBadgeMap: Record<SyncStatus, { status: any; text: string }> = {
  synced: { status: 'success', text: '已同步' },
  syncing: { status: 'running', text: '同步中' },
  pending: { status: 'pending', text: '待同步' },
  failed: { status: 'failed', text: '失败' },
};

export function VulnDatabase() {
  const [entries, setEntries] = useState<VulnEntry[]>(INITIAL_ENTRIES);
  const [syncTasks, setSyncTasks] = useState<SyncTask[]>(INITIAL_SYNC_TASKS);
  const [activeTab, setActiveTab] = useState<'entries' | 'sync'>('entries');
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<VulnEntry | null>(null);

  // 启用/禁用
  const toggleEnabled = (id: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)));

  // 同步任务操作
  const triggerSync = (id: string) => {
    setSyncTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'syncing' } : t)));
    setTimeout(() => {
      setSyncTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'synced', lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '), newCount: Math.floor(Math.random() * 50) } : t)));
    }, 2000);
  };

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.cve?.toLowerCase().includes(search.toLowerCase()) && !e.cnvd?.toLowerCase().includes(search.toLowerCase()) && !e.vendor.toLowerCase().includes(search.toLowerCase())) return false;
      if (levelFilter && e.level !== levelFilter) return false;
      if (sourceFilter && e.source !== sourceFilter) return false;
      return true;
    });
  }, [entries, search, levelFilter, sourceFilter]);

  // KPI
  const total = entries.length;
  const critical = entries.filter((e) => e.level === 'critical').length;
  const exploit = entries.filter((e) => e.exploitAvailable).length;
  const custom = entries.filter((e) => e.source === 'Custom').length;

  const columns = [
    {
      key: 'id', title: 'CVE/CNVD', width: '150px',
      render: (e: VulnEntry) => (
        <div className="space-y-0.5">
          {e.cve && <div className="font-mono text-xs text-blue-400">{e.cve}</div>}
          {e.cnvd && <div className="font-mono text-[10px] text-red-400">{e.cnvd}</div>}
          {e.cnnvd && <div className="font-mono text-[10px] text-purple-400">{e.cnnvd}</div>}
          {!e.cve && !e.cnvd && !e.cnnvd && <div className="font-mono text-xs text-slate-500">{e.id}</div>}
        </div>
      ),
    },
    {
      key: 'name', title: '漏洞名称', width: '260px',
      render: (e: VulnEntry) => (
        <div>
          <div className="text-sm text-slate-100 line-clamp-1">{e.name}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
            <span>{e.vendor} · {e.product}</span>
            <span className={`text-[10px] px-1 py-0 rounded ${sourceConfig[e.source].color}`}>{sourceConfig[e.source].label}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'level', title: '等级', width: '80px',
      render: (e: VulnEntry) => <StatusBadge status={levelBadgeMap[e.level].status} />,
    },
    {
      key: 'cvss', title: 'CVSS', width: '70px',
      render: (e: VulnEntry) => e.cvss > 0 ? (
        <span className={`font-mono text-sm font-medium ${
          e.cvss >= 9.0 ? 'text-red-400' :
          e.cvss >= 7.0 ? 'text-orange-400' :
          e.cvss >= 4.0 ? 'text-yellow-400' :
          'text-slate-400'
        }`}>{e.cvss.toFixed(1)}</span>
      ) : <span className="text-xs text-slate-500">-</span>,
    },
    {
      key: 'exploit', title: 'EXP', width: '80px',
      render: (e: VulnEntry) => e.exploitAvailable ? (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 flex items-center gap-1 inline-flex">
          <Zap className="w-3 h-3" />可用
        </span>
      ) : <span className="text-[10px] text-slate-500">-</span>,
    },
    {
      key: 'patch', title: '补丁', width: '60px',
      render: (e: VulnEntry) => e.patchAvailable ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-slate-500" />,
    },
    {
      key: 'category', title: '分类', width: '100px',
      render: (e: VulnEntry) => <span className="text-xs text-slate-300">{e.category}</span>,
    },
    {
      key: 'updateDate', title: '更新', width: '90px',
      render: (e: VulnEntry) => <span className="text-xs text-slate-500">{e.updateDate}</span>,
    },
    {
      key: 'enabled', title: '启用', width: '70px',
      render: (e: VulnEntry) => (
        <button
          onClick={(ev) => { ev.stopPropagation(); toggleEnabled(e.id); }}
          className={`w-9 h-5 rounded-full transition-colors ${e.enabled ? 'bg-green-500' : 'bg-[#2A354D]'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${e.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      ),
    },
    {
      key: 'actions', title: '操作', width: '80px',
      render: (e: VulnEntry) => (
        <Button variant="ghost" size="sm" onClick={(ev) => { ev.stopPropagation(); setSelectedEntry(e); }}>
          <Eye className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            漏洞库维护
          </h1>
          <p className="text-slate-400 mt-1 text-sm">CVE/NVD/CNVD/CNNVD 多源同步，自定义规则管理，关联情报</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setActiveTab('sync')}>
            <RefreshCw className="w-4 h-4 mr-1" />同步任务
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-1" />新增规则
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="漏洞库总数" value={`${(total * 32000).toLocaleString()}`} color="text-slate-50" icon={Database} sub="含 NVD/CNVD/CNNVD" />
        <KPI label="严重漏洞" value={critical} color="text-red-400" icon={AlertTriangle} sub="占当前展示" />
        <KPI label="EXP 可用" value={exploit} color="text-orange-400" icon={Zap} sub="需优先关注" />
        <KPI label="自定义规则" value={custom} color="text-cyan-400" icon={FileText} sub="企业专属" />
      </div>

      {/* Tab 切换 */}
      <div className="border-b border-[#2A354D] flex items-center gap-1">
        <button
          onClick={() => setActiveTab('entries')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'entries' ? 'border-[#0066FF] text-blue-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Bug className="w-4 h-4 inline-block mr-1.5" />漏洞条目
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sync' ? 'border-[#0066FF] text-blue-400' : 'border-transparent text-slate-400'
          }`}
        >
          <RefreshCw className="w-4 h-4 inline-block mr-1.5" />同步任务
        </button>
      </div>

      {activeTab === 'entries' ? (
        <ListPage<VulnEntry>
          searchPlaceholder="搜索 CVE/CNVD/名称/厂商..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              key: 'level', label: '等级',
              options: [
                { value: 'critical', label: '严重' },
                { value: 'high', label: '高危' },
                { value: 'medium', label: '中危' },
                { value: 'low', label: '低危' },
              ],
            },
            {
              key: 'source', label: '来源',
              options: [
                { value: 'NVD', label: 'NVD' },
                { value: 'CNVD', label: 'CNVD' },
                { value: 'CNNVD', label: 'CNNVD' },
                { value: 'Custom', label: '自定义' },
              ],
            },
          ]}
          filterValues={{ level: levelFilter, source: sourceFilter }}
          onFilterChange={(k, v) => {
            if (k === 'level') setLevelFilter(v);
            if (k === 'source') setSourceFilter(v);
          }}
          data={filtered}
          columns={columns}
          rowKey="id"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          bulkActions={[
            { key: 'enable', label: '批量启用', onClick: (ids) => setEntries((p) => p.map((e) => ids.includes(e.id) ? { ...e, enabled: true } : e)) },
            { key: 'disable', label: '批量停用', onClick: (ids) => setEntries((p) => p.map((e) => ids.includes(e.id) ? { ...e, enabled: false } : e)) },
            { key: 'export', label: '导出', onClick: (ids) => console.log('export', ids) },
            { key: 'delete', label: '删除', danger: true, onClick: (ids) => setEntries((p) => p.filter((e) => !ids.includes(e.id))) },
          ]}
          renderDetail={(e) => (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-100">{e.name}</h3>
                <p className="text-xs text-slate-500 mt-1">ID: {e.id} · 来源: {sourceConfig[e.source].label}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={levelBadgeMap[e.level].status} />
                {e.exploitAvailable && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />EXP 可用
                  </span>
                )}
                {e.patchAvailable && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">补丁可用</span>
                )}
              </div>

              <p className="text-sm text-slate-300">{e.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <Field label="CVSS 评分" value={e.cvss > 0 ? e.cvss.toFixed(1) : '-'} />
                <Field label="受影响产品" value={`${e.vendor} / ${e.product}`} />
                <Field label="漏洞分类" value={e.category} />
                <Field label="发布日期" value={e.publishDate} />
                <Field label="更新日期" value={e.updateDate} />
                <Field label="引用数量" value={String(e.references)} />
              </div>

              {e.tags.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">标签</p>
                  <div className="flex flex-wrap gap-1.5">
                    {e.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#111625] text-slate-300 border border-[#2A354D]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2A354D]">
                <Button variant="secondary" onClick={() => setSelectedEntry(null)}>关闭</Button>
                <Button variant="primary">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />查看详情
                </Button>
              </div>
            </div>
          )}
        />
      ) : (
        <SyncTaskList
          tasks={syncTasks}
          onTrigger={triggerSync}
        />
      )}
    </div>
  );
}

function SyncTaskList({ tasks, onTrigger }: { tasks: SyncTask[]; onTrigger: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((t) => (
        <Card key={t.id}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sourceConfig[t.source].color}`}>
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">{sourceConfig[t.source].label} 同步任务</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{t.id}</p>
              </div>
            </div>
            <StatusBadge status={syncStatusBadgeMap[t.status].status} />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <Field label="总条数" value={t.totalCount.toLocaleString()} />
            <Field label="今日新增" value={String(t.newCount)} />
            <Field label="上次同步" value={t.lastSync} />
            <Field label="下次同步" value={t.nextSync} />
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-[#2A354D]">
            <Button
              variant="primary"
              size="sm"
              disabled={t.status === 'syncing'}
              onClick={() => onTrigger(t.id)}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${t.status === 'syncing' ? 'animate-spin' : ''}`} />
              {t.status === 'syncing' ? '同步中...' : '立即同步'}
            </Button>
            <Button variant="ghost" size="sm">
              <Edit3 className="w-3.5 h-3.5 mr-1" />配置
            </Button>
            <Button variant="ghost" size="sm">
              <Activity className="w-3.5 h-3.5 mr-1" />历史
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub }: { label: string; value: number | string; color: string; icon: any; sub?: string }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 bg-[#111625] rounded">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5 break-all">{value}</p>
    </div>
  );
}

export default VulnDatabase;

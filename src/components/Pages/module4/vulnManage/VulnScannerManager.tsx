'use client';

import React, { useState, useMemo } from 'react';
import {
  Settings, Plus, RefreshCw, Download, Play, Pause, Edit3, Trash2,
  Activity, CheckCircle2, XCircle, Server, Wifi, Cloud, Database,
  Cpu, HardDrive, Network, Shield, Zap, Globe, Layers,
  Server as ServerIcon, Eye, Power,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { ListPage } from '@/components/Common/ListPage';
import type { LucideIcon } from 'lucide-react';

/**
 * 4.6-2 漏洞扫描工具管理
 *
 * 7 类型扫描器 × 4 状态 × 5 调度策略
 * - 搜索/筛选/批量启停
 * - 详情抽屉（凭证/调度/资源监控）
 * - 启用/禁用真实状态切换
 */

type ScannerType = 'host' | 'web' | 'database' | 'cloud' | 'iot' | 'container' | 'wireless';
type ScannerStatus = 'online' | 'offline' | 'scanning' | 'error';

interface Scanner {
  id: string;
  name: string;
  type: ScannerType;
  vendor: string;
  version: string;
  host: string;
  port: number;
  status: ScannerStatus;
  cpu: number;
  memory: number;
  lastScan: string;
  lastVulnCount: number;
  schedule: 'daily' | 'weekly' | 'monthly' | 'once' | 'none';
  enabled: boolean;
  description: string;
  credentials: { type: string; account: string }[];
}

const INITIAL_SCANNERS: Scanner[] = [
  { id: 'SC-001', name: 'Nessus 企业版', type: 'host', vendor: 'Tenable', version: '10.7.2', host: '10.1.10.50', port: 8834, status: 'scanning', cpu: 67, memory: 78, lastScan: '2026-06-02 14:00', lastVulnCount: 89, schedule: 'weekly', enabled: true, description: '企业级漏洞扫描器，覆盖全网主机', credentials: [{ type: 'SSH', account: 'nessus_svc' }] },
  { id: 'SC-002', name: 'AWVS Web 扫描', type: 'web', vendor: 'Acunetix', version: '24.3.24', host: '10.1.10.51', port: 3443, status: 'online', cpu: 23, memory: 45, lastScan: '2026-06-02 12:00', lastVulnCount: 124, schedule: 'daily', enabled: true, description: 'Web 应用漏洞扫描', credentials: [{ type: 'API Key', account: 'awvs_api' }] },
  { id: 'SC-003', name: 'Qualys VMDR', type: 'host', vendor: 'Qualys', version: 'Cloud', host: 'cloud.qualys.com', port: 443, status: 'online', cpu: 0, memory: 0, lastScan: '2026-06-02 16:00', lastVulnCount: 234, schedule: 'daily', enabled: true, description: '云端扫描服务', credentials: [{ type: 'OAuth', account: 'qualys_oauth' }] },
  { id: 'SC-004', name: 'SQLmap 专项', type: 'database', vendor: 'Open Source', version: '1.8.4', host: '10.1.10.52', port: 0, status: 'scanning', cpu: 89, memory: 56, lastScan: '2026-06-02 13:30', lastVulnCount: 18, schedule: 'monthly', enabled: true, description: 'SQL 注入专项检测', credentials: [{ type: 'SSH', account: 'sqlmap_svc' }] },
  { id: 'SC-005', name: 'Trivy 容器扫描', type: 'container', vendor: 'Aqua Security', version: '0.50.1', host: '10.1.10.53', port: 0, status: 'online', cpu: 12, memory: 23, lastScan: '2026-06-02 15:00', lastVulnCount: 67, schedule: 'daily', enabled: true, description: '容器镜像安全扫描', credentials: [{ type: 'K8s Token', account: 'trivy_sa' }] },
  { id: 'SC-006', name: 'AWS Inspector', type: 'cloud', vendor: 'Amazon', version: 'Cloud', host: 'aws.amazon.com/inspector', port: 443, status: 'online', cpu: 0, memory: 0, lastScan: '2026-06-02 16:30', lastVulnCount: 45, schedule: 'daily', enabled: true, description: 'AWS 云资产漏洞评估', credentials: [{ type: 'IAM Role', account: 'inspector_role' }] },
  { id: 'SC-007', name: 'OpenVAS', type: 'host', vendor: 'Greenbone', version: '22.7', host: '10.1.10.54', port: 9390, status: 'offline', cpu: 0, memory: 0, lastScan: '2026-05-30 18:00', lastVulnCount: 78, schedule: 'weekly', enabled: false, description: '开源漏洞扫描器（已停用）', credentials: [{ type: 'SSH', account: 'openvas_svc' }] },
  { id: 'SC-008', name: 'Kismet 无线扫描', type: 'wireless', vendor: 'Open Source', version: '2023-07-R1', host: '10.1.10.55', port: 0, status: 'error', cpu: 0, memory: 0, lastScan: '2026-05-28 10:00', lastVulnCount: 12, schedule: 'monthly', enabled: true, description: '无线网络安全审计', credentials: [{ type: 'SSH', account: 'kismet_svc' }] },
  { id: 'SC-009', name: 'IoT 专用扫描器', type: 'iot', vendor: 'ForeScout', version: '8.4', host: '10.1.10.56', port: 8443, status: 'online', cpu: 8, memory: 15, lastScan: '2026-06-02 14:30', lastVulnCount: 32, schedule: 'daily', enabled: true, description: 'IoT 设备资产发现与漏洞扫描', credentials: [{ type: 'HTTPS', account: 'forescout_admin' }] },
  { id: 'SC-010', name: 'Nuclei 模板扫描', type: 'web', vendor: 'Open Source', version: '3.1.0', host: '10.1.10.57', port: 0, status: 'online', cpu: 5, memory: 12, lastScan: '2026-06-02 17:00', lastVulnCount: 28, schedule: 'daily', enabled: true, description: '基于 Nuclei 模板的快速扫描', credentials: [{ type: 'SSH', account: 'nuclei_svc' }] },
];

const typeConfig: Record<ScannerType, { label: string; color: string; icon: LucideIcon }> = {
  host: { label: '主机', color: 'text-blue-400 bg-blue-500/10', icon: Server },
  web: { label: 'Web', color: 'text-purple-400 bg-purple-500/10', icon: Globe },
  database: { label: '数据库', color: 'text-orange-400 bg-orange-500/10', icon: Database },
  cloud: { label: '云', color: 'text-cyan-400 bg-cyan-500/10', icon: Cloud },
  iot: { label: 'IoT', color: 'text-pink-400 bg-pink-500/10', icon: Wifi },
  container: { label: '容器', color: 'text-green-400 bg-green-500/10', icon: Layers },
  wireless: { label: '无线', color: 'text-red-400 bg-red-500/10', icon: Wifi },
};

const statusBadgeMap: Record<ScannerStatus, { status: any; text: string }> = {
  online: { status: 'success', text: '在线' },
  scanning: { status: 'running', text: '扫描中' },
  offline: { status: 'info', text: '离线' },
  error: { status: 'failed', text: '异常' },
};

const scheduleLabels: Record<string, string> = {
  daily: '每日',
  weekly: '每周',
  monthly: '每月',
  once: '一次性',
  none: '未调度',
};

export function VulnScannerManager() {
  const [scanners, setScanners] = useState<Scanner[]>(INITIAL_SCANNERS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedScanner, setSelectedScanner] = useState<Scanner | null>(null);

  // 启用/禁用切换
  const toggleEnabled = (id: string) =>
    setScanners((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));

  const filtered = useMemo(() => {
    return scanners.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.host.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter && s.type !== typeFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });
  }, [scanners, search, typeFilter, statusFilter]);

  // KPI
  const total = scanners.length;
  const online = scanners.filter((s) => s.status === 'online' || s.status === 'scanning').length;
  const scanning = scanners.filter((s) => s.status === 'scanning').length;
  const errors = scanners.filter((s) => s.status === 'error' || s.status === 'offline').length;

  const columns = [
    {
      key: 'id', title: 'ID', width: '90px',
      render: (s: Scanner) => <span className="font-mono text-xs text-blue-400">{s.id}</span>,
    },
    {
      key: 'name', title: '名称', width: '200px',
      render: (s: Scanner) => {
        const TIcon = typeConfig[s.type].icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded flex items-center justify-center ${typeConfig[s.type].color}`}>
              <TIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-sm text-slate-100">{s.name}</div>
              <div className="text-[10px] text-slate-500">{s.vendor} · v{s.version}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'type', title: '类型', width: '90px',
      render: (s: Scanner) => <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeConfig[s.type].color}`}>{typeConfig[s.type].label}</span>,
    },
    {
      key: 'host', title: '地址', width: '180px',
      render: (s: Scanner) => <span className="font-mono text-xs text-slate-300">{s.host}{s.port ? `:${s.port}` : ''}</span>,
    },
    {
      key: 'status', title: '状态', width: '90px',
      render: (s: Scanner) => <StatusBadge status={statusBadgeMap[s.status].status} />,
    },
    {
      key: 'cpu', title: 'CPU/内存', width: '120px',
      render: (s: Scanner) => s.cpu > 0 ? (
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-300">{s.cpu}%</span>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-300">{s.memory}%</span>
        </div>
      ) : <span className="text-xs text-slate-500">-</span>,
    },
    {
      key: 'lastVulnCount', title: '上次漏洞数', width: '100px',
      render: (s: Scanner) => <span className="text-sm text-slate-200 font-medium">{s.lastVulnCount}</span>,
    },
    {
      key: 'schedule', title: '调度', width: '80px',
      render: (s: Scanner) => <span className="text-xs text-slate-400">{scheduleLabels[s.schedule]}</span>,
    },
    {
      key: 'enabled', title: '启用', width: '70px',
      render: (s: Scanner) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggleEnabled(s.id); }}
          className={`w-9 h-5 rounded-full transition-colors ${s.enabled ? 'bg-green-500' : 'bg-[#2A354D]'}`}
          aria-label={s.enabled ? '已启用' : '已停用'}
        >
          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${s.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      ),
    },
    {
      key: 'actions', title: '操作', width: '120px',
      render: (s: Scanner) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => setSelectedScanner(s)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit3 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            漏洞扫描工具管理
          </h1>
          <p className="text-slate-400 mt-1 text-sm">管理多类型漏洞扫描器，注册、配置、调度、监控一站式管理</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-1" />新增扫描器
          </Button>
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4 mr-1" />健康检查
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-1" />导出
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="扫描器总数" value={total} color="text-slate-50" icon={Settings} />
        <KPI label="在线" value={online} color="text-green-400" icon={CheckCircle2} sub="包含扫描中" />
        <KPI label="扫描中" value={scanning} color="text-blue-400" icon={Activity} sub="实时执行" />
        <KPI label="异常/离线" value={errors} color="text-red-400" icon={XCircle} sub="需处理" />
      </div>

      <ListPage<Scanner>
        searchPlaceholder="搜索名称或主机..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'type', label: '类型',
            options: (Object.keys(typeConfig) as ScannerType[]).map((t) => ({ value: t, label: typeConfig[t].label })),
          },
          {
            key: 'status', label: '状态',
            options: [
              { value: 'online', label: '在线' },
              { value: 'scanning', label: '扫描中' },
              { value: 'offline', label: '离线' },
              { value: 'error', label: '异常' },
            ],
          },
        ]}
        filterValues={{ type: typeFilter, status: statusFilter }}
        onFilterChange={(k, v) => {
          if (k === 'type') setTypeFilter(v);
          if (k === 'status') setStatusFilter(v);
        }}
        data={filtered}
        columns={columns}
        rowKey="id"
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={[
          { key: 'enable', label: '批量启用', icon: <Power className="w-3.5 h-3.5" />, onClick: (ids) => setScanners((p) => p.map((s) => ids.includes(s.id) ? { ...s, enabled: true } : s)) },
          { key: 'disable', label: '批量停用', icon: <Power className="w-3.5 h-3.5" />, onClick: (ids) => setScanners((p) => p.map((s) => ids.includes(s.id) ? { ...s, enabled: false } : s)) },
          { key: 'scan', label: '立即扫描', icon: <Play className="w-3.5 h-3.5" />, onClick: (ids) => console.log('scan', ids) },
          { key: 'delete', label: '删除', icon: <Trash2 className="w-3.5 h-3.5" />, danger: true, onClick: (ids) => setScanners((p) => p.filter((s) => !ids.includes(s.id))) },
        ]}
        renderDetail={(s) => (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeConfig[s.type].color}`}>
                {(() => { const I = typeConfig[s.type].icon; return <I className="w-6 h-6" />; })()}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-100">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{s.vendor} · v{s.version} · ID: {s.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={statusBadgeMap[s.status].status} />
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeConfig[s.type].color}`}>{typeConfig[s.type].label}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400">{s.description}</p>

            <div className="grid grid-cols-2 gap-3">
              <Field label="主机地址" value={`${s.host}${s.port ? `:${s.port}` : ''}`} />
              <Field label="调度策略" value={scheduleLabels[s.schedule]} />
              <Field label="上次扫描" value={s.lastScan} />
              <Field label="上次漏洞数" value={String(s.lastVulnCount)} />
              <Field label="CPU 使用" value={s.cpu > 0 ? `${s.cpu}%` : '云端无指标'} />
              <Field label="内存使用" value={s.memory > 0 ? `${s.memory}%` : '云端无指标'} />
            </div>

            <Card>
              <h4 className="text-sm font-medium text-slate-200 mb-3">凭证管理</h4>
              <div className="space-y-2">
                {s.credentials.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#111625] rounded">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs text-slate-400 flex-1">{c.type}</span>
                    <span className="text-sm text-slate-200 font-mono">{c.account}</span>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#2A354D]">
              <Button variant="secondary" onClick={() => setSelectedScanner(null)}>关闭</Button>
              <Button variant="primary">
                <Play className="w-3.5 h-3.5 mr-1" />立即扫描
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub }: { label: string; value: number; color: string; icon: LucideIcon; sub?: string }) {
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
    <div className="p-2.5 bg-[#111625] rounded-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5 break-all">{value}</p>
    </div>
  );
}

export default VulnScannerManager;

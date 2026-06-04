'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Download, RefreshCw, Plus, Play, Pause, Square, RotateCcw,
  Mail, Globe, Monitor, Server, Shield, Inbox,
  Activity, CheckCircle2, Zap,
  Settings, Trash2, Edit3, Eye, Filter, Database, FileText,
  ArrowUpDown, Hash, Send,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { ListPage } from '@/components/Common/ListPage';
import type { LucideIcon } from 'lucide-react';

/**
 * 3-6-2 多渠道样本获取
 *
 * 7 大采集渠道 × 4 状态：
 *   - 邮件附件采集（IMAP/POP3 邮件服务器自动拉取）
 *   - Web 下载样本（URL 链接 / Web 爬虫）
 *   - 端点 EDR 收集（EDR Agent 上报）
 *   - 邮件网关拦截（反垃圾邮件网关日志）
 *   - 沙箱投递（沙箱动态运行产出）
 *   - 蜜罐捕获（蜜罐系统产出）
 *   - 用户手动上报（安全运营人员提交）
 *
 * 业务能力：
 *   - 渠道配置（服务器 / 协议 / 调度 / 容量）
 *   - 实时采集（KPI：今日数/成功率/队列/延迟）
 *   - 过滤规则（白/黑名单 / 哈希去重 / 大小限制）
 *   - 批量启停 / 立即采集 / 详情抽屉
 *   - setInterval 模拟实时采集进度
 */

type ChannelType = 'email' | 'web' | 'endpoint' | 'gateway' | 'sandbox' | 'honeypot' | 'manual';
type ChannelStatus = 'running' | 'paused' | 'failed' | 'pending';
type SampleType = 'PE' | 'ELF' | 'PDF' | 'Office' | 'Script' | 'Archive' | 'Image' | 'Other';

interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  status: ChannelStatus;
  endpoint: string;
  protocol: string;
  schedule: string;
  capacity: number;
  todayCount: number;
  successRate: number;
  queueLength: number;
  avgLatency: number;
  enabled: boolean;
  description: string;
  lastTrigger: string;
  filterRules: { type: string; value: string; enabled: boolean }[];
  recentSamples: { hash: string; name: string; type: SampleType; size: number; source: string; risk: 'low' | 'medium' | 'high' | 'critical' }[];
}

const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'CH-001', name: '邮件附件实时采集', type: 'email', status: 'running', endpoint: 'imap.corp.example.com:993', protocol: 'IMAP/S',
    schedule: '实时轮询 (5s)', capacity: 1000, todayCount: 234, successRate: 98.2, queueLength: 3, avgLatency: 1.2, enabled: true,
    description: '从企业邮箱服务器拉取外部可疑邮件附件，自动提取样本并提交分析',
    lastTrigger: '2026-06-02 14:32:18',
    filterRules: [
      { type: '白名单域名', value: '@corp.example.com', enabled: false },
      { type: '黑名单域名', value: '*.spam.com,*.phishing.com', enabled: true },
      { type: '文件大小', value: '100KB ~ 50MB', enabled: true },
      { type: '哈希去重', value: 'SHA256', enabled: true },
    ],
    recentSamples: [
      { hash: 'a3f5c8e9d2b1f4a7', name: 'invoice_0630.docm', type: 'Office', size: 256000, source: 'phishing@vendor.cn', risk: 'high' },
      { hash: 'b7d9e2f1a4c8b3e6', name: 'payment.zip', type: 'Archive', size: 1234567, source: 'billing@partner.com', risk: 'medium' },
      { hash: 'c1a3d8e5b9f2a4c7', name: 'resume.pdf', type: 'PDF', size: 456000, source: 'hr@external.io', risk: 'low' },
    ],
  },
  {
    id: 'CH-002', name: 'Web URL 样本下载', type: 'web', status: 'running', endpoint: 'https://api.intel.example.com/url-scan', protocol: 'HTTPS/REST',
    schedule: '定时 (每 30s)', capacity: 500, todayCount: 87, successRate: 92.5, queueLength: 8, avgLatency: 12.4, enabled: true,
    description: '从威胁情报平台拉取高危 URL，模拟访问下载样本文件',
    lastTrigger: '2026-06-02 14:32:01',
    filterRules: [
      { type: 'URL 信誉', value: '恶意 + 疑似', enabled: true },
      { type: '文件类型', value: 'PE/ELF/PDF/Office', enabled: true },
      { type: '黑名单 TLD', value: '.tk, .top, .xyz', enabled: true },
    ],
    recentSamples: [
      { hash: 'd4e8b2c1f7a5d9e3', name: 'mirai_elf.bin', type: 'ELF', size: 124567, source: 'http://malware-host.tk/bot', risk: 'critical' },
      { hash: 'e9b3a7d4c2f8e1a5', name: 'evil.exe', type: 'PE', size: 856000, source: 'https://phish.com/payload', risk: 'high' },
    ],
  },
  {
    id: 'CH-003', name: 'EDR 端点样本上报', type: 'endpoint', status: 'running', endpoint: 'grpc://edr-cluster:50051', protocol: 'gRPC/Protobuf',
    schedule: '实时推送', capacity: 5000, todayCount: 1234, successRate: 99.7, queueLength: 0, avgLatency: 0.3, enabled: true,
    description: '企业 EDR Agent 检测到可疑文件后自动推送样本到中心',
    lastTrigger: '2026-06-02 14:32:25',
    filterRules: [
      { type: '可疑行为', value: '未知进程 + 网络外联', enabled: true },
      { type: '高危 API', value: 'VirtualAlloc, WriteProcessMemory', enabled: true },
      { type: '熵值阈值', value: '> 7.0 (疑似加壳)', enabled: true },
    ],
    recentSamples: [
      { hash: 'f1c5b9e3a7d4c2f8', name: 'crypt_miner.exe', type: 'PE', size: 2456789, source: 'HOST-WS-0231', risk: 'high' },
      { hash: 'a2b6c3d8e5f1a4b9', name: 'unknown.dll', type: 'PE', size: 234567, source: 'HOST-SRV-0045', risk: 'medium' },
    ],
  },
  {
    id: 'CH-004', name: '邮件网关拦截日志', type: 'gateway', status: 'running', endpoint: 'syslog://gateway.corp.example.com:514', protocol: 'Syslog',
    schedule: '实时推送', capacity: 3000, todayCount: 567, successRate: 97.8, queueLength: 1, avgLatency: 0.8, enabled: true,
    description: '从邮件安全网关拉取被拦截的恶意邮件样本',
    lastTrigger: '2026-06-02 14:32:22',
    filterRules: [
      { type: '拦截类型', value: '病毒/钓鱼/垃圾', enabled: true },
      { type: '置信度', value: '>= 80%', enabled: true },
    ],
    recentSamples: [
      { hash: 'b3c7d4a1e8f5a2c9', name: 'attached_zip_attachment.zip', type: 'Archive', size: 567890, source: 'postmaster@external.cn', risk: 'high' },
    ],
  },
  {
    id: 'CH-005', name: '动态沙箱产出样本', type: 'sandbox', status: 'paused', endpoint: 'cuckoo://sandbox-cluster:8000', protocol: 'Cuckoo API',
    schedule: '自动产出', capacity: 200, todayCount: 23, successRate: 85.0, queueLength: 12, avgLatency: 300.0, enabled: true,
    description: '沙箱动态运行后产出的样本（注入文件、内存转储等）',
    lastTrigger: '2026-06-02 14:25:10',
    filterRules: [
      { type: '行为评分', value: '>= 70', enabled: true },
      { type: '网络外联', value: '已观察到 C&C', enabled: true },
    ],
    recentSamples: [],
  },
  {
    id: 'CH-006', name: '蜜罐系统捕获', type: 'honeypot', status: 'running', endpoint: 'kafka://honeypot-cluster:9092', protocol: 'Kafka',
    schedule: '实时推送', capacity: 1500, todayCount: 78, successRate: 100.0, queueLength: 0, avgLatency: 0.5, enabled: true,
    description: '从蜜罐系统拉取攻击者投递的样本（Web 蜜罐/邮件蜜罐/服务蜜罐）',
    lastTrigger: '2026-06-02 14:32:15',
    filterRules: [
      { type: '攻击类型', value: 'WebShell/Exploit/Backdoor', enabled: true },
    ],
    recentSamples: [
      { hash: 'c4d8e5b2a7f1c3d9', name: 'webshell.php', type: 'Script', size: 4567, source: 'Cowrie-SSH-Honeypot', risk: 'critical' },
    ],
  },
  {
    id: 'CH-007', name: '安全运营人员上报', type: 'manual', status: 'pending', endpoint: 'https://upload.corp.example.com/manual', protocol: 'Web UI',
    schedule: '手动触发', capacity: 100, todayCount: 12, successRate: 100.0, queueLength: 0, avgLatency: 0.0, enabled: true,
    description: '安全运营人员通过 Web 界面手动提交可疑样本',
    lastTrigger: '2026-06-02 11:30:42',
    filterRules: [
      { type: '文件类型', value: '任意', enabled: true },
    ],
    recentSamples: [
      { hash: 'd5e9f6c3a8b2d4e1', name: 'suspect_payload.bin', type: 'Other', size: 234567, source: 'analyst@corp.example.com', risk: 'medium' },
    ],
  },
  {
    id: 'CH-008', name: '第三方威胁情报源', type: 'web', status: 'failed', endpoint: 'https://ti-vendor.example.com/api/v2', protocol: 'HTTPS/REST',
    schedule: '定时 (每 1h)', capacity: 800, todayCount: 0, successRate: 0.0, queueLength: 0, avgLatency: 0.0, enabled: false,
    description: '从第三方威胁情报供应商获取高质量样本（已停用，API key 失效）',
    lastTrigger: '2026-05-28 10:00:00',
    filterRules: [],
    recentSamples: [],
  },
];

const channelTypeConfig: Record<ChannelType, { label: string; color: string; icon: LucideIcon }> = {
  email: { label: '邮件采集', color: 'text-blue-400 bg-blue-500/10', icon: Mail },
  web: { label: 'Web 下载', color: 'text-purple-400 bg-purple-500/10', icon: Globe },
  endpoint: { label: '端点 EDR', color: 'text-green-400 bg-green-500/10', icon: Monitor },
  gateway: { label: '邮件网关', color: 'text-cyan-400 bg-cyan-500/10', icon: Inbox },
  sandbox: { label: '动态沙箱', color: 'text-orange-400 bg-orange-500/10', icon: Server },
  honeypot: { label: '蜜罐捕获', color: 'text-red-400 bg-red-500/10', icon: Shield },
  manual: { label: '人工上报', color: 'text-yellow-400 bg-yellow-500/10', icon: Send },
};

const statusBadgeMap: Record<ChannelStatus, { status: any; text: string }> = {
  running: { status: 'running', text: '采集中' },
  paused: { status: 'warning', text: '已暂停' },
  failed: { status: 'failed', text: '故障' },
  pending: { status: 'pending', text: '待启动' },
};

const riskBadgeMap: Record<'low' | 'medium' | 'high' | 'critical', { status: any; text: string }> = {
  low: { status: 'info', text: '低危' },
  medium: { status: 'info', text: '中危' },
  high: { status: 'warning', text: '高危' },
  critical: { status: 'failed', text: '严重' },
};

const sampleTypeConfig: Record<SampleType, { label: string; color: string }> = {
  PE: { label: 'PE', color: 'text-blue-400' },
  ELF: { label: 'ELF', color: 'text-purple-400' },
  PDF: { label: 'PDF', color: 'text-red-400' },
  Office: { label: 'Office', color: 'text-orange-400' },
  Script: { label: 'Script', color: 'text-yellow-400' },
  Archive: { label: 'Archive', color: 'text-cyan-400' },
  Image: { label: 'Image', color: 'text-green-400' },
  Other: { label: 'Other', color: 'text-slate-400' },
};

export function MultiChannelSampleAcquisition() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [recentSamples, setRecentSamples] = useState<{ hash: string; name: string; type: SampleType; size: number; source: string; risk: 'low' | 'medium' | 'high' | 'critical'; channel: string; time: string }[]>([]);

  // setInterval 模拟实时采集
  useEffect(() => {
    const timer = setInterval(() => {
      setChannels((prev) => prev.map((c) => {
        if (c.status !== 'running') return c;
        const newCount = c.todayCount + Math.floor(Math.random() * 3);
        return { ...c, todayCount: newCount, lastTrigger: new Date().toISOString().slice(0, 19).replace('T', ' ') };
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 实时生成样本流
  useEffect(() => {
    const sources = [
      { name: 'doc_attachment.docm', type: 'Office' as SampleType, size: 234567, source: 'sender@external.cn', risk: 'high' as const },
      { name: 'malware_loader.exe', type: 'PE' as SampleType, size: 567890, source: 'http://phish.tk/load', risk: 'critical' as const },
      { name: 'invoice_0630.pdf', type: 'PDF' as SampleType, size: 123000, source: 'billing@vendor.com', risk: 'medium' as const },
      { name: 'suspicious.sh', type: 'Script' as SampleType, size: 1234, source: 'HOST-LNX-0023', risk: 'high' as const },
      { name: 'data_dump.zip', type: 'Archive' as SampleType, size: 2345678, source: 'partner@external.io', risk: 'medium' as const },
    ];
    const channelNames = ['邮件采集', 'Web 下载', 'EDR 上报', '网关拦截', '蜜罐捕获'];
    const initial = Array.from({ length: 8 }).map((_, i) => {
      const s = sources[i % sources.length];
      return { ...s, hash: Math.random().toString(36).substring(2, 18), channel: channelNames[i % channelNames.length], time: new Date(Date.now() - i * 60000).toISOString().slice(0, 19).replace('T', ' ') };
    });
    setRecentSamples(initial);

    const sampleTimer = setInterval(() => {
      const s = sources[Math.floor(Math.random() * sources.length)];
      setRecentSamples((prev) => [
        { ...s, hash: Math.random().toString(36).substring(2, 18), channel: channelNames[Math.floor(Math.random() * channelNames.length)], time: new Date().toISOString().slice(0, 19).replace('T', ' ') },
        ...prev.slice(0, 9),
      ]);
    }, 7000);
    return () => clearInterval(sampleTimer);
  }, []);

  // 渠道控制
  const handlePause = (id: string) => setChannels((prev) => prev.map((c) => c.id === id ? { ...c, status: 'paused' as ChannelStatus } : c));
  const handleResume = (id: string) => setChannels((prev) => prev.map((c) => c.id === id ? { ...c, status: 'running' as ChannelStatus } : c));
  const handleRetry = (id: string) => setChannels((prev) => prev.map((c) => c.id === id ? { ...c, status: 'running' as ChannelStatus, successRate: 95.0 } : c));
  const handleTrigger = (id: string) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, todayCount: c.todayCount + 1, lastTrigger: new Date().toISOString().slice(0, 19).replace('T', ' ') } : c));
  };

  // 过滤
  const filtered = useMemo(() => {
    return channels.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.endpoint.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter && c.type !== typeFilter) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [channels, search, typeFilter, statusFilter]);

  // KPI
  const total = channels.length;
  const running = channels.filter((c) => c.status === 'running').length;
  const todayTotal = channels.reduce((sum, c) => sum + c.todayCount, 0);
  const avgSuccess = total > 0 ? (channels.reduce((sum, c) => sum + c.successRate, 0) / total).toFixed(1) : 0;

  const columns = [
    {
      key: 'id', title: 'ID', width: '80px',
      render: (c: Channel) => <span className="font-mono text-xs text-blue-400">{c.id}</span>,
    },
    {
      key: 'name', title: '渠道名称', width: '220px',
      render: (c: Channel) => {
        const TypeIcon = channelTypeConfig[c.type].icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center ${channelTypeConfig[c.type].color}`}>
              <TypeIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm text-slate-100">{c.name}</div>
              <div className={`text-[10px] mt-0.5 inline-block px-1.5 py-0 rounded ${channelTypeConfig[c.type].color}`}>
                {channelTypeConfig[c.type].label}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'endpoint', title: '接入点', width: '220px',
      render: (c: Channel) => (
        <div>
          <div className="font-mono text-[11px] text-slate-300">{c.endpoint}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{c.protocol}</div>
        </div>
      ),
    },
    {
      key: 'status', title: '状态', width: '90px',
      render: (c: Channel) => <StatusBadge status={statusBadgeMap[c.status].status} />,
    },
    {
      key: 'todayCount', title: '今日采集', width: '90px',
      render: (c: Channel) => <span className="text-base font-semibold text-blue-400">{c.todayCount}</span>,
    },
    {
      key: 'successRate', title: '成功率', width: '80px',
      render: (c: Channel) => (
        <span className={`text-sm font-medium ${
          c.successRate >= 95 ? 'text-green-400' :
          c.successRate >= 80 ? 'text-yellow-400' :
          c.successRate > 0 ? 'text-red-400' : 'text-slate-500'
        }`}>{c.successRate > 0 ? `${c.successRate}%` : '-'}</span>
      ),
    },
    {
      key: 'queueLength', title: '队列', width: '60px',
      render: (c: Channel) => (
        <span className={`text-sm ${c.queueLength > 10 ? 'text-red-400' : c.queueLength > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
          {c.queueLength}
        </span>
      ),
    },
    {
      key: 'avgLatency', title: '平均延迟', width: '90px',
      render: (c: Channel) => <span className="text-xs text-slate-400">{c.avgLatency > 0 ? `${c.avgLatency}s` : '-'}</span>,
    },
    {
      key: 'schedule', title: '调度', width: '120px',
      render: (c: Channel) => <span className="text-xs text-slate-400">{c.schedule}</span>,
    },
    {
      key: 'actions', title: '操作', width: '120px',
      render: (c: Channel) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {c.status === 'running' && (
            <Button variant="ghost" size="sm" onClick={() => handlePause(c.id)}>
              <Pause className="w-3.5 h-3.5" />
            </Button>
          )}
          {c.status === 'paused' && (
            <Button variant="ghost" size="sm" onClick={() => handleResume(c.id)}>
              <Play className="w-3.5 h-3.5" />
            </Button>
          )}
          {c.status === 'failed' && (
            <Button variant="ghost" size="sm" onClick={() => handleRetry(c.id)}>
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleTrigger(c.id)}>
            <Zap className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedChannel(c)}>
            <Eye className="w-3.5 h-3.5" />
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
            <ArrowUpDown className="w-6 h-6 text-blue-400" />
            多渠道样本获取
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            统一管理 7 大样本采集渠道，{running} 个运行中 · 今日共采集 {todayTotal.toLocaleString()} 个样本 · 平均成功率 {avgSuccess}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4 mr-1" />刷新状态
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-1" />导出报告
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-1" />新增渠道
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="渠道总数" value={total} color="text-slate-50" icon={Settings} sub="7 类自动 + 1 类手动" />
        <KPI label="运行中" value={running} color="text-green-400" icon={Activity} sub="实时采集" />
        <KPI label="今日采集总数" value={todayTotal.toLocaleString()} color="text-blue-400" icon={Database} sub="跨所有渠道" />
        <KPI label="平均成功率" value={`${avgSuccess}%`} color="text-cyan-400" icon={CheckCircle2} sub="质量评估" />
      </div>

      {/* 渠道类型分布 */}
      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3">渠道类型分布（今日采集）</h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {(Object.keys(channelTypeConfig) as ChannelType[]).map((t) => {
            const cfg = channelTypeConfig[t];
            const Icon = cfg.icon;
            const count = channels.filter((c) => c.type === t).reduce((sum, c) => sum + c.todayCount, 0);
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  typeFilter === t ? 'bg-[#0066FF]/20 border border-[#0066FF]/50' : 'bg-[#111625] border border-transparent hover:border-[#2A354D]'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${cfg.color} mb-1`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`text-lg font-bold ${cfg.color.split(' ')[0]}`}>{count}</div>
                <div className="text-[10px] text-slate-500">{cfg.label}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 实时样本流 */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            实时样本流
            <span className="text-[10px] text-slate-500">（每 7 秒更新）</span>
          </h3>
          <span className="flex items-center gap-1.5 text-[10px] text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            实时采集中
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A354D] text-slate-500">
                <th className="text-left py-2 px-2 font-medium">时间</th>
                <th className="text-left py-2 px-2 font-medium">渠道</th>
                <th className="text-left py-2 px-2 font-medium">样本名</th>
                <th className="text-left py-2 px-2 font-medium">类型</th>
                <th className="text-right py-2 px-2 font-medium">大小</th>
                <th className="text-left py-2 px-2 font-medium">来源</th>
                <th className="text-left py-2 px-2 font-medium">SHA256</th>
                <th className="text-left py-2 px-2 font-medium">风险</th>
              </tr>
            </thead>
            <tbody>
              {recentSamples.slice(0, 6).map((s, idx) => (
                <tr key={s.hash + idx} className="border-b border-[#1A2236] hover:bg-[#111625]">
                  <td className="py-1.5 px-2 text-slate-500 font-mono">{s.time.split(' ')[1]}</td>
                  <td className="py-1.5 px-2 text-slate-300">{s.channel}</td>
                  <td className="py-1.5 px-2 text-slate-100">{s.name}</td>
                  <td className="py-1.5 px-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded bg-[#111625] ${sampleTypeConfig[s.type].color}`}>
                      {sampleTypeConfig[s.type].label}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-right text-slate-300 font-mono">
                    {s.size > 1048576 ? `${(s.size / 1048576).toFixed(1)}MB` : `${(s.size / 1024).toFixed(0)}KB`}
                  </td>
                  <td className="py-1.5 px-2 text-slate-400 max-w-[200px] truncate">{s.source}</td>
                  <td className="py-1.5 px-2 text-slate-500 font-mono">{s.hash.substring(0, 12)}...</td>
                  <td className="py-1.5 px-2">
                    <StatusBadge status={riskBadgeMap[s.risk].status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ListPage 渠道列表 */}
      <ListPage<Channel>
        searchPlaceholder="搜索渠道名或接入点..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'type', label: '类型',
            options: (Object.keys(channelTypeConfig) as ChannelType[]).map((t) => ({ value: t, label: channelTypeConfig[t].label })),
          },
          {
            key: 'status', label: '状态',
            options: [
              { value: 'running', label: '采集中' },
              { value: 'paused', label: '已暂停' },
              { value: 'failed', label: '故障' },
              { value: 'pending', label: '待启动' },
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
          { key: 'enable', label: '批量启动', icon: <Play className="w-3.5 h-3.5" />, onClick: (ids) => setChannels((p) => p.map((c) => ids.includes(c.id) ? { ...c, status: 'running' as ChannelStatus } : c)) },
          { key: 'pause', label: '批量暂停', icon: <Pause className="w-3.5 h-3.5" />, onClick: (ids) => setChannels((p) => p.map((c) => ids.includes(c.id) ? { ...c, status: 'paused' as ChannelStatus } : c)) },
          { key: 'trigger', label: '立即采集', icon: <Zap className="w-3.5 h-3.5" />, onClick: (ids) => setChannels((p) => p.map((c) => ids.includes(c.id) ? { ...c, todayCount: c.todayCount + 1 } : c)) },
          { key: 'delete', label: '删除', icon: <Trash2 className="w-3.5 h-3.5" />, danger: true, onClick: (ids) => setChannels((p) => p.filter((c) => !ids.includes(c.id))) },
        ]}
        renderDetail={(c) => <ChannelDetail c={c} />}
      />

      {/* 详情抽屉 */}
      {selectedChannel && (
        <ChannelDetailDrawer
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  );
}

function ChannelDetail({ c }: { c: Channel }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-slate-100">{c.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">ID: {c.id} · 协议: {c.protocol}</p>
      </div>
      <p className="text-sm text-slate-400">{c.description}</p>
      <div className="grid grid-cols-2 gap-2">
        <Field label="接入点" value={c.endpoint} />
        <Field label="调度策略" value={c.schedule} />
        <Field label="容量上限" value={`${c.capacity}/天`} />
        <Field label="队列长度" value={String(c.queueLength)} />
        <Field label="平均延迟" value={c.avgLatency > 0 ? `${c.avgLatency}s` : '-'} />
        <Field label="成功率" value={c.successRate > 0 ? `${c.successRate}%` : '-'} />
      </div>
    </div>
  );
}

function ChannelDetailDrawer({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-[#111625] border-l border-[#2A354D] w-full max-w-2xl h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${channelTypeConfig[channel.type].color}`}>
                {(() => { const I = channelTypeConfig[channel.type].icon; return <I className="w-6 h-6" />; })()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">{channel.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{channel.id} · {channelTypeConfig[channel.type].label}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>关闭</Button>
          </div>

          <ChannelDetail c={channel} />

          <Card>
            <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-400" />过滤规则
            </h4>
            {channel.filterRules.length > 0 ? (
              <div className="space-y-2">
                {channel.filterRules.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#111625] rounded">
                    <div className={`w-1.5 h-1.5 rounded-full ${r.enabled ? 'bg-green-400' : 'bg-slate-500'}`} />
                    <span className="text-xs text-slate-400 w-24">{r.type}</span>
                    <span className="text-sm text-slate-200 font-mono flex-1 break-all">{r.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">无过滤规则</p>
            )}
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />最近样本
            </h4>
            {channel.recentSamples.length > 0 ? (
              <div className="space-y-2">
                {channel.recentSamples.map((s) => (
                  <div key={s.hash} className="flex items-center gap-2 p-2 bg-[#111625] rounded text-xs">
                    <Hash className="w-3 h-3 text-slate-500" />
                    <span className="font-mono text-slate-500 w-32 truncate">{s.hash.substring(0, 12)}...</span>
                    <span className="text-slate-100 flex-1 truncate">{s.name}</span>
                    <span className={`text-[10px] px-1.5 py-0 rounded ${sampleTypeConfig[s.type].color}`}>{sampleTypeConfig[s.type].label}</span>
                    <span className="text-slate-400 w-16 text-right font-mono">
                      {s.size > 1048576 ? `${(s.size / 1048576).toFixed(1)}MB` : `${(s.size / 1024).toFixed(0)}KB`}
                    </span>
                    <StatusBadge status={riskBadgeMap[s.risk].status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">暂无样本</p>
            )}
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />采集统计
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <Field label="今日采集" value={String(channel.todayCount)} />
              <Field label="容量上限" value={String(channel.capacity)} />
              <Field label="使用率" value={`${((channel.todayCount / channel.capacity) * 100).toFixed(1)}%`} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub }: { label: string; value: number | string; color: string; icon: LucideIcon; sub?: string }) {
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

export default MultiChannelSampleAcquisition;

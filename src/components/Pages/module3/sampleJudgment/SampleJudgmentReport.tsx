'use client';

import React, { useState, useMemo } from 'react';
import { FileText, Plus, Send, Download, Eye, Edit3, Calendar, Mail, MessageSquare, Bell, Trash2, Filter, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { ListPage } from '@/components/Common/ListPage';

/**
 * 3-6-8 深度样本研判任务报告
 *
 * 5 类报告模板（日报/周报/月报/专项/威胁分析）
 * - 自动 + 手动生成
 * - 推送：邮件/钉钉/企业微信/Web
 * - 订阅管理
 */

type ReportType = 'daily' | 'weekly' | 'monthly' | 'special' | 'threat';
type ReportStatus = 'draft' | 'generated' | 'pushed' | 'archived';
type PushChannel = 'email' | 'dingtalk' | 'wecom' | 'web';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  period: string;
  generatedAt: string;
  pushChannels: PushChannel[];
  pushStatus: { channel: PushChannel; success: boolean; pushedAt: string }[];
  size: number;
  pages: number;
  samples: number;
  author: string;
  subscribers: number;
  readCount: number;
}

const REPORT_DATA: Report[] = [
  { id: 'RPT-2026-001', name: '网络安全威胁研判日报 2026-06-04', type: 'daily', status: 'pushed', period: '2026-06-04', generatedAt: '2026-06-04 18:00:00', pushChannels: ['email', 'dingtalk', 'wecom'], pushStatus: [
    { channel: 'email', success: true, pushedAt: '2026-06-04 18:00:30' },
    { channel: 'dingtalk', success: true, pushedAt: '2026-06-04 18:00:25' },
    { channel: 'wecom', success: true, pushedAt: '2026-06-04 18:00:20' },
  ], size: 2456789, pages: 28, samples: 142, author: '系统自动', subscribers: 18, readCount: 14 },
  { id: 'RPT-2026-002', name: '网络安全威胁研判周报 2026-W22', type: 'weekly', status: 'pushed', period: '2026-05-29 ~ 2026-06-04', generatedAt: '2026-06-04 18:00:00', pushChannels: ['email', 'dingtalk'], pushStatus: [
    { channel: 'email', success: true, pushedAt: '2026-06-04 18:01:00' },
    { channel: 'dingtalk', success: true, pushedAt: '2026-06-04 18:00:55' },
  ], size: 8345678, pages: 86, samples: 1245, author: '系统自动', subscribers: 22, readCount: 19 },
  { id: 'RPT-2026-003', name: '5 月度威胁态势分析报告', type: 'monthly', status: 'pushed', period: '2026-05-01 ~ 2026-05-31', generatedAt: '2026-06-01 09:00:00', pushChannels: ['email', 'dingtalk', 'wecom', 'web'], pushStatus: [
    { channel: 'email', success: true, pushedAt: '2026-06-01 09:01:00' },
    { channel: 'dingtalk', success: true, pushedAt: '2026-06-01 09:00:55' },
    { channel: 'wecom', success: true, pushedAt: '2026-06-01 09:00:50' },
    { channel: 'web', success: true, pushedAt: '2026-06-01 09:00:30' },
  ], size: 25678901, pages: 256, samples: 5823, author: '王经理', subscribers: 35, readCount: 28 },
  { id: 'RPT-2026-004', name: 'APT-29 攻击专项分析报告', type: 'special', status: 'generated', period: '2026-06-01 ~ 2026-06-04', generatedAt: '2026-06-04 16:30:00', pushChannels: ['email'], pushStatus: [
    { channel: 'email', success: false, pushedAt: '-' },
  ], size: 12345678, pages: 128, samples: 234, author: '张工', subscribers: 8, readCount: 0 },
  { id: 'RPT-2026-005', name: 'LockBit 勒索软件家族威胁分析', type: 'threat', status: 'pushed', period: '2026-06-01 ~ 2026-06-04', generatedAt: '2026-06-04 14:00:00', pushChannels: ['email', 'dingtalk', 'wecom'], pushStatus: [
    { channel: 'email', success: true, pushedAt: '2026-06-04 14:00:30' },
    { channel: 'dingtalk', success: true, pushedAt: '2026-06-04 14:00:25' },
    { channel: 'wecom', success: true, pushedAt: '2026-06-04 14:00:20' },
  ], size: 6789012, pages: 64, samples: 178, author: '李工', subscribers: 15, readCount: 12 },
  { id: 'RPT-2026-006', name: '6 月第 1 周周报草稿', type: 'weekly', status: 'draft', period: '2026-06-01 ~ 2026-06-07', generatedAt: '-', pushChannels: [], pushStatus: [], size: 0, pages: 0, samples: 0, author: '王工', subscribers: 0, readCount: 0 },
  { id: 'RPT-2026-007', name: '供应链攻击专项分析', type: 'special', status: 'archived', period: '2026-05-15 ~ 2026-05-22', generatedAt: '2026-05-23 10:00:00', pushChannels: ['email', 'dingtalk'], pushStatus: [
    { channel: 'email', success: true, pushedAt: '2026-05-23 10:01:00' },
    { channel: 'dingtalk', success: true, pushedAt: '2026-05-23 10:00:55' },
  ], size: 9234567, pages: 96, samples: 312, author: '赵工', subscribers: 12, readCount: 10 },
  { id: 'RPT-2026-008', name: '6 月每日威胁研判日报', type: 'daily', status: 'generated', period: '2026-06-03', generatedAt: '2026-06-03 18:00:00', pushChannels: ['email'], pushStatus: [
    { channel: 'email', success: true, pushedAt: '2026-06-03 18:00:30' },
  ], size: 2123456, pages: 24, samples: 128, author: '系统自动', subscribers: 18, readCount: 16 },
];

const typeConfig: Record<ReportType, { label: string; color: string; icon: any }> = {
  daily: { label: '日报', color: 'text-blue-400 bg-blue-500/10', icon: Calendar },
  weekly: { label: '周报', color: 'text-purple-400 bg-purple-500/10', icon: Calendar },
  monthly: { label: '月报', color: 'text-cyan-400 bg-cyan-500/10', icon: Calendar },
  special: { label: '专项报告', color: 'text-orange-400 bg-orange-500/10', icon: FileText },
  threat: { label: '威胁分析', color: 'text-red-400 bg-red-500/10', icon: FileText },
};

const statusBadgeMap: Record<ReportStatus, { status: any; text: string }> = {
  draft: { status: 'pending', text: '草稿' },
  generated: { status: 'running', text: '已生成' },
  pushed: { status: 'success', text: '已推送' },
  archived: { status: 'info', text: '已归档' },
};

const channelConfig: Record<PushChannel, { label: string; icon: any }> = {
  email: { label: '邮件', icon: Mail },
  dingtalk: { label: '钉钉', icon: MessageSquare },
  wecom: { label: '企业微信', icon: MessageSquare },
  web: { label: 'Web 端', icon: Bell },
};

export function SampleJudgmentReport() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);

  const filtered = useMemo(() => {
    return REPORT_DATA.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter && r.type !== typeFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter]);

  // KPI
  const total = REPORT_DATA.length;
  const pushed = REPORT_DATA.filter(r => r.status === 'pushed').length;
  const generated = REPORT_DATA.filter(r => r.status === 'generated').length;
  const draft = REPORT_DATA.filter(r => r.status === 'draft').length;
  const totalSubscribers = REPORT_DATA.reduce((s, r) => s + r.subscribers, 0);

  const columns = [
    { key: 'id', title: 'ID', width: '140px', render: (r: Report) => <span className="font-mono text-xs text-blue-400">{r.id}</span> },
    { key: 'name', title: '报告名称', width: '300px', render: (r: Report) => (
      <div>
        <div className="text-sm text-slate-100">{r.name}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{r.period}</div>
      </div>
    )},
    { key: 'type', title: '类型', width: '90px', render: (r: Report) => {
      const cfg = typeConfig[r.type as keyof typeof typeConfig];
      const Icon = cfg.icon;
      return <span className={`text-[10px] px-1.5 py-0.5 rounded ${cfg.color} inline-flex items-center gap-1`}><Icon className="w-3 h-3" />{cfg.label}</span>;
    }},
    { key: 'status', title: '状态', width: '80px', render: (r: Report) => <StatusBadge status={statusBadgeMap[r.status].status} /> },
    { key: 'pages', title: '页数', width: '60px', render: (r: Report) => <span className="text-sm text-slate-300">{r.pages || '-'}</span> },
    { key: 'samples', title: '样本数', width: '70px', render: (r: Report) => <span className="text-sm text-cyan-400 font-medium">{r.samples || '-'}</span> },
    { key: 'subscribers', title: '订阅', width: '60px', render: (r: Report) => <span className="text-sm text-slate-300">{r.subscribers}</span> },
    { key: 'readCount', title: '已读', width: '60px', render: (r: Report) => <span className="text-sm text-green-400">{r.readCount}/{r.subscribers}</span> },
    { key: 'author', title: '作者', width: '80px', render: (r: Report) => <span className="text-xs text-slate-400">{r.author}</span> },
    { key: 'generatedAt', title: '生成时间', width: '130px', render: (r: Report) => <span className="text-xs text-slate-500 font-mono">{r.generatedAt.substring(5)}</span> },
    { key: 'actions', title: '操作', width: '120px', render: (r: Report) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" onClick={() => setSelected(r)}><Eye className="w-3.5 h-3.5" /></Button>
        <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5" /></Button>
        <Button variant="ghost" size="sm"><Send className="w-3.5 h-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            深度样本研判任务报告
          </h1>
          <p className="text-slate-400 mt-1 text-sm">5 类报告模板（日/周/月/专项/威胁分析）· 自动 + 手动生成 · 多渠道推送</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary"><Plus className="w-4 h-4 mr-1" />新建报告</Button>
          <Button variant="secondary"><Send className="w-4 h-4 mr-1" />批量推送</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="报告总数" value={total} color="text-slate-50" icon={FileText} />
        <KPI label="已推送" value={pushed} color="text-green-400" icon={Send} />
        <KPI label="已生成" value={generated} color="text-blue-400" icon={FileText} />
        <KPI label="草稿" value={draft} color="text-yellow-400" icon={Edit3} />
        <KPI label="订阅人数" value={totalSubscribers} color="text-purple-400" icon={Bell} />
      </div>

      <ListPage<Report>
        searchPlaceholder="搜索 ID / 报告名称..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'type', label: '类型', options: (Object.keys(typeConfig) as ReportType[]).map(t => ({ value: t, label: typeConfig[t as keyof typeof typeConfig].label })) },
          { key: 'status', label: '状态', options: (Object.keys(statusBadgeMap) as ReportStatus[]).map(s => ({ value: s, label: statusBadgeMap[s].text })) },
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
          { key: 'push', label: '批量推送', icon: <Send className="w-3.5 h-3.5" />, onClick: (ids) => console.log('push', ids) },
          { key: 'download', label: '批量下载', icon: <Download className="w-3.5 h-3.5" />, onClick: (ids) => console.log('download', ids) },
          { key: 'archive', label: '归档', onClick: (ids) => console.log('archive', ids) },
          { key: 'delete', label: '删除', danger: true, onClick: (ids) => console.log('delete', ids) },
        ]}
        renderDetail={(r) => <ReportDetail r={r} />}
      />
    </div>
  );
}

function ReportDetail({ r }: { r: Report }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-100">{r.name}</h3>
        <p className="text-xs text-slate-500 mt-1 font-mono">ID: {r.id} · 周期: {r.period}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={statusBadgeMap[r.status].status} />
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeConfig[r.type as keyof typeof typeConfig].color}`}>{typeConfig[r.type as keyof typeof typeConfig].label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="页数" value={r.pages ? `${r.pages} 页` : '-'} />
        <Field label="样本数" value={r.samples ? `${r.samples} 个` : '-'} />
        <Field label="文件大小" value={r.size ? `${(r.size / 1048576).toFixed(2)} MB` : '-'} />
        <Field label="作者" value={r.author} />
        <Field label="生成时间" value={r.generatedAt} />
        <Field label="订阅人数" value={String(r.subscribers)} />
        <Field label="已读" value={`${r.readCount} / ${r.subscribers}`} />
        <Field label="阅读率" value={r.subscribers > 0 ? `${Math.round((r.readCount / r.subscribers) * 100)}%` : '-'} />
      </div>

      <Card>
        <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-400" />推送渠道
        </h4>
        {r.pushChannels.length > 0 ? (
          <div className="space-y-2">
            {r.pushChannels.map((ch) => {
              const cfg = channelConfig[ch as keyof typeof channelConfig];
              const Icon = cfg.icon;
              const ps = r.pushStatus.find(s => s.channel === ch);
              return (
                <div key={ch} className="flex items-center gap-2 p-2.5 bg-[#111625] rounded">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-300 flex-1">{cfg.label}</span>
                  <span className="text-xs text-slate-500 font-mono">{ps?.pushedAt}</span>
                  {ps?.success ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">成功</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">失败</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-3">未配置推送</p>
        )}
      </Card>

      <div className="flex justify-end gap-2 pt-3 border-t border-[#2A354D]">
        <Button variant="secondary">订阅管理</Button>
        <Button variant="secondary"><Download className="w-3.5 h-3.5 mr-1" />下载</Button>
        <Button variant="primary"><Send className="w-3.5 h-3.5 mr-1" />推送</Button>
      </div>
    </div>
  );
}

function KPI({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
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

export default SampleJudgmentReport;

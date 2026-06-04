'use client';

import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Send, Mail, MessageSquare, Globe, Smartphone, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

type ReportType = 'daily' | 'weekly' | 'monthly' | 'incident' | 'subscription';
type ReportStatus = 'draft' | 'generated' | 'pushed' | 'archived';
type PushChannel = 'email' | 'dingtalk' | 'wechat' | 'web' | 'sms';

interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  period: string;
  generateTime: string;
  alertsCovered: number;
  criticalAlerts: number;
  size: number;
  channels: PushChannel[];
  pushStatus: { channel: PushChannel; status: 'success' | 'failed' | 'pending'; recipients: number }[];
  author: string;
  pages: number;
}

const REPORTS: Report[] = [
  { id: 'DRR-2026-1401', title: '告警日报_20260604', type: 'daily', status: 'pushed', period: '2026-06-04', generateTime: '2026-06-04 08:00:00', alertsCovered: 325, criticalAlerts: 12, size: 384, channels: ['email', 'dingtalk'], pushStatus: [{ channel: 'email', status: 'success', recipients: 28 }, { channel: 'dingtalk', status: 'success', recipients: 15 }], author: '系统自动', pages: 16 },
  { id: 'DRR-2026-1400', title: '告警日报_20260603', type: 'daily', status: 'pushed', period: '2026-06-03', generateTime: '2026-06-03 08:00:00', alertsCovered: 412, criticalAlerts: 18, size: 512, channels: ['email', 'dingtalk'], pushStatus: [{ channel: 'email', status: 'success', recipients: 28 }, { channel: 'dingtalk', status: 'success', recipients: 15 }], author: '系统自动', pages: 22 },
  { id: 'DRR-2026-1402', title: '2026-W22 告警周报', type: 'weekly', status: 'pushed', period: '2026-05-25 ~ 2026-05-31', generateTime: '2026-06-01 09:00:00', alertsCovered: 2138, criticalAlerts: 87, size: 1280, channels: ['email', 'dingtalk', 'wechat'], pushStatus: [{ channel: 'email', status: 'success', recipients: 35 }, { channel: 'dingtalk', status: 'success', recipients: 18 }, { channel: 'wechat', status: 'success', recipients: 12 }], author: '系统自动', pages: 38 },
  { id: 'DRR-2026-1403', title: '2026-05 告警月报', type: 'monthly', status: 'pushed', period: '2026-05-01 ~ 2026-05-31', generateTime: '2026-06-01 11:00:00', alertsCovered: 8925, criticalAlerts: 365, size: 3072, channels: ['email', 'dingtalk'], pushStatus: [{ channel: 'email', status: 'success', recipients: 42 }, { channel: 'dingtalk', status: 'success', recipients: 22 }], author: '安全-陈工', pages: 68 },
  { id: 'DRR-2026-1404', title: '2026-06-03 大规模攻击事件报告', type: 'incident', status: 'pushed', period: '2026-06-03', generateTime: '2026-06-03 22:00:00', alertsCovered: 412, criticalAlerts: 18, size: 2048, channels: ['email', 'dingtalk', 'sms'], pushStatus: [{ channel: 'email', status: 'success', recipients: 12 }, { channel: 'dingtalk', status: 'success', recipients: 8 }], author: 'CISO', pages: 32 },
  { id: 'DRR-2026-1405', title: '告警订阅情况月报', type: 'subscription', status: 'generated', period: '2026-05', generateTime: '2026-06-04 14:00:00', alertsCovered: 43, criticalAlerts: 0, size: 1024, channels: ['email'], pushStatus: [{ channel: 'email', status: 'pending', recipients: 18 }], author: '安全-王工', pages: 28 },
  { id: 'DRR-2026-1406', title: '告警分类专题分析', type: 'incident', status: 'draft', period: '2026-06', generateTime: '2026-06-04 17:00:00', alertsCovered: 120, criticalAlerts: 8, size: 768, channels: ['email'], pushStatus: [], author: '安全-张工', pages: 18 },
  { id: 'DRR-2026-1407', title: '告警日报_20260602', type: 'daily', status: 'archived', period: '2026-06-02', generateTime: '2026-06-02 08:00:00', alertsCovered: 358, criticalAlerts: 15, size: 432, channels: ['email'], pushStatus: [{ channel: 'email', status: 'success', recipients: 28 }], author: '系统自动', pages: 18 },
];

const TYPE_MAP: Record<ReportType, { label: string; color: string; bg: string }> = {
  daily: { label: '日报', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  weekly: { label: '周报', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  monthly: { label: '月报', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  incident: { label: '事件', color: 'text-red-400', bg: 'bg-red-500/20' },
  subscription: { label: '订阅', color: 'text-orange-400', bg: 'bg-orange-500/20' },
};

const STATUS_MAP: Record<ReportStatus, { status: any; text: string }> = {
  draft: { status: 'pending', text: '草稿' },
  generated: { status: 'info', text: '已生成' },
  pushed: { status: 'success', text: '已推送' },
  archived: { status: 'info', text: '已归档' },
};

const CHANNEL_MAP: Record<PushChannel, { label: string; icon: any; color: string }> = {
  email: { label: '邮件', icon: Mail, color: 'text-blue-400' },
  dingtalk: { label: '钉钉', icon: MessageSquare, color: 'text-cyan-400' },
  wechat: { label: '企业微信', icon: MessageSquare, color: 'text-green-400' },
  web: { label: 'Web', icon: Globe, color: 'text-purple-400' },
  sms: { label: '短信', icon: Smartphone, color: 'text-orange-400' },
};

const COLUMNS = [
  { key: 'id', title: '报告 ID', width: '140px', render: (r: Report) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  { key: 'title', title: '标题', render: (r: Report) => <div><p className="text-sm text-slate-100">{r.title}</p><p className="text-[10px] text-slate-500">{r.period}</p></div> },
  { key: 'type', title: '类型', width: '70px', render: (r: Report) => <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_MAP[r.type].bg} ${TYPE_MAP[r.type].color}`}>{TYPE_MAP[r.type].label}</span> },
  { key: 'status', title: '状态', width: '80px', render: (r: Report) => <StatusBadge status={STATUS_MAP[r.status].status} /> },
  { key: 'alerts', title: '告警', width: '80px', render: (r: Report) => <span className="text-xs text-slate-300">{r.alertsCovered}</span> },
  { key: 'critical', title: '严重', width: '70px', render: (r: Report) => <span className={`text-xs ${r.criticalAlerts > 10 ? 'text-red-400' : 'text-slate-300'}`}>{r.criticalAlerts}</span> },
  { key: 'size', title: '大小', width: '80px', render: (r: Report) => <span className="text-xs text-slate-300">{r.size}KB</span> },
  { key: 'pages', title: '页数', width: '60px', render: (r: Report) => <span className="text-xs text-slate-300">{r.pages}</span> },
  { key: 'channels', title: '渠道', width: '160px', render: (r: Report) => (
    <div className="flex gap-1">{r.channels.slice(0, 3).map((c) => { const Cm = CHANNEL_MAP[c]; if (!Cm) return null; const CI = Cm.icon; return <CI key={c} className={`w-3.5 h-3.5 ${Cm.color}`} />; })}</div>
  )},
  { key: 'author', title: '作者', width: '90px', render: (r: Report) => <span className="text-xs text-slate-300">{r.author}</span> },
  { key: 'generateTime', title: '生成时间', width: '150px', render: (r: Report) => <span className="text-xs text-slate-400 font-mono">{r.generateTime}</span> },
];

/**
 * 3-14-8 告警日报 - 任务报告
 *
 * 100% 复用 ListPage 共享组件
 */
export function DailyReportReport() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const stats = useMemo(() => ({
    total: REPORTS.length,
    pushed: REPORTS.filter((r) => r.status === 'pushed').length,
    generated: REPORTS.filter((r) => r.status === 'generated').length,
    draft: REPORTS.filter((r) => r.status === 'draft').length,
    subscribers: REPORTS.reduce((s, r) => s + r.pushStatus.reduce((ss, p) => ss + p.recipients, 0), 0),
  }), []);

  const typePie = useMemo(() => {
    const counts: Record<string, number> = { daily: 0, weekly: 0, monthly: 0, incident: 0, subscription: 0 };
    REPORTS.forEach((r) => { counts[r.type]++; });
    return Object.entries(counts).map(([k, v]) => ({
      name: TYPE_MAP[k as ReportType].label,
      value: v,
      color: k === 'daily' ? '#3B82F6' : k === 'weekly' ? '#06B6D4' : k === 'monthly' ? '#A855F7' : k === 'incident' ? '#EF4444' : '#F97316',
    }));
  }, []);

  const monthlyTrend = [
    { month: '1月', reports: 32, alerts: 7820 },
    { month: '2月', reports: 28, alerts: 6920 },
    { month: '3月', reports: 35, alerts: 8580 },
    { month: '4月', reports: 30, alerts: 7820 },
    { month: '5月', reports: 35, alerts: 8925 },
    { month: '6月', reports: 8, alerts: 2138 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            告警日报任务报告
          </h1>
          <p className="text-slate-400 mt-1 text-sm">5 类报告自动生成 · 5 推送渠道 · 告警日报完整追溯</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-1" />导出列表</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="报告总数" value={stats.total} color="text-blue-400" />
        <KPI label="已推送" value={stats.pushed} color="text-green-400" />
        <KPI label="已生成" value={stats.generated} color="text-cyan-400" />
        <KPI label="草稿" value={stats.draft} color="text-yellow-400" />
        <KPI label="订阅数" value={stats.subscribers} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3">报告类型分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={typePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2} label={({ name, value }: any) => `${name} ${value}`}>
                {typePie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3">月度生成趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTrend}>
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="reports" fill="#3B82F6" name="报告数" radius={[4, 4, 0, 0]} />
              <Bar dataKey="alerts" fill="#EF4444" name="告警数" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <ListPage<Report>
        searchPlaceholder="搜索 ID / 标题..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ key: 'type', label: '类型', options: [
          { value: 'all', label: '全部' },
          { value: 'daily', label: '日报' },
          { value: 'weekly', label: '周报' },
          { value: 'monthly', label: '月报' },
          { value: 'incident', label: '事件' },
          { value: 'subscription', label: '订阅' },
        ]}]}
        filterValues={{ type: typeFilter }}
        onFilterChange={(_, v) => setTypeFilter(v)}
        data={REPORTS}
        columns={COLUMNS}
        rowKey="id"
        detailWidth="max-w-2xl"
        renderDetail={(r) => (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">{r.id}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_MAP[r.type].bg} ${TYPE_MAP[r.type].color}`}>{TYPE_MAP[r.type].label}</span>
              <StatusBadge status={STATUS_MAP[r.status].status} />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{r.title}</h3>
            <p className="text-xs text-slate-500">报告周期: {r.period}</p>

            <div className="grid grid-cols-2 gap-2">
              <Field label="作者" value={r.author} />
              <Field label="生成时间" value={r.generateTime} />
              <Field label="告警覆盖" value={`${r.alertsCovered} 条`} />
              <Field label="严重告警" value={`${r.criticalAlerts} 条`} highlight={r.criticalAlerts > 10} />
              <Field label="文件大小" value={`${r.size}KB · ${r.pages} 页`} />
              <Field label="订阅渠道" value={`${r.channels.length} 个`} />
            </div>

            {r.pushStatus.length > 0 && (
              <Card>
                <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />推送状态
                </h4>
                <div className="space-y-1.5">
                  {r.pushStatus.map((p, i) => {
                    const Cm = CHANNEL_MAP[p.channel];
                    if (!Cm) return null;
                    const CI = Cm.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 p-2 bg-[#111625] rounded">
                        <CI className={`w-4 h-4 ${Cm.color}`} />
                        <span className="text-sm text-slate-200 flex-1">{Cm.label}</span>
                        <span className="text-xs text-slate-500">{p.recipients} 收件人</span>
                        <span className={`text-xs ${p.status === 'success' ? 'text-green-400' : p.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                          {p.status === 'success' ? '成功' : p.status === 'failed' ? '失败' : '推送中'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="flex-1"><FileText className="w-3.5 h-3.5 mr-1" />预览</Button>
              <Button variant="secondary" size="sm" className="flex-1"><Download className="w-3.5 h-3.5 mr-1" />下载</Button>
              {r.status === 'generated' && (
                <Button variant="primary" size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Send className="w-3.5 h-3.5 mr-1" />推送
                </Button>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number | string; color: string }) {
  return <Card><div className="text-xs text-slate-500 mb-1">{label}</div><div className={`text-2xl font-bold ${color}`}>{value}</div></Card>;
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return <div className={`p-2.5 rounded-lg ${highlight ? 'bg-red-500/10' : 'bg-[#111625]'}`}><p className="text-xs text-slate-500">{label}</p><p className={`text-sm mt-0.5 font-mono ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p></div>;
}

export default DailyReportReport;

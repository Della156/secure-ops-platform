'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Download, Eye, Edit2, Trash2, Plus, Save, X,
  FileText, CheckCircle2, Clock, Settings, BarChart3, TrendingUp, Calendar, Database,
  Mail, Send, Filter, RefreshCw, Layers, PieChart as PieIcon, Star, Award, AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/Common/StatusBadge';

/**
 * 2-34-3 标准化报告自动生成（报告生成中心）
 *
 * 8 大模块：
 *  1. 4 KPI（模板数 / 已生成 / 本月生成 / 推送成功）
 *  2. 报告类型分布（饼图）
 *  3. 月度生成趋势（柱状图）
 *  4. 模板配置列表
 *  5. 已生成报告列表
 *  6. 报告详情 + 预览
 *  7. 模板编辑 modal
 *  8. 推送渠道 + 调度
 */

type ReportType = 'job' | 'security' | 'compliance' | 'incident' | 'custom';
type Grade = 'excellent' | 'good' | 'poor';

interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  status: 'default' | 'custom';
  fields: string[];
  schedule: string;
  channels: string[];
  subscribers: number;
  enabled: boolean;
  createTime: string;
  updateTime: string;
}

interface GeneratedReport {
  id: string;
  jobId: string;
  jobName: string;
  templateId: string;
  templateName: string;
  type: ReportType;
  status: 'generated' | 'pending' | 'failed' | 'pushed';
  generateTime: string;
  duration: number;
  changeContent: string;
  checkResult: string;
  issueCount: number;
  qualityGrade: Grade;
  pushChannel?: string;
  pushStatus?: 'success' | 'failed' | 'pending';
  size: number; // KB
}

const TYPE_CONFIG: Record<ReportType, { label: string; color: string; bg: string; icon: any }> = {
  job: { label: '作业报告', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: FileText },
  security: { label: '安全报告', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
  compliance: { label: '合规报告', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle2 },
  incident: { label: '事件报告', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: AlertTriangle },
  custom: { label: '自定义', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Settings },
};

const TEMPLATES: ReportTemplate[] = [
  { id: 'TEMP-001', name: '标准作业报告模板', type: 'job', status: 'default', fields: ['变更内容', '检查结果', '问题列表', '质量评价'], schedule: '每日 23:00', channels: ['邮件', '钉钉'], subscribers: 28, enabled: true, createTime: '2026-06-01 10:00:00', updateTime: '2026-06-01 10:00:00' },
  { id: 'TEMP-002', name: '安全补丁报告模板', type: 'security', status: 'default', fields: ['补丁信息', '安装结果', '验证报告', '影响范围'], schedule: '每周一 08:00', channels: ['邮件', '企业微信'], subscribers: 15, enabled: true, createTime: '2026-06-01 10:00:00', updateTime: '2026-06-01 10:00:00' },
  { id: 'TEMP-003', name: '等保合规报告', type: 'compliance', status: 'default', fields: ['合规项', '检查结果', '不符合项', '整改建议'], schedule: '每月最后一天', channels: ['邮件'], subscribers: 8, enabled: true, createTime: '2026-06-01 10:00:00', updateTime: '2026-06-02 14:00:00' },
  { id: 'TEMP-004', name: '安全事件报告', type: 'incident', status: 'default', fields: ['事件概述', '时间线', '影响范围', '处置过程', '经验总结'], schedule: '事件触发', channels: ['邮件', '钉钉', '短信'], subscribers: 12, enabled: true, createTime: '2026-06-01 10:00:00', updateTime: '2026-06-01 10:00:00' },
  { id: 'TEMP-005', name: '自定义报告', type: 'custom', status: 'custom', fields: ['自定义字段 1', '自定义字段 2', '自定义字段 3'], schedule: '手动触发', channels: ['邮件'], subscribers: 3, enabled: true, createTime: '2026-06-02 14:00:00', updateTime: '2026-06-02 14:30:00' },
];

const REPORTS: GeneratedReport[] = [
  { id: 'RPT-2026-001', jobId: 'JOB-20260604001', jobName: '数据库备份作业', templateId: 'TEMP-001', templateName: '标准作业报告模板', type: 'job', status: 'pushed', generateTime: '2026-06-04 02:15:00', duration: 3, changeContent: '数据库全量备份 2.5GB', checkResult: '成功', issueCount: 0, qualityGrade: 'excellent', pushChannel: '邮件+钉钉', pushStatus: 'success', size: 256 },
  { id: 'RPT-2026-002', jobId: 'JOB-20260604002', jobName: '安全补丁安装', templateId: 'TEMP-002', templateName: '安全补丁报告模板', type: 'security', status: 'pushed', generateTime: '2026-06-04 09:45:00', duration: 5, changeContent: '安装安全补丁 3 个，影响 12 台主机', checkResult: '成功', issueCount: 1, qualityGrade: 'good', pushChannel: '邮件+企业微信', pushStatus: 'success', size: 384 },
  { id: 'RPT-2026-003', jobId: 'JOB-20260604003', jobName: '日志清理作业', templateId: 'TEMP-001', templateName: '标准作业报告模板', type: 'job', status: 'pushed', generateTime: '2026-06-04 01:08:00', duration: 2, changeContent: '清理日志文件，释放 5.2GB', checkResult: '成功', issueCount: 0, qualityGrade: 'excellent', pushChannel: '邮件', pushStatus: 'success', size: 128 },
  { id: 'RPT-2026-004', jobId: 'JOB-20260604004', jobName: '配置同步作业', templateId: 'TEMP-001', templateName: '标准作业报告模板', type: 'job', status: 'failed', generateTime: '2026-06-04 10:03:00', duration: 3, changeContent: '配置文件同步', checkResult: '失败', issueCount: 2, qualityGrade: 'poor', size: 96 },
  { id: 'RPT-2026-005', jobId: 'INC-20260603001', jobName: '勒索软件应急响应', templateId: 'TEMP-004', templateName: '安全事件报告', type: 'incident', status: 'pushed', generateTime: '2026-06-03 18:30:00', duration: 15, changeContent: '检测到 LockBit 4.0 攻击，3 台主机受影响', checkResult: '已处置', issueCount: 0, qualityGrade: 'excellent', pushChannel: '邮件+钉钉+短信', pushStatus: 'success', size: 1024 },
  { id: 'RPT-2026-006', jobId: 'JOB-20260604006', jobName: '数据归档作业', templateId: 'TEMP-001', templateName: '标准作业报告模板', type: 'job', status: 'pending', generateTime: '2026-06-04 03:45:00', duration: 0, changeContent: '归档 12GB 历史数据', checkResult: '生成中', issueCount: 0, qualityGrade: 'good', size: 0 },
  { id: 'RPT-2026-007', jobId: 'AUDIT-20260604001', jobName: '等保 2.0 三级测评', templateId: 'TEMP-003', templateName: '等保合规报告', type: 'compliance', status: 'pushed', generateTime: '2026-06-04 11:00:00', duration: 8, changeContent: '等保测评：物理环境/网络/主机/应用/数据', checkResult: '85% 符合', issueCount: 5, qualityGrade: 'good', pushChannel: '邮件', pushStatus: 'success', size: 2560 },
];

const MONTHLY_TREND = [
  { month: '1月', total: 156, pushed: 148, failed: 8 },
  { month: '2月', total: 168, pushed: 161, failed: 7 },
  { month: '3月', total: 182, pushed: 175, failed: 7 },
  { month: '4月', total: 198, pushed: 192, failed: 6 },
  { month: '5月', total: 215, pushed: 208, failed: 7 },
  { month: '6月', total: 78, pushed: 72, failed: 6 },
];

const TYPE_PIE_COLORS = ['#3B82F6', '#EF4444', '#22C55E', '#F97316', '#A855F7'];

const GRADE_BADGE: Record<Grade, { status: any; text: string; color: string; bg: string }> = {
  excellent: { status: 'success', text: '优', color: 'text-green-400', bg: 'bg-green-500/20' },
  good: { status: 'info', text: '良', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  poor: { status: 'failed', text: '差', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const STATUS_BADGE: Record<GeneratedReport['status'], { status: any; text: string }> = {
  generated: { status: 'info', text: '已生成' },
  pending: { status: 'pending', text: '生成中' },
  failed: { status: 'failed', text: '生成失败' },
  pushed: { status: 'success', text: '已推送' },
};

const PUSH_BADGE: Record<NonNullable<GeneratedReport['pushStatus']>, { status: any; text: string; color: string }> = {
  success: { status: 'success', text: '推送成功', color: 'text-green-400' },
  failed: { status: 'failed', text: '推送失败', color: 'text-red-400' },
  pending: { status: 'pending', text: '推送中', color: 'text-yellow-400' },
};

export function StandardReportGen() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(REPORTS[0]);

  // KPI
  const stats = useMemo(() => {
    return {
      templates: TEMPLATES.length,
      generated: REPORTS.length,
      monthlyGen: MONTHLY_TREND[MONTHLY_TREND.length - 1].total,
      pushSuccess: REPORTS.filter((r) => r.pushStatus === 'success').length,
      failed: REPORTS.filter((r) => r.status === 'failed').length,
    };
  }, []);

  // 类型分布
  const typePie = useMemo(() => {
    const counts: Record<string, number> = { job: 0, security: 0, compliance: 0, incident: 0, custom: 0 };
    REPORTS.forEach((r) => { counts[r.type] = (counts[r.type] || 0) + 1; });
    return Object.entries(counts).map(([k, v], i) => ({
      name: TYPE_CONFIG[k as ReportType].label,
      value: v,
      color: TYPE_PIE_COLORS[i],
    }));
  }, []);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => t.name.includes(search));
  }, [search]);

  const filteredReports = useMemo(() => {
    return REPORTS.filter((r) => {
      if (search && !r.jobName.includes(search) && !r.id.includes(search)) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      return true;
    });
  }, [search, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            标准化报告自动生成
          </h1>
          <p className="text-slate-400 mt-1 text-sm">5 类报告模板 · 4 推送渠道 · 本月生成 78 份</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><RefreshCw className="w-4 h-4 mr-1" />手动触发</Button>
          <Button variant="primary" onClick={() => setShowTemplateModal(true)}>
            <Plus className="w-4 h-4 mr-1" />新增模板
          </Button>
        </div>
      </div>

      {/* 4 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="报告模板" value={stats.templates} color="text-blue-400" icon={FileText} sub="5 类 / 4 默认" />
        <KPI label="已生成" value={stats.generated} color="text-green-400" icon={CheckCircle2} sub="近 7 天" />
        <KPI label="本月生成" value={stats.monthlyGen} color="text-cyan-400" icon={Calendar} sub="较上月 +12%" />
        <KPI label="推送成功" value={`${stats.pushSuccess}/${stats.generated}`} color="text-purple-400" icon={Send} sub={`失败 ${stats.failed}`} />
      </div>

      {/* 报告类型分布 + 月度趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-400" />报告类型分布
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={typePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={2} label={({ name, value }: any) => `${name} ${value}`}>
                {typePie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />月度生成趋势
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MONTHLY_TREND}>
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
              <Bar dataKey="pushed" fill="#22C55E" name="已推送" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#EF4444" name="失败" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 模板配置 + 已生成报告 + 详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="space-y-3">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />报告模板配置
                <span className="text-[10px] text-slate-500">（{filteredTemplates.length}）</span>
              </h3>
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {filteredTemplates.map((t) => {
                const Tc = TYPE_CONFIG[t.type];
                const TIcon = Tc.icon;
                return (
                  <div key={t.id} className="p-2.5 bg-[#111625] rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <TIcon className={`w-3.5 h-3.5 ${Tc.color}`} />
                        <span className="text-sm text-slate-100 font-medium">{t.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${t.status === 'default' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {t.status === 'default' ? '默认' : '自定义'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mb-1.5">
                      字段: {t.fields.join(' / ')}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{t.schedule}</span>
                      <span>·</span>
                      <span>{t.subscribers} 订阅</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {t.channels.map((c) => (
                        <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{c}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-3 h-3 mr-1" />编辑
                      </Button>
                      {t.status === 'custom' && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-3 h-3 mr-1" />删除
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="relative flex-1 min-w-[140px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <Input className="pl-8" placeholder="搜索报告..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md">
                <option value="all">全部类型</option>
                <option value="job">作业</option>
                <option value="security">安全</option>
                <option value="compliance">合规</option>
                <option value="incident">事件</option>
                <option value="custom">自定义</option>
              </select>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />已生成报告
              <span className="text-[10px] text-slate-500">（{filteredReports.length}）</span>
            </h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {filteredReports.map((r) => {
                const gc = GRADE_BADGE[r.qualityGrade];
                const Tc = TYPE_CONFIG[r.type];
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReport(r)}
                    className={`p-2.5 rounded-lg cursor-pointer ${
                      selectedReport?.id === r.id ? 'bg-[#0066FF]/15 border border-[#0066FF]/50' : 'bg-[#111625] hover:bg-[#1A2236]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${Tc.bg} ${Tc.color}`}>
                          {Tc.label}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{r.id}</span>
                      </div>
                      <StatusBadge status={STATUS_BADGE[r.status].status} />
                    </div>
                    <p className="text-sm text-slate-100 truncate mb-1">{r.jobName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{r.generateTime}</span>
                      <span>·</span>
                      <span className={gc.color}>{gc.text}</span>
                      <span>·</span>
                      <span>{r.size}KB</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          {selectedReport && (
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${TYPE_CONFIG[selectedReport.type].bg} ${TYPE_CONFIG[selectedReport.type].color}`}>
                  {TYPE_CONFIG[selectedReport.type].label}
                </span>
                <StatusBadge status={STATUS_BADGE[selectedReport.status].status} />
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${GRADE_BADGE[selectedReport.qualityGrade].bg} ${GRADE_BADGE[selectedReport.qualityGrade].color}`}>
                  {GRADE_BADGE[selectedReport.qualityGrade].text}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">{selectedReport.jobName}</h3>
              <p className="text-xs text-slate-500 mb-3">模板: {selectedReport.templateName}</p>

              <div className="space-y-2">
                <Field label="报告 ID" value={selectedReport.id} />
                <Field label="变更内容" value={selectedReport.changeContent} />
                <Field
                  label="检查结果"
                  value={selectedReport.checkResult}
                  highlight={selectedReport.status === 'failed'}
                />
                {selectedReport.issueCount > 0 && (
                  <Field label="问题数量" value={`${selectedReport.issueCount} 个`} highlight />
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Field label="生成耗时" value={`${selectedReport.duration}s`} />
                  <Field label="文件大小" value={`${selectedReport.size}KB`} />
                </div>
                {selectedReport.pushChannel && (
                  <Field label="推送渠道" value={selectedReport.pushChannel} />
                )}
                {selectedReport.pushStatus && (
                  <div className="p-2.5 bg-[#111625] rounded-lg flex items-center gap-2">
                    <span className="text-xs text-slate-500">推送状态</span>
                    <span className={`text-xs font-medium ${PUSH_BADGE[selectedReport.pushStatus].color}`}>
                      {PUSH_BADGE[selectedReport.pushStatus].text}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Button variant="primary" size="sm" className="flex-1">
                  <Eye className="w-3.5 h-3.5 mr-1" />预览
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  <Download className="w-3.5 h-3.5 mr-1" />下载
                </Button>
                {selectedReport.pushStatus !== 'success' && (
                  <Button variant="primary" size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Send className="w-3.5 h-3.5 mr-1" />推送
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 模板编辑 Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-5 w-[520px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-100">新增报告模板</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowTemplateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">模板名称</label>
                <Input placeholder="输入模板名称" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">报告类型</label>
                  <select className="w-full px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                    {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">生成调度</label>
                  <select className="w-full px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                    <option value="manual">手动</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">模板字段（用逗号分隔）</label>
                <Input placeholder="如：变更内容,检查结果,问题列表,质量评价" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">推送渠道（多选）</label>
                <div className="flex flex-wrap gap-2">
                  {['邮件', '钉钉', '企业微信', '短信', 'Web'].map((c) => (
                    <label key={c} className="flex items-center gap-1.5 px-2 py-1 bg-[#111625] border border-[#2A354D] rounded cursor-pointer text-xs text-slate-300">
                      <input type="checkbox" className="rounded" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">订阅人员</label>
                <Input placeholder="用逗号分隔邮箱/工号" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="secondary" className="flex-1" onClick={() => setShowTemplateModal(false)}>取消</Button>
              <Button variant="primary" className="flex-1" onClick={() => setShowTemplateModal(false)}>
                <Save className="w-3.5 h-3.5 mr-1" />保存
              </Button>
            </div>
          </div>
        </div>
      )}
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

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-2.5 rounded-lg ${highlight ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#111625]'}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm mt-0.5 break-all ${highlight ? 'text-red-300' : 'text-slate-200'}`}>{value}</p>
    </div>
  );
}

export default StandardReportGen;
